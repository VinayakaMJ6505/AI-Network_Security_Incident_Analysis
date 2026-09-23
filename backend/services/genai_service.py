"""
Generative AI Module for Security Incident Explanation & Recommendation.
Generates:
  1. Incident Summary
  2. Evidence
  3. Potential Impact
  4. Investigation Recommendations
Supports external LLMs (Groq, OpenAI) with an intelligent domain-specific offline engine fallback.
"""
import os
import json
import logging
from typing import Dict, Any, List
from datetime import datetime

logger = logging.getLogger(__name__)

ATTACK_KNOWLEDGE_BASE = {
    "Analysis": {
        "summary": "Port scanning, vulnerability probing, or banner grabbing activity detected from source IP {source_ip} targeting port {port}.",
        "impact": "Adversary is mapping out perimeter network topology and active services to locate exploitable vulnerabilities for follow-on exploitation.",
        "recommendations": [
            "Check firewall logs for systematic sequential port sweeping originating from {source_ip}.",
            "Enforce rate-limiting and temporary IP throttling on edge routing devices.",
            "Verify that open ports on target host do not expose unauthenticated debug interfaces.",
            "Update external asset inventory and ensure unnecessary services are disabled."
        ]
    },
    "Backdoor": {
        "summary": "Stealthy persistence mechanism or unauthorized command channel detected from {source_ip} connecting to internal port {port}.",
        "impact": "Compromised system may permit continuous unauthorized remote execution, data exfiltration, or lateral network propagation bypassing standard access controls.",
        "recommendations": [
            "Immediately isolate the target host ({destination_ip}) from the local network segment.",
            "Capture volatile RAM dump and active socket connections (netstat/ss) for digital forensics.",
            "Audit scheduled tasks, systemd services, and startup registry keys for unrecognized persistence scripts.",
            "Rotate all administrative and service account credentials associated with the affected host."
        ]
    },
    "DoS": {
        "summary": "Denial of Service packet flood or high-volume traffic spike originating from {source_ip} towards port {port}.",
        "impact": "Resource exhaustion on target servers, leading to degraded response times or complete service unavailability for legitimate clients.",
        "recommendations": [
            "Deploy network ACL or upstream DDoS mitigation filter to drop anomalous packets from {source_ip}.",
            "Inspect web server connection pools and TCP SYN cookies status.",
            "Evaluate bandwidth utilization and server CPU/memory thresholds.",
            "Engage Content Delivery Network (CDN) or cloud scrubbing center if attack volume exceeds internal line capacity."
        ]
    },
    "Exploits": {
        "summary": "Known vulnerability exploit payload or malformed request detected from {source_ip} targeting service on port {port}.",
        "impact": "Potential arbitrary code execution, privilege escalation, or unauthorized access to sensitive application data and backend databases.",
        "recommendations": [
            "Review application and web server access logs for anomalous payload patterns or code injection attempts.",
            "Verify the patch level of the targeted software service running on port {port}.",
            "Enable Web Application Firewall (WAF) virtual patching rules for the affected endpoints.",
            "Check for unauthorized newly created processes, web shells, or file modifications."
        ]
    },
    "Fuzzers": {
        "summary": "Fuzzing activity detected with randomized or out-of-boundary packet payloads from {source_ip} directed at port {port}.",
        "impact": "Software crashes, buffer overruns, unhandled exceptions, and memory leaks that can facilitate exploitation.",
        "recommendations": [
            "Audit application crash dumps and core dumps on target host.",
            "Validate input sanitization and length constraints on targeted network interfaces.",
            "Block or rate-limit suspicious ingress traffic from {source_ip} at the edge boundary.",
            "Ensure monitoring alerts trigger on high process crash frequencies."
        ]
    },
    "Generic": {
        "summary": "Suspicious cryptographic or cryptographic key-exchange anomaly matching generalized attack signatures detected from {source_ip}.",
        "impact": "Possible collision attack or cipher degradation attempting to undermine transport layer encryption.",
        "recommendations": [
            "Inspect TLS cipher suites and deprecate legacy protocols (SSLv3, TLS 1.0/1.1).",
            "Verify certificate authenticity and check for man-in-the-middle proxy anomalies.",
            "Correlate event with network intrusion detection (IDS/IPS) alert telemetry."
        ]
    },
    "Reconnaissance": {
        "summary": "Information gathering or active network scanning from {source_ip} targeting services on port {port}.",
        "impact": "Adversary is identifying active IP ranges, open TCP/UDP listeners, and operating system fingerprints.",
        "recommendations": [
            "Add {source_ip} to temporary firewall blacklist or honeynet diversion.",
            "Disable ICMP echo replies or obscure banner information returned to untrusted subnets.",
            "Review authentication attempts across all perimeter services for subsequent brute-force actions."
        ]
    },
    "Shellcode": {
        "summary": "Small executable bytecode or shellcode sequence designed to spawn an interactive shell detected from {source_ip} targeting port {port}.",
        "impact": "Direct interactive root/administrator command execution on target host, posing critical enterprise-wide compromise threat.",
        "recommendations": [
            "CRITICAL: Isolate target endpoint from LAN immediately to stop lateral movement.",
            "Terminate active suspicious processes and analyze parent-child process execution trees.",
            "Collect disk snapshot and forensic timeline of events around the incident timestamp.",
            "Initiate incident response escalation protocol and notify security leadership."
        ]
    },
    "Worms": {
        "summary": "Self-replicating malicious worm traffic spreading across network ports from {source_ip} to port {port}.",
        "impact": "Rapid automated infection of adjacent unpatched hosts, network saturation, and widespread operational outage.",
        "recommendations": [
            "Enforce micro-segmentation rules to prevent east-west broadcast propagation.",
            "Scan internal subnets for hosts exhibiting identical outbound traffic patterns.",
            "Apply emergency security patches for SMB/RDP or the vulnerable port in question.",
            "Quarantine infected nodes and restore configurations from verified clean backups."
        ]
    },
    "Normal": {
        "summary": "Standard benign network transaction observed between {source_ip} and {destination_ip} on port {port}.",
        "impact": "No adverse impact; standard operational network behavior.",
        "recommendations": [
            "No urgent action required. Normal baseline traffic.",
            "Maintain continuous baseline metric collection for anomaly threshold tuning."
        ]
    }
}

class GenAIService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")

    def explain_incident(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates incident summary, evidence, potential impact, and investigation recommendations.
        """
        attack_type = incident_data.get("attack_type", "Generic")
        confidence = float(incident_data.get("confidence", 0.90) or 0.90)
        risk_score = int(incident_data.get("risk_score", 50) or 50)
        severity = incident_data.get("severity", "MEDIUM")
        source_ip = incident_data.get("source_ip", "192.168.1.100")
        destination_ip = incident_data.get("destination_ip", "10.0.0.10")
        port = incident_data.get("destination_port", incident_data.get("port", 80))
        protocol = incident_data.get("protocol", "TCP")

        # Try LLM provider if API key exists
        if self.groq_api_key:
            try:
                return self._call_groq(incident_data)
            except Exception as e:
                logger.warning(f"Groq API call failed, falling back to analytical generator: {e}")

        if self.openai_api_key:
            try:
                return self._call_openai(incident_data)
            except Exception as e:
                logger.warning(f"OpenAI API call failed, falling back to analytical generator: {e}")

        # Fallback to analytical cybersecurity engine
        return self._generate_analytical_explanation(
            attack_type=attack_type,
            confidence=confidence,
            risk_score=risk_score,
            severity=severity,
            source_ip=source_ip,
            destination_ip=destination_ip,
            port=port,
            protocol=protocol,
            raw_log=incident_data.get("raw_log")
        )

    def _generate_analytical_explanation(
        self,
        attack_type: str,
        confidence: float,
        risk_score: int,
        severity: str,
        source_ip: str,
        destination_ip: str,
        port: Any,
        protocol: str,
        raw_log: str = None
    ) -> Dict[str, Any]:
        kb = ATTACK_KNOWLEDGE_BASE.get(attack_type, ATTACK_KNOWLEDGE_BASE["Generic"])

        summary = kb["summary"].format(
            source_ip=source_ip,
            destination_ip=destination_ip,
            port=port,
            protocol=protocol
        )
        impact = kb["impact"]
        recommendations = [
            r.format(
                source_ip=source_ip,
                destination_ip=destination_ip,
                port=port,
                protocol=protocol
            )
            for r in kb["recommendations"]
        ]

        # Construct specific telemetry evidence
        evidence = [
            f"Machine Learning classification identified category as '{attack_type}' with {round(confidence * 100, 1)}% confidence.",
            f"Network Telemetry: Source IP {source_ip} communicating with {destination_ip}:{port} over {protocol}.",
            f"Assigned Risk Score: {risk_score}/100 categorized at {severity} severity level."
        ]

        if raw_log:
            evidence.append(f"Derived from raw log snippet: '{raw_log[:120]}...'")

        return {
            "attack_type": attack_type,
            "risk_score": risk_score,
            "severity": severity,
            "incident_summary": summary,
            "evidence": evidence,
            "potential_impact": impact,
            "investigation_recommendations": recommendations,
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "provider": "AI-Cybersecurity-Knowledge-Engine"
        }

    def _call_groq(self, data: Dict[str, Any]) -> Dict[str, Any]:
        from groq import Groq
        client = Groq(api_key=self.groq_api_key)
        prompt = f"""You are an expert SOC Cybersecurity Analyst. Analyze this incident:
Attack Type: {data.get('attack_type')}
Confidence: {data.get('confidence')}
Risk Score: {data.get('risk_score')}
Severity: {data.get('severity')}
Source IP: {data.get('source_ip')}
Destination IP: {data.get('destination_ip')}
Port: {data.get('port') or data.get('destination_port')}
Protocol: {data.get('protocol')}

Respond strictly with valid JSON with keys:
"incident_summary" (str), "evidence" (list of str), "potential_impact" (str), "investigation_recommendations" (list of str)."""

        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        content = json.loads(response.choices[0].message.content)
        content["attack_type"] = data.get("attack_type")
        content["risk_score"] = data.get("risk_score")
        content["severity"] = data.get("severity")
        content["generated_at"] = datetime.utcnow().isoformat() + "Z"
        content["provider"] = "Groq (Llama-3.3-70b)"
        return content

    def _call_openai(self, data: Dict[str, Any]) -> Dict[str, Any]:
        from openai import OpenAI
        client = OpenAI(api_key=self.openai_api_key)
        prompt = f"""You are an expert SOC Cybersecurity Analyst. Analyze this incident:
Attack Type: {data.get('attack_type')}
Confidence: {data.get('confidence')}
Risk Score: {data.get('risk_score')}
Severity: {data.get('severity')}
Source IP: {data.get('source_ip')}
Destination IP: {data.get('destination_ip')}
Port: {data.get('port') or data.get('destination_port')}
Protocol: {data.get('protocol')}

Respond strictly with valid JSON with keys:
"incident_summary" (str), "evidence" (list of str), "potential_impact" (str), "investigation_recommendations" (list of str)."""

        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="gpt-4o-mini",
            response_format={"type": "json_object"}
        )
        content = json.loads(response.choices[0].message.content)
        content["attack_type"] = data.get("attack_type")
        content["risk_score"] = data.get("risk_score")
        content["severity"] = data.get("severity")
        content["generated_at"] = datetime.utcnow().isoformat() + "Z"
        content["provider"] = "OpenAI (GPT-4o-mini)"
        return content

# Singleton instance
genai_service = GenAIService()
