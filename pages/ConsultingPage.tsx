
import React from 'react';
import { Headphones, Globe, Calendar, Zap, MessageSquare, ShieldCheck, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { PageView } from '../types.ts';

const services = [
  { id: 'S1', title: 'Architecture Audit Session', price: 850, duration: '90 Min', desc: 'Direct logic mapping and safety review of your AI ecosystem with a Senior Architect.' },
  { id: 'S2', title: 'Market Readiness Advisory', price: 1200, duration: '2 Hours', desc: 'Strategic positioning, valuation benchmarking, and acquisition target analysis.' },
  { id: 'S3', title: 'Enterprise White-Glove Setup', price: 5000, duration: 'Project-Based', desc: 'End-to-end implementation of the KONKRED executive stack into your existing node.' },
];

const ConsultingPage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  return (
    <div className="p-8 min-h-screen bg-void animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        <header className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="gold">Executive Advisory</Badge>
          <h1 className="text-5xl font-display font-bold text-white">Direct <span className="text-neon-gold">Uplink</span></h1>
          <p className="text-ghost-light text-lg">High-stakes strategic advisory from the architects of the KONKRED operating system.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {services.map((service) => (
             <div key={service.id} className="bg-void-100 border border-white/5 rounded-3xl p-8 flex flex-col hover:border-neon-gold/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Headphones size={80} className="text-neon-gold" />
                </div>
                
                <div className="mb-6 flex justify-between items-start relative z-10">
                   <div className="w-12 h-12 bg-neon-gold/10 rounded-2xl flex items-center justify-center text-neon-gold">
                      <Zap size={24} />
                   </div>
                   <span className="text-2xl font-black text-white font-mono">${service.price}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 relative z-10">{service.title}</h3>
                <p className="text-sm text-ghost-light leading-relaxed mb-8 flex-1 relative z-10 font-light">{service.desc}</p>
                
                <div className="space-y-4 relative z-10">
                   <div className="flex items-center gap-3 text-xs text-ghost font-mono uppercase tracking-widest">
                      <Clock size={14} className="text-neon-gold" /> {service.duration} Session
                   </div>
                   <div className="flex items-center gap-3 text-xs text-ghost font-mono uppercase tracking-widest">
                      <Globe size={14} className="text-neon-gold" /> Global Remote Uplink
                   </div>
                </div>

                <button className="mt-10 w-full bg-neon-gold text-black font-black py-4 rounded-xl text-xs tracking-widest uppercase hover:shadow-neon-gold transition-all flex items-center justify-center gap-2">
                   INITIALIZE SESSION <ChevronRight size={14} />
                </button>
             </div>
           ))}
        </div>

        <div className="bg-void-200 border border-white/10 rounded-3xl p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-white">Trust Protocol</h2>
              <div className="space-y-4">
                 <div className="flex gap-4">
                    <ShieldCheck className="text-neon-green flex-shrink-0" size={24} />
                    <p className="text-sm text-ghost-light font-light"><span className="text-white font-bold">Encrypted Communication:</span> All advisory sessions occur over high-fidelity, secure terminal links.</p>
                 </div>
                 <div className="flex gap-4">
                    <Calendar className="text-neon-blue flex-shrink-0" size={24} />
                    <p className="text-sm text-ghost-light font-light"><span className="text-white font-bold">Guaranteed Allocation:</span> Enterprise tier members receive priority slot assignment within 24 hours.</p>
                 </div>
                 <div className="flex gap-4">
                    <MessageSquare className="text-neon-purple flex-shrink-0" size={24} />
                    <p className="text-sm text-ghost-light font-light"><span className="text-white font-bold">Post-Session Support:</span> Every uplink includes 7 days of direct messaging access for follow-up telemetry.</p>
                 </div>
              </div>
           </div>
           <div className="bg-black/40 border border-white/5 p-8 rounded-2xl text-center space-y-4">
              <p className="text-ghost font-mono text-[10px] uppercase tracking-widest">Network Status</p>
              <div className="text-4xl font-black text-neon-green font-mono">NODE ACTIVE</div>
              <p className="text-xs text-ghost italic">"The latency between strategy and execution is your primary competitor."</p>
              <div className="pt-4 flex justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                 <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse delay-75" />
                 <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse delay-150" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingPage;
