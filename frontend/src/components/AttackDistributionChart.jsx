import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { Card } from './ui/Card';
import { ATTACK_CATEGORY_COLORS, ATTACK_CATEGORY_FALLBACK } from '../constants/attackColors';
import { cn } from '../lib/cn';

const tooltipStyle = {
  backgroundColor: 'var(--popover)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  fontSize: '11px',
  fontFamily: 'JetBrains Mono',
  color: 'var(--popover-foreground)',
};

export default function AttackDistributionChart({ data = [], bare = false }) {
  const [chartType, setChartType] = useState('bar');

  const Wrapper = bare ? 'div' : Card;

  return (
    <Wrapper className={bare ? 'flex h-full flex-col' : 'p-5 sm:p-6'}>
      <div className={cn('flex flex-col justify-between gap-3 sm:flex-row sm:items-center', bare ? 'mb-3' : 'mb-5 border-b border-border pb-3')}>
        {bare ? (
          <span className="text-xs text-muted-foreground">
            Breakdown of classified network events by attack type
          </span>
        ) : (
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base">
              Attack Distribution (UNSW-NB15 Categories)
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Breakdown of classified network events by attack type
            </p>
          </div>
        )}

        <div className="flex items-center self-start rounded-xl border border-border bg-muted p-1 sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={cn(
              'rounded-lg border p-1.5 text-xs transition-all',
              chartType === 'bar'
                ? 'border-primary/40 bg-primary/20 text-primary shadow-sm'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            title="Bar Chart"
          >
            <BarChart2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={cn(
              'rounded-lg border p-1.5 text-xs transition-all',
              chartType === 'donut'
                ? 'border-primary/40 bg-primary/20 text-primary shadow-sm'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
            title="Donut Chart"
          >
            <PieIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={bare ? 'w-full flex-1' : 'h-64 w-full sm:h-72'}>
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            No telemetry data available for distribution.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val, name, item) => [`${val} (${item.payload.percentage || 0}%)`, 'Events']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || ATTACK_CATEGORY_COLORS[entry.category] || ATTACK_CATEGORY_FALLBACK}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="category"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || ATTACK_CATEGORY_COLORS[entry.category] || ATTACK_CATEGORY_FALLBACK}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val, name, item) => [`${val} (${item.payload.percentage || 0}%)`, item.payload.category]}
                />
                <Legend
                  formatter={(value) => <span className="text-[11px] font-mono text-muted-foreground">{value}</span>}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </Wrapper>
  );
}
