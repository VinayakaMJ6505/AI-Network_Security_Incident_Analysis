"""
TDD Tests for /api/dashboard Route.
Validates fields needed for React DashboardView and charts.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_dashboard_endpoint_structure():
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.json()

    # Core summary KPIs
    assert "total_events" in data
    assert "detected_attacks" in data
    assert "high_risk_incidents" in data
    assert "critical_incidents" in data
    assert "overview" in data

    # Charts
    assert "attack_distribution" in data
    assert isinstance(data["attack_distribution"], list)
    if len(data["attack_distribution"]) > 0:
        item = data["attack_distribution"][0]
        assert "category" in item
        assert "percentage" in item
        assert "count" in item

    assert "attack_trends" in data
    assert isinstance(data["attack_trends"], list)
    if len(data["attack_trends"]) > 0:
        t_item = data["attack_trends"][0]
        assert "normal" in t_item
        assert "attack" in t_item

    assert "recent_incidents" in data
    assert "top_ports" in data
    assert "top_sources" in data
