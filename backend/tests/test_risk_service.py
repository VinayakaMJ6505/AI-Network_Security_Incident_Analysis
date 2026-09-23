"""
TDD Tests for Risk Scoring Service.
Tests written FIRST (RED).
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.risk_service import RiskService

rs = RiskService()

def test_normal_traffic_low_risk():
    score, severity = rs.calculate_risk_score("Normal", confidence=0.97)
    assert score <= 30
    assert severity == "LOW"

def test_dos_attack_high_risk():
    score, severity = rs.calculate_risk_score("DoS", confidence=0.95)
    assert score >= 61
    assert severity in ("HIGH", "CRITICAL")

def test_shellcode_critical():
    score, severity = rs.calculate_risk_score("Shellcode", confidence=0.98)
    assert score >= 81
    assert severity == "CRITICAL"

def test_exploits_high_risk():
    score, severity = rs.calculate_risk_score("Exploits", confidence=0.90)
    assert score >= 61

def test_fuzzers_medium_or_high():
    score, severity = rs.calculate_risk_score("Fuzzers", confidence=0.85)
    assert score >= 31

def test_failed_attempts_elevates_score():
    score_no_attempts, _ = rs.calculate_risk_score("Exploits", confidence=0.90, failed_attempts=0)
    score_with_attempts, _ = rs.calculate_risk_score("Exploits", confidence=0.90, failed_attempts=20)
    assert score_with_attempts >= score_no_attempts

def test_critical_port_elevates_score():
    score_normal_port, _ = rs.calculate_risk_score("Reconnaissance", confidence=0.85, port=80)
    score_ssh_port, _ = rs.calculate_risk_score("Reconnaissance", confidence=0.85, port=22)
    assert score_ssh_port >= score_normal_port

def test_risk_score_clamped_0_100():
    for attack in ["Normal", "DoS", "Worms", "Shellcode", "Generic"]:
        score, _ = rs.calculate_risk_score(attack, confidence=0.99, failed_attempts=50, port=22)
        assert 0 <= score <= 100

def test_severity_mapping():
    assert rs.calculate_risk_score("Normal", confidence=0.99)[1] == "LOW"
    score, sev = rs.calculate_risk_score("DoS", confidence=0.99, port=22, failed_attempts=25)
    assert sev in ("HIGH", "CRITICAL")

def test_keyword_boost():
    score_no_kw, _ = rs.calculate_risk_score("Analysis", confidence=0.80, keywords_matched=[])
    score_with_kw, _ = rs.calculate_risk_score("Analysis", confidence=0.80, keywords_matched=["brute force", "sql injection", "buffer overflow"])
    assert score_with_kw >= score_no_kw
