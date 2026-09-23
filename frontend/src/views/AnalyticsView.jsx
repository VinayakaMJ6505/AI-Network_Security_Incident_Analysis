import React from 'react';
import { Database } from 'lucide-react';

export default function AnalyticsView({ stats = {} }) {
  const topSources = stats.top_sources || [];
  const topPorts = stats.top_ports || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-[#0d1527]/80 to-slate-900/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
          <Database className="w-6 h-6 text-emerald-400" />
          Big Data Analytics & PySpark Aggregations
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          High-throughput security event aggregation modeling distributed PySpark DataFrame operations across 175,000+ UNSW-NB15 flow records.
        </p>
      </div>

      {/* Top Attacker IPs & Targeted Ports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Source IPs Table */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-display">
                Top Attacking Source IPs (PySpark GroupBy)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated event frequencies grouped by external origin
              </p>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-950 text-cyan-400 border border-slate-800">
              COUNT(events) DESC
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-950/70 uppercase text-[10px] text-slate-400 border-b border-slate-800/80 font-sans font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Source IP</th>
                  <th className="py-3 px-3">Target Scope</th>
                  <th className="py-3 px-3">Primary Threat</th>
                  <th className="py-3 px-3 text-right">Packets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(topSources.length > 0 ? topSources : [
                  { ip: '192.168.1.45', country: 'LAN Host', attackType: 'Exploits', count: 1842 },
                  { ip: '45.33.32.156', country: 'External Public', attackType: 'DoS', count: 1420 },
                  { ip: '185.220.101.5', country: 'External Tor', attackType: 'Reconnaissance', count: 980 },
                  { ip: '103.251.167.20', country: 'External Host', attackType: 'Shellcode', count: 654 }
                ]).map((src, i) => (
                  <tr key={i} className="hover:bg-cyan-500/[0.04] transition-colors">
                    <td className="py-3 px-3 text-slate-500">#{i + 1}</td>
                    <td className="py-3 px-3 font-bold text-white">{src.ip}</td>
                    <td className="py-3 px-3 text-slate-400 font-sans">{src.country}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {src.attackType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                      {src.count?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Targeted Ports Table */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-display">
                Top Targeted Destination Ports
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingress port frequency distribution across security perimeter
              </p>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-slate-950 text-amber-400 border border-slate-800">
              INGRESS PROFILES
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-950/70 uppercase text-[10px] text-slate-400 border-b border-slate-800/80 font-sans font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-3">Port</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Risk Rating</th>
                  <th className="py-3 px-3 text-right">Hits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(topPorts.length > 0 ? topPorts : [
                  { port: 80, service: 'HTTP Web Server', risk: 'High', count: 32410 },
                  { port: 22, service: 'SSH Secure Shell', risk: 'Critical', count: 18450 },
                  { port: 443, service: 'HTTPS Encrypted', risk: 'Medium', count: 15200 },
                  { port: 445, service: 'SMB Windows File', risk: 'Critical', count: 8940 },
                  { port: 53, service: 'DNS Name Service', risk: 'Medium', count: 5210 }
                ]).map((p, i) => (
                  <tr key={i} className="hover:bg-cyan-500/[0.04] transition-colors">
                    <td className="py-3 px-3 font-bold text-cyan-300">:{p.port}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{p.service}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        p.risk === 'Critical'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : p.risk === 'High'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {p.risk}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-white font-bold">
                      {p.count?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
