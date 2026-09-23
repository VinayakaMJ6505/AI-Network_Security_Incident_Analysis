import React, { useState } from 'react';
import { uploadLog } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  FileCode,
  Upload,
  Cpu,
  Sparkles,
  CheckCircle2,
  Copy,
  Terminal,
  FileText,
} from 'lucide-react';

const SAMPLE_LOGS = [
  {
    title: 'README Example: SSH Brute Force',
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
    title: 'Reverse Shell Listener Execution',
    text: `2026-09-22 16:45:10 ALERT: Shellcode execution /bin/sh detected from 103.251.167.20 to server 10.0.0.22 using TCP port 4444. User www-data spawned interactive shell.`,
  },
];

export default function LogParserView({ onSelectIncident, refreshIncidents }) {
  const [logText, setLogText] = useState(SAMPLE_LOGS[0].text);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileCode className="w-5 h-5 text-cyan-400" />
          NLP Log Parser & Extraction (POST /api/log/upload)
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Extract structured security entities (IP addresses, ports, protocols, timestamps, usernames, and failed login attempts) from unstructured firewall and server logs using NLP and Regular Expressions.
        </p>

        {/* Sample logs quick buttons */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Load Template:
          </span>
          {SAMPLE_LOGS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setLogText(sample.text)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel (Left) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" /> Raw Log Ingestion
            </h3>

            <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Upload .txt / .log
              <input
                type="file"
                accept=".txt,.log,.json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            rows={8}
            placeholder="Paste raw firewall, IDS, syslog, or auth logs here..."
            className="w-full flex-grow p-3.5 text-xs font-mono rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {logText.length} characters • UTF-8
            </span>
            <button
              onClick={handleUploadAndParse}
              disabled={isProcessing || !logText.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              {isProcessing ? 'Extracting Entities...' : 'Run NLP Entity Extraction'}
            </button>
          </div>
        </div>

        {/* Output Panel (Right) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Extracted Entities & Detection
          </h3>

          {!parseResult ? (
            <div className="h-72 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500">
              <FileText className="w-10 h-10 mb-3 opacity-30 text-purple-400" />
              <p className="text-xs font-medium">No log parsed yet.</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                Select one of the sample logs on top or paste custom log text, then click "Run NLP Entity Extraction".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Structured Entity Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Source IP</span>
                  <span className="font-bold text-white mt-0.5 block">{parseResult.extracted_entities?.source_ip || 'N/A'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Destination IP</span>
                  <span className="font-bold text-white mt-0.5 block">{parseResult.extracted_entities?.destination_ip || 'N/A'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Port / Proto</span>
                  <span className="font-bold text-white mt-0.5 block">
                    {parseResult.extracted_entities?.port || 'N/A'} ({parseResult.extracted_entities?.protocol || 'TCP'})
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Target User</span>
                  <span className="font-bold text-white mt-0.5 block">{parseResult.extracted_entities?.username || 'N/A'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Failed Attempts</span>
                  <span className="font-bold text-rose-400 mt-0.5 block">
                    {parseResult.extracted_entities?.failed_attempts ?? 0}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-sans block">Action Status</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">
                    {parseResult.extracted_entities?.action || 'Logged'}
                  </span>
                </div>
              </div>

              {/* Created Incident Details Card */}
              {parseResult.incident && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      Classified Incident: {parseResult.incident.attack_type}
                    </span>
                    <StatusBadge severity={parseResult.incident.severity} />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {parseResult.incident.ai_explanation?.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 font-mono">
                      Risk Score: {parseResult.incident.risk_score} / 100
                    </span>
                    <button
                      onClick={() => onSelectIncident(parseResult.incident)}
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      View Full Dossier →
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
