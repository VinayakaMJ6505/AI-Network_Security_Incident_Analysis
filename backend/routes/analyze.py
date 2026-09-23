"""
Analyze Route: POST /api/analyze
Performs network security event analysis using NLP log extraction, ML classification, risk scoring,
and generates immediate GenAI explanation for live analysis.
"""
from fastapi import APIRouter, HTTPException
from models.schemas import AnalyzeRequest, AnalyzeResponse, ExtractedEntities
from services import ml_service, nlp_service, risk_service, genai_service, db_service
from utils.helpers import get_service_for_port, get_current_timestamp

router = APIRouter(tags=["Analyze"])

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_event(payload: AnalyzeRequest):
    try:
        extracted = {}
        # 1. If unstructured log text is provided, extract entities via NLP
        if payload.log_text:
            extracted = nlp_service.extract_entities(payload.log_text)
            db_service.insert_log({
                "raw_text": payload.log_text,
                "extracted_entities": extracted,
                "timestamp": extracted.get("timestamp") or get_current_timestamp()
            })

        # 2. Merge payload fields with extracted entities (payload takes priority if explicit)
        src_ip = payload.source_ip or extracted.get("source_ip") or "192.168.1.100"
        dst_ip = payload.destination_ip or extracted.get("destination_ip") or "10.0.0.10"
        port = payload.destination_port or payload.port or extracted.get("port") or 80
        protocol = payload.proto or extracted.get("protocol") or "TCP"
        username = payload.username or extracted.get("username")
        failed_attempts = payload.failed_attempts or extracted.get("failed_attempts") or 0
        keywords_matched = extracted.get("keywords_matched", [])

        # Determine network service name
        service = payload.service or get_service_for_port(port)

        # 3. Assemble ML feature dictionary
        features = {
            "proto": protocol.lower(),
            "service": service.lower(),
            "state": (payload.state or "CON").upper(),
            "dur": payload.dur,
            "spkts": payload.spkts,
            "dpkts": payload.dpkts,
            "sbytes": payload.sbytes,
            "dbytes": payload.dbytes,
            "rate": payload.rate,
            "sttl": payload.sttl,
            "dttl": payload.dttl,
            "sload": payload.sload,
            "dload": payload.dload,
            "sloss": payload.sloss,
            "dloss": payload.dloss,
            "destination_port": port,
            "port": port,
            "failed_attempts": failed_attempts,
            "is_attack_keyword_matched": len(keywords_matched) > 0
        }

        # Include any additional raw features passed in payload
        if payload.additional_features:
            features.update(payload.additional_features)

        # 4. Machine Learning Inference
        attack_type, is_attack, confidence, probabilities = ml_service.predict(features)

        # 5. Risk Assessment
        risk_score, severity = risk_service.calculate_risk_score(
            attack_type=attack_type,
            confidence=confidence,
            failed_attempts=failed_attempts,
            port=port,
            keywords_matched=keywords_matched
        )

        # 6. Generate GenAI explanation
        now_ts = get_current_timestamp()
        explanation = genai_service.explain_incident({
            "attack_type": attack_type,
            "confidence": confidence,
            "risk_score": risk_score,
            "severity": severity,
            "source_ip": src_ip,
            "destination_ip": dst_ip,
            "port": port,
            "destination_port": port,
            "protocol": protocol.upper(),
            "raw_log": payload.log_text
        })

        # 7. Save Incident to Database
        incident_doc = {
            "source_ip": src_ip,
            "destination_ip": dst_ip,
            "port": int(port),
            "protocol": protocol.upper(),
            "service": service,
            "state": (payload.state or "CON").upper(),
            "attack_type": attack_type,
            "is_attack": is_attack,
            "confidence": confidence,
            "risk_score": risk_score,
            "severity": severity,
            "timestamp": now_ts,
            "username": username,
            "failed_attempts": failed_attempts,
            "raw_log": payload.log_text,
            "extracted_entities": extracted if extracted else None,
            "ai_explanation": explanation,
            "status": "detected" if is_attack else "benign"
        }
        incident_id = db_service.insert_incident(incident_doc)

        # Save prediction audit
        db_service.insert_prediction({
            "incident_id": incident_id,
            "attack_type": attack_type,
            "confidence": confidence,
            "probabilities": probabilities,
            "risk_score": risk_score,
            "severity": severity
        })

        return AnalyzeResponse(
            incident_id=incident_id,
            attack_type=attack_type,
            is_attack=is_attack,
            confidence=confidence,
            risk_score=risk_score,
            severity=severity,
            probabilities=probabilities,
            extracted_entities=ExtractedEntities(
                source_ip=src_ip,
                destination_ip=dst_ip,
                port=port,
                protocol=protocol,
                username=username,
                failed_attempts=failed_attempts,
                timestamp=extracted.get("timestamp") or now_ts,
                action=extracted.get("action"),
                keywords_matched=keywords_matched
            ),
            ai_explanation=explanation,
            timestamp=now_ts,
            message="Analysis completed successfully."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
