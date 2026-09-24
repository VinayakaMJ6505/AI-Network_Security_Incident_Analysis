import React from 'react';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../lib/cn';

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export function DropdownMenuContent({ className, children, align = 'end', ...props }) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        align={align}
        sideOffset={6}
        className={cn(
          'z-50 min-w-[10rem] rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, children, ...props }) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground outline-none transition-colors',
        'hover:bg-muted focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </DropdownPrimitive.Item>
  );
}
