import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { Shield, Zap, Layers, Terminal, ArrowLeft, Cpu, Sparkles, FileText, Database, ShieldCheck } from 'lucide-react';
import ToolSelector from '../components/forge/ToolSelector.tsx';
import AuditTool from '../components/forge/AuditTool.tsx';
import { EnterpriseArmory } from '../components/forge/EnterpriseArmory.tsx';
import AgentBuilder from '../components/forge/AgentBuilder.tsx';
import SystemTerminal from '../components/forge/SystemTerminal.tsx';
import OptimizeTool from '../components/forge/OptimizeTool.tsx';
import DocumentTool from '../components/forge/DocumentTool.tsx';

interface ForgePageProps {
  onNavigate: (page: PageView) => void;
}

const ForgePage: React.FC<ForgePageProps> = ({ onNavigate }) => {
  const [activeTool, setActiveTool] = useState<string>('audit');

  return (
    <div className="min-h-screen bg-[#070A0F] text-white selection:bg-cyan-500 selection:text-black font-sans pb-24 pt-6">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-2 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>RETURN_TO_BASE (LANDING)</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            FORGE KERNEL ACTIVE
          </span>
          <button
            onClick={() => onNavigate('fullkonk')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black border border-cyan-400 font-mono text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Sparkles size={14} />
            <span>fullKONK_&gt; COMPILER</span>
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
          <Shield size={14} className="text-cyan-400" />
          <span>ENTERPRISE FORGE // LOGIC &amp; AUDIT SUITE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-white uppercase mb-4">
          The Logic Forge
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-sans max-w-3xl leading-relaxed">
          Comprehensive suite for neural auditing, prompt engineering, agent architecture, and kernel system inspection. Run real-time security verification and logic synthesis.
        </p>
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        {/* Navigation Tool Selector */}
        <ToolSelector activeTool={activeTool} onSelect={setActiveTool} />

        {/* Dynamic Tool Render */}
        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl min-h-[650px]">
          {activeTool === 'audit' && <AuditTool />}
          {activeTool === 'market' && <EnterpriseArmory />}
          {activeTool === 'builder' && <AgentBuilder />}
          {activeTool === 'terminal' && <SystemTerminal />}
          {activeTool === 'optimize' && <OptimizeTool />}
          {activeTool === 'doc' && <DocumentTool />}
        </div>
      </div>
    </div>
  );
};

export default ForgePage;
