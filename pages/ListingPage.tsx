
import React, { useState } from 'react';
import { Listing, LicenseType, PageView } from '../types.ts';
import { LICENSE_TYPES } from '../constants.ts';
import { ArrowLeft, Star, BarChart3, CheckCircle, Shield, FileText, Download, Share2, AlertCircle } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

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
    <div className="min-h-screen bg-void pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <button 
          onClick={() => onNavigate('marketplace')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: Content */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Header */}
             <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="cyan">{listing.type.replace('_', ' ')}</Badge>
                  <div className="flex items-center gap-1 text-sm text-ghost">
                    <Star size={14} className="text-neon-gold fill-neon-gold" />
                    <span className="text-white font-medium">{listing.rating.toFixed(1)}</span>
                    <span>({listing.reviewCount} reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                  {listing.title}
                </h1>
                <p className="text-lg text-ghost-light leading-relaxed">
                  {listing.shortDescription}
                </p>
             </div>

             {/* Audit Score Banner */}
             <div className="bg-void-200 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-void-300 ${getAuditColor(listing.auditScore).replace('text-', 'border-')}`}>
                      <span className={`text-2xl font-bold font-mono ${getAuditColor(listing.auditScore)}`}>
                        {listing.auditScore}
                      </span>
                   </div>
                   <div>
                      <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                        AUDIT Verified
                        <CheckCircle size={16} className="text-neon-blue" />
                      </h3>
                      <p className="text-sm text-ghost">Passes rigorous quality & safety checks.</p>
                   </div>
                </div>
                <button 
                  onClick={() => setActiveTab('audit')}
                  className="text-sm text-neon-cyan hover:underline font-medium"
                >
                  View Full Report
                </button>
             </div>

             {/* Tabs */}
             <div className="border-b border-white/10 flex gap-8">
                {['details', 'audit', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-sm font-medium transition-colors border-b-2 capitalize ${activeTab === tab ? 'text-white border-neon-cyan' : 'text-ghost hover:text-white border-transparent'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>

             {/* Tab Content */}
             <div className="min-h-[300px]">
                {activeTab === 'details' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                     <div className="prose prose-invert max-w-none">
                        <h3 className="text-white font-bold mb-2">Description</h3>
                        <p className="text-ghost-light leading-relaxed">{listing.description || listing.shortDescription}</p>
                     </div>
                     
                     <div>
                        <h3 className="text-white font-bold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {listing.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-void-200 border border-white/5 rounded-full text-xs text-ghost hover:text-white hover:border-white/20 transition-colors cursor-default">
                              #{tag}
                            </span>
                          ))}
                        </div>
                     </div>
                  </div>
                )}
                
                {activeTab === 'audit' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Viability', 'Efficacy', 'Safety', 'Engineering', 'Value'].map((metric, i) => (
                          <div key={metric} className="bg-void-200 p-4 rounded-lg border border-white/5">
                             <div className="flex justify-between mb-2">
                               <span className="text-sm text-ghost">{metric}</span>
                               <span className="text-sm font-mono text-white font-bold">{90 + i}/100</span>
                             </div>
                             <div className="h-1.5 bg-void-400 rounded-full overflow-hidden">
                               <div className="h-full bg-neon-green" style={{ width: `${90+i}%` }} />
                             </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-12 text-ghost">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Reviews coming soon</p>
                  </div>
                )}
             </div>

          </div>

          {/* RIGHT: Purchasing Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                
                <div className="bg-void-200 border border-white/10 rounded-xl p-6 shadow-xl">
                   {/* Price Display */}
                   <div className="mb-6">
                      <div className="text-sm text-ghost mb-1">Total Price</div>
                      <div className="text-4xl font-bold font-display text-white">
                        ${finalPrice}
                      </div>
                   </div>

                   {/* License Selector */}
                   <div className="space-y-3 mb-8">
                      <label className="text-xs font-mono font-bold text-ghost uppercase tracking-wider">Select License</label>
                      {LICENSE_TYPES.map(type => (
                        <div 
                          key={type.id}
                          onClick={() => setSelectedLicense(type.id as LicenseType)}
                          className={`cursor-pointer p-3 rounded-lg border transition-all ${selectedLicense === type.id ? 'bg-neon-cyan/5 border-neon-cyan/50' : 'bg-void-300 border-white/5 hover:border-white/20'}`}
                        >
                           <div className="flex justify-between items-center mb-1">
                             <span className={`text-sm font-medium ${selectedLicense === type.id ? 'text-neon-cyan' : 'text-white'}`}>
                               {type.name}
                             </span>
                             {type.id !== 'personal' && (
                               <span className="text-xs font-mono text-ghost bg-void-400 px-1.5 py-0.5 rounded">
                                 {type.multiplier}x
                               </span>
                             )}
                           </div>
                           <p className="text-xs text-ghost leading-snug">
                             {type.description}
                           </p>
                        </div>
                      ))}
                   </div>

                   {/* Actions */}
                   <div className="space-y-3">
                     <button 
                       onClick={() => onBuy(listing, selectedLicense)}
                       className="btn-primary w-full py-3.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2"
                     >
                       <Download size={18} />
                       Purchase & Download
                     </button>
                     <button className="btn-secondary w-full py-3.5 text-sm font-medium">
                       Preview / Demo
                     </button>
                   </div>
                   
                   <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ghost">
                     <Shield size={12} className="text-neon-green" />
                     <span>Secure payment via Stripe</span>
                   </div>
                </div>

                {/* Seller Card */}
                <div className="bg-void-200 border border-white/5 rounded-xl p-5 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {listing.seller.name.substring(0, 2)}
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1">
                        {listing.seller.name}
                        {listing.seller.verified && <CheckCircle size={14} className="text-neon-blue" />}
                      </div>
                      <div className="text-xs text-ghost mt-0.5">
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
