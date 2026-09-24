import React from 'react';
import { Sun, Moon } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useTheme } from '../theme/useTheme';
import { cn } from '../lib/cn';

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-muted transition-colors',
        'data-[state=checked]:bg-muted',
        className
      )}
    >
      <Switch.Thumb
        className={cn(
          'flex h-6 w-6 translate-x-1 items-center justify-center rounded-full bg-card text-foreground shadow transition-transform duration-200 will-change-transform',
          'data-[state=checked]:translate-x-7'
        )}
      >
        {isDark ? <Moon size={13} /> : <Sun size={13} />}
      </Switch.Thumb>
    </Switch.Root>
  );
}
