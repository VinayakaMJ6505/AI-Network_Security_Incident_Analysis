"""
Comprehensive MongoDB Integration Test and Verification Script.
Tests all FastAPI endpoints against live MongoDB on localhost:27017, database: incident_db.
"""
import pytest
import os
import sys

# Ensure backend directory is in path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app
from services import db_service

client = TestClient(app)

def test_mongodb_connection_status():
    """Verify that db_service connects to live MongoDB and incident_db."""
    assert db_service.is_connected is True, "DatabaseService must be connected to live MongoDB."
    assert db_service.db_name == "incident_db", f"Expected db_name 'incident_db', got {db_service.db_name}"
    assert db_service.db is not None, "MongoDB database instance must not be None."

def test_health_endpoint_surfaces_mongodb():
    """Verify GET /api/health returns database_connected: True and storage_mode: MongoDB."""
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True
    assert data["storage_mode"] == "MongoDB"

def test_mongodb_analyze_persists_incident():
    """Verify POST /api/analyze creates an incident and prediction in MongoDB."""
    payload = {
        "source_ip": "192.168.1.105",
        "destination_ip": "10.0.0.50",
        "port": 445,
        "proto": "tcp",
        "dur": 0.45,
        "sbytes": 5420,
        "dbytes": 12890,
        "sttl": 64,
        "dttl": 252,
        "state": "CON",
        "log_text": "SMB connection attempt detected with unusual payload from 192.168.1.105:445"
    }
    resp = client.post("/api/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    incident_id = data["incident_id"]
    assert incident_id.startswith("inc-")
    
    # Query MongoDB directly to verify persistence
    mongo_doc = db_service.db.incidents.find_one({"_id": incident_id})
    assert mongo_doc is not None, f"Document with _id {incident_id} not found in MongoDB incidents collection"
    assert mongo_doc["source_ip"] == "192.168.1.105"
    assert mongo_doc["port"] == 445
    assert mongo_doc["attack_type"] == data["attack_type"]

def test_mongodb_log_upload_persists_incident():
    """Verify POST /api/log/upload persists records directly to MongoDB."""
    payload = {
        "log": "Failed password for root from 203.0.113.195 port 22 ssh2",
        "entities": {
            "source_ip": "203.0.113.195",
            "port": 22,
            "protocol": "TCP",
            "failed_attempts": 5
        }
    }
    resp = client.post("/api/log/upload", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["incident"] is not None
    inc_id = data["incident"]["id"]

    # Verify in MongoDB
    mongo_doc = db_service.db.incidents.find_one({"_id": inc_id})
    assert mongo_doc is not None
    assert mongo_doc["source_ip"] == "203.0.113.195"
    assert mongo_doc["port"] == 22

def test_mongodb_incidents_listing():
    """Verify GET /api/incidents returns incidents from MongoDB."""
    resp = client.get("/api/incidents?limit=20")
    assert resp.status_code == 200
    incidents = resp.json()
    assert isinstance(incidents, list)
    assert len(incidents) >= 2
    # Verify field schema compatibility with frontend
    first = incidents[0]
    for key in ["id", "source_ip", "destination_ip", "port", "attack_type", "risk_score", "severity"]:
        assert key in first

def test_mongodb_incident_by_id():
    """Verify GET /api/incidents/{id} fetches specific record from MongoDB."""
    # Fetch first incident from list
    list_resp = client.get("/api/incidents?limit=1")
    assert list_resp.status_code == 200
    incidents = list_resp.json()
    assert len(incidents) > 0
    target_id = incidents[0]["id"]

    resp = client.get(f"/api/incidents/{target_id}")
    assert resp.status_code == 200
    detail = resp.json()
    assert detail["id"] == target_id
    assert "source_ip" in detail

def test_mongodb_explain_updates_incident():
    """Verify POST /api/explain updates incident with AI explanation in MongoDB."""
    list_resp = client.get("/api/incidents?limit=1")
    target_id = list_resp.json()[0]["id"]

    resp = client.post("/api/explain", json={"incident_id": target_id})
    assert resp.status_code == 200
    exp = resp.json()
    assert "summary" in exp
    assert "recommendations" in exp

    # Check MongoDB document was updated
    updated_doc = db_service.db.incidents.find_one({"_id": target_id})
    assert updated_doc is not None
    assert "ai_explanation" in updated_doc
    assert updated_doc["ai_explanation"] is not None

def test_mongodb_dashboard_metrics():
    """Verify GET /api/dashboard compiles stats from MongoDB collection."""
    resp = client.get("/api/dashboard")
    assert resp.status_code == 200
    dash = resp.json()
    assert dash["total_events"] >= 2
    assert dash["detected_attacks"] >= 1
    assert "attack_distribution" in dash
    assert len(dash["attack_distribution"]) > 0
    assert "recent_incidents" in dash
    assert len(dash["recent_incidents"]) > 0

if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING LIVE MONGODB INTEGRATION TEST SUITE")
    print("Database: incident_db | Host: localhost:27017")
    print("=" * 60)
    
    test_mongodb_connection_status()
    print("[PASS] MongoDB Connection & Database Name (incident_db)")
    
    test_health_endpoint_surfaces_mongodb()
    print("[PASS] Health Endpoint Surfaces MongoDB Storage Mode")
    
    test_mongodb_analyze_persists_incident()
    print("[PASS] Live Analyzer Persists Incident & Predictions to MongoDB")
    
    test_mongodb_log_upload_persists_incident()
    print("[PASS] Log Parser Persists Incidents to MongoDB")
    
    test_mongodb_incidents_listing()
    print("[PASS] Incidents Listing Fetches Live from MongoDB")
    
    test_mongodb_incident_by_id()
    print("[PASS] Incident Lookup by ID from MongoDB")
    
    test_mongodb_explain_updates_incident()
    print("[PASS] GenAI Explain Updates Incident Document in MongoDB")
    
    test_mongodb_dashboard_metrics()
    print("[PASS] Dashboard Metrics Aggregated from Live MongoDB")
    
    print("=" * 60)
    print("ALL MONGODB ENDPOINT & PERSISTENCE TESTS PASSED 100%!")
    print("=" * 60)
