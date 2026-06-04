import React from 'react';
import { AppData } from '../types';
import { Activity, Circle, Server, Database, Cpu } from 'lucide-react';

interface SystemFooterProps {
  data: AppData['footer'];
  counts: {
    protocols: number;
    tools: number;
  };
}

const SystemFooter: React.FC<SystemFooterProps> = ({ data, counts }) => {
  return (
    <footer className="border-t border-zinc-900 bg-black/80 backdrop-blur text-[10px] font-mono text-zinc-500 py-3 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-neon-green/50" />
            <span className="tracking-wider uppercase">{data.systemStatus}</span>
          </div>
          <div className="hidden md:flex h-3 w-px bg-zinc-800"></div>
          <div className="hidden md:flex items-center gap-2">
            <Server size={12} className="text-zinc-600" />
            <span className="uppercase font-bold text-ghost">US-EAST-1</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2 group cursor-help">
              <Database size={10} className="text-neon-cyan group-hover:animate-pulse" />
              <span>{counts.protocols.toLocaleString()} PROTOCOLS_LISTED</span>
           </div>
           <span className="text-zinc-800">/</span>
           <div className="flex items-center gap-2 group cursor-help">
              <Cpu size={10} className="text-neon-purple group-hover:animate-pulse" />
              <span>{counts.tools.toLocaleString()} AGENTS_ACTIVE</span>
           </div>
        </div>

        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
           <Circle size={8} className="text-zinc-700 fill-current" />
           <span className="tracking-tighter">OS_{data.version}</span>
        </div>

      </div>
    </footer>
  );
};

export default SystemFooter;