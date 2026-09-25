import React from 'react';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '../../lib/cn';

export default function NavItem({ item, isActive, collapsed, onSelect }) {
  const Icon = item.icon;

  const button = (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
        collapsed && 'justify-center px-0',
        isActive
          ? 'bg-foreground text-background border border-foreground shadow-sm'
          : 'text-sidebar-foreground border border-transparent hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-background' : 'text-muted-foreground group-hover:text-foreground')} />
      <span className={cn('truncate', collapsed && 'sr-only')}>{item.label}</span>
    </button>
  );

  if (!collapsed) return button;

  return (
    <Tooltip label={item.label} side="right">
      {button}
    </Tooltip>
  );
}
