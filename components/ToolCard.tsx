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
      className={`group bg-zinc-900/20 border border-zinc-800 p-5 transition-all duration-300 flex items-center justify-between gap-4 ${isInteractable ? 'cursor-pointer hover:border-zinc-500 hover:bg-zinc-900/60 hover:shadow-lg' : 'hover:bg-zinc-900/40 hover:border-zinc-700'}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 transition-colors ${isInteractable ? 'group-hover:text-white group-hover:border-zinc-600' : 'group-hover:text-white'}`}>
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white">{tool.name}</h4>
            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
          </div>
          <p className="text-xs text-zinc-500 line-clamp-1 group-hover:text-zinc-400">{tool.description}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
          tool.access === 'Free' ? 'border-zinc-700 text-zinc-400' : 'border-amber-900/30 text-amber-500'
        }`}>
          {tool.access.toUpperCase()}
        </span>
        <button className={`opacity-0 transition-opacity text-white ${isInteractable ? 'group-hover:opacity-100' : ''}`}>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ToolCard;