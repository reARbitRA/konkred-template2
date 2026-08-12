
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
    <div className="group relative concrete-card p-0 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 ease-out flex flex-col h-full cursor-pointer" onClick={() => onViewDetails?.(protocol)}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1.5">
            <button 
              onClick={(e) => { e.stopPropagation(); onFilterCategory?.(protocol.category); }}
              className="text-[9px] font-mono uppercase tracking-[.25em] text-[#555] hover:text-neon-cyan transition-colors text-left font-bold"
            >
              {protocol.category}
            </button>
            <div className="flex items-center gap-2">
               <span className={`text-[9px] font-mono px-1.5 py-0.5 border-2 ${
                 protocol.level === 'Enterprise' ? 'border-neon-purple/40 text-neon-purple bg-neon-purple/5' :
                 protocol.level === 'Advanced' ? 'border-neon-blue/40 text-neon-blue bg-neon-blue/5' :
                 'border-[#1A212B] text-[#555]'
               } uppercase font-black tracking-widest`}>
                 {protocol.level}
               </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
              {protocol.isVerified && <ShieldCheck size={14} className="text-neon-green opacity-50 group-hover:opacity-100 transition-opacity" />}
              <Hash size={12} className="text-[#333] group-hover:text-neon-cyan transition-colors" />
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-xl font-mono font-black text-white mb-3 group-hover:text-neon-cyan transition-colors uppercase leading-none tracking-tight">
            {protocol.title}
          </h3>
          <p className="text-xs text-[#9AA0A8] font-medium leading-relaxed mb-8 line-clamp-3">
            {protocol.description}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-[#1A212B]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-black text-neon-cyan leading-none">{protocol.price}</span>
              <span className="text-[8px] font-mono text-[#555] uppercase tracking-widest font-bold">USDT</span>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {protocol.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[8px] font-mono text-[#444] border border-[#1A212B] px-1.5 py-0.5 uppercase group-hover:border-neon-cyan/20 group-hover:text-neon-cyan transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAcquireClick}
              disabled={isAcquiring}
              className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] bg-[#1A212B] text-white hover:bg-neon-cyan hover:text-black px-4 py-3 transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              {isAcquiring ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>SECURE_ASSET <ArrowUpRight size={14} /></>
              )}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onShowAcquirers?.(protocol); }}
              className="w-12 flex items-center justify-center bg-[#0D1218] border border-[#1A212B] hover:border-neon-cyan/30 text-[#444] hover:text-neon-cyan transition-all"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolCard;
