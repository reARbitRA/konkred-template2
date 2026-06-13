
import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, File, StickyNote, Users, Cpu, Download, ExternalLink } from 'lucide-react';
import FilesSection from '../components/enclave/FilesSection.tsx';
import NotesSection from '../components/enclave/NotesSection.tsx';
import TeamMembersSection from '../components/enclave/TeamMembersSection.tsx';
import Badge from '../components/common/Badge.tsx';
import { Listing } from '../types.ts';

interface EnclavePageProps {
  onNavigate: (page: PageView) => void;
  library?: Listing[];
}

const BuyerDashboard: React.FC<EnclavePageProps> = ({ onNavigate, library = [] }) => {
  const [activeTab, setActiveTab] = useState<'protocols' | 'files' | 'notes' | 'team'>('protocols');

  return (
    <div className="p-8 lg:p-12 min-h-screen bg-void pt-28 font-sans">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
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
            <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.4em]">Secure workspace for your structural capital</p>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/5">
            {[
                { id: 'protocols', label: 'Acquired Protocols', icon: Cpu },
                { id: 'files', label: 'My Files', icon: File },
                { id: 'notes', label: 'My Notes', icon: StickyNote },
                { id: 'team', label: 'Team Members', icon: Users },
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
            {activeTab === 'protocols' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                {library.length > 0 ? (
                  library.map(listing => (
                    <div key={listing.id} className="concrete-card p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between group">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-neon-cyan/10 text-neon-cyan rounded-xl">
                            <Cpu size={24} />
                          </div>
                          <Badge variant="cyan">{listing.type.replace('_', ' ')}</Badge>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 uppercase group-hover:text-neon-cyan transition-colors">{listing.title}</h3>
                        <p className="text-xs text-ghost leading-relaxed line-clamp-2">{listing.shortDescription}</p>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                         <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                           <Download size={14} /> DOWNLOAD
                         </button>
                         <button className="flex-1 bg-neon-cyan text-black py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                           <ExternalLink size={14} /> DEPLOY
                         </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-6">
                    <div className="w-16 h-16 bg-void-200 rounded-full flex items-center justify-center mx-auto text-ghost/20">
                      <Cpu size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Enclave Depleted</h3>
                      <p className="text-ghost text-xs max-w-sm mx-auto">No acquired protocols found in this node. Visit the marketplace to provision new assets.</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('marketplace')}
                      className="btn-primary py-3 px-8 text-xs"
                    >
                      EXPLORE MARKETPLACE
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'files' && <FilesSection />}
            {activeTab === 'notes' && <NotesSection />}
            {activeTab === 'team' && <TeamMembersSection />}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;