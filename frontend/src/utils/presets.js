/**
 * Pre-configured network event presets for testing the Live Event Analyzer.
 * Each preset provides sample UNSW-NB15 flow parameters to evaluate real-time ML inference.
 */
export const ATTACK_PRESETS = [
  {
    name: 'DoS Traffic Flood',
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
      destination_ip: '10.0.0.5',
      failed_attempts: 0
    }
  },
  {
    name: 'SSH Brute Force Intrusion',
    attackType: 'Exploits',
    params: {
      proto: 'tcp',
      service: 'ssh',
      state: 'CON',
      dur: 1.45,
      sbytes: 12500,
      dbytes: 1420,
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
