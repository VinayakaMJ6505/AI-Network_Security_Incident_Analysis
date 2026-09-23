import React from 'react';
import RecentIncidentsTable from '../components/RecentIncidentsTable';
import { Download, PlusCircle } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-[#0d1527]/80 to-slate-900/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
              AUDIT LOG
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {incidents.length} Events Logged
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Security Incidents Explorer
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Search, filter, inspect full attack dossiers, and review automated AI investigation recommendations across all detected network events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportAllToJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export JSON
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all active:scale-[0.98]"
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
