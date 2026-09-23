"""
End-to-End Full Stack Integration Test.
Verifies complete integration between Frontend API specifications and Backend Services:
  - Machine Learning Model Inference (XGBoost 10-class UNSW-NB15)
  - NLP Log Analysis & Entity Extraction
  - Dynamic Risk Scoring (0-100) and Severity Mapping
  - Generative AI Explanation Generation
  - Database Persistence (MongoDB / Local Engine)
  - All 6 REST Endpoints used by React Frontend Views
"""
import sys
import os
import io
from fastapi.testclient import TestClient

# Add backend directory to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from main import app
from services import ml_service, nlp_service, risk_service, genai_service, db_service

client = TestClient(app)

def test_integration_system_health():
    """Verify system health, ML model readiness, and supported classes."""
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["ml_model_loaded"] is True
    assert len(data["classes_supported"]) == 10

def test_integration_live_analyzer_flow():
    """Simulates LiveAnalyzerView submitting an event and receiving full analysis."""
    event_payload = {
        "proto": "tcp",
        "service": "ssh",
        "state": "CON",
        "dur": 1.45,
        "sbytes": 12500,
        "dbytes": 1420,
        "spkts": 140,
        "dpkts": 120,
        "sload": 12000.0,
        "port": 22,
        "source_ip": "192.168.1.45",
        "destination_ip": "10.0.0.10",
        "failed_attempts": 35
    }

    res = client.post("/api/analyze", json=event_payload)
    assert res.status_code == 200
    result = res.json()

    assert result["status"] == "success"
    assert "incident_id" in result
    assert result["attack_type"] in ml_service.classes
    assert 0.0 <= result["confidence"] <= 1.0
    assert 0 <= result["risk_score"] <= 100
    assert result["severity"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    assert "probabilities" in result

    assert "ai_explanation" in result
    explanation = result["ai_explanation"]
    assert "incident_summary" in explanation or "summary" in explanation
    assert len(explanation.get("evidence", [])) > 0
    assert len(explanation.get("investigation_recommendations", [])) > 0

    inc_in_db = db_service.get_incident_by_id(result["incident_id"])
    assert inc_in_db is not None
    assert inc_in_db["port"] == 22

def test_integration_log_parser_json_flow():
    """Simulates LogParserView submitting raw text directly as JSON."""
    raw_log = (
        "2026-09-22 10:15:32 Blocked connection from 192.168.1.45 to server 10.0.0.10 "
        "using TCP port 22. User admin generated 35 failed authentication attempts."
    )
    res = client.post("/api/log/upload", json={"log": raw_log})
    assert res.status_code == 200
    data = res.json()

    assert data["success"] is True
    assert data["total_events_processed"] == 1
    assert data["extracted_entities"] is not None
    assert data["extracted_entities"]["source_ip"] == "192.168.1.45"
    assert data["extracted_entities"]["port"] == 22
    assert data["extracted_entities"]["failed_attempts"] == 35
    assert data["incident"] is not None

def test_integration_log_parser_csv_file_flow():
    """Simulates LogParserView uploading a UNSW-NB15 flow CSV file."""
    csv_data = (
        "proto,service,state,dur,spkts,dpkts,sbytes,dbytes,rate,sttl,dttl,srcip,dstip,port\n"
        "tcp,http,FIN,0.1,5,4,250,500,90,64,60,192.168.1.15,10.0.0.5,80\n"
        "tcp,ssh,CON,1.2,50,40,4000,1200,300,64,60,185.220.101.5,10.0.0.10,22\n"
    )
    files = {"file": ("unsw_sample.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")}
    res = client.post("/api/log/upload", files=files)
    assert res.status_code == 200
    data = res.json()

    assert data["success"] is True
    assert data["total_events_processed"] == 2
    assert len(data["processed_incidents"]) == 2

def test_integration_incidents_view_flow():
    """Simulates IncidentExplorerView fetching incident list and details."""
    r_create = client.post("/api/analyze", json={"source_ip": "192.168.1.45", "port": 22})
    incident_id = r_create.json()["incident_id"]

    res = client.get("/api/incidents?limit=20")
    assert res.status_code == 200
    incidents = res.json()

    assert isinstance(incidents, list)
    assert len(incidents) >= 1

    first = incidents[0]
    assert "id" in first
    assert "source_ip" in first
    assert "attack_type" in first
    assert "risk_score" in first
    assert "severity" in first
    assert "timestamp" in first

    res_single = client.get(f"/api/incidents/{incident_id}")
    assert res_single.status_code == 200
    detail = res_single.json()
    assert detail["id"] == incident_id
    assert detail["port"] == 22

def test_integration_dashboard_view_flow():
    """Simulates DashboardView fetching live SOC KPIs and chart distributions."""
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.json()

    assert data["total_events"] >= 1
    assert "overview" in data
    assert "attack_distribution" in data
    assert isinstance(data["attack_distribution"], list)

    for item in data["attack_distribution"]:
        assert "category" in item
        assert "percentage" in item
        assert "count" in item
        assert "color" in item

    assert "attack_trends" in data
    assert "top_ports" in data
    assert "top_sources" in data
    assert "recent_incidents" in data

def test_integration_genai_explain_flow():
    """Simulates GenAI explanation request from IncidentDetailsModal."""
    r_create = client.post("/api/analyze", json={"source_ip": "10.0.0.99", "port": 4444})
    incident_id = r_create.json()["incident_id"]

    res = client.post("/api/explain", json={"incident_id": incident_id})
    assert res.status_code == 200
    explanation = res.json()

    assert explanation["incident_id"] == incident_id
    assert "summary" in explanation
    assert "incident_summary" in explanation
    assert len(explanation["evidence"]) > 0
    assert len(explanation["recommendations"]) > 0
    assert "potential_impact" in explanation
    assert explanation["provider"] != ""

if __name__ == "__main__":
    print("==========================================================")
    print("RUNNING END-TO-END FULL STACK INTEGRATION VERIFICATION")
    print("==========================================================")
    test_integration_system_health()
    test_integration_live_analyzer_flow()
    test_integration_log_parser_json_flow()
    test_integration_log_parser_csv_file_flow()
    test_integration_incidents_view_flow()
    test_integration_dashboard_view_flow()
    test_integration_genai_explain_flow()
    print("\n==========================================================")
    print("ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!")
    print("==========================================================")
