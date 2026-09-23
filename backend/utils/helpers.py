"""
Helper utilities for Network Security Incident Analysis Backend.
"""
from datetime import datetime
from typing import Dict, Any, Optional

COMMON_PORTS = {
    21: "ftp",
    22: "ssh",
    23: "telnet",
    25: "smtp",
    53: "dns",
    80: "http",
    110: "pop3",
    143: "imap",
    443: "ssl/https",
    445: "smb",
    3306: "mysql",
    3389: "rdp",
    8080: "http-alt"
}

def get_service_for_port(port: Optional[int]) -> str:
    if not port:
        return "-"
    return COMMON_PORTS.get(int(port), "-")

def get_current_timestamp() -> str:
    return datetime.utcnow().isoformat() + "Z"

def format_mongo_id(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Ensures MongoDB ObjectId or string id is cleanly returned as 'id'."""
    if not doc:
        return doc
    clean = dict(doc)
    if "_id" in clean:
        clean["id"] = str(clean.pop("_id"))
    elif "id" not in clean:
        clean["id"] = str(hash(str(clean)))
    return clean

# Median/mean default values for UNSW-NB15 features to prevent distortion if partially filled
UNSW_NUMERICAL_DEFAULTS = {
    'dur': 0.001,
    'spkts': 2,
    'dpkts': 2,
    'sbytes': 146,
    'dbytes': 178,
    'rate': 1000.0,
    'sttl': 64,
    'dttl': 60,
    'sload': 100000.0,
    'dload': 100000.0,
    'sloss': 0,
    'dloss': 0,
    'sinpkt': 0.01,
    'dinpkt': 0.01,
    'sjit': 0.0,
    'djit': 0.0,
    'swin': 255,
    'stcpb': 1000000,
    'dtcpb': 1000000,
    'dwin': 255,
    'tcprtt': 0.001,
    'synack': 0.0005,
    'ackdat': 0.0005,
    'smean': 73,
    'dmean': 89,
    'trans_depth': 0,
    'response_body_len': 0,
    'ct_srv_src': 1,
    'ct_state_ttl': 0,
    'ct_dst_ltm': 1,
    'ct_src_dport_ltm': 1,
    'ct_dst_sport_ltm': 1,
    'ct_dst_src_ltm': 1,
    'is_ftp_login': 0,
    'ct_ftp_cmd': 0,
    'ct_flw_http_mthd': 0,
    'ct_src_ltm': 1,
    'ct_srv_dst': 1,
    'is_sm_ips_ports': 0
}
