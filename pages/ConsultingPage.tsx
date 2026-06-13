import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bot, 
  Cpu, 
  Workflow, 
  ArrowLeft, 
  ChevronRight, 
  Zap, 
  Sparkles, 
  FileCheck, 
  Activity, 
  Award, 
  ArrowRight,
  Headphones,
  Clock,
  Globe
} from 'lucide-react';
import { PageView } from '../types.ts';

interface ConsultingPageProps {
  onNavigate: (page: PageView) => void;
}

const consultingPackages = [
  { 
    id: 'S1', 
    title: 'Architecture Audit Session', 
    price: 850, 
    duration: '90 Min', 
    desc: 'Direct logic mapping and safety review of your AI ecosystem with a Senior Architect.' 
  },
  { 
    id: 'S2', 
    title: 'Market Readiness Advisory', 
    price: 1200, 
    duration: '2 Hours', 
    desc: 'Strategic positioning, valuation benchmarking, and acquisition target analysis.' 
  },
  { 
    id: 'S3', 
    title: 'Enterprise White-Glove Setup', 
    price: 5000, 
    duration: 'Project-Based', 
    desc: 'End-to-end implementation of the KONKRED executive stack into your existing node.' 
  },
];

const ConsultingPage: React.FC<ConsultingPageProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'T-Minus Audit Entry',
      subtitle: 'Static Analysis',
      desc: 'Our engineers inject diagnostic probes into your existing LLM architectures to calculate safety, degradation, and edge-case token distribution risks.'
    },
    {
      title: 'Logic Alignment',
      subtitle: 'Prompt Sanitization',
      desc: 'Implementation of the Konkred Audit scoring index. Refactor prompt sequences to eliminate non-deterministic hallucinations.'
    },
    {
      title: 'Arbitra 4 Orchestration',
      subtitle: 'Multi-stage Validation',
      desc: 'Provisioning of a live multi-agent validator net. Agents dynamically cross-examine inputs and syntheses before output execution.'
    },
    {
      title: 'Final Implementation',
      subtitle: 'Production Lift-off',
      desc: 'Production deployment with zero downtime. 100% of pipeline metrics are projected to live executive telemetry HUDs.'
    }
  ];

  return (
    <div className="min-h-screen bg-void text-text-primary pb-24 px-6 md:px-12">

      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-all text-xs font-mono uppercase tracking-widest group"
          id="btn-back-landing-from-advisory"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          SYS_RETURN_HOME
        </button>

        {/* Header Hero */}
        <header className="space-y-4 max-w-3xl">
          <span className="text-[10px] font-mono tracking-[0.3em] text-accent-cyan uppercase bg-accent-cyan/10 px-3 py-1.5 rounded-full border border-accent-cyan/20">
            Premium Consulting Ecosystem
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-display">
            Proprietary Frameworks & Custom Architectures
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed md:text-xl">
            Scale with total logical authority. We provide advanced corporate prompt evaluation, agent orchestration blueprints, and direct white-glove engineering installations.
          </p>
        </header>

        {/* Technical Deep Dive: Proprietary Frameworks Section */}
        <section className="space-y-12" id="consulting-frameworks-section">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
              Proprietary Diagnostic Core
            </h2>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Box 1: Konkred Audit Framework */}
            <div className="bg-surface-1 border border-white/10 rounded-3xl p-8 hover:border-accent-cyan/30 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-neutral-800 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <FileCheck size={160} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent-cyan/10 text-accent-cyan rounded-2xl border border-accent-cyan/20">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Konkred Audit</h3>
                    <span className="text-[10px] font-mono text-accent-cyan tracking-widest uppercase">Valuation & Risk Scoring Framework</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed font-light">
                  Our proprietary evaluation protocol assesses prompt robustness under adversarial stress. We parse semantic vector leaks, payload injection vulnerability parameters, and system instructions consistency, outputting a mathematical readiness score index.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 font-mono">
                  <div>
                    <span className="block text-xs text-text-secondary">Safety Factor</span>
                    <span className="text-lg font-bold text-white">99.9%</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-secondary">Leak Prevention</span>
                    <span className="text-lg font-bold text-white">Military</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-secondary">Evaluation Vectors</span>
                    <span className="text-lg font-bold text-white">14+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Arbitra 4 Framework */}
            <div className="bg-surface-1 border border-white/10 rounded-3xl p-8 hover:border-accent-emerald/30 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-neutral-800 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <Cpu size={160} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent-emerald/10 text-accent-emerald rounded-2xl border border-accent-emerald/20">
                    <Workflow size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Arbitra 4</h3>
                    <span className="text-[10px] font-mono text-accent-emerald tracking-widest uppercase">Multi-Stage LLM Validation Architecture</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed font-light">
                  A multi-layered consensus protocol engineered to validate non-deterministic model outputs. High-value transactions, database operations, or client-facing syntheses are filtered through sequential specialized agent-verifiers to secure state correctness.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 font-mono">
                  <div>
                    <span className="block text-xs text-text-secondary">Validation Latency</span>
                    <span className="text-lg font-bold text-white">~35ms</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-secondary">Consensus Model</span>
                    <span className="text-lg font-bold text-white">Quad-Agent</span>
                  </div>
                  <div>
                    <span className="block text-xs text-text-secondary">Fail-safe Trigger</span>
                    <span className="text-lg font-bold text-white">Deterministic</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Step-by-Step Interactive Timeline / Flowchart */}
        <section className="space-y-12" id="consulting-flowchart-section">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
              Lifecycle Roadmap: Audit to Zero Hallucination
            </h2>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <div className="bg-surface-1 border border-white/10 rounded-3xl p-8 md:p-12 space-y-12">
            {/* Interactive Progress Bar Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-300 relative ${
                    activeStep === index 
                      ? 'bg-accent-cyan/10 border-accent-cyan' 
                      : 'bg-surface-2 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="text-xs font-mono text-text-secondary">STAGE_0{index + 1}</div>
                  <div className="font-bold text-sm text-white font-display mt-1">{step.title}</div>
                  {activeStep === index && (
                    <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3 h-3 bg-accent-cyan rotate-45 transform"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Display active step description */}
            <div className="bg-surface-2 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 animate-in fade-in duration-300">
              <div className="space-y-4 max-w-2xl">
                <span className="text-xs font-mono text-accent-cyan bg-accent-cyan/10 px-2.5 py-1 rounded-sm border border-accent-cyan/10 inline-block uppercase">
                  {steps[activeStep].subtitle}
                </span>
                <h3 className="text-2xl font-bold text-white font-display">{steps[activeStep].title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm font-light">
                  {steps[activeStep].desc}
                </p>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3.5 bg-white text-black font-semibold text-xs font-mono uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all flex items-center gap-2"
                >
                  Initiate This Phase <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Consulting Packages Section */}
        <section className="space-y-12" id="consulting-advisory-packages-section">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
              Retainer Packages
            </h2>
            <div className="flex-1 h-[1px] bg-white/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {consultingPackages.map((service) => (
              <div key={service.id} className="bg-surface-1 border border-white/5 rounded-3xl p-8 flex flex-col hover:border-accent-cyan/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Headphones size={80} className="text-accent-cyan" />
                </div>
                
                <div className="mb-6 flex justify-between items-start relative z-10">
                  <div className="w-12 h-12 bg-accent-cyan/10 border border-accent-cyan/10 rounded-2xl flex items-center justify-center text-accent-cyan">
                    <Zap size={24} />
                  </div>
                  <span className="text-2xl font-black text-white font-mono">${service.price}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 relative z-10">{service.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-1 relative z-10 font-light">{service.desc}</p>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3 text-xs text-text-secondary font-mono uppercase tracking-widest">
                    <Clock size={14} className="text-accent-cyan" /> {service.duration} Session
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary font-mono uppercase tracking-widest">
                    <Globe size={14} className="text-accent-cyan" /> Global Remote Uplink
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate('contact')}
                  className="mt-10 w-full bg-surface-2 border border-white/10 hover:border-accent-cyan text-white hover:text-white font-bold py-4 rounded-xl text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                >
                  INITIALIZE SESSION <ChevronRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ConsultingPage;
