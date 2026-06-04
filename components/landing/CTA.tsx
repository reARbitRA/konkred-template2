import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useGlobalStats } from '../../hooks/useGlobalStats.ts';

interface CTAProps {
  onJoin: () => void;
}

const CTA: React.FC<CTAProps> = ({ onJoin }) => {
  const { stats, loading } = useGlobalStats();

  return (
    <section className="relative py-40 overflow-hidden bg-black flex items-center justify-center border-t border-white/5">
      {/* Background Animation */}
      <div className="absolute inset-0">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] animate-pulse" />
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <Sparkles size={14} className="text-neon-cyan" />
            <span className="text-[10px] font-mono text-ghost uppercase tracking-widest">
              {loading ? 'CALCULATING ARCHITECTS...' : `Join ${stats?.totalUsers.toLocaleString() || '0'} Architects`}
            </span>
         </div>
         
         <h2 className="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tighter leading-none">
            Ready to <span className="text-neon-cyan">Scale?</span>
         </h2>
         
         <p className="text-xl text-ghost-light max-w-xl mx-auto mb-12 font-light leading-relaxed">
            Stop building from scratch. Acquire verified structural capital and accelerate your execution velocity today.
         </p>

         <button 
           onClick={onJoin}
           className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-mono font-black text-black bg-white rounded-2xl transition-all duration-300 hover:bg-neon-cyan hover:scale-105 hover:shadow-[0_0_40px_rgba(255,149,0,0.4)]"
         >
            <span className="relative flex items-center gap-4 tracking-[0.2em] uppercase text-sm">
               Initialize Uplink <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
         </button>
      </div>
    </section>
  );
};

export default CTA;