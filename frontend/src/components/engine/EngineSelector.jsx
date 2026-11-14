import React, { useState } from 'react';
import { Search, Filter, Check } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const EngineSelector = ({
  engines = [],
  selectedEngineId,
  onSelectEngine,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEngines = engines.filter((e) => {
    const matchesSearch =
      searchQuery === '' ||
      e.engine_id.toString().includes(searchQuery) ||
      `Engine #${e.engine_id}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || e.health_status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`flex flex-col bg-white rounded-xl border border-surface-border shadow-card overflow-hidden ${className}`}>
      {/* Header & Filters */}
      <div className="p-3 border-b border-surface-border space-y-2 bg-slate-50/50">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Engine ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-surface-border rounded-lg text-main placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 text-[11px]">
          {['ALL', 'CRITICAL', 'WARNING', 'HEALTHY'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-slate-800 text-white'
                  : 'text-secondary hover:text-main hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {filteredEngines.length === 0 ? (
          <div className="p-4 text-center text-xs text-secondary">
            No engines matching criteria
          </div>
        ) : (
          filteredEngines.map((e) => {
            const isSelected = e.engine_id === selectedEngineId;
            return (
              <button
                key={e.engine_id}
                onClick={() => onSelectEngine(e.engine_id)}
                className={`w-full text-left p-3 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-primary-light/60 border-l-3 border-primary'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-main">
                      Engine #{e.engine_id}
                    </span>
                    <StatusBadge status={e.health_status} size="sm" />
                  </div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    Cycle: {e.current_cycle} • Pred RUL: <span className="font-bold font-mono text-main">{e.predicted_rul}</span>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer count */}
      <div className="p-2 border-t border-surface-border text-center text-[10px] text-secondary bg-slate-50">
        Showing {filteredEngines.length} of {engines.length} engines
      </div>
    </div>
  );
};

export default EngineSelector;
