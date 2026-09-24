import React from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center justify-between gap-3 px-5 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('font-display text-sm font-semibold text-foreground', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('text-xs text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('px-5 pb-5', className)} {...props}>
      {children}
    </div>
  );
}
