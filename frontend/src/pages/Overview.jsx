import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Wrench,
  RefreshCw,
  Sparkles,
  Zap,
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

export const Overview = () => {
  const { selectedDataset, thresholds } = useDataset();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await engineService.getOverview(
        selectedDataset,
        thresholds.critical,
        thresholds.warning
      );
      setData(overview);
    } catch (err) {
      setError(err.message || 'Failed to load fleet overview metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDataset, thresholds]);

  // Compute fleet percentage metrics for KPIs
  const total = data?.kpis?.total_engines || 1;
  const healthyPct = data ? Math.round((data.kpis.healthy_engines / total) * 100) : 0;
  const warningPct = data ? Math.round((data.kpis.warning_engines / total) * 100) : 0;
  const criticalPct = data ? Math.round((data.kpis.critical_engines / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header with Live Streaming Pulse */}
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
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface-border bg-white text-xs font-semibold text-secondary hover:text-main hover:bg-slate-50 transition-all shadow-xs hover:shadow-card-hover active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : 'text-slate-400'}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={fetchData} />}

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

      {/* Main Content */}
      {!loading && data && (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KpiCard
              title="Total Fleet"
              value={data.kpis.total_engines}
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
              value={data.kpis.healthy_engines}
              subtitle={`RUL > ${thresholds.warning} cycles`}
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
              value={data.kpis.warning_engines}
              subtitle={`RUL ${thresholds.critical}–${thresholds.warning}c`}
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
              value={data.kpis.critical_engines}
              subtitle={`RUL ≤ ${thresholds.critical} cycles`}
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
              value={`${data.kpis.avg_predicted_rul}`}
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
              value={data.kpis.active_maintenance_alerts}
              subtitle="Pending Work Orders"
              icon={Wrench}
              color="text-purple-600"
              bgColor="bg-purple-50"
              borderColor="border-purple-100"
              trend="Queue Action"
              trendType={data.kpis.active_maintenance_alerts > 0 ? 'critical' : 'positive'}
              sparklineVariant={data.kpis.active_maintenance_alerts > 0 ? 'critical' : 'healthy'}
            />
          </div>

          {/* Visualizations Row 1: Donut & Histogram */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthDonutChart
              data={data.health_distribution}
              totalEngines={data.kpis.total_engines}
            />
            <RulHistogramChart data={data.rul_histogram} />
          </div>

          {/* Visualizations Row 2: Sensor Degradation Trend Line Chart */}
          <SensorDegradationChart
            data={data.sensor_trends_sample}
            sampleEngineId={data.sample_engine_id}
          />

          {/* Visualizations Row 3: Predictions Table & Active Alerts List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentPredictionsTable predictions={data.recent_predictions} />
            </div>
            <div>
              <RecentAlertsList alerts={data.recent_alerts} />
            </div>
          </div>
        </>
      )}

      {/* Empty State fallback */}
      {!loading && !data && !error && (
        <EmptyState
          title="No Fleet Telemetry"
          description="Could not load overview metrics from the FastAPI backend. Verify the model service is running on port 8000."
          actionLabel="Retry"
          onAction={fetchData}
        />
      )}
    </div>
  );
};

export default Overview;
