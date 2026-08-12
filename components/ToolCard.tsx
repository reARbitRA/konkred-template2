import React from 'react';
import { Tool } from '../types';
import { Terminal, FileText, BarChart3, ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onClick?: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  const getIcon = () => {
    switch (tool.type) {
      case 'Terminal': return <Terminal size={18} />;
      case 'Document': return <FileText size={18} />;
      case 'Analytics': return <BarChart3 size={18} />;
      default: return <Terminal size={18} />;
    }
  };

  const statusColor = tool.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500';
  const isInteractable = tool.id === 't1'; // Specifically targeting Valuation Terminal for now

  return (
    <div 
      onClick={isInteractable ? onClick : undefined}
      className={`group concrete-card p-4 transition-all duration-200 flex items-center justify-between gap-4 ${isInteractable ? 'cursor-pointer hover:bg-[#1A212B] active:translate-y-0.5' : 'opacity-80'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 bg-[#0B0F14] border border-[#1A212B] text-[#555] transition-colors ${isInteractable ? 'group-hover:text-neon-cyan group-hover:border-neon-cyan/30' : ''}`}>
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-[11px] font-mono font-black text-white uppercase tracking-wider group-hover:text-neon-cyan transition-colors">{tool.name}</h4>
            <div className={`w-1 h-1 rounded-full ${statusColor} shadow-[0_0_5px_currentColor]`} />
          </div>
          <p className="text-[10px] font-mono text-[#555] uppercase tracking-tight group-hover:text-[#888] transition-colors">{tool.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`text-[9px] font-mono px-2 py-0.5 border-2 ${
          tool.access === 'Free' ? 'border-[#1A212B] text-[#444]' : 'border-neon-cyan/20 text-neon-cyan bg-neon-cyan/5'
        } uppercase font-black tracking-widest`}>
          {tool.access}
        </span>
        {isInteractable && (
          <ArrowRight size={14} className="text-[#333] group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </div>
  );
};

export default ToolCard;