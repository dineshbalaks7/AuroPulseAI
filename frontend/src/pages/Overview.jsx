import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Wrench,
  RefreshCw,
  ServerOff,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import engineService from '../services/engineService';
import KpiCard from '../components/dashboard/KpiCard';
import HealthDonutChart from '../components/dashboard/HealthDonutChart';
import RulHistogramChart from '../components/dashboard/RulHistogramChart';
import SensorDegradationChart from '../components/dashboard/SensorDegradationChart';
import RecentPredictionsTable from '../components/dashboard/RecentPredictionsTable';
import RecentAlertsList from '../components/dashboard/RecentAlertsList';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ApiConfigModal from '../components/common/ApiConfigModal';

export const Overview = () => {
  const { selectedDataset, thresholds, apiHealth, verifyHealth } = useDataset();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await engineService.getOverview(
        selectedDataset,
        thresholds?.critical || 30,
        thresholds?.warning || 75
      );
      if (overview && typeof overview === 'object' && overview.kpis) {
        setData(overview);
      } else {
        setData(null);
        setError('Received an unexpected response from the prediction API.');
      }
    } catch (err) {
      setData(null);
      setError(err.message || 'Failed to connect to the fleet overview API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDataset, thresholds]);

  // Safely compute fleet percentage metrics with optional chaining
  const total = data?.kpis?.total_engines || 1;
  const healthyCount = data?.kpis?.healthy_engines || 0;
  const warningCount = data?.kpis?.warning_engines || 0;
  const criticalCount = data?.kpis?.critical_engines || 0;

  const healthyPct = data?.kpis ? Math.round((healthyCount / total) * 100) : 0;
  const warningPct = data?.kpis ? Math.round((warningCount / total) * 100) : 0;
  const criticalPct = data?.kpis ? Math.round((criticalCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-primary-light text-primary border border-primary-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Live Telemetry Stream
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              • XGBoost Inference ~30ms
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-main tracking-tight flex items-center gap-2.5">
            Fleet Prognostics & Health Overview
            <span className="text-xs px-2.5 py-0.5 rounded-lg font-mono font-bold bg-slate-900 text-white shadow-xs">
              {selectedDataset}
            </span>
          </h1>
          <p className="text-xs text-secondary mt-0.5 max-w-2xl">
            Real-time Remaining Useful Life (RUL) predictions, multi-sensor degradation monitoring, and priority scheduling for the NASA C-MAPSS fleet.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              fetchData();
              verifyHealth?.();
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white text-xs font-semibold text-secondary hover:text-main hover:bg-slate-50 transition-all shadow-xs hover:shadow-card-hover active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : 'text-slate-400'}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Backend Disconnection Banner if API is unreachable */}
      {(!apiHealth?.connected && apiHealth?.status !== 'checking') && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-start gap-2.5">
            <ServerOff className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Backend Connection Required:</span>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Connect this frontend to your live Railway FastAPI service to stream real-time predictions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shrink-0 transition-colors shadow-xs"
          >
            Connect Railway API
          </button>
        </div>
      )}

      {/* Error state */}
      {error && (
        <ErrorState
          message={error}
          onRetry={fetchData}
          onConfigureApi={() => setShowConfigModal(true)}
        />
      )}

      {/* API Configuration Modal */}
      <ApiConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onConnected={() => {
          fetchData();
          verifyHealth?.();
        }}
      />

      {/* Loading state */}
      {loading && !data && (
        <div className="space-y-6">
          <LoadingSkeleton variant="kpi" count={6} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoadingSkeleton variant="chart" />
            <LoadingSkeleton variant="chart" />
          </div>
          <LoadingSkeleton variant="chart" />
          <LoadingSkeleton variant="table" count={5} />
        </div>
      )}

      {/* Main Content with strict data safety checks */}
      {!loading && data?.kpis && (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KpiCard
              title="Total Fleet"
              value={data.kpis.total_engines ?? '—'}
              subtitle="Monitored Units"
              icon={Activity}
              color="text-primary"
              bgColor="bg-primary-light"
              borderColor="border-primary-100"
              trend="100% Active"
              trendType="neutral"
              sparklineVariant="default"
            />
            <KpiCard
              title="Healthy Engines"
              value={data.kpis.healthy_engines ?? '—'}
              subtitle={`RUL > ${thresholds?.warning || 75} cycles`}
              icon={CheckCircle2}
              color="text-healthy"
              bgColor="bg-emerald-50"
              borderColor="border-emerald-100"
              trend={`${healthyPct}% share`}
              trendType="positive"
              sparklineVariant="healthy"
            />
            <KpiCard
              title="Warning Status"
              value={data.kpis.warning_engines ?? '—'}
              subtitle={`RUL ${thresholds?.critical || 30}–${thresholds?.warning || 75}c`}
              icon={AlertTriangle}
              color="text-warning"
              bgColor="bg-amber-50"
              borderColor="border-amber-100"
              trend={`${warningPct}% share`}
              trendType="warning"
              sparklineVariant="warning"
            />
            <KpiCard
              title="Critical Status"
              value={data.kpis.critical_engines ?? '—'}
              subtitle={`RUL ≤ ${thresholds?.critical || 30} cycles`}
              icon={ShieldAlert}
              color="text-critical"
              bgColor="bg-red-50"
              borderColor="border-red-100"
              trend={`${criticalPct}% urgent`}
              trendType="critical"
              sparklineVariant="critical"
            />
            <KpiCard
              title="Average RUL"
              value={data.kpis.avg_predicted_rul !== undefined ? `${data.kpis.avg_predicted_rul}c` : '—'}
              subtitle="Cycles Expectancy"
              icon={Clock}
              color="text-blue-600"
              bgColor="bg-blue-50"
              borderColor="border-blue-100"
              trend="Fleet Mean"
              trendType="neutral"
              sparklineVariant="upward"
            />
            <KpiCard
              title="Active Alerts"
              value={data.kpis.active_maintenance_alerts ?? '—'}
              subtitle="Pending Work Orders"
              icon={Wrench}
              color="text-purple-600"
              bgColor="bg-purple-50"
              borderColor="border-purple-100"
              trend="Queue Action"
              trendType={(data.kpis.active_maintenance_alerts || 0) > 0 ? 'critical' : 'positive'}
              sparklineVariant={(data.kpis.active_maintenance_alerts || 0) > 0 ? 'critical' : 'healthy'}
            />
          </div>

          {/* Visualizations Row 1: Donut & Histogram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthDonutChart
              data={data.health_distribution || []}
              totalEngines={data.kpis.total_engines || 0}
            />
            <RulHistogramChart data={data.rul_histogram || []} />
          </div>

          {/* Visualizations Row 2: Sensor Degradation Trend Line Chart */}
          <SensorDegradationChart
            data={data.sensor_trends_sample || []}
            sampleEngineId={data.sample_engine_id || 1}
          />

          {/* Visualizations Row 3: Predictions Table & Active Alerts List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentPredictionsTable predictions={data.recent_predictions || []} />
            </div>
            <div>
              <RecentAlertsList alerts={data.recent_alerts || []} />
            </div>
          </div>
        </>
      )}

      {/* Empty State fallback when data is missing or backend offline */}
      {!loading && (!data || !data.kpis) && !error && (
        <EmptyState
          title="No Fleet Telemetry"
          description="Could not load overview metrics from the FastAPI backend. Please verify your Railway backend URL is configured in VITE_API_BASE_URL."
          actionLabel="Retry Telemetry"
          onAction={fetchData}
        />
      )}
    </div>
  );
};

export default Overview;
