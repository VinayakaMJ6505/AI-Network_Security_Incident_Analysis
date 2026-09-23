"""
TDD Tests for NLP Log Analysis Service.
Tests written FIRST (RED) before verifying implementation.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.nlp_service import NLPLogService

nlp = NLPLogService()

def test_extract_source_ip():
    text = "Blocked connection from 192.168.1.45 to 10.0.0.10 port 22"
    result = nlp.extract_entities(text)
    assert result["source_ip"] == "192.168.1.45"

def test_extract_destination_ip():
    text = "Blocked connection from 192.168.1.45 to 10.0.0.10 port 22"
    result = nlp.extract_entities(text)
    assert result["destination_ip"] == "10.0.0.10"

def test_extract_port_explicit():
    text = "Connection from 192.168.1.10 to 10.0.0.1 using TCP port 22"
    result = nlp.extract_entities(text)
    assert result["port"] == 22

def test_extract_protocol_tcp():
    text = "Blocked TCP connection from 192.168.1.1 to 10.0.0.1 port 80"
    result = nlp.extract_entities(text)
    assert result["protocol"] == "TCP"

def test_extract_username():
    text = "User admin generated 35 failed authentication attempts from 192.168.1.5"
    result = nlp.extract_entities(text)
    assert result["username"] == "admin"

def test_extract_failed_attempts():
    text = "192.168.1.45 generated 35 failed authentication attempts."
    result = nlp.extract_entities(text)
    assert result["failed_attempts"] == 35

def test_extract_action_blocked():
    text = "Blocked connection from 192.168.1.2 port 443"
    result = nlp.extract_entities(text)
    assert result["action"] is not None
    assert "block" in result["action"].lower()

def test_extract_attack_keywords():
    text = "Brute force attack detected from 10.1.1.1 on SSH port 22"
    result = nlp.extract_entities(text)
    assert len(result["keywords_matched"]) > 0

def test_empty_text_returns_defaults():
    result = nlp.extract_entities("")
    assert result["source_ip"] is None
    assert result["failed_attempts"] == 0

def test_timestamp_extracted():
    text = "2026-09-22 10:15:32 Alert from 192.168.1.5 to 10.0.0.1 port 80"
    result = nlp.extract_entities(text)
    assert result["timestamp"] is not None
    assert "2026" in result["timestamp"]

def test_none_text_returns_defaults():
    result = nlp.extract_entities(None)
    assert result["source_ip"] is None
    assert result["failed_attempts"] == 0

def test_ssh_port_heuristic():
    text = "Failed SSH login attempt from 10.10.1.1"
    result = nlp.extract_entities(text)
    assert result["port"] == 22
