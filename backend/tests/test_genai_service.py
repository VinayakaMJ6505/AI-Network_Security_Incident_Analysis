"""
TDD Tests for GenAI Explanation Service.
Tests written FIRST (RED).
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.genai_service import GenAIService

genai = GenAIService()

SAMPLE_INCIDENT = {
    "attack_type": "DoS",
    "confidence": 0.95,
    "risk_score": 88,
    "severity": "CRITICAL",
    "source_ip": "45.33.32.156",
    "destination_ip": "10.0.0.5",
    "destination_port": 80,
    "port": 80,
    "protocol": "TCP"
}

def test_explain_returns_dict():
    result = genai.explain_incident(SAMPLE_INCIDENT)
    assert isinstance(result, dict)

def test_explain_has_incident_summary():
    result = genai.explain_incident(SAMPLE_INCIDENT)
    assert "incident_summary" in result
    assert len(result["incident_summary"]) > 20

def test_explain_has_evidence_list():
    result = genai.explain_incident(SAMPLE_INCIDENT)
    assert "evidence" in result
    assert isinstance(result["evidence"], list)
    assert len(result["evidence"]) >= 1

def test_explain_has_potential_impact():
    result = genai.explain_incident(SAMPLE_INCIDENT)
    assert "potential_impact" in result
    assert len(result["potential_impact"]) > 10

def test_explain_has_recommendations_list():
    result = genai.explain_incident(SAMPLE_INCIDENT)
    assert "investigation_recommendations" in result
    assert isinstance(result["investigation_recommendations"], list)
    assert len(result["investigation_recommendations"]) >= 1

def test_explain_has_provider_field():
    result = genai.explain_incident(SAMPLE_INCIDENT)
    assert "provider" in result

def test_explain_has_generated_at():
    result = genai.explain_incident(SAMPLE_INCIDENT)
    assert "generated_at" in result

def test_explain_normal_traffic():
    incident = {**SAMPLE_INCIDENT, "attack_type": "Normal", "risk_score": 10, "severity": "LOW"}
    result = genai.explain_incident(incident)
    assert "incident_summary" in result
    assert result["attack_type"] == "Normal"

def test_explain_shellcode_incident():
    incident = {**SAMPLE_INCIDENT, "attack_type": "Shellcode", "risk_score": 95, "severity": "CRITICAL"}
    result = genai.explain_incident(incident)
    assert result["attack_type"] == "Shellcode"
    assert len(result["investigation_recommendations"]) >= 2

def test_explain_unknown_attack_fallback():
    incident = {**SAMPLE_INCIDENT, "attack_type": "UnknownType"}
    result = genai.explain_incident(incident)
    assert "incident_summary" in result  # Should still return something
