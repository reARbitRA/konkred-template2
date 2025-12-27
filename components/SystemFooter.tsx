import React from 'react';
import { AppData } from '../types';
import { Activity, Circle, Server } from 'lucide-react';

interface SystemFooterProps {
  data: AppData['footer'];
  counts: {
    protocols: number;
    tools: number;
  };
}

const SystemFooter: React.FC<SystemFooterProps> = ({ data, counts }) => {
  return (
    <footer className="border-t border-zinc-900 bg-black/80 backdrop-blur text-[10px] font-mono text-zinc-500 py-3">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-zinc-600" />
            <span className="tracking-wider">{data.systemStatus}</span>
          </div>
          <div className="hidden md:flex h-3 w-px bg-zinc-800"></div>
          <div className="hidden md:flex items-center gap-2">
            <Server size={12} className="text-zinc-600" />
            <span>US-EAST-1</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <span>{counts.protocols} PROTOCOLS LOADED</span>
           <span className="text-zinc-700">|</span>
           <span>{counts.tools} MODULES ACTIVE</span>
        </div>

        <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-default">
           <Circle size={8} fill="currentColor" className="text-zinc-700" />
           <span>{data.version}</span>
        </div>

      </div>
    </footer>
  );
};

export default SystemFooter;