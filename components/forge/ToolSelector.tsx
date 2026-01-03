
import React from 'react';
import { Shield, Zap, Terminal, Database, Layers } from 'lucide-react';

interface ToolSelectorProps {
  activeTool: string;
  onSelect: (tool: string) => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ activeTool, onSelect }) => {
  const tools = [
    { id: 'audit', label: 'Neural Audit', icon: Shield },
    { id: 'optimize', label: 'Prompt Refiner', icon: Zap },
    { id: 'builder', label: 'Agent Architect', icon: Layers }, // New Tool
    { id: 'market', label: 'Market Intel', icon: Database },
    { id: 'terminal', label: 'Kernel Shell', icon: Terminal },
  ];

  return (
    <div className="flex flex-wrap gap-2 md:gap-4 p-2 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-xl sticky top-24 z-30">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onSelect(tool.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
            activeTool === tool.id 
              ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
              : 'border-transparent text-ghost hover:text-white hover:bg-white/5'
          }`}
        >
          <tool.icon size={16} className={activeTool === tool.id ? 'text-neon-cyan' : ''} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ToolSelector;
