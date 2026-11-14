import React from 'react';
import {
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sliders,
  Gauge,
  Info,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';

export const DatasetManagement = () => {
  const { selectedDataset, switchDataset, datasetsMetadata } = useDataset();

  const datasets = [
    {
      id: 'FD001',
      title: 'FD001 — Single Operating Condition',
      operatingRegime: 'Single Condition (Sea Level Standard Atmosphere)',
      faultModes: 'ONE (High Pressure Compressor HPC Degradation)',
      trainEngines: 100,
      testEngines: 100,
      totalTestCycles: '13,096 cycles',
      activeSensors: '14 Active Sensors',
      droppedSensors: 'Sensors 1, 5, 10, 16, 18, 19 (Constant / Invariant)',
      totalFeatures: '19 features (time_in_cycles + 3 op settings + 15 sensors)',
      modelFile: 'xgboost_fd001_capped.pkl (Target capped at 125 cycles)',
      validationMae: '10.00 cycles (Test MAE)',
      nasaScore: '611.42',
      description:
        'Standard benchmark dataset where simulated aircraft turbofan engines operate under sea level conditions with normal variations, degrading gradually until HPC failure.',
    },
    {
      id: 'FD002',
      title: 'FD002 — Multiple Operating Conditions',
      operatingRegime: 'SIX Operating Regimes (Altitude: 0–42,000 ft, Mach: 0.0–0.84, TRA: 0–100°)',
      faultModes: 'ONE (High Pressure Compressor HPC Degradation)',
      trainEngines: 260,
      testEngines: 259,
      totalTestCycles: '33,991 cycles',
      activeSensors: '21 Active Sensors (Condition-wise Normalized)',
      droppedSensors: 'None (All 21 sensors used with regime Z-score normalization)',
      totalFeatures: '24 features (3 op settings + 21 normalized sensor features)',
      modelFile: 'fd002_xgboost.json + fd002_preprocessing.pkl',
      validationMae: '14.27 cycles (Validation MAE)',
      nasaScore: '155,278.85',
      description:
        'Advanced dataset spanning six distinct flight operating envelopes. Telemetry varies drastically with altitude and Mach speed, requiring condition-wise normalization before XGBoost inference.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-surface-border">
        <h1 className="text-xl font-bold text-main tracking-tight flex items-center gap-2">
          NASA C-MAPSS Dataset Management
        </h1>
        <p className="text-xs text-secondary mt-1">
          Switch between independently trained XGBoost prognostics pipelines. Preprocessing and feature schemas are strictly isolated.
        </p>
      </div>

      {/* Pipeline Isolation Warning Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-blue-900 block mb-0.5">
            Strict Pipeline Isolation Architecture
          </span>
          <p className="text-blue-700 leading-relaxed">
            FD001 uses single-condition unnormalized raw telemetry with constant sensors pruned, while FD002 executes a 6-regime lookup and condition-wise standard deviation normalization. Switching datasets resets all telemetry caches to prevent cross-contamination.
          </p>
        </div>
      </div>

      {/* Dataset Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {datasets.map((ds) => {
          const isActive = selectedDataset === ds.id;
          return (
            <div
              key={ds.id}
              className={`bg-white rounded-xl border p-6 shadow-card transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'border-primary ring-2 ring-primary/20 shadow-card-hover'
                  : 'border-surface-border hover:border-slate-300'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ds.id}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-main">{ds.title}</h3>
                      <p className="text-[11px] text-secondary">{ds.operatingRegime}</p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-light text-primary border border-primary-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Model
                    </span>
                  ) : (
                    <button
                      onClick={() => switchDataset(ds.id)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-secondary hover:text-main bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Select Dataset
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-secondary leading-relaxed mb-4">
                  {ds.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Training Trajectories</span>
                    <span className="font-mono font-bold text-main">{ds.trainEngines} engines</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Test Trajectories</span>
                    <span className="font-mono font-bold text-main">{ds.testEngines} engines</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Features Schema</span>
                    <span className="font-mono font-bold text-main">{ds.totalFeatures.split('(')[0]}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Evaluated NASA Score</span>
                    <span className="font-mono font-bold text-primary">{ds.nasaScore}</span>
                  </div>
                </div>

                {/* Detailed Pipeline Specs */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-secondary">Fault Modes:</span>
                    <span className="font-medium text-main text-right">{ds.faultModes}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-secondary">Active Sensors:</span>
                    <span className="font-medium text-main text-right">{ds.activeSensors}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-secondary">Dropped Invariant Sensors:</span>
                    <span className="font-medium text-slate-500 text-right">{ds.droppedSensors}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-secondary">Model Artifact:</span>
                    <span className="font-mono text-[11px] text-main text-right">{ds.modelFile}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-surface-border">
                {isActive ? (
                  <div className="w-full py-2 px-3 text-center text-xs font-semibold text-primary bg-primary-light rounded-lg border border-primary-200">
                    Currently Selected & Active
                  </div>
                ) : (
                  <button
                    onClick={() => switchDataset(ds.id)}
                    className="w-full py-2 px-3 text-center text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    Switch to {ds.id} Pipeline
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatasetManagement;
