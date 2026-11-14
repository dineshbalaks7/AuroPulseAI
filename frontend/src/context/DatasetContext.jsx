import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkApiHealth } from '../services/api';
import engineService from '../services/engineService';

const DatasetContext = createContext();

export const DatasetProvider = ({ children }) => {
  // Current active dataset: 'FD001' or 'FD002'
  const [selectedDataset, setSelectedDataset] = useState('FD001');
  const [datasetsMetadata, setDatasetsMetadata] = useState([]);
  
  // Application-defined RUL thresholds for health classification
  const [thresholds, setThresholds] = useState({
    critical: 30,
    warning: 75,
  });

  // API connection status
  const [apiHealth, setApiHealth] = useState({
    connected: false,
    status: 'checking',
    models: {},
    latency: 0,
    lastChecked: null,
    error: null,
  });

  // Common notification system
  const [notifications, setNotifications] = useState([]);

  // Check backend health periodically
  const verifyHealth = useCallback(async () => {
    const health = await checkApiHealth();
    setApiHealth({
      ...health,
      lastChecked: new Date(),
    });
  }, []);

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, [verifyHealth]);

  // Load dataset metadata on mount
  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      try {
        const data = await engineService.getDatasets();
        if (isMounted && data?.datasets) {
          setDatasetsMetadata(data.datasets);
        }
      } catch (err) {
        console.warn('Could not load datasets metadata:', err.message);
      }
    };
    fetchMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  // Switch dataset safely: clears stale data and notifies
  const switchDataset = (newDataset) => {
    const ds = newDataset.toUpperCase();
    if (ds === selectedDataset) return;
    if (ds !== 'FD001' && ds !== 'FD002') return;

    setSelectedDataset(ds);
    addNotification({
      type: 'info',
      title: `Switched to Dataset ${ds}`,
      message: `Active model: ${ds === 'FD001' ? 'FD001 Single Condition XGBoost' : 'FD002 Multi-Condition Normalized XGBoost'}. Cache reset.`,
      timestamp: new Date(),
    });
  };

  const addNotification = (item) => {
    const newNote = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      ...item,
    };
    setNotifications((prev) => [newNote, ...prev.slice(0, 19)]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateThresholds = (newThresholds) => {
    setThresholds((prev) => ({
      ...prev,
      ...newThresholds,
    }));
    addNotification({
      type: 'success',
      title: 'Thresholds Updated',
      message: `Critical threshold: ${newThresholds.critical || thresholds.critical} cycles, Warning threshold: ${newThresholds.warning || thresholds.warning} cycles.`,
    });
  };

  return (
    <DatasetContext.Provider
      value={{
        selectedDataset,
        switchDataset,
        datasetsMetadata,
        thresholds,
        updateThresholds,
        apiHealth,
        verifyHealth,
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
};

export default DatasetContext;
