import React from 'react';
import RecentIncidentsTable from '../components/RecentIncidentsTable';
import { ShieldCheck, Download, PlusCircle } from 'lucide-react';

export default function IncidentExplorerView({
  incidents,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#111726]/80 border border-slate-800 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security Incidents Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, filter, and inspect detailed GenAI telemetry for all detected security events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAllToJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Simulate Incident
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
