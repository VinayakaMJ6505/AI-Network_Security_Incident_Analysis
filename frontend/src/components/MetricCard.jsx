import React from 'react';

const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  },
  red: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
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
      className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 ${scheme.glow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`rounded-lg p-2.5 ${scheme.bg} ${scheme.border} border`}>
            <Icon className={`w-5 h-5 ${scheme.text}`} />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subtitle && (
          <span className="text-slate-400 font-medium">
            {subtitle}
          </span>
        )}
        {badge && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
              badgeType === 'danger'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
