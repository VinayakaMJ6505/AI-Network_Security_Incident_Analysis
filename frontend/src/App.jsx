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
  model_accuracy: 97.42,
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

      <footer className="mt-8 border-t border-border pt-4 text-center text-[11px] font-mono text-muted-foreground sm:flex sm:items-center sm:justify-between sm:text-left">
        <p>Suite Strike • MCA Project • Nitte Meenakshi Institute of Technology</p>
        <div className="mt-2 flex items-center justify-center gap-3 sm:mt-0">
          <span className="flex items-center gap-1.5 text-primary/80">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            FastAPI + React SOC Core
          </span>
          <span className="text-border">|</span>
          <span>UNSW-NB15 ML Guard</span>
        </div>
      </footer>
    </AppShell>
    </ThemeProvider>
  );
}
