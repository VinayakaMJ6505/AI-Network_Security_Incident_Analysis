import React from 'react';

const COLOR_MAP = {
  blue: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:border-cyan-500/40',
    indicator: 'bg-cyan-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.18)] hover:border-emerald-500/40',
    indicator: 'bg-emerald-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.18)] hover:border-amber-500/40',
    indicator: 'bg-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    glow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.18)] hover:border-rose-500/40',
    indicator: 'bg-rose-400',
  },
  red: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    glow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.18)] hover:border-rose-500/40',
    indicator: 'bg-rose-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.18)] hover:border-purple-500/40',
    indicator: 'bg-purple-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:border-cyan-500/40',
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
      className={`group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 ${scheme.glow} hover:-translate-y-0.5`}
    >
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity ${scheme.indicator}`} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 font-mono">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${scheme.bg} ${scheme.border} border transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
            <Icon className={`w-4 h-4 ${scheme.text}`} />
          </div>
        )}
      </div>

      {/* Counter */}
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-white font-mono drop-shadow-sm">
          {value}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-xs gap-2 pt-2 border-t border-slate-800/60">
        {subtitle && (
          <span className="text-slate-400 font-medium truncate">
            {subtitle}
          </span>
        )}
        {badge && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold whitespace-nowrap ${
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
