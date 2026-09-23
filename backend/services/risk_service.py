"""
Risk & Severity Assessment Service.
Calculates a transparent 0-100 risk score and maps to severity levels:
0  - 30  : LOW
31 - 60  : MEDIUM
61 - 80  : HIGH
81 - 100 : CRITICAL
"""
from typing import Tuple, Dict, Any, Optional

# Baseline severity points per attack category (0 - 80)
ATTACK_BASE_SCORES = {
    "Normal": 5,
    "Generic": 45,
    "Analysis": 50,
    "Fuzzers": 55,
    "Reconnaissance": 60,
    "DoS": 75,
    "Exploits": 85,
    "Backdoor": 90,
    "Shellcode": 95,
    "Worms": 95,
    "Brute Force": 80
}

# Critical server ports that elevate risk
CRITICAL_PORTS = {
    22: 15,   # SSH
    3389: 15, # RDP
    445: 20,  # SMB
    1433: 15, # MSSQL
    3306: 15, # MySQL
    5432: 15, # PostgreSQL
    21: 10,   # FTP
    23: 15    # Telnet
}

class RiskService:
    @staticmethod
    def calculate_risk_score(
        attack_type: str,
        confidence: float,
        failed_attempts: int = 0,
        port: Optional[int] = None,
        keywords_matched: Optional[list] = None
    ) -> Tuple[int, str]:
        """
        Calculates an explainable risk score (0-100) and corresponding severity.
        """
        if attack_type.lower() == "normal":
            # Very low baseline for benign network traffic
            score = int(min(20, (1.0 - confidence) * 30))
            return max(0, score), "LOW"

        # 1. Base Score from Attack Category
        base = ATTACK_BASE_SCORES.get(attack_type, 65)

        # 2. Confidence Factor (+- 10 points)
        conf_modifier = (confidence - 0.7) * 20  # e.g. 0.95 conf gives +5 points

        # 3. Repeated Failed Authentication Anomaly
        failed_modifier = 0
        if failed_attempts > 0:
            if failed_attempts >= 20:
                failed_modifier = 15
            elif failed_attempts >= 5:
                failed_modifier = 10
            else:
                failed_modifier = 5

        # 4. Critical Target Port Bonus
        port_modifier = 0
        if port and int(port) in CRITICAL_PORTS:
            port_modifier = CRITICAL_PORTS[int(port)]

        # 5. Dangerous Keyword Multiplier
        keyword_modifier = 0
        if keywords_matched and len(keywords_matched) > 0:
            keyword_modifier = min(10, len(keywords_matched) * 4)

        # Total combined score
        raw_score = base + conf_modifier + failed_modifier + (port_modifier * 0.5) + keyword_modifier

        # Clamp between 10 and 100 for attacks
        final_score = int(round(min(100, max(10, raw_score))))

        # Map to Severity levels per README.md
        if final_score <= 30:
            severity = "LOW"
        elif final_score <= 60:
            severity = "MEDIUM"
        elif final_score <= 80:
            severity = "HIGH"
        else:
            severity = "CRITICAL"

        return final_score, severity

# Singleton instance
risk_service = RiskService()
