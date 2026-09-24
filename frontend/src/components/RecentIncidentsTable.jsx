import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import { Search, Eye, ArrowUpDown, ShieldAlert } from 'lucide-react';
import { Card } from './ui/Card';
import { cn } from '../lib/cn';

function riskBarClass(score) {
  if (score > 80) return 'bg-severity-critical';
  if (score > 60) return 'bg-severity-high';
  if (score > 30) return 'bg-severity-medium';
  return 'bg-severity-low';
}

export default function RecentIncidentsTable({
  incidents = [],
  onSelectIncident,
  showFilters = true,
  title = "Recent Incidents",
  bare = false,
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

  const Wrapper = bare ? 'div' : Card;

  return (
    <Wrapper className={bare ? 'flex h-full flex-col overflow-hidden' : 'overflow-hidden'}>
      {/* Header & Controls */}
      {!bare && (
      <div className="border-b border-border bg-muted/40 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-base font-bold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Showing {filteredIncidents.length} of {incidents.length} recorded security events
            </p>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative min-w-[220px] flex-grow sm:flex-grow-0">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by IP, attack, or port..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3.5 font-mono text-xs text-foreground placeholder-muted-foreground transition-all focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Severity filter */}
              <select
                aria-label="Filter by Severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground transition-colors focus:border-primary/60 focus:outline-none"
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
                className="rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground transition-colors focus:border-primary/60 focus:outline-none"
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
      )}

      {/* Table Content */}
      <div className={bare ? 'flex-1 overflow-auto' : 'overflow-x-auto'}>
        <table className="w-full text-left text-xs text-muted-foreground">
          <thead className="border-b border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="py-3.5 px-5">
                <button
                  onClick={() => toggleSort('source_ip')}
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  Source IP <ArrowUpDown className="h-3 w-3 text-muted-foreground/70" />
                </button>
              </th>
              <th className="py-3.5 px-5 hidden sm:table-cell">Destination / Port</th>
              <th className="py-3.5 px-5">
                <button
                  onClick={() => toggleSort('attack_type')}
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  Attack Type <ArrowUpDown className="h-3 w-3 text-muted-foreground/70" />
                </button>
              </th>
              <th className="py-3.5 px-5">
                <button
                  onClick={() => toggleSort('risk_score')}
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  Risk Score <ArrowUpDown className="h-3 w-3 text-muted-foreground/70" />
                </button>
              </th>
              <th className="py-3.5 px-5">
                <button
                  onClick={() => toggleSort('severity')}
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  Severity <ArrowUpDown className="h-3 w-3 text-muted-foreground/70" />
                </button>
              </th>
              <th className="py-3.5 px-5 hidden md:table-cell">
                <button
                  onClick={() => toggleSort('timestamp')}
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  Timestamp <ArrowUpDown className="h-3 w-3 text-muted-foreground/70" />
                </button>
              </th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="mb-2 h-8 w-8 text-primary opacity-30" />
                    <span>No security incidents matching current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident && onSelectIncident(inc)}
                  className="group cursor-pointer transition-colors hover:bg-primary/[0.04]"
                >
                  <td className="py-3.5 px-5">
                    <div className="font-mono font-semibold text-foreground transition-colors group-hover:text-primary">
                      {inc.source_ip}
                    </div>
                    {inc.username && (
                      <div className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                        User: {inc.username}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-5 hidden sm:table-cell font-mono text-muted-foreground">
                    <div>{inc.destination_ip}</div>
                    <div className="mt-0.5 text-[11px] text-primary/80">
                      Port: {inc.port} ({inc.protocol || 'TCP'})
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-semibold text-foreground">
                      {inc.attack_type}
                    </span>
                    {inc.confidence && (
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {(inc.confidence * 100).toFixed(0)}% Conf
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {inc.risk_score}
                      </span>
                      <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-muted sm:block">
                        <div
                          className={cn('h-1.5 rounded-full', riskBarClass(inc.risk_score))}
                          style={{ width: `${Math.min(100, inc.risk_score)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge severity={inc.severity} />
                  </td>
                  <td className="py-3.5 px-5 hidden md:table-cell font-mono text-xs text-muted-foreground">
                    {inc.timestamp?.replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident && onSelectIncident(inc);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-all group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}
