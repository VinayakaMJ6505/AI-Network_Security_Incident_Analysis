"""
TDD Tests for /api/explain Route.
Validates GenAI explanation generation and field compatibility.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_explain_standalone_payload():
    payload = {
        "attack_type": "Exploits",
        "confidence": 0.94,
        "risk_score": 88,
        "severity": "HIGH",
        "source_ip": "192.168.1.45",
        "port": 22,
        "protocol": "TCP"
    }
    res = client.post("/api/explain", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "evidence" in data
    assert "potential_impact" in data
    assert "recommendations" in data
    assert isinstance(data["recommendations"], list)
    assert len(data["recommendations"]) > 0

def test_explain_with_incident_id():
    # First create an incident
    r_create = client.post("/api/analyze", json={"source_ip": "10.0.0.99", "port": 4444})
    inc_id = r_create.json()["incident_id"]

    res = client.post("/api/explain", json={"incident_id": inc_id})
    assert res.status_code == 200
    data = res.json()
    assert data["incident_id"] == inc_id
    assert "summary" in data
