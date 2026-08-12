import React from 'react';
import { AppData } from '../types';
import { Activity, ShieldCheck, Database, Cpu, HardDrive, Terminal } from 'lucide-react';

interface SystemFooterProps {
  data: AppData['footer'];
  counts: {
    protocols: number;
    tools: number;
  };
}

const SystemFooter: React.FC<SystemFooterProps> = ({ data, counts }) => {
  return (
    <footer className="border-t-4 border-black w-full bg-[#030712] text-[10px] font-mono text-void-500 py-12 mt-auto select-none relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main 4-Column Professional Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-10 border-b-2 border-void-300">
          
          {/* Column 1: Brand & Node Diagnostics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 border-2 border-black bg-signal text-black tracking-widest uppercase font-black text-[9px] rounded-none">
                NODE // TERMINAL
              </span>
              <span className="font-display font-black tracking-widest text-white uppercase text-xs">KONKRED</span>
            </div>
            <p className="text-[9px] text-void-600 leading-relaxed uppercase">
              DECENTRALIZED PROMPTING ENGINE AND SECURE AGENT REPOSITORY. AUDITED INTEGRATIONS FOR DETERMINISTIC LOGIC CAPTURE.
            </p>
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-signal">
                <Activity size={10} className="animate-pulse" />
                <span className="uppercase font-bold tracking-wider text-[8px]">SYS_STATUS: {data.systemStatus || 'ONLINE'}</span>
              </div>
              <div className="flex items-center gap-2 text-void-600">
                <HardDrive size={10} />
                <span className="uppercase text-[8px]">CLUSTER: US-EAST-1 // COLD_INLET</span>
              </div>
            </div>
          </div>

          {/* Column 2: System Directory */}
          <div className="space-y-3 text-left">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-void-300 inline-block">
              PLATFORM_DIRECTORY
            </h5>
            <div className="flex flex-col gap-2 pt-1 uppercase">
              <a href="#marketplace" className="text-void-500 hover:text-signal transition-colors flex items-center gap-1.5">
                <span>// BROWSE INDUSTRIAL TOOLS</span>
              </a>
              <a href="#services" className="text-void-500 hover:text-signal transition-colors flex items-center gap-1.5">
                <span>// STRATEGIC ADVISORY</span>
              </a>
              <a href="#intel" className="text-void-500 hover:text-signal transition-colors flex items-center gap-1.5">
                <span>// DEEP INTEL LOGS</span>
              </a>
              <a href="#academy" className="text-void-500 hover:text-signal transition-colors flex items-center gap-1.5">
                <span>// KNOWLEDGE HUB NODE</span>
              </a>
            </div>
          </div>

          {/* Column 3: Live Ecosystem Metrics */}
          <div className="space-y-3">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-void-300 inline-block">
              EXECUTION_METRICS
            </h5>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between text-void-600 bg-void-100 p-1.5 rounded-none border border-void-300">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <Database size={9} className="text-signal" /> Consensus Protocols
                </span>
                <span className="text-white font-bold">{counts.protocols.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-void-600 bg-void-100 p-1.5 rounded-none border border-void-300">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <Cpu size={9} className="text-signal" /> Active Agents
                </span>
                <span className="text-white font-bold">{counts.tools.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-void-600 bg-void-100 p-1.5 rounded-none border border-void-300">
                <span className="flex items-center gap-1.5 font-bold text-[8px] uppercase">
                  <ShieldCheck size={9} className="text-signal" /> Consumed Gas State
                </span>
                <span className="text-signal font-black">FLUID</span>
              </div>
            </div>
          </div>

          {/* Column 4: Settlement Protocols */}
          <div className="space-y-3">
            <h5 className="text-white font-bold tracking-widest text-[9px] uppercase pb-1 border-b border-void-300 inline-block">
              COMPLIANT_SETTLEMENT
            </h5>
            <p className="text-[9px] text-void-600 leading-relaxed uppercase">
              Web3 secure routing integration. Automatically settling code licenses via instant USDT node uplinks.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              <span className="px-2 py-0.5 bg-void-100 border-2 border-black text-[8px] text-void-500 rounded-none font-bold">USDT_READY</span>
            </div>
          </div>

        </div>

        {/* Lower Sub-Footer Legal / Context safety note */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-center md:text-left">
          <div className="space-y-1">
            <div className="text-white uppercase font-bold text-[9px] tracking-wider">
              © 2026 KONKRED.XYZ. CORE SYSTEM LOGIC INTEGRATIONS.
            </div>
            <p className="text-[8px] text-void-550 max-w-xl leading-normal uppercase">
              CRITICAL ADVISORY: Executing production-grade prompts without rigorous Consensus scoring may induce logic variance. Establish isolated sandboxes inside terminal targets prior to deploy.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-void-100 border-2 border-black py-1.5 px-3 rounded-none text-void-500 uppercase text-[8px] tracking-tight hover:text-void-400 transition-colors">
            <Terminal size={10} className="text-signal" />
            <span>ENCLAVE_OS_v{data.version || '4.9.4'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default SystemFooter;
