import React, { useState } from 'react';
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
  Lock,
} from 'lucide-react';

const DEFCON_LEVELS = [
  { level: 1, label: 'DEFCON 1', title: 'Critical Infiltration', color: 'border-rose-500/40 bg-rose-500/15 text-rose-300', dot: 'bg-rose-400', desc: 'Active root/shellcode compromise in progress' },
  { level: 2, label: 'DEFCON 2', title: 'Severe Vector', color: 'border-orange-500/40 bg-orange-500/15 text-orange-300', dot: 'bg-orange-400', desc: 'Exploits / high-volume DoS exceeding thresholds' },
  { level: 3, label: 'DEFCON 3', title: 'Elevated Alert', color: 'border-amber-500/40 bg-amber-500/15 text-amber-300', dot: 'bg-amber-400', desc: 'Targeted reconnaissance & password brute-force' },
  { level: 4, label: 'DEFCON 4', title: 'Guarded State', color: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300', dot: 'bg-cyan-400', desc: 'Suspicious payload fuzzing / port scanning' },
  { level: 5, label: 'DEFCON 5', title: 'Normal Baseline', color: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-400', desc: 'Standard business telemetry flow' },
];

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
  const [containmentAlert, setContainmentAlert] = useState(null);

  const currentDefconObj = DEFCON_LEVELS.find(d => d.level === selectedDefcon) || DEFCON_LEVELS[2];

  return (
    <div className="space-y-6">
      {/* Containment Toast Notification */}
      {containmentAlert && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-400 text-cyan-200 text-xs font-mono shadow-2xl backdrop-blur-md">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>{containmentAlert}</span>
        </div>
      )}

      {/* Executive SOC Header & Posture Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-[#0d1527]/80 to-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/30">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${currentDefconObj.color} whitespace-nowrap`}>
                <span className={`w-2 h-2 rounded-full ${currentDefconObj.dot} animate-pulse`} />
                {currentDefconObj.label}: {currentDefconObj.title}
              </span>
              <span className="text-xs text-cyan-300/90 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 font-sans whitespace-nowrap">
                XGBoost ML Engine • 97.4% Acc
              </span>
              <span className="text-xs text-emerald-300/90 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-sans whitespace-nowrap">
                MongoDB • incident_db
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Security Operations Center (SOC) Overview
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Real-time UNSW-NB15 flow telemetry monitoring with multi-class attack classification, regex entity extraction, and automated Generative AI incident reports.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Radio className="w-4 h-4 fill-current shrink-0" />
              Live Event Analyzer
            </button>
            <button
              onClick={() => setActiveTab('logparser')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 text-xs font-semibold transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
              Upload Log
            </button>
          </div>
        </div>

        {/* Defense Posture Level Matrix */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium whitespace-nowrap">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Defense Posture State:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {DEFCON_LEVELS.map((def) => {
              const isSelected = selectedDefcon === def.level;
              return (
                <button
                  key={def.level}
                  onClick={() => setSelectedDefcon(def.level)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 border ${
                    isSelected
                      ? `${def.color} shadow-sm`
                      : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title={def.desc}
                >
                  {def.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Recent Incidents Table Stream */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Active Security Incidents Stream
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
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
