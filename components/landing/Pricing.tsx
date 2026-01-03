
import React from 'react';
import { SUBSCRIPTION_PLANS } from '../../constants.ts';
import { Check, ArrowRight } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <section className="py-24 bg-void relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="text-center max-w-3xl mx-auto mb-20">
           <span className="text-[10px] font-mono text-neon-purple uppercase tracking-[0.4em] font-black mb-4 block">Membership Protocols</span>
           <h2 className="text-5xl font-display font-black text-white uppercase tracking-tight mb-6">Scale Your <span className="text-neon-purple">Operations</span></h2>
           <p className="text-ghost text-lg font-light leading-relaxed">
             Flexible access levels for individual architects and enterprise nodes.
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {SUBSCRIPTION_PLANS.map((plan, i) => (
             <div key={plan.id} className={`concrete-card p-10 rounded-[2.5rem] flex flex-col relative group hover:-translate-y-2 transition-transform duration-500 ${plan.id === 'pro' ? 'border-neon-purple shadow-[0_0_40px_rgba(168,85,247,0.15)] bg-black/40' : 'bg-void-200/50 hover:border-white/20'}`}>
                {plan.id === 'pro' && (
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-purple text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-lg border border-neon-purple/50">
                      Recommended
                   </div>
                )}
                
                <div className="mb-8">
                   <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">{plan.name}</h3>
                   <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white font-display">${plan.price}</span>
                      <span className="text-ghost text-sm font-mono">/mo</span>
                   </div>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                   {['Marketplace Access', 'Basic Audits', 'Community Support', plan.id !== 'free' && 'API Key Gen', plan.id === 'enterprise' && 'Dedicated Node'].filter(Boolean).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-ghost-light">
                         <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.id === 'pro' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-white/5 text-ghost'}`}>
                            <Check size={10} />
                         </div>
                         {feat}
                      </div>
                   ))}
                </div>

                <button className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${plan.id === 'pro' ? 'bg-neon-purple text-white hover:shadow-neon-purple/40 hover:shadow-lg' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'}`}>
                   Initialize <ArrowRight size={14} />
                </button>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
