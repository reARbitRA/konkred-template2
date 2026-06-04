
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Shield, Upload, DollarSign, CheckCircle, Info, Zap, Box, Layers, Globe } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { Listing } from '../types.ts';

const STEPS = ['Identity', 'Architecture', 'Monetization', 'Verification', 'Deployment'];

const ListingWizard: React.FC<{ onComplete: (listing: Listing) => void; onCancel: () => void }> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'prompt' as const,
    price: 49,
    category: 'legal'
  });
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditScore, setAuditScore] = useState<number | null>(null);

  const runAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAuditScore(Math.floor(Math.random() * 20) + 80);
      setIsAuditing(false);
    }, 2500);
  };

  const handleFinish = () => {
    // FIX: Updated newListing object to match Listing interface including sellerId and seller object
    const newListing: Listing = {
      id: `L-${Date.now()}`,
      sellerId: 'U1',
      seller: { name: 'Ari Miyanji', verified: true, totalSales: 0 },
      title: formData.title || 'Untitled Protocol',
      shortDescription: formData.description || 'No description provided.',
      description: formData.description || 'No description provided.',
      type: formData.type as any,
      category: formData.category,
      pricing: { mode: 'one_time', amount: formData.price, currency: 'USD' },
      delivery: 'api_key',
      auditScore: auditScore || 0,
      rating: 0,
      reviewCount: 0,
      featured: false,
      tags: [formData.category, formData.type],
      salesCount: 0,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onComplete(newListing);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-display font-bold text-white">Protocol Identity</h2>
            <div className="space-y-6">
                <label className="block">
                    <span className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-2 block">Asset Designation (Title)</span>
                    <input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        type="text" placeholder="e.g. Strategic Risk Synthesizer v4" 
                        className="w-full bg-void-200 concrete-card px-6 py-4 text-white outline-none focus:border-neon-cyan transition-all text-lg" 
                    />
                </label>
                <div className="grid grid-cols-2 gap-6">
                    <label className="block">
                        <span className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-2 block">Asset Class</span>
                        <select 
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as any})}
                            className="w-full bg-void-200 concrete-card px-6 py-4 text-white outline-none focus:border-neon-cyan transition-all"
                        >
                            <option value="prompt">Prompt System</option>
                            <option value="agent">Autonomous Agent</option>
                            <option value="dataset">Proprietary Dataset</option>
                            <option value="api">Enterprise API</option>
                        </select>
                    </label>
                    <label className="block">
                        <span className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-2 block">Industry Vertical</span>
                        <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full bg-void-200 concrete-card px-6 py-4 text-white outline-none focus:border-neon-cyan transition-all"
                        >
                            <option value="legal">Legal & Compliance</option>
                            <option value="finance">Finance & VC</option>
                            <option value="health">Healthcare</option>
                            <option value="strategy">Corporate Strategy</option>
                        </select>
                    </label>
                </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-4xl font-display font-bold text-white">Logic Architecture</h2>
            <div className="space-y-6">
                <label className="block">
                    <span className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-2 block">Structural Summary</span>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        rows={6} placeholder="Detailed breakdown of the asset's utility, methodology, and logic structure..." 
                        className="w-full bg-void-200 concrete-card px-6 py-4 text-white outline-none focus:border-neon-cyan transition-all resize-none leading-relaxed" 
                    />
                </label>
                <div className="p-8 concrete-card border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center group hover:border-neon-cyan/50 transition-all">
                    <Upload className="text-ghost group-hover:text-neon-cyan mb-4 transition-colors" size={40} />
                    <p className="text-sm text-white font-bold">Upload Source Payloads</p>
                    <p className="text-xs text-ghost mt-1">JSON, MD, or PDF schema files (Max 50MB)</p>
                </div>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-4xl font-display font-bold text-white">Monetization</h2>
                <div className="concrete-card p-10 rounded-3xl space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-white">Acquisition Value</h3>
                            <p className="text-xs text-ghost">Set the base price for a Personal License.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-void p-4 rounded-2xl border border-white/10">
                            <span className="text-2xl font-black text-neon-cyan">$</span>
                            <input 
                                type="number" 
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                                className="bg-transparent text-3xl font-black text-white outline-none w-32" 
                            />
                        </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between text-ghost">
                        <span className="text-xs font-mono uppercase">Platform Fee (10%)</span>
                        <span className="text-xs font-mono">-${(formData.price * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-white font-bold">
                        <span className="text-xs font-mono uppercase">Expected Payout</span>
                        <span className="text-2xl font-black text-neon-green">${(formData.price * 0.9).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
      case 3:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 text-center">
            <div className="max-w-md mx-auto py-12">
              <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mx-auto mb-8 transition-all duration-1000 ${auditScore ? 'border-neon-green shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'border-white/10'}`}>
                {isAuditing ? (
                  <Zap className="text-neon-cyan animate-pulse" size={50} />
                ) : auditScore ? (
                  <span className="text-5xl font-black text-neon-green font-display">{auditScore}</span>
                ) : (
                  <Shield className="text-ghost opacity-20" size={50} />
                )}
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-3">FORGE VERIFICATION</h2>
              <p className="text-ghost text-sm mb-10 font-light leading-relaxed">
                Autonomous logic audit ensures your protocol is zero-risk, high-efficacy, and safe for enterprise deployment.
              </p>
              
              {!auditScore ? (
                <button 
                  onClick={runAudit}
                  disabled={isAuditing}
                  className="bg-white text-black px-12 py-5 rounded-2xl font-black tracking-widest hover:bg-neon-cyan transition-all flex items-center gap-3 mx-auto shadow-xl"
                >
                  {isAuditing ? 'ANALYZING NEURAL PATHS...' : 'RUN VERIFICATION SEQUENCE'}
                </button>
              ) : (
                <div className="bg-neon-green/5 concrete-card p-8 rounded-3xl text-left animate-in zoom-in-95">
                  <div className="flex items-center gap-3 text-neon-green text-sm font-bold uppercase mb-4">
                    <CheckCircle size={20} /> PROTOCOL VERIFIED BY FORGE AI
                  </div>
                  <ul className="space-y-3 text-[11px] text-ghost font-mono">
                    <li className="flex justify-between"><span>[ PASS ] LOGIC_CONSISTENCY</span> <span className="text-neon-green">OK</span></li>
                    <li className="flex justify-between"><span>[ PASS ] NEURAL_SAFETY_MAP</span> <span className="text-neon-green">OK</span></li>
                    <li className="flex justify-between"><span>[ PASS ] SCHEMA_VALIDATION</span> <span className="text-neon-green">OK</span></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 text-center">
                <div className="w-24 h-24 bg-neon-cyan/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Globe className="text-neon-cyan" size={40} />
                </div>
                <h2 className="text-4xl font-display font-bold text-white">Global Deployment</h2>
                <p className="text-ghost text-lg font-light max-w-lg mx-auto">Your protocol is ready to be published to the KONKRED Network. All licensing and NowPayments settlement modules are active.</p>
                
                <div className="concrete-card p-8 rounded-3xl max-w-md mx-auto text-left space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-ghost text-[10px] font-mono uppercase">Listing Class</span>
                        <span className="text-white font-bold uppercase">{formData.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-ghost text-[10px] font-mono uppercase">Audit Score</span>
                        <span className="text-neon-cyan font-bold">{auditScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-ghost text-[10px] font-mono uppercase">Asset Price</span>
                        <span className="text-white font-bold">${formData.price}</span>
                    </div>
                </div>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col pt-24">
      {/* Step Indicator */}
      <div className="fixed top-24 left-0 right-0 z-30 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-3 group">
              <div className={`w-8 h-8 rounded-xl text-[10px] flex items-center justify-center font-bold font-mono transition-all duration-500 border-2 ${i === currentStep ? 'bg-neon-cyan border-neon-cyan text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]' : i < currentStep ? 'bg-neon-green border-neon-green text-black' : 'concrete-card text-ghost'}`}>
                {i + 1}
              </div>
              <span className={`text-[8px] font-mono uppercase tracking-[0.2em] hidden md:block transition-colors ${i === currentStep ? 'text-white' : 'text-ghost'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full pt-20 pb-40 px-6">
        {renderStep()}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 border-t border-white/5 bg-black/80 backdrop-blur-xl flex justify-between items-center z-40">
        <button onClick={onCancel} className="text-ghost hover:text-white flex items-center gap-3 text-xs uppercase tracking-widest font-mono transition-all">
          <ArrowLeft size={16} /> Discard Draft
        </button>
        
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-10 py-4 border-2 border-white/10 rounded-xl text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-xs font-mono"
            >
              Back
            </button>
          )}
          
          <button 
            disabled={(currentStep === 3 && !auditScore) || isAuditing || (currentStep === 0 && !formData.title)}
            onClick={() => {
              if (currentStep === STEPS.length - 1) handleFinish();
              else setCurrentStep(prev => prev + 1);
            }}
            className="px-12 py-4 bg-neon-cyan text-black rounded-xl font-black uppercase tracking-widest hover:shadow-neon-cyan transition-all flex items-center gap-3 text-xs font-mono disabled:opacity-20 disabled:grayscale"
          >
            {currentStep === STEPS.length - 1 ? 'Deploy to Network' : 'Save & Advance'}
            <ArrowRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ListingWizard;
