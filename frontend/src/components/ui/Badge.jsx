import React from 'react';
import { cn } from '../../lib/cn';

const VARIANTS = {
  default: 'bg-muted text-muted-foreground border-border',
  primary: 'bg-primary/10 text-primary border-primary/30',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  destructive: 'bg-destructive/10 text-destructive border-destructive/30',
};

export default function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
