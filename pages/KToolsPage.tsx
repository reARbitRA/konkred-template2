import React from 'react';
import { ArrowLeft, Terminal, Shield, Sparkles, Wrench, ArrowUpRight } from 'lucide-react';
import { ToolLibrarySection } from '../components/KonkredSections.tsx';
import { PageView } from '../types.ts';

interface KToolsPageProps {
  onNavigate: (page: PageView) => void;
}

const KToolsPage: React.FC<KToolsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white selection:bg-amber-500 selection:text-black font-sans pb-24 pt-8">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-4 pb-8 border-b-2 border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>RETURN_TO_BASE (LANDING)</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            51 LIVE TOOLS
          </span>
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-4 py-2 bg-amber-500 text-black border-2 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>MARKETPLACE</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Hero Header for K-Tools */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-3">
          <Wrench size={14} className="text-purple-400" />
          <span>ENTERPRISE SUITE // K-TOOLS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white uppercase mb-4">
          K-Tools Catalog
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-sans max-w-3xl leading-relaxed">
          A full-stack archive of 51 enterprise-grade AI tools. Each module is built from battle-tested prompts, wrapped in clean code signatures, and organized for high-speed search and deployment.
        </p>
      </div>

      {/* Render Filterable Tool Library */}
      <ToolLibrarySection />
    </div>
  );
};

export default KToolsPage;
