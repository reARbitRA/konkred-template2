
import React from 'react';
import { PLATFORM_STATS } from '../../constants.ts';

const Stats: React.FC = () => {
  return (
    <section className="py-20 border-y border-white/5 bg-black/40 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {PLATFORM_STATS.map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-5xl font-black text-white font-display mb-2 group-hover:text-neon-cyan transition-colors duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {stat.value}
              </div>
              <div className="text-[10px] font-mono text-ghost uppercase tracking-[0.4em] font-bold">
                {stat.label}
              </div>
              <div className="mt-4 h-0.5 w-8 bg-neon-cyan/20 mx-auto group-hover:w-16 transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
