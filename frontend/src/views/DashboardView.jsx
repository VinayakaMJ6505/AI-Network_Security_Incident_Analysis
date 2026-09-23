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
} from 'lucide-react';

export default function DashboardView({
  stats,
  incidents,
  onSelectIncident,
  setActiveTab,
}) {
  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-900/40 border border-blue-900/30 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Security Operations Center (SOC) Overview
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Multi-tier detection active: XGBoost intrusion classifier, NLP entity extraction, and Generative AI incident explanation powered by UNSW-NB15 analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <Radio className="w-3.5 h-3.5" />
            Live Event Analyzer
          </button>
          <button
            onClick={() => setActiveTab('logparser')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <FileCode className="w-3.5 h-3.5" />
            Upload Log
          </button>
        </div>
      </div>

      {/* Security Overview Metric Cards (README specified) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Events"
          value={stats.total_events?.toLocaleString() || '175,341'}
          subtitle="+8.4% traffic volume"
          icon={Activity}
          color="blue"
          badge="Live Feed"
        />
        <MetricCard
          title="Detected Attacks"
          value={stats.detected_attacks?.toLocaleString() || '119,341'}
          subtitle={`${stats.attack_percentage || '68.06'}% of total packets`}
          icon={Flame}
          color="rose"
          badge="ML Classified"
          badgeType="danger"
        />
        <MetricCard
          title="High-Risk Incidents"
          value={stats.high_risk_incidents?.toLocaleString() || '24,150'}
          subtitle="Score 61 – 80 range"
          icon={AlertTriangle}
          color="amber"
          badge="Under Review"
        />
        <MetricCard
          title="Critical Incidents"
          value={stats.critical_incidents?.toLocaleString() || '6,412'}
          subtitle="Score 81 – 100 range"
          icon={ShieldAlert}
          color="rose"
          badge="Immediate Containment"
          badgeType="danger"
        />
      </div>

      {/* Charts Section: Attack Distribution & Attack Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttackDistributionChart data={stats.attack_distribution} />
        <AttackTrendsChart data={stats.attack_trends} />
      </div>

      {/* Recent Incidents Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">
            Active Security Incidents Stream
          </h3>
          <button
            onClick={() => setActiveTab('incidents')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            View all {incidents.length} incidents <ArrowRight className="w-3.5 h-3.5" />
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
