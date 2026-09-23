import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import { Search, Eye, Filter, ArrowUpDown } from 'lucide-react';

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
    <div className="rounded-xl border border-slate-800 bg-[#111726]/80 backdrop-blur-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredIncidents.length} of {incidents.length} total detected security incidents
            </p>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by IP, attack, or port..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Severity filter */}
              <select
                aria-label="Filter by Severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 focus:outline-none focus:border-blue-500"
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
                className="px-2.5 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 focus:outline-none focus:border-blue-500"
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
          <thead className="bg-slate-900/60 uppercase font-semibold text-[11px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('source_ip')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Source IP <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">Destination / Port</th>
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('attack_type')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Attack Type <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('risk_score')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Risk Score <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('severity')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Severity <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4">
                <button
                  onClick={() => toggleSort('timestamp')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Timestamp <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                  No security incidents matching current filters.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((incident) => {
                const riskPercent = Math.min(100, Math.max(0, incident.risk_score || 0));
                let barColor = 'bg-emerald-500';
                if (riskPercent > 80) barColor = 'bg-rose-500';
                else if (riskPercent > 60) barColor = 'bg-orange-500';
                else if (riskPercent > 30) barColor = 'bg-amber-500';

                return (
                  <tr
                    key={incident.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectIncident(incident)}
                  >
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {incident.source_ip}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {incident.destination_ip}:{incident.port || 80}
                      <span className="ml-1.5 text-[10px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                        {incident.protocol || 'TCP'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400/80"></span>
                        {incident.attack_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${barColor}`}
                            style={{ width: `${riskPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-200">
                          {incident.risk_score}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <StatusBadge severity={incident.severity} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {incident.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(incident);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 font-sans text-xs font-medium transition-all"
                        aria-label="Inspect incident"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
