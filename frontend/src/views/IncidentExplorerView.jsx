import React from 'react';
import RecentIncidentsTable from '../components/RecentIncidentsTable';
import { ShieldCheck, Download, PlusCircle, Filter } from 'lucide-react';

export default function IncidentExplorerView({
  incidents = [],
  onSelectIncident,
  setActiveTab,
}) {
  const exportAllToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `security_incidents_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const criticalCount = incidents.filter(i => (i.severity || '').toUpperCase() === 'CRITICAL').length;
  const highCount = incidents.filter(i => (i.severity || '').toUpperCase() === 'HIGH').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900/90 via-[#0d1424]/90 to-slate-900/90 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.06)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              AUDIT LOG
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {incidents.length} Events Logged
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
            Security Incidents Explorer
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Search, filter, inspect full attack dossiers, and review automated AI investigation recommendations across all detected network events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportAllToJSON}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export JSON
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Analyze Event
          </button>
        </div>
      </div>

      {/* Incidents Table with full filters */}
      <RecentIncidentsTable
        incidents={incidents}
        onSelectIncident={onSelectIncident}
        showFilters={true}
        title="Detected Security Incidents Catalog"
      />
    </div>
  );
}
