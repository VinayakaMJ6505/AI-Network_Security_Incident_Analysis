import React, { useState, useEffect, useCallback } from 'react';
import ThemeProvider from './theme/ThemeProvider';
import AppShell from './components/layout/AppShell';
import DashboardView from './views/DashboardView';
import TelemetryView from './views/TelemetryView';
import IncidentExplorerView from './views/IncidentExplorerView';
import LiveAnalyzerView from './views/LiveAnalyzerView';
import LogParserView from './views/LogParserView';
import AnalyticsView from './views/AnalyticsView';
import ArchitectureView from './views/ArchitectureView';
import IncidentDetailsModal from './components/IncidentDetailsModal';
import {
  fetchDashboardStats,
  fetchIncidents,
  checkBackendHealth,
} from './services/api';

const EMPTY_DASHBOARD_STATS = {
  total_events: 0,
  detected_attacks: 0,
  high_risk_incidents: 0,
  critical_incidents: 0,
  attack_percentage: 0,
  model_accuracy: 76.97,
  avg_detection_time_ms: 12.4,
  overview: {
    total_events: 0,
    detected_attacks: 0,
    high_risk_incidents: 0,
    critical_incidents: 0,
  },
  attack_distribution: [],
  attack_trends: [],
  recent_incidents: [],
  top_ports: [],
  top_sources: [],
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(EMPTY_DASHBOARD_STATS);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const isOnline = await checkBackendHealth();
      setBackendOnline(isOnline);

      const [loadedStats, loadedIncidents] = await Promise.all([
        fetchDashboardStats(),
        fetchIncidents(),
      ]);

      if (loadedStats) setStats(loadedStats);
      if (loadedIncidents) setIncidents(loadedIncidents);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Poll backend health every 30s
    const timer = setInterval(() => {
      checkBackendHealth().then(setBackendOnline);
    }, 30000);
    return () => clearInterval(timer);
  }, [loadData]);

  return (
    <ThemeProvider>
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      backendOnline={backendOnline}
      onRefresh={loadData}
      isRefreshing={isRefreshing}
    >
      {activeTab === 'dashboard' && (
        <DashboardView
          stats={stats}
          incidents={incidents}
          onSelectIncident={setSelectedIncident}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'telemetry' && (
        <TelemetryView
          stats={stats}
          incidents={incidents}
          onSelectIncident={setSelectedIncident}
        />
      )}

      {activeTab === 'incidents' && (
        <IncidentExplorerView
          incidents={incidents}
          onSelectIncident={setSelectedIncident}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'analyzer' && (
        <LiveAnalyzerView onSelectIncident={setSelectedIncident} />
      )}

      {activeTab === 'logparser' && (
        <LogParserView
          onSelectIncident={setSelectedIncident}
          refreshIncidents={loadData}
        />
      )}

      {activeTab === 'analytics' && <AnalyticsView stats={stats} />}

      {activeTab === 'architecture' && <ArchitectureView />}

      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      <footer className="mt-8 border-t border-border pt-5 text-center">
        <p className="text-xs font-semibold text-foreground">
          Developed by Students of MCA Department <span aria-hidden="true">😎</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Nitte Meenakshi Institute of Technology, Bengaluru
        </p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          AI Network Security Incident Analysis &middot; Batch 2025&ndash;2027
        </p>
      </footer>
    </AppShell>
    </ThemeProvider>
  );
}
