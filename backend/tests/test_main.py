"""
Tests for main FastAPI application endpoints:
  - GET /
  - GET /api/health
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert data["version"] == "1.0.0"

def test_health_check_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["ml_model_loaded"] is True
    assert len(data["classes_supported"]) == 10
    assert "Normal" in data["classes_supported"]
    assert "DoS" in data["classes_supported"]
