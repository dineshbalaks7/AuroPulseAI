import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Gauge,
  Activity,
  Layers,
  Clock,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import engineService from '../services/engineService';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import EngineSelector from '../components/engine/EngineSelector';
import SensorReadingsGrid from '../components/engine/SensorReadingsGrid';
import SensorLineChart from '../components/charts/SensorLineChart';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

export const EngineMonitoring = () => {
  const { selectedDataset, thresholds } = useDataset();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramId = searchParams.get('id');

  const [engines, setEngines] = useState([]);
  const [selectedEngineId, setSelectedEngineId] = useState(paramId ? Number(paramId) : null);
  const [engineDetails, setEngineDetails] = useState(null);
  const [sensorMetadata, setSensorMetadata] = useState({});
  const [activeChartSensors, setActiveChartSensors] = useState(['sensor_2', 'sensor_3', 'sensor_4', 'sensor_7']);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  // Load engines list and sensor metadata
  useEffect(() => {
    let isMounted = true;
    const fetchEnginesAndMeta = async () => {
      setLoadingList(true);
      setError(null);
      try {
        const [engRes, metaRes] = await Promise.all([
          engineService.getEngines(selectedDataset, null, thresholds.critical, thresholds.warning),
          engineService.getSensorMetadata(),
        ]);

        if (isMounted) {
          setEngines(engRes.engines || []);
          setSensorMetadata(metaRes || {});

          // Default selected engine
          const defaultId = paramId ? Number(paramId) : engRes.engines?.[0]?.engine_id || 1;
          setSelectedEngineId(defaultId);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load engine roster.');
      } finally {
        if (isMounted) setLoadingList(false);
      }
    };

    fetchEnginesAndMeta();
    return () => {
      isMounted = false;
    };
  }, [selectedDataset, thresholds]);

  // Load specific engine telemetry when selectedEngineId changes
  useEffect(() => {
    if (!selectedEngineId) return;

    let isMounted = true;
    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const details = await engineService.getEngineSensors(selectedDataset, selectedEngineId);
        if (isMounted) {
          setEngineDetails(details);
          // Set chart sensors depending on dataset
          if (selectedDataset === 'FD001') {
            setActiveChartSensors(['sensor_2', 'sensor_3', 'sensor_4', 'sensor_7']);
          } else {
            setActiveChartSensors(['sensor_2', 'sensor_3', 'sensor_4', 'sensor_11']);
          }
        }
      } catch (err) {
        if (isMounted) console.error('Error fetching engine details:', err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedDataset, selectedEngineId]);

  const handleSelectEngine = (id) => {
    setSelectedEngineId(id);
    setSearchParams({ id });
  };

  const toggleChartSensor = (sensorKey) => {
    setActiveChartSensors((prev) =>
      prev.includes(sensorKey)
        ? prev.length > 1
          ? prev.filter((s) => s !== sensorKey)
          : prev
        : [...prev, sensorKey]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h1 className="text-xl font-bold text-main tracking-tight flex items-center gap-2">
            Engine Telemetry & Health Monitoring
            <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-primary-light text-primary">
              {selectedDataset}
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Real-time inspection of individual aircraft turbofan trajectories, degradation profiles, and sensor signals.
          </p>
        </div>
      </div>

      {error && <ErrorState message={error} />}

      {/* Main Grid: Sidebar Roster + Engine Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Engine List Selector */}
        <div className="lg:col-span-1">
          {loadingList ? (
            <LoadingSkeleton variant="table" count={6} />
          ) : (
            <EngineSelector
              engines={engines}
              selectedEngineId={selectedEngineId}
              onSelectEngine={handleSelectEngine}
            />
          )}
        </div>

        {/* Right Column: Engine Details */}
        <div className="lg:col-span-3 space-y-6">
          {loadingDetails && !engineDetails && (
            <div className="space-y-6">
              <LoadingSkeleton variant="kpi" count={3} />
              <LoadingSkeleton variant="chart" />
              <LoadingSkeleton variant="card" />
            </div>
          )}

          {!loadingDetails && engineDetails && (
            <>
              {/* Engine Status Banner */}
              <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center font-mono font-bold text-lg border border-primary-200">
                    #{engineDetails.engine_id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base font-bold text-main">
                        Turbofan Engine #{engineDetails.engine_id}
                      </h2>
                      <StatusBadge status={engineDetails.health_status} size="md" />
                    </div>
                    <p className="text-xs text-secondary mt-0.5">
                      {engineDetails.recommended_action}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Operating Life</span>
                    <span className="font-mono text-sm font-bold text-main">
                      {engineDetails.total_cycles} cycles recorded
                    </span>
                  </div>
                  <div className="text-right pl-6 border-l border-surface-border">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Predicted RUL</span>
                    <span className="font-mono text-lg font-extrabold text-primary">
                      {engineDetails.predicted_rul} cycles
                    </span>
                  </div>
                </div>
              </div>

              {/* Sensor Chart Card */}
              <Card
                title={`Sensor Telemetry Trajectory (Engine #${engineDetails.engine_id})`}
                subtitle="Historical sensor readings over operating cycles"
                action={
                  <div className="flex flex-wrap items-center gap-1">
                    {engineDetails.active_sensors.slice(0, 8).map((s) => {
                      const isActive = activeChartSensors.includes(s);
                      const meta = sensorMetadata[s] || {};
                      const label = meta.name ? `${s} (${meta.name})` : s;
                      return (
                        <button
                          key={s}
                          onClick={() => toggleChartSensor(s)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                            isActive
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-white text-secondary border-surface-border hover:bg-slate-50'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                }
              >
                <SensorLineChart
                  data={engineDetails.trajectory}
                  selectedSensors={activeChartSensors}
                  sensorMetadata={sensorMetadata}
                  height={340}
                />
              </Card>

              {/* Degradation Trend Explanation Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-surface-border text-xs">
                <span className="font-bold text-main block mb-1">
                  Degradation Pattern Analysis:
                </span>
                <p className="text-secondary leading-relaxed">
                  As the High Pressure Compressor (HPC) deteriorates over successive operating cycles, downstream temperatures (T24, T30, T50) and static pressures (Ps30) exhibit progressive upward drift to maintain equivalent thrust output. These trends reflect continuous thermodynamic stress rather than sudden mechanical failure thresholds.
                </p>
              </div>

              {/* Sensor Statistics Grid */}
              <Card
                title="Telemetry Snapshot & Dynamic Statistics"
                subtitle="Cycle minimums, maximums, and latest readings across active sensor suite"
              >
                <SensorReadingsGrid
                  sensorStats={engineDetails.sensor_stats}
                  activeSensors={engineDetails.active_sensors}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineMonitoring;
