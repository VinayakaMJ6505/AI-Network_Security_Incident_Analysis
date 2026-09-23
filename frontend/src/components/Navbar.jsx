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
  Database,
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/95 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0">
            <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <h1 className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-white font-display whitespace-nowrap">
                AI Network Security SOC
              </h1>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 whitespace-nowrap shrink-0">
                PROD v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden 2xl:block whitespace-nowrap">
              Autonomous Threat Detection & AI Explainability
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop Segmented Control) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-inner shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap shrink-0">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Indicators & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* MongoDB Status - shown on wide viewports to preserve space */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 whitespace-nowrap shrink-0">
            <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>MongoDB: incident_db</span>
          </div>

          {/* Backend Status Indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border whitespace-nowrap shrink-0 transition-all ${
              backendOnline
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {backendOnline ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">FastAPI Live</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Backend Offline</span>
              </>
            )}
          </div>

          {/* Model indicator - shown on extra wide screens */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/25 whitespace-nowrap shrink-0">
            <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>XGBoost</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800 hover:border-cyan-500/40 active:scale-95 shadow-sm shrink-0"
            title="Refresh Security Telemetry"
            aria-label="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 shrink-0 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/80 gap-1.5 scrollbar-none bg-[#090e1a]/95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
