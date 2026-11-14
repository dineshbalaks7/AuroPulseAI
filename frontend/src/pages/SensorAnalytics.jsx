import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  Layers,
  Thermometer,
  Gauge,
  Activity,
  Compass,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import engineService from '../services/engineService';
import Card from '../components/common/Card';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

export const SensorAnalytics = () => {
  const { selectedDataset } = useDataset();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSensorTab, setSelectedSensorTab] = useState('distributions');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await engineService.getAnalytics(selectedDataset);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to calculate dataset sensor analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDataset]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h1 className="text-xl font-bold text-main tracking-tight flex items-center gap-2">
            Sensor Telemetry & Feature Analytics
            <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-primary-light text-primary">
              {selectedDataset}
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Statistical distribution, inter-sensor correlation matrix, and operating regime analysis.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-xs font-semibold text-secondary hover:text-main hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
          Recalculate
        </button>
      </div>

      {error && <ErrorState message={error} onRetry={fetchAnalytics} />}

      {loading && !analytics && (
        <div className="space-y-6">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="table" count={8} />
        </div>
      )}

      {!loading && analytics && (
        <>
          {/* Operating Regimes Summary for FD002 */}
          {selectedDataset === 'FD002' && analytics.operating_conditions?.length > 0 && (
            <Card
              title="FD002 Multi-Condition Operating Regimes"
              subtitle="Distribution of 33,991 operational test cycles across the 6 flight regimes"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {analytics.operating_conditions.map((c) => (
                  <div
                    key={c.condition}
                    className="p-3 bg-slate-50 rounded-xl border border-surface-border text-center"
                  >
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                      Regime #{c.condition}
                    </span>
                    <span className="text-lg font-bold font-mono text-main block my-0.5">
                      {c.percentage}%
                    </span>
                    <span className="text-[11px] text-secondary font-mono">
                      {c.count.toLocaleString()} cycles
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Correlation Heatmap */}
          <Card
            title="Sensor Correlation Matrix (Pearson r)"
            subtitle="Identifies co-dependent thermodynamic variables and degradation signatures"
          >
            <CorrelationHeatmap
              correlationMatrix={analytics.correlation_matrix}
              activeSensors={analytics.active_sensors}
            />
          </Card>

          {/* Sensor Statistical Distributions Table */}
          <Card
            title="Telemetry Statistical Distributions"
            subtitle="Fleet-wide parameters: mean, standard deviation, quartiles, and extrema"
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-slate-50/70 text-[11px] font-semibold text-secondary uppercase tracking-wider">
                    <th className="py-3 px-4">Sensor</th>
                    <th className="py-3 px-4">Variable / Unit</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Mean</th>
                    <th className="py-3 px-4 text-right">Std Dev</th>
                    <th className="py-3 px-4 text-right">Min</th>
                    <th className="py-3 px-4 text-right">Median</th>
                    <th className="py-3 px-4 text-right">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {analytics.active_sensors.map((sensorKey) => {
                    const dist = analytics.distributions[sensorKey] || {};
                    const meta = dist.metadata || {};
                    return (
                      <tr key={sensorKey} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-mono font-bold text-main">
                          {sensorKey}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-main">
                          <span className="font-semibold text-primary">{meta.name || sensorKey}</span>{' '}
                          <span className="text-[11px] text-slate-400 font-mono">({meta.unit || ''})</span>
                        </td>
                        <td className="py-2.5 px-4 text-secondary text-[11px]">
                          {meta.description || '—'}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-main">
                          {dist.mean}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-secondary">
                          ±{dist.std}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-secondary">
                          {dist.min}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-main">
                          {dist.median}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-secondary">
                          {dist.max}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SensorAnalytics;
