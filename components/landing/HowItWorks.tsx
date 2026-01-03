
import React from 'react';
import { HOW_IT_WORKS_BUYER, HOW_IT_WORKS_SELLER } from '../../constants.ts';
import { Search, Shield, CreditCard, Rocket, PenTool, Upload, DollarSign } from 'lucide-react';

const iconMap: any = { Search, Shield, CreditCard, Rocket, PenTool, Upload, DollarSign };

const HowItWorks: React.FC = () => {
  return (
    <section className="py-32 bg-void relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-24 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tight mb-6">
            Platform <span className="text-neon-cyan">Dynamics</span>
          </h2>
          <p className="text-ghost text-lg font-light leading-relaxed">
            Standardized protocols for the acquisition and deployment of structural intellectual capital.
          </p>
        </header>

        <div className="space-y-32">
          {/* Buyer Flow */}
          <div className="space-y-12">
            <h3 className="text-xs font-mono font-black text-neon-cyan uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
              <span className="h-px w-12 bg-neon-cyan" /> Acquisition Protocol (Buyers)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {HOW_IT_WORKS_BUYER.map((step, i) => {
                const Icon = iconMap[step.icon];
                return (
                  <div key={i} className="concrete-card p-10 rounded-[2.5rem] bg-black/20 group hover:bg-white/[0.02] transition-all">
                    <div className="text-[40px] font-display font-black text-white/5 mb-6 group-hover:text-neon-cyan/20 transition-colors">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center text-neon-cyan mb-6 border border-neon-cyan/20">
                      <Icon size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{step.title}</h4>
                    <p className="text-sm text-ghost-light font-light leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seller Flow */}
          <div className="space-y-12">
            <h3 className="text-xs font-mono font-black text-neon-purple uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
              <span className="h-px w-12 bg-neon-purple" /> Forge Protocol (Sellers)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {HOW_IT_WORKS_SELLER.map((step, i) => {
                const Icon = iconMap[step.icon];
                return (
                  <div key={i} className="concrete-card p-10 rounded-[2.5rem] bg-black/20 group hover:bg-white/[0.02] transition-all border-white/5">
                    <div className="text-[40px] font-display font-black text-white/5 mb-6 group-hover:text-neon-purple/20 transition-colors">
                      {step.step}
                    </div>
                    <div className="w-12 h-12 bg-neon-purple/10 rounded-xl flex items-center justify-center text-neon-purple mb-6 border border-neon-purple/20">
                      <Icon size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{step.title}</h4>
                    <p className="text-sm text-ghost-light font-light leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
