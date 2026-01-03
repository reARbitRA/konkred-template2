
import React from 'react';
import { Tool } from '../../types.ts';
import { Terminal, FileText, BarChart3, ArrowRight, Zap, Shield, Cpu, Layers } from 'lucide-react';

interface ToolsProps {
  tools: Tool[];
  onLaunchTool: (id: string) => void;
}

const iconMap: any = {
  Terminal: Terminal,
  Document: FileText,
  Analytics: BarChart3,
  Processing: Cpu,
};

const Tools: React.FC<ToolsProps> = ({ tools, onLaunchTool }) => {
  return (
    <section className="py-32 border-t border-white/5 bg-void-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-display font-bold text-white uppercase tracking-tight mb-2">Operational <span className="text-neon-green">Modules</span></h2>
            <p className="text-ghost text-sm font-mono uppercase tracking-[0.2em]">Native Utilities for Asset Management</p>
          </div>
          <button onClick={() => onLaunchTool('forge')} className="text-xs font-bold font-mono text-white flex items-center gap-2 group border-b border-white/20 pb-1 hover:border-neon-green transition-colors">
             Enter The Forge <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, i) => {
            const Icon = iconMap[tool.type] || Layers;
            return (
              <div 
                key={tool.id} 
                onClick={() => onLaunchTool(tool.id)}
                className="group concrete-card p-8 rounded-[2rem] hover:border-white/20 transition-all cursor-pointer bg-black/40 flex flex-col justify-between min-h-[280px]"
              >
                <div>
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10 group-hover:bg-neon-green/10 group-hover:text-neon-green group-hover:border-neon-green/20 transition-colors">
                         <Icon size={20} />
                      </div>
                      <div className={`w-2 h-2 rounded-full ${tool.status === 'Online' ? 'bg-neon-green' : 'bg-neon-gold'} shadow-[0_0_8px_currentColor]`} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2 leading-tight">{tool.name}</h3>
                   <p className="text-xs text-ghost leading-relaxed">{tool.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <span className="text-[9px] font-mono text-ghost uppercase tracking-widest">{tool.access} Tier</span>
                   <ArrowRight size={14} className="text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Tools;
