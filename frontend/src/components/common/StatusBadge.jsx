import React from 'react';

export const StatusBadge = ({ status, size = 'md', showDot = true, className = '' }) => {
  const norm = (status || '').toLowerCase();

  let colors = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let label = status || 'Unknown';

  if (norm.includes('healthy') || norm.includes('routine') || norm.includes('nominal')) {
    colors = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
    label = 'Healthy';
  } else if (norm.includes('warning') || norm.includes('medium') || norm.includes('caution')) {
    colors = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
    label = 'Warning';
  } else if (norm.includes('critical') || norm.includes('high') || norm.includes('alert')) {
    colors = 'bg-red-50 text-red-800 border-red-200';
    dotColor = 'bg-red-500';
    label = 'Critical';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  }[size] || 'text-xs px-2.5 py-1 gap-2 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs tracking-tight ${sizeClasses} ${colors} ${className}`}
    >
      {showDot && (
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      {label}
    </span>
  );
};

export default StatusBadge;
