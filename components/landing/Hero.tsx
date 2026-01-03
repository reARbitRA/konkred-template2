
import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { BRAND } from '../../constants.ts';

interface HeroProps {
  onStart: () => void;
  onDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onDemo }) => {
  return (
    <section className="relative pt-32 lg:pt-48 pb-24 overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 z-0 opacity-[0.08] grid-bg pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[150px] -z-10 rounded-full animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-cyan/5 border border-neon-cyan/20 mb-10 animate-fade-in shadow-[0_0_30px_rgba(255,149,0,0.1)]">
          <Sparkles size={14} className="text-neon-cyan" />
          <span className="text-[10px] text-neon-cyan font-black tracking-[0.4em] uppercase font-mono">{BRAND.tagline}</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black font-display tracking-tight mb-8 animate-slide-up leading-[0.9]">
          <span className="text-white drop-shadow-2xl uppercase">Universal</span>
          <br />
          <span className="gradient-text drop-shadow-[0_10px_30px_rgba(255,149,0,0.3)] uppercase">AI Assets</span>
        </h1>

        <p className="text-xl text-ghost-light max-w-2xl mx-auto mb-14 animate-slide-up delay-100 font-light leading-relaxed">
          Deploy the premiere ecosystem for <span className="text-white font-medium italic">Structural AI Capital</span>. Verified methodologies for researchers, engineers, and enterprise teams.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up delay-200 w-full max-w-xl">
          <button onClick={onStart} className="btn-primary flex-1 py-6 flex items-center justify-center gap-4 group uppercase tracking-[0.2em] text-xs font-black shadow-xl shadow-neon-cyan/20 w-full">
            [ INITIATE UPLINK ]
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button onClick={onDemo} className="flex-1 py-6 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs font-bold concrete-card rounded-xl hover:bg-white/5 transition-all w-full border border-white/10">
            <Play size={18} />
            Launch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
