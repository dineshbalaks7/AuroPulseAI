import React from 'react';
import {
  Database,
  Layers,
  Cpu,
  Server,
  Network,
  LayoutDashboard,
  Gauge,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const SystemArchitecture = () => {
  return (
    <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-surface-border">
        <div>
          <h3 className="text-sm font-bold text-main tracking-tight">
            End-to-End System Pipeline & Data Flow
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Strict pipeline isolation with dedicated XGBoost inference engines feeding the FastAPI service
          </p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-primary-light text-primary border border-primary-200 self-start sm:self-auto">
          Isolated ML Pipelines
        </span>
      </div>

      {/* Architecture Flow */}
      <div className="space-y-4">
        {/* Step 1: Raw Data Root */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-main block">
                  NASA C-MAPSS Turbofan Engine Dataset
                </span>
                <span className="text-[11px] text-secondary">
                  26 multivariate time series columns • Run-to-failure simulation
                </span>
              </div>
            </div>
          </div>
          <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />
        </div>

        {/* Step 2: Split into 2 Independent Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Branch: FD001 */}
          <div className="bg-teal-50/40 border border-teal-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-teal-100">
              <span className="text-xs font-bold text-teal-900 font-mono">BRANCH A: FD001</span>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">Single Condition</span>
            </div>
            <div className="space-y-2 text-xs text-secondary">
              <div className="p-2.5 bg-white rounded-lg border border-teal-100">
                <strong className="text-main block mb-0.5">Preprocessing Pipeline:</strong>
                Filters invariant constant sensors (1, 5, 10, 16, 18, 19). Formats 19 input features in training order.
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-teal-100">
                <strong className="text-main block mb-0.5">XGBoost Regressor:</strong>
                Trained on 100 trajectories. Target capped at 125 cycles. Artifact: <code>xgboost_fd001_capped.pkl</code>.
              </div>
            </div>
          </div>

          {/* Right Branch: FD002 */}
          <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
              <span className="text-xs font-bold text-indigo-900 font-mono">BRANCH B: FD002</span>
              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">6 Flight Regimes</span>
            </div>
            <div className="space-y-2 text-xs text-secondary">
              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <strong className="text-main block mb-0.5">Preprocessing Pipeline:</strong>
                Flight regime lookup table + condition-wise standard deviation Z-score normalization for all 21 sensors.
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-indigo-100">
                <strong className="text-main block mb-0.5">Normalized XGBoost Regressor:</strong>
                Trained on 260 trajectories. Target capped at 125 cycles. Artifact: <code>fd002_xgboost.json</code>.
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Reconvergence into FastAPI Backend */}
        <div className="flex flex-col items-center pt-2">
          <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />
          <div className="w-full max-w-xl bg-slate-900 text-white rounded-xl p-4 shadow-md space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Python FastAPI REST Microservice (:8000)
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              Asynchronously loads serialized artifacts, executes Pydantic payload validation, coordinates batch caching, and exposes standardized REST endpoints with CORS headers.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 pt-2 text-[10px] font-mono">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">POST /predict/fd001</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">POST /predict/fd002</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">GET /overview</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">GET /sensors</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">GET /metrics</span>
            </div>
          </div>
          <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />
        </div>

        {/* Step 4: React UI Layer */}
        <div className="w-full max-w-xl mx-auto bg-primary-light/40 border border-primary-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-main block">
                AuroPulseAI Industrial React Dashboard
              </span>
              <span className="text-[11px] text-secondary">
                Vite • Tailwind CSS • Recharts • Context API • Live Telemetry Visualization
              </span>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 bg-white border border-primary-200 rounded-lg shadow-2xs">
            :5173
          </span>
        </div>

        {/* Step 5: Final Output Outputs */}
        <div className="flex flex-col items-center">
          <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-center text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block">RUL Predictions</span>
              <span className="text-[11px] text-emerald-700">Remaining cycles & health gauge</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 block">Degradation Trends</span>
              <span className="text-[11px] text-amber-700">Multi-sensor trajectories</span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="font-bold text-purple-900 block">Prognostic Reports</span>
              <span className="text-[11px] text-purple-700">PDF audit reports & CSV data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;
