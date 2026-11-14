import React, { useState } from 'react';
import {
  Menu,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Server,
  RefreshCw,
  Layers,
  ChevronDown,
  User,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { useDataset } from '../../context/DatasetContext';
import ApiConfigModal from '../common/ApiConfigModal';

export const Navbar = ({ setMobileOpen }) => {
  const {
    selectedDataset,
    switchDataset,
    apiHealth,
    verifyHealth,
    notifications,
    clearNotifications,
  } = useDataset();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-surface-border sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile trigger & breadcrumb / title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-secondary hover:text-main hover:bg-slate-100"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-secondary font-medium">AuroPulseAI</span>
          <span className="text-slate-300">/</span>
          <span className="text-main font-semibold">Monitor. Predict. Prevent.</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dataset Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDatasetMenu(!showDatasetMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-main transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-primary">{selectedDataset}</span>
            <span className="hidden md:inline text-secondary font-normal text-[11px]">
              {selectedDataset === 'FD001' ? '(Single-Cond)' : '(Multi-Cond)'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-secondary" />
          </button>

          {showDatasetMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-surface-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider border-b border-slate-100">
                Switch NASA C-MAPSS Dataset
              </div>
              <button
                onClick={() => {
                  switchDataset('FD001');
                  setShowDatasetMenu(false);
                }}
                className={`w-full text-left px-3 py-2.5 flex flex-col gap-0.5 hover:bg-slate-50 transition-colors ${
                  selectedDataset === 'FD001' ? 'bg-primary-light/50 border-l-2 border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-main">FD001 — Single Condition</span>
                  {selectedDataset === 'FD001' && (
                    <span className="text-[10px] font-bold text-primary px-1.5 bg-primary-light rounded">Active</span>
                  )}
                </div>
                <span className="text-[11px] text-secondary">
                  100 test engines • Sea level • 14 active sensors
                </span>
              </button>

              <button
                onClick={() => {
                  switchDataset('FD002');
                  setShowDatasetMenu(false);
                }}
                className={`w-full text-left px-3 py-2.5 flex flex-col gap-0.5 hover:bg-slate-50 transition-colors ${
                  selectedDataset === 'FD002' ? 'bg-primary-light/50 border-l-2 border-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-main">FD002 — Multi Condition</span>
                  {selectedDataset === 'FD002' && (
                    <span className="text-[10px] font-bold text-primary px-1.5 bg-primary-light rounded">Active</span>
                  )}
                </div>
                <span className="text-[11px] text-secondary">
                  259 test engines • 6 operating regimes • 21 sensors
                </span>
              </button>
            </div>
          )}
        </div>

        {/* API Connection Indicator */}
        <div
          onClick={() => setShowApiModal(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs cursor-pointer transition-colors shadow-xs ${
            apiHealth.connected
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
          }`}
          title={
            apiHealth.connected
              ? `FastAPI Backend Online (${apiHealth.latency}ms). Click to view / change API endpoint.`
              : 'API Offline. Click to configure live backend endpoint URL.'
          }
        >
          <span
            className={`w-2 h-2 rounded-full ${
              apiHealth.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="font-medium text-[11px] hidden sm:inline">
            {apiHealth.connected ? `FastAPI Live (${apiHealth.latency}ms)` : 'Connect API'}
          </span>
          <RefreshCw className="w-3 h-3 text-secondary opacity-70 hover:opacity-100" />
        </div>

        {/* API Configuration Modal */}
        <ApiConfigModal
          isOpen={showApiModal}
          onClose={() => setShowApiModal(false)}
          onConnected={() => verifyHealth?.()}
        />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-secondary hover:text-main hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-surface-border py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-surface-border flex items-center justify-between">
                <span className="text-xs font-semibold text-main">System Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-secondary">
                    No recent notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                      <div className="font-semibold text-main">{n.title}</div>
                      <div className="text-[11px] text-secondary mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
          <div className="w-8 h-8 rounded-full bg-primary-light border border-primary-200 flex items-center justify-center text-primary font-bold text-xs">
            OP
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-main leading-tight">Fleet Specialist</span>
            <span className="text-[10px] text-secondary">NASA C-MAPSS Ops</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
