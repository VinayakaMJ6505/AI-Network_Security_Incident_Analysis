import React, { useMemo } from 'react';
import { Radar, RotateCcw } from 'lucide-react';
import AttackTrendsChart from '../components/AttackTrendsChart';
import ProtocolBreakdownChart from '../components/charts/ProtocolBreakdownChart';
import ProtocolPortChart from '../components/charts/ProtocolPortChart';
import TopTalkersList from '../components/widgets/TopTalkersList';
import LiveIncidentStream from '../components/widgets/LiveIncidentStream';
import WidgetGrid from '../components/widgets/WidgetGrid';
import { Card } from '../components/ui/Card';
import { useWidgetLayout } from '../hooks/useWidgetLayout';
import { buildResponsiveLayouts } from '../utils/gridLayout';

const DEFAULT_WIDGET_DEFS = [
  { id: 'protocol-breakdown', x: 0, y: 0, w: 4, h: 4 },
  { id: 'top-ports', x: 4, y: 0, w: 4, h: 4 },
  { id: 'top-talkers', x: 8, y: 0, w: 4, h: 4 },
  { id: 'attack-trend-telemetry', x: 0, y: 4, w: 7, h: 5 },
  { id: 'live-incident-stream', x: 7, y: 4, w: 5, h: 5 },
];

const DEFAULT_LAYOUTS = buildResponsiveLayouts(DEFAULT_WIDGET_DEFS);

export default function TelemetryView({ stats = {}, incidents = [], onSelectIncident }) {
  const { layouts, hiddenIds, handleLayoutChange, hideWidget, resetLayout } = useWidgetLayout({
    storageKey: 'suite-strike:telemetry',
    defaultLayouts: DEFAULT_LAYOUTS,
  });

  const widgets = useMemo(() => [
    {
      id: 'protocol-breakdown',
      title: 'Protocol Breakdown',
      render: () => <ProtocolBreakdownChart incidents={incidents} />,
    },
    {
      id: 'top-ports',
      title: 'Top Targeted Ports',
      render: () => <ProtocolPortChart ports={stats.top_ports || []} />,
    },
    {
      id: 'top-talkers',
      title: 'Top Talkers',
      render: () => <TopTalkersList sources={stats.top_sources || []} />,
    },
    {
      id: 'attack-trend-telemetry',
      title: 'Attack Trend Telemetry',
      render: () => <AttackTrendsChart data={stats.attack_trends || []} bare />,
    },
    {
      id: 'live-incident-stream',
      title: 'Live Incident Stream',
      render: () => <LiveIncidentStream incidents={incidents} onSelectIncident={onSelectIncident} />,
    },
  ], [stats, incidents, onSelectIncident]);

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              <Radar className="h-6 w-6 text-primary" />
              Network Telemetry
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Protocol, port, and source-level traffic telemetry alongside a live-updating incident feed — a denser, analyst-focused view over the same detection pipeline.
            </p>
          </div>
          <button
            onClick={resetLayout}
            className="flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Layout
          </button>
        </div>
      </Card>

      <WidgetGrid
        widgets={widgets}
        layouts={layouts}
        hiddenIds={hiddenIds}
        onLayoutChange={handleLayoutChange}
        onHide={hideWidget}
      />
    </div>
  );
}
