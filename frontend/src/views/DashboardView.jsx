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
  Zap,
  Crosshair,
  Server,
  Lock,
  Radar,
  CheckCircle2,
} from 'lucide-react';

const DEFCON_LEVELS = [
  { level: 1, label: 'DEFCON 1', title: 'Critical Infiltration', color: 'border-rose-500 bg-rose-500/20 text-rose-400', desc: 'Active root/shellcode compromise in progress' },
  { level: 2, label: 'DEFCON 2', title: 'Severe Vector', color: 'border-orange-500 bg-orange-500/20 text-orange-400', desc: 'Exploits / high-volume DoS exceeding thresholds' },
  { level: 3, label: 'DEFCON 3', title: 'Elevated Alert', color: 'border-amber-500 bg-amber-500/20 text-amber-400', desc: 'Targeted reconnaissance & password brute-force' },
  { level: 4, label: 'DEFCON 4', title: 'Guarded State', color: 'border-cyan-500 bg-cyan-500/20 text-cyan-400', desc: 'Suspicious payload fuzzing / port scanning' },
  { level: 5, label: 'DEFCON 5', title: 'Normal Baseline', color: 'border-emerald-500 bg-emerald-500/20 text-emerald-400', desc: 'Standard business telemetry flow' },
];

export default function DashboardView({
  stats = {},
  incidents = [],
  onSelectIncident,
  setActiveTab,
}) {
  const criticalCount = stats.critical_incidents || 0;
  const highCount = stats.high_risk_incidents || 0;
  
  // Compute current automatic DEFCON level based on real database telemetry
  const autoDefcon = criticalCount > 0 ? 1 : highCount > 2 ? 2 : highCount > 0 ? 3 : (stats.detected_attacks || 0) > 0 ? 4 : 5;
  const [selectedDefcon, setSelectedDefcon] = useState(autoDefcon);
  const [containmentAlert, setContainmentAlert] = useState(null);

  const currentDefconObj = DEFCON_LEVELS.find(d => d.level === selectedDefcon) || DEFCON_LEVELS[2];

  const handleSimulateBlock = (ip) => {
    setContainmentAlert(`FIREWALL ACTION ENFORCED: Perimeter access rule blocked traffic from ${ip}`);
    setTimeout(() => setContainmentAlert(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Containment Toast */}
      {containmentAlert && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950/95 border border-cyan-400 text-cyan-200 text-xs font-mono shadow-[0_0_25px_rgba(0,243,255,0.3)] animate-pulse">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>{containmentAlert}</span>
        </div>
      )}

      {/* Welcome & Tactical Defense Posture Header */}
      <div className="hud-panel relative overflow-hidden p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#060b18]/95 via-[#0a1226]/95 to-[#060b18]/95 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.08)]">
        {/* Subtle decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border ${currentDefconObj.color} shadow-sm`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                {currentDefconObj.label}: {currentDefconObj.title.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-cyan-300/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                XGBOOST ML ENGINE: 97.42% ACC
              </span>
              <span className="text-[11px] font-mono text-emerald-300/80 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                DATABASE: MONGODB (incident_db)
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Security Operations Center (SOC) Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time UNSW-NB15 flow telemetry monitoring with multi-class attack classification, regex entity extraction, and automated Generative AI incident reports.
            </p>
          </div>

          {/* Interactive Tactical Radar & Quick Actions */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Mini Radar Scanner Widget */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono text-[11px]">
              <div className="relative w-10 h-10 rounded-full border border-cyan-500/40 bg-cyan-950/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 border border-dashed border-cyan-400/20 rounded-full" />
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-sweep origin-center" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">RADAR SWEEP</span>
                <span className="text-cyan-300 font-bold font-mono">SECTOR 04 ACTIVE</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('analyzer')}
              className="btn-cyber-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide"
            >
              <Radio className="w-4 h-4 fill-current" />
              Live Event Analyzer
            </button>
            <button
              onClick={() => setActiveTab('logparser')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-400 text-xs font-semibold font-mono transition-all hover:scale-[1.02] active:scale-95"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              Upload Log
            </button>
          </div>
        </div>

        {/* DEFCON Readiness Selector Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase font-bold text-slate-300">Defense Posture Matrix:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DEFCON_LEVELS.map((def) => {
              const isSelected = selectedDefcon === def.level;
              return (
                <button
                  key={def.level}
                  onClick={() => setSelectedDefcon(def.level)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all border ${
                    isSelected
                      ? `${def.color} shadow-[0_0_12px_currentColor]`
                      : 'bg-slate-950/60 text-slate-400 border-slate-850 hover:border-slate-700'
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
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors font-mono"
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
