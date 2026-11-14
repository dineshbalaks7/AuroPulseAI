import React from 'react';
import { Database, Layers, CheckCircle2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';

export const DatasetComparison = () => {
  return (
    <div className="space-y-6">
      {/* Overview & Column Structure */}
      <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card space-y-4">
        <div>
          <h3 className="text-sm font-bold text-main tracking-tight">
            NASA C-MAPSS Telemetry & Column Taxonomy
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            The Commercial Modular Aero-Propulsion System Simulation dataset provides 26 multivariate columns per operating cycle snapshot.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Column 1</span>
            <span className="font-bold text-main block mt-0.5">Unit Number</span>
            <span className="text-[11px] text-secondary">Engine trajectory identifier</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Column 2</span>
            <span className="font-bold text-main block mt-0.5">Time in Cycles</span>
            <span className="text-[11px] text-secondary">Cumulative flight cycles</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Columns 3–5</span>
            <span className="font-bold text-main block mt-0.5">Operational Settings</span>
            <span className="text-[11px] text-secondary">Altitude, Mach, & Throttle (TRA)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Columns 6–26</span>
            <span className="font-bold text-main block mt-0.5">21 Sensor Readings</span>
            <span className="text-[11px] text-secondary">Temperatures, pressures, & speeds</span>
          </div>
        </div>
      </div>

      {/* Dataset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FD001 Card */}
        <div className="bg-white rounded-xl border border-teal-200 p-5 shadow-card space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -z-0 pointer-events-none" />
          <div className="flex items-center justify-between pb-3 border-b border-surface-border relative z-10">
            <div>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono uppercase">
                Single Condition
              </span>
              <h4 className="text-sm font-bold text-main mt-1">FD001 Sub-Dataset</h4>
            </div>
            <span className="font-mono text-xl font-extrabold text-primary">FD001</span>
          </div>

          <p className="text-xs text-secondary leading-relaxed relative z-10">
            Simulates turbofan engines operating exclusively at Sea Level standard atmospheric conditions. As wear progresses, thermodynamic stress is concentrated on High Pressure Compressor (HPC) degradation with no operating condition fluctuations.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Training Trajectories</span>
              <span className="font-mono font-bold text-main">100 engines</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Testing Trajectories</span>
              <span className="font-mono font-bold text-main">100 engines</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Operating Regimes</span>
              <span className="font-mono font-bold text-main">1 (Sea Level)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Sensors</span>
              <span className="font-mono font-bold text-primary">14 Sensors (6 Invariant)</span>
            </div>
          </div>
        </div>

        {/* FD002 Card */}
        <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-card space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0 pointer-events-none" />
          <div className="flex items-center justify-between pb-3 border-b border-surface-border relative z-10">
            <div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono uppercase">
                Multiple Conditions
              </span>
              <h4 className="text-sm font-bold text-main mt-1">FD002 Sub-Dataset</h4>
            </div>
            <span className="font-mono text-xl font-extrabold text-indigo-600">FD002</span>
          </div>

          <p className="text-xs text-secondary leading-relaxed relative z-10">
            Simulates complex flight profiles traversing 6 distinct operational regimes (altitude: 0–42,000 ft, Mach: 0.0–0.84, TRA: 0–100°). Sensor measurements shift dramatically depending on the flight envelope, requiring condition-wise normalization before inference.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Training Trajectories</span>
              <span className="font-mono font-bold text-main">260 engines</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Testing Trajectories</span>
              <span className="font-mono font-bold text-main">259 engines</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Operating Regimes</span>
              <span className="font-mono font-bold text-main">6 Flight Envelopes</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Sensors</span>
              <span className="font-mono font-bold text-indigo-600">All 21 Sensors (Z-Normalized)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-surface-border overflow-hidden shadow-card">
        <div className="p-4 border-b border-surface-border bg-slate-50/50">
          <h4 className="text-xs font-bold text-main uppercase tracking-wider">
            Detailed Structural Comparison: FD001 vs. FD002
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border bg-slate-50/70 text-[11px] font-semibold text-secondary uppercase tracking-wider">
                <th className="py-3 px-4">Feature Dimension</th>
                <th className="py-3 px-4 font-bold text-main">FD001</th>
                <th className="py-3 px-4 font-bold text-main">FD002</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-secondary">Training Engines</td>
                <td className="py-2.5 px-4 font-mono font-semibold text-main">100</td>
                <td className="py-2.5 px-4 font-mono font-semibold text-main">260</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-secondary">Test Engines</td>
                <td className="py-2.5 px-4 font-mono font-semibold text-main">100</td>
                <td className="py-2.5 px-4 font-mono font-semibold text-main">259</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-secondary">Operating Conditions</td>
                <td className="py-2.5 px-4 font-mono font-semibold text-main">1 (Sea Level)</td>
                <td className="py-2.5 px-4 font-mono font-semibold text-main">6 (Multi-Altitude & Mach)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-secondary">Fault Modes</td>
                <td className="py-2.5 px-4 font-semibold text-main">1 (HPC Degradation)</td>
                <td className="py-2.5 px-4 font-semibold text-main">1 (HPC Degradation)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-secondary">Preprocessing Strategy</td>
                <td className="py-2.5 px-4 font-medium text-teal-700">Independent (Prunes 6 invariant sensors)</td>
                <td className="py-2.5 px-4 font-medium text-indigo-700">Independent (Regime lookup + Z-score normalization)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-4 font-semibold text-secondary">ML Algorithm</td>
                <td className="py-2.5 px-4 font-mono font-bold text-primary">XGBoost Regressor</td>
                <td className="py-2.5 px-4 font-mono font-bold text-primary">XGBoost Regressor</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Clarification Note */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-amber-900 leading-relaxed">
          <strong>Important Disambiguation:</strong> The training and testing engine counts (100 in FD001; 260/259 in FD002) represent historical benchmark trajectory records in the NASA C-MAPSS dataset. They must not be confused with the live active engines monitored dynamically within the AuroPulseAI platform.
        </p>
      </div>
    </div>
  );
};

export default DatasetComparison;
