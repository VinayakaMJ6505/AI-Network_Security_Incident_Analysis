import React from 'react';
import { getSeverityBadgeClass } from '../utils/riskCalculator';

export default function StatusBadge({ severity, className = '' }) {
  const badgeClass = getSeverityBadgeClass(severity);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase transition-all ${badgeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {severity}
    </span>
  );
}
