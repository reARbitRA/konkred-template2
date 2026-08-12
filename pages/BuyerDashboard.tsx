
import React, { useState, useMemo } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, File, StickyNote, Users, Cpu, Download, ExternalLink, Star, Shield } from 'lucide-react';
import FilesSection from '../components/enclave/FilesSection.tsx';
import NotesSection from '../components/enclave/NotesSection.tsx';
import TeamMembersSection from '../components/enclave/TeamMembersSection.tsx';
import SmartSorter from '../components/enclave/SmartSorter.tsx';
import Badge from '../components/common/Badge.tsx';
import { Listing } from '../types.ts';

interface EnclavePageProps {
  onNavigate: (page: PageView) => void;
  library?: Listing[];
}

const BuyerDashboard: React.FC<EnclavePageProps> = ({ onNavigate, library = [] }) => {
  const [activeTab, setActiveTab] = useState<'protocols' | 'files' | 'notes' | 'team'>('protocols');
  
  // Smart Sorter States
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [filterHighAudit, setFilterHighAudit] = useState(false);
  const [filterRecent, setFilterRecent] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: 'auditScore' | 'createdAt', direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });

  // Filter and Sort Logic
  const processedLibrary = useMemo(() => {
    let result = [...library];

    // Filter by category
    if (activeCategories.length > 0) {
      result = result.filter(item => activeCategories.includes(item.category));
    }

    // Filter by Audit Score >= 90
    if (filterHighAudit) {
      result = result.filter(item => item.auditScore >= 90);
    }

    // Filter by Recent Deployment (e.g., last 30 days)
    if (filterRecent) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(item => new Date(item.createdAt) >= thirtyDaysAgo);
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (sortConfig.key === 'createdAt') {
        const timeA = new Date(valA).getTime();
        const timeB = new Date(valB).getTime();
        return sortConfig.direction === 'asc' ? timeA - timeB : timeB - timeA;
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }
      
      return 0;
    });

    return result;
  }, [library, activeCategories, sortConfig]);

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
              <>
                {library.length > 0 && (
                  <SmartSorter 
                    listings={library}
                    activeCategories={activeCategories}
                    setActiveCategories={setActiveCategories}
                    sortConfig={sortConfig}
                    setSortConfig={setSortConfig}
                    filterHighAudit={filterHighAudit}
                    setFilterHighAudit={setFilterHighAudit}
                    filterRecent={filterRecent}
                    setFilterRecent={setFilterRecent}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4">
                  {processedLibrary.length > 0 ? (
                    processedLibrary.map(listing => (
                      <div key={listing.id} className="concrete-card p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between group">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-neon-cyan/10 text-neon-cyan rounded-xl">
                              <Cpu size={24} />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="cyan">{listing.type.replace('_', ' ')}</Badge>
                              <div className="flex items-center gap-1.5 text-[9px] font-mono text-neon-cyan font-bold bg-neon-cyan/5 px-2 py-0.5 rounded-full border border-neon-cyan/10">
                                <Shield size={10} /> {listing.auditScore}PTS
                              </div>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2 uppercase group-hover:text-neon-cyan transition-colors line-clamp-1">{listing.title}</h3>
                          <p className="text-xs text-ghost leading-relaxed line-clamp-2 mb-4">{listing.shortDescription}</p>
                          
                          <div className="flex items-center justify-between text-[8px] font-mono text-ghost/40 uppercase tracking-widest pt-4 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                              <Star size={10} className="text-yellow-500/50" /> {listing.rating} ({listing.reviewCount})
                            </div>
                            <span>CAT: {listing.category}</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-white/5 flex gap-2">
                           <button 
                             onClick={() => {
                               const blob = new Blob([JSON.stringify(listing, null, 2)], { type: 'application/json' });
                               const url = URL.createObjectURL(blob);
                               const a = document.createElement('a');
                               a.href = url;
                               a.download = `${listing.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_protocol.json`;
                               a.click();
                               URL.revokeObjectURL(url);
                             }}
                             className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl text-[9px] font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                           >
                             <Download size={12} /> DOWNLOAD
                           </button>
                           <button 
                             onClick={() => onNavigate('fullkonk')}
                             className="flex-1 bg-neon-cyan text-black py-2.5 rounded-xl text-[9px] font-mono font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                           >
                             <ExternalLink size={12} /> DEPLOY
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
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">No Matching Protocols</h3>
                        <p className="text-ghost text-xs max-w-sm mx-auto">No acquired assets match your current filters. Try resetting your search parameters.</p>
                      </div>
                      <button 
                        onClick={() => { 
                          setActiveCategories([]); 
                          setFilterHighAudit(false);
                          setFilterRecent(false);
                          setSortConfig({ key: 'createdAt', direction: 'desc' }); 
                        }}
                        className="btn-primary py-3 px-8 text-xs"
                      >
                        RESET FILTERS
                      </button>
                    </div>
                  )}
                  {library.length === 0 && (
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
              </>
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