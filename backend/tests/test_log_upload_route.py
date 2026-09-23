"""
TDD Tests for /api/log/upload Route.
Supports both file uploads and JSON direct body.
"""
from fastapi.testclient import TestClient
import io
from main import app

client = TestClient(app)

def test_upload_json_body_from_frontend():
    payload = {
        "log": "Blocked connection from 192.168.1.10 to server 10.0.0.1 using TCP port 22. User root generated 20 failed attempts.",
        "entities": {"source_ip": "192.168.1.10", "port": 22}
    }
    res = client.post("/api/log/upload", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["total_events_processed"] == 1
    assert data["incident"] is not None
    assert data["incident"]["port"] == 22

def test_upload_txt_file():
    content = "Blocked connection from 10.0.0.5 to 192.168.1.1 port 80\n"
    files = {"file": ("syslog.log", io.BytesIO(content.encode("utf-8")), "text/plain")}
    res = client.post("/api/log/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["total_events_processed"] == 1

def test_upload_csv_file():
    csv_data = (
        "proto,service,state,dur,spkts,dpkts,sbytes,dbytes,rate,sttl,dttl,srcip,dstip,port\n"
        "tcp,http,FIN,0.1,5,4,250,500,90,64,60,192.168.1.15,10.0.0.5,80\n"
    )
    files = {"file": ("data.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")}
    res = client.post("/api/log/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["total_events_processed"] == 1
