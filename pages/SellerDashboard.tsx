
import React, { useState } from 'react';
import { PageView, Listing } from '../types.ts';
import { ArrowLeft, DollarSign, Package, TrendingUp, Users, Plus, LayoutDashboard, BarChart3, Settings, Presentation } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import Analytics from '../components/seller/Analytics.tsx';
import MyListings from '../components/seller/MyListings.tsx';
import Payouts from '../components/seller/Payouts.tsx';
import { SlidesConsole } from '../components/seller/SlidesConsole.tsx';

const SellerDashboard: React.FC<{ listings: Listing[]; onNavigate: (page: PageView) => void; onNewListing: () => void }> = ({ listings, onNavigate, onNewListing }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics' | 'slides' | 'payouts'>('inventory');

  return (
    <div className="min-h-screen bg-void pt-28 pb-12 px-12 animate-in fade-in duration-1000">
       <div className="max-w-[1600px] mx-auto">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            RETURN_TO_BASE
          </button>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 pb-8 border-b border-white/5">
             <div className="space-y-2">
                <h1 className="text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">Forge Dashboard</h1>
                <div className="flex items-center gap-6 text-ghost font-mono text-[9px] uppercase tracking-[0.4em] mt-4">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neon-green" /> Node Status: Validator</span>
                    <span className="text-white/10">|</span>
                    <span className="flex items-center gap-2">Network Yield: 8.24%</span>
                    <span className="text-white/10">|</span>
                    <span>Uplink: Secure</span>
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={onNewListing} className="bg-neon-cyan text-black font-black py-4 px-10 rounded-2xl flex items-center gap-3 text-xs uppercase tracking-widest hover:shadow-[0_0_40px_rgba(255,149,0,0.3)] transition-all">
                    <Plus size={18} /> DEPLOY_NEW_PROTOCOL
                </button>
             </div>
          </div>

          {/* Dashboard Navigation */}
          <div className="flex gap-8 mb-12 border-b border-white/5">
             {[
               { id: 'inventory', label: 'My_Inventory', icon: Package },
               { id: 'analytics', label: 'Telemetry_Data', icon: BarChart3 },
               { id: 'slides', label: 'Slides_Enclave', icon: Presentation },
               { id: 'payouts', label: 'Capital_Liquidity', icon: DollarSign },
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`pb-6 text-[10px] font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-3 transition-all relative group ${activeTab === tab.id ? 'text-white' : 'text-ghost hover:text-white'}`}
               >
                  <tab.icon size={14} className={activeTab === tab.id ? 'text-neon-cyan' : ''} />
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-neon-cyan shadow-[0_0_15px_rgba(255,149,0,0.5)]" />}
               </button>
             ))}
          </div>

          {/* View Controller */}
          <div className="space-y-12">
             {activeTab === 'inventory' && <MyListings listings={listings} />}
             {activeTab === 'analytics' && <Analytics listings={listings} />}
             {activeTab === 'slides' && <SlidesConsole listings={listings} />}
             {activeTab === 'payouts' && <Payouts />}
          </div>
       </div>
    </div>
  );
};

export default SellerDashboard;
