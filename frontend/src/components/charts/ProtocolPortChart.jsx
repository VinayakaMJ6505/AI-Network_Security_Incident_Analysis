import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const RISK_COLOR = {
  Critical: 'var(--severity-critical)',
  High: 'var(--severity-high)',
  Medium: 'var(--severity-medium)',
};

export default function ProtocolPortChart({ ports = [] }) {
  if (ports.length === 0) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
        No targeted port aggregation data available.
      </div>
    );
  }

  const data = ports.map((p) => ({ ...p, label: `:${p.port}` }));

  return (
    <div className="flex h-full flex-col">
      <span className="mb-3 text-xs text-muted-foreground">Top destination ports by hit volume</span>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="label" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={48} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                color: 'var(--popover-foreground)',
              }}
              formatter={(val, name, item) => [`${val} hits`, item.payload.service]}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={RISK_COLOR[entry.risk] || 'var(--primary)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
