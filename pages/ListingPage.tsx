
import React, { useState } from 'react';
import { Listing, LicenseType, PageView } from '../types.ts';
import { LICENSE_TYPES } from '../constants.ts';
import { ArrowLeft, Star, BarChart3, CheckCircle, Shield, FileText, Download, Share2, AlertCircle, ChevronRight } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import Reviews from '../components/marketplace/Reviews.tsx';

interface ListingPageProps {
  listing: Listing;
  onNavigate: (page: PageView) => void;
  onBuy: (listing: Listing, license: LicenseType) => void;
}

const ListingPage: React.FC<ListingPageProps> = ({ listing, onNavigate, onBuy }) => {
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('personal');
  const [activeTab, setActiveTab] = useState<'details' | 'audit' | 'reviews'>('details');

  const licenseConfig = LICENSE_TYPES.find(l => l.id === selectedLicense) || LICENSE_TYPES[0];
  const finalPrice = Math.round(listing.pricing.amount * licenseConfig.multiplier);

  const getAuditColor = (score: number) => {
    if (score >= 90) return 'text-neon-green';
    if (score >= 75) return 'text-neon-gold';
    return 'text-neon-orange';
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation */}
        <button 
          onClick={() => onNavigate('marketplace')}
          className="flex items-center gap-3 text-ghost hover:text-white transition-colors mb-12 text-[10px] font-mono uppercase tracking-widest group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* LEFT: Content */}
          <div className="lg:col-span-2 space-y-10">
             
             {/* Header */}
             <div>
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="cyan">{listing.type.replace('_', ' ')}</Badge>
                  <div className="flex items-center gap-1.5 text-xs text-ghost font-mono">
                    <Star size={14} className="text-neon-gold fill-neon-gold" />
                    <span className="text-white font-bold">{listing.rating.toFixed(1)}</span>
                    <span>({listing.reviewCount} reviews)</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 uppercase tracking-tight leading-none">
                  {listing.title}
                </h1>
                <p className="text-xl text-ghost-light leading-relaxed font-light">
                  {listing.shortDescription}
                </p>
             </div>

             {/* Audit Score Banner */}
             <div className="concrete-card border-white/10 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-8 bg-black/40">
                <div className="flex items-center gap-6">
                   <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center bg-void-300 ${getAuditColor(listing.auditScore).replace('text-', 'border-')}`}>
                      <span className={`text-3xl font-black font-mono ${getAuditColor(listing.auditScore)}`}>
                        {listing.auditScore}
                      </span>
                   </div>
                   <div>
                      <h3 className="font-bold text-white mb-1 flex items-center gap-2 uppercase tracking-tight">
                        AUDIT Verified
                        <CheckCircle size={16} className="text-neon-blue" />
                      </h3>
                      <p className="text-xs text-ghost font-light">Passes rigorous quality & safety checks.</p>
                   </div>
                </div>
                <button 
                  onClick={() => setActiveTab('audit')}
                  className="text-xs font-mono text-neon-cyan hover:text-white uppercase tracking-widest font-bold underline decoration-neon-cyan/30"
                >
                  View Full Report
                </button>
             </div>

             {/* Tabs */}
             <div className="border-b border-white/10 flex gap-10">
                {['details', 'audit', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-xs font-bold font-mono uppercase tracking-[0.2em] transition-colors border-b-2 ${activeTab === tab ? 'text-white border-neon-cyan' : 'text-ghost hover:text-white border-transparent'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             {/* Tab Content */}
             <div className="min-h-[300px]">
                {activeTab === 'details' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                     <div className="prose prose-invert max-w-none text-ghost-light font-light leading-relaxed">
                        <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs font-mono">Payload Description</h3>
                        <p>{listing.description || listing.shortDescription}</p>
                        <p className="mt-4">This asset includes comprehensive documentation, implementation guides, and raw source files compatible with standard enterprise environments.</p>
                     </div>
                     
                     <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs font-mono">Architecture Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {listing.tags.map(tag => (
                            <Badge key={tag} variant="gray">#{tag}</Badge>
                          ))}
                        </div>
                     </div>
                  </div>
                )}
                
                {activeTab === 'audit' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {['Viability', 'Efficacy', 'Safety', 'Engineering', 'Value'].map((metric, i) => (
                          <div key={metric} className="concrete-card p-6 rounded-2xl border border-white/5">
                             <div className="flex justify-between mb-3">
                               <span className="text-xs text-ghost font-mono uppercase tracking-widest">{metric}</span>
                               <span className="text-xs font-mono text-white font-bold">{90 + i}/100</span>
                             </div>
                             <div className="h-1.5 bg-void-400 rounded-full overflow-hidden">
                               <div className="h-full bg-neon-green shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${90+i}%` }} />
                             </div>
                          </div>
                        ))}
                    </div>
                    <div className="p-6 bg-neon-cyan/5 border border-neon-cyan/20 rounded-2xl flex gap-4">
                       <Shield className="text-neon-cyan flex-shrink-0" />
                       <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white uppercase tracking-tight">Zero-Hallucination Guarantee</h4>
                          <p className="text-xs text-ghost-light leading-relaxed font-light">This asset has been stress-tested against 10,000 adversarial prompts to ensure output stability.</p>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && <Reviews />}
             </div>

          </div>

          {/* RIGHT: Purchasing Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-28 space-y-8">
                
                <div className="concrete-card border-white/10 rounded-[2.5rem] p-8 shadow-2xl bg-[#0a0a0c]">
                   {/* Price Display */}
                   <div className="mb-8">
                      <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-2">Total Price</div>
                      <div className="text-5xl font-black font-display text-white tracking-tight">
                        ${finalPrice}
                      </div>
                   </div>

                   {/* License Selector */}
                   <div className="space-y-3 mb-10">
                      <label className="text-[10px] font-mono font-bold text-ghost uppercase tracking-widest ml-1">Select License</label>
                      {LICENSE_TYPES.map(type => (
                        <div 
                          key={type.id}
                          onClick={() => setSelectedLicense(type.id as LicenseType)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedLicense === type.id ? 'bg-neon-cyan/5 border-neon-cyan/50 shadow-[0_0_15px_rgba(255,149,0,0.1)]' : 'concrete-card border-white/5 hover:border-white/20'}`}
                        >
                           <div className="flex justify-between items-center mb-1">
                             <span className={`text-xs font-bold uppercase tracking-wide ${selectedLicense === type.id ? 'text-neon-cyan' : 'text-white'}`}>
                               {type.name}
                             </span>
                             {type.id !== 'personal' && (
                               <span className="text-[10px] font-mono text-ghost bg-white/5 px-1.5 py-0.5 rounded">
                                 {type.multiplier}x
                               </span>
                             )}
                           </div>
                           <p className="text-[10px] text-ghost leading-snug font-light">
                             {type.description}
                           </p>
                        </div>
                      ))}
                   </div>

                   {/* Actions */}
                   <div className="space-y-4">
                     <button 
                       onClick={() => onBuy(listing, selectedLicense)}
                       className="btn-primary w-full py-5 text-xs font-black tracking-[0.2em] flex items-center justify-center gap-3 uppercase shadow-lg shadow-neon-cyan/20"
                     >
                       <Download size={16} />
                       Initialize Uplink
                     </button>
                     <button className="w-full py-5 text-xs font-bold tracking-[0.2em] uppercase border border-white/10 rounded-xl hover:bg-white/5 transition-all text-white">
                       Preview Data
                     </button>
                   </div>
                   
                   <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-ghost font-mono uppercase tracking-widest">
                     <Shield size={12} className="text-neon-green" />
                     <span>Secure Escrow Settlement</span>
                   </div>
                </div>

                {/* Seller Card */}
                <div className="concrete-card border-white/5 rounded-3xl p-6 flex items-center gap-5 bg-black/40">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {listing.seller.name.substring(0, 2)}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                        {listing.seller.name}
                        {listing.seller.verified && <CheckCircle size={14} className="text-neon-blue" />}
                      </div>
                      <div className="text-[10px] text-ghost mt-1 font-mono uppercase tracking-widest">
                        Member since 2024 • {listing.seller.totalSales || 0}+ Sales
                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListingPage;
