import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchDashboardStats,
  fetchIncidents,
  fetchIncidentById,
  analyzeEvent,
  uploadLog,
  generateAIExplanation
} from '../api';

const MOCK_BACKEND_DASHBOARD = {
  total_events: 10,
  detected_attacks: 8,
  high_risk_incidents: 3,
  critical_incidents: 2,
  attack_percentage: 80.0,
  model_accuracy: 97.42,
  overview: {
    total_events: 10,
    detected_attacks: 8,
    high_risk_incidents: 3,
    critical_incidents: 2,
  },
  attack_distribution: [
    { category: 'Exploits', attack_type: 'Exploits', count: 5, percentage: 50.0, color: '#f59e0b' },
    { category: 'DoS', attack_type: 'DoS', count: 3, percentage: 30.0, color: '#ef4444' },
    { category: 'Normal', attack_type: 'Normal', count: 2, percentage: 20.0, color: '#10b981' }
  ],
  attack_trends: [
    { time: '10:00', time_label: '10:00', normal: 2, attack: 4, highRisk: 1 },
    { time: '11:00', time_label: '11:00', normal: 0, attack: 4, highRisk: 2 }
  ],
  recent_incidents: [
    { id: 'inc-001', source_ip: '192.168.1.45', destination_ip: '10.0.0.10', port: 22, attack_type: 'Exploits', risk_score: 87, severity: 'HIGH', timestamp: '2026-09-22T10:15:32Z' }
  ],
  top_ports: [
    { port: 22, service: 'SSH', count: 5, risk: 'Critical' }
  ],
  top_sources: [
    { ip: '192.168.1.45', count: 5, attackType: 'Exploits', country: 'LAN' }
  ]
};

const MOCK_BACKEND_INCIDENT = {
  id: 'inc-001',
  source_ip: '192.168.1.45',
  destination_ip: '10.0.0.10',
  port: 22,
  protocol: 'TCP',
  attack_type: 'Exploits',
  confidence: 0.94,
  risk_score: 87,
  severity: 'HIGH',
  timestamp: '2026-09-22T10:15:32Z',
  status: 'detected',
  ai_explanation: {
    summary: 'Exploits activity detected targeting SSH service on port 22.',
    incident_summary: 'Exploits activity detected targeting SSH service on port 22.',
    evidence: ['Machine Learning confidence 94%'],
    potential_impact: 'Potential arbitrary code execution and privilege escalation.',
    recommendations: ['Isolate source IP 192.168.1.45'],
    investigation_recommendations: ['Isolate source IP 192.168.1.45']
  }
};

describe('Backend API Client Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchDashboardStats returns overview metrics matching README requirements', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_BACKEND_DASHBOARD,
    });

    const stats = await fetchDashboardStats();
    expect(stats).toHaveProperty('total_events');
    expect(stats).toHaveProperty('detected_attacks');
    expect(stats).toHaveProperty('high_risk_incidents');
    expect(stats).toHaveProperty('critical_incidents');
    expect(stats).toHaveProperty('attack_distribution');
    expect(stats).toHaveProperty('attack_trends');
    expect(Array.isArray(stats.attack_distribution)).toBe(true);
    expect(Array.isArray(stats.attack_trends)).toBe(true);
  });

  it('fetchIncidents returns incident list with required fields', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => [MOCK_BACKEND_INCIDENT],
    });

    const incidents = await fetchIncidents();
    expect(Array.isArray(incidents)).toBe(true);
    expect(incidents.length).toBeGreaterThan(0);

    const first = incidents[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('source_ip');
    expect(first).toHaveProperty('attack_type');
    expect(first).toHaveProperty('risk_score');
    expect(first).toHaveProperty('severity');
    expect(first).toHaveProperty('timestamp');
  });

  it('fetchIncidentById returns a full incident detail object', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_BACKEND_INCIDENT,
    });

    const detail = await fetchIncidentById('inc-001');

    expect(detail).toBeDefined();
    expect(detail.id).toBe('inc-001');
    expect(detail).toHaveProperty('confidence');
    expect(detail).toHaveProperty('ai_explanation');
    expect(detail.ai_explanation).toHaveProperty('summary');
    expect(detail.ai_explanation).toHaveProperty('recommendations');
  });

  it('analyzeEvent performs ML inference and risk assessment for input parameters', async () => {
    const mockAnalyzeRes = {
      incident_id: 'inc-live-01',
      attack_type: 'Exploits',
      is_attack: true,
      confidence: 0.94,
      risk_score: 87,
      severity: 'HIGH',
      ai_explanation: {
        summary: 'Exploit detected on SSH port 22.',
        recommendations: ['Block source IP.']
      }
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockAnalyzeRes,
    });

    const sampleEvent = {
      proto: 'tcp',
      service: 'ssh',
      port: 22,
    };

    const result = await analyzeEvent(sampleEvent);
    expect(result).toHaveProperty('attack_type');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('risk_score');
    expect(result).toHaveProperty('severity');
    expect(result).toHaveProperty('ai_explanation');
  });

  it('uploadLog parses raw log, extracts entities, and creates an incident', async () => {
    const mockUploadRes = {
      status: 'success',
      success: true,
      total_events_processed: 1,
      detected_attacks: 1,
      extracted_entities: {
        source_ip: '192.168.1.45',
        port: 22,
        protocol: 'TCP'
      },
      incident: MOCK_BACKEND_INCIDENT
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockUploadRes,
    });

    const logText = 'Blocked connection from 192.168.1.45 port 22';
    const result = await uploadLog(logText);

    expect(result).toHaveProperty('extracted_entities');
    expect(result.extracted_entities.source_ip).toBe('192.168.1.45');
    expect(result.extracted_entities.port).toBe(22);
    expect(result).toHaveProperty('incident');
  });

  it('generateAIExplanation creates detailed summary, evidence, and recommendations', async () => {
    const mockExplainRes = {
      attack_type: 'DoS',
      risk_score: 87,
      severity: 'CRITICAL',
      summary: 'Denial of service detected.',
      evidence: ['94% ML confidence'],
      potential_impact: 'High resource exhaustion.',
      recommendations: ['Deploy upstream ACL rate limit.']
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockExplainRes,
    });

    const incidentData = {
      attack_type: 'DoS',
      confidence: 0.94,
      risk_score: 87,
      source_ip: '192.168.1.45',
      port: 80,
      protocol: 'TCP'
    };

    const explanation = await generateAIExplanation(incidentData);
    expect(explanation).toHaveProperty('summary');
    expect(explanation).toHaveProperty('evidence');
    expect(explanation).toHaveProperty('potential_impact');
    expect(explanation).toHaveProperty('recommendations');
    expect(Array.isArray(explanation.recommendations)).toBe(true);
    expect(explanation.recommendations.length).toBeGreaterThan(0);
  });
});
