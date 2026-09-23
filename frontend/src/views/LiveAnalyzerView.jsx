import React, { useState } from 'react';
import { ATTACK_PRESETS } from '../utils/presets';
import { analyzeEvent } from '../services/api';
import StatusBadge from '../components/StatusBadge';
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
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-[#0d1527]/80 to-slate-900/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
              <Radio className="w-6 h-6 text-cyan-400" />
              Live Event Analyzer (POST /api/analyze)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Inject live network traffic telemetry into the XGBoost classification engine and automated Generative AI incident analysis pipeline.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
            REAL-TIME INFERENCE
          </span>
        </div>

        {/* Tactical Scenario Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Attack Scenarios:
          </span>
          {ATTACK_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => loadPreset(preset)}
                className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all duration-200 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" /> Network Flow Parameters
            </h3>
            <span className="text-xs font-mono text-slate-400">UNSW-NB15 SCHEMA</span>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Source IP</span>
                  <span className="text-[10px] text-cyan-400 font-mono">FLOW ORIGIN</span>
                </label>
                <input
                  type="text"
                  name="source_ip"
                  value={formData.source_ip}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Destination IP</span>
                  <span className="text-[10px] text-purple-400 font-mono">TARGET ASSET</span>
                </label>
                <input
                  type="text"
                  name="destination_ip"
                  value={formData.destination_ip}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Target Port</span>
                  <span className="text-[10px] text-amber-400 font-mono">SERVICE PORT</span>
                </label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Protocol (proto)
                </label>
                <select
                  name="proto"
                  value={formData.proto}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                >
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                  <option value="icmp">ICMP</option>
                  <option value="arp">ARP</option>
                  <option value="ospf">OSPF</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Service
                </label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Connection State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                >
                  <option value="CON">CON (Connected)</option>
                  <option value="FIN">FIN (Finished)</option>
                  <option value="INT">INT (Interrupted)</option>
                  <option value="REQ">REQ (Requested)</option>
                  <option value="RST">RST (Reset)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Flow Duration (sec)
                </label>
                <input
                  type="number"
                  step="any"
                  name="dur"
                  value={formData.dur}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Source Load (sload bps)
                </label>
                <input
                  type="number"
                  name="sload"
                  value={formData.sload}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Source Bytes (sbytes)
                </label>
                <input
                  type="number"
                  name="sbytes"
                  value={formData.sbytes}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Destination Bytes (dbytes)
                </label>
                <input
                  type="number"
                  name="dbytes"
                  value={formData.dbytes}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Source Packets (spkts)
                </label>
                <input
                  type="number"
                  name="spkts"
                  value={formData.spkts}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Failed Auth Attempts
                </label>
                <input
                  type="number"
                  name="failed_attempts"
                  value={formData.failed_attempts}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono focus:border-cyan-500/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                {isLoading ? 'Running Inference...' : 'Analyze Event'}
              </button>
            </div>
          </form>
        </div>

        {/* Inference Results (Right) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> AI Classification Output
            </h3>
            {result && (
              <button
                onClick={handleCopyReport}
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Report'}
              </button>
            )}
          </div>

          {!result ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 text-cyan-400">
                <Play className="w-6 h-6 fill-current opacity-70 ml-0.5" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No event analyzed yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Select an attack scenario preset above or configure custom flow attributes, then click "Analyze Event".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Classification Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-sm">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                    Prediction
                  </span>
                  <span className="text-lg font-extrabold text-white mt-1 block font-display">
                    {result.attack_type}
                  </span>
                  <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-cyan-400 font-mono block mt-1">
                    {(result.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-sm">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                    Risk Assessment
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-extrabold text-white font-mono">
                      {result.risk_score}
                    </span>
                    <StatusBadge severity={result.severity} />
                  </div>
                  <span className="text-xs text-slate-400 block mt-1 font-mono">
                    Score: 0–100 Scale
                  </span>
                </div>
              </div>

              {/* Multi-Class Probability Radar / Breakdown */}
              {result.probabilities && Object.keys(result.probabilities).length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      XGBoost Multi-Class Probability Distribution
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      10 CLASSES
                    </span>
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
                            <div className="flex justify-between text-xs font-mono">
                              <span className={isTop ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                                {cls} {isTop && '★'}
                              </span>
                              <span className={isTop ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                                {pct}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isTop ? 'bg-cyan-400' : 'bg-slate-700'
                                }`}
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
              <div className="p-5 rounded-xl border border-cyan-500/25 bg-gradient-to-br from-[#0c162d] via-slate-900 to-[#101932] shadow-xl shadow-cyan-500/5">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      Generative AI Explanation
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    SOC ASSIST
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed mb-3">
                  {result.ai_explanation?.summary || result.ai_explanation?.incident_summary}
                </p>

                <div className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 font-mono">
                  <strong className="text-cyan-400 block mb-1">Telemetry Evidence:</strong>
                  {Array.isArray(result.ai_explanation?.evidence)
                    ? result.ai_explanation.evidence.join(' • ')
                    : String(result.ai_explanation?.evidence || 'Classified via XGBoost feature weights.')}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <strong className="text-xs text-slate-300 block mb-2">
                    Recommended SOC Actions:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {(result.ai_explanation?.recommendations || result.ai_explanation?.investigation_recommendations || []).map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
