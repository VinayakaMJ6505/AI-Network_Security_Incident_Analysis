import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Radio,
  FileCode,
  BarChart3,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Activity,
  Database,
  Terminal,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  backendOnline,
  onRefresh,
  isRefreshing,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents', icon: Shield },
    { id: 'analyzer', label: 'Live Analyzer', icon: Radio },
    { id: 'logparser', label: 'NLP Log Parser', icon: FileCode },
    { id: 'analytics', label: 'Threat Analytics', icon: BarChart3 },
    { id: 'architecture', label: 'Architecture & ML', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#060911]/95 backdrop-blur-xl">
      {/* Top Live Tactical Telemetry Ticker */}
      <div className="overflow-hidden border-b border-slate-800/80 bg-slate-950/90 py-1 text-[10px] font-mono text-slate-400 select-none">
        <div className="animate-ticker flex items-center gap-8 whitespace-nowrap px-4">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            SYS: BLR-SOC-COMMAND-01
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" />
            STORAGE: MONGODB (incident_db) [27017]
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            ML: XGBOOST 10-CLASS CLASSIFIER (97.42% ACC)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-400" />
            DATASET: UNSW-NB15 REAL-TIME TELEMETRY
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300">
            PORTS: FASTAPI :8000 / REACT :3000
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-rose-400 font-semibold">
            DEFCON STATUS: ACTIVE SOC PERIMETER MONITORING
          </span>
          <span className="text-slate-600">|</span>
          {/* Duplicate loop sequence for seamless ticker loop */}
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            SYS: BLR-SOC-COMMAND-01
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" />
            STORAGE: MONGODB (incident_db) [27017]
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            ML: XGBOOST 10-CLASS CLASSIFIER (97.42% ACC)
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white font-display">
                AI Network Security SOC
              </h1>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                PROD v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
              Autonomous Threat Detection & AI Explainability
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2">
          {/* MongoDB Status */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>MongoDB: incident_db</span>
          </div>

          {/* Backend Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              backendOnline
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {backendOnline ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xs:inline">FastAPI Live</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden xs:inline">Backend Offline</span>
              </>
            )}
          </div>

          {/* Model indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span>XGBoost</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800 hover:border-cyan-500/40 active:scale-95 shadow-sm"
            title="Refresh Security Telemetry"
            aria-label="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-3 py-2 border-t border-slate-800/80 gap-1.5 scrollbar-none bg-[#0a0e1a]/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
