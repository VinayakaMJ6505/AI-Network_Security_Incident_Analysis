import React, { useMemo, useState } from 'react';
import MetricCard from '../components/MetricCard';
import AttackDistributionChart from '../components/AttackDistributionChart';
import AttackTrendsChart from '../components/AttackTrendsChart';
import RecentIncidentsTable from '../components/RecentIncidentsTable';
import WidgetGrid from '../components/widgets/WidgetGrid';
import { useWidgetLayout } from '../hooks/useWidgetLayout';
import { buildResponsiveLayouts } from '../utils/gridLayout';
import { cn } from '../lib/cn';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Activity,
  Radio,
  FileCode,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

const DEFCON_LEVELS = [
  { level: 1, label: 'DEFCON 1', title: 'Critical Infiltration', color: 'border-severity-critical/40 bg-severity-critical/15 text-severity-critical', dot: 'bg-severity-critical', desc: 'Active root/shellcode compromise in progress' },
  { level: 2, label: 'DEFCON 2', title: 'Severe Vector', color: 'border-severity-high/40 bg-severity-high/15 text-severity-high', dot: 'bg-severity-high', desc: 'Exploits / high-volume DoS exceeding thresholds' },
  { level: 3, label: 'DEFCON 3', title: 'Elevated Alert', color: 'border-severity-medium/40 bg-severity-medium/15 text-severity-medium', dot: 'bg-severity-medium', desc: 'Targeted reconnaissance & password brute-force' },
  { level: 4, label: 'DEFCON 4', title: 'Guarded State', color: 'border-primary/40 bg-primary/15 text-primary', dot: 'bg-primary', desc: 'Suspicious payload fuzzing / port scanning' },
  { level: 5, label: 'DEFCON 5', title: 'Normal Baseline', color: 'border-success/40 bg-success/15 text-success', dot: 'bg-success', desc: 'Standard business telemetry flow' },
];

const DEFAULT_WIDGET_DEFS = [
  { id: 'kpi-total-events', x: 0, y: 0, w: 3, h: 2 },
  { id: 'kpi-detected-attacks', x: 3, y: 0, w: 3, h: 2 },
  { id: 'kpi-high-risk', x: 6, y: 0, w: 3, h: 2 },
  { id: 'kpi-critical', x: 9, y: 0, w: 3, h: 2 },
  { id: 'attack-distribution', x: 0, y: 2, w: 6, h: 5 },
  { id: 'attack-trends', x: 6, y: 2, w: 6, h: 5 },
  { id: 'recent-incidents', x: 0, y: 7, w: 12, h: 6 },
];

const DEFAULT_LAYOUTS = buildResponsiveLayouts(DEFAULT_WIDGET_DEFS);

export default function DashboardView({
  stats = {},
  incidents = [],
  onSelectIncident,
  setActiveTab,
}) {
  const criticalCount = stats.critical_incidents || 0;
  const highCount = stats.high_risk_incidents || 0;

  // Compute automated DEFCON level based on database telemetry
  const autoDefcon = criticalCount > 0 ? 1 : highCount > 2 ? 2 : highCount > 0 ? 3 : (stats.detected_attacks || 0) > 0 ? 4 : 5;
  const [selectedDefcon, setSelectedDefcon] = useState(autoDefcon);

  const currentDefconObj = DEFCON_LEVELS.find(d => d.level === selectedDefcon) || DEFCON_LEVELS[2];

  const { layouts, hiddenIds, handleLayoutChange, hideWidget, resetLayout } = useWidgetLayout({
    storageKey: 'suite-strike:dashboard',
    defaultLayouts: DEFAULT_LAYOUTS,
  });

  const widgets = useMemo(() => [
    {
      id: 'kpi-total-events',
      title: 'Total Events',
      render: () => (
        <MetricCard
          title="Total Events"
          value={stats.total_events !== undefined && stats.total_events !== null ? stats.total_events.toLocaleString() : '0'}
          subtitle="+8.4% traffic volume"
          icon={Activity}
          color="blue"
          badge="Live Feed"
          bare
        />
      ),
    },
    {
      id: 'kpi-detected-attacks',
      title: 'Detected Attacks',
      render: () => (
        <MetricCard
          title="Detected Attacks"
          value={stats.detected_attacks !== undefined && stats.detected_attacks !== null ? stats.detected_attacks.toLocaleString() : '0'}
          subtitle={`${stats.attack_percentage || '0'}% of total packets`}
          icon={Flame}
          color="rose"
          badge="ML Classified"
          badgeType="danger"
          bare
        />
      ),
    },
    {
      id: 'kpi-high-risk',
      title: 'High-Risk Incidents',
      render: () => (
        <MetricCard
          title="High-Risk Incidents"
          value={stats.high_risk_incidents !== undefined && stats.high_risk_incidents !== null ? stats.high_risk_incidents.toLocaleString() : '0'}
          subtitle="Score 61 – 80 range"
          icon={AlertTriangle}
          color="amber"
          badge="Under Review"
          bare
        />
      ),
    },
    {
      id: 'kpi-critical',
      title: 'Critical Incidents',
      render: () => (
        <MetricCard
          title="Critical Incidents"
          value={stats.critical_incidents !== undefined && stats.critical_incidents !== null ? stats.critical_incidents.toLocaleString() : '0'}
          subtitle="Score 81 – 100 range"
          icon={ShieldAlert}
          color="rose"
          badge="Immediate Containment"
          badgeType="danger"
          bare
        />
      ),
    },
    {
      id: 'attack-distribution',
      title: 'Attack Distribution (UNSW-NB15 Categories)',
      render: () => <AttackDistributionChart data={stats.attack_distribution || []} bare />,
    },
    {
      id: 'attack-trends',
      title: 'Security Events & Attack Trends',
      render: () => <AttackTrendsChart data={stats.attack_trends || []} bare />,
    },
    {
      id: 'recent-incidents',
      title: 'Active Security Incidents Stream',
      render: () => (
        <RecentIncidentsTable
          incidents={incidents.slice(0, 5)}
          onSelectIncident={onSelectIncident}
          showFilters={false}
          title="Latest Alerts & Triggered Explanations"
          bare
        />
      ),
    },
  ], [stats, incidents, onSelectIncident]);

  return (
    <div className="space-y-6">
      {/* Executive SOC Header & Posture Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-card p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div className="space-y-3">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium', currentDefconObj.color)}>
                <span className={cn('h-2 w-2 rounded-full animate-pulse', currentDefconObj.dot)} />
                {currentDefconObj.label}: {currentDefconObj.title}
              </span>
              <span className="whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-sans text-xs text-primary">
                XGBoost ML Engine • 97.4% Acc
              </span>
              <span className="whitespace-nowrap rounded-full border border-success/20 bg-success/10 px-3 py-1 font-sans text-xs text-success">
                MongoDB • incident_db
              </span>
            </div>

            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Security Operations Center (SOC) Overview
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Real-time UNSW-NB15 flow telemetry monitoring with multi-class attack classification, regex entity extraction, and automated Generative AI incident reports.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <Radio className="h-4 w-4 fill-current shrink-0" />
              Live Event Analyzer
            </button>
            <button
              onClick={() => setActiveTab('logparser')}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-border bg-muted px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 active:scale-[0.98]"
            >
              <FileCode className="h-4 w-4 shrink-0 text-primary" />
              Upload Log
            </button>
          </div>
        </div>

        {/* Defense Posture Level Matrix */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <span>Defense Posture State:</span>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {DEFCON_LEVELS.map((def) => {
              const isSelected = selectedDefcon === def.level;
              return (
                <button
                  key={def.level}
                  onClick={() => setSelectedDefcon(def.level)}
                  className={cn(
                    'shrink-0 whitespace-nowrap rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200',
                    isSelected
                      ? cn(def.color, 'shadow-sm')
                      : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  )}
                  title={def.desc}
                >
                  {def.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customizable widget grid */}
      <div className="flex items-center justify-end">
        <button
          onClick={resetLayout}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Layout
        </button>
      </div>

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
