"""
TDD Tests for Database Service.
Tests written FIRST (RED).
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.db_service import DatabaseService

db = DatabaseService()

SAMPLE_INC = {
    "source_ip": "192.168.1.45",
    "destination_ip": "10.0.0.10",
    "port": 22,
    "protocol": "TCP",
    "attack_type": "Exploits",
    "confidence": 0.94,
    "risk_score": 87,
    "severity": "HIGH",
    "status": "detected"
}

def test_insert_incident_returns_id():
    inc_id = db.insert_incident(dict(SAMPLE_INC))
    assert inc_id is not None
    assert isinstance(inc_id, str)
    assert len(inc_id) > 0

def test_get_incident_by_id():
    inc_id = db.insert_incident(dict(SAMPLE_INC))
    found = db.get_incident_by_id(inc_id)
    assert found is not None
    assert found.get("id") == inc_id

def test_get_incident_by_id_not_found():
    result = db.get_incident_by_id("nonexistent-id-xyz")
    assert result is None

def test_get_incidents_returns_list():
    db.insert_incident(dict(SAMPLE_INC))
    results = db.get_incidents(limit=10)
    assert isinstance(results, list)
    assert len(results) >= 1

def test_get_incidents_filter_by_severity():
    db.insert_incident({**SAMPLE_INC, "severity": "CRITICAL"})
    results = db.get_incidents(severity="CRITICAL", limit=50)
    for r in results:
        assert r.get("severity") == "CRITICAL"

def test_get_incidents_filter_by_attack_type():
    db.insert_incident({**SAMPLE_INC, "attack_type": "DoS"})
    results = db.get_incidents(attack_type="DoS", limit=50)
    for r in results:
        assert r.get("attack_type") == "DoS"

def test_count_incidents():
    count = db.count_incidents()
    assert isinstance(count, int)
    assert count >= 0

def test_insert_log_returns_id():
    log_id = db.insert_log({"raw_text": "sample log", "timestamp": "2026-09-22T10:00:00Z"})
    assert log_id is not None

def test_update_incident_explanation():
    inc_id = db.insert_incident(dict(SAMPLE_INC))
    explanation = {"incident_summary": "Test explanation", "evidence": ["item1"]}
    success = db.update_incident_explanation(inc_id, explanation)
    assert success is True
    updated = db.get_incident_by_id(inc_id)
    assert updated.get("ai_explanation") is not None

def test_insert_prediction_returns_id():
    pred_id = db.insert_prediction({"attack_type": "DoS", "confidence": 0.95})
    assert pred_id is not None
