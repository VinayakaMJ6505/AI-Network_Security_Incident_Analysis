"""
Explain Route: POST /api/explain
Generates GenAI incident summary, technical evidence, potential impact, and SOC investigation recommendations.
Dual-keyed response guarantees 100% compatibility with React frontend and API contracts.
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime

from models.schemas import ExplainRequest, ExplainResponse
from services import genai_service, db_service

router = APIRouter(tags=["Explain"])

@router.post("/explain", response_model=ExplainResponse)
async def explain_incident(payload: ExplainRequest):
    try:
        incident_data = {}

        # If incident_id is passed, look up the existing document
        if payload.incident_id:
            db_inc = db_service.get_incident_by_id(payload.incident_id)
            if db_inc:
                incident_data = dict(db_inc)
            else:
                raise HTTPException(status_code=404, detail=f"Incident '{payload.incident_id}' not found.")

        # Overlay any explicitly provided request fields
        if payload.attack_type:
            incident_data["attack_type"] = payload.attack_type
        if payload.confidence is not None:
            incident_data["confidence"] = payload.confidence
        if payload.risk_score is not None:
            incident_data["risk_score"] = payload.risk_score
        if payload.severity:
            incident_data["severity"] = payload.severity
        if payload.source_ip:
            incident_data["source_ip"] = payload.source_ip
        if payload.destination_ip:
            incident_data["destination_ip"] = payload.destination_ip
        if payload.destination_port or payload.port:
            incident_data["destination_port"] = payload.destination_port or payload.port
            incident_data["port"] = payload.destination_port or payload.port
        if payload.protocol:
            incident_data["protocol"] = payload.protocol
        if payload.raw_log:
            incident_data["raw_log"] = payload.raw_log

        # Ensure defaults
        if not incident_data.get("attack_type"):
            incident_data["attack_type"] = "Generic"
        if not incident_data.get("risk_score"):
            incident_data["risk_score"] = 65
        if not incident_data.get("severity"):
            incident_data["severity"] = "HIGH"

        # Generate explanation via GenAI service
        explanation = genai_service.explain_incident(incident_data)

        # If an incident_id is associated, persist explanation in DB
        if payload.incident_id:
            db_service.update_incident_explanation(payload.incident_id, explanation)

        # Save analysis report
        db_service.insert_analysis_report({
            "incident_id": payload.incident_id,
            "attack_type": explanation["attack_type"],
            "risk_score": explanation["risk_score"],
            "severity": explanation["severity"],
            "explanation": explanation
        })

        summary_text = explanation.get("incident_summary") or explanation.get("summary") or "Incident analyzed."
        recs = explanation.get("investigation_recommendations") or explanation.get("recommendations") or []

        return ExplainResponse(
            incident_id=payload.incident_id,
            attack_type=explanation["attack_type"],
            risk_score=explanation["risk_score"],
            severity=explanation["severity"],
            summary=summary_text,
            incident_summary=summary_text,
            evidence=explanation.get("evidence", []),
            potential_impact=explanation.get("potential_impact", "Elevated risk of service disruption."),
            recommendations=recs,
            investigation_recommendations=recs,
            generated_at=explanation.get("generated_at", datetime.utcnow().isoformat() + "Z"),
            provider=explanation.get("provider", "AI-Cybersecurity-Knowledge-Engine")
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate explanation: {str(e)}")
