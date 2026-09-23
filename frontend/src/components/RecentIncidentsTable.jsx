import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import { Search, Eye, Filter, ArrowUpDown, ChevronRight, ShieldAlert } from 'lucide-react';

export default function RecentIncidentsTable({
  incidents = [],
  onSelectIncident,
  showFilters = true,
  title = "Recent Incidents",
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedAttack, setSelectedAttack] = useState('ALL');
  const [sortField, setSortField] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and sort incidents
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        const matchesSearch =
          !searchTerm ||
          inc.source_ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.destination_ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inc.attack_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(inc.port).includes(searchTerm);

        const matchesSeverity =
          selectedSeverity === 'ALL' || inc.severity === selectedSeverity;

        const matchesAttack =
          selectedAttack === 'ALL' || inc.attack_type === selectedAttack;

        return matchesSearch && matchesSeverity && matchesAttack;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'risk_score') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        valA = String(valA || '');
        valB = String(valB || '');
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
  }, [incidents, searchTerm, selectedSeverity, selectedAttack, sortField, sortOrder]);

  const attackCategories = useMemo(() => {
    const set = new Set(incidents.map((i) => i.attack_type).filter(Boolean));
    return Array.from(set);
  }, [incidents]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-lg">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide font-display">
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Showing {filteredIncidents.length} of {incidents.length} total detected security incidents
            </p>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative min-w-[200px] flex-grow sm:flex-grow-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by IP, attack, or port..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                />
              </div>

              {/* Severity filter */}
              <select
                aria-label="Filter by Severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              >
                <option value="ALL">All Severities</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>

              {/* Attack Type filter */}
              <select
                aria-label="Filter by Attack Category"
                value={selectedAttack}
                onChange={(e) => setSelectedAttack(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
              >
                <option value="ALL">All Categories</option>
                {attackCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/70 uppercase font-semibold text-[11px] text-slate-400 border-b border-slate-800/80 font-mono">
            <tr>
              <th className="py-3.5 px-4">
                <button
                  onClick={() => toggleSort('source_ip')}
                  className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  Source IP <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Destination / Port</th>
              <th className="py-3.5 px-4">
                <button
                  onClick={() => toggleSort('attack_type')}
                  className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  Attack Type <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4">
                <button
                  onClick={() => toggleSort('risk_score')}
                  className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  Risk Score <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4">
                <button
                  onClick={() => toggleSort('severity')}
                  className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  Severity <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4 hidden md:table-cell">
                <button
                  onClick={() => toggleSort('timestamp')}
                  className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  Timestamp <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </button>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500 font-sans">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="w-8 h-8 opacity-30 text-cyan-400 mb-2" />
                    <span>No security incidents matching current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident && onSelectIncident(inc)}
                  className="hover:bg-cyan-500/[0.04] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {inc.source_ip}
                    </div>
                    {inc.username && (
                      <div className="text-[10px] text-slate-500 font-sans">
                        User: {inc.username}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-slate-400">
                    <div>{inc.destination_ip}</div>
                    <div className="text-[10px] text-cyan-400/80">
                      Port: {inc.port} ({inc.protocol || 'TCP'})
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-200">
                      {inc.attack_type}
                    </span>
                    {inc.confidence && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        {(inc.confidence * 100).toFixed(0)}% Conf
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {inc.risk_score}
                      </span>
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden hidden sm:block">
                        <div
                          className={`h-1.5 rounded-full ${
                            inc.risk_score > 80
                              ? 'bg-rose-500'
                              : inc.risk_score > 60
                              ? 'bg-orange-500'
                              : inc.risk_score > 30
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, inc.risk_score)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge severity={inc.severity} />
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-slate-400 text-[11px]">
                    {inc.timestamp?.replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident && onSelectIncident(inc);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-300 text-xs font-semibold border border-slate-700/60 group-hover:border-cyan-500/30 transition-all font-sans"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
