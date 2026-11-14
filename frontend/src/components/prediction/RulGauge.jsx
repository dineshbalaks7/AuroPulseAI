import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const RulGauge = ({
  predictedRul = 0,
  maxRul = 125,
  criticalThreshold = 30,
  warningThreshold = 75,
  engineId,
  cycle,
  dataset = 'FD001',
  timestamp,
}) => {
  const rul = Math.max(0, Number(predictedRul) || 0);
  const percentage = Math.min(100, Math.max(0, (rul / maxRul) * 100));

  let status = 'Healthy';
  let colorHex = '#16A34A';
  let strokeBg = '#DCFCE7';
  let strokeColor = '#16A34A';
  let priority = 'Routine Maintenance';

  if (rul <= criticalThreshold) {
    status = 'Critical';
    colorHex = '#DC2626';
    strokeBg = '#FEE2E2';
    strokeColor = '#DC2626';
    priority = 'Immediate Action Required';
  } else if (rul <= warningThreshold) {
    status = 'Warning';
    colorHex = '#EAA329';
    strokeBg = '#FEF3C7';
    strokeColor = '#EAA329';
    priority = 'Schedule Next Inspection';
  }

  // Exact Semi-circle Path Geometry:
  // Center: (100, 105), Radius: 75
  // Path from (25, 105) up over (100, 30) down to (175, 105)
  const radius = 75;
  const arcLength = Math.PI * radius; // ~235.62
  const strokeDashoffset = arcLength * (1 - percentage / 100);

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card flex flex-col items-center text-center">
      {/* Card Header with clean separation */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-surface-border mb-4 text-xs">
        <span className="font-semibold text-secondary">Predicted RUL Indicator</span>
        <StatusBadge status={status} size="md" />
      </div>

      {/* Semi-Circle Speedometer Gauge */}
      <div className="relative w-64 h-36 flex flex-col items-center justify-end overflow-hidden mb-2">
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full overflow-visible"
        >
          {/* Background Arc */}
          <path
            d="M 25,105 A 75,75 0 0,1 175,105"
            fill="none"
            stroke={strokeBg}
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <path
            d="M 25,105 A 75,75 0 0,1 175,105"
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Centered RUL Reading */}
        <div className="absolute bottom-2 flex flex-col items-center pointer-events-none">
          <span
            className="text-4xl font-extrabold font-mono tracking-tight leading-none"
            style={{ color: colorHex }}
          >
            {rul.toFixed(1)}
          </span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mt-1">
            Remaining Cycles
          </span>
        </div>
      </div>

      {/* Threshold Scale Markers */}
      <div className="w-full max-w-xs flex justify-between text-[10px] font-mono mt-1 mb-4 text-slate-400">
        <span>0</span>
        <span className="text-red-600 font-bold">Crit ≤ {criticalThreshold}</span>
        <span className="text-amber-600 font-bold">Warn ≤ {warningThreshold}</span>
        <span>{maxRul}+ (Cap)</span>
      </div>

      {/* Details Box */}
      <div className="w-full bg-slate-50 rounded-xl p-3.5 border border-surface-border text-left space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-secondary">Assessed Unit:</span>
          <span className="font-mono font-bold text-main">
            {engineId && engineId !== 'Custom Input' ? `Engine #${engineId}` : 'Custom Telemetry'}
          </span>
        </div>
        {cycle !== undefined && (
          <div className="flex justify-between">
            <span className="text-secondary">Operating Cycle:</span>
            <span className="font-mono text-main">Cycle #{cycle}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-secondary">Dataset / Model:</span>
          <span className="font-mono text-primary font-bold">{dataset}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary">Maintenance Priority:</span>
          <span className="font-semibold text-main">{priority}</span>
        </div>
        {timestamp && (
          <div className="flex justify-between pt-1.5 border-t border-slate-200 text-[10px] text-slate-400">
            <span>Inference Timestamp:</span>
            <span>{new Date(timestamp).toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Disclaimers */}
      <p className="text-[10px] text-slate-400 mt-4 leading-normal italic max-w-xs">
        * Application-defined operational threshold. Does not represent empirical failure probability or guarantee engine failure at cycle 0.
      </p>
    </div>
  );
};

export default RulGauge;
