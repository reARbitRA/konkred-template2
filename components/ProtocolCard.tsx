
import React, { useState } from 'react';
import { Protocol } from '../types';
import { ShieldCheck, ArrowUpRight, Loader2, Download, Info, Hash } from 'lucide-react';
import Badge from './common/Badge.tsx';

interface ProtocolCardProps {
  protocol: Protocol;
  onAcquire?: (protocol: Protocol) => void;
  onViewDetails?: (protocol: Protocol) => void;
  onFilterCategory?: (category: string) => void;
  onShowAcquirers?: (protocol: Protocol) => void;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol, onAcquire, onViewDetails, onFilterCategory, onShowAcquirers }) => {
  const [isAcquiring, setIsAcquiring] = useState(false);

  const handleAcquireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAcquiring) return;
    setIsAcquiring(true);
    // The onAcquire prop typically navigates, so we simulate a short delay for feedback
    setTimeout(() => {
      onAcquire?.(protocol);
      // Reset state, though navigation will unmount this component
      setIsAcquiring(false);
    }, 1500);
  };

  return (
    <div className="group relative concrete-card p-6 hover:border-white/20 transition-all duration-300 ease-out flex flex-col h-full cursor-pointer" onClick={() => onViewDetails?.(protocol)}>
      <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onFilterCategory?.(protocol.category); }}
            className="text-[10px] font-mono uppercase tracking-wider text-ghost hover:text-neon-cyan transition-colors text-left"
          >
            {protocol.category}
          </button>
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
        <div className="flex items-center gap-2">
            {protocol.isVerified && <ShieldCheck size={16} className="text-neon-green" />}
            <Info size={14} className="text-ghost opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-neon-cyan transition-colors">
          {protocol.title}
        </h3>
        <p className="text-sm text-ghost font-light leading-relaxed mb-6">
          {protocol.description}
        </p>
      </div>

      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-display font-black text-neon-cyan">{protocol.price}</span>
          <span className="text-[9px] font-mono text-ghost uppercase tracking-widest">Base</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onShowAcquirers?.(protocol);
          }}
          className="flex items-baseline gap-2 bg-white/[0.02] pl-3 pr-4 py-2 rounded-md border border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all group/stats"
          title="View recent acquirers"
        >
          <Download size={12} className="text-neon-cyan group-hover/stats:animate-bounce" />
          <span className="text-lg font-black text-white font-mono">{protocol.acquisitionCount}</span>
        </button>
      </div>
      
      <div className="pt-4 border-t border-dashed border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
               <Hash size={10} className="text-neon-cyan opacity-50" />
               <span className="text-[8px] font-mono text-ghost uppercase tracking-[0.2em]">Architecture_Index</span>
            </div>
            <span className="text-[9px] font-mono text-neon-cyan font-bold bg-neon-cyan/5 border border-neon-cyan/20 px-1.5 py-0.5 rounded-sm">
              {protocol.tags.length} TAGS
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {protocol.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="gray" className="text-[9px]">{tag}</Badge>
            ))}
            {protocol.tags.length > 2 && <span className="text-[9px] text-ghost">+{protocol.tags.length - 2}</span>}
          </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handleAcquireClick}
          disabled={isAcquiring}
          className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 hover:bg-neon-cyan hover:text-black px-4 py-2 rounded-sm transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-wait"
        >
          {isAcquiring ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Acquiring...</span>
            </>
          ) : (
            <>
              <span className="hidden group-hover:inline">Secure</span> Acquire <ArrowUpRight size={12} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProtocolCard;
