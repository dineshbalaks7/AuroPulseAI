import React from 'react';

export const LoadingSkeleton = ({ variant = 'card', count = 1, className = '' }) => {
  const items = Array.from({ length: count });

  if (variant === 'kpi') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-surface-border p-5 shadow-card animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 bg-slate-200 rounded w-20" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-7 bg-slate-200 rounded w-16 mb-2" />
            <div className="h-2.5 bg-slate-100 rounded w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div
        className={`bg-white rounded-xl border border-surface-border p-5 shadow-card animate-pulse ${className}`}
      >
        <div className="h-4 bg-slate-200 rounded w-40 mb-2" />
        <div className="h-3 bg-slate-100 rounded w-60 mb-6" />
        <div className="h-64 bg-slate-50 rounded-lg flex items-end justify-between p-4 gap-2">
          {Array.from({ length: 12 }).map((_, j) => (
            <div
              key={j}
              className="bg-slate-200 rounded-t w-full"
              style={{ height: `${20 + Math.sin(j) * 50 + 30}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div
        className={`bg-white rounded-xl border border-surface-border overflow-hidden shadow-card animate-pulse ${className}`}
      >
        <div className="p-4 border-b border-surface-border flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-36" />
          <div className="h-4 bg-slate-100 rounded w-20" />
        </div>
        <div className="p-4 space-y-3">
          {items.map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2">
              <div className="h-3.5 bg-slate-200 rounded w-24" />
              <div className="h-3.5 bg-slate-100 rounded w-32" />
              <div className="h-3.5 bg-slate-200 rounded w-20" />
              <div className="h-3.5 bg-slate-100 rounded w-28" />
              <div className="h-6 bg-slate-200 rounded-full w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl border border-surface-border p-5 shadow-card animate-pulse ${className}`}
    >
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
      <div className="h-3 bg-slate-100 rounded w-2/3 mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
