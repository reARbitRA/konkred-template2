
import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, File, StickyNote, Users } from 'lucide-react';
import FilesSection from '../components/enclave/FilesSection.tsx';
import NotesSection from '../components/enclave/NotesSection.tsx';
import TeamMembersSection from '../components/enclave/TeamMembersSection.tsx';

interface EnclavePageProps {
  onNavigate: (page: PageView) => void;
}

const BuyerDashboard: React.FC<EnclavePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'notes' | 'team'>('files');

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
            {activeTab === 'files' && <FilesSection />}
            {activeTab === 'notes' && <NotesSection />}
            {activeTab === 'team' && <TeamMembersSection />}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
