import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import RecentIncidentsTable from '../RecentIncidentsTable';

const mockIncidents = [
  {
    id: 'inc-001',
    source_ip: '192.168.1.45',
    destination_ip: '10.0.0.10',
    port: 22,
    protocol: 'TCP',
    attack_type: 'Exploits',
    risk_score: 87,
    severity: 'HIGH',
    timestamp: '2026-09-22 10:15:32',
  },
  {
    id: 'inc-002',
    source_ip: '45.33.32.156',
    destination_ip: '10.0.0.5',
    port: 80,
    protocol: 'TCP',
    attack_type: 'DoS',
    risk_score: 94,
    severity: 'CRITICAL',
    timestamp: '2026-09-22 10:18:05',
  },
  {
    id: 'inc-003',
    source_ip: '192.168.1.100',
    destination_ip: '10.0.0.1',
    port: 443,
    protocol: 'TCP',
    attack_type: 'Normal',
    risk_score: 12,
    severity: 'LOW',
    timestamp: '2026-09-22 10:19:10',
  }
];

describe('RecentIncidentsTable Component', () => {
  it('renders table headers and rows according to README', () => {
    render(<RecentIncidentsTable incidents={mockIncidents} onSelectIncident={() => {}} />);

    expect(screen.getByText('Source IP')).toBeInTheDocument();
    expect(screen.getByText('Attack Type')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();

    expect(screen.getByText('192.168.1.45')).toBeInTheDocument();
    expect(screen.getByText('45.33.32.156')).toBeInTheDocument();
    expect(screen.getAllByText('Exploits').length).toBeGreaterThan(0);
    expect(screen.getAllByText('DoS').length).toBeGreaterThan(0);
  });

  it('filters rows based on search input', () => {
    render(<RecentIncidentsTable incidents={mockIncidents} onSelectIncident={() => {}} />);

    const searchInput = screen.getByPlaceholderText(/search by ip, attack, or port/i);
    fireEvent.change(searchInput, { target: { value: '45.33.32.156' } });

    expect(screen.getByText('45.33.32.156')).toBeInTheDocument();
    expect(screen.queryByText('192.168.1.45')).not.toBeInTheDocument();
  });

  it('invokes onSelectIncident when clicking an incident row', () => {
    const handleSelect = vi.fn();
    render(<RecentIncidentsTable incidents={mockIncidents} onSelectIncident={handleSelect} />);

    // Table defaults to timestamp desc, so inc-003 (10:19:10) is the first row
    const viewButton = screen.getAllByRole('button', { name: /inspect/i })[0];
    fireEvent.click(viewButton);

    expect(handleSelect).toHaveBeenCalledWith(mockIncidents[2]);
  });
});
