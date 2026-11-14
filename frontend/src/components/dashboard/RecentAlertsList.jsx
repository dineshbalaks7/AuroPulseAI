import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, ChevronRight, Wrench } from 'lucide-react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

export const RecentAlertsList = ({ alerts = [], className = '' }) => {
  return (
    <Card
      title="Active Maintenance Alerts"
      subtitle="Engines requiring immediate or scheduled service"
      action={
        <Link
          to="/alerts"
          className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
        >
          View All Alerts
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      }
      noPadding
      className={className}
    >
      <div className="divide-y divide-surface-border">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-secondary">
            No active maintenance alerts for this fleet.
          </div>
        ) : (
          alerts.map((a) => {
            const isCritical = a.health_status === 'Critical';
            return (
              <div
                key={a.engine_id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isCritical ? 'bg-red-50 text-critical border border-red-200' : 'bg-amber-50 text-warning border border-amber-200'
                    }`}
                  >
                    {isCritical ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-main font-mono">
                        Engine #{a.engine_id}
                      </span>
                      <StatusBadge status={a.health_status} size="sm" />
                    </div>
                    <p className="text-[11px] text-secondary mt-0.5 truncate max-w-xs sm:max-w-md">
                      {a.recommended_action}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-xs font-bold text-main">
                    {a.predicted_rul} cycles
                  </div>
                  <div className="text-[10px] text-secondary">
                    at Cycle #{a.current_cycle}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default RecentAlertsList;
