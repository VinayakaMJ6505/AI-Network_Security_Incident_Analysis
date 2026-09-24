import React from 'react';
import { GripVertical, MoreVertical, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/DropdownMenu';

export default function WidgetCard({ title, onHide, children }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="widget-drag-handle flex shrink-0 cursor-grab items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5 active:cursor-grabbing">
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <span className="truncate">{title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${title} widget options`}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onHide}>
              <EyeOff className="h-3.5 w-3.5" />
              Hide widget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </Card>
  );
}
