import React from 'react';
import { Database, ShieldAlert, Network } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FAQSection from '../components/FAQSection';
import { ANALYTICS_FAQ } from '../constants/faqContent';
import { cn } from '../lib/cn';

function portRiskBadgeVariant(risk) {
  if (risk === 'Critical') return 'destructive';
  if (risk === 'High') return 'warning';
  return 'success';
}

export default function AnalyticsView({ stats = {} }) {
  const topSources = stats.top_sources || [];
  const topPorts = stats.top_ports || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <Card className="p-6 sm:p-8">
        <h2 className="flex items-center gap-3 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          <Database className="h-6 w-6 text-success" />
          Big Data Analytics &amp; PySpark Aggregations
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          High-throughput security event aggregation modeling distributed PySpark DataFrame operations across 175,000+ UNSW-NB15 flow records.
        </p>
      </Card>

      {/* Top Attacker IPs & Targeted Ports */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Source IPs Table */}
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-base font-bold tracking-tight text-foreground">
                Top Attacking Source IPs (PySpark GroupBy)
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Aggregated event frequencies grouped by external origin
              </p>
            </div>
            <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[10px] text-primary">
              COUNT(events) DESC
            </span>
          </div>

          <div className="overflow-x-auto">
            {topSources.length === 0 ? (
              <div className="py-12 text-center font-sans text-muted-foreground">
                <Network className="mx-auto mb-2 h-8 w-8 text-primary opacity-30" />
                <p className="text-xs">No source IP aggregation data available.</p>
              </div>
            ) : (
              <table className="w-full text-left font-mono text-xs text-muted-foreground">
                <thead className="border-b border-border font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Source IP</th>
                    <th className="py-3 px-3">Target Scope</th>
                    <th className="py-3 px-3">Primary Threat</th>
                    <th className="py-3 px-3 text-right">Packets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topSources.map((src, i) => (
                    <tr key={i} className="transition-colors hover:bg-primary/[0.04]">
                      <td className="py-3 px-3 text-muted-foreground/70">#{i + 1}</td>
                      <td className="py-3 px-3 font-bold text-foreground">{src.ip}</td>
                      <td className="py-3 px-3 font-sans text-muted-foreground">{src.country || 'LAN'}</td>
                      <td className="py-3 px-3 font-sans">
                        <Badge variant="primary">{src.attackType || 'Exploits'}</Badge>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-success">
                        {src.count?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Top Targeted Ports Table */}
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-base font-bold tracking-tight text-foreground">
                Top Targeted Destination Ports
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Ingress port frequency distribution across security perimeter
              </p>
            </div>
            <span className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[10px] text-warning">
              INGRESS PROFILES
            </span>
          </div>

          <div className="overflow-x-auto">
            {topPorts.length === 0 ? (
              <div className="py-12 text-center font-sans text-muted-foreground">
                <ShieldAlert className="mx-auto mb-2 h-8 w-8 text-warning opacity-30" />
                <p className="text-xs">No targeted port aggregation data available.</p>
              </div>
            ) : (
              <table className="w-full text-left font-mono text-xs text-muted-foreground">
                <thead className="border-b border-border font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-3">Port</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Risk Rating</th>
                    <th className="py-3 px-3 text-right">Hits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topPorts.map((p, i) => (
                    <tr key={i} className="transition-colors hover:bg-primary/[0.04]">
                      <td className="py-3 px-3 font-bold text-primary">:{p.port}</td>
                      <td className="py-3 px-3 font-sans text-foreground">{p.service}</td>
                      <td className="py-3 px-3 font-sans">
                        <Badge variant={portRiskBadgeVariant(p.risk)}>{p.risk}</Badge>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-foreground">
                        {p.count?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      <FAQSection title="Threat Analytics FAQ" items={ANALYTICS_FAQ} />
    </div>
  );
}
