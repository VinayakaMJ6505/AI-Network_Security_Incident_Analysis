import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from './ui/Card';
import Badge from './ui/Badge';
import { cn } from '../lib/cn';

export default function AttackTrendsChart({ data = [], bare = false }) {
  const Wrapper = bare ? 'div' : Card;

  return (
    <Wrapper className={bare ? 'flex h-full flex-col' : 'p-5 sm:p-6'}>
      <div className={cn('flex flex-col justify-between gap-3 sm:flex-row sm:items-center', bare ? 'mb-3' : 'mb-5 border-b border-border pb-3')}>
        {bare ? (
          <span className="text-xs text-muted-foreground">
            Temporal fluctuation of normal vs malicious traffic flows
          </span>
        ) : (
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
              Security Events & Attack Trends
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Temporal fluctuation of normal vs malicious traffic flows
            </p>
          </div>
        )}

        <Badge variant="default" className="self-start sm:self-auto">Last 8 Hours</Badge>
      </div>

      <div className={bare ? 'w-full flex-1' : 'h-64 w-full sm:h-72'}>
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            No temporal telemetry available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorHighRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--severity-critical)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--severity-critical)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontFamily: 'JetBrains Mono',
                  color: 'var(--popover-foreground)',
                }}
              />
              <Area
                type="monotone"
                dataKey="normal"
                name="Normal Traffic"
                stroke="var(--success)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNormal)"
              />
              <Area
                type="monotone"
                dataKey="attack"
                name="Detected Attacks"
                stroke="var(--primary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAttack)"
              />
              <Area
                type="monotone"
                dataKey="highRisk"
                name="High Risk Events"
                stroke="var(--severity-critical)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorHighRisk)"
              />
              <Legend
                formatter={(value) => <span className="text-[11px] font-mono text-muted-foreground">{value}</span>}
                verticalAlign="bottom"
                height={30}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Wrapper>
  );
}
