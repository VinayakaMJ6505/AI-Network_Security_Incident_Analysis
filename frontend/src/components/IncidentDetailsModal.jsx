import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import {
  X,
  ShieldAlert,
  Sparkles,
  Cpu,
  Terminal,
  Server,
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  Download,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Small Pop-up / Toast notification */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-emerald-500/50 text-white shadow-2xl shadow-emerald-500/20 backdrop-blur-md transition-all animate-bounce-once"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-400 block text-xs">
              Copied to clipboard!
            </span>
            <span className="text-[11px] text-slate-300 block">
              Incident JSON data copied successfully.
            </span>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700/80 bg-[#0e1424] shadow-2xl overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#121a30]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Security Incident Dossier
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {incident.id || 'INC-LIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Detected at {incident.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 px-3 transition-all ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
              title="Copy incident JSON"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Attack Classification
              </span>
              <span className="text-lg font-bold text-white mt-1 block">
                {incident.attack_type}
              </span>
              <span className="text-xs text-blue-400 font-mono mt-0.5 block">
                XGBoost Model
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                ML Confidence
              </span>
              <span className="text-lg font-bold text-blue-400 font-mono mt-1 block">
                {confidencePercent}%
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                Multiclass Probability
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Risk Score
              </span>
              <span className="text-lg font-bold text-white font-mono mt-1 block">
                {incident.risk_score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                Aggregated Threat Index
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Severity Level
              </span>
              <div className="mt-2">
                <StatusBadge severity={incident.severity} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block font-mono">
                {incident.severity === 'CRITICAL' ? 'Immediate Escalation' : 'Standard Response'}
              </span>
            </div>
          </div>

          {/* Extracted Entities Section */}
          <div className="rounded-xl border border-slate-800 bg-[#12192c]/70 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Extracted NLP & Network Entities
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Source IP</span>
                <span className="font-semibold text-white mt-1 block">{incident.source_ip || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Destination IP</span>
                <span className="font-semibold text-white mt-1 block">{incident.destination_ip || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Port / Protocol</span>
                <span className="font-semibold text-white mt-1 block">
                  {incident.port || entities.port || 80} / {incident.protocol || entities.protocol || 'TCP'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Target User</span>
                <span className="font-semibold text-white mt-1 block">{entities.username || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Failed Attempts</span>
                <span className="font-semibold text-rose-400 mt-1 block">{entities.failed_attempts ?? 0}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Connection State</span>
                <span className="font-semibold text-slate-200 mt-1 block">{incident.state || entities.state || 'CON'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Service</span>
                <span className="font-semibold text-slate-200 mt-1 block">{incident.service || entities.service || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-sans">Action Enforced</span>
                <span className="font-semibold text-emerald-400 mt-1 block">{entities.action || 'Logged'}</span>
              </div>
            </div>
          </div>

          {/* Generative AI Explanation Box */}
          <div className="rounded-xl border border-blue-900/50 bg-gradient-to-br from-[#0c162d] to-[#131f3d] p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-400/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider">
                Generative AI Incident Analysis
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-1">
                  Incident Summary
                </span>
                <p className="text-slate-200 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                  {ai.summary || 'AI incident summary generated based on analytical telemetry.'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-1">
                  Evidence & Behavioral Indicators
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                  {ai.evidence || 'Packet sequence and flag telemetry match attack signatures.'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-1">
                  Potential Security Impact
                </span>
                <p className="text-amber-200/90 leading-relaxed bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                  {ai.potential_impact || 'Moderate threat of service disruption or privilege escalation.'}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Investigation Steps */}
          <div className="rounded-xl border border-slate-800 bg-[#12192c]/70 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Recommended Investigation & Containment Steps
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
                  className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0e1424] border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            AI-Network Security Incident Analysis • MCA Capstone
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
