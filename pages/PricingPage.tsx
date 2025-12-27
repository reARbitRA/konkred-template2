import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { Check, Zap, Shield, Globe, Cpu, ArrowRight } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../constants.ts';
import Badge from '../components/common/Badge.tsx';

const PricingPage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const features = {
    free: ['Marketplace Access', 'Basic AI Search', 'Community Support', '1 Audit / Month'],
    pro: ['Advanced Forge Access', 'API Key Generation', 'Priority Support', '10 Audits / Month', 'Seller Dashboard', 'Affiliate Access'],
    enterprise: ['Unlimited Audits', 'White-label Deployment', 'Custom License Engine', '24/7 Priority Support', 'Dedicated Node', 'NowPayments API']
  };

  return (
    <div className="min-h-screen bg-void pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 space-y-4">
          <Badge variant="purple">Membership Protocols</Badge>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white">Scale Your AI <span className="text-neon-cyan">Operations</span></h1>
          <p className="text-ghost-light max-w-2xl mx-auto text-lg">Choose a plan designed for your growth stage. All plans include decentralized crypto settlement.</p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-mono ${billingCycle === 'monthly' ? 'text-white' : 'text-ghost'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-void-200 rounded-full p-1 border border-white/10 flex items-center transition-all"
            >
              <div className={`w-4 h-4 rounded-full bg-neon-cyan transition-all ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-mono ${billingCycle === 'yearly' ? 'text-white' : 'text-ghost'}`}>Yearly <span className="text-neon-green text-[10px] ml-1">(-20%)</span></span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-void-100 border p-8 rounded-3xl flex flex-col transition-all duration-500 hover:scale-[1.02] ${plan.id === 'pro' ? 'border-neon-cyan shadow-[0_0_50px_rgba(255,149,0,0.1)]' : 'border-white/5 hover:border-white/20'}`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-cyan text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(255,149,0,0.5)]">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">${billingCycle === 'monthly' ? plan.price : Math.floor(plan.price * 0.8)}</span>
                  <span className="text-ghost text-sm">/mo</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {(features as any)[plan.id].map((feature: string) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-ghost-light">
                    <Check size={16} className="text-neon-green flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('checkout')}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${plan.id === 'pro' ? 'bg-neon-cyan text-black hover:shadow-neon-cyan' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
              >
                {plan.id === 'free' ? 'Get Started' : 'Initialize Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-20">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={24} />
            </div>
            <h4 className="text-white font-bold">Secure Settlement</h4>
            <p className="text-xs text-ghost leading-relaxed">Payments processed via NowPayments decentralized gateway for maximum privacy and speed.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-neon-purple/10 text-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Cpu size={24} />
            </div>
            <h4 className="text-white font-bold">Priority Forge</h4>
            <p className="text-xs text-ghost leading-relaxed">Higher tier members receive accelerated processing for asset logic audits and market analysis.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-neon-blue/10 text-neon-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe size={24} />
            </div>
            <h4 className="text-white font-bold">Global Payouts</h4>
            <p className="text-xs text-ghost leading-relaxed">Sellers can withdraw earnings instantly to any compatible crypto wallet or global bank node.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;