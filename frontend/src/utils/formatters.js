/**
 * Formatting utilities for NASA C-MAPSS Predictive Maintenance System
 */

export const formatRul = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '—';
  return `${Number(val).toFixed(1)} cycles`;
};

export const formatCycle = (cycle) => {
  if (!cycle && cycle !== 0) return '—';
  return `Cycle #${cycle}`;
};

export const formatNumber = (num, decimals = 2) => {
  if (num === undefined || num === null || isNaN(num)) return '—';
  return Number(num).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const getHealthInfo = (rul, criticalThreshold = 30, warningThreshold = 75) => {
  if (rul === undefined || rul === null || isNaN(rul)) {
    return {
      status: 'Unknown',
      color: '#64748B',
      bgColor: '#F1F5F9',
      borderColor: '#CBD5E1',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      priority: 'Unknown',
    };
  }

  const numRul = Number(rul);
  if (numRul <= criticalThreshold) {
    return {
      status: 'Critical',
      color: '#DC2626',
      bgColor: '#FEE2E2',
      borderColor: '#FCA5A5',
      badgeClass: 'badge-critical',
      priority: 'High Priority',
      action: 'Immediate Maintenance / Overhaul Required',
    };
  } else if (numRul <= warningThreshold) {
    return {
      status: 'Warning',
      color: '#EAA329',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
      badgeClass: 'badge-warning',
      priority: 'Medium Priority',
      action: 'Inspection Recommended in Next Service Window',
    };
  } else {
    return {
      status: 'Healthy',
      color: '#16A34A',
      bgColor: '#DCFCE7',
      borderColor: '#86EFAC',
      badgeClass: 'badge-healthy',
      priority: 'Routine',
      action: 'Operating Within Nominal Parameters',
    };
  }
};

export const getPriorityBadge = (priority) => {
  if (!priority) return 'bg-slate-100 text-slate-700';
  if (priority.toLowerCase().includes('high') || priority.toLowerCase().includes('critical')) {
    return 'bg-red-100 text-red-800 border border-red-200';
  }
  if (priority.toLowerCase().includes('medium') || priority.toLowerCase().includes('warning')) {
    return 'bg-amber-100 text-amber-800 border border-amber-200';
  }
  return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
};
