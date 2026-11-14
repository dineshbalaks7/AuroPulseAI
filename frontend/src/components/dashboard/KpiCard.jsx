import React from 'react';

/**
 * Ultra-Premium KpiCard (Clean, static, high-performance)
 * Features:
 * - Embedded SVG micro-sparkline telemetry trend wave in card corner
 * - Dual-layer border styling & subtle hover lift (-translate-y-0.5)
 * - JetBrains Mono high-contrast numerical metrics with live status indicator
 * - Zero cursor-following animations for maximum readability and speed
 */
export const KpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'text-primary',
  bgColor = 'bg-primary-light',
  borderColor = 'border-primary-100',
  trend,
  trendType = 'neutral', // 'positive' | 'warning' | 'critical' | 'neutral'
  sparklineVariant = 'default', // 'healthy' | 'warning' | 'critical' | 'upward' | 'default'
  className = '',
}) => {
  let strokeHex = '#087F78';
  let isPulsing = false;

  if (color.includes('critical') || color.includes('red')) {
    strokeHex = '#DC2626';
    isPulsing = true;
  } else if (color.includes('warning') || color.includes('amber')) {
    strokeHex = '#EAA329';
  } else if (color.includes('healthy') || color.includes('green') || color.includes('emerald')) {
    strokeHex = '#16A34A';
  } else if (color.includes('blue')) {
    strokeHex = '#2563EB';
  } else if (color.includes('purple')) {
    strokeHex = '#7C3AED';
  }

  // Pre-configured elegant sparkline SVG curves
  const getSparklinePath = () => {
    switch (sparklineVariant) {
      case 'critical':
        return 'M0,15 C20,12 40,25 60,18 C80,10 100,28 120,32 C130,34 140,36 150,38';
      case 'warning':
        return 'M0,18 C25,22 50,14 75,24 C100,16 125,26 150,22';
      case 'healthy':
      case 'upward':
        return 'M0,32 C25,28 50,24 75,18 C100,16 125,12 150,8';
      default:
        return 'M0,24 C20,16 40,28 65,18 C90,12 115,22 135,14 C145,10 150,12 150,12';
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* 1. Top Specular Edge Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent pointer-events-none" />

      {/* 2. Embedded Ambient Micro Sparkline */}
      <div className="absolute bottom-0 right-0 w-36 h-14 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300 overflow-hidden">
        <svg viewBox="0 0 150 40" className="w-full h-full preserve-3d">
          <defs>
            <linearGradient id={`sparkline-grad-${title?.replace(/\s+/g, '') || 'kpi'}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeHex} stopOpacity="0.35" />
              <stop offset="100%" stopColor={strokeHex} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={`${getSparklinePath()} L150,40 L0,40 Z`}
            fill={`url(#sparkline-grad-${title?.replace(/\s+/g, '') || 'kpi'})`}
          />
          <path
            d={getSparklinePath()}
            fill="none"
            stroke={strokeHex}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 3. Header & Icon Row */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          {isPulsing && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider truncate">
            {title}
          </span>
        </div>

        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${bgColor} ${borderColor} ${color} transition-transform duration-200`}
          >
            <Icon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
      </div>

      {/* 4. Numerical Value & Trend Badge */}
      <div className="relative z-10 flex items-baseline gap-2 mb-1.5">
        <span className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight font-mono">
          {value !== undefined && value !== null ? value : '—'}
        </span>
        {trend && (
          <span
            className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
              trendType === 'critical'
                ? 'bg-red-50 text-critical font-mono'
                : trendType === 'warning'
                ? 'bg-amber-50 text-warning font-mono'
                : trendType === 'positive'
                ? 'bg-emerald-50 text-healthy font-mono'
                : 'text-secondary'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {/* 5. Subtitle */}
      {subtitle && (
        <div className="relative z-10 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-secondary truncate">
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
