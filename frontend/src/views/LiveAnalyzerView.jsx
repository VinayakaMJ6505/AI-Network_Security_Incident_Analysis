import React, { useState } from 'react';
import { ATTACK_PRESETS } from '../utils/presets';
import { analyzeEvent } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  Radio,
  Play,
  Sparkles,
  Cpu,
  Terminal,
  ShieldAlert,
  RotateCcw,
  Zap,
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

  const loadPreset = (preset) => {
    setFormData({
      ...formData,
      ...preset.params,
    });
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-400" />
          Live Event Analyzer (POST /api/analyze)
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Simulate or inject raw network traffic telemetry into the XGBoost classification and Generative AI risk pipeline in real time.
        </p>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Attack Scenarios:
          </span>
          {ATTACK_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => loadPreset(preset)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> Network Flow Parameters
          </h3>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Source IP
                </label>
                <input
                  type="text"
                  name="source_ip"
                  value={formData.source_ip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Destination IP
                </label>
                <input
                  type="text"
                  name="destination_ip"
                  value={formData.destination_ip}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Target Port
                </label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Protocol (proto)
                </label>
                <select
                  name="proto"
                  value={formData.proto}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="tcp">TCP</option>
                  <option value="udp">UDP</option>
                  <option value="icmp">ICMP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Service
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="http">http (Web)</option>
                  <option value="ssh">ssh (Remote Admin)</option>
                  <option value="ftp">ftp (File Transfer)</option>
                  <option value="dns">dns (Domain Lookup)</option>
                  <option value="smb">smb (File Sharing)</option>
                  <option value="https">https (Secure Web)</option>
                  <option value="shell">shell (Reverse Shell)</option>
                  <option value="-">- (None/Generic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Connection State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="CON">CON (Connected)</option>
                  <option value="INT">INT (Interrupted / SYN)</option>
                  <option value="FIN">FIN (Finished)</option>
                  <option value="REQ">REQ (Request)</option>
                  <option value="RST">RST (Reset)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Source Bytes (sbytes)
                </label>
                <input
                  type="number"
                  name="sbytes"
                  value={formData.sbytes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Destination Bytes (dbytes)
                </label>
                <input
                  type="number"
                  name="dbytes"
                  value={formData.dbytes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Source Packets (spkts)
                </label>
                <input
                  type="number"
                  name="spkts"
                  value={formData.spkts}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Failed Auth Attempts
                </label>
                <input
                  type="number"
                  name="failed_attempts"
                  value={formData.failed_attempts}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isLoading ? 'Running Inference...' : 'Analyze Event'}
              </button>
            </div>
          </form>
        </div>

        {/* Inference Results (Right) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> AI Classification Output
          </h3>

          {!result ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
              <Play className="w-10 h-10 mb-3 opacity-30 text-blue-400" />
              <p className="text-xs font-medium">No event analyzed yet.</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Select an attack scenario preset or enter network flow attributes, then click "Analyze Event".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Classification Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Prediction
                  </span>
                  <span className="text-lg font-bold text-white mt-1 block">
                    {result.attack_type}
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">
                    {(result.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Risk Assessment
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-white font-mono">
                      {result.risk_score}
                    </span>
                    <StatusBadge severity={result.severity} />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Score: 0–100 Scale
                  </span>
                </div>
              </div>

              {/* GenAI Report */}
              <div className="p-4 rounded-xl border border-blue-900/40 bg-gradient-to-br from-[#0c162d] to-[#111a33]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    Generative AI Explanation
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed mb-3">
                  {result.ai_explanation?.summary}
                </p>

                <div className="text-[11px] text-slate-300 mb-2">
                  <strong className="text-slate-400 block mb-0.5">Evidence:</strong>
                  {result.ai_explanation?.evidence}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <strong className="text-[11px] text-slate-400 block mb-1">
                    Recommended Actions:
                  </strong>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {result.ai_explanation?.recommendations?.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{rec}</span>
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
