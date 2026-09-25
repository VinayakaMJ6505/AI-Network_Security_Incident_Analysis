"""
Tests for the GenAI endpoint rate limiter (services/rate_limiter.py):
10 prompts per cycle -> 10s cooldown -> doubles each repeat breach ->
24h lockout after 10 escalations -> full reset once the 24h lockout ends.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient

from services import rate_limiter as rl


@pytest.fixture(autouse=True)
def _fresh_limiter():
    rl.genai_rate_limiter.reset()
    yield
    rl.genai_rate_limiter.reset()


class _FakeClock:
    def __init__(self, start=1_000_000.0):
        self.now = start

    def time(self):
        return self.now

    def advance(self, seconds):
        self.now += seconds


def test_first_ten_calls_allowed():
    limiter = rl.GenAIRateLimiter()
    for i in range(10):
        allowed, retry_after = limiter.check("client-a")
        assert allowed is True, f"call {i + 1} should be allowed"
        assert retry_after is None


def test_eleventh_call_blocked_with_10s_cooldown():
    limiter = rl.GenAIRateLimiter()
    for _ in range(10):
        limiter.check("client-a")
    allowed, retry_after = limiter.check("client-a")
    assert allowed is False
    assert retry_after == pytest.approx(rl.BASE_COOLDOWN_SECONDS, abs=0.01)


def test_cooldown_expires_and_cycle_resets(monkeypatch):
    clock = _FakeClock()
    monkeypatch.setattr(rl.time, "time", clock.time)

    limiter = rl.GenAIRateLimiter()
    for _ in range(11):  # 10 allowed + 1 breach -> 10s cooldown starts
        limiter.check("client-a")

    # Still within the 10s cooldown -> blocked.
    allowed, _ = limiter.check("client-a")
    assert allowed is False

    clock.advance(rl.BASE_COOLDOWN_SECONDS + 0.1)

    # Cooldown has elapsed -> fresh cycle of 10 allowed again.
    for i in range(10):
        allowed, retry_after = limiter.check("client-a")
        assert allowed is True, f"post-cooldown call {i + 1} should be allowed"


def test_repeated_breaches_double_the_cooldown(monkeypatch):
    clock = _FakeClock()
    monkeypatch.setattr(rl.time, "time", clock.time)
    limiter = rl.GenAIRateLimiter()

    expected_durations = [
        rl.BASE_COOLDOWN_SECONDS * (2 ** i) for i in range(rl.MAX_ESCALATIONS - 1)
    ]

    for expected in expected_durations:
        for _ in range(rl.PROMPTS_PER_CYCLE):
            limiter.check("client-a")
        allowed, retry_after = limiter.check("client-a")
        assert allowed is False
        assert retry_after == pytest.approx(expected, abs=0.01)
        clock.advance(expected + 0.1)


def test_tenth_escalation_triggers_24h_lockout_then_resets(monkeypatch):
    clock = _FakeClock()
    monkeypatch.setattr(rl.time, "time", clock.time)
    limiter = rl.GenAIRateLimiter()

    # Drive the client through escalations 1..9 (doubling cooldowns).
    for i in range(rl.MAX_ESCALATIONS - 1):
        for _ in range(rl.PROMPTS_PER_CYCLE):
            limiter.check("client-a")
        allowed, retry_after = limiter.check("client-a")
        assert allowed is False
        clock.advance(retry_after + 0.1)

    # 10th escalation -> 24h lockout instead of continuing to double.
    for _ in range(rl.PROMPTS_PER_CYCLE):
        limiter.check("client-a")
    allowed, retry_after = limiter.check("client-a")
    assert allowed is False
    assert retry_after == pytest.approx(rl.LOCKOUT_SECONDS, abs=0.01)

    # Still locked out well before 24h.
    clock.advance(rl.LOCKOUT_SECONDS / 2)
    allowed, _ = limiter.check("client-a")
    assert allowed is False

    # 24h passes -> full reset: next breach is back to a 10s cooldown.
    clock.advance(rl.LOCKOUT_SECONDS / 2 + 1)
    for _ in range(rl.PROMPTS_PER_CYCLE):
        allowed, _ = limiter.check("client-a")
        assert allowed is True
    allowed, retry_after = limiter.check("client-a")
    assert allowed is False
    assert retry_after == pytest.approx(rl.BASE_COOLDOWN_SECONDS, abs=0.01)


def test_clients_are_tracked_independently():
    limiter = rl.GenAIRateLimiter()
    for _ in range(10):
        limiter.check("client-a")
    allowed_a, _ = limiter.check("client-a")
    allowed_b, _ = limiter.check("client-b")
    assert allowed_a is False
    assert allowed_b is True


def test_resolve_client_id_prefers_forwarded_for():
    class _FakeClient:
        host = "10.0.0.1"

    class _FakeRequest:
        headers = {"x-forwarded-for": "203.0.113.5, 10.0.0.1"}
        client = _FakeClient()

    assert rl._resolve_client_id(_FakeRequest()) == "203.0.113.5"


def test_resolve_client_id_falls_back_to_request_client():
    class _FakeClient:
        host = "10.0.0.1"

    class _FakeRequest:
        headers = {}
        client = _FakeClient()

    assert rl._resolve_client_id(_FakeRequest()) == "10.0.0.1"


def test_explain_route_enforces_limit_end_to_end(monkeypatch):
    """Integration check: with the limiter actually enabled (tests normally
    run with GENAI_RATE_LIMIT_DISABLED=1, see conftest.py), the 11th call
    to a GenAI route within one cycle gets a real 429."""
    monkeypatch.setattr(rl, "_DISABLED", False)

    from main import app
    client = TestClient(app)

    payload = {"attack_type": "DoS", "risk_score": 80, "severity": "HIGH"}

    statuses = [client.post("/api/explain", json=payload).status_code for _ in range(10)]
    assert all(s != 429 for s in statuses)

    blocked = client.post("/api/explain", json=payload)
    assert blocked.status_code == 429
    assert "Retry-After" in blocked.headers
