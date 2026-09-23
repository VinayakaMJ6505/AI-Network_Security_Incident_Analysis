import React from 'react';
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
  Legend,
} from 'recharts';
import { Database, ShieldAlert, Cpu, Network, Server } from 'lucide-react';

const PROTO_DATA = [
  { name: 'TCP', count: 124300, percentage: 70.9, color: '#3b82f6' },
  { name: 'UDP', count: 42100, percentage: 24.0, color: '#06b6d4' },
  { name: 'ICMP', count: 8941, percentage: 5.1, color: '#8b5cf6' },
];

export default function AnalyticsView({ stats }) {
  const topSources = stats.top_sources || [];
  const topPorts = stats.top_ports || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          Big Data Analytics & PySpark Aggregations
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          High-throughput security event aggregation modeling distributed PySpark DataFrame operations across 175,000+ UNSW-NB15 flow records.
        </p>
      </div>

      {/* Top Attacker IPs & Targeted Ports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Source IPs Table */}
        <div className="rounded-xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Top Attacking Source IPs (PySpark GroupBy)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated event frequencies grouped by external origin
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              COUNT(events) DESC
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-900/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Source IP</th>
                  <th className="py-2.5 px-3 font-sans">Primary Threat</th>
                  <th className="py-2.5 px-3 font-sans">Origin</th>
                  <th className="py-2.5 px-3 text-right">Event Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topSources.map((src, index) => (
                  <tr key={src.ip} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 text-slate-500 font-bold">#{index + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{src.ip}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[11px]">
                        {src.attackType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-400">{src.country}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-400">
                      {src.count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Targeted Ports */}
        <div className="rounded-xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Most Targeted Services & Ports
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of attacks across standard network service endpoints
              </p>
            </div>
            <Server className="w-4 h-4 text-slate-500" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            {topPorts.map((item) => {
              const maxCount = 3500;
              const percent = Math.min(100, Math.round((item.count / maxCount) * 100));

              return (
                <div key={item.port} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">Port {item.port}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                        {item.service}
                      </span>
                    </div>
                    <span className="text-slate-300 text-xs font-mono font-bold">
                      {item.count.toLocaleString()} probes
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${
                        item.risk === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Protocol Distribution & Aggregation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-white tracking-wide mb-2">
            Protocol Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            L4 transport protocol distribution across dataset
          </p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROTO_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {PROTO_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                  formatter={(val, name, props) => [
                    `${val.toLocaleString()} (${props.payload.percentage}%)`,
                    props.payload.name
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                  formatter={(val) => <span className="text-slate-300">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Big Data Aggregation metrics */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#111726]/80 p-5 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide mb-1">
              PySpark Event Processing Metrics
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time cluster telemetry and distributed shuffle benchmarks
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-sans block">Partitions</span>
                <span className="text-base font-bold text-white mt-1 block">16</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-sans block">Avg Processing</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">12.4 ms</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-sans block">Memory Cached</span>
                <span className="text-base font-bold text-blue-400 mt-1 block">1.82 GB</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-sans block">DataFrame Rows</span>
                <span className="text-base font-bold text-purple-400 mt-1 block">175,341</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="text-blue-400">spark.read.parquet</span>('/data/unsw_nb15.parquet')
            <br />
            &nbsp;&nbsp;.filter(col('attack_cat') != 'Normal')
            <br />
            &nbsp;&nbsp;.groupBy('srcip', 'proto', 'attack_cat')
            <br />
            &nbsp;&nbsp;.agg(count('*').alias('incident_frequency'), max('risk_score').alias('peak_severity'))
          </div>
        </div>
      </div>
    </div>
  );
}
