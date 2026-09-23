import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchDashboardStats,
  fetchIncidents,
  fetchIncidentById,
  analyzeEvent,
  uploadLog,
  generateAIExplanation
} from '../api';

describe('Backend API Client & Fallback Simulation Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchDashboardStats returns overview metrics matching README requirements', async () => {
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
    const incidents = await fetchIncidents();
    const id = incidents[0].id;
    const detail = await fetchIncidentById(id);

    expect(detail).toBeDefined();
    expect(detail.id).toBe(id);
    expect(detail).toHaveProperty('confidence');
    expect(detail).toHaveProperty('ai_explanation');
    expect(detail.ai_explanation).toHaveProperty('summary');
    expect(detail.ai_explanation).toHaveProperty('recommendations');
  });

  it('analyzeEvent performs ML inference and risk assessment for input parameters', async () => {
    const sampleEvent = {
      proto: 'tcp',
      service: 'ssh',
      state: 'CON',
      sbytes: 14200,
      dbytes: 2040,
      spkts: 120,
      dpkts: 85,
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
    const logText = '2026-09-22 10:15:32 Blocked connection from 192.168.1.45 to server 10.0.0.10 using TCP port 22. User admin generated 35 failed authentication attempts.';
    const result = await uploadLog(logText);

    expect(result).toHaveProperty('extracted_entities');
    expect(result.extracted_entities.source_ip).toBe('192.168.1.45');
    expect(result.extracted_entities.port).toBe(22);
    expect(result).toHaveProperty('incident');
  });

  it('generateAIExplanation creates detailed summary, evidence, and recommendations', async () => {
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
