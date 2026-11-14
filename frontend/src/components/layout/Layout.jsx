import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useDataset } from '../../context/DatasetContext';
import { ServerOff } from 'lucide-react';

export const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { apiHealth, verifyHealth } = useDataset();

  return (
    <div className="min-h-screen bg-surface-muted text-main flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar setMobileOpen={setMobileOpen} />

        {/* Global Offline Banner if FastAPI is down */}
        {!apiHealth.connected && apiHealth.status !== 'checking' && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <ServerOff className="w-4 h-4 shrink-0" />
              <span>
                <strong>FastAPI Backend Offline:</strong> Predictive Maintenance API at{' '}
                <code>http://localhost:8000</code> is currently not reachable. Run{' '}
                <code>uvicorn app.main:app --reload</code> in the terminal.
              </span>
            </div>
            <button
              onClick={verifyHealth}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 rounded text-[11px] font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
