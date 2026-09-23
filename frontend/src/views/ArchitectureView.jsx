import React from 'react';
import {
  Layers,
  Cpu,
  BrainCircuit,
  Database,
  Terminal,
  Shield,
  FileText,
  Award,
} from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          System Architecture & Machine Learning Specifications
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Comprehensive overview of data pipelines, XGBoost attack classification, NLP log extraction, Generative AI explanation, and model evaluation metrics.
        </p>
      </div>

      {/* Architecture Flowchart / Diagram */}
      <div className="rounded-xl border border-slate-800 bg-[#111726]/80 p-6 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-blue-400" /> End-to-End Analytical Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-blue-400 uppercase">Step 01</span>
            <div className="my-2">
              <span className="text-xs font-bold text-white block">Raw Traffic & Logs</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">UNSW-NB15 CSV / Syslog</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Pandas & PySpark</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-cyan-400 uppercase">Step 02</span>
            <div className="my-2">
              <span className="text-xs font-bold text-white block">Feature Engineering</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">One-Hot & Standard Scale</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">194 Numerical Features</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-blue-500/40 bg-blue-950/20 flex flex-col justify-between shadow-lg shadow-blue-500/10">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Step 03</span>
            <div className="my-2">
              <span className="text-xs font-bold text-white block">XGBoost Multiclass</span>
              <span className="text-[11px] text-emerald-300 block mt-0.5">10 Attack Categories</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">97.4% Accuracy</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-purple-400 uppercase">Step 04</span>
            <div className="my-2">
              <span className="text-xs font-bold text-white block">Risk & Severity</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Weighted Port & Conf</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">0–100 Severity Matrix</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-amber-400 uppercase">Step 05</span>
            <div className="my-2">
              <span className="text-xs font-bold text-white block">Generative AI</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Natural Lang Explanation</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Actionable SOC Steps</span>
          </div>
        </div>
      </div>

      {/* Model Evaluation Comparison Table (README Specification) */}
      <div className="rounded-xl border border-slate-800 bg-[#111726]/80 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Evaluated Machine Learning Models
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison across UNSW-NB15 testing partition (82,332 records)
            </p>
          </div>
          <Cpu className="w-5 h-5 text-slate-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 uppercase font-semibold text-[11px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Model Algorithm</th>
                <th className="py-3 px-4">Task Type</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-white font-sans">Logistic Regression</td>
                <td className="py-3.5 px-4 text-slate-400 font-sans">Baseline Binary</td>
                <td className="py-3.5 px-4">81.2%</td>
                <td className="py-3.5 px-4">80.5%</td>
                <td className="py-3.5 px-4">79.8%</td>
                <td className="py-3.5 px-4">80.1%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Baseline</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-white font-sans">Random Forest</td>
                <td className="py-3.5 px-4 text-slate-400 font-sans">Multiclass (10-cat)</td>
                <td className="py-3.5 px-4">94.8%</td>
                <td className="py-3.5 px-4">93.9%</td>
                <td className="py-3.5 px-4">94.2%</td>
                <td className="py-3.5 px-4">94.0%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">Evaluated</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 bg-blue-950/20">
                <td className="py-3.5 px-4 font-bold text-emerald-400 font-sans flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  XGBoost (Production Final)
                </td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">Multiclass (10-cat)</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">97.4%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">97.1%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">96.8%</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">96.9%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    Active Deployed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset & Academic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" /> Dataset Specifications (UNSW-NB15)
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Source:</strong> Australian Centre for Cyber Security (ACCS), UNSW Canberra.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Total Dataset Records:</strong> 2,540,044 network flows in total repository.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Feature Vector:</strong> 44 network metrics + One-Hot encoded categorical protocol features.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Attack Spectrum:</strong> Fuzzers, Analysis, Backdoors, DoS, Exploits, Generic, Reconnaissance, Shellcode, Worms.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Project Metadata
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Project Title:</span>
              <span className="font-semibold text-white">AI-Powered Network Security Incident Analysis</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Degree:</span>
              <span className="text-slate-200">Master of Computer Applications (MCA)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Institution:</span>
              <span className="text-slate-200">Nitte Meenakshi Institute of Technology (NMIT)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Core Technologies:</span>
              <span className="text-blue-400 font-mono text-[11px]">XGBoost • PySpark • NLP • React • FastAPI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
