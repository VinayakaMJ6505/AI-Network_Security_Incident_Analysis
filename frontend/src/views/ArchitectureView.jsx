import React from 'react';
import {
  Layers,
  Cpu,
  BrainCircuit,
  Shield,
} from 'lucide-react';

export default function ArchitectureView() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-[#0d1527]/80 to-slate-900/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
          <Layers className="w-6 h-6 text-purple-400" />
          System Architecture & Machine Learning Specifications
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Comprehensive overview of data pipelines, XGBoost attack classification, NLP log extraction, Generative AI explanation, and model evaluation metrics.
        </p>
      </div>

      {/* Architecture Flowchart / Diagram */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-black/20">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" /> End-to-End Analytical Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-center">
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Step 01</span>
            <div className="my-3">
              <span className="text-sm font-bold text-white block">Raw Traffic & Logs</span>
              <span className="text-xs text-slate-400 block mt-1">UNSW-NB15 CSV / Syslog</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Pandas & PySpark</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">Step 02</span>
            <div className="my-3">
              <span className="text-sm font-bold text-white block">Feature Engineering</span>
              <span className="text-xs text-slate-400 block mt-1">One-Hot & Standard Scale</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">194 Numerical Features</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-cyan-500/40 bg-cyan-950/20 flex flex-col justify-between shadow-lg shadow-cyan-500/10">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Step 03</span>
            <div className="my-3">
              <span className="text-sm font-bold text-white block">XGBoost Multiclass</span>
              <span className="text-xs text-emerald-300 block mt-1">10 Attack Categories</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">97.4% Accuracy</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">Step 04</span>
            <div className="my-3">
              <span className="text-sm font-bold text-white block">Risk & Severity</span>
              <span className="text-xs text-slate-400 block mt-1">Weighted Port & Conf</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">0–100 Severity Matrix</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">Step 05</span>
            <div className="my-3">
              <span className="text-sm font-bold text-white block">Generative AI</span>
              <span className="text-xs text-slate-400 block mt-1">Natural Lang Explanation</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Actionable SOC Steps</span>
          </div>
        </div>
      </div>

      {/* Model Evaluation Comparison Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl shadow-black/20">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight font-display">
              Evaluated Machine Learning Models
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparison across UNSW-NB15 testing partition (82,332 records)
            </p>
          </div>
          <Cpu className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 uppercase font-semibold text-[11px] text-slate-400 border-b border-slate-800/80 font-sans tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Model Algorithm</th>
                <th className="py-3.5 px-4">Task Type</th>
                <th className="py-3.5 px-4 font-mono">Accuracy</th>
                <th className="py-3.5 px-4 font-mono">Precision</th>
                <th className="py-3.5 px-4 font-mono">Recall</th>
                <th className="py-3.5 px-4 font-mono">F1-Score</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              <tr className="hover:bg-cyan-500/[0.03] transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">Logistic Regression</td>
                <td className="py-3.5 px-4 text-slate-400">Baseline Binary</td>
                <td className="py-3.5 px-4 font-mono">81.2%</td>
                <td className="py-3.5 px-4 font-mono">80.5%</td>
                <td className="py-3.5 px-4 font-mono">79.8%</td>
                <td className="py-3.5 px-4 font-mono">80.1%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 border border-slate-700">Baseline</span>
                </td>
              </tr>
              <tr className="hover:bg-cyan-500/[0.03] transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">Random Forest</td>
                <td className="py-3.5 px-4 text-slate-400">Multiclass (10-cat)</td>
                <td className="py-3.5 px-4 font-mono">94.8%</td>
                <td className="py-3.5 px-4 font-mono">93.9%</td>
                <td className="py-3.5 px-4 font-mono">94.2%</td>
                <td className="py-3.5 px-4 font-mono">94.0%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30">Evaluated</span>
                </td>
              </tr>
              <tr className="bg-cyan-950/20 border-l-2 border-cyan-400">
                <td className="py-3.5 px-4 font-bold text-cyan-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  XGBoost (Production Final)
                </td>
                <td className="py-3.5 px-4 text-slate-300">Multiclass (10-cat)</td>
                <td className="py-3.5 px-4 font-bold text-cyan-300 font-mono">97.4%</td>
                <td className="py-3.5 px-4 font-bold text-cyan-300 font-mono">97.1%</td>
                <td className="py-3.5 px-4 font-bold text-cyan-300 font-mono">96.8%</td>
                <td className="py-3.5 px-4 font-bold text-cyan-300 font-mono">96.9%</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-bold">
                    PRODUCTION
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
