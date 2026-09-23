import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill ResizeObserver for recharts / JSDOM
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Polyfill global fetch in JSDOM environment
globalThis.fetch = vi.fn().mockImplementation((url) => {
  const urlStr = String(url);
  if (urlStr.includes('/health')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({ status: 'healthy', ml_model_loaded: true, storage_mode: 'test' }),
    });
  }
  if (urlStr.includes('/dashboard')) {
    return Promise.resolve({
      ok: true,
      json: async () => ({
        total_events: 10,
        detected_attacks: 8,
        high_risk_incidents: 3,
        critical_incidents: 2,
        attack_percentage: 80.0,
        model_accuracy: 97.42,
        avg_detection_time_ms: 12.4,
        overview: { total_events: 10, detected_attacks: 8, high_risk_incidents: 3, critical_incidents: 2 },
        attack_distribution: [{ category: 'Exploits', attack_type: 'Exploits', count: 5, percentage: 50.0, color: '#f59e0b' }],
        attack_trends: [{ time: '10:00', time_label: '10:00', normal: 2, attack: 4, highRisk: 1 }],
        recent_incidents: [],
        top_ports: [],
        top_sources: []
      }),
    });
  }
  if (urlStr.includes('/incidents')) {
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  }
  return Promise.resolve({
    ok: true,
    json: async () => ({}),
  });
});
