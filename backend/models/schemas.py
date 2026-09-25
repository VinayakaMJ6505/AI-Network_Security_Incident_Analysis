"""
Pydantic Schemas for Suite Strike Backend.
Aligned with UNSW-NB15 ML features, README.md, and React frontend contracts.
"""
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field

# ==========================================
# Analyze Endpoint Schemas (POST /api/analyze)
# ==========================================

class AnalyzeRequest(BaseModel):
    # Optional raw log string
    log_text: Optional[str] = Field(None, description="Unstructured security log text to analyze")
    
    # Optional structured network features (UNSW-NB15 aligned)
    proto: Optional[str] = Field(None, description="Protocol (e.g. tcp, udp, icmp, etc.)")
    service: Optional[str] = Field(None, description="Service (e.g. http, ftp, ssh, dns, -)")
    state: Optional[str] = Field(None, description="State (e.g. FIN, CON, INT, etc.)")
    
    # Key numerical features
    dur: Optional[float] = Field(0.0, description="Record total duration")
    spkts: Optional[int] = Field(0, description="Source to destination packet count")
    dpkts: Optional[int] = Field(0, description="Destination to source packet count")
    sbytes: Optional[int] = Field(0, description="Source to destination transaction bytes")
    dbytes: Optional[int] = Field(0, description="Destination to source transaction bytes")
    rate: Optional[float] = Field(0.0, description="Packet rate")
    sttl: Optional[int] = Field(64, description="Source to destination time to live")
    dttl: Optional[int] = Field(64, description="Destination to source time to live")
    sload: Optional[float] = Field(0.0, description="Source bits per second")
    dload: Optional[float] = Field(0.0, description="Destination bits per second")
    sloss: Optional[int] = Field(0, description="Source packets retransmitted or dropped")
    dloss: Optional[int] = Field(0, description="Destination packets retransmitted or dropped")
    
    # Metadata
    source_ip: Optional[str] = Field(None, description="Source IP address")
    destination_ip: Optional[str] = Field(None, description="Destination IP address")
    destination_port: Optional[int] = Field(None, description="Destination Port (e.g. 22, 80, 443)")
    port: Optional[int] = Field(None, description="Port alias")
    username: Optional[str] = Field(None, description="Username associated with event")
    failed_attempts: Optional[int] = Field(0, description="Number of failed auth attempts")

    # Catch-all for extra raw UNSW-NB15 features if passed
    additional_features: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ExtractedEntities(BaseModel):
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    port: Optional[int] = None
    protocol: Optional[str] = None
    username: Optional[str] = None
    failed_attempts: int = 0
    timestamp: Optional[str] = None
    action: Optional[str] = None
    keywords_matched: List[str] = []


class AnalyzeResponse(BaseModel):
    status: str = "success"
    incident_id: str
    attack_type: str
    is_attack: bool
    confidence: float
    risk_score: int
    severity: str
    probabilities: Dict[str, float]
    extracted_entities: ExtractedEntities
    ai_explanation: Optional[Dict[str, Any]] = None
    timestamp: str
    message: str


# ==========================================
# Log Upload Endpoint Schemas (POST /api/log/upload)
# ==========================================

class LogUploadJSONRequest(BaseModel):
    log: Optional[str] = None
    entities: Optional[Dict[str, Any]] = None


class LogUploadSummary(BaseModel):
    status: str = "success"
    success: bool = True
    filename: Optional[str] = "input_log"
    file_type: Optional[str] = "TEXT"
    total_events_processed: int = 1
    detected_attacks: int = 0
    normal_events: int = 0
    high_risk_incidents: int = 0
    critical_incidents: int = 0
    extracted_entities: Optional[Dict[str, Any]] = None
    incident: Optional[Dict[str, Any]] = None
    processed_incidents: List[Dict[str, Any]] = []


# ==========================================
# Incident Schemas (GET /api/incidents)
# ==========================================

class IncidentResponse(BaseModel):
    id: str
    source_ip: Optional[str] = "Unknown"
    destination_ip: Optional[str] = "Unknown"
    port: Optional[int] = 0
    protocol: Optional[str] = "TCP"
    service: Optional[str] = "-"
    state: Optional[str] = "CON"
    attack_type: str
    confidence: float
    risk_score: int
    severity: str
    timestamp: str
    username: Optional[str] = None
    failed_attempts: int = 0
    status: str = "detected"
    extracted_entities: Optional[Dict[str, Any]] = None
    ai_explanation: Optional[Dict[str, Any]] = None
    raw_event: Optional[Dict[str, Any]] = None
    raw_log: Optional[str] = None


class IncidentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    incidents: List[IncidentResponse]


# ==========================================
# Dashboard Schemas (GET /api/dashboard)
# ==========================================

class SecurityOverview(BaseModel):
    total_events: int
    detected_attacks: int
    high_risk_incidents: int
    critical_incidents: int


class AttackDistributionItem(BaseModel):
    category: str
    attack_type: str
    count: int
    percentage: float
    color: Optional[str] = None


class AttackTrendItem(BaseModel):
    time: str
    time_label: str
    normal: int
    attack: int
    highRisk: int


class RecentIncidentItem(BaseModel):
    id: str
    source_ip: str
    destination_ip: str
    port: int
    attack_type: str
    risk_score: int
    severity: str
    timestamp: str


class TopPortItem(BaseModel):
    port: int
    service: str
    count: int
    risk: Optional[str] = "Medium"


class TopSourceItem(BaseModel):
    ip: str
    count: int
    attackType: str
    country: str = "LAN"


class DashboardStats(BaseModel):
    total_events: int
    detected_attacks: int
    high_risk_incidents: int
    critical_incidents: int
    attack_percentage: float = 0.0
    model_accuracy: float = 76.97  # real measured value; see backend/reports/model_evaluation_report.json
    avg_detection_time_ms: float = 12.4
    overview: SecurityOverview
    attack_distribution: List[AttackDistributionItem]
    attack_trends: List[AttackTrendItem]
    recent_incidents: List[RecentIncidentItem]
    top_ports: List[TopPortItem]
    top_sources: List[TopSourceItem]


# ==========================================
# GenAI Explain Schemas (POST /api/explain)
# ==========================================

class ExplainRequest(BaseModel):
    incident_id: Optional[str] = None
    attack_type: Optional[str] = None
    confidence: Optional[float] = None
    risk_score: Optional[int] = None
    severity: Optional[str] = None
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    destination_port: Optional[int] = None
    port: Optional[int] = None
    protocol: Optional[str] = None
    raw_log: Optional[str] = None


class ExplainResponse(BaseModel):
    incident_id: Optional[str] = None
    attack_type: str
    risk_score: int
    severity: str
    summary: str
    incident_summary: str
    evidence: Union[List[str], str]
    potential_impact: str
    recommendations: List[str]
    investigation_recommendations: List[str]
    generated_at: str
    provider: str
