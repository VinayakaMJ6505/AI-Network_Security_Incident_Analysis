import React from 'react';

const COLOR_MAP = {
  blue: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    text: 'text-cyan-400',
    accent: 'bg-cyan-400',
    glow: 'hover:border-cyan-500/40 hover:shadow-[0_8px_30px_-10px_rgba(6,182,212,0.25)]',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    accent: 'bg-emerald-400',
    glow: 'hover:border-emerald-500/40 hover:shadow-[0_8px_30px_-10px_rgba(16,185,129,0.25)]',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
    accent: 'bg-amber-400',
    glow: 'hover:border-amber-500/40 hover:shadow-[0_8px_30px_-10px_rgba(245,158,11,0.25)]',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    text: 'text-rose-400',
    accent: 'bg-rose-400',
    glow: 'hover:border-rose-500/40 hover:shadow-[0_8px_30px_-10px_rgba(244,63,94,0.25)]',
  },
  red: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    text: 'text-rose-400',
    accent: 'bg-rose-400',
    glow: 'hover:border-rose-500/40 hover:shadow-[0_8px_30px_-10px_rgba(244,63,94,0.25)]',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    text: 'text-purple-400',
    accent: 'bg-purple-400',
    glow: 'hover:border-purple-500/40 hover:shadow-[0_8px_30px_-10px_rgba(168,85,247,0.25)]',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    text: 'text-cyan-400',
    accent: 'bg-cyan-400',
    glow: 'hover:border-cyan-500/40 hover:shadow-[0_8px_30px_-10px_rgba(6,182,212,0.25)]',
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
      className={`group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 ${scheme.glow} hover:-translate-y-0.5 flex flex-col justify-between`}
    >
      {/* Top micro accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity ${scheme.accent}`}
      />

      {/* Header with Title and Icon */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${scheme.accent} shrink-0`} />
            <span className="truncate">{title}</span>
          </span>
          {Icon && (
            <div
              className={`rounded-xl p-2.5 ${scheme.bg} ${scheme.border} border transition-all duration-300 group-hover:scale-105 shadow-sm shrink-0`}
            >
              <Icon className={`w-4 h-4 ${scheme.text}`} />
            </div>
          )}
        </div>

        {/* Counter value and Subtitle */}
        <div className="mt-3">
          <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-400 mt-1 font-sans">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info: Status Badge on its own line */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between min-h-[30px]">
        <span className="text-[11px] text-slate-500 font-medium">Telemetry</span>
        {badge ? (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
              badgeType === 'danger'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800/90 text-slate-300 border border-slate-700/60'
            }`}
          >
            {badge}
          </span>
        ) : (
          <span className="text-[10px] text-slate-600 font-mono">Active</span>
        )}
      </div>
    </div>
  );
}
