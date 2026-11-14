import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '../common/Card';

const SENSOR_CONFIG = {
  sensor_2: { name: 'T24 (LPC Temp)', color: '#087F78', unit: '°R', desc: 'Low-Pressure Compressor Outlet' },
  sensor_3: { name: 'T30 (HPC Temp)', color: '#D97706', unit: '°R', desc: 'High-Pressure Compressor Outlet' },
  sensor_4: { name: 'T50 (LPT Temp)', color: '#DC2626', unit: '°R', desc: 'Low-Pressure Turbine Outlet' },
  sensor_7: { name: 'P30 (HPC Press)', color: '#2563EB', unit: 'psia', desc: 'High-Pressure Compressor Pressure' },
  sensor_11: { name: 'Ps30 (Static Press)', color: '#7C3AED', unit: 'psia', desc: 'HPC Static Pressure' },
  sensor_12: { name: 'phi (Fuel Ratio)', color: '#059669', unit: 'pps/psi', desc: 'Fuel Flow to Ps30 Ratio' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl text-xs shadow-2xl border border-slate-700/80 min-w-56 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Telemetry Snapshot
          </span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-bold border border-slate-700">
            Cycle #{label}
          </span>
        </div>

        <div className="space-y-2">
          {payload.map((entry) => {
            const cfg = SENSOR_CONFIG[entry.dataKey] || { name: entry.dataKey, unit: '', color: entry.color };
            return (
              <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{
                      backgroundColor: cfg.color,
                      boxShadow: `0 0 6px ${cfg.color}88`,
                    }}
                  />
                  <span className="text-slate-300 truncate font-medium">{cfg.name}</span>
                </div>
                <div className="font-mono font-bold text-white tracking-tight shrink-0">
                  {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}{' '}
                  <span className="text-[10px] text-slate-400 font-normal">{cfg.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const SensorDegradationChart = ({
  data = [],
  sampleEngineId = 1,
  className = '',
}) => {
  const [activeSensors, setActiveSensors] = useState(['sensor_2', 'sensor_3', 'sensor_4']);

  const toggleSensor = (sensorKey) => {
    setActiveSensors((prev) =>
      prev.includes(sensorKey)
        ? prev.length > 1
          ? prev.filter((s) => s !== sensorKey)
          : prev
        : [...prev, sensorKey]
    );
  };

  return (
    <Card
      title="Sensor Degradation Trends"
      subtitle={`Multivariate thermodynamic wear trajectory for Engine #${sampleEngineId}`}
      action={
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(SENSOR_CONFIG).map(([key, cfg]) => {
            const isActive = activeSensors.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleSensor(key)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'font-semibold text-white shadow-xs scale-102'
                    : 'bg-white text-secondary border-surface-border hover:bg-slate-50 hover:text-main'
                }`}
                style={{
                  backgroundColor: isActive ? cfg.color : undefined,
                  borderColor: isActive ? cfg.color : undefined,
                  boxShadow: isActive ? `0 2px 8px ${cfg.color}40` : undefined,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: isActive ? '#FFFFFF' : cfg.color }}
                />
                <span>{cfg.name}</span>
              </button>
            );
          })}
        </div>
      }
      className={className}
    >
      <div style={{ height: 280, minHeight: 280 }} className="w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="cycle"
              tick={{ fontSize: 10, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              label={{
                value: 'Operating Cycles (Cumulative Flight Duration)',
                position: 'insideBottom',
                offset: -4,
                fontSize: 10,
                fill: '#94A3B8',
              }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'monospace' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#087F78', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />
            {activeSensors.map((sensorKey) => {
              const cfg = SENSOR_CONFIG[sensorKey] || { color: '#087F78' };
              return (
                <Line
                  key={sensorKey}
                  type="monotone"
                  dataKey={sensorKey}
                  name={sensorKey}
                  stroke={cfg.color}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: cfg.color,
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                    className: 'filter drop-shadow-md',
                  }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SensorDegradationChart;
