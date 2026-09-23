import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from '../App';

describe('App Integration & Navigation Flow', () => {
  it('renders navbar branding and default dashboard view', async () => {
    render(<App />);

    expect(screen.getByText(/AI Network Security SOC/i)).toBeInTheDocument();
    expect(screen.getByText(/Security Operations Center \(SOC\) Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Detected Attacks/i)).toBeInTheDocument();
  });

  it('switches navigation tabs when clicked', async () => {
    render(<App />);

    // Click on "Live Analyzer" tab
    const analyzerNavButtons = screen.getAllByRole('button', { name: /Live Analyzer/i });
    fireEvent.click(analyzerNavButtons[0]);

    expect(screen.getByText(/Live Event Analyzer \(POST \/api\/analyze\)/i)).toBeInTheDocument();

    // Click on "NLP Log Parser" tab
    const logParserNavButtons = screen.getAllByRole('button', { name: /NLP Log Parser/i });
    fireEvent.click(logParserNavButtons[0]);

    expect(screen.getByText(/NLP Log Parser & Extraction \(POST \/api\/log\/upload\)/i)).toBeInTheDocument();

    // Click on "Threat Analytics" tab
    const analyticsNavButtons = screen.getAllByRole('button', { name: /Threat Analytics/i });
    fireEvent.click(analyticsNavButtons[0]);

    expect(screen.getByText(/Big Data Analytics & PySpark Aggregations/i)).toBeInTheDocument();

    // Click on "Architecture & ML" tab
    const archNavButtons = screen.getAllByRole('button', { name: /Architecture & ML/i });
    fireEvent.click(archNavButtons[0]);

    expect(screen.getByText(/System Architecture & Machine Learning Specifications/i)).toBeInTheDocument();
    expect(screen.getByText(/XGBoost \(Production Final\)/i)).toBeInTheDocument();
  });
});
