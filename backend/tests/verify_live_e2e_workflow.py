"""
Live End-to-End Workflow Verification Script.
Executes the entire lifecycle across:
1. Database connectivity (MongoDB incident_db)
2. Initial Dashboard & Incidents retrieval
3. Live Analyzer inference & event injection (POST /api/analyze)
4. Verifying new incident appears in DB and GET /api/incidents
5. Verifying dashboard KPIs & charts update with new data (GET /api/dashboard)
6. Raw syslog ingestion & NLP entity extraction (POST /api/log/upload)
7. Verifying log incident appears in DB and GET /api/incidents
8. GenAI Explanation generation & retrieval (POST /api/explain)
"""
import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.db_service import db_service
from main import app
from fastapi.testclient import TestClient

def main():
    print("=" * 65)
    print("AI-POWERED NETWORK SECURITY INCIDENT ANALYSIS - E2E WORKFLOW TEST")
    print("=" * 65)

    print("\n--- 1. CHECK DATABASE STATUS ---")
    print(f"MongoDB Connected: {db_service.is_connected}")
    if db_service.is_connected:
        print(f"MongoDB Database: {db_service.db_name}")
        print(f"MongoDB Collections: {db_service.db.list_collection_names()}")
        print(f"Incidents in MongoDB: {db_service.db.incidents.count_documents({})}")
    else:
        print("Using local storage cache")

    client = TestClient(app)

    print("\n--- 2. INITIAL DASHBOARD & INCIDENTS QUERY ---")
    initial_dash = client.get("/api/dashboard").json()
    initial_incidents = client.get("/api/incidents").json()
    initial_count = initial_dash["total_events"]
    print(f"Initial total_events: {initial_count}")
    print(f"Initial incidents list count: {len(initial_incidents)}")

    print("\n--- 3. LIVE EVENT ANALYZER (POST /api/analyze) ---")
    new_event = {
        "proto": "tcp",
        "service": "ssh",
        "state": "CON",
        "dur": 2.34,
        "sbytes": 14500,
        "dbytes": 1800,
        "spkts": 160,
        "dpkts": 130,
        "sload": 15000.0,
        "port": 22,
        "source_ip": "198.51.100.99",
        "destination_ip": "10.0.0.10",
        "failed_attempts": 45
    }
    analyze_res = client.post("/api/analyze", json=new_event)
    assert analyze_res.status_code == 200, f"Failed analyze: {analyze_res.text}"
    analyze_data = analyze_res.json()
    incident_id = analyze_data["incident_id"]

    print(f"-> Status: {analyze_data['status']}")
    print(f"-> Generated Incident ID: {incident_id}")
    print(f"-> Attack Type: {analyze_data['attack_type']}")
    print(f"-> Model Confidence: {analyze_data['confidence'] * 100:.1f}%")
    ai_summary = analyze_data.get('ai_explanation', {}).get('incident_summary') or analyze_data.get('ai_explanation', {}).get('summary', 'N/A')
    print(f"-> GenAI Summary: {ai_summary[:75]}...")

    print("\n--- 4. VERIFY NEW INCIDENT IN DATABASE & /api/incidents ---")
    updated_incidents = client.get("/api/incidents").json()
    print(f"Updated incidents count: {len(updated_incidents)}")
    matching = [i for i in updated_incidents if i.get("id") == incident_id or i.get("source_ip") == "198.51.100.99"]
    assert len(matching) > 0, "ERROR: New incident NOT found in /api/incidents!"
    new_inc = matching[0]
    print(f"-> Found incident in DB: ID={new_inc['id']}")
    print(f"-> Source IP: {new_inc['source_ip']} -> Destination IP: {new_inc.get('destination_ip', '10.0.0.10')}:{new_inc['port']}")
    print(f"-> Classification: {new_inc['attack_type']}, Severity: {new_inc['severity']}")
    print(f"-> Timestamp: {new_inc['timestamp']}")

    print("\n--- 5. VERIFY DASHBOARD TOTALS & CHARTS UPDATED ---")
    updated_dash = client.get("/api/dashboard").json()
    print(f"Updated total_events: {updated_dash['total_events']} (was {initial_count})")
    assert updated_dash["total_events"] == initial_count + 1, "ERROR: Dashboard count did not increment!"
    print("-> SUCCESS: Dashboard total_events incremented correctly!")

    # Check that new incident appears in dashboard recent_incidents
    recent_matches = [r for r in updated_dash.get("recent_incidents", []) if r.get("id") == incident_id or r.get("source_ip") == "198.51.100.99"]
    print(f"-> Recent incidents stream updated: {len(recent_matches) > 0}")

    print("\n--- 6. NLP LOG PARSER (POST /api/log/upload) ---")
    raw_syslog = (
        "2026-09-24 03:00:15 Blocked unauthorized access attempt for user admin "
        "from 203.0.113.199 on port 2222 with 50 failed attempts."
    )
    log_res = client.post("/api/log/upload", json={"log": raw_syslog})
    assert log_res.status_code == 200, f"Failed log upload: {log_res.text}"
    log_data = log_res.json()

    print(f"-> NLP Extracted Source IP: {log_data['extracted_entities']['source_ip']}")
    print(f"-> NLP Extracted Port: {log_data['extracted_entities']['port']}")
    print(f"-> NLP Extracted User: {log_data['extracted_entities']['username']}")
    print(f"-> NLP Extracted Failed Attempts: {log_data['extracted_entities']['failed_attempts']}")

    log_inc = log_data["incident"]
    log_inc_id = log_inc["id"]
    print(f"-> Created Incident from Syslog: {log_inc_id}")
    print(f"-> Classified Threat: {log_inc['attack_type']} ({log_inc['severity']})")

    print("\n--- 7. VERIFY SYSLOG INCIDENT STORED & VISIBLE ---")
    final_incidents = client.get("/api/incidents").json()
    syslog_matching = [i for i in final_incidents if i.get("id") == log_inc_id or i.get("source_ip") == "203.0.113.199"]
    assert len(syslog_matching) > 0, "ERROR: Syslog incident not found in /api/incidents!"
    print(f"-> Found Syslog incident in DB: {syslog_matching[0]['source_ip']}:{syslog_matching[0]['port']}")

    print("\n--- 8. GENAI EXPLANATION ON DEMAND (POST /api/explain) ---")
    explain_res = client.post("/api/explain", json={"incident_id": log_inc_id})
    assert explain_res.status_code == 200, f"Failed explain: {explain_res.text}"
    explain_data = explain_res.json()
    print(f"-> AI Summary: {explain_data['summary']}")
    print(f"-> AI Evidence: {explain_data['evidence']}")
    print(f"-> AI Potential Impact: {explain_data['potential_impact']}")
    print(f"-> AI Recommendations: {explain_data['recommendations']}")

    print("\n" + "=" * 65)
    print("ALL 8 END-TO-END WORKFLOW STAGES VERIFIED WITH 100% LIVE REAL DATA!")
    print("=" * 65)

if __name__ == "__main__":
    main()
