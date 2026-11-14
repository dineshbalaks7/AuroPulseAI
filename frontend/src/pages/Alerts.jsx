import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Download,
  Search,
  RefreshCw,
  ArrowUpRight,
  FileSpreadsheet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDataset } from '../context/DatasetContext';
import engineService from '../services/engineService';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { exportToCSV } from '../utils/exportUtils';

export const Alerts = () => {
  const { selectedDataset, thresholds } = useDataset();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get all engines to allow filtering by any status
      const res = await engineService.getEngines(
        selectedDataset,
        null,
        thresholds.critical,
        thresholds.warning
      );
      setAlerts(res.engines || []);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [selectedDataset, thresholds]);

  // Apply filters
  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      searchQuery === '' ||
      a.engine_id.toString().includes(searchQuery) ||
      `Engine #${a.engine_id}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ATTENTION'
        ? a.health_status === 'Critical' || a.health_status === 'Warning'
        : a.health_status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const criticalCount = alerts.filter((a) => a.health_status === 'Critical').length;
  const warningCount = alerts.filter((a) => a.health_status === 'Warning').length;
  const healthyCount = alerts.filter((a) => a.health_status === 'Healthy').length;

  const handleExportCSV = () => {
    const exportData = filteredAlerts.map((a) => ({
      Engine_ID: a.engine_id,
      Dataset: a.dataset,
      Current_Cycle: a.current_cycle,
      Predicted_RUL: a.predicted_rul,
      Health_Status: a.health_status,
      Priority: a.priority,
      Recommended_Action: a.recommended_action,
    }));
    exportToCSV(exportData, `${selectedDataset}_Maintenance_Alerts.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h1 className="text-xl font-bold text-main tracking-tight flex items-center gap-2">
            Fleet Alerts & Maintenance Schedule
            <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-primary-light text-primary">
              {selectedDataset}
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Engine prioritization based on application-defined RUL thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredAlerts.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-xs font-semibold text-secondary hover:text-main hover:bg-slate-50 transition-colors shadow-xs disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-xs font-semibold text-secondary hover:text-main hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-red-800 uppercase tracking-wider block">Critical Engines</span>
            <span className="text-2xl font-bold font-mono text-red-900 mt-1 block">{criticalCount}</span>
            <span className="text-[11px] text-red-700">RUL ≤ {thresholds.critical} cycles</span>
          </div>
          <ShieldAlert className="w-8 h-8 text-red-500 opacity-80" />
        </div>

        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">Warning Engines</span>
            <span className="text-2xl font-bold font-mono text-amber-900 mt-1 block">{warningCount}</span>
            <span className="text-[11px] text-amber-700">RUL {thresholds.critical}–{thresholds.warning} cycles</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Nominal / Healthy</span>
            <span className="text-2xl font-bold font-mono text-emerald-900 mt-1 block">{healthyCount}</span>
            <span className="text-[11px] text-emerald-700">RUL &gt; {thresholds.warning} cycles</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Engine ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-lg text-main focus:ring-1 focus:ring-primary focus:bg-white"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-secondary font-semibold mr-1">Status:</span>
          {[
            { label: 'Attention Needed', value: 'ATTENTION' },
            { label: 'Critical', value: 'CRITICAL' },
            { label: 'Warning', value: 'WARNING' },
            { label: 'Healthy', value: 'HEALTHY' },
            { label: 'All Fleet', value: 'ALL' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-secondary hover:text-main bg-slate-100 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={fetchAlerts} />}

      {loading && !alerts.length && (
        <LoadingSkeleton variant="table" count={8} />
      )}

      {/* Alerts Table */}
      {!loading && (
        <Card
          title={`Fleet Maintenance Roster (${filteredAlerts.length} entries)`}
          subtitle="Prioritized queue of engine maintenance interventions"
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/70 text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Engine</th>
                  <th className="py-3 px-4">Cycle</th>
                  <th className="py-3 px-4">Predicted RUL</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Recommended Maintenance Action</th>
                  <th className="py-3 px-4 text-right">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-secondary">
                      No engines match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((a) => (
                    <tr key={a.engine_id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-main">
                        Engine #{a.engine_id}
                      </td>
                      <td className="py-3 px-4 font-mono text-secondary">
                        {a.current_cycle}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-main">
                        {a.predicted_rul} cycles
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={a.health_status} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-semibold text-secondary">
                        {a.priority}
                      </td>
                      <td className="py-3 px-4 text-secondary">
                        {a.recommended_action}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/engines?id=${a.engine_id}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover hover:underline"
                        >
                          Inspect
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Explicit Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-xl border border-surface-border text-xs text-secondary leading-relaxed">
        <strong>Prognostic Maintenance Advisory:</strong> An RUL prediction represents an estimated degradation milestone under simulated operating conditions. Scheduled inspections should be confirmed with physical borescope examination and oil debris analysis before component removal.
      </div>
    </div>
  );
};

export default Alerts;
