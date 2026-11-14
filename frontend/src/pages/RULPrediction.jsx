import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  Sparkles,
  Info,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import engineService from '../services/engineService';
import PredictionForm from '../components/prediction/PredictionForm';
import RulGauge from '../components/prediction/RulGauge';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';

export const RULPrediction = () => {
  const { selectedDataset, thresholds } = useDataset();
  const [sensorMetadata, setSensorMetadata] = useState({});
  const [currentResult, setCurrentResult] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMeta = async () => {
      try {
        const meta = await engineService.getSensorMetadata();
        if (isMounted) setSensorMetadata(meta);
      } catch (err) {
        console.warn('Could not load sensor metadata:', err);
      }
    };
    fetchMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  // When prediction completes
  const handlePredictionSuccess = (result) => {
    setCurrentResult(result);
    setPredictionHistory((prev) => [result, ...prev.slice(0, 9)]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-surface-border">
        <h1 className="text-xl font-bold text-main tracking-tight flex items-center gap-2">
          Turbofan Remaining Useful Life (RUL) Inference
          <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-primary-light text-primary">
            {selectedDataset}
          </span>
        </h1>
        <p className="text-xs text-secondary mt-1">
          Execute real-time model inference using the trained XGBoost regressor with NASA C-MAPSS telemetry.
        </p>
      </div>

      {/* Main Grid: Form on left, Result Gauge on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionForm
            dataset={selectedDataset}
            sensorMetadata={sensorMetadata}
            onPredictionSuccess={handlePredictionSuccess}
          />
        </div>

        {/* Prediction Result Gauge */}
        <div className="space-y-6">
          {currentResult ? (
            <RulGauge
              predictedRul={currentResult.predicted_rul}
              maxRul={125}
              criticalThreshold={thresholds.critical}
              warningThreshold={thresholds.warning}
              engineId={currentResult.engineId}
              cycle={currentResult.cycle}
              dataset={currentResult.dataset}
              timestamp={currentResult.timestamp}
            />
          ) : (
            <div className="bg-white rounded-xl border border-surface-border p-8 shadow-card text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4">
                <Cpu className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-main mb-1">Awaiting Prediction</h3>
              <p className="text-xs text-secondary max-w-xs leading-relaxed mb-4">
                Select an engine cycle or configure sensor telemetry, then click "Run Model Inference" to evaluate Remaining Useful Life.
              </p>
              <div className="text-[11px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
                Model: XGBoost ({selectedDataset})
              </div>
            </div>
          )}

          {/* Model Note */}
          <div className="bg-slate-50 rounded-xl p-4 border border-surface-border text-xs space-y-1 text-secondary">
            <span className="font-semibold text-main block">Model Target Ceiling (Cap):</span>
            <p className="leading-relaxed">
              Both FD001 and FD002 models enforce a training target cap at 125 cycles. In early engine life, wear is negligible; capping prevents unbounded variance in healthy engines.
            </p>
          </div>
        </div>
      </div>

      {/* Session Prediction History */}
      {predictionHistory.length > 0 && (
        <Card
          title="Session Inference History"
          subtitle="Audit log of predictions executed during this browser session"
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-slate-50/70 text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Dataset</th>
                  <th className="py-2.5 px-4">Engine ID</th>
                  <th className="py-2.5 px-4">Cycle</th>
                  <th className="py-2.5 px-4">Predicted RUL</th>
                  <th className="py-2.5 px-4">Health Assessment</th>
                  <th className="py-2.5 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {predictionHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono text-secondary text-[11px]">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-primary">
                      {item.dataset}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-main font-semibold">
                      {item.engineId ? `Engine #${item.engineId}` : 'Ad-hoc'}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-secondary">
                      {item.cycle !== undefined ? item.cycle : '—'}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-main">
                      {item.predicted_rul} cycles
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={item.status || 'Healthy'} size="sm" />
                    </td>
                    <td className="py-2.5 px-4 text-secondary text-[11px]">
                      {item.action || 'Routine monitoring'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RULPrediction;
