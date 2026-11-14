import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import Card from '../common/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isCrit = data.status === 'Critical';
    const isWarn = data.status === 'Warning';
    const color = isCrit ? '#DC2626' : isWarn ? '#EAA329' : '#16A34A';

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl text-xs shadow-xl border border-slate-700/80 min-w-44">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            RUL Cycle Bin
          </span>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded font-bold"
            style={{
              backgroundColor: isCrit ? '#450a0a' : isWarn ? '#451a03' : '#052e16',
              color: color,
            }}
          >
            {data.status}
          </span>
        </div>

        <div className="font-mono text-sm font-extrabold text-white tracking-tight mb-2">
          {label} <span className="text-xs font-normal text-slate-400">operating cycles</span>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-slate-300">Engine Frequency:</span>
          </div>
          <span className="font-mono font-bold text-white text-sm">
            {data.count} <span className="text-[10px] text-slate-400 font-normal">units</span>
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const RulHistogramChart = ({ data = [], className = '' }) => {
  return (
    <Card
      title="RUL Distribution"
      subtitle="Fleet frequency histogram by remaining operating cycles"
      className={className}
    >
      <div style={{ height: 260, minHeight: 260 }} className="w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="bar-grad-healthy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#16A34A" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="bar-grad-warning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#D97706" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="bar-grad-critical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F87171" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 10, fill: '#64748B', fontWeight: 500 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              label={{
                value: 'Remaining Operating Cycles (Binned)',
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
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
            <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => {
                let fill = '#16A34A';
                if (entry.status === 'Warning') fill = '#EAA329';
                if (entry.status === 'Critical') fill = '#DC2626';
                return <Cell key={`bar-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RulHistogramChart;
