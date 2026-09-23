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

const CUSTOM_COLORS = [
  '#06b6d4', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444',
  '#10b981', '#ec4899', '#f97316', '#e11d48', '#9333ea'
];

export default function AttackDistributionChart({ data = [] }) {
  const [chartType, setChartType] = useState('bar');

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-wide font-display">
            Attack Distribution (UNSW-NB15 Categories)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Breakdown of classified network events by attack type
          </p>
        </div>

        <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              chartType === 'bar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
            title="Bar Chart"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              chartType === 'donut'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
            title="Donut Chart"
          >
            <PieIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
            No telemetry data available for distribution.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="category"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    boxShadow: '0 0 15px rgba(6,182,212,0.15)',
                  }}
                  formatter={(val, name, item) => [`${val} (${item.payload.percentage || 0}%)`, 'Events']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || CUSTOM_COLORS[index % CUSTOM_COLORS.length]}
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
                      fill={entry.color || CUSTOM_COLORS[index % CUSTOM_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(val, name, item) => [`${val} (${item.payload.percentage || 0}%)`, item.payload.category]}
                />
                <Legend
                  formatter={(value) => <span className="text-slate-300 text-[10px] font-mono">{value}</span>}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
