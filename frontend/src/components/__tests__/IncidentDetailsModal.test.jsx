import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import IncidentDetailsModal from '../IncidentDetailsModal';

const sampleIncident = {
  id: 'inc-101',
  source_ip: '192.168.1.45',
  destination_ip: '10.0.0.10',
  port: 22,
  protocol: 'TCP',
  attack_type: 'Brute Force',
  confidence: 0.94,
  risk_score: 87,
  severity: 'HIGH',
  timestamp: '2026-09-22 10:15:32',
  extracted_entities: {
    username: 'admin',
    failed_attempts: 35,
    service: 'ssh',
    state: 'CON',
  },
  ai_explanation: {
    summary: 'Detected high-frequency SSH connection attempts resulting in multiple authentication failures.',
    evidence: '35 failed attempts observed over port 22 in under 60 seconds from external IP 192.168.1.45.',
    potential_impact: 'Unauthorized root or administrative access to critical bastion server 10.0.0.10.',
    recommendations: [
      'Immediately isolate source IP 192.168.1.45 at edge firewall.',
      'Temporarily enforce rate-limiting on port 22.',
      'Review authentication logs for user admin.'
    ]
  }
};

describe('IncidentDetailsModal Component', () => {
  it('renders all required incident detail fields according to README', () => {
    render(<IncidentDetailsModal incident={sampleIncident} onClose={() => {}} />);

    // Attack classification & Confidence
    expect(screen.getByText('Brute Force')).toBeInTheDocument();
    expect(screen.getByText(/94%/i)).toBeInTheDocument();

    // Risk score & Severity
    expect(screen.getByText('87')).toBeInTheDocument();
    expect(screen.getAllByText('HIGH').length).toBeGreaterThan(0);

    // Extracted entities
    expect(screen.getByText('192.168.1.45')).toBeInTheDocument();
    expect(screen.getByText('10.0.0.10')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();

    // AI-generated explanation
    expect(screen.getByText(/Detected high-frequency SSH connection attempts/i)).toBeInTheDocument();
    expect(screen.getByText(/35 failed attempts observed over port 22/i)).toBeInTheDocument();
    expect(screen.getByText(/Unauthorized root or administrative access/i)).toBeInTheDocument();

    // Investigation recommendations
    expect(screen.getByText(/Immediately isolate source IP 192.168.1.45/i)).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<IncidentDetailsModal incident={sampleIncident} onClose={handleClose} />);

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('shows a popup message confirming JSON is copied when clicking Copy JSON', async () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    render(<IncidentDetailsModal incident={sampleIncident} onClose={() => {}} />);

    const copyBtn = screen.getByRole('button', { name: /copy json/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(sampleIncident, null, 2)
    );

    // Verify popup message appears
    expect(await screen.findByText(/copied to clipboard/i)).toBeInTheDocument();
  });
});
