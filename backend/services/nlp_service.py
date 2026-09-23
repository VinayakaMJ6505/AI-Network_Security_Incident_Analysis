"""
NLP Log Analysis Service.
Extracts structured security entities (IPs, Ports, Protocols, Usernames, Failed Attempts, etc.)
from unstructured firewall, server, and network security logs.
"""
import re
from typing import Dict, Any, List, Optional
from datetime import datetime

class NLPLogService:
    def __init__(self):
        # Regular expressions for entity extraction
        self.ipv4_pattern = re.compile(r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b')
        self.port_pattern = re.compile(r'(?:port|dstport|dport|dst_port)[:\s=]+(\d{1,5})\b|\b(\d{1,5})/(?:tcp|udp)\b|\busing (?:TCP|UDP) port (\d{1,5})\b', re.IGNORECASE)
        self.protocol_pattern = re.compile(r'\b(TCP|UDP|ICMP|HTTP|HTTPS|SSH|FTP|DNS|ARP|IGMP)\b', re.IGNORECASE)
        self.username_pattern = re.compile(r'(?:user(?:name)?|for user|User)\s*[:=\s]+([a-zA-Z0-9_\-\.]+)', re.IGNORECASE)
        self.failed_attempts_pattern = re.compile(r'(\d+)\s*(?:failed|invalid)\s*(?:attempts?|logins?|auth(?:entication)?)|\bfailed\s*(?:attempts?|logins?)\s*[:=]\s*(\d+)', re.IGNORECASE)
        self.timestamp_pattern = re.compile(r'\b(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)\b')
        self.action_pattern = re.compile(r'\b(blocked|denied|dropped|rejected|allowed|permitted|alert(?:ed)?)\b', re.IGNORECASE)
        
        self.attack_keywords = [
            "brute force", "sql injection", "sqli", "denial of service", "dos", "ddos",
            "cross-site", "xss", "buffer overflow", "shellcode", "backdoor", "trojan",
            "port scan", "reconnaissance", "fuzzer", "exploit", "unauthorized access",
            "rootkit", "worm", "malware", "privilege escalation", "command injection"
        ]

    def extract_entities(self, text: str) -> Dict[str, Any]:
        """
        Parses raw unstructured log text and returns structured fields.
        """
        if not text:
            return {
                "source_ip": None,
                "destination_ip": None,
                "port": None,
                "protocol": "TCP",
                "username": None,
                "failed_attempts": 0,
                "timestamp": None,
                "action": None,
                "keywords_matched": []
            }

        # 1. IP extraction
        ips = self.ipv4_pattern.findall(text)
        src_ip = None
        dst_ip = None

        # Look for explicit from/to markers
        from_match = re.search(r'(?:from|src|source)[:\s=]+(' + self.ipv4_pattern.pattern + r')', text, re.IGNORECASE)
        to_match = re.search(r'(?:to|dst|destination|server)[:\s=]+(' + self.ipv4_pattern.pattern + r')', text, re.IGNORECASE)

        if from_match:
            src_ip = from_match.group(1)
        if to_match:
            dst_ip = to_match.group(1)

        # Fallback to order of appearance
        if not src_ip and len(ips) > 0:
            src_ip = ips[0]
        if not dst_ip and len(ips) > 1:
            dst_ip = ips[1]
        elif not dst_ip and src_ip:
            # Default internal target if not present
            dst_ip = "10.0.0.1"

        # 2. Port extraction
        port = None
        port_match = self.port_pattern.search(text)
        if port_match:
            for g in port_match.groups():
                if g:
                    port = int(g)
                    break
        
        # 3. Protocol extraction
        proto = "TCP"
        proto_match = self.protocol_pattern.search(text)
        if proto_match:
            proto = proto_match.group(1).upper()

        # 4. Username extraction
        username = None
        user_match = self.username_pattern.search(text)
        if user_match:
            username = user_match.group(1).strip()

        # 5. Failed attempts extraction
        failed_attempts = 0
        attempts_match = self.failed_attempts_pattern.search(text)
        if attempts_match:
            for g in attempts_match.groups():
                if g:
                    failed_attempts = int(g)
                    break
        elif "failed password" in text.lower() or "authentication failure" in text.lower():
            failed_attempts = 1

        # 6. Timestamp extraction
        timestamp = None
        time_match = self.timestamp_pattern.search(text)
        if time_match:
            timestamp = time_match.group(1)
        else:
            timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        # 7. Action extraction
        action = None
        act_match = self.action_pattern.search(text)
        if act_match:
            action = act_match.group(1).capitalize()

        # 8. Security Keywords matching
        matched_keywords = [
            kw for kw in self.attack_keywords if re.search(r'\b' + re.escape(kw) + r'\b', text, re.IGNORECASE)
        ]

        # Port heuristics if still not set
        if not port:
            if "ssh" in text.lower() or "port 22" in text.lower():
                port = 22
            elif "http" in text.lower() or "web" in text.lower():
                port = 80
            elif "ssl" in text.lower() or "https" in text.lower():
                port = 443
            elif "dns" in text.lower():
                port = 53
            elif "ftp" in text.lower():
                port = 21
            else:
                port = 80

        return {
            "source_ip": src_ip or "192.168.1.100",
            "destination_ip": dst_ip or "10.0.0.10",
            "port": port,
            "protocol": proto,
            "username": username,
            "failed_attempts": failed_attempts,
            "timestamp": timestamp,
            "action": action or "Alert",
            "keywords_matched": matched_keywords
        }

# Singleton instance
nlp_service = NLPLogService()
