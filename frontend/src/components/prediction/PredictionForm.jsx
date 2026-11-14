import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import Card from '../common/Card';
import engineService from '../../services/engineService';
import predictionService from '../../services/predictionService';

export const PredictionForm = ({
  dataset = 'FD001',
  sensorMetadata = {},
  onPredictionSuccess,
  className = '',
}) => {
  const [engineList, setEngineList] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState('');
  const [cycle, setCycle] = useState('');
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form input values
  const [inputs, setInputs] = useState({});

  // List of active fields depending on dataset
  const activeSensors =
    dataset === 'FD001'
      ? [
          'sensor_2', 'sensor_3', 'sensor_4', 'sensor_6', 'sensor_7',
          'sensor_8', 'sensor_9', 'sensor_11', 'sensor_12', 'sensor_13',
          'sensor_14', 'sensor_15', 'sensor_17', 'sensor_20', 'sensor_21',
        ]
      : Array.from({ length: 21 }, (_, i) => `sensor_${i + 1}`);

  // Fetch engines for dataset
  useEffect(() => {
    let isMounted = true;
    const fetchEngines = async () => {
      try {
        const res = await engineService.getEngines(dataset);
        if (isMounted && res.engines) {
          setEngineList(res.engines);
          if (res.engines.length > 0) {
            setSelectedEngine(res.engines[0].engine_id);
            setCycle(res.engines[0].current_cycle);
          }
        }
      } catch (err) {
        console.warn('Error loading engine list for prediction form:', err);
      }
    };
    fetchEngines();
    return () => {
      isMounted = false;
    };
  }, [dataset]);

  // Load telemetry from selected engine
  const handleLoadRecord = async (engineId, targetCycle) => {
    if (!engineId) return;
    setLoadingRecord(true);
    setError(null);
    try {
      const details = await engineService.getEngineSensors(dataset, engineId);
      const lastRow = details.last_cycle_record || {};

      const newInputs = {};
      if (dataset === 'FD001') {
        newInputs['time_in_cycles'] = lastRow['time_in_cycles'] || details.total_cycles || 31;
      }
      newInputs['op_setting_1'] = lastRow['op_setting_1'] || 0;
      newInputs['op_setting_2'] = lastRow['op_setting_2'] || 0;
      newInputs['op_setting_3'] = lastRow['op_setting_3'] || 100;

      activeSensors.forEach((s) => {
        newInputs[s] = lastRow[s] !== undefined ? lastRow[s] : 0;
      });

      setInputs(newInputs);
      setCycle(lastRow['time_in_cycles'] || details.total_cycles);
      setSelectedEngine(engineId);
    } catch (err) {
      setError(`Failed to retrieve engine record: ${err.message}`);
    } finally {
      setLoadingRecord(false);
    }
  };

  // Auto-populate initial engine on dataset switch
  useEffect(() => {
    if (selectedEngine) {
      handleLoadRecord(selectedEngine, cycle);
    }
  }, [selectedEngine, dataset]);

  // Reset form to blank / zeros
  const handleResetForm = () => {
    const emptyInputs = {};
    if (dataset === 'FD001') emptyInputs['time_in_cycles'] = '';
    emptyInputs['op_setting_1'] = '';
    emptyInputs['op_setting_2'] = '';
    emptyInputs['op_setting_3'] = '';
    activeSensors.forEach((s) => {
      emptyInputs[s] = '';
    });
    setInputs(emptyInputs);
    setSelectedEngine('');
    setCycle('');
    setError(null);
  };

  // Preset 1: Healthy Profile (Nominal / High RUL)
  const handleLoadHealthyPreset = () => {
    const healthyEngineId = dataset === 'FD001' ? 1 : 18;
    handleLoadRecord(healthyEngineId);
  };

  // Preset 2: Critical Profile (Degraded / Low RUL)
  const handleLoadCriticalPreset = () => {
    const criticalEngineId = dataset === 'FD001' ? 81 : 1;
    handleLoadRecord(criticalEngineId);
  };

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await predictionService.predict(dataset, inputs);
      if (onPredictionSuccess) {
        onPredictionSuccess({
          ...result,
          engineId: selectedEngine || 'Custom Input',
          cycle: inputs.time_in_cycles || cycle || 1,
          dataset,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err.message || 'Prediction failed. Check input parameters.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      title={`RUL Prediction Input (${dataset})`}
      subtitle={`Configure operational telemetry for ${dataset} XGBoost inference model`}
      className={className}
    >
      {/* Quick Test Toolbar with the 2 Kind of Buttons + Reset Button */}
      <div className="bg-slate-50 p-4 rounded-xl border border-surface-border mb-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-main uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Quick Test Profiles:
          </span>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-secondary hover:text-main bg-white hover:bg-slate-100 rounded-lg border border-surface-border shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset All Fields
          </button>
        </div>

        {/* The Two Kinds of Test Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Button Kind 1: Test Healthy Engine Profile */}
          <button
            type="button"
            onClick={handleLoadHealthyPreset}
            disabled={loadingRecord}
            className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 transition-all text-left shadow-xs group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                Load Healthy Profile
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded font-bold">
                  RUL &gt; 100c
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Populates nominal baseline sensor telemetry (nominal temps & pressures).
              </p>
            </div>
          </button>

          {/* Button Kind 2: Test Critical Engine Profile */}
          <button
            type="button"
            onClick={handleLoadCriticalPreset}
            disabled={loadingRecord}
            className="flex items-center gap-3 p-3 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100/70 text-red-900 transition-all text-left shadow-xs group"
          >
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-critical shrink-0 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                Load Critical Profile
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-red-200 text-red-900 rounded font-bold">
                  RUL &le; 25c
                </span>
              </div>
              <p className="text-[11px] text-red-700 mt-0.5">
                Populates high-wear telemetry (elevated HPC/LPT temps, low static pressure).
              </p>
            </div>
          </button>
        </div>

        {/* Custom Engine Dropdown */}
        <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-medium">Or pick from fleet:</span>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(Number(e.target.value))}
              className="text-xs bg-white border border-surface-border rounded-md px-2.5 py-1 text-main font-semibold focus:ring-1 focus:ring-primary"
            >
              <option value="">Select Engine ID...</option>
              {engineList.map((e) => (
                <option key={e.engine_id} value={e.engine_id}>
                  Engine #{e.engine_id} ({e.health_status} • Cycle {e.current_cycle})
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {dataset === 'FD001' ? '19 Required Features' : '24 Required Features'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Operating Conditions Section */}
        <div>
          <h4 className="text-xs font-bold text-main uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <span>Operational Settings</span>
            <div className="h-px bg-slate-200 flex-1" />
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {dataset === 'FD001' && (
              <div>
                <label className="block text-[11px] font-semibold text-secondary mb-1">
                  Time in Cycles
                </label>
                <input
                  type="number"
                  step="any"
                  value={inputs.time_in_cycles ?? ''}
                  onChange={(e) => handleInputChange('time_in_cycles', e.target.value)}
                  className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-surface-border rounded-lg text-main focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 31"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-secondary mb-1">
                Op Setting 1 (Altitude)
              </label>
              <input
                type="number"
                step="any"
                value={inputs.op_setting_1 ?? ''}
                onChange={(e) => handleInputChange('op_setting_1', e.target.value)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-surface-border rounded-lg text-main focus:ring-1 focus:ring-primary"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-secondary mb-1">
                Op Setting 2 (Mach)
              </label>
              <input
                type="number"
                step="any"
                value={inputs.op_setting_2 ?? ''}
                onChange={(e) => handleInputChange('op_setting_2', e.target.value)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-surface-border rounded-lg text-main focus:ring-1 focus:ring-primary"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-secondary mb-1">
                Op Setting 3 (TRA)
              </label>
              <input
                type="number"
                step="any"
                value={inputs.op_setting_3 ?? ''}
                onChange={(e) => handleInputChange('op_setting_3', e.target.value)}
                className="w-full text-xs font-mono px-3 py-1.5 bg-white border border-surface-border rounded-lg text-main focus:ring-1 focus:ring-primary"
                placeholder="100.0"
                required
              />
            </div>
          </div>
        </div>

        {/* Sensor Telemetry Section */}
        <div>
          <h4 className="text-xs font-bold text-main uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <span>Engine Sensor Measurements</span>
            <div className="h-px bg-slate-200 flex-1" />
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-80 overflow-y-auto p-1">
            {activeSensors.map((sensorKey) => {
              const meta = sensorMetadata[sensorKey] || {};
              const label = meta.name ? `${sensorKey} (${meta.name})` : sensorKey;

              return (
                <div key={sensorKey}>
                  <label
                    className="block text-[11px] font-semibold text-secondary truncate mb-1"
                    title={meta.description}
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={inputs[sensorKey] ?? ''}
                      onChange={(e) => handleInputChange(sensorKey, e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-surface-border rounded-lg text-main focus:ring-1 focus:ring-primary"
                      placeholder="0.00"
                      required
                    />
                    {meta.unit && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-sans pointer-events-none">
                        {meta.unit}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-4 border-t border-surface-border flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-secondary hover:text-main text-xs font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Fields
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Calculating RUL...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Run Model Inference
              </>
            )}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default PredictionForm;
