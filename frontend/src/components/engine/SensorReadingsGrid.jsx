import React from 'react';
import Card from '../common/Card';

export const SensorReadingsGrid = ({ sensorStats = {}, activeSensors = [], className = '' }) => {
  const sensors = activeSensors.length > 0 ? activeSensors : Object.keys(sensorStats);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 ${className}`}>
      {sensors.map((sensorKey) => {
        const stat = sensorStats[sensorKey] || {};
        const meta = stat.metadata || {};
        const displayName = meta.name ? `${sensorKey} (${meta.name})` : sensorKey;

        return (
          <div
            key={sensorKey}
            className="p-3.5 bg-white rounded-xl border border-surface-border shadow-xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-bold text-main font-mono truncate" title={displayName}>
                {displayName}
              </span>
              <span className="text-[10px] text-primary font-semibold px-1.5 py-0.5 bg-primary-light rounded shrink-0">
                {meta.unit || 'unit'}
              </span>
            </div>

            <p className="text-[11px] text-secondary truncate mb-2" title={meta.description}>
              {meta.description || 'Sensor telemetry'}
            </p>

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Latest</span>
                <span className="text-sm font-bold text-main font-mono">
                  {stat.latest !== undefined ? stat.latest : '—'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Range [Min - Max]</span>
                <span className="text-[11px] text-secondary font-mono">
                  {stat.min !== undefined ? `${stat.min} - ${stat.max}` : '—'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SensorReadingsGrid;
