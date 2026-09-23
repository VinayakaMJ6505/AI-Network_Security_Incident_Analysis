import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import MetricCard from '../MetricCard';
import { Shield } from 'lucide-react';

describe('MetricCard Component', () => {
  it('renders title, value, and subtitle correctly', () => {
    render(
      <MetricCard
        title="Total Events"
        value="175,341"
        subtitle="+12.4% vs last hour"
        icon={Shield}
        color="blue"
      />
    );

    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('175,341')).toBeInTheDocument();
    expect(screen.getByText('+12.4% vs last hour')).toBeInTheDocument();
  });

  it('renders badge if provided', () => {
    render(
      <MetricCard
        title="Critical Incidents"
        value="14"
        badge="Requires SOC Action"
        badgeType="danger"
        icon={Shield}
        color="red"
      />
    );

    expect(screen.getByText('Critical Incidents')).toBeInTheDocument();
    expect(screen.getByText('Requires SOC Action')).toBeInTheDocument();
  });
});
