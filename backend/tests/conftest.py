"""
Pytest configuration and shared fixtures for backend tests.
"""
import sys
import os
import pytest

# Add backend directory to Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

@pytest.fixture(scope="module")
def client():
    """FastAPI TestClient shared across tests."""
    from fastapi.testclient import TestClient
    from main import app
    return TestClient(app)

@pytest.fixture
def sample_log_text():
    return (
        "2026-09-22 10:15:32 Blocked connection from 192.168.1.45 "
        "to server 10.0.0.10 using TCP port 22. "
        "User admin generated 35 failed authentication attempts."
    )

@pytest.fixture
def sample_analyze_payload():
    return {
        "source_ip": "192.168.1.45",
        "destination_ip": "10.0.0.10",
        "destination_port": 22,
        "proto": "tcp",
        "service": "ssh",
        "state": "CON",
        "dur": 0.05,
        "spkts": 80,
        "dpkts": 10,
        "sbytes": 5000,
        "dbytes": 200,
        "rate": 350.0,
        "failed_attempts": 35
    }

@pytest.fixture
def sample_incident():
    return {
        "id": "inc-test001",
        "source_ip": "192.168.1.45",
        "destination_ip": "10.0.0.10",
        "port": 22,
        "protocol": "TCP",
        "attack_type": "Exploits",
        "confidence": 0.94,
        "risk_score": 87,
        "severity": "HIGH",
        "timestamp": "2026-09-22T10:15:32Z",
        "status": "detected"
    }
