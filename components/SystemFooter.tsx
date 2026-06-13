import React from 'react';
import { AppData } from '../types';
import { Activity, ShieldCheck, Database, Cpu, HelpCircle, HardDrive, Terminal } from 'lucide-react';

interface SystemFooterProps {
  data: AppData['footer'];
  counts: {
    protocols: number;
    tools: number;
  };
}

const SystemFooter: React.FC<SystemFooterProps> = ({ data, counts }) => {
  return (
    <footer className="border-t border-zinc-90 w-full bg-zinc-950 text-[10px] font-mono text-zinc-400 py-12 mt-auto select-none border-zinc-900 relative">
      {/* Visual cyber separation accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main 4-Column Professional Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-10 border-b border-zinc-900">
          
          {/* Column 1: Brand & Node Diagnostics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 tracking-widest uppercase font-bold text-[9px]">
                NODE // TERMINAL
              </span>
              <span className="font-sans font-black tracking-widest text-white uppercase text-xs">KONKRED</span>
            </div>
            <p className="text-[9px] text-zinc-500 leading-relaxed uppercase">
              DECENTRALIZED PROMPTING ENGINE AND SECURE AGENT REPOSITORY. AUDITED INTEGRATIONS FOR DETERMINISTIC LOGIC CAPTURE.
            </p>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Activity size={10} className="animate-pulse" />
                <span className="uppercase font-bold tracking-wider text-[8px]">SYS_STATUS: {data.systemStatus || 'ONLINE'}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <HardDrive size={10} />
                <span className="uppercase text-[8px]">CLUSTER: US-EAST-1 // COLD_INLET</span>
              </div>
            </div>
          </div>

          {/* Column 2: System Directory */}
          <div className="space-y-3 text-left">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-zinc-900/60 inline-block">
              PLATFORM_DIRECTORY
            </h5>
            <div className="flex flex-col gap-2 pt-1 uppercase">
              <a href="#marketplace" className="text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <span>// BROWSE INDUSTRIAL TOOLS</span>
              </a>
              <a href="#services" className="text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <span>// STRATEGIC ADVISORY</span>
              </a>
              <a href="#intel" className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>// DEEP INTEL LOGS</span>
              </a>
              <a href="#academy" className="text-zinc-400 hover:text-purple-400 transition-colors flex items-center gap-1.5">
                <span>// KNOWLEDGE HUB NODE</span>
              </a>
            </div>
          </div>

          {/* Column 3: Live Ecosystem Metrics */}
          <div className="space-y-3">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-zinc-900/60 inline-block">
              EXECUTION_METRICS
            </h5>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-zinc-500 bg-zinc-900/30 p-1.5 rounded border border-zinc-900/50">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <Database size={9} className="text-cyan-400" /> Consensus Protocols
                </span>
                <span className="text-white">{counts.protocols.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-500 bg-zinc-900/30 p-1.5 rounded border border-zinc-900/50">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <Cpu size={9} className="text-purple-400" /> Active Agents
                </span>
                <span className="text-white">{counts.tools.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-500 bg-zinc-900/30 p-1.5 rounded border border-zinc-900/50">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <ShieldCheck size={9} className="text-emerald-400" /> Consumed Gas State
                </span>
                <span className="text-emerald-400">FLUID</span>
              </div>
            </div>
          </div>

          {/* Column 4: Settlement Protocols */}
          <div className="space-y-3">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-zinc-900/60 inline-block">
              COMPLIANT_SETTLEMENT
            </h5>
            <p className="text-[9px] text-zinc-500 leading-relaxed uppercase">
              Web3 secure routing integration. Automatically settling code licenses via custom fiat pipelines and instant USDC/USDT node uplinks.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-400 rounded">USDC_READY</span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-400 rounded">USDT_READY</span>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-400 rounded">FIAT_STRIPE</span>
            </div>
          </div>

        </div>

        {/* Lower Sub-Footer Legal / Context safety note */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-white uppercase font-bold text-[9px] tracking-wider">
              © 2026 KONKRED.XYZ. CORE SYSTEM LOGIC INTEGRATIONS.
            </div>
            <p className="text-[8px] text-zinc-550 max-w-xl leading-normal uppercase">
              CRITICAL ADVISORY: Executing production-grade prompts without rigorous Consensus scoring may induce logic variance. Establish isolated sandboxes inside terminal targets prior to deploy.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-900 py-1.5 px-3 rounded text-zinc-500 uppercase text-[8px] tracking-tight hover:text-zinc-350 transition-colors">
            <Terminal size={10} className="text-cyan-400" />
            <span>ENCLAVE_OS_v{data.version || '4.9.4'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default SystemFooter;
