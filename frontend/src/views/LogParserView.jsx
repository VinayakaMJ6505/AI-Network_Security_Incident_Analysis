import React, { useState } from 'react';
import { uploadLog } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  FileCode,
  Upload,
  Cpu,
  Sparkles,
  Terminal,
  FileText,
  ArrowRight,
} from 'lucide-react';

const SAMPLE_LOGS = [
  {
    title: 'SSH Brute Force Intrusion',
    text: `2026-09-22 10:15:32\nBlocked connection from 192.168.1.45\nto server 10.0.0.10 using TCP port 22.\nUser admin generated 35 failed authentication attempts.`,
  },
  {
    title: 'Firewall Dropped Packet (UDP DNS)',
    text: `2026-09-23 04:12:00 DROP SRC=203.0.113.195 DST=172.16.0.5 PROTO=UDP SPT=54211 DPT=53 LEN=64 Action=Blocked`,
  },
  {
    title: 'Web Application SQL Injection',
    text: `2026-09-22 14:02:11 CRITICAL: Detected SQL injection attempt union select null, username, password from users at endpoint /login from 45.33.32.156 to server 10.0.0.5 using TCP port 80. User guest generated 12 failed attempts.`,
  },
  {
    title: 'Reverse Shellcode Delivery',
    text: `2026-09-22 16:45:10 ALERT: Shellcode execution /bin/sh detected from 103.251.167.20 to server 10.0.0.22 using TCP port 4444. User www-data spawned interactive shell.`,
  },
];

export default function LogParserView({ onSelectIncident, refreshIncidents }) {
  const [logText, setLogText] = useState(SAMPLE_LOGS[0].text);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);

  const handleUploadAndParse = async () => {
    if (!logText.trim()) return;
    setIsProcessing(true);
    try {
      const res = await uploadLog(logText);
      setParseResult(res);
      if (refreshIncidents) {
        refreshIncidents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSelectTemplate = (sample, idx) => {
    setLogText(sample.text);
    setActiveTemplateIdx(idx);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-[#0d1527]/80 to-slate-900/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
              <FileCode className="w-6 h-6 text-cyan-400" />
              NLP Log Parser & Extraction (POST /api/log/upload)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Extract structured security telemetry (IPs, ports, protocols, timestamps, user identities, and failed authentication bursts) from unstructured firewall or syslog logs using Regular Expressions and NLP.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
            AUTO-EXTRACTION
          </span>
        </div>

        {/* Sample logs quick buttons */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Load Template:
          </span>
          {SAMPLE_LOGS.map((sample, idx) => {
            const isSelected = activeTemplateIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(sample, idx)}
                className={`px-3.5 py-1.5 text-xs rounded-xl font-medium transition-all duration-200 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {sample.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel (Left) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-black/20 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> Raw Log Ingestion
            </h3>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-xs text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all font-mono">
              <Upload className="w-3.5 h-3.5" />
              Upload .txt / .log
              <input
                type="file"
                accept=".txt,.log,.json,.csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div className="relative flex-grow">
            <textarea
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              rows={9}
              placeholder="Paste raw firewall, IDS, syslog, or auth logs here..."
              className="w-full h-full min-h-[220px] p-4 text-xs font-mono rounded-xl bg-slate-950/90 border border-slate-800 text-cyan-200 placeholder-slate-500 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 focus:outline-none resize-none leading-relaxed transition-all selection:bg-cyan-500/30"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 font-mono">
              {logText.length} characters • UTF-8 Telemetry Stream
            </span>
            <button
              onClick={handleUploadAndParse}
              disabled={isProcessing || !logText.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <Cpu className="w-4 h-4" />
              {isProcessing ? 'Extracting Entities...' : 'Run NLP Entity Extraction'}
            </button>
          </div>
        </div>

        {/* Output Panel (Right) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-black/20">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Extracted Entities & Detection
          </h3>

          {!parseResult ? (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 text-cyan-400">
                <FileText className="w-6 h-6 opacity-70" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No log parsed yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Select one of the sample templates above or paste a custom log entry, then click "Run NLP Entity Extraction".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Structured Entity Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 uppercase font-sans block">Source IP</span>
                  <span className="font-bold text-cyan-300 mt-1 block truncate">
                    {parseResult.extracted_entities?.source_ip || 'N/A'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 uppercase font-sans block">Destination IP</span>
                  <span className="font-bold text-white mt-1 block truncate">
                    {parseResult.extracted_entities?.destination_ip || 'N/A'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 uppercase font-sans block">Port / Proto</span>
                  <span className="font-bold text-amber-400 mt-1 block">
                    {parseResult.extracted_entities?.port || 'N/A'} ({parseResult.extracted_entities?.protocol || 'TCP'})
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 uppercase font-sans block">Target User</span>
                  <span className="font-bold text-white mt-1 block truncate">
                    {parseResult.extracted_entities?.username || 'N/A'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 uppercase font-sans block">Failed Attempts</span>
                  <span className="font-bold text-rose-400 mt-1 block">
                    {parseResult.extracted_entities?.failed_attempts ?? 0}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 uppercase font-sans block">Action Status</span>
                  <span className="font-bold text-emerald-400 mt-1 block">
                    {parseResult.extracted_entities?.action || 'Logged'}
                  </span>
                </div>
              </div>

              {/* Created Incident Details Card */}
              {parseResult.incident && (
                <div className="p-5 rounded-xl border border-cyan-500/25 bg-gradient-to-br from-[#0c162d] via-slate-900 to-[#101932] shadow-xl shadow-cyan-500/5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-bold text-white font-display">
                      Classified Incident: {parseResult.incident.attack_type}
                    </span>
                    <StatusBadge severity={parseResult.incident.severity} />
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed mb-3">
                    {parseResult.incident.ai_explanation?.summary || parseResult.incident.ai_explanation?.incident_summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400 font-mono">
                      Risk Score: <strong className="text-white">{parseResult.incident.risk_score}</strong> / 100
                    </span>
                    <button
                      onClick={() => onSelectIncident(parseResult.incident)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                    >
                      View Full Dossier <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
