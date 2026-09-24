import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/cn';

const SEVERITY_DOT = {
  LOW: 'bg-severity-low',
  MEDIUM: 'bg-severity-medium',
  HIGH: 'bg-severity-high',
  CRITICAL: 'bg-severity-critical',
};

function relativeTime(timestamp) {
  if (!timestamp) return 'unknown';
  const parsed = new Date(timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return timestamp;
  try {
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch (e) {
    return timestamp;
  }
}

export default function LiveIncidentStream({ incidents = [], onSelectIncident }) {
  if (incidents.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
        <ShieldAlert className="mb-2 h-6 w-6 text-primary opacity-30" />
        <p className="text-xs">No live incident telemetry yet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-1.5 overflow-auto">
      {incidents.map((inc) => (
        <button
          key={inc.id}
          onClick={() => onSelectIncident && onSelectIncident(inc)}
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2 text-left transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className={cn('h-2 w-2 shrink-0 rounded-full animate-pulse', SEVERITY_DOT[inc.severity] || 'bg-muted-foreground')} />
            <div className="min-w-0">
              <div className="truncate font-mono text-xs font-semibold text-foreground">
                {inc.source_ip} <span className="text-muted-foreground">→</span> {inc.destination_ip || inc.port}
              </div>
              <div className="truncate text-[10px] text-muted-foreground">{inc.attack_type}</div>
            </div>
          </div>
          <span className="shrink-0 whitespace-nowrap font-mono text-[10px] text-muted-foreground">
            {relativeTime(inc.timestamp)}
          </span>
        </button>
      ))}
    </div>
  );
}
