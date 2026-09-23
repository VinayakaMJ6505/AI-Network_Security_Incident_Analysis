import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './views/DashboardView';
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
import { INITIAL_DASHBOARD_STATS, INITIAL_INCIDENTS } from './services/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
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
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            incidents={incidents}
            onSelectIncident={setSelectedIncident}
            setActiveTab={setActiveTab}
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
      </main>

      {/* Incident Details Modal Inspector */}
      {selectedIncident && (
        <IncidentDetailsModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#0a0d14] py-4 text-center text-xs text-slate-500 font-mono">
        <p>
          AI-Powered Network Security Incident Analysis • MCA Project • Nitte Meenakshi Institute of Technology
        </p>
      </footer>
    </div>
  );
}
