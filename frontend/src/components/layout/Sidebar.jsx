import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  Gauge,
  Cpu,
  LineChart,
  AlertTriangle,
  Award,
  FileText,
  Info,
  ChevronLeft,
  ChevronRight,
  Plane,
  Layers,
} from 'lucide-react';
import { useDataset } from '../../context/DatasetContext';

const NAV_ITEMS = [
  { name: 'Overview', path: '/', icon: LayoutDashboard },
  { name: 'Dataset Management', path: '/datasets', icon: Database },
  { name: 'Engine Monitoring', path: '/engines', icon: Gauge },
  { name: 'RUL Prediction', path: '/predict', icon: Cpu },
  { name: 'Sensor Analytics', path: '/analytics', icon: LineChart },
  { name: 'Alerts & Maintenance', path: '/alerts', icon: AlertTriangle },
  { name: 'Model Performance', path: '/models', icon: Award },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'About Project', path: '/about', icon: Info },
];

export const Sidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  const { selectedDataset } = useDataset();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-surface-border transition-all duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs shrink-0">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-main tracking-tight flex items-center gap-1.5 truncate">
                  AuroPulse<span className="text-primary font-mono text-xs px-1.5 py-0.5 bg-primary-light rounded">AI</span>
                </span>
                <span className="text-[11px] text-secondary truncate">
                  Monitor. Predict. Prevent.
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-secondary hover:text-main hover:bg-slate-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className={`px-2 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Fleet Operations'}
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-secondary hover:text-main hover:bg-slate-50'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}

                    {/* Tooltip on collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Dataset Indicator Footer */}
        <div className="p-3 border-t border-surface-border bg-slate-50/50">
          <div
            className={`flex items-center gap-2.5 p-2 rounded-lg bg-white border border-surface-border shadow-xs ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-main truncate flex items-center justify-between">
                  <span>Active Model:</span>
                  <span className="font-mono text-primary font-bold">{selectedDataset}</span>
                </div>
                <div className="text-[10px] text-secondary truncate">
                  {selectedDataset === 'FD001' ? 'Single Condition (100u)' : 'Multi Condition (259u)'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
