import { describe, it, expect } from 'vitest';
import { extractLogEntities, parseRawLogStream } from '../logExtractor';

describe('NLP Log Entity Extraction Module (README Specification)', () => {
  it('extracts exact entities from the canonical README example', () => {
    const rawLog = `2026-09-22 10:15:32
Blocked connection from 192.168.1.45
to server 10.0.0.10 using TCP port 22.
User admin generated 35 failed authentication attempts.`;

    const extracted = extractLogEntities(rawLog);

    expect(extracted.source_ip).toBe('192.168.1.45');
    expect(extracted.destination_ip).toBe('10.0.0.10');
    expect(extracted.protocol).toBe('TCP');
    expect(extracted.port).toBe(22);
    expect(extracted.username).toBe('admin');
    expect(extracted.failed_attempts).toBe(35);
    expect(extracted.timestamp).toContain('2026-09-22 10:15:32');
  });

  it('correctly handles firewall dropped packet log format', () => {
    const rawLog = `2026-09-23 04:12:00 DROP SRC=203.0.113.195 DST=172.16.0.5 PROTO=UDP SPT=54211 DPT=53 LEN=64`;
    const extracted = extractLogEntities(rawLog);

    expect(extracted.source_ip).toBe('203.0.113.195');
    expect(extracted.destination_ip).toBe('172.16.0.5');
    expect(extracted.protocol).toBe('UDP');
    expect(extracted.port).toBe(53);
    expect(extracted.action || extracted.status).toMatch(/DROP|Blocked/i);
  });

  it('identifies keywords and attack signatures in log content', () => {
    const rawLog = `CRITICAL: Detected SQL injection attempt union select null, username, password from users at endpoint /login from 45.33.32.156 to 10.0.0.5:80`;
    const extracted = extractLogEntities(rawLog);

    expect(extracted.source_ip).toBe('45.33.32.156');
    expect(extracted.port).toBe(80);
    expect(extracted.keywords).toContain('SQL injection');
  });

  it('parses multiple log lines into an array of structured event objects', () => {
    const rawLogStream = `2026-09-22 10:15:32 Blocked connection from 192.168.1.45 to server 10.0.0.10 using TCP port 22.
2026-09-22 10:16:01 DROP SRC=198.51.100.12 DST=10.0.0.2 PROTO=ICMP`;

    const parsedEvents = parseRawLogStream(rawLogStream);
    expect(parsedEvents.length).toBe(2);
    expect(parsedEvents[0].source_ip).toBe('192.168.1.45');
    expect(parsedEvents[1].source_ip).toBe('198.51.100.12');
  });
});
