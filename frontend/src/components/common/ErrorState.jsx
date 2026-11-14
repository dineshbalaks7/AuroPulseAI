import React from 'react';
import { RefreshCw, ServerOff, Settings, Globe } from 'lucide-react';

export const ErrorState = ({
  title = 'API Connection Error',
  message = 'Failed to retrieve telemetry or prediction data from the Python FastAPI backend.',
  onRetry,
  onConfigureApi,
  className = '',
}) => {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl bg-red-50/70 border border-red-200 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-critical mb-3 border border-red-200 shadow-xs">
        <ServerOff className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h4 className="text-sm font-bold text-red-900 mb-1">{title}</h4>
      <p className="text-xs text-red-700 max-w-lg mb-4 leading-relaxed font-mono">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-critical hover:bg-red-700 rounded-lg transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Request</span>
          </button>
        )}

        {onConfigureApi && (
          <button
            onClick={onConfigureApi}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>Configure Backend URL</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
