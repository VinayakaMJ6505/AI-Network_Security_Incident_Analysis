"""
TDD Tests for /api/analyze Route.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_analyze_unstructured_log_success():
    log = (
        "2026-09-22 10:15:32 Blocked connection from 192.168.1.45 to server 10.0.0.10 "
        "using TCP port 22. User admin generated 35 failed authentication attempts."
    )
    res = client.post("/api/analyze", json={"log_text": log})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert "incident_id" in data
    assert data["extracted_entities"]["source_ip"] == "192.168.1.45"
    assert data["extracted_entities"]["port"] == 22
    assert data["extracted_entities"]["failed_attempts"] == 35
    assert "ai_explanation" in data
    assert data["ai_explanation"] is not None

def test_analyze_structured_event_success():
    payload = {
        "source_ip": "10.0.0.50",
        "destination_ip": "192.168.1.1",
        "destination_port": 80,
        "proto": "tcp",
        "service": "http",
        "dur": 0.05,
        "spkts": 10,
        "dpkts": 10,
        "sbytes": 500,
        "dbytes": 1000
    }
    res = client.post("/api/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "attack_type" in data
    assert "confidence" in data
    assert "risk_score" in data
    assert "severity" in data

def test_analyze_empty_payload():
    res = client.post("/api/analyze", json={})
    assert res.status_code == 200
    data = res.json()
    assert "incident_id" in data
