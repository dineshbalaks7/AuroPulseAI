import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

export const RecentPredictionsTable = ({ predictions = [], className = '' }) => {
  return (
    <Card
      title="Recent Engine Predictions"
      subtitle="Latest Remaining Useful Life model inference results"
      action={
        <Link
          to="/engines"
          className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
        >
          View All Engines
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      }
      noPadding
      className={className}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border bg-slate-50/70 text-[11px] font-semibold text-secondary uppercase tracking-wider">
              <th className="py-3 px-4">Engine ID</th>
              <th className="py-3 px-4">Current Cycle</th>
              <th className="py-3 px-4">Predicted RUL</th>
              <th className="py-3 px-4">Health Status</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border text-xs">
            {predictions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-secondary">
                  No predictions loaded
                </td>
              </tr>
            ) : (
              predictions.map((p) => (
                <tr key={p.engine_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-main">
                    Engine #{p.engine_id}
                  </td>
                  <td className="py-3 px-4 font-mono text-secondary">
                    {p.current_cycle}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-main">
                      {p.predicted_rul}
                    </span>{' '}
                    <span className="text-[11px] text-secondary">cycles</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={p.health_status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-secondary font-medium">
                    {p.priority}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/engines?id=${p.engine_id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover hover:underline"
                    >
                      Inspect
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentPredictionsTable;
