import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatasetProvider } from './context/DatasetContext';
import Layout from './components/layout/Layout';
import LoadingSkeleton from './components/common/LoadingSkeleton';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy loaded page components for optimal load performance
const Overview = lazy(() => import('./pages/Overview'));
const DatasetManagement = lazy(() => import('./pages/DatasetManagement'));
const EngineMonitoring = lazy(() => import('./pages/EngineMonitoring'));
const RULPrediction = lazy(() => import('./pages/RULPrediction'));
const SensorAnalytics = lazy(() => import('./pages/SensorAnalytics'));
const Alerts = lazy(() => import('./pages/Alerts'));
const ModelPerformance = lazy(() => import('./pages/ModelPerformance'));
const Reports = lazy(() => import('./pages/Reports'));
const AboutProject = lazy(() => import('./pages/AboutProject'));

const PageLoader = () => (
  <div className="p-6 space-y-6">
    <LoadingSkeleton variant="kpi" count={4} />
    <LoadingSkeleton variant="chart" />
  </div>
);

export function App() {
  return (
    <ErrorBoundary>
      <DatasetProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Overview />} />
                <Route path="datasets" element={<DatasetManagement />} />
                <Route path="engines" element={<EngineMonitoring />} />
                <Route path="predict" element={<RULPrediction />} />
                <Route path="analytics" element={<SensorAnalytics />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="models" element={<ModelPerformance />} />
                <Route path="reports" element={<Reports />} />
                <Route path="about" element={<AboutProject />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </DatasetProvider>
    </ErrorBoundary>
  );
}

export default App;
