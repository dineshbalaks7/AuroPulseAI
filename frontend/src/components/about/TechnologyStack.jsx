import React from 'react';
import {
  Cpu,
  Server,
  Layout,
  Database,
  Code2,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const TechnologyStack = () => {
  const stack = [
    {
      category: 'Machine Learning & Analytics',
      icon: Cpu,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      description: 'Core scientific computing, feature transformation, and gradient boosting inference.',
      techs: [
        { name: 'Python 3.13', role: 'Primary ML runtime & data processing language' },
        { name: 'XGBoost 3.4.1', role: 'Extreme Gradient Boosting decision trees for RUL regression' },
        { name: 'Pandas & NumPy', role: 'Time-series manipulation & vectorized mathematical calculations' },
        { name: 'Scikit-Learn', role: 'Data normalization, train-test splitting, & cross-validation' },
        { name: 'Joblib', role: 'High-efficiency serialization of trained model weights & preprocessing caches' },
      ],
    },
    {
      category: 'Backend Architecture',
      icon: Server,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      description: 'High-performance asynchronous microservice providing RESTful API communication.',
      techs: [
        { name: 'FastAPI', role: 'Modern, high-speed Python web framework for ML microservices' },
        { name: 'Pydantic v2', role: 'Strict data validation, schema enforcement, and type coercion' },
        { name: 'Uvicorn', role: 'Lightning-fast ASGI production web server' },
        { name: 'CORS Middleware', role: 'Cross-Origin Resource Sharing handling for React client connections' },
      ],
    },
    {
      category: 'Frontend Engineering',
      icon: Layout,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: 'Production-grade enterprise single-page application built for aerospace analytics.',
      techs: [
        { name: 'React.js 19', role: 'Component-based reactive user interface' },
        { name: 'Vite 8.3', role: 'Next-generation ES module frontend build tool & hot module replacement' },
        { name: 'Tailwind CSS', role: 'Utility-first styling with custom aerospace industrial tokens' },
        { name: 'Recharts', role: 'Composable SVG charting library for real-time sensor curves & histograms' },
        { name: 'Axios', role: 'Promise-based HTTP client with request/response interceptors' },
        { name: 'Lucide React', role: 'Clean, lightweight SVG iconography' },
        { name: 'jsPDF & AutoTable', role: 'Client-side PDF report compilation & table formatting' },
      ],
    },
    {
      category: 'Prognostic Dataset',
      icon: Database,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Standardized aerospace engine degradation benchmark provided by NASA Ames Research Center.',
      techs: [
        { name: 'NASA C-MAPSS', role: 'Commercial Modular Aero-Propulsion System Simulation benchmark' },
        { name: 'FD001 Sub-Dataset', role: 'Single operating condition (Sea Level) with 100 test trajectories' },
        { name: 'FD002 Sub-Dataset', role: 'Six operating regimes (Altitude/Mach/TRA) with 259 test trajectories' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stack.map((group) => {
        const Icon = group.icon;
        return (
          <div
            key={group.category}
            className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all space-y-4"
          >
            {/* Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-surface-border">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${group.color}`}>
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-main tracking-tight">
                  {group.category}
                </h4>
                <p className="text-[11px] text-secondary mt-0.5">{group.description}</p>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {group.techs.map((t) => (
                <div
                  key={t.name}
                  className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-main block">{t.name}</span>
                    <span className="text-[11px] text-secondary mt-0.5 block leading-normal">{t.role}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TechnologyStack;
