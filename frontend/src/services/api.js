/**
 * Real API Client for AI-Powered Network Security Incident Analysis Backend.
 * Connects directly to the FastAPI backend at /api endpoints.
 * All operations communicate with real backend services (ML XGBoost, NLP, Risk, GenAI, MongoDB).
 */

const API_BASE_URL = '/api';

/**
 * Checks if the FastAPI backend service is online.
 * GET /api/health
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return data.status === 'healthy';
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Retrieves aggregate security metrics and charts for the SOC dashboard.
 * GET /api/dashboard
 */
export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/dashboard`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard stats: HTTP ${res.status}`);
  }
  return await res.json();
}

/**
 * Retrieves detected security incidents from the database.
 * GET /api/incidents
 */
export async function fetchIncidents(params = {}) {
  const query = new URLSearchParams();
  if (params.severity) query.append('severity', params.severity);
  if (params.attack_type) query.append('attack_type', params.attack_type);
  if (params.limit) query.append('limit', params.limit);

  const url = `${API_BASE_URL}/incidents${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch incidents: HTTP ${res.status}`);
  }
  return await res.json();
}

/**
 * Retrieves full details and telemetry of a single incident.
 * GET /api/incidents/{id}
 */
export async function fetchIncidentById(id) {
  const res = await fetch(`${API_BASE_URL}/incidents/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch incident ${id}: HTTP ${res.status}`);
  }
  return await res.json();
}

/**
 * Runs live ML inference, entity extraction, risk assessment, and GenAI explanation.
 * POST /api/analyze
 */
export async function analyzeEvent(eventData) {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Analysis failed: HTTP ${res.status}`);
  }

  return await res.json();
}

/**
 * Uploads security logs or dataset files for automated parsing and incident classification.
 * POST /api/log/upload
 */
export async function uploadLog(rawLogText) {
  const res = await fetch(`${API_BASE_URL}/log/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ log: rawLogText }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Log upload failed: HTTP ${res.status}`);
  }

  return await res.json();
}

/**
 * Generates an AI-powered SOC incident explanation with summary, evidence, and remediation steps.
 * POST /api/explain
 */
export async function generateAIExplanation(incidentData) {
  const res = await fetch(`${API_BASE_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incidentData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `AI explanation generation failed: HTTP ${res.status}`);
  }

  return await res.json();
}
