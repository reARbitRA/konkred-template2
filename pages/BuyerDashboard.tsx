
import React, { useState } from 'react';
import { PageView, Listing } from '../types.ts';
import { ShoppingBag, Download, Key, ExternalLink, Search, Zap, Shield, FileJson, ArrowLeft, Heart, Package } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import Wishlist from '../components/buyer/Wishlist.tsx';
import Purchases from '../components/buyer/Purchases.tsx';
import Downloads from '../components/buyer/Downloads.tsx';

interface BuyerDashboardProps {
  onNavigate: (page: PageView) => void;
  library: Listing[];
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate, library }) => {
  const [activeTab, setActiveTab] = useState<'purchases' | 'downloads' | 'wishlist'>('purchases');

  return (
    <div className="p-8 lg:p-12 min-h-screen bg-void pt-28 font-sans">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-5xl font-display font-black text-white mb-2 uppercase tracking-tighter">My Enclave</h1>
            <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.4em]">Uplink Active // Local_License_Archives</p>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('marketplace')} className="btn-primary text-[10px] py-3.5 px-6 font-black uppercase tracking-widest">
                Acquire Assets
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/5">
            {[
                { id: 'purchases', label: 'Transaction Ledger', icon: ShoppingBag },
                { id: 'downloads', label: 'Secure Downloads', icon: Download },
                { id: 'wishlist', label: 'Saved Protocols', icon: Heart },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-ghost hover:text-white'}`}
                >
                    <tab.icon size={14} className={activeTab === tab.id ? 'text-neon-cyan' : ''} />
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan shadow-[0_0_15px_rgba(255,149,0,0.5)]" />}
                </button>
            ))}
        </div>

        <div className="min-h-[400px]">
            {activeTab === 'purchases' && (
                library.length > 0 ? <Purchases /> : <EmptyState icon={ShoppingBag} label="Ledger Empty" />
            )}
            
            {activeTab === 'downloads' && (
                library.length > 0 ? <Downloads /> : <EmptyState icon={Package} label="Vault Empty" />
            )}

            {activeTab === 'wishlist' && <Wishlist />}
        </div>
        
        <footer className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
             <EnclaveMetric label="Logic Integrity" val="98.4%" icon={Shield} color="green" />
             <EnclaveMetric label="Node Stability" val="99.9%" icon={Zap} color="cyan" />
             <EnclaveMetric label="Archived Assets" val={library.length.toString()} icon={FileJson} color="purple" />
        </footer>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, label }: any) => (
    <div className="py-32 text-center concrete-card border-dashed border-white/10 rounded-[3rem] bg-black/10 animate-in zoom-in-95">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon size={40} className="text-ghost opacity-20" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{label}</h3>
        <p className="text-ghost text-sm max-w-xs mx-auto font-light">No records found in local storage. Acquire verified protocols to populate this sector.</p>
    </div>
);

const EnclaveMetric = ({ label, val, icon: Icon, color }: any) => (
    <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-neon-${color}/10 text-neon-${color} border border-neon-${color}/20`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[9px] font-mono text-ghost uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-white font-mono">{val}</p>
        </div>
    </div>
);

export default BuyerDashboard;
