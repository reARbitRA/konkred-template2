
import React, { useState } from 'react';
import { Listing, LicenseType } from '../../types.ts';
import { LICENSE_TYPES } from '../../constants.ts';
import { X, CheckCircle, Shield, Zap, Download, Star, Award, Clock, FileText, ChevronRight, Terminal, Activity } from 'lucide-react';
import Badge from '../common/Badge.tsx';
import AppTester from '../common/AppTester.tsx';

interface ListingDetailsProps {
  listing: Listing;
  onClose: () => void;
  onAcquire: (license: LicenseType) => void;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ listing, onClose, onAcquire }) => {
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('personal');
  const [showTester, setShowTester] = useState(false);
  
  const currentLicense = LICENSE_TYPES.find(l => l.id === selectedLicense)!;
  const totalPrice = listing.pricing.amount * currentLicense.multiplier;
  const estimatedCost = Math.round(totalPrice + 18);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto bg-void/95 backdrop-blur-2xl">
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl concrete-card bg-[#08080A] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-ghost hover:text-white p-3 hover:bg-white/5 rounded-full z-20 transition-all">
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* Left Panel: Narrative */}
          <div className="lg:col-span-7 p-12 lg:p-16 space-y-12 border-r border-white/5">
            <header>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="cyan">{listing.type.replace('_', ' ')}</Badge>
                <div className="flex items-center gap-1.5 text-xs text-ghost font-mono">
                  <Star size={14} className="text-neon-gold fill-neon-gold" />
                  <span className="text-white font-bold">{listing.rating}</span>
                  <span>({listing.reviewCount} VERIFIED_REVIEWS)</span>
                </div>
              </div>
              <h2 className="text-5xl font-display font-black text-white mb-6 uppercase tracking-tight leading-none">{listing.title}</h2>
              <p className="text-xl text-ghost-light leading-relaxed font-light">{listing.shortDescription}</p>
            </header>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-neon-green/30 flex items-center justify-center bg-neon-green/5 text-2xl font-black font-mono text-neon-green">
                  {listing.auditScore}
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase text-sm mb-1 flex items-center gap-2">
                    Forge Audit Passed <CheckCircle size={14} className="text-neon-blue" />
                  </h4>
                  <p className="text-xs text-ghost">Verified for zero-hallucination compliance.</p>
                </div>
              </div>
              <button className="text-[10px] font-mono text-neon-cyan font-black uppercase tracking-widest underline decoration-neon-cyan/20">View Report</button>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-[0.4em]">Payload Specification</h3>
              <div className="prose prose-invert max-w-none text-ghost-light leading-relaxed font-light">
                {listing.description || "Detailed technical documentation available upon license uplink. Includes decision trees, JSON logic maps, and deployment guides."}
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                {listing.tags.map(tag => <Badge key={tag} variant="gray">#{tag}</Badge>)}
              </div>
            </div>
          </div>

          {/* Right Panel: Transactional */}
          <div className="lg:col-span-5 p-12 lg:p-16 bg-black/40 flex flex-col justify-between">
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-black text-ghost uppercase tracking-[0.4em]">1. Select License Scope</h3>
                <div className="grid grid-cols-1 gap-3">
                  {LICENSE_TYPES.map(l => (
                    <button 
                      key={l.id} 
                      onClick={() => setSelectedLicense(l.id as LicenseType)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedLicense === l.id ? 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_20px_rgba(255,149,0,0.1)]' : 'border-white/5 bg-void hover:border-white/10'}`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-bold ${selectedLicense === l.id ? 'text-white' : 'text-ghost-light'}`}>{l.name}</span>
                        <span className="text-[10px] font-mono text-ghost bg-white/5 px-1.5 py-0.5 rounded">{l.multiplier}x</span>
                      </div>
                      <p className="text-[11px] text-ghost font-light">{l.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-xs font-mono font-black text-ghost uppercase tracking-[0.4em]">2. Value Allocation</h3>
                 <div className="concrete-card p-6 rounded-2xl bg-black border-white/10 space-y-3">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[10px] font-mono text-ghost uppercase mb-1">Total Settlement</p>
                          <div className="text-4xl font-black text-white font-display">${totalPrice.toLocaleString()}</div>
                       </div>
                       <Badge variant="cyan" className="mb-1">USD Equivalency</Badge>
                    </div>

                    {/* Live Estimated Cost Bar */}
                    <div className="pt-3 border-t border-white/5 space-y-1.5">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-ghost uppercase flex items-center gap-1">
                          <Activity size={10} className="text-neon-cyan" /> Est. Monthly Compute
                        </span>
                        <span className="text-neon-cyan font-bold">~${estimatedCost}/mo</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-cyan" style={{ width: `${Math.min(100, (totalPrice / estimatedCost) * 100)}%` }} />
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-4 pt-8">
               <button onClick={() => onAcquire(selectedLicense)} className="w-full bg-neon-cyan text-black py-5 rounded-2xl font-black tracking-[0.2em] hover:shadow-[0_0_30px_rgba(255,149,0,0.3)] transition-all flex items-center justify-center gap-3 text-sm uppercase">
                  INITIALIZE ACQUISITION <ChevronRight size={18} />
               </button>
               <button 
                  onClick={() => setShowTester(true)} 
                  className="w-full py-4 rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan text-xs font-mono font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
               >
                  <Terminal size={14} /> Quick Test Runtime
               </button>
               <div className="flex items-center justify-center gap-3 opacity-40">
                  <Shield size={14} className="text-neon-green" />
                  <span className="text-[9px] font-mono text-ghost uppercase tracking-[0.2em]">Secure Node Transfer Enabled</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <AppTester 
        listing={listing} 
        isOpen={showTester} 
        onClose={() => setShowTester(false)} 
        onAcquire={() => {
          setShowTester(false);
          onAcquire(selectedLicense);
        }} 
      />
    </div>
  );
};

export default ListingDetails;
