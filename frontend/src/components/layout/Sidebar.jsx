import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Radar,
  ShieldAlert,
  Radio,
  FileCode,
  BarChart3,
  Layers,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react';
import NavItem from './NavItem';
import { TooltipProvider } from '../ui/Tooltip';
import { cn } from '../../lib/cn';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'telemetry', label: 'Telemetry', icon: Radar },
  { id: 'incidents', label: 'Incidents', icon: ShieldAlert },
  { id: 'analyzer', label: 'Live Analyzer', icon: Radio },
  { id: 'logparser', label: 'NLP Log Parser', icon: FileCode },
  { id: 'analytics', label: 'Threat Analytics', icon: BarChart3 },
  { id: 'architecture', label: 'Architecture & ML', icon: Layers },
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, onToggleCollapsed, className, isMobileDrawer = false }) {
  return (
    <TooltipProvider>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar',
          className
        )}
      >
        <div className={cn('flex items-center gap-2.5 px-4 py-5', collapsed && 'justify-center px-0')}>
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 via-blue-600/15 to-transparent text-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Shield className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate font-display text-sm font-bold tracking-tight text-foreground">
                  Suite Strike
                </h1>
                <span className="shrink-0 whitespace-nowrap rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                  v1.0
                </span>
              </div>
              <p className="truncate text-[11px] text-muted-foreground">SOC Command Center</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              collapsed={collapsed}
              onSelect={setActiveTab}
            />
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={isMobileDrawer ? 'Close navigation' : collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              collapsed && 'justify-center px-0'
            )}
          >
            {isMobileDrawer ? <X className="h-4 w-4" /> : collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>{isMobileDrawer ? 'Close' : 'Collapse'}</span>}
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
