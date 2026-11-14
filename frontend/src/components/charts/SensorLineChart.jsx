import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const PALETTE = [
  '#087F78', '#2563EB', '#D97706', '#DC2626', '#7C3AED',
  '#059669', '#DB2777', '#4F46E5', '#EA580C', '#0D9488'
];

export const SensorLineChart = ({
  data = [],
  selectedSensors = [],
  sensorMetadata = {},
  height = 360,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="cycle"
            tick={{ fontSize: 10, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
            label={{
              value: 'Operating Cycles',
              position: 'insideBottom',
              offset: -8,
              fontSize: 10,
              fill: '#94A3B8',
            }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#64748B' }}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg border border-slate-700 min-w-48">
                    <div className="font-semibold text-slate-300 pb-1 mb-1.5 border-b border-slate-800 flex justify-between">
                      <span>Cycle #{label}</span>
                      <span className="text-[10px] text-slate-400">
                        {payload[0]?.payload?.op_setting_1 !== undefined
                          ? `Alt: ${payload[0]?.payload?.op_setting_1}`
                          : ''}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {payload.map((item) => {
                        const meta = sensorMetadata[item.dataKey] || {};
                        const displayName = meta.name ? `${item.dataKey} (${meta.name})` : item.dataKey;
                        const unit = meta.unit || '';
                        return (
                          <div key={item.dataKey} className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-slate-300">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                              {displayName}:
                            </span>
                            <span className="font-mono font-bold">
                              {item.value} {unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              const meta = sensorMetadata[value] || {};
              const name = meta.name ? `${value} (${meta.name})` : value;
              return <span className="text-xs text-secondary font-medium mr-2">{name}</span>;
            }}
          />
          {selectedSensors.map((sensorKey, idx) => (
            <Line
              key={sensorKey}
              type="monotone"
              dataKey={sensorKey}
              name={sensorKey}
              stroke={PALETTE[idx % PALETTE.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorLineChart;
