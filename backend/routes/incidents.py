"""
Incidents Routes:
  - GET /api/incidents (returns list of incidents for frontend compatibility)
  - GET /api/incidents/{id} (single incident details)
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List

from models.schemas import IncidentResponse
from services import db_service

router = APIRouter(tags=["Incidents"])

@router.get("/incidents", response_model=List[IncidentResponse])
async def list_incidents(
    severity: Optional[str] = Query(None, description="Filter by severity: LOW, MEDIUM, HIGH, CRITICAL"),
    attack_type: Optional[str] = Query(None, description="Filter by attack category"),
    source_ip: Optional[str] = Query(None, description="Filter by source IP"),
    limit: int = Query(50, ge=1, le=200, description="Page size limit"),
    skip: int = Query(0, ge=0, description="Offset")
):
    incidents_raw = db_service.get_incidents(
        severity=severity,
        attack_type=attack_type,
        source_ip=source_ip,
        limit=limit,
        skip=skip
    )

    items = []
    for inc in incidents_raw:
        items.append(IncidentResponse(
            id=str(inc.get("id")),
            source_ip=inc.get("source_ip", "Unknown"),
            destination_ip=inc.get("destination_ip", "Unknown"),
            port=int(inc.get("port", 0) or 0),
            protocol=inc.get("protocol", "TCP"),
            service=inc.get("service", "-"),
            state=inc.get("state", "CON"),
            attack_type=inc.get("attack_type", "Generic"),
            confidence=float(inc.get("confidence", 0.90) or 0.90),
            risk_score=int(inc.get("risk_score", 50) or 50),
            severity=inc.get("severity", "MEDIUM"),
            timestamp=inc.get("timestamp", ""),
            username=inc.get("username"),
            failed_attempts=int(inc.get("failed_attempts", 0) or 0),
            status=inc.get("status", "detected"),
            extracted_entities=inc.get("extracted_entities"),
            ai_explanation=inc.get("ai_explanation"),
            raw_event=inc.get("raw_event"),
            raw_log=inc.get("raw_log")
        ))

    return items

@router.get("/incidents/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str):
    inc = db_service.get_incident_by_id(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident with ID '{incident_id}' not found")

    return IncidentResponse(
        id=str(inc.get("id")),
        source_ip=inc.get("source_ip", "Unknown"),
        destination_ip=inc.get("destination_ip", "Unknown"),
        port=int(inc.get("port", 0) or 0),
        protocol=inc.get("protocol", "TCP"),
        service=inc.get("service", "-"),
        state=inc.get("state", "CON"),
        attack_type=inc.get("attack_type", "Generic"),
        confidence=float(inc.get("confidence", 0.90) or 0.90),
        risk_score=int(inc.get("risk_score", 50) or 50),
        severity=inc.get("severity", "MEDIUM"),
        timestamp=inc.get("timestamp", ""),
        username=inc.get("username"),
        failed_attempts=int(inc.get("failed_attempts", 0) or 0),
        status=inc.get("status", "detected"),
        extracted_entities=inc.get("extracted_entities"),
        ai_explanation=inc.get("ai_explanation"),
        raw_event=inc.get("raw_event"),
        raw_log=inc.get("raw_log")
    )
