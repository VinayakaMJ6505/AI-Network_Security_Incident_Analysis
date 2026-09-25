import React, { useState } from 'react';
import { uploadLog } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import FAQSection from '../components/FAQSection';
import { LOGPARSER_FAQ } from '../constants/faqContent';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { cn } from '../lib/cn';
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
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              <FileCode className="h-6 w-6 text-primary" />
              NLP Log Parser &amp; Extraction (POST /api/log/upload)
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Extract structured security telemetry (IPs, ports, protocols, timestamps, user identities, and failed authentication bursts) from unstructured firewall or syslog logs using Regular Expressions and NLP.
            </p>
          </div>
          <Badge variant="primary" className="self-start sm:self-auto">AUTO-EXTRACTION</Badge>
        </div>

        {/* Sample logs quick buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Load Template:
          </span>
          {SAMPLE_LOGS.map((sample, idx) => {
            const isSelected = activeTemplateIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(sample, idx)}
                className={cn(
                  'rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  isSelected
                    ? 'border-foreground bg-foreground text-background shadow-sm'
                    : 'border-border bg-muted text-muted-foreground hover:border-primary/30 hover:text-foreground'
                )}
              >
                {sample.title}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Input Panel (Left) */}
        <Card className="flex flex-col p-6 sm:p-7 lg:col-span-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <Terminal className="h-4 w-4 text-success" /> Raw Log Ingestion
            </h3>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-1.5 font-mono text-xs text-primary transition-all hover:border-primary/40">
              <Upload className="h-3.5 w-3.5" />
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
              className="h-full min-h-[220px] w-full resize-none rounded-xl border border-border bg-background p-4 font-mono text-xs leading-relaxed text-foreground placeholder-muted-foreground transition-all selection:bg-primary/30 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <span className="font-mono text-xs text-muted-foreground">
              {logText.length} characters • UTF-8 Telemetry Stream
            </span>
            <button
              onClick={handleUploadAndParse}
              disabled={isProcessing || !logText.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Cpu className="h-4 w-4" />
              {isProcessing ? 'Extracting Entities...' : 'Run NLP Entity Extraction'}
            </button>
          </div>
        </Card>

        {/* Output Panel (Right) */}
        <Card className="p-6 sm:p-7 lg:col-span-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> Extracted Entities &amp; Detection
          </h3>

          {!parseResult ? (
            <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <FileText className="h-6 w-6 opacity-70" />
              </div>
              <p className="text-sm font-semibold text-foreground">No log parsed yet</p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                Select one of the sample templates above or paste a custom log entry, then click "Run NLP Entity Extraction".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Structured Entity Grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <span className="block font-sans text-[11px] uppercase text-muted-foreground">Source IP</span>
                  <span className="mt-1 block truncate font-bold text-primary">
                    {parseResult.extracted_entities?.source_ip || 'N/A'}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <span className="block font-sans text-[11px] uppercase text-muted-foreground">Destination IP</span>
                  <span className="mt-1 block truncate font-bold text-foreground">
                    {parseResult.extracted_entities?.destination_ip || 'N/A'}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <span className="block font-sans text-[11px] uppercase text-muted-foreground">Port / Proto</span>
                  <span className="mt-1 block font-bold text-warning">
                    {parseResult.extracted_entities?.port || 'N/A'} ({parseResult.extracted_entities?.protocol || 'TCP'})
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <span className="block font-sans text-[11px] uppercase text-muted-foreground">Target User</span>
                  <span className="mt-1 block truncate font-bold text-foreground">
                    {parseResult.extracted_entities?.username || 'N/A'}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <span className="block font-sans text-[11px] uppercase text-muted-foreground">Failed Attempts</span>
                  <span className="mt-1 block font-bold text-destructive">
                    {parseResult.extracted_entities?.failed_attempts ?? 0}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/40 p-3.5">
                  <span className="block font-sans text-[11px] uppercase text-muted-foreground">Action Status</span>
                  <span className="mt-1 block font-bold text-success">
                    {parseResult.extracted_entities?.action || 'Logged'}
                  </span>
                </div>
              </div>

              {/* Created Incident Details Card */}
              {parseResult.incident && (
                <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-5 shadow-sm">
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-foreground">
                      Classified Incident: {parseResult.incident.attack_type}
                    </span>
                    <StatusBadge severity={parseResult.incident.severity} />
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-foreground">
                    {parseResult.incident.ai_explanation?.summary || parseResult.incident.ai_explanation?.incident_summary}
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                    <span className="font-mono text-muted-foreground">
                      Risk Score: <strong className="text-foreground">{parseResult.incident.risk_score}</strong> / 100
                    </span>
                    <button
                      onClick={() => onSelectIncident(parseResult.incident)}
                      className="flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      View Full Dossier <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <FAQSection title="Log Parser FAQ" items={LOGPARSER_FAQ} />
    </div>
  );
}
