"""
Comprehensive Backend Test Suite.
Tests all endpoints using FastAPI TestClient:
  1. GET / and GET /api/health
  2. POST /api/analyze (Unstructured log & structured features)
  3. POST /api/log/upload (TXT log and CSV files)
  4. GET /api/incidents and GET /api/incidents/{id}
  5. GET /api/dashboard
  6. POST /api/explain
"""
import os
import sys
import io
from fastapi.testclient import TestClient

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app

client = TestClient(app)

def test_health_endpoints():
    print("\n--- Testing Health Endpoints ---")
    r_root = client.get("/")
    assert r_root.status_code == 200
    assert r_root.json()["status"] == "online"
    print("[PASS] GET / passed:", r_root.json())

    r_health = client.get("/api/health")
    assert r_health.status_code == 200
    data = r_health.json()
    assert data["status"] == "healthy"
    print(f"[PASS] GET /api/health passed: ML loaded={data['ml_model_loaded']}, Mode={data['storage_mode']}")

def test_analyze_unstructured_log():
    print("\n--- Testing POST /api/analyze (Unstructured Log) ---")
    sample_log = (
        "2026-09-22 10:15:32 Blocked connection from 192.168.1.45 to server 10.0.0.10 "
        "using TCP port 22. User admin generated 35 failed authentication attempts."
    )
    payload = {"log_text": sample_log}
    r = client.post("/api/analyze", json=payload)
    assert r.status_code == 200, r.text
    res = r.json()
    assert "incident_id" in res
    assert "attack_type" in res
    assert "risk_score" in res
    assert "severity" in res
    assert res["extracted_entities"]["source_ip"] == "192.168.1.45"
    assert res["extracted_entities"]["port"] == 22
    assert res["extracted_entities"]["failed_attempts"] == 35
    print(f"[PASS] POST /api/analyze (Log) passed: Attack={res['attack_type']}, Risk={res['risk_score']}, Severity={res['severity']}")
    return res["incident_id"]

def test_analyze_structured_features():
    print("\n--- Testing POST /api/analyze (Structured Features) ---")
    payload = {
        "source_ip": "172.16.0.5",
        "destination_ip": "10.0.0.25",
        "destination_port": 80,
        "proto": "tcp",
        "service": "http",
        "state": "FIN",
        "dur": 0.05,
        "spkts": 10,
        "dpkts": 8,
        "sbytes": 500,
        "dbytes": 1200,
        "rate": 350.0
    }
    r = client.post("/api/analyze", json=payload)
    assert r.status_code == 200, r.text
    res = r.json()
    assert "incident_id" in res
    assert "probabilities" in res
    print(f"[PASS] POST /api/analyze (Features) passed: Attack={res['attack_type']}, Confidence={res['confidence']}")

def test_log_upload():
    print("\n--- Testing POST /api/log/upload ---")
    # Test raw text log upload
    log_content = (
        "2026-09-22 11:00:00 Alert connection from 10.1.1.20 to 192.168.1.5 port 80 failed password\n"
        "2026-09-22 11:05:00 Blocked connection from 185.220.101.5 to 192.168.1.1 port 22 failed attempts: 12\n"
    )
    files = {"file": ("test.log", io.BytesIO(log_content.encode("utf-8")), "text/plain")}
    r_log = client.post("/api/log/upload", files=files)
    assert r_log.status_code == 200, r_log.text
    res_log = r_log.json()
    assert res_log["total_events_processed"] == 2
    print(f"[PASS] POST /api/log/upload (.log) passed: Events={res_log['total_events_processed']}, Attacks={res_log['detected_attacks']}")

    # Test CSV upload
    csv_content = (
        "proto,service,state,dur,spkts,dpkts,sbytes,dbytes,rate,sttl,dttl,srcip,dstip,port\n"
        "tcp,http,FIN,0.1,5,4,250,500,90,64,60,192.168.1.15,10.0.0.5,80\n"
        "udp,dns,CON,0.01,2,2,120,180,400,64,60,192.168.1.20,10.0.0.1,53\n"
    )
    csv_files = {"file": ("sample.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
    r_csv = client.post("/api/log/upload", files=csv_files)
    assert r_csv.status_code == 200, r_csv.text
    res_csv = r_csv.json()
    assert res_csv["total_events_processed"] == 2
    print(f"[PASS] POST /api/log/upload (.csv) passed: Events={res_csv['total_events_processed']}, Attacks={res_csv['detected_attacks']}")

def test_incidents(incident_id: str):
    print("\n--- Testing Incidents Endpoints ---")
    # List incidents
    r_list = client.get("/api/incidents?limit=10")
    assert r_list.status_code == 200
    res_list = r_list.json()
    assert isinstance(res_list, list)
    assert len(res_list) >= 1
    print(f"[PASS] GET /api/incidents passed: Total incidents returned={len(res_list)}")

    # Single incident details
    r_single = client.get(f"/api/incidents/{incident_id}")
    assert r_single.status_code == 200
    res_single = r_single.json()
    assert res_single["id"] == incident_id
    assert res_single["port"] == 22
    print(f"[PASS] GET /api/incidents/{incident_id} passed: Target port={res_single['port']}, Severity={res_single['severity']}")

def test_dashboard():
    print("\n--- Testing Dashboard Endpoint ---")
    r = client.get("/api/dashboard")
    assert r.status_code == 200
    stats = r.json()
    assert "overview" in stats
    assert "attack_distribution" in stats
    assert "attack_trends" in stats
    assert "recent_incidents" in stats
    assert "top_ports" in stats
    print(f"[PASS] GET /api/dashboard passed: Overview total={stats['overview']['total_events']}, Categories={len(stats['attack_distribution'])}")

def test_explain(incident_id: str):
    print("\n--- Testing Explain Endpoint ---")
    # Explain by incident_id
    payload_id = {"incident_id": incident_id}
    r_id = client.post("/api/explain", json=payload_id)
    assert r_id.status_code == 200
    res_id = r_id.json()
    assert "summary" in res_id or "incident_summary" in res_id
    assert len(res_id["evidence"]) > 0
    assert "potential_impact" in res_id
    assert len(res_id["recommendations"]) > 0
    print(f"[PASS] POST /api/explain (by ID) passed: Provider={res_id['provider']}")

    # Explain by standalone payload
    payload_raw = {
        "attack_type": "DoS",
        "confidence": 0.94,
        "risk_score": 85,
        "severity": "CRITICAL",
        "source_ip": "198.51.100.2",
        "destination_port": 80,
        "protocol": "TCP"
    }
    r_raw = client.post("/api/explain", json=payload_raw)
    assert r_raw.status_code == 200
    res_raw = r_raw.json()
    assert res_raw["attack_type"] == "DoS"
    print(f"[PASS] POST /api/explain (Standalone) passed: Summary snippet='{res_raw['summary'][:60]}...'")

if __name__ == "__main__":
    print("====================================================")
    print("RUNNING BACKEND TEST SUITE")
    print("====================================================")
    test_health_endpoints()
    inc_id = test_analyze_unstructured_log()
    test_analyze_structured_features()
    test_log_upload()
    test_incidents(inc_id)
    test_dashboard()
    test_explain(inc_id)
    print("\n====================================================")
    print("ALL BACKEND TESTS PASSED SUCCESSFULLY! (6/6 ENDPOINTS)")
    print("====================================================")
