import React from 'react';
import {
  Database,
  Filter,
  LineChart,
  Cpu,
  Award,
  Server,
  LayoutDashboard,
  ArrowRight,
  ArrowDown,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const ProjectWorkflow = () => {
  const stages = [
    {
      number: '01',
      title: 'Data Collection',
      icon: Database,
      tag: 'Raw Ingestion',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      bullets: [
        'NASA C-MAPSS Turbofan benchmark datasets.',
        'FD001 and FD002 space-delimited text archives.',
        'Continuous run-to-failure multivariate time series.',
      ],
    },
    {
      number: '02',
      title: 'Data Preprocessing',
      icon: Filter,
      tag: 'Data Cleansing',
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      bullets: [
        'Assign 26 canonical schema column headers.',
        'Verify zero missing/null values across time series.',
        'Identify & prune invariant constant sensors in FD001.',
        'Structure cycle-indexed engine operational histories.',
      ],
    },
    {
      number: '03',
      title: 'Exploratory Data Analysis',
      icon: LineChart,
      tag: 'Signal Discovery',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      bullets: [
        'Statistical distribution analysis across 21 sensors.',
        'Pearson correlation matrices identifying co-dependent traits.',
        'Clustering of 6 distinct flight regimes in FD002.',
        '10-cycle rolling mean degradation trends.',
      ],
    },
    {
      number: '04',
      title: 'Feature Engineering',
      icon: Layers,
      tag: 'Target Transformation',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      bullets: [
        'Piecewise linear RUL target formulation.',
        'RUL capping at 125 cycles to suppress early-life noise.',
        'Operational setting regime mapping for FD002.',
        'Condition-wise standard deviation Z-score normalization.',
      ],
    },
    {
      number: '05',
      title: 'Model Training',
      icon: Cpu,
      tag: 'Gradient Boosting',
      color: 'text-primary bg-primary-light border-primary-200',
      bullets: [
        'XGBoost Regressor (Extreme Gradient Boosting).',
        'Independent FD001 model: 19 training features.',
        'Independent FD002 model: 24 normalized features.',
        'Hyperparameter optimization (learning rate, depth, trees).',
      ],
    },
    {
      number: '06',
      title: 'Model Evaluation',
      icon: Award,
      tag: 'Rigorous Benchmarking',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      bullets: [
        'Mean Absolute Error (MAE) on holdout test trajectories.',
        'Root Mean Squared Error (RMSE) outlier penalization.',
        'Asymmetrical NASA PHM08 score prioritizing early alarms.',
        'Cross-validated baseline vs. tuned comparisons.',
      ],
    },
    {
      number: '07',
      title: 'Model Deployment',
      icon: Server,
      tag: 'API Serving',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      bullets: [
        'Serialization of model weights (.pkl and .json).',
        'FastAPI high-performance asynchronous REST microservice.',
        'Pydantic request validation and strict schema enforcement.',
        'Low-latency inference execution (~10–30ms response).',
      ],
    },
    {
      number: '08',
      title: 'Frontend Integration',
      icon: LayoutDashboard,
      tag: 'Industrial SaaS UI',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      bullets: [
        'React 19 + Vite 8.3 responsive industrial interface.',
        'Interactive Recharts sensor trajectory visualizations.',
        'Dynamic RUL gauge with customizable thresholds.',
        'Automated PDF & CSV prognostic report generation.',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.number}
              className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between relative group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-extrabold text-slate-400 group-hover:text-primary transition-colors">
                    STAGE {stage.number}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.color}`}>
                    {stage.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${stage.color}`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-sm font-bold text-main tracking-tight">
                    {stage.title}
                  </h4>
                </div>

                {/* Bullets */}
                <ul className="space-y-2 text-xs text-secondary mb-4">
                  {stage.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0 mt-1.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Progress Indicator */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Phase {stage.number} of 08</span>
                {idx < stages.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 hidden lg:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectWorkflow;
