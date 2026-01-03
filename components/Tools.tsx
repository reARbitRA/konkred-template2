import React from 'react';
import { Tool } from '../types';
import ToolCard from './ToolCard';
import { TerminalSquare } from 'lucide-react';

interface ToolsProps {
  tools: Tool[];
  onLaunchTool?: (id: string) => void;
}

const Tools: React.FC<ToolsProps> = ({ tools, onLaunchTool }) => {
  return (
    <section id="tools" className="py-24 concrete-card border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-zinc-900/50 rounded-sm border border-zinc-800">
              <TerminalSquare size={20} className="text-zinc-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Tool Modules</h2>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">Operational Utilities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map(tool => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              onClick={() => onLaunchTool?.(tool.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;