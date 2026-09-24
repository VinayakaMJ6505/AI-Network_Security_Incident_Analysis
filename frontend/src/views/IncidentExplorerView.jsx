import React from 'react';
import RecentIncidentsTable from '../components/RecentIncidentsTable';
import { Download, PlusCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

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
      <Card className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="primary">AUDIT LOG</Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {incidents.length} Events Logged
            </span>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Security Incidents Explorer
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Search, filter, inspect full attack dossiers, and review automated AI investigation recommendations across all detected network events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={exportAllToJSON}>
            <Download className="h-3.5 w-3.5 text-primary" />
            Export JSON
          </Button>
          <Button variant="primary" onClick={() => setActiveTab('analyzer')}>
            <PlusCircle className="h-3.5 w-3.5" />
            Analyze Event
          </Button>
        </div>
      </Card>

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
