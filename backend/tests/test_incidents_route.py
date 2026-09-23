"""
TDD Tests for /api/incidents Route.
Validates list returns for frontend integration and ID lookup.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_incidents_returns_array():
    res = client.get("/api/incidents")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)

def test_get_incident_by_id_found_or_not_found():
    res_list = client.get("/api/incidents")
    data = res_list.json()
    if len(data) > 0:
        first_id = data[0]["id"]
        res_single = client.get(f"/api/incidents/{first_id}")
        assert res_single.status_code == 200
        assert res_single.json()["id"] == first_id

    res_404 = client.get("/api/incidents/nonexistent-id-999")
    assert res_404.status_code == 404
