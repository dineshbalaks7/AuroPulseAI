import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  LineChart,
  Server,
  FileText,
  Activity,
  Gauge,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Scale,
  Compass,
  ArrowRight,
  Info,
  Clock,
  Wrench,
  Sliders,
  Zap,
  LayoutDashboard,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Radio,
} from 'lucide-react';
import ProjectWorkflow from '../components/about/ProjectWorkflow';
import SystemArchitecture from '../components/about/SystemArchitecture';
import DatasetComparison from '../components/about/DatasetComparison';
import TechnologyStack from '../components/about/TechnologyStack';
import Card from '../components/common/Card';
import engineService from '../services/engineService';

export const AboutProject = () => {
  const [fd001Metrics, setFd001Metrics] = useState(null);
  const [fd002Metrics, setFd002Metrics] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      try {
        const [m1, m2] = await Promise.all([
          engineService.getModelMetrics('FD001'),
          engineService.getModelMetrics('FD002'),
        ]);
        if (isMounted) {
          setFd001Metrics(m1);
          setFd002Metrics(m2);
        }
      } catch (err) {
        console.warn('Could not load dynamic metrics in About page:', err);
      }
    };
    fetchMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      {/* =========================================================================
          1. HERO SECTION (AVIONICS COMMAND CENTER & TURBOFAN DIGITAL TWIN)
          ========================================================================= */}
      <section className="relative rounded-3xl bg-slate-950 border border-slate-800/80 shadow-2xl overflow-hidden text-white">
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent pointer-events-none" />

        {/* Precision Avionics Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Branding, Pitch, Tagline & Capabilities (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Category / System Status Pill */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                  </span>
                  <span>AI-Powered Predictive Maintenance System</span>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-slate-400">
                  <Radio className="w-3 h-3 text-teal-400" />
                  NASA C-MAPSS Telemetry
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
                  About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-300 font-mono">AuroPulseAI</span>
                </h1>
                <p className="text-base sm:text-lg font-medium text-slate-200 leading-snug">
                  Intelligent Engine Health Monitoring Through Machine Learning.
                </p>
              </div>

              {/* Detailed Lead Description */}
              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal max-w-2xl">
                AuroPulseAI is an enterprise-grade AI predictive maintenance platform that analyzes aircraft turbofan sensor measurements and estimates Remaining Useful Life (RUL) using independently trained XGBoost regression models.
              </p>

              {/* Official Tagline Banner */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-slate-400">
                  Tagline:
                </span>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-teal-500/40 text-teal-300 font-mono text-xs sm:text-sm font-extrabold tracking-wider shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Monitor. Predict. Prevent.</span>
                </div>
              </div>

              {/* 6 Key Architectural Highlights */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2.5">
                  Core Engineering Highlights:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors">
                    <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate font-medium text-[11px] sm:text-xs">NASA C-MAPSS Dataset</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors">
                    <Cpu className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="truncate font-medium text-[11px] sm:text-xs">XGBoost ML</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors">
                    <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate font-medium text-[11px] sm:text-xs">FD001 & FD002 Models</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate font-medium text-[11px] sm:text-xs">RUL Prediction</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors">
                    <Server className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate font-medium text-[11px] sm:text-xs">FastAPI Backend</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors">
                    <Activity className="w-4 h-4 text-teal-300 shrink-0" />
                    <span className="truncate font-medium text-[11px] sm:text-xs">Interactive Dashboard</span>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-98 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-950" />
                  <span>Launch Fleet Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/rul-prediction"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Run RUL Predictor</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Turbofan Video Digital Twin Showcase (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl p-1 bg-gradient-to-b from-teal-500/40 via-slate-800/60 to-slate-900/80 border border-teal-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group">
                
                {/* Glowing Corner Accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-teal-400 rounded-tl-sm pointer-events-none" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-teal-400 rounded-tr-sm pointer-events-none" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-teal-400 rounded-bl-sm pointer-events-none" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-teal-400 rounded-br-sm pointer-events-none" />

                {/* Video Card Container */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-[16/10] sm:aspect-video lg:aspect-[4/3] flex items-center justify-center">
                  
                  {/* The Autoplaying Video */}
                  <video
                    ref={videoRef}
                    src="/hero-engine.mp4"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Avionics Scanline & HUD Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                  {/* Top HUD Overlay: Live Twin Indicator & Quick Controls */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-20">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-teal-500/40 text-[10px] font-mono font-bold text-teal-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      TURBOFAN DIGITAL TWIN
                    </div>

                    {/* Video Player Action Buttons */}
                    <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 p-1 rounded-lg">
                      <button
                        onClick={handleTogglePlay}
                        title={isPlaying ? 'Pause Loop' : 'Resume Loop'}
                        className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={handleToggleMute}
                        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                        className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
                      </button>
                      <button
                        onClick={handleFullscreen}
                        title="Enter Fullscreen"
                        className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Center Play Overlay on Hover/Pause if user pauses */}
                  {!isPlaying && (
                    <div
                      onClick={handleTogglePlay}
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center cursor-pointer z-10"
                    >
                      <div className="w-14 h-14 rounded-full bg-teal-500/20 border border-teal-400 text-teal-300 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Bottom HUD Telemetry Overlay */}
                  <div className="absolute bottom-3 inset-x-3 z-20">
                    <div className="p-2.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800/80 text-[10px] font-mono text-slate-300 space-y-1.5 shadow-xl">
                      <div className="flex items-center justify-between text-slate-400 text-[9px] uppercase tracking-wider border-b border-slate-800 pb-1">
                        <span className="flex items-center gap-1 text-teal-400 font-bold">
                          <Activity className="w-3 h-3" /> STAGE-1 CORE DYNAMICS
                        </span>
                        <span className="text-emerald-400">ONLINE • 21 SENSORS</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
                        <div>
                          <div className="text-[9px] text-slate-400">CORE SPEED</div>
                          <div className="font-bold text-white text-[11px]">9,240 RPM</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-400">EGT TEMP</div>
                          <div className="font-bold text-amber-400 text-[11px]">642.8 °C</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-slate-400">INFERENCE</div>
                          <div className="font-bold text-teal-300 text-[11px]">&lt; 35 ms</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Caption below frame */}
                <div className="pt-2 px-2 pb-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-teal-400" />
                    Turbofan High-Pressure Compressor (HPC)
                  </span>
                  <span className="text-[10px] text-teal-400/90 font-semibold">
                    Simulated Wear Loop
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PROJECT OVERVIEW
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 01 // Foundation
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Understanding AuroPulseAI</h2>
        </div>

        <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-4 text-xs sm:text-sm text-secondary leading-relaxed">
          <p>
            <strong className="text-main">AuroPulseAI</strong> is engineered to transition commercial and defense aviation maintenance from reactive and rigid calendar-based schedules into an intelligent, data-driven prognostic operation. By ingesting high-frequency multivariate telemetry across operating cycles—including altitude, Mach number, throttle resolver angle, compressor temperatures, bypass pressures, and core rotational speeds—the platform estimates exactly how many operational flight cycles remain before an engine reaches its service threshold.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary" />
                FD001 Pipeline
              </div>
              <p className="text-xs text-teal-950 leading-relaxed">
                Represents single operating condition (Sea Level) flight profiles with High Pressure Compressor (HPC) degradation. Telemetry features 14 active sensors with constant invariant variables pruned.
              </p>
            </div>

            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                FD002 Pipeline
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed">
                Represents highly variable flight profiles across 6 operational regimes. Sensor telemetry is condition-wise normalized using regime lookups and standard deviation scaling across all 21 sensors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PROBLEM STATEMENT
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 02 // Industrial Context
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">
            The Challenge Behind Predictive Maintenance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Maintenance Pitfalls */}
          <div className="bg-white rounded-xl border border-red-200 p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2.5 text-red-900 font-bold text-sm pb-2 border-b border-red-100">
              <AlertTriangle className="w-4 h-4 text-critical" />
              <span>Limitations of Traditional Maintenance</span>
            </div>
            <ul className="space-y-2.5 text-xs text-secondary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-critical shrink-0 mt-1.5" />
                <span>
                  <strong className="text-main">Reactive Maintenance Failures:</strong> Running components until breakdown leads to unscheduled aircraft grounding (AOG), passenger delays, and catastrophic turbine failure risks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-critical shrink-0 mt-1.5" />
                <span>
                  <strong className="text-main">Premature Component Retirement:</strong> Fixed-calendar scheduled overhaul discards expensive parts that still possess 20–40% of residual operational lifespan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-critical shrink-0 mt-1.5" />
                <span>
                  <strong className="text-main">Telemetry Overload:</strong> Modern aircraft engines generate gigabytes of sensor readings per flight, overwhelming human operators and manual threshold alarms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-critical shrink-0 mt-1.5" />
                <span>
                  <strong className="text-main">Lack of Actionable RUL Foresight:</strong> Without remaining-life cycle estimations, maintenance logistics teams cannot coordinate parts inventory or overhaul bay scheduling.
                </span>
              </li>
            </ul>
          </div>

          {/* Proposed Solution */}
          <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm pb-2 border-b border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-healthy" />
              <span>The AuroPulseAI Solution</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              AuroPulseAI applies mathematical machine learning regression to multivariate engine sensor measurements and ambient operating conditions. By mapping sensor degradation trajectories to remaining cycles, the platform enables:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 text-emerald-900 font-medium">
                ✓ Continuous health assessment updated with every incoming operational cycle.
              </div>
              <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 text-emerald-900 font-medium">
                ✓ Elimination of premature component swaps through accurate cycle estimation.
              </div>
              <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-100 text-emerald-900 font-medium">
                ✓ Proactive, prioritized alerts classifying fleet units as Critical, Warning, or Nominal.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PROJECT OBJECTIVES
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 03 // Goals & Scope
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Project Objectives</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Predict Aircraft Remaining Useful Life',
              desc: 'Estimate remaining operational cycles for turbofan engines with high precision using gradient boosting.',
              icon: Clock,
              color: 'text-primary bg-primary-light',
            },
            {
              title: 'Analyze Historical Sensor Telemetry',
              desc: 'Process multivariate sensor time series capturing pressure, temperature, and rotational speed degradation.',
              icon: Activity,
              color: 'text-blue-600 bg-blue-50',
            },
            {
              title: 'Identify Degradation Signatures',
              desc: 'Detect High Pressure Compressor (HPC) deterioration patterns manifesting in downstream thermodynamic drift.',
              icon: LineChart,
              color: 'text-indigo-600 bg-indigo-50',
            },
            {
              title: 'Decouple Operating Regimes',
              desc: 'Handle multiple flight envelopes (altitude, Mach, throttle) via condition-wise normalization in FD002.',
              icon: Compass,
              color: 'text-amber-600 bg-amber-50',
            },
            {
              title: 'Train Independent ML Regressors',
              desc: 'Maintain isolated models and feature schemas tailored to single vs. multi-condition operational profiles.',
              icon: Cpu,
              color: 'text-purple-600 bg-purple-50',
            },
            {
              title: 'Interactive Sensor Visualizations',
              desc: 'Provide multi-sensor time-series charts, rolling-average trends, and inter-sensor correlation heatmaps.',
              icon: Layers,
              color: 'text-teal-600 bg-teal-50',
            },
            {
              title: 'Benchmark Offline Performance',
              desc: 'Evaluate models against Mean Absolute Error, Root Mean Squared Error, and the asymmetrical NASA Score.',
              icon: Award,
              color: 'text-cyan-600 bg-cyan-50',
            },
            {
              title: 'Support Maintenance Prioritization',
              desc: 'Rank fleet units by predicted cycle urgency to optimize overhaul scheduling and maintenance windows.',
              icon: Wrench,
              color: 'text-emerald-600 bg-emerald-50',
            },
            {
              title: 'Provide Industrial SaaS Interface',
              desc: 'Deliver a clean, responsive web dashboard with live API connectivity and audit reporting capabilities.',
              icon: LayoutDashboard,
              color: 'text-slate-700 bg-slate-100',
            },
          ].map((obj, i) => {
            const Icon = obj.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-surface-border p-4 shadow-card hover:shadow-card-hover transition-all flex items-start gap-3"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 ${obj.color}`}>
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-main">{obj.title}</h4>
                  <p className="text-[11px] text-secondary mt-1 leading-relaxed">{obj.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          5. DATASET INFORMATION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 04 // Aerospace Benchmark
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">NASA C-MAPSS Dataset</h2>
        </div>
        <DatasetComparison />
      </section>

      {/* =========================================================================
          6. MACHINE LEARNING METHODOLOGY
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 05 // Algorithmic Process
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Machine Learning Workflow</h2>
        </div>
        <ProjectWorkflow />
      </section>

      {/* =========================================================================
          7. REMAINING USEFUL LIFE CALCULATION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 06 // Mathematical Formulation
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Understanding Remaining Useful Life</h2>
        </div>

        <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-5">
          <div className="space-y-2 text-xs sm:text-sm text-secondary leading-relaxed">
            <p>
              In turbofan engine prognostics, <strong>Remaining Useful Life (RUL)</strong> quantifies the number of operational flight cycles an engine can safely continue to execute prior to exceeding safe mechanical operating margins.
            </p>
          </div>

          {/* Mathematical Formulas Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-surface-border space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Basic RUL Target Formulation
              </span>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-sm font-bold text-main text-center shadow-xs">
                RUL = Maximum_Engine_Cycle - Current_Engine_Cycle
              </div>
              <p className="text-[11px] text-secondary leading-relaxed">
                Represents the exact linear difference between the total operational cycles recorded before teardown and the current cycle index.
              </p>
            </div>

            <div className="p-4 bg-primary-light/40 rounded-xl border border-primary-200 space-y-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Piecewise Linear RUL Target Capping
              </span>
              <div className="p-3 bg-white rounded-lg border border-primary-200 font-mono text-sm font-bold text-primary text-center shadow-xs">
                RUL_capped = min(RUL, 125)
              </div>
              <p className="text-[11px] text-secondary leading-relaxed">
                Enforces a maximum regression target threshold of 125 cycles during XGBoost model training.
              </p>
            </div>
          </div>

          {/* Why RUL Capping is Essential */}
          <div className="p-4 bg-slate-50 rounded-xl border border-surface-border space-y-2 text-xs">
            <span className="font-bold text-main block text-sm">
              Why RUL Target Capping is Scientifically Essential:
            </span>
            <ul className="space-y-1.5 text-secondary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>
                  <strong>Suppresses Early-Life Noise:</strong> During the initial 50–150 cycles, an engine operates with negligible wear. Variations in sensors during early life reflect operational noise rather than physical degradation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>
                  <strong>Focuses on Accelerating Degradation:</strong> Capping prevents the regression algorithm from assigning excessive gradient weight to healthy units, focusing loss minimization strictly on the final wear runway.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>
                  <strong>Creates a Controlled Target:</strong> Eliminates unbounded outlier RUL predictions on units that survived unusually long cycles due to favorable manufacturing tolerances.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. XGBOOST MODEL ARCHITECTURE
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 07 // Machine Learning
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Machine Learning Models</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FD001 Card */}
          <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs font-mono">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-main">FD001 XGBoost Model</h4>
                  <span className="text-[10px] text-secondary">Single Operating Regime</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                xgboost_fd001_capped.pkl
              </span>
            </div>

            <ul className="space-y-2 text-xs text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Independent raw sensor feature pipeline (19 features).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Excludes invariant constant sensors (1, 5, 10, 16, 18, 19).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Target capped at 125 cycles with gradient tree depth = 4.</span>
              </li>
            </ul>

            {/* Validation Metrics Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Recorded Validation Performance (Validation Holdout):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">MAE</span>
                  <span className="text-sm font-bold text-main">10.73</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">RMSE</span>
                  <span className="text-sm font-bold text-main">15.86</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">R² Score</span>
                  <span className="text-sm font-bold text-primary">0.8554</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1 leading-normal">
                * Note: Recorded validation benchmark results from offline training notebook. Does not represent guaranteed real-time production margins.
              </p>
            </div>
          </div>

          {/* FD002 Card */}
          <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs font-mono">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-main">FD002 XGBoost Model</h4>
                  <span className="text-[10px] text-secondary">Six Operating Envelopes</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                fd002_xgboost.json
              </span>
            </div>

            <ul className="space-y-2 text-xs text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Condition-wise mean and std normalization across 6 regimes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Utilizes all 21 sensors normalized into 24 model features.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Tuned hyperparameters: depth = 3, estimators = 1,986.</span>
              </li>
            </ul>

            {/* Validation Metrics Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Recorded Evaluation Details (Offline Benchmarking):
              </span>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Uncapped MAE</span>
                  <span className="text-sm font-bold text-main">20.41</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Capped Score</span>
                  <span className="text-sm font-bold text-primary">449.11</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Uncapped Score</span>
                  <span className="text-sm font-bold text-slate-600">5,227.03</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1 leading-normal">
                * Note: Previously recorded evaluation details from model development notebooks. Presented for architectural reference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FD001 VS FD002 COMPARISON
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 08 // Pipeline Isolation
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">FD001 vs FD002 Architectural Separation</h2>
        </div>

        <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-4 text-xs sm:text-sm text-secondary leading-relaxed">
          <p>
            The two datasets simulate fundamentally different aerospace operating realities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-main">FD001 Simplicity:</h4>
              <p className="text-secondary leading-relaxed">
                With sea-level atmospheric pressure and constant flight speed, sensor fluctuations reflect pure component degradation. Because operating conditions never change, invariant sensors can be pruned directly without losing information.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-main">FD002 Operational Complexity:</h4>
              <p className="text-secondary leading-relaxed">
                Operating across 6 flight conditions induces massive shifts in sensor baselines (e.g., LPC temperature varies by over 200°R depending on altitude alone). Without condition-wise normalization, an ML model would confuse altitude changes with severe engine failure.
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-main pt-2">
            Consequently, AuroPulseAI keeps the two pipelines strictly isolated. Switching datasets resets all telemetry caches, preventing any cross-contamination.
          </p>
        </div>
      </section>

      {/* =========================================================================
          10. MODEL EVALUATION
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 09 // Benchmarking Metrics
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">How Model Performance Is Measured</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-main font-bold text-sm">
              <Award className="w-4 h-4 text-primary" />
              <span>MAE (Mean Absolute Error)</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Calculates the average absolute cycle deviation between predicted RUL and ground truth across all holdout evaluation cycles:
            </p>
            <div className="p-2.5 bg-slate-50 rounded font-mono text-xs font-bold text-main text-center">
              MAE = (1 / N) * Σ |y_true - y_pred|
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Provides an intuitive, linear measure of average model cycle accuracy.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-main font-bold text-sm">
              <Scale className="w-4 h-4 text-blue-600" />
              <span>RMSE (Root Mean Squared Error)</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Squares errors before averaging, penalizing large outlier misses much more heavily than minor errors:
            </p>
            <div className="p-2.5 bg-slate-50 rounded font-mono text-xs font-bold text-main text-center">
              RMSE = sqrt((1 / N) * Σ (y_true - y_pred)²)
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Crucial for detecting catastrophic single-engine prediction discrepancies.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-main font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>NASA Asymmetric Scoring</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              Safety-critical PHM08 competition metric penalizing late predictions (overestimating life) exponentially more than early predictions:
            </p>
            <div className="p-2.5 bg-slate-50 rounded font-mono text-[10px] text-main text-center space-y-1">
              <div>d &lt; 0 (Early): S = exp(-d / 13) - 1</div>
              <div>d ≥ 0 (Late):  S = exp(d / 10) - 1</div>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              A late prediction can cause uncontained failure; an early alarm only causes an inspection.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. SYSTEM ARCHITECTURE
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 10 // High-Level Design
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">AuroPulseAI System Architecture</h2>
        </div>
        <SystemArchitecture />
      </section>

      {/* =========================================================================
          12. TECHNOLOGY STACK
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 11 // Engineering Stack
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Technologies Behind AuroPulseAI</h2>
        </div>
        <TechnologyStack />
      </section>

      {/* =========================================================================
          13. APPLICATION FEATURES
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 12 // Platform Capabilities
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">What AuroPulseAI Offers</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Overview Dashboard',
              desc: 'Fleet-wide health donut distribution, RUL histograms, degradation line charts, recent alerts, and real-time operational status.',
              icon: LayoutDashboard,
              link: '/',
            },
            {
              title: 'Dataset Management',
              desc: 'Seamless toggle between FD001 (Single Condition) and FD002 (6 Regimes) with strict cache resetting and isolated ML pipelines.',
              icon: Database,
              link: '/datasets',
            },
            {
              title: 'Engine Monitoring',
              desc: 'Individual engine trajectory inspection, interactive multi-sensor toggling, and cycle-by-cycle minimum/maximum statistics.',
              icon: Gauge,
              link: '/engines',
            },
            {
              title: 'RUL Prediction Engine',
              desc: 'Real-time inference dispatch, interactive speedometer gauge, quick-test healthy/critical presets, and custom telemetry input.',
              icon: Cpu,
              link: '/predict',
            },
            {
              title: 'Sensor Analytics',
              desc: 'Pearson r correlation matrix heatmap, statistical distributions across active sensors, and operating condition frequency analysis.',
              icon: LineChart,
              link: '/analytics',
            },
            {
              title: 'Alerts & Maintenance',
              desc: 'Prioritized maintenance queue (Critical, Warning, Nominal), filterable by engine ID and priority, with direct inspection links.',
              icon: AlertTriangle,
              link: '/alerts',
            },
            {
              title: 'Model Performance',
              desc: 'Offline validation MAE, RMSE, R² scores, tuned hyperparameters, and the asymmetrical NASA safety score comparisons.',
              icon: Award,
              link: '/models',
            },
            {
              title: 'Reports & Audit Center',
              desc: 'Export filtered fleet records as CSV or compile formatted PDF reports with embedded high-resolution EDA figures.',
              icon: FileText,
              link: '/reports',
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Link
                key={i}
                to={feat.link}
                className="bg-white rounded-xl border border-surface-border p-4 shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="text-xs font-bold text-main mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{feat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-secondary leading-relaxed">{feat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          14. EXPECTED BENEFITS
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 13 // Value Proposition
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Why Predictive Maintenance Matters</h2>
        </div>

        <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-main block">Earlier Anomaly Detection</span>
              <p className="text-secondary leading-relaxed">
                Identifies gradual compressor degradation tens of cycles before threshold breach or mechanical alarm trips.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-main block">Optimized Overhaul Planning</span>
              <p className="text-secondary leading-relaxed">
                Enables airlines to order replacement LRUs and allocate hangar bays during scheduled ground windows.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-main block">Reduced Fixed-Schedule Reliance</span>
              <p className="text-secondary leading-relaxed">
                Eliminates premature component teardown, maximizing full economic lifespan without compromising airworthiness.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-main block">Decoupled Operating Regimes</span>
              <p className="text-secondary leading-relaxed">
                Distinguishes between environmental flight variations (altitude, Mach) and genuine internal hardware wear.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-main block">Data-Driven Fleet Prioritization</span>
              <p className="text-secondary leading-relaxed">
                Ranks aircraft in order of remaining cycles so maintenance crews address the most urgent assets first.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-main block">Informed Operational Governance</span>
              <p className="text-secondary leading-relaxed">
                Provides fleet directors with verifiable audit trails, CSV data extracts, and PDF compliance reports.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <strong>Operational Advisory:</strong> While machine learning predictions significantly enhance maintenance visibility, they are designed to support and inform human engineering judgment. Predictions should be confirmed with physical inspection and certified aviation maintenance procedures.
          </div>
        </div>
      </section>

      {/* =========================================================================
          15. PROJECT LIMITATIONS
          ========================================================================= */}
      <section className="space-y-4">
        <div className="pb-2 border-b border-surface-border">
          <span className="text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
            Section 14 // Engineering Rigor
          </span>
          <h2 className="text-xl font-bold text-main tracking-tight">Scope and Limitations</h2>
        </div>

        <div className="bg-white rounded-xl border border-surface-border p-6 shadow-card space-y-4 text-xs text-secondary leading-relaxed">
          <p>
            In accordance with aerospace engineering standards, the operational envelope and inherent boundaries of the system are explicitly documented:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Simulated Benchmark Data
              </div>
              <p>
                Models are trained on synthetic C-MAPSS simulation data. While C-MAPSS is the gold-standard benchmark in prognostics research, deploying on real commercial turbofans requires real-world vibration data and flight recorder integration.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Sensor Fidelity & Noise
              </div>
              <p>
                Inference precision relies upon clean sensor measurements. Sensor bias, drift, or signal dropouts will impact RUL estimates unless filtered by pre-processing sanity checks.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                RUL Is An Estimate, Not A Guarantee
              </div>
              <p>
                A predicted RUL of 15 cycles represents an expected value under normal continuous wear. Sudden foreign object damage (FOD) or thermal shock cannot be anticipated by steady-state regression.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Application Thresholds
              </div>
              <p>
                The health classification boundaries (Critical ≤ 30 cycles, Warning ≤ 75 cycles) are configurable application thresholds, not certified aerospace airworthiness directives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          16. PROJECT INFORMATION FOOTER
          ========================================================================= */}
      <footer className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight block">
                AuroPulseAI
              </span>
              <span className="text-xs text-primary font-mono">
                Monitor. Predict. Prevent.
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400">
            <span className="text-slate-200 font-semibold block">
              AI-Powered Predictive Maintenance System Using XGBoost
            </span>
            <span>Commercial Modular Aero-Propulsion System Simulation (C-MAPSS)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-1">
            <span className="font-semibold text-slate-300 block">Dataset Citation & Reference:</span>
            <p className="text-[11px] leading-relaxed max-w-xl text-slate-400">
              A. Saxena, K. Goebel, D. Simon, and N. Eklund, "Damage Propagation Modeling for Aircraft Engine Run-to-Failure Simulation", Proceedings of the 1st International Conference on Prognostics and Health Management (PHM08), Denver CO, Oct 2008.
            </p>
          </div>

          <a
            href="https://www.nasa.gov/intelligent-systems-division/discovery-and-systems-health/pcoe/pcoe-data-set-repository/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors shrink-0 shadow-xs"
          >
            <span>NASA PCoE Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AboutProject;
