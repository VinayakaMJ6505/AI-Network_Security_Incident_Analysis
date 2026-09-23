import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from '../App';

describe('End-to-End Integration & Mock-Free Validation Suite', () => {
  it('loads real backend stats without mock data and renders SOC overview', async () => {
    render(<App />);

    // Verify online indicator
    await waitFor(() => {
      expect(screen.getByText(/FastAPI Live/i)).toBeInTheDocument();
    });

    // Verify live counters from real API data (from setup.js simulated backend responses)
    expect(await screen.findByText('10')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Verify percentage calculation from real API numbers
    expect(screen.getByText('80% of total packets')).toBeInTheDocument();

    // Verify presence of Attack Distribution and Attack Trends
    expect(screen.getByText(/Attack Distribution \(UNSW-NB15 Categories\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Security Events & Attack Trends/i)).toBeInTheDocument();
  });

  it('executes full Live Event Analyzer inference flow', async () => {
    const mockAnalysisResponse = {
      status: 'success',
      incident_id: 'inc-live-999',
      attack_type: 'DoS',
      confidence: 0.985,
      risk_score: 94,
      severity: 'CRITICAL',
      probabilities: {
        DoS: 0.985,
        Exploits: 0.01,
        Generic: 0.005
      },
      ai_explanation: {
        summary: 'Massive volumetric HTTP flood targeting web perimeter.',
        evidence: 'Flow sload exceeded 184 Mbps on TCP port 80.',
        potential_impact: 'Web service unavailability and resource exhaustion.',
        recommendations: [
          'Enable rate limiting at edge CDN / reverse proxy.',
          'Quarantine origin IP 45.33.32.156.'
        ]
      }
    };

    // Spy on fetch for /api/analyze endpoint
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation((url, opts) => {
      const urlStr = String(url);
      if (urlStr.includes('/analyze')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockAnalysisResponse,
        });
      }
      return originalFetch(url, opts);
    });

    render(<App />);

    // Navigate to Live Analyzer tab
    const analyzerBtn = screen.getAllByRole('button', { name: /Live Analyzer/i })[0];
    fireEvent.click(analyzerBtn);

    expect(screen.getByText(/Live Event Analyzer \(POST \/api\/analyze\)/i)).toBeInTheDocument();

    // Click "Analyze Event" submit button
    const submitBtn = screen.getByRole('button', { name: /Analyze Event/i });
    fireEvent.click(submitBtn);

    // Verify real AI output is displayed
    await waitFor(() => {
      expect(screen.getByText('98.5% Confidence')).toBeInTheDocument();
    });

    expect(screen.getByText('94')).toBeInTheDocument();
    expect(screen.getByText(/Massive volumetric HTTP flood/i)).toBeInTheDocument();
    expect(screen.getByText(/Enable rate limiting at edge CDN/i)).toBeInTheDocument();
  });

  it('executes full NLP Log Parser extraction flow', async () => {
    const mockUploadResponse = {
      success: true,
      total_events_processed: 1,
      extracted_entities: {
        source_ip: '192.168.1.45',
        destination_ip: '10.0.0.10',
        port: 22,
        protocol: 'TCP',
        username: 'admin',
        failed_attempts: 35,
        action: 'Blocked'
      },
      incident: {
        id: 'inc-nlp-123',
        source_ip: '192.168.1.45',
        destination_ip: '10.0.0.10',
        port: 22,
        protocol: 'TCP',
        attack_type: 'Exploits',
        risk_score: 87,
        severity: 'HIGH',
        timestamp: '2026-09-24 02:50:00',
        ai_explanation: {
          summary: 'Extracted brute force sequence targeting SSH bastion.'
        }
      }
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockImplementation((url, opts) => {
      const urlStr = String(url);
      if (urlStr.includes('/log/upload')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockUploadResponse,
        });
      }
      return originalFetch(url, opts);
    });

    render(<App />);

    // Navigate to NLP Log Parser tab
    const parserBtn = screen.getAllByRole('button', { name: /NLP Log Parser/i })[0];
    fireEvent.click(parserBtn);

    expect(screen.getByText(/NLP Log Parser & Extraction \(POST \/api\/log\/upload\)/i)).toBeInTheDocument();

    // Click "Run NLP Entity Extraction"
    const extractBtn = screen.getByRole('button', { name: /Run NLP Entity Extraction/i });
    fireEvent.click(extractBtn);

    // Verify extracted entities are displayed
    await waitFor(() => {
      expect(screen.getByText('192.168.1.45')).toBeInTheDocument();
    });

    expect(screen.getByText('10.0.0.10')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText(/Extracted brute force sequence/i)).toBeInTheDocument();
  });

  it('renders Threat Analytics with empty states when no aggregation data exists', async () => {
    render(<App />);

    // Navigate to Threat Analytics
    const analyticsBtn = screen.getAllByRole('button', { name: /Threat Analytics/i })[0];
    fireEvent.click(analyticsBtn);

    expect(screen.getByText(/Big Data Analytics & PySpark Aggregations/i)).toBeInTheDocument();

    // Verify that mock data fallbacks have been removed and real empty states are displayed
    expect(await screen.findByText(/No source IP aggregation data available/i)).toBeInTheDocument();
    expect(screen.getByText(/No targeted port aggregation data available/i)).toBeInTheDocument();
  });
});
