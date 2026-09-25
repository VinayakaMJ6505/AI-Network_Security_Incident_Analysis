import React from 'react';
import { Menu, CheckCircle2, AlertTriangle, Database, Cpu, RefreshCw } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { cn } from '../../lib/cn';

function StatusPill({ tone = 'default', icon: Icon, children, className }) {
  const tones = {
    success: 'bg-success/10 text-success border-success/25',
    primary: 'bg-primary/10 text-primary border-primary/30',
    destructive: 'bg-destructive/10 text-destructive border-destructive/30',
    purple: 'bg-foreground/5 text-foreground/70 border-border',
  };
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-xs',
        tones[tone],
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

export default function Header({ backendOnline, onRefresh, isRefreshing, onOpenMobileNav }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1" />

      <div className="flex shrink-0 items-center gap-2">
        <StatusPill tone="success" icon={Database} className="hidden xl:flex">
          MongoDB: incident_db
        </StatusPill>

        {backendOnline ? (
          <StatusPill tone="primary" icon={CheckCircle2}>
            <span className="hidden sm:inline">FastAPI Live</span>
          </StatusPill>
        ) : (
          <StatusPill tone="destructive" icon={AlertTriangle}>
            <span className="hidden sm:inline">Backend Offline</span>
          </StatusPill>
        )}

        <StatusPill tone="purple" icon={Cpu} className="hidden 2xl:flex">
          XGBoost
        </StatusPill>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Security Telemetry"
          aria-label="Refresh Data"
          className="rounded-lg border border-border bg-muted p-2 text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95"
        >
          <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin text-primary')} />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
