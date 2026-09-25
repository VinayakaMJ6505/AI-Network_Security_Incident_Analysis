import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '../lib/cn';

export default function FAQSection({ title = 'FAQ', items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items.length) return null;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h3>
      </div>

      <div className="divide-y divide-border">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    isOpen && 'rotate-180 text-foreground'
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                      {item.fields && (
                        <dl className="mt-3 space-y-2 border-t border-border pt-3">
                          {item.fields.map((f) => (
                            <div key={f.term} className="sm:flex sm:gap-3">
                              <dt className="shrink-0 font-mono text-[11px] font-semibold text-foreground sm:w-44">
                                {f.term}
                              </dt>
                              <dd className="text-xs leading-relaxed text-muted-foreground">{f.desc}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
