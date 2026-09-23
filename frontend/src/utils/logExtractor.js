/**
 * NLP Log Entity Extraction Module
 * Extracts Source IP, Destination IP, Port, Protocol, Timestamp, Username,
 * Failed Attempts, Actions, and Keywords from unstructured log text.
 */

export function extractLogEntities(text) {
  if (!text || typeof text !== 'string') {
    return {};
  }

  const result = {
    source_ip: null,
    destination_ip: null,
    protocol: null,
    port: null,
    username: null,
    failed_attempts: 0,
    timestamp: null,
    action: null,
    keywords: [],
    raw: text.trim(),
  };

  // Timestamp extraction (e.g., 2026-09-22 10:15:32 or ISO)
  const timestampMatch = text.match(/\b\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}\b/);
  if (timestampMatch) {
    result.timestamp = timestampMatch[0];
  } else {
    result.timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  // IP addresses
  const srcMatch = text.match(/(?:from|SRC=|src[:=]|source[:=])\s*([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/i);
  const dstMatch = text.match(/(?:to|DST=|dst[:=]|destination[:=]|server)\s*([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/i);
  const allIps = text.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g) || [];

  if (srcMatch) {
    result.source_ip = srcMatch[1];
  } else if (allIps.length > 0) {
    result.source_ip = allIps[0];
  }

  if (dstMatch) {
    result.destination_ip = dstMatch[1];
  } else if (allIps.length > 1) {
    result.destination_ip = allIps[1];
  }

  // Protocol extraction
  const protoMatch = text.match(/\b(TCP|UDP|ICMP|HTTP|HTTPS|SSH|FTP|DNS)\b/i);
  if (protoMatch) {
    result.protocol = protoMatch[1].toUpperCase();
  }

  // Port extraction (prioritize destination port DPT, then port, then SPT)
  const dptMatch = text.match(/(?:DPT=|dst_port=|destination\s+port)\s*(\d{1,5})/i);
  const genPortMatch = text.match(/\bport\s*[:=]?\s*(\d{1,5})/i) || text.match(/:(\d{2,5})\b/);
  const sptMatch = text.match(/SPT=\s*(\d{1,5})/i);

  if (dptMatch) {
    result.port = parseInt(dptMatch[1], 10);
  } else if (genPortMatch) {
    result.port = parseInt(genPortMatch[1], 10);
  } else if (sptMatch) {
    result.port = parseInt(sptMatch[1], 10);
  }

  // Username extraction (e.g. User admin, user: root)
  const userMatch = text.match(/(?:User|user|account)\s+([a-zA-Z0-9_\-\.]+)/i);
  if (userMatch) {
    result.username = userMatch[1];
  }

  // Failed authentication attempts (e.g. generated 35 failed authentication attempts)
  const failedMatch = text.match(/(\d+)\s+failed\s+(?:authentication\s+|login\s+)?attempts/i);
  if (failedMatch) {
    result.failed_attempts = parseInt(failedMatch[1], 10);
  }

  // Action / status
  if (/blocked|block/i.test(text)) result.action = 'Blocked';
  else if (/drop|dropped/i.test(text)) result.action = 'Dropped';
  else if (/accepted|allow/i.test(text)) result.action = 'Allowed';

  // Attack Keywords
  const KEYWORD_PATTERNS = [
    'SQL injection',
    'brute force',
    'buffer overflow',
    'shellcode',
    'denial of service',
    'dos attack',
    'port scan',
    'reconnaissance',
    'backdoor',
    'unauthorized access',
    'failed authentication'
  ];

  KEYWORD_PATTERNS.forEach(kw => {
    if (new RegExp(kw, 'i').test(text)) {
      result.keywords.push(kw);
    }
  });

  return result;
}

export function parseRawLogStream(stream) {
  if (!stream) return [];
  const lines = stream.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  return lines.map(line => extractLogEntities(line));
}
