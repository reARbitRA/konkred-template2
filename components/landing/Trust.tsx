
import React from 'react';

const Trust: React.FC = () => {
  return (
    <section className="py-20 border-y border-white/5 bg-void">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="text-left max-w-sm">
          <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest mb-2 block">Enterprise Trust</span>
          <h3 className="text-xl font-bold text-white">Deployed by architectural leads at:</h3>
        </div>
        <div className="flex flex-wrap gap-12 opacity-30 grayscale mix-blend-screen hover:opacity-50 transition-opacity">
           {['ACME_CORP', 'NEURAL_NET_INC', 'GLOBAL_KINETICS', 'VANGUARD_AI', 'OMEGA_LABS'].map((logo, i) => (
             <div key={i} className="text-xl font-display font-black text-white select-none">{logo}</div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
