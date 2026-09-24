import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, showClose = true, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl',
          className
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, children, ...props }) {
  return (
    <div className={cn('border-b border-border px-6 py-5', className)} {...props}>
      {children}
    </div>
  );
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
