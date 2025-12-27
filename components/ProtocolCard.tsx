import React from 'react';
import { Protocol } from '../types';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

interface ProtocolCardProps {
  protocol: Protocol;
  onAcquire?: () => void;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol, onAcquire }) => {
  return (
    <div className="group relative bg-void-100 border border-white/5 p-6 hover:border-white/20 transition-all duration-300 ease-out flex flex-col h-full">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-ghost">{protocol.category}</span>
          <div className="flex items-center gap-2">
             <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${
               protocol.level === 'Enterprise' ? 'border-neon-purple/30 text-neon-purple' :
               protocol.level === 'Advanced' ? 'border-neon-blue/30 text-neon-blue' :
               'border-white/10 text-ghost'
             }`}>
               {protocol.level.toUpperCase()}
             </span>
          </div>
        </div>
        {protocol.isVerified && (
          <div className="text-neon-green" title="Verified Protocol">
            <ShieldCheck size={16} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-neon-cyan transition-colors">
          {protocol.title}
        </h3>
        <p className="text-sm text-ghost font-light leading-relaxed mb-6">
          {protocol.description}
        </p>
      </div>

      {/* Metadata / Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {protocol.tags.map(tag => (
          <span key={tag} className="text-[10px] text-ghost-light bg-white/5 px-2 py-1 border border-white/5">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer / Action */}
      <div className="mt-auto pt-4 border-t border-dashed border-white/10 flex items-center justify-between">
        <span className="font-mono text-sm text-white">{protocol.price}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAcquire?.();
          }}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ghost-light group-hover:text-white hover:bg-white hover:text-black hover:scale-105 px-4 py-2 rounded-sm transition-all duration-300 ease-in-out cursor-pointer"
        >
          Acquire <ArrowUpRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default ProtocolCard;