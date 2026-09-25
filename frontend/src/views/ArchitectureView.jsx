import React from 'react';
import { Layers, Cpu, BrainCircuit, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FAQSection from '../components/FAQSection';
import { ARCHITECTURE_FAQ } from '../constants/faqContent';
import { cn } from '../lib/cn';

const PIPELINE_STEPS = [
  { step: '01', title: 'Raw Traffic & Logs', desc: 'UNSW-NB15 CSV / Syslog', footer: 'Pandas & PySpark', accent: 'text-primary' },
  { step: '02', title: 'Feature Engineering', desc: 'One-Hot & Standard Scale', footer: '194 Numerical Features', accent: 'text-info' },
  { step: '03', title: 'XGBoost Multiclass', desc: '10 Attack Categories', footer: '76.97% Accuracy', accent: 'text-success', highlight: true },
  { step: '04', title: 'Risk & Severity', desc: 'Weighted Port & Conf', footer: '0–100 Severity Matrix', accent: 'text-foreground' },
  { step: '05', title: 'Generative AI', desc: 'Natural Lang Explanation', footer: 'Actionable SOC Steps', accent: 'text-warning' },
];

// Real measured results from the training notebook's final "without ID"
// multiclass comparison (backend/reports/model_evaluation_report.json +
// AI_Network_Security_Incident_Analysis.ipynb) — not placeholders.
// Precision/Recall/F1 here are weighted averages; the model struggles much
// more on a per-class (macro) basis — see the Threat Analytics / model
// evaluation report for the full breakdown.
const MODEL_ROWS = [
  { name: 'Logistic Regression', task: 'Baseline Multiclass (10-cat)', accuracy: '69.8%', precision: '79.4%', recall: '69.8%', f1: '70.6%', status: 'Baseline', tone: 'default' },
  { name: 'Random Forest', task: 'Multiclass (10-cat)', accuracy: '75.4%', precision: '83.9%', recall: '75.4%', f1: '77.6%', status: 'Evaluated', tone: 'primary' },
  { name: 'XGBoost (Production Final)', task: 'Multiclass (10-cat)', accuracy: '77.0%', precision: '83.5%', recall: '77.0%', f1: '77.9%', status: 'PRODUCTION', tone: 'success', final: true },
];

export default function ArchitectureView() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card via-card to-card p-6 sm:p-8">
        <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          <Layers className="h-6 w-6 text-primary" />
          System Architecture &amp; Machine Learning Specifications
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Comprehensive overview of data pipelines, XGBoost attack classification, NLP log extraction, Generative AI explanation, and model evaluation metrics.
        </p>
      </Card>

      <Card className="p-6 sm:p-7">
        <h3 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
          <BrainCircuit className="h-4 w-4 text-primary" /> End-to-End Analytical Pipeline
        </h3>

        <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 lg:grid-cols-5">
          {PIPELINE_STEPS.map((s) => (
            <div
              key={s.step}
              className={cn(
                'flex flex-col justify-between rounded-xl border p-5 transition-colors',
                s.highlight
                  ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border bg-muted/40 hover:border-primary/40'
              )}
            >
              <span className={cn('font-mono text-[10px] font-semibold uppercase', s.accent)}>Step {s.step}</span>
              <div className="my-3">
                <span className="block text-sm font-bold text-foreground">{s.title}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{s.desc}</span>
              </div>
              <span className={cn('font-mono text-xs', s.highlight ? 'font-bold text-success' : 'text-muted-foreground')}>
                {s.footer}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="font-display text-base font-bold tracking-tight text-foreground">
              Evaluated Machine Learning Models
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Comparison across UNSW-NB15 testing partition (82,332 records)
            </p>
          </div>
          <Cpu className="h-5 w-5 text-primary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-muted-foreground">
            <thead className="border-b border-border font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3.5">Model Algorithm</th>
                <th className="px-4 py-3.5">Task Type</th>
                <th className="px-4 py-3.5 font-mono">Accuracy</th>
                <th className="px-4 py-3.5 font-mono">Precision</th>
                <th className="px-4 py-3.5 font-mono">Recall</th>
                <th className="px-4 py-3.5 font-mono">F1-Score</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MODEL_ROWS.map((row) => (
                <tr key={row.name} className={cn('transition-colors hover:bg-primary/[0.04]', row.final && 'bg-primary/5 border-l-2 border-primary')}>
                  <td className={cn('flex items-center gap-1.5 px-4 py-3.5 font-bold', row.final ? 'text-primary' : 'text-foreground')}>
                    {row.final && <Shield className="h-3.5 w-3.5 text-primary" />}
                    {row.name}
                  </td>
                  <td className="px-4 py-3.5">{row.task}</td>
                  <td className={cn('px-4 py-3.5 font-mono', row.final && 'font-bold text-primary')}>{row.accuracy}</td>
                  <td className={cn('px-4 py-3.5 font-mono', row.final && 'font-bold text-primary')}>{row.precision}</td>
                  <td className={cn('px-4 py-3.5 font-mono', row.final && 'font-bold text-primary')}>{row.recall}</td>
                  <td className={cn('px-4 py-3.5 font-mono', row.final && 'font-bold text-primary')}>{row.f1}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={row.tone}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <FAQSection title="Architecture & ML FAQ" items={ARCHITECTURE_FAQ} />
    </div>
  );
}
