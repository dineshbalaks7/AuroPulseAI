import React from 'react';
import { AlertTriangle, RefreshCw, ServerOff } from 'lucide-react';

export const ErrorState = ({
  title = 'API Connection Error',
  message = 'Failed to retrieve telemetry or prediction data from the Python FastAPI backend.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 rounded-xl bg-red-50/70 border border-red-200 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-critical mb-3 border border-red-200">
        <ServerOff className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h4 className="text-sm font-semibold text-red-900 mb-1">{title}</h4>
      <p className="text-xs text-red-700 max-w-lg mb-4 leading-relaxed font-mono">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-critical hover:bg-red-700 rounded-lg transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
