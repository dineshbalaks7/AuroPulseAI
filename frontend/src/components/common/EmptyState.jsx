import React from 'react';
import { Database, AlertCircle, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Database,
  title = 'No Data Available',
  description = 'No records were returned from the backend service for the selected query or filter criteria.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center bg-white rounded-xl border border-surface-border ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-surface-border flex items-center justify-center text-secondary mb-4 shadow-xs">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h4 className="text-sm font-semibold text-main mb-1.5">{title}</h4>
      <p className="text-xs text-secondary max-w-md mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-primary bg-primary-light hover:bg-primary-100 rounded-lg transition-colors border border-primary-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
