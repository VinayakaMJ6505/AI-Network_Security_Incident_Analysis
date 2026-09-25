"""
Per-client rate limiter for the GenAI-backed endpoints (/api/explain,
/api/analyze, /api/log/upload). Protects against runaway LLM API cost
(Vertex AI / Groq / OpenAI are all billed per call) if the public,
unauthenticated Cloud Run endpoint gets hammered.

Algorithm (as specified): each client gets 10 GenAI calls per cycle.
The 11th call in a cycle is rejected and starts a cooldown. Cooldown
duration starts at 10s and DOUBLES every time the client breaches the
limit again after a cooldown ends (10s, 20s, 40s, 80s, ... 2560s). After
10 such breaches, instead of doubling again, the client is locked out for
24 hours; once that 24h lockout expires, the escalation count fully
resets and the client is back to a 10s cooldown on the next breach.

State is kept in-process (a plain dict, not Redis/Firestore) — acceptable
for this project's scale, but note it is NOT shared across Cloud Run
instances if --max-instances allows more than 1 concurrent instance; a
client could get a fresh limit per instance in that edge case.
"""
import os
import threading
import time
from dataclasses import dataclass, field
from typing import Dict, Optional, Tuple

from fastapi import Request, HTTPException

PROMPTS_PER_CYCLE = 10
BASE_COOLDOWN_SECONDS = 10
MAX_ESCALATIONS = 10
LOCKOUT_SECONDS = 24 * 60 * 60

# Tests share one fake client IP ("testclient") across every test module in
# the same pytest process, which would otherwise trip this limiter after
# ~10 combined GenAI-route calls across unrelated test files. conftest.py
# sets this env var before importing the app so production code (this
# module) never needs test-specific branching beyond checking one flag.
_DISABLED = os.getenv("GENAI_RATE_LIMIT_DISABLED", "").lower() in ("1", "true", "yes")


@dataclass
class _ClientState:
    count: int = 0
    escalation: int = 0
    blocked_until: Optional[float] = None


class GenAIRateLimiter:
    def __init__(self):
        self._states: Dict[str, _ClientState] = {}
        self._lock = threading.Lock()

    def check(self, client_id: str) -> Tuple[bool, Optional[float]]:
        """Returns (allowed, retry_after_seconds)."""
        now = time.time()
        with self._lock:
            st = self._states.setdefault(client_id, _ClientState())

            if st.blocked_until is not None:
                if now < st.blocked_until:
                    return False, st.blocked_until - now
                # Cooldown/lockout period just elapsed.
                if st.escalation >= MAX_ESCALATIONS:
                    # That was the 24h lockout being served -> full reset.
                    st.escalation = 0
                st.blocked_until = None
                st.count = 0

            st.count += 1
            if st.count <= PROMPTS_PER_CYCLE:
                return True, None

            # This call breaches the per-cycle cap -> trigger a cooldown.
            st.escalation = min(st.escalation + 1, MAX_ESCALATIONS)
            if st.escalation >= MAX_ESCALATIONS:
                duration = LOCKOUT_SECONDS
            else:
                duration = BASE_COOLDOWN_SECONDS * (2 ** (st.escalation - 1))
            st.blocked_until = now + duration
            return False, duration

    def reset(self):
        """Test helper — clears all tracked client state."""
        with self._lock:
            self._states.clear()


genai_rate_limiter = GenAIRateLimiter()


def _resolve_client_id(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def enforce_genai_rate_limit(request: Request):
    """FastAPI dependency — attach to any route that calls genai_service."""
    if _DISABLED:
        return
    client_id = _resolve_client_id(request)
    allowed, retry_after = genai_rate_limiter.check(client_id)
    if not allowed:
        retry_after_int = int(retry_after) + 1
        raise HTTPException(
            status_code=429,
            detail=(
                f"GenAI prompt rate limit exceeded "
                f"({PROMPTS_PER_CYCLE} prompts per cycle). "
                f"Try again in {retry_after_int} seconds."
            ),
            headers={"Retry-After": str(retry_after_int)},
        )
