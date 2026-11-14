import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Image as ImageIcon,
  Check,
  CheckSquare,
  Square,
  Maximize2,
  X,
  Filter,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useDataset } from '../context/DatasetContext';
import engineService from '../services/engineService';
import Card from '../components/common/Card';
import StatusBadge from '../components/common/StatusBadge';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export const Reports = () => {
  const { selectedDataset, thresholds } = useDataset();
  const [engines, setEngines] = useState([]);
  const [selectedEngine, setSelectedEngine] = useState('ALL');
  const [reportType, setReportType] = useState('EXECUTIVE_AUDIT');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // EDA and Prediction figures state
  const [figures, setFigures] = useState([]);
  const [selectedFigureCategory, setSelectedFigureCategory] = useState('ALL');
  const [selectedFigureIds, setSelectedFigureIds] = useState(new Set());
  const [previewFigure, setPreviewFigure] = useState(null);

  // Fetch engines and figures catalog
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [engRes, figRes] = await Promise.all([
          engineService.getEngines(
            selectedDataset,
            null,
            thresholds.critical,
            thresholds.warning
          ),
          engineService.getReportFigures(selectedDataset),
        ]);

        if (isMounted) {
          setEngines(engRes.engines || []);
          const fetchedFigs = figRes.figures || [];
          setFigures(fetchedFigs);

          // Select top 3 relevant figures by default for inclusion
          const defaultSelected = new Set(
            fetchedFigs.slice(0, 3).map((f) => f.id)
          );
          setSelectedFigureIds(defaultSelected);
        }
      } catch (err) {
        console.error('Error loading report data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedDataset, thresholds]);

  const filteredEngines =
    selectedEngine === 'ALL'
      ? engines
      : engines.filter((e) => e.engine_id === Number(selectedEngine));

  const filteredFigures = figures.filter((f) => {
    if (selectedFigureCategory === 'ALL') return true;
    if (selectedFigureCategory === 'EDA') return f.category === 'EDA';
    if (selectedFigureCategory === 'PREDICTION') return f.category === 'Prediction';
    if (selectedFigureCategory === 'MODEL') return f.category === 'Model Analysis';
    return true;
  });

  const toggleFigureSelection = (id) => {
    setSelectedFigureIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFigures = () => {
    setSelectedFigureIds(new Set(filteredFigures.map((f) => f.id)));
  };

  const deselectAllFigures = () => {
    setSelectedFigureIds(new Set());
  };

  // Handle PDF Export with embedded figures
  const handleExportPDF = async () => {
    setGenerating(true);
    try {
      const summary = {
        'Dataset Model': selectedDataset,
        'Total Fleet Assessed': `${filteredEngines.length} Units`,
        'Critical Interventions': filteredEngines.filter(
          (e) => e.health_status === 'Critical'
        ).length,
        'Avg Predicted RUL': `${(
          filteredEngines.reduce((acc, e) => acc + e.predicted_rul, 0) /
          (filteredEngines.length || 1)
        ).toFixed(1)} Cycles`,
      };

      const tableHeaders = [
        'Engine ID',
        'Cycles Logged',
        'Predicted RUL',
        'Health Status',
        'Priority Action',
      ];
      const tableData = filteredEngines.slice(0, 40).map((e) => [
        `Engine #${e.engine_id}`,
        `${e.current_cycle} cycles`,
        `${e.predicted_rul} cycles`,
        e.health_status,
        e.recommended_action,
      ]);

      // Attach selected figures
      const figuresToEmbed = figures.filter((f) => selectedFigureIds.has(f.id));

      await exportToPDF({
        title: `${selectedDataset} Turbofan Fleet Prognostics & EDA Audit`,
        subtitle: `Remaining Useful Life evaluation and degradation analysis generated on ${new Date().toLocaleDateString()}`,
        dataset: selectedDataset,
        summary,
        tableHeaders,
        tableData,
        figures: figuresToEmbed,
        filename: `${selectedDataset}_Prognostics_EDA_Report.pdf`,
      });
    } catch (err) {
      alert(`PDF Export failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    const csvData = filteredEngines.map((e) => ({
      Engine_ID: e.engine_id,
      Dataset: e.dataset,
      Current_Cycle: e.current_cycle,
      Predicted_RUL_Cycles: e.predicted_rul,
      Health_Status: e.health_status,
      Priority: e.priority,
      Recommended_Action: e.recommended_action,
    }));
    exportToCSV(csvData, `${selectedDataset}_Fleet_Report.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-2 border-b border-surface-border">
        <h1 className="text-xl font-bold text-main tracking-tight flex items-center gap-2">
          Fleet Prognostics, EDA & Sensor Prediction Reports
          <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-primary-light text-primary">
            {selectedDataset}
          </span>
        </h1>
        <p className="text-xs text-secondary mt-1">
          Export comprehensive industrial engineering reports featuring actual telemetry, sensor predictions, and Exploratory Data Analysis (EDA) visualizations.
        </p>
      </div>

      {/* Configuration Controls */}
      <Card
        title="Report Generation Parameters"
        subtitle="Configure target engines, template structure, and export options"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">
              Active Dataset
            </label>
            <div className="p-2.5 bg-slate-50 border border-surface-border rounded-lg text-xs font-mono font-bold text-main">
              {selectedDataset} ({selectedDataset === 'FD001' ? 'Single Condition' : 'Multi Condition'})
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">
              Engine Scope
            </label>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="w-full text-xs bg-white border border-surface-border rounded-lg p-2.5 text-main font-medium focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Fleet Engines ({engines.length} units)</option>
              {engines.map((e) => (
                <option key={e.engine_id} value={e.engine_id}>
                  Engine #{e.engine_id} ({e.health_status} • RUL {e.predicted_rul}c)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">
              Report Template
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full text-xs bg-white border border-surface-border rounded-lg p-2.5 text-main font-medium focus:ring-1 focus:ring-primary"
            >
              <option value="EXECUTIVE_AUDIT">Comprehensive Prognostics & EDA Audit</option>
              <option value="FLEET_HEALTH">Fleet Health & Telemetry Status</option>
              <option value="MAINTENANCE_SCHEDULE">Maintenance Intervention Queue</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-surface-border">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <span className="font-semibold text-main">{selectedFigureIds.size}</span> EDA &
            prediction figures selected for PDF inclusion
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportPDF}
              disabled={generating || loading || filteredEngines.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {generating ? 'Compiling PDF with Figures...' : 'Download Full PDF Report'}
            </button>

            <button
              onClick={handleExportCSV}
              disabled={loading || filteredEngines.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-surface-border text-main text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Export CSV Data
            </button>
          </div>
        </div>
      </Card>

      {/* EDA & Sensor Predictions Figure Gallery */}
      <Card
        title={`Exploratory Data Analysis (EDA) & Sensor Prediction Figures (${filteredFigures.length} figures)`}
        subtitle="Visualizations extracted directly from the verified C-MAPSS training and inference pipelines"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={selectAllFigures}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Select All
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={deselectAllFigures}
              className="text-xs text-secondary hover:text-main hover:underline"
            >
              Deselect All
            </button>
          </div>
        }
      >
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-surface-border">
          {[
            { label: 'All Figures', value: 'ALL' },
            { label: 'Exploratory Data Analysis (EDA)', value: 'EDA' },
            { label: 'Sensor Predictions & Errors', value: 'PREDICTION' },
            { label: 'Model Architecture & Importance', value: 'MODEL' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedFigureCategory(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedFigureCategory === tab.value
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-secondary hover:bg-slate-200 hover:text-main'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Figures Grid */}
        {filteredFigures.length === 0 ? (
          <div className="p-8 text-center text-xs text-secondary">
            No figures available for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFigures.map((fig) => {
              const isSelected = selectedFigureIds.has(fig.id);
              return (
                <div
                  key={fig.id}
                  className={`group bg-white rounded-xl border overflow-hidden shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between ${
                    isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-surface-border'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-44 bg-slate-50 border-b border-surface-border overflow-hidden cursor-pointer"
                    onClick={() => setPreviewFigure(fig)}
                  >
                    <img
                      src={fig.file}
                      alt={fig.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-slate-900/80 text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                        Click to Zoom
                      </span>
                    </div>
                  </div>

                  {/* Figure Details */}
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-primary font-mono uppercase px-1.5 py-0.5 bg-primary-light rounded">
                        {fig.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {fig.size_kb} KB
                      </span>
                    </div>

                    <h4
                      className="text-xs font-bold text-main line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setPreviewFigure(fig)}
                      title={fig.title}
                    >
                      {fig.title}
                    </h4>

                    <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed" title={fig.desc}>
                      {fig.desc}
                    </p>

                    {/* Inclusion Toggle */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => toggleFigureSelection(fig.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                          isSelected
                            ? 'bg-primary-light text-primary font-semibold'
                            : 'text-secondary hover:text-main bg-slate-50'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        Include in PDF
                      </button>

                      <a
                        href={fig.file}
                        download
                        className="text-slate-400 hover:text-main p-1 transition-colors"
                        title="Download PNG image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Lightbox / High-Res Preview Modal */}
      {previewFigure && (
        <div
          className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewFigure(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary font-mono uppercase">
                  {previewFigure.category} • {previewFigure.dataset}
                </span>
                <h3 className="text-sm font-bold text-main">{previewFigure.title}</h3>
              </div>
              <button
                onClick={() => setPreviewFigure(null)}
                className="p-1.5 rounded-lg text-secondary hover:text-main hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="p-4 bg-slate-50 overflow-auto flex items-center justify-center max-h-[70vh]">
              <img
                src={previewFigure.file}
                alt={previewFigure.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-xs"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-surface-border bg-white flex items-center justify-between">
              <p className="text-xs text-secondary max-w-xl">{previewFigure.desc}</p>
              <a
                href={previewFigure.file}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download High-Res
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Scope Preview */}
      <Card
        title={`Report Scope Engine Telemetry (${filteredEngines.length} units)`}
        subtitle="Audit snapshot of engine records included in tabular sections"
        noPadding
      >
        {loading ? (
          <LoadingSkeleton variant="table" count={5} />
        ) : (
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50 shadow-xs">
                <tr className="border-b border-surface-border text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  <th className="py-2.5 px-4">Engine</th>
                  <th className="py-2.5 px-4">Cycles Logged</th>
                  <th className="py-2.5 px-4">Predicted RUL</th>
                  <th className="py-2.5 px-4">Health Assessment</th>
                  <th className="py-2.5 px-4">Recommended Service Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredEngines.slice(0, 15).map((e) => (
                  <tr key={e.engine_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-main">
                      Engine #{e.engine_id}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-secondary">
                      {e.current_cycle} cycles
                    </td>
                    <td className="py-2.5 px-4 font-mono font-bold text-main">
                      {e.predicted_rul} cycles
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={e.health_status} size="sm" />
                    </td>
                    <td className="py-2.5 px-4 text-secondary text-[11px]">
                      {e.recommended_action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
