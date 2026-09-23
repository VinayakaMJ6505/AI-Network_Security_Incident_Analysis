/**
 * Realistic UNSW-NB15 dataset mock data & simulation generators
 * Follows exact categories from the project notebook:
 * Normal (56k), Generic (40k), Exploits (33k), Fuzzers (18k), DoS (12k),
 * Reconnaissance (10k), Analysis (2k), Backdoor (1.7k), Shellcode (1.1k), Worms (130)
 */

export const INITIAL_DASHBOARD_STATS = {
  total_events: 175341,
  detected_attacks: 119341,
  high_risk_incidents: 24150,
  critical_incidents: 6412,
  attack_percentage: 68.06,
  model_accuracy: 97.42,
  avg_detection_time_ms: 12.4,
  attack_distribution: [
    { category: 'Normal', count: 56000, percentage: 31.9, color: '#10b981' },
    { category: 'Generic', count: 40000, percentage: 22.8, color: '#3b82f6' },
    { category: 'Exploits', count: 33393, percentage: 19.0, color: '#f59e0b' },
    { category: 'Fuzzers', count: 18184, percentage: 10.4, color: '#8b5cf6' },
    { category: 'DoS', count: 12264, percentage: 7.0, color: '#ef4444' },
    { category: 'Reconnaissance', count: 10491, percentage: 6.0, color: '#06b6d4' },
    { category: 'Analysis', count: 2000, percentage: 1.1, color: '#ec4899' },
    { category: 'Backdoor', count: 1746, percentage: 1.0, color: '#f97316' },
    { category: 'Shellcode', count: 1133, percentage: 0.6, color: '#e11d48' },
    { category: 'Worms', count: 130, percentage: 0.1, color: '#9333ea' },
  ],
  attack_trends: [
    { time: '00:00', normal: 2400, attack: 1100, highRisk: 180 },
    { time: '03:00', normal: 1800, attack: 1400, highRisk: 290 },
    { time: '06:00', normal: 3100, attack: 2200, highRisk: 420 },
    { time: '09:00', normal: 5400, attack: 4100, highRisk: 860 },
    { time: '12:00', normal: 6200, attack: 4900, highRisk: 1120 },
    { time: '15:00', normal: 5800, attack: 4600, highRisk: 950 },
    { time: '18:00', normal: 4900, attack: 3800, highRisk: 740 },
    { time: '21:00', normal: 3600, attack: 2800, highRisk: 510 },
  ],
  top_sources: [
    { ip: '192.168.1.45', count: 1420, attackType: 'Exploits', country: 'Internal LAN' },
    { ip: '45.33.32.156', count: 980, attackType: 'DoS', country: 'US' },
    { ip: '185.220.101.5', count: 874, attackType: 'Reconnaissance', country: 'DE' },
    { ip: '103.251.167.20', count: 640, attackType: 'Backdoor', country: 'RU' },
    { ip: '198.51.100.77', count: 512, attackType: 'Shellcode', country: 'NL' },
  ],
  top_ports: [
    { port: 22, service: 'SSH', count: 3410, risk: 'Critical' },
    { port: 80, service: 'HTTP', count: 2890, risk: 'High' },
    { port: 443, service: 'HTTPS', count: 2150, risk: 'Medium' },
    { port: 445, service: 'SMB', count: 1890, risk: 'Critical' },
    { port: 3389, service: 'RDP', count: 1240, risk: 'High' },
  ]
};

export const INITIAL_INCIDENTS = [
  {
    id: 'INC-2026-001',
    source_ip: '192.168.1.45',
    destination_ip: '10.0.0.10',
    port: 22,
    protocol: 'TCP',
    service: 'ssh',
    state: 'CON',
    attack_type: 'Exploits',
    confidence: 0.94,
    risk_score: 87,
    severity: 'HIGH',
    timestamp: '2026-09-22 10:15:32',
    extracted_entities: {
      username: 'admin',
      failed_attempts: 35,
      protocol: 'TCP',
      port: 22,
      action: 'Blocked'
    },
    ai_explanation: {
      summary: 'Multiple high-velocity SSH authentication attempts detected from internal host targeting server 10.0.0.10.',
      evidence: '35 failed password exchanges in under 45 seconds using automated credential dictionary.',
      potential_impact: 'High probability of lateral credential compromise and privilege escalation.',
      recommendations: [
        'Isolate host 192.168.1.45 from internal VLAN 10.',
        'Temporarily disable password authentication in sshd_config and enforce public keys.',
        'Rotate all privileged administrative credentials on target server 10.0.0.10.'
      ]
    }
  },
  {
    id: 'INC-2026-002',
    source_ip: '45.33.32.156',
    destination_ip: '10.0.0.5',
    port: 80,
    protocol: 'TCP',
    service: 'http',
    state: 'INT',
    attack_type: 'DoS',
    confidence: 0.98,
    risk_score: 94,
    severity: 'CRITICAL',
    timestamp: '2026-09-22 10:18:05',
    extracted_entities: {
      username: 'anonymous',
      failed_attempts: 0,
      protocol: 'TCP',
      port: 80,
      action: 'Dropped'
    },
    ai_explanation: {
      summary: 'High-frequency SYN Flood Denial-of-Service targeting external HTTP web portal.',
      evidence: 'Symmetric SYN packet rate exceeded 48,000 pkts/sec without ACK completions.',
      potential_impact: 'Service degradation and web server socket resource starvation.',
      recommendations: [
        'Activate SYN-proxy protection and anti-spoofing filter at upstream edge firewall.',
        'Drop all ingress packets originating from CIDR 45.33.32.0/24.',
        'Verify web server worker pool status and scale backend replicas.'
      ]
    }
  },
  {
    id: 'INC-2026-003',
    source_ip: '185.220.101.5',
    destination_ip: '10.0.0.15',
    port: 445,
    protocol: 'TCP',
    service: 'smb',
    state: 'FIN',
    attack_type: 'Reconnaissance',
    confidence: 0.91,
    risk_score: 72,
    severity: 'HIGH',
    timestamp: '2026-09-22 10:22:18',
    extracted_entities: {
      username: 'guest',
      failed_attempts: 8,
      protocol: 'TCP',
      port: 445,
      action: 'Blocked'
    },
    ai_explanation: {
      summary: 'Port sweeping and SMB share enumeration detected across private subnet.',
      evidence: 'Sequential probing of ports 139, 445, and 3389 across consecutive host IPs.',
      potential_impact: 'Network topology discovery and identification of unpatched SMBv1 services.',
      recommendations: [
        'Block inbound SMB traffic from untrusted networks and WAN.',
        'Inspect host endpoint for active Nmap scanning signatures.',
        'Ensure SMB signing and encryption are strictly enforced.'
      ]
    }
  },
  {
    id: 'INC-2026-004',
    source_ip: '103.251.167.20',
    destination_ip: '10.0.0.22',
    port: 4444,
    protocol: 'TCP',
    service: 'shell',
    state: 'CON',
    attack_type: 'Shellcode',
    confidence: 0.96,
    risk_score: 96,
    severity: 'CRITICAL',
    timestamp: '2026-09-22 10:25:40',
    extracted_entities: {
      username: 'www-data',
      failed_attempts: 2,
      protocol: 'TCP',
      port: 4444,
      action: 'Blocked'
    },
    ai_explanation: {
      summary: 'Reverse shell payload execution detected targeting reverse TCP listener on port 4444.',
      evidence: 'Binary shellcode payload pattern (NOP sled + execve /bin/sh) identified in payload.',
      potential_impact: 'Interactive root command shell established with external adversary control node.',
      recommendations: [
        'Immediately sever active socket connection and isolate affected container.',
        'Capture volatile memory dump for forensic analysis.',
        'Inspect web root directory for newly uploaded webshell backdoors.'
      ]
    }
  },
  {
    id: 'INC-2026-005',
    source_ip: '198.51.100.77',
    destination_ip: '10.0.0.8',
    port: 21,
    protocol: 'TCP',
    service: 'ftp',
    state: 'REQ',
    attack_type: 'Fuzzers',
    confidence: 0.88,
    risk_score: 58,
    severity: 'MEDIUM',
    timestamp: '2026-09-22 10:30:11',
    extracted_entities: {
      username: 'ftpuser',
      failed_attempts: 12,
      protocol: 'TCP',
      port: 21,
      action: 'Blocked'
    },
    ai_explanation: {
      summary: 'Protocol fuzzing attempt detected with malformed FTP command sequences.',
      evidence: 'Oversized command buffers (>4096 bytes) sent to FTP control channel.',
      potential_impact: 'Potential buffer overflow or daemon crash resulting in local denial of service.',
      recommendations: [
        'Patch FTP daemon to latest security release.',
        'Configure connection limit per IP address in FTP configuration.',
        'Enable core dump monitoring on application host.'
      ]
    }
  },
  {
    id: 'INC-2026-006',
    source_ip: '192.168.1.100',
    destination_ip: '10.0.0.1',
    port: 443,
    protocol: 'TCP',
    service: 'https',
    state: 'CON',
    attack_type: 'Normal',
    confidence: 0.99,
    risk_score: 12,
    severity: 'LOW',
    timestamp: '2026-09-22 10:35:00',
    extracted_entities: {
      username: 'employee_01',
      failed_attempts: 0,
      protocol: 'TCP',
      port: 443,
      action: 'Allowed'
    },
    ai_explanation: {
      summary: 'Legitimate standard HTTPS web application traffic.',
      evidence: 'Standard TLS 1.3 handshake parameters with expected payload size distributions.',
      potential_impact: 'None. Normal operational behavior.',
      recommendations: [
        'No intervention required. Retain logs in accordance with standard compliance retention.'
      ]
    }
  }
];

export const ATTACK_PRESETS = [
  {
    name: 'SYN Flood DoS Attack',
    attackType: 'DoS',
    params: {
      proto: 'tcp',
      service: 'http',
      state: 'INT',
      dur: 0.000008,
      sbytes: 184000,
      dbytes: 0,
      spkts: 2400,
      dpkts: 0,
      sload: 184000000,
      port: 80,
      source_ip: '45.33.32.156',
      destination_ip: '10.0.0.5'
    }
  },
  {
    name: 'SSH Brute Force Exploitation',
    attackType: 'Exploits',
    params: {
      proto: 'tcp',
      service: 'ssh',
      state: 'CON',
      dur: 14.2,
      sbytes: 14200,
      dbytes: 8400,
      spkts: 140,
      dpkts: 120,
      sload: 12000,
      port: 22,
      source_ip: '192.168.1.45',
      destination_ip: '10.0.0.10',
      failed_attempts: 35
    }
  },
  {
    name: 'SMB Port Scan Reconnaissance',
    attackType: 'Reconnaissance',
    params: {
      proto: 'tcp',
      service: 'smb',
      state: 'REQ',
      dur: 0.0012,
      sbytes: 240,
      dbytes: 0,
      spkts: 4,
      dpkts: 0,
      sload: 800000,
      port: 445,
      source_ip: '185.220.101.5',
      destination_ip: '10.0.0.15'
    }
  },
  {
    name: 'Reverse Shellcode Delivery',
    attackType: 'Shellcode',
    params: {
      proto: 'tcp',
      service: 'shell',
      state: 'CON',
      dur: 5.6,
      sbytes: 3200,
      dbytes: 2800,
      spkts: 35,
      dpkts: 28,
      sload: 45000,
      port: 4444,
      source_ip: '103.251.167.20',
      destination_ip: '10.0.0.22'
    }
  },
  {
    name: 'Normal HTTPS Browsing',
    attackType: 'Normal',
    params: {
      proto: 'tcp',
      service: 'https',
      state: 'CON',
      dur: 0.85,
      sbytes: 1420,
      dbytes: 28400,
      spkts: 18,
      dpkts: 24,
      sload: 13364,
      port: 443,
      source_ip: '192.168.1.100',
      destination_ip: '10.0.0.1'
    }
  }
];
