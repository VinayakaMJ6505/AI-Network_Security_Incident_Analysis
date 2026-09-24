import React from 'react';
import { cn } from '../../lib/cn';

const VARIANTS = {
  primary:
    'bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/20',
  secondary:
    'bg-muted text-foreground border border-border hover:border-primary/50 hover:bg-muted/70',
  ghost:
    'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted',
  destructive:
    'bg-destructive text-destructive-foreground hover:brightness-110',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  icon: 'h-9 w-9 p-0',
};

export default function Button({
  className,
  variant = 'secondary',
  size = 'md',
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
