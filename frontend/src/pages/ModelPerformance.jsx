import React, { useState, useEffect } from 'react';
import {
  Award,
  TrendingDown,
  BarChart3,
  Layers,
  CheckCircle2,
  Info,
  Scale,
  Zap,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import engineService from '../services/engineService';
import Card from '../components/common/Card';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';

export const ModelPerformance = () => {
  const { selectedDataset } = useDataset();
  const [fd001Metrics, setFd001Metrics] = useState(null);
  const [fd002Metrics, setFd002Metrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAllMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [m1, m2] = await Promise.all([
          engineService.getModelMetrics('FD001'),
          engineService.getModelMetrics('FD002'),
        ]);
        if (isMounted) {
          setFd001Metrics(m1);
          setFd002Metrics(m2);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to retrieve model metrics.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAllMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeMetrics = selectedDataset === 'FD001' ? fd001Metrics : fd002Metrics;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-surface-border">
        <h1 className="text-xl font-bold text-main tracking-tight flex items-center gap-2">
          Model Evaluation & Performance Metrics
          <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-primary-light text-primary">
            {selectedDataset} Active
          </span>
        </h1>
        <p className="text-xs text-secondary mt-1">
          Rigorous offline validation results, NASA scoring metrics, and baseline comparisons for XGBoost regressor pipelines.
        </p>
      </div>

      {error && <ErrorState message={error} />}

      {loading && (
        <div className="space-y-6">
          <LoadingSkeleton variant="kpi" count={4} />
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="table" count={6} />
        </div>
      )}

      {!loading && activeMetrics && (
        <>
          {/* Key Evaluation Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Mean Absolute Error (MAE)
              </span>
              <div className="flex items-baseline gap-2 my-1">
                <span className="text-2xl font-bold font-mono text-main">
                  {selectedDataset === 'FD001' ? activeMetrics.test_mae : activeMetrics.validation_mae}
                </span>
                <span className="text-xs text-secondary font-mono">cycles</span>
              </div>
              <p className="text-[11px] text-secondary">
                {selectedDataset === 'FD001' ? 'Holdout test set' : 'Validation set'}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Root Mean Squared Error (RMSE)
              </span>
              <div className="flex items-baseline gap-2 my-1">
                <span className="text-2xl font-bold font-mono text-main">
                  {selectedDataset === 'FD001' ? activeMetrics.test_rmse : activeMetrics.validation_rmse}
                </span>
                <span className="text-xs text-secondary font-mono">cycles</span>
              </div>
              <p className="text-[11px] text-secondary">
                Penalizes large outlier errors
              </p>
            </div>

            <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Coefficient of Determination (R²)
              </span>
              <div className="flex items-baseline gap-2 my-1">
                <span className="text-2xl font-bold font-mono text-primary">
                  {selectedDataset === 'FD001' ? activeMetrics.test_r2 : activeMetrics.validation_r2}
                </span>
              </div>
              <p className="text-[11px] text-secondary">
                Variance explained by model
              </p>
            </div>

            <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                NASA Prognostic Score
              </span>
              <div className="flex items-baseline gap-2 my-1">
                <span className="text-2xl font-bold font-mono text-emerald-700">
                  {Number(activeMetrics.nasa_score).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-secondary">
                Asymmetrical safety penalty
              </p>
            </div>
          </div>

          {/* NASA Scoring Function Breakdown Box */}
          <div className="bg-slate-50 border border-surface-border rounded-xl p-5 text-xs">
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <span className="font-bold text-main block text-sm">
                  NASA C-MAPSS Asymmetrical Prognostic Scoring Function
                </span>
                <p className="text-secondary leading-relaxed">
                  In aerospace maintenance, late predictions (predicting the engine will last longer than it actually will) are critically hazardous compared to early predictions (scheduling maintenance early). The NASA PHM08 score incorporates an exponential asymmetrical penalty:
                </p>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                  d = Predicted_RUL - True_RUL <br />
                  If d &lt; 0 (Early prediction): S = exp(-d / 13) - 1 <br />
                  If d &ge; 0 (Late prediction):  S = exp(d / 10) - 1
                </div>
              </div>
            </div>
          </div>

          {/* Model Comparison Table */}
          <Card
            title="FD001 vs FD002 Model Architecture Comparison"
            subtitle="Independently trained XGBoost pipelines and evaluation metrics"
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-slate-50/70 text-[11px] font-semibold text-secondary uppercase tracking-wider">
                    <th className="py-3 px-4">Evaluation Dimension</th>
                    <th className="py-3 px-4 font-bold text-main">FD001 (Single Condition)</th>
                    <th className="py-3 px-4 font-bold text-main">FD002 (Multi Condition)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Operating Regimes</td>
                    <td className="py-2.5 px-4">1 (Sea Level)</td>
                    <td className="py-2.5 px-4">6 (Multi-Altitude & Mach)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Training Engines</td>
                    <td className="py-2.5 px-4 font-mono">100 trajectories</td>
                    <td className="py-2.5 px-4 font-mono">260 trajectories</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Testing Engines</td>
                    <td className="py-2.5 px-4 font-mono">100 trajectories</td>
                    <td className="py-2.5 px-4 font-mono">259 trajectories</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Feature Count</td>
                    <td className="py-2.5 px-4 font-mono">19 features</td>
                    <td className="py-2.5 px-4 font-mono">24 features</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Sensor Normalization</td>
                    <td className="py-2.5 px-4 text-slate-600">None (Raw sensor values)</td>
                    <td className="py-2.5 px-4 text-primary font-medium">Regime-wise Z-Score Normalization</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">RUL Target Cap</td>
                    <td className="py-2.5 px-4 font-mono">125 cycles</td>
                    <td className="py-2.5 px-4 font-mono">125 cycles</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Validation MAE</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-main">10.00 cycles</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-main">14.27 cycles</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Validation RMSE</td>
                    <td className="py-2.5 px-4 font-mono">15.77 cycles</td>
                    <td className="py-2.5 px-4 font-mono">19.58 cycles</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">NASA Score</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-primary">611.42</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-primary">155,278.85</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-secondary">Model Format</td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">xgboost_fd001_capped.pkl</td>
                    <td className="py-2.5 px-4 font-mono text-[11px]">fd002_xgboost.json</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Hyperparameters Configuration Card */}
          <Card
            title={`Tuned Hyperparameters (${selectedDataset})`}
            subtitle="Optimal parameters obtained via cross-validated GridSearch"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {Object.entries(activeMetrics.hyperparameters || {}).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 font-mono block truncate" title={key}>
                    {key}
                  </span>
                  <span className="text-sm font-bold font-mono text-main block mt-1">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ModelPerformance;
