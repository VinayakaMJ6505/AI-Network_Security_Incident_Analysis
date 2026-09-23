"""
Seed Script to populate MongoDB (incident_db) with initial realistic SOC incidents.
"""
import os
import sys
from datetime import datetime, timedelta

# Ensure backend directory is in path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services import db_service, genai_service

SAMPLE_INCIDENTS = [
    {
        "id": "inc-soc-001",
        "source_ip": "192.168.1.105",
        "destination_ip": "10.0.0.50",
        "port": 445,
        "protocol": "TCP",
        "service": "SMB",
        "state": "CON",
        "attack_type": "Exploits",
        "is_attack": True,
        "confidence": 0.98,
        "risk_score": 95,
        "severity": "CRITICAL",
        "timestamp": (datetime.utcnow() - timedelta(minutes=12)).isoformat() + "Z",
        "username": "admin",
        "failed_attempts": 3,
        "status": "detected",
        "raw_log": "SMB remote code execution probe (EternalBlue pattern) from 192.168.1.105 targeting port 445",
        "extracted_entities": {
            "source_ip": "192.168.1.105",
            "destination_ip": "10.0.0.50",
            "port": 445,
            "protocol": "TCP",
            "keywords_matched": ["exploit", "smb", "overflow"]
        }
    },
    {
        "id": "inc-soc-002",
        "source_ip": "45.33.32.156",
        "destination_ip": "10.0.0.1",
        "port": 80,
        "protocol": "TCP",
        "service": "HTTP",
        "state": "FIN",
        "attack_type": "DoS",
        "is_attack": True,
        "confidence": 0.94,
        "risk_score": 85,
        "severity": "HIGH",
        "timestamp": (datetime.utcnow() - timedelta(minutes=25)).isoformat() + "Z",
        "username": None,
        "failed_attempts": 0,
        "status": "detected",
        "raw_log": "High-volume HTTP SYN flood exceeding 10,000 pps from external host 45.33.32.156",
        "extracted_entities": {
            "source_ip": "45.33.32.156",
            "destination_ip": "10.0.0.1",
            "port": 80,
            "protocol": "TCP",
            "keywords_matched": ["flood", "dos", "syn"]
        }
    },
    {
        "id": "inc-soc-003",
        "source_ip": "198.51.100.42",
        "destination_ip": "10.0.0.25",
        "port": 22,
        "protocol": "TCP",
        "service": "SSH",
        "state": "REQ",
        "attack_type": "Reconnaissance",
        "is_attack": True,
        "confidence": 0.91,
        "risk_score": 75,
        "severity": "HIGH",
        "timestamp": (datetime.utcnow() - timedelta(minutes=48)).isoformat() + "Z",
        "username": "root",
        "failed_attempts": 14,
        "status": "investigating",
        "raw_log": "Repeated SSH authentication failures for user 'root' from 198.51.100.42 (14 attempts)",
        "extracted_entities": {
            "source_ip": "198.51.100.42",
            "destination_ip": "10.0.0.25",
            "port": 22,
            "protocol": "TCP",
            "failed_attempts": 14,
            "username": "root",
            "keywords_matched": ["failed", "password", "brute-force"]
        }
    },
    {
        "id": "inc-soc-004",
        "source_ip": "172.16.4.88",
        "destination_ip": "10.0.0.10",
        "port": 8080,
        "protocol": "TCP",
        "service": "HTTP_PROXY",
        "state": "CON",
        "attack_type": "Fuzzers",
        "is_attack": True,
        "confidence": 0.88,
        "risk_score": 68,
        "severity": "MEDIUM",
        "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat() + "Z",
        "username": None,
        "failed_attempts": 0,
        "status": "detected",
        "raw_log": "Malformed URI fuzzing string '%00%ff' detected against web API endpoint :8080",
        "extracted_entities": {
            "source_ip": "172.16.4.88",
            "destination_ip": "10.0.0.10",
            "port": 8080,
            "protocol": "TCP",
            "keywords_matched": ["fuzz", "malformed"]
        }
    },
    {
        "id": "inc-soc-005",
        "source_ip": "185.220.101.5",
        "destination_ip": "10.0.0.40",
        "port": 3389,
        "protocol": "TCP",
        "service": "RDP",
        "state": "CON",
        "attack_type": "Backdoor",
        "is_attack": True,
        "confidence": 0.96,
        "risk_score": 92,
        "severity": "CRITICAL",
        "timestamp": (datetime.utcnow() - timedelta(hours=3, minutes=15)).isoformat() + "Z",
        "username": "administrator",
        "failed_attempts": 8,
        "status": "contained",
        "raw_log": "Encrypted tunnel outbound beacon to known Tor exit node on port 3389",
        "extracted_entities": {
            "source_ip": "185.220.101.5",
            "destination_ip": "10.0.0.40",
            "port": 3389,
            "protocol": "TCP",
            "keywords_matched": ["tunnel", "backdoor", "beacon"]
        }
    },
    {
        "id": "inc-soc-006",
        "source_ip": "10.0.0.12",
        "destination_ip": "8.8.8.8",
        "port": 53,
        "protocol": "UDP",
        "service": "DNS",
        "state": "CON",
        "attack_type": "Normal",
        "is_attack": False,
        "confidence": 0.99,
        "risk_score": 10,
        "severity": "LOW",
        "timestamp": (datetime.utcnow() - timedelta(hours=4)).isoformat() + "Z",
        "username": None,
        "failed_attempts": 0,
        "status": "resolved",
        "raw_log": "Standard recursive DNS query resolve for cdn.jsdelivr.net",
        "extracted_entities": {
            "source_ip": "10.0.0.12",
            "destination_ip": "8.8.8.8",
            "port": 53,
            "protocol": "UDP",
            "keywords_matched": []
        }
    }
]

def seed_database():
    print(f"Connecting to MongoDB at {db_service.mongodb_uri}, database: {db_service.db_name}...")
    if not db_service.is_connected:
        print("[ERROR] MongoDB is not connected!")
        return False

    print(f"Connected successfully to {db_service.db_name}.")
    for inc in SAMPLE_INCIDENTS:
        # Pre-generate GenAI explanation for high fidelity
        if "ai_explanation" not in inc:
            inc["ai_explanation"] = genai_service.explain_incident(inc)
        inc_id = db_service.insert_incident(inc)
        print(f"  [+] Seeded incident {inc_id}: {inc['attack_type']} (Risk: {inc['risk_score']}, {inc['severity']})")

    total = db_service.count_incidents()
    print(f"[SUCCESS] MongoDB database '{db_service.db_name}' now contains {total} incidents.")
    return True

if __name__ == "__main__":
    seed_database()
