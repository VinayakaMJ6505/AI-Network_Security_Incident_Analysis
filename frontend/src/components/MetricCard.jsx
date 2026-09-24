import React from 'react';
import { Card } from './ui/Card';
import { cn } from '../lib/cn';

const COLOR_MAP = {
  blue: { bg: 'bg-primary/10', border: 'border-primary/25', text: 'text-primary', accent: 'bg-primary' },
  cyan: { bg: 'bg-primary/10', border: 'border-primary/25', text: 'text-primary', accent: 'bg-primary' },
  emerald: { bg: 'bg-success/10', border: 'border-success/25', text: 'text-success', accent: 'bg-success' },
  amber: { bg: 'bg-warning/10', border: 'border-warning/25', text: 'text-warning', accent: 'bg-warning' },
  rose: { bg: 'bg-destructive/10', border: 'border-destructive/25', text: 'text-destructive', accent: 'bg-destructive' },
  red: { bg: 'bg-destructive/10', border: 'border-destructive/25', text: 'text-destructive', accent: 'bg-destructive' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/25', text: 'text-purple-500 dark:text-purple-400', accent: 'bg-purple-500' },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badge,
  badgeType = 'neutral',
  className,
  bare = false,
}) {
  const scheme = COLOR_MAP[color] || COLOR_MAP.blue;

  const content = (
    <div className={cn('group flex h-full flex-col justify-between', !bare && 'relative overflow-hidden p-5 sm:p-6')}>
      {!bare && (
        <div className={cn('absolute left-0 right-0 top-0 h-[2px] opacity-60 transition-opacity group-hover:opacity-100', scheme.accent)} />
      )}

      <div className="flex items-center justify-between gap-2">
        {bare ? (
          <span
            className={cn(
              'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-medium',
              badgeType === 'danger'
                ? 'bg-destructive/15 text-destructive border border-destructive/30'
                : 'bg-muted text-muted-foreground border border-border'
            )}
          >
            {badge || title}
          </span>
        ) : (
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', scheme.accent)} />
            <span className="truncate">{title}</span>
          </span>
        )}
        {Icon && (
          <div className={cn('shrink-0 rounded-xl border p-2.5 shadow-sm transition-transform duration-300 group-hover:scale-105', scheme.bg, scheme.border)}>
            <Icon className={cn('h-4 w-4', scheme.text)} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="font-mono text-3xl font-extrabold tracking-tight text-foreground">{value}</div>
        {subtitle && <div className="mt-1 font-sans text-xs text-muted-foreground">{subtitle}</div>}
      </div>

      {!bare && (
        <div className="mt-4 flex min-h-[30px] items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] font-medium text-muted-foreground">Telemetry</span>
          {badge ? (
            <span
              className={cn(
                'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-medium',
                badgeType === 'danger'
                  ? 'bg-destructive/15 text-destructive border border-destructive/30'
                  : 'bg-muted text-muted-foreground border border-border'
              )}
            >
              {badge}
            </span>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground/70">Active</span>
          )}
        </div>
      )}
    </div>
  );

  if (bare) return content;

  return (
    <Card className={cn('hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-300', className)}>
      {content}
    </Card>
  );
}
