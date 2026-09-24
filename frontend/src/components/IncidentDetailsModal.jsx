import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Dialog, DialogContent } from './ui/Dialog';
import {
  X,
  ShieldAlert,
  Sparkles,
  Cpu,
  Terminal,
  CheckCircle,
  Copy,
} from 'lucide-react';

export default function IncidentDetailsModal({ incident, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!incident) return null;

  const copyToClipboard = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(JSON.stringify(incident, null, 2));
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(incident, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const entities = incident.extracted_entities || {};
  const ai = incident.ai_explanation || {};
  const confidencePercent = Math.round((incident.confidence || 0.9) * 100);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-[60] flex items-center gap-3 rounded-xl border border-success/50 bg-card px-4 py-3 text-foreground shadow-2xl shadow-success/20 backdrop-blur-md transition-all"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-success/30 bg-success/20 text-success">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-success">
              Copied to clipboard!
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Incident JSON data copied successfully.
            </span>
          </div>
        </div>
      )}

      <DialogContent showClose={false} className="max-w-4xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-2.5">
              <ShieldAlert className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-bold tracking-tight text-foreground sm:text-lg">
                  Security Incident Dossier
                </h2>
                <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                  {incident.id || 'INC-LIVE'}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                Detected at {incident.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                copied
                  ? 'border border-success/40 bg-success/20 text-success shadow-sm shadow-success/10'
                  : 'border border-border bg-muted text-muted-foreground hover:text-foreground'
              }`}
              title="Copy incident JSON"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-border bg-muted p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[80vh] space-y-6 overflow-y-auto p-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Attack Classification
              </span>
              <span className="mt-1 block text-lg font-bold text-foreground">
                {incident.attack_type}
              </span>
              <span className="mt-0.5 block font-mono text-xs text-primary">
                XGBoost Model
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                ML Confidence
              </span>
              <span className="mt-1 block font-mono text-lg font-bold text-primary">
                {confidencePercent}%
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Multiclass Probability
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Risk Score
              </span>
              <span className="mt-1 block font-mono text-lg font-bold text-foreground">
                {incident.risk_score} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Aggregated Threat Index
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Severity Level
              </span>
              <div className="mt-2">
                <StatusBadge severity={incident.severity} />
              </div>
              <span className="mt-1 block font-mono text-xs text-muted-foreground">
                {incident.severity === 'CRITICAL' ? 'Immediate Escalation' : 'Standard Response'}
              </span>
            </div>
          </div>

          {/* Extracted Entities Section */}
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                Extracted NLP &amp; Network Entities
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs md:grid-cols-4">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Source IP</span>
                <span className="mt-1 block font-semibold text-foreground">{incident.source_ip || 'N/A'}</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Destination IP</span>
                <span className="mt-1 block font-semibold text-foreground">{incident.destination_ip || 'N/A'}</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Port / Protocol</span>
                <span className="mt-1 block font-semibold text-foreground">
                  {incident.port || entities.port || 80} / {incident.protocol || entities.protocol || 'TCP'}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Target User</span>
                <span className="mt-1 block font-semibold text-foreground">{entities.username || 'N/A'}</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Failed Attempts</span>
                <span className="mt-1 block font-semibold text-destructive">{entities.failed_attempts ?? 0}</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Connection State</span>
                <span className="mt-1 block font-semibold text-foreground">{incident.state || entities.state || 'CON'}</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Service</span>
                <span className="mt-1 block font-semibold text-foreground">{incident.service || entities.service || 'N/A'}</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="block font-sans text-[11px] uppercase text-muted-foreground">Action Enforced</span>
                <span className="mt-1 block font-semibold text-success">{entities.action || 'Logged'}</span>
              </div>
            </div>
          </div>

          {/* Generative AI Explanation Box */}
          <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-primary/[0.04] p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg border border-primary/30 bg-primary/20 p-1.5 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                Generative AI Incident Analysis
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Incident Summary
                </span>
                <p className="rounded-xl border border-border bg-background/60 p-3.5 leading-relaxed text-foreground">
                  {ai.summary || 'AI incident summary generated based on analytical telemetry.'}
                </p>
              </div>

              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Evidence &amp; Behavioral Indicators
                </span>
                <p className="rounded-xl border border-border bg-background/60 p-3.5 leading-relaxed text-muted-foreground">
                  {ai.evidence || 'Packet sequence and flag telemetry match attack signatures.'}
                </p>
              </div>

              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Potential Security Impact
                </span>
                <p className="rounded-xl border border-warning/20 bg-warning/10 p-3.5 leading-relaxed text-warning">
                  {ai.potential_impact || 'Moderate threat of service disruption or privilege escalation.'}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Investigation Steps */}
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-success" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                Recommended Investigation &amp; Containment Steps
              </h3>
            </div>
            <ul className="space-y-2.5">
              {(ai.recommendations || [
                'Quarantine source IP from reaching sensitive application segments.',
                'Inspect server authentication logs for unauthorized session creation.',
                'Trigger full packet capture on destination host.'
              ]).map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-border bg-background p-3 text-xs text-foreground"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-4">
          <span className="text-xs text-muted-foreground">
            Suite Strike • MCA Capstone
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-all"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
