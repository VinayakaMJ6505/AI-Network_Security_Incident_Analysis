"""
Log Upload Route: POST /api/log/upload
Handles file uploads (CSV datasets, JSON records, TXT/LOG security logs)
AND direct JSON body payloads from the React frontend Log Parser.
"""
from fastapi import APIRouter, Request, HTTPException
import io
import pandas as pd
import json
from typing import List, Dict, Any

from models.schemas import LogUploadSummary
from services import ml_service, nlp_service, risk_service, genai_service, db_service
from services.rate_limiter import enforce_genai_rate_limit
from utils.helpers import get_service_for_port, get_current_timestamp

router = APIRouter(tags=["Log Upload"])

@router.post("/log/upload", response_model=LogUploadSummary)
async def upload_log(request: Request):
    content_type = request.headers.get("content-type", "")

    total_events = 0
    detected_attacks = 0
    normal_events = 0
    high_risk_count = 0
    critical_count = 0
    processed_incidents: List[Dict[str, Any]] = []
    single_incident = None
    extracted_entities = None
    filename = "input_log"
    file_type = "TEXT"

    try:
        # Case A: JSON body from Frontend (LogParserView / uploadLog())
        if "application/json" in content_type:
            # Only this branch (single-incident JSON body) calls GenAI below —
            # bulk CSV/JSON/text file uploads never do, so the rate limit is
            # enforced here rather than on the whole route.
            await enforce_genai_rate_limit(request)

            body = await request.json()
            raw_log = body.get("log") or body.get("text") or ""
            entities_override = body.get("entities") or {}

            extracted = nlp_service.extract_entities(raw_log)
            if entities_override:
                extracted.update({k: v for k, v in entities_override.items() if v is not None})
            
            extracted_entities = extracted
            port = extracted.get("port") or 80
            protocol = extracted.get("protocol") or "TCP"
            service = get_service_for_port(port)

            feat = {
                "proto": protocol.lower(),
                "service": service.lower(),
                "failed_attempts": extracted.get("failed_attempts", 0),
                "destination_port": port,
                "port": port,
                "is_attack_keyword_matched": len(extracted.get("keywords_matched", [])) > 0
            }

            attack_type, is_attack, confidence, _ = ml_service.predict(feat)
            risk_score, severity = risk_service.calculate_risk_score(
                attack_type=attack_type,
                confidence=confidence,
                failed_attempts=extracted.get("failed_attempts", 0),
                port=port,
                keywords_matched=extracted.get("keywords_matched", [])
            )

            total_events = 1
            if is_attack:
                detected_attacks = 1
            else:
                normal_events = 1

            if severity == "HIGH":
                high_risk_count = 1
            elif severity == "CRITICAL":
                critical_count = 1

            now_ts = extracted.get("timestamp") or get_current_timestamp()

            ai_exp = genai_service.explain_incident({
                "attack_type": attack_type,
                "confidence": confidence,
                "risk_score": risk_score,
                "severity": severity,
                "source_ip": extracted.get("source_ip", "192.168.1.100"),
                "destination_ip": extracted.get("destination_ip", "10.0.0.10"),
                "port": port,
                "protocol": protocol,
                "raw_log": raw_log
            })

            inc_doc = {
                "source_ip": extracted.get("source_ip", "192.168.1.100"),
                "destination_ip": extracted.get("destination_ip", "10.0.0.10"),
                "port": port,
                "protocol": protocol,
                "service": service,
                "attack_type": attack_type,
                "is_attack": is_attack,
                "confidence": confidence,
                "risk_score": risk_score,
                "severity": severity,
                "timestamp": now_ts,
                "raw_log": raw_log,
                "extracted_entities": extracted,
                "ai_explanation": ai_exp,
                "status": "detected" if is_attack else "benign"
            }
            inc_id = db_service.insert_incident(inc_doc)
            inc_doc["id"] = inc_id
            single_incident = inc_doc
            processed_incidents.append(inc_doc)

        # Case B: Multipart file upload (CSV, JSON, or TXT file)
        else:
            form = await request.form()
            file = form.get("file")
            if not file:
                raise HTTPException(status_code=400, detail="No file or JSON payload provided.")

            filename = file.filename or "uploaded_file"
            ext = filename.split(".")[-1].lower() if "." in filename else ""
            file_type = ext.upper() if ext else "TEXT"
            content_bytes = await file.read()

            if ext == "csv":
                df = pd.read_csv(io.BytesIO(content_bytes))
                total_events = len(df)
                sample_df = df.head(200)

                for _, row in sample_df.iterrows():
                    row_dict = row.to_dict()
                    proto = str(row_dict.get('proto', 'tcp'))
                    service = str(row_dict.get('service', '-'))
                    port = int(row_dict.get('port', row_dict.get('destination_port', 80)) or 80)
                    
                    attack_type, is_attack, confidence, _ = ml_service.predict(row_dict)
                    risk_score, severity = risk_service.calculate_risk_score(
                        attack_type=attack_type,
                        confidence=confidence,
                        port=port
                    )

                    if is_attack:
                        detected_attacks += 1
                    else:
                        normal_events += 1

                    if severity == "HIGH":
                        high_risk_count += 1
                    elif severity == "CRITICAL":
                        critical_count += 1

                    inc_doc = {
                        "source_ip": str(row_dict.get('srcip', row_dict.get('source_ip', '192.168.1.100'))),
                        "destination_ip": str(row_dict.get('dstip', row_dict.get('destination_ip', '10.0.0.10'))),
                        "port": port,
                        "protocol": proto.upper(),
                        "service": service,
                        "attack_type": attack_type,
                        "is_attack": is_attack,
                        "confidence": confidence,
                        "risk_score": risk_score,
                        "severity": severity,
                        "timestamp": get_current_timestamp(),
                        "status": "detected" if is_attack else "benign"
                    }
                    inc_id = db_service.insert_incident(inc_doc)
                    inc_doc["id"] = inc_id
                    processed_incidents.append(inc_doc)

            elif ext == "json":
                data = json.loads(content_bytes.decode('utf-8'))
                records = data if isinstance(data, list) else [data]
                total_events = len(records)
                sample_records = records[:200]

                for rec in sample_records:
                    attack_type, is_attack, confidence, _ = ml_service.predict(rec)
                    port = int(rec.get('port', rec.get('destination_port', 80)) or 80)
                    risk_score, severity = risk_service.calculate_risk_score(
                        attack_type=attack_type,
                        confidence=confidence,
                        port=port
                    )

                    if is_attack:
                        detected_attacks += 1
                    else:
                        normal_events += 1

                    if severity == "HIGH":
                        high_risk_count += 1
                    elif severity == "CRITICAL":
                        critical_count += 1

                    inc_doc = {
                        "source_ip": str(rec.get('source_ip', '192.168.1.100')),
                        "destination_ip": str(rec.get('destination_ip', '10.0.0.10')),
                        "port": port,
                        "protocol": str(rec.get('protocol', 'TCP')).upper(),
                        "service": str(rec.get('service', '-')),
                        "attack_type": attack_type,
                        "is_attack": is_attack,
                        "confidence": confidence,
                        "risk_score": risk_score,
                        "severity": severity,
                        "timestamp": get_current_timestamp(),
                        "status": "detected" if is_attack else "benign"
                    }
                    inc_id = db_service.insert_incident(inc_doc)
                    inc_doc["id"] = inc_id
                    processed_incidents.append(inc_doc)

            else:
                text = content_bytes.decode('utf-8', errors='ignore')
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                total_events = len(lines)
                sample_lines = lines[:200]

                for line in sample_lines:
                    extracted = nlp_service.extract_entities(line)
                    port = extracted.get("port") or 80
                    protocol = extracted.get("protocol") or "TCP"
                    service = get_service_for_port(port)

                    feat = {
                        "proto": protocol.lower(),
                        "service": service.lower(),
                        "failed_attempts": extracted.get("failed_attempts", 0),
                        "destination_port": port,
                        "port": port,
                        "is_attack_keyword_matched": len(extracted.get("keywords_matched", [])) > 0
                    }

                    attack_type, is_attack, confidence, _ = ml_service.predict(feat)
                    risk_score, severity = risk_service.calculate_risk_score(
                        attack_type=attack_type,
                        confidence=confidence,
                        failed_attempts=extracted.get("failed_attempts", 0),
                        port=port,
                        keywords_matched=extracted.get("keywords_matched", [])
                    )

                    if is_attack:
                        detected_attacks += 1
                    else:
                        normal_events += 1

                    if severity == "HIGH":
                        high_risk_count += 1
                    elif severity == "CRITICAL":
                        critical_count += 1

                    inc_doc = {
                        "source_ip": extracted.get("source_ip", "192.168.1.100"),
                        "destination_ip": extracted.get("destination_ip", "10.0.0.10"),
                        "port": port,
                        "protocol": protocol,
                        "service": service,
                        "attack_type": attack_type,
                        "is_attack": is_attack,
                        "confidence": confidence,
                        "risk_score": risk_score,
                        "severity": severity,
                        "timestamp": extracted.get("timestamp") or get_current_timestamp(),
                        "raw_log": line,
                        "status": "detected" if is_attack else "benign"
                    }
                    inc_id = db_service.insert_incident(inc_doc)
                    inc_doc["id"] = inc_id
                    processed_incidents.append(inc_doc)

            if processed_incidents:
                single_incident = processed_incidents[0]

        return LogUploadSummary(
            status="success",
            success=True,
            filename=filename,
            file_type=file_type,
            total_events_processed=total_events,
            detected_attacks=detected_attacks,
            normal_events=normal_events,
            high_risk_incidents=high_risk_count,
            critical_incidents=critical_count,
            extracted_entities=extracted_entities,
            incident=single_incident,
            processed_incidents=processed_incidents[:10]
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process log upload: {str(e)}")
