import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';
import Card from '../common/Card';

const GRADIENTS = {
  Healthy: { from: '#16A34A', to: '#4ADE80', glow: 'rgba(22, 163, 74, 0.4)' },
  Warning: { from: '#D97706', to: '#FBBF24', glow: 'rgba(217, 119, 6, 0.4)' },
  Critical: { from: '#DC2626', to: '#F87171', glow: 'rgba(220, 38, 38, 0.4)' },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const status = data.name;
    const grad = GRADIENTS[status] || { from: '#087F78', to: '#2DD4BF', glow: 'rgba(8, 127, 120, 0.4)' };

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl text-xs shadow-2xl border border-slate-700/80 min-w-44 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: grad.from, boxShadow: `0 0 8px ${grad.glow}` }}
            />
            <span className="font-semibold text-slate-200">{data.name} Fleet</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
            {status === 'Critical' ? 'Urgent' : status === 'Warning' ? 'Attention' : 'Nominal'}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <span className="text-secondary text-[11px]">Unit Count:</span>
          <span className="font-mono text-base font-bold text-white tracking-tight">
            {data.value} <span className="text-xs font-normal text-slate-400">engines</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-3 mt-1">
          <span className="text-secondary text-[11px]">Fleet Share:</span>
          <span className="font-mono text-xs font-semibold text-primary-200">
            {data.payload.percent ? (data.payload.percent * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// Interactive active sector render with slight expansion
const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300 filter drop-shadow-md"
      />
    </g>
  );
};

export const HealthDonutChart = ({ data = [], totalEngines = 0, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = data.map((d) => ({
    ...d,
    percent: totalEngines > 0 ? d.value / totalEngines : 0,
  }));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card
      title="Engine Health Distribution"
      subtitle="Fleet-wide operational status breakdown"
      className={className}
    >
      <div style={{ minHeight: 260 }} className="w-full flex flex-col items-center justify-between">
        <div style={{ height: 210, minHeight: 210 }} className="w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="grad-healthy" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#16A34A" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
                <linearGradient id="grad-warning" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <linearGradient id="grad-critical" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#F87171" />
                </linearGradient>
                <filter id="donut-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
                </filter>
              </defs>

              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                stroke="#FFFFFF"
                strokeWidth={2}
                filter="url(#donut-shadow)"
              >
                {chartData.map((entry) => {
                  let fill = 'url(#grad-healthy)';
                  if (entry.name === 'Warning') fill = 'url(#grad-warning)';
                  if (entry.name === 'Critical') fill = 'url(#grad-critical)';
                  return <Cell key={`cell-${entry.name}`} fill={fill} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Glassmorphic Pedestal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/90 backdrop-blur-xs border border-slate-100 shadow-card flex flex-col items-center justify-center pointer-events-none transition-transform duration-300">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Total Fleet
            </span>
            <span className="text-2xl font-extrabold font-mono text-main tracking-tight leading-none mt-0.5">
              {totalEngines}
            </span>
            <span className="text-[10px] text-secondary font-medium">Engines</span>
          </div>
        </div>

        {/* Custom Interactive Legend with Micro Status Pills */}
        <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-around gap-2 text-xs">
          {chartData.map((entry, idx) => {
            const isHovered = activeIndex === idx;
            const grad = GRADIENTS[entry.name] || { from: '#087F78' };
            return (
              <button
                key={entry.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all ${
                  isHovered
                    ? 'bg-slate-50 border-slate-300 shadow-xs scale-105'
                    : 'bg-transparent border-transparent text-secondary hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: grad.from }}
                />
                <span className="font-semibold text-main">{entry.name}</span>
                <span className="font-mono font-bold text-slate-700">({entry.value})</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {(entry.percent * 100).toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default HealthDonutChart;
