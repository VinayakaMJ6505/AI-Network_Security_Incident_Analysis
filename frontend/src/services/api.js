import { INITIAL_DASHBOARD_STATS, INITIAL_INCIDENTS } from './mockData';
import { calculateRiskScore } from '../utils/riskCalculator';
import { extractLogEntities } from '../utils/logExtractor';

const API_BASE_URL = '/api';

// In-memory incidents store for simulation mode
let incidentsStore = [...INITIAL_INCIDENTS];

// Helper to check if backend is online
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`, { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

/**
 * GET /api/dashboard
 */
export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back to simulation data
  }
  return INITIAL_DASHBOARD_STATS;
}

/**
 * GET /api/incidents
 */
export async function fetchIncidents() {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back
  }
  return incidentsStore;
}

/**
 * GET /api/incidents/{id}
 */
export async function fetchIncidentById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back
  }
  return incidentsStore.find((inc) => inc.id === id) || null;
}

/**
 * POST /api/analyze
 */
export async function analyzeEvent(eventData) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back
  }

  // Local simulation of ML inference + Risk score + GenAI
  return simulateAnalysis(eventData);
}

/**
 * POST /api/log/upload
 */
export async function uploadLog(rawLogText) {
  const extracted = extractLogEntities(rawLogText);

  try {
    const res = await fetch(`${API_BASE_URL}/log/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log: rawLogText, entities: extracted }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back
  }

  // Create simulated incident from log
  let attackType = 'Exploits';
  if (extracted.keywords?.includes('SQL injection')) attackType = 'Exploits';
  else if (extracted.failed_attempts > 10) attackType = 'Exploits';
  else if (extracted.port === 4444) attackType = 'Shellcode';
  else if (extracted.protocol === 'UDP' && extracted.port === 53) attackType = 'Generic';

  const confidence = 0.92;
  const { score, severity } = calculateRiskScore({
    attackType,
    confidence,
    port: extracted.port || 80,
    failedAttempts: extracted.failed_attempts || 0,
  });

  const aiExplanation = await generateAIExplanation({
    attack_type: attackType,
    confidence,
    risk_score: score,
    source_ip: extracted.source_ip || 'Unknown',
    port: extracted.port || 80,
    protocol: extracted.protocol || 'TCP',
    failed_attempts: extracted.failed_attempts,
  });

  const newIncident = {
    id: `INC-LOG-${Date.now().toString().slice(-4)}`,
    source_ip: extracted.source_ip || '192.168.1.50',
    destination_ip: extracted.destination_ip || '10.0.0.10',
    port: extracted.port || 80,
    protocol: extracted.protocol || 'TCP',
    attack_type: attackType,
    confidence,
    risk_score: score,
    severity,
    timestamp: extracted.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
    extracted_entities: extracted,
    ai_explanation: aiExplanation,
  };

  incidentsStore = [newIncident, ...incidentsStore];

  return {
    success: true,
    extracted_entities: extracted,
    incident: newIncident,
  };
}

/**
 * POST /api/explain
 */
export async function generateAIExplanation(incidentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back
  }

  // Dynamic simulation of GenAI explanation
  const attack = incidentData.attack_type || 'Generic';
  const targetPort = incidentData.port || 80;
  const src = incidentData.source_ip || 'External Node';

  return {
    summary: `GenAI Incident Report: Detected ${attack} activity originating from ${src} targeting port ${targetPort} (${incidentData.protocol || 'TCP'}). High behavioral anomalies observed.`,
    evidence: `Classification confidence ${Math.round((incidentData.confidence || 0.9) * 100)}% with risk score ${incidentData.risk_score || 75}/100. Matching signatures against UNSW-NB15 classifier.`,
    potential_impact: `Risk of unauthorized access, service interruption, or privilege escalation across the affected network segment.`,
    recommendations: [
      `Block incoming traffic from IP ${src} at perimeter router and host firewall.`,
      `Review server logs for port ${targetPort} to determine if any payload succeeded.`,
      `Verify integrity of host configuration files and execute secondary malware scan.`,
      `Document incident resolution in ticket system and notify security operations team.`
    ],
  };
}

function simulateAnalysis(eventData) {
  let attackType = 'Normal';
  let confidence = 0.96;

  // Heuristic based on UNSW-NB15 typical distributions
  if (eventData.sbytes > 100000 || eventData.sload > 10000000) {
    attackType = 'DoS';
    confidence = 0.98;
  } else if (eventData.service === 'ssh' && (eventData.failed_attempts > 5 || eventData.spkts > 80)) {
    attackType = 'Exploits';
    confidence = 0.94;
  } else if (eventData.port === 4444 || eventData.service === 'shell') {
    attackType = 'Shellcode';
    confidence = 0.97;
  } else if (eventData.service === 'smb' && eventData.state === 'REQ') {
    attackType = 'Reconnaissance';
    confidence = 0.91;
  } else if (eventData.dur > 10 && eventData.dbytes < 100) {
    attackType = 'Fuzzers';
    confidence = 0.89;
  }

  const { score, severity } = calculateRiskScore({
    attackType,
    confidence,
    port: eventData.port || 80,
    failedAttempts: eventData.failed_attempts || 0,
  });

  const explanation = {
    summary: `Simulated XGBoost Inference: Traffic pattern evaluated as ${attackType} with ${(confidence * 100).toFixed(1)}% confidence.`,
    evidence: `Evaluation of ${eventData.proto || 'TCP'} session over service ${eventData.service || 'unknown'}, state ${eventData.state || 'CON'}.`,
    potential_impact: attackType === 'Normal' ? 'No impact detected.' : 'Elevated risk of service disruption or intrusion attempt.',
    recommendations: attackType === 'Normal'
      ? ['Allow traffic and continue standard telemetry monitoring.']
      : [
          `Quarantine origin IP address ${eventData.source_ip || 'source'}.`,
          `Validate firewall state table for port ${eventData.port || 80}.`,
          `Trigger deep packet inspection on subsequent flows.`
        ]
  };

  return {
    attack_type: attackType,
    confidence,
    risk_score: score,
    severity,
    ai_explanation: explanation,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
}
