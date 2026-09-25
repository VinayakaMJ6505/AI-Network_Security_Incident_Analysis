import React, { useState } from 'react';
import { ATTACK_PRESETS } from '../utils/presets';
import { analyzeEvent } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import FAQSection from '../components/FAQSection';
import { ANALYZER_FAQ } from '../constants/faqContent';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { cn } from '../lib/cn';
import {
  Radio,
  Play,
  Sparkles,
  Cpu,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

const inputClass =
  'w-full rounded-xl border border-border bg-background px-3.5 py-2 font-mono text-xs text-foreground transition-all focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20';
const labelClass = 'mb-1.5 block text-xs font-medium text-muted-foreground';

export default function LiveAnalyzerView({ onSelectIncident }) {
  const [formData, setFormData] = useState({
    proto: 'tcp',
    service: 'http',
    state: 'INT',
    dur: 0.000008,
    sbytes: 184000,
    dbytes: 0,
    spkts: 2400,
    dpkts: 0,
    sload: 184000000,
    port: 80,
    source_ip: '45.33.32.156',
    destination_ip: '10.0.0.5',
    failed_attempts: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadPreset = (preset) => {
    setActivePreset(preset.name);
    setFormData((prev) => ({
      ...prev,
      ...preset.params,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) || value === '' ? value : Number(value),
    }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await analyzeEvent(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result?.ai_explanation) return;
    const text = `SECURITY INCIDENT REPORT\nAttack: ${result.attack_type}\nConfidence: ${(result.confidence * 100).toFixed(1)}%\nRisk Score: ${result.risk_score} (${result.severity})\nSummary: ${result.ai_explanation.summary || result.ai_explanation.incident_summary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Preset Bar */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              <Radio className="h-6 w-6 text-primary" />
              Live Event Analyzer (POST /api/analyze)
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Inject live network traffic telemetry into the XGBoost classification engine and automated Generative AI incident analysis pipeline.
            </p>
          </div>
          <Badge variant="primary" className="self-start sm:self-auto">REAL-TIME INFERENCE</Badge>
        </div>

        {/* Tactical Scenario Presets */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-warning" /> Attack Scenarios:
          </span>
          {ATTACK_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => loadPreset(preset)}
                className={cn(
                  'rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  isSelected
                    ? 'border-foreground bg-foreground text-background shadow-sm'
                    : 'border-border bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground'
                )}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form Inputs (Left) */}
        <Card className="p-6 sm:p-7 lg:col-span-7">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <Cpu className="h-4 w-4 text-primary" /> Network Flow Parameters
            </h3>
            <span className="font-mono text-xs text-muted-foreground">UNSW-NB15 SCHEMA</span>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Source IP</span>
                  <span className="font-mono text-[10px] text-primary">FLOW ORIGIN</span>
                </label>
                <input type="text" name="source_ip" value={formData.source_ip} onChange={handleInputChange} className={inputClass} required />
              </div>

              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Destination IP</span>
                  <span className="font-mono text-[10px] text-info">TARGET ASSET</span>
                </label>
                <input type="text" name="destination_ip" value={formData.destination_ip} onChange={handleInputChange} className={inputClass} required />
              </div>

              <div>
                <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Target Port</span>
                  <span className="font-mono text-[10px] text-warning">SERVICE PORT</span>
                </label>
                <input type="number" name="port" value={formData.port} onChange={handleInputChange} className={inputClass} required />
              </div>

              <div>
                <label className={labelClass}>Protocol (proto)</label>
                <select name="proto" value={formData.proto} onChange={handleInputChange} className={inputClass}>
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                  <option value="icmp">ICMP</option>
                  <option value="arp">ARP</option>
                  <option value="ospf">OSPF</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Service</label>
                <input type="text" name="service" value={formData.service} onChange={handleInputChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Connection State</label>
                <select name="state" value={formData.state} onChange={handleInputChange} className={inputClass}>
                  <option value="CON">CON (Connected)</option>
                  <option value="FIN">FIN (Finished)</option>
                  <option value="INT">INT (Interrupted)</option>
                  <option value="REQ">REQ (Requested)</option>
                  <option value="RST">RST (Reset)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Flow Duration (sec)</label>
                <input type="number" step="any" name="dur" value={formData.dur} onChange={handleInputChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Source Load (sload bps)</label>
                <input type="number" name="sload" value={formData.sload} onChange={handleInputChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Source Bytes (sbytes)</label>
                <input type="number" name="sbytes" value={formData.sbytes} onChange={handleInputChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Destination Bytes (dbytes)</label>
                <input type="number" name="dbytes" value={formData.dbytes} onChange={handleInputChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Source Packets (spkts)</label>
                <input type="number" name="spkts" value={formData.spkts} onChange={handleInputChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Failed Auth Attempts</label>
                <input type="number" name="failed_attempts" value={formData.failed_attempts} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button type="submit" variant="primary" disabled={isLoading} className="px-6 py-2.5">
                <Play className="h-4 w-4 fill-current" />
                {isLoading ? 'Running Inference...' : 'Analyze Event'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Inference Results (Right) */}
        <Card className="p-6 sm:p-7 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <ShieldAlert className="h-4 w-4 text-destructive" /> AI Classification Output
            </h3>
            {result && (
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Report'}
              </button>
            )}
          </div>

          {!result ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Play className="ml-0.5 h-6 w-6 fill-current opacity-70" />
              </div>
              <p className="text-sm font-semibold text-foreground">No event analyzed yet</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Select an attack scenario preset above or configure custom flow attributes, then click "Analyze Event".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Classification Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-muted/40 p-4 shadow-sm">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Prediction
                  </span>
                  <span className="mt-1 block font-display text-lg font-extrabold text-foreground">
                    {result.attack_type}
                  </span>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="mt-1 block font-mono text-xs text-primary">
                    {(result.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-4 shadow-sm">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Risk Assessment
                  </span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-mono text-2xl font-extrabold text-foreground">
                      {result.risk_score}
                    </span>
                    <StatusBadge severity={result.severity} />
                  </div>
                  <span className="mt-1 block font-mono text-xs text-muted-foreground">
                    Score: 0–100 Scale
                  </span>
                </div>
              </div>

              {/* Multi-Class Probability Breakdown */}
              {result.probabilities && Object.keys(result.probabilities).length > 0 && (
                <div className="rounded-xl border border-border bg-muted/30 p-4 shadow-sm">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      XGBoost Multi-Class Probability Distribution
                    </span>
                    <Badge variant="primary">10 CLASSES</Badge>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(result.probabilities)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([cls, prob]) => {
                        const pct = Math.round(prob * 100);
                        const isTop = cls === result.attack_type;
                        return (
                          <div key={cls} className="space-y-1">
                            <div className="flex justify-between font-mono text-xs">
                              <span className={isTop ? 'font-bold text-primary' : 'text-muted-foreground'}>
                                {cls} {isTop && '★'}
                              </span>
                              <span className={isTop ? 'font-bold text-primary' : 'text-muted-foreground/70'}>
                                {pct}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn('h-1.5 rounded-full', isTop ? 'bg-primary' : 'bg-border')}
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* GenAI Report */}
              <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-5 shadow-sm">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Generative AI Explanation
                    </span>
                  </div>
                  <Badge variant="primary">SOC ASSIST</Badge>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-foreground">
                  {result.ai_explanation?.summary || result.ai_explanation?.incident_summary}
                </p>

                <div className="mb-3 rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
                  <strong className="mb-1 block text-primary">Telemetry Evidence:</strong>
                  {Array.isArray(result.ai_explanation?.evidence)
                    ? result.ai_explanation.evidence.join(' • ')
                    : String(result.ai_explanation?.evidence || 'Classified via XGBoost feature weights.')}
                </div>

                <div className="border-t border-border pt-2">
                  <strong className="mb-2 block text-xs text-foreground">
                    Recommended SOC Actions:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {(result.ai_explanation?.recommendations || result.ai_explanation?.investigation_recommendations || []).map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <FAQSection title="Live Analyzer FAQ" items={ANALYZER_FAQ} />
    </div>
  );
}
