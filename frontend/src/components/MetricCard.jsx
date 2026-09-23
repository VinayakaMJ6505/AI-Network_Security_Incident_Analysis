import React from 'react';

const COLOR_MAP = {
  blue: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    corner: 'border-cyan-400',
    glow: 'hover:shadow-[0_0_25px_rgba(0,243,255,0.2)] hover:border-cyan-500/50',
    indicator: 'bg-cyan-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    corner: 'border-emerald-400',
    glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:border-emerald-500/50',
    indicator: 'bg-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    corner: 'border-amber-400',
    glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:border-amber-500/50',
    indicator: 'bg-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    corner: 'border-rose-400',
    glow: 'hover:shadow-[0_0_25px_rgba(255,51,102,0.2)] hover:border-rose-500/50',
    indicator: 'bg-rose-400',
  },
  red: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    corner: 'border-rose-400',
    glow: 'hover:shadow-[0_0_25px_rgba(255,51,102,0.2)] hover:border-rose-500/50',
    indicator: 'bg-rose-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    corner: 'border-purple-400',
    glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:border-purple-500/50',
    indicator: 'bg-purple-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    corner: 'border-cyan-400',
    glow: 'hover:shadow-[0_0_25px_rgba(0,243,255,0.2)] hover:border-cyan-500/50',
    indicator: 'bg-cyan-400',
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badge,
  badgeType = 'neutral',
}) {
  const scheme = COLOR_MAP[color] || COLOR_MAP.blue;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-[#090e1c]/90 p-5 backdrop-blur-md transition-all duration-300 ${scheme.glow} hover:-translate-y-0.5`}
    >
      {/* Precision HUD corner brackets */}
      <span className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${scheme.corner} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${scheme.corner} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${scheme.corner} opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${scheme.corner} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Top micro scanning glow line */}
      <div className={`absolute top-0 left-0 right-0 h-[1.5px] opacity-40 group-hover:opacity-100 transition-opacity ${scheme.indicator}`} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 font-mono flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${scheme.indicator} animate-pulse`} />
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg p-2 ${scheme.bg} ${scheme.border} border transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
            <Icon className={`w-4 h-4 ${scheme.text}`} />
          </div>
        )}
      </div>

      {/* Counter */}
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-white font-mono drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          {value}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-xs gap-2 pt-2 border-t border-slate-800/80">
        {subtitle && (
          <span className="text-[11px] text-slate-400 font-mono truncate">
            {subtitle}
          </span>
        )}
        {badge && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold whitespace-nowrap ${
              badgeType === 'danger'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
