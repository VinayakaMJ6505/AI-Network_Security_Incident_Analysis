import React from 'react';
import { Globe, Network } from 'lucide-react';
import Badge from '../ui/Badge';

export default function TopTalkersList({ sources = [] }) {
  if (sources.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
        <Network className="mb-2 h-6 w-6 text-primary opacity-30" />
        <p className="text-xs">No source IP aggregation data available.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto">
      {sources.map((src, i) => (
        <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">#{i + 1}</span>
            <div className="min-w-0">
              <div className="truncate font-mono text-xs font-bold text-foreground">{src.ip}</div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Globe className="h-2.5 w-2.5" />
                {src.country || 'LAN'}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge variant="primary">{src.attackType || 'Exploits'}</Badge>
            <span className="font-mono text-xs font-bold text-success">{src.count?.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
