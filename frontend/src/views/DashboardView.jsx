import React from 'react';
import MetricCard from '../components/MetricCard';
import AttackDistributionChart from '../components/AttackDistributionChart';
import AttackTrendsChart from '../components/AttackTrendsChart';
import RecentIncidentsTable from '../components/RecentIncidentsTable';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Activity,
  ArrowRight,
  Radio,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function DashboardView({
  stats = {},
  incidents = [],
  onSelectIncident,
  setActiveTab,
}) {
  const isElevatedThreat = (stats.critical_incidents || 0) > 0 || (stats.high_risk_incidents || 0) > 2;

  return (
    <div className="space-y-6">
      {/* Welcome & Tactical Defense Posture Header */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-[#0d1424]/90 to-slate-900/90 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.06)]">
        {/* Ambient subtle glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                  isElevatedThreat
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                {isElevatedThreat ? 'POSTURE: ELEVATED DEFENSE' : 'POSTURE: NORMAL MONITORING'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                MODEL: XGBOOST (ACCURACY 97.42%)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Security Operations Center (SOC) Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time UNSW-NB15 flow telemetry monitoring with multi-class attack classification, regex entity extraction, and automated Generative AI incident reports.
            </p>
          </div>

          {/* Quick Actions Console */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] active:scale-95"
            >
              <Radio className="w-4 h-4 text-slate-950" />
              Live Event Analyzer
            </button>
            <button
              onClick={() => setActiveTab('logparser')}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              Upload Log
            </button>
          </div>
        </div>
      </div>

      {/* Security Overview Metric Cards (README specified) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Events"
          value={stats.total_events !== undefined && stats.total_events !== null ? stats.total_events.toLocaleString() : '0'}
          subtitle="+8.4% traffic volume"
          icon={Activity}
          color="blue"
          badge="Live Feed"
        />
        <MetricCard
          title="Detected Attacks"
          value={stats.detected_attacks !== undefined && stats.detected_attacks !== null ? stats.detected_attacks.toLocaleString() : '0'}
          subtitle={`${stats.attack_percentage || '0'}% of total packets`}
          icon={Flame}
          color="rose"
          badge="ML Classified"
          badgeType="danger"
        />
        <MetricCard
          title="High-Risk Incidents"
          value={stats.high_risk_incidents !== undefined && stats.high_risk_incidents !== null ? stats.high_risk_incidents.toLocaleString() : '0'}
          subtitle="Score 61 – 80 range"
          icon={AlertTriangle}
          color="amber"
          badge="Under Review"
        />
        <MetricCard
          title="Critical Incidents"
          value={stats.critical_incidents !== undefined && stats.critical_incidents !== null ? stats.critical_incidents.toLocaleString() : '0'}
          subtitle="Score 81 – 100 range"
          icon={ShieldAlert}
          color="rose"
          badge="Immediate Containment"
          badgeType="danger"
        />
      </div>

      {/* Charts Section: Attack Distribution & Attack Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttackDistributionChart data={stats.attack_distribution || []} />
        <AttackTrendsChart data={stats.attack_trends || []} />
      </div>

      {/* Recent Incidents Table */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-mono">
              Active Security Incidents Stream
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {incidents.length} recorded
            </span>
          </div>
          <button
            onClick={() => setActiveTab('incidents')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
          >
            View all incidents <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <RecentIncidentsTable
          incidents={incidents.slice(0, 5)}
          onSelectIncident={onSelectIncident}
          showFilters={false}
          title="Latest Alerts & Triggered Explanations"
        />
      </div>
    </div>
  );
}
