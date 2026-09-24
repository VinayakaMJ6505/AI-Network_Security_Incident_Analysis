import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PROTOCOL_COLORS = {
  TCP: 'var(--primary)',
  UDP: 'var(--success)',
  ICMP: 'var(--warning)',
  ARP: 'var(--severity-critical)',
  OSPF: '#9333ea',
};
const FALLBACK_COLOR = 'var(--muted-foreground)';

export default function ProtocolBreakdownChart({ incidents = [] }) {
  const data = useMemo(() => {
    const counts = {};
    incidents.forEach((inc) => {
      const proto = (inc.protocol || 'TCP').toUpperCase();
      counts[proto] = (counts[proto] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([protocol, count]) => ({ protocol, count }))
      .sort((a, b) => b.count - a.count);
  }, [incidents]);

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
        No protocol telemetry available.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <span className="mb-3 text-xs text-muted-foreground">Traffic split by network protocol</span>
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={3} dataKey="count" nameKey="protocol">
              {data.map((entry) => (
                <Cell key={entry.protocol} fill={PROTOCOL_COLORS[entry.protocol] || FALLBACK_COLOR} />
              ))}
            </Pie>
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
            <Legend
              formatter={(value) => <span className="text-[11px] font-mono text-muted-foreground">{value}</span>}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
