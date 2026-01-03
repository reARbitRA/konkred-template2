
import React, { useState } from 'react';
import { Protocol } from '../types';
import { X, Check, FileJson, Shield, Zap, Lock, Terminal, Loader2, Hash } from 'lucide-react';
import Badge from './common/Badge.tsx';

interface ProtocolDetailsProps {
  protocol: Protocol | null;
  onClose: () => void;
  onAcquire: () => void;
}

const ProtocolDetails: React.FC<ProtocolDetailsProps> = ({ protocol, onClose, onAcquire }) => {
  const [isAcquiring, setIsAcquiring] = useState(false);

  if (!protocol) return null;

  const handleAcquireClick = () => {
    setIsAcquiring(true);
    // Simulate a short delay for visual feedback, then trigger parent onAcquire
    setTimeout(() => {
      onAcquire();
      setIsAcquiring(false); 
    }, 800); 
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl concrete-card bg-[#08080A] border border-white/10 shadow-2xl overflow-hidden animate-zoom-in rounded-2xl">
        {/* Top Decorative Line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-ghost hover:text-white transition-colors z-10 p-2 hover:bg-white/5 rounded-full"
          disabled={isAcquiring}
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-0">
          <div className="flex items-center gap-2 mb-4">
             <div className="p-1.5 rounded bg-white/5 border border-white/5">
                <Terminal size={14} className="text-neon-cyan" />
             </div>
             <span className="text-[10px] font-mono text-ghost tracking-widest uppercase">Protocol_ID: {protocol.id.toUpperCase()}</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-white mb-6">{protocol.title}</h2>

          <div className="flex flex-wrap gap-3 mb-8">
             <span className={`text-[10px] font-mono px-3 py-1.5 border rounded-full uppercase tracking-wider ${
               protocol.category === 'Finance' ? 'border-neon-green/20 text-neon-green bg-neon-green/5' :
               protocol.category === 'Legal' ? 'border-neon-blue/20 text-neon-blue bg-neon-blue/5' :
               'border-white/10 text-ghost bg-white/5'
             }`}>
               {protocol.category}
             </span>
             <span className="text-[10px] font-mono px-3 py-1.5 border border-white/10 text-zinc-300 bg-white/5 rounded-full uppercase tracking-wider">
               Level: {protocol.level}
             </span>
             {protocol.isVerified && (
               <span className="flex items-center gap-1.5 text-[10px] font-mono text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-1.5 rounded-full uppercase tracking-wider">
                 <Shield size={10} fill="currentColor" className="text-neon-cyan/20" /> Verified Logic
               </span>
             )}
          </div>
        </div>

        <div className="px-8 py-6 bg-white/[0.02] border-y border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
               <FileJson size={12} className="text-ghost" /> Operational Brief
            </h3>
            <p className="text-sm text-ghost-light leading-relaxed font-light">
              {protocol.description}
            </p>
            <p className="text-sm text-ghost-light leading-relaxed font-light mt-4">
              Includes comprehensive decision trees, raw source files (JSON/Markdown), and implementation guides designed for immediate deployment in high-stakes environments.
            </p>
        </div>

        <div className="px-8 py-6 border-b border-white/5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Hash size={12} className="text-ghost" /> Architecture Tags
            </h3>
            <div className="flex flex-wrap gap-2">
                {protocol.tags.map((tag) => (
                    <Badge key={tag} variant="gray">{tag}</Badge>
                ))}
            </div>
        </div>

        <div className="p-8 grid grid-cols-2 gap-8">
           <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Deliverables</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs text-ghost font-mono">
                   <div className="w-1 h-1 bg-neon-cyan rounded-full" /> Source Code (v2.4)
                </li>
                <li className="flex items-center gap-3 text-xs text-ghost font-mono">
                   <div className="w-1 h-1 bg-neon-cyan rounded-full" /> Documentation PDF
                </li>
                <li className="flex items-center gap-3 text-xs text-ghost font-mono">
                   <div className="w-1 h-1 bg-neon-cyan rounded-full" /> Commercial License
                </li>
              </ul>
           </div>
           
           <div className="flex flex-col justify-end">
              <div className="flex items-end justify-between mb-4">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-ghost uppercase tracking-wider mb-1">Acquisition Cost</span>
                   <span className="text-3xl font-bold text-white font-display">{protocol.price}</span>
                 </div>
              </div>
              
              <button 
                onClick={handleAcquireClick}
                disabled={isAcquiring}
                className="w-full bg-white text-black py-4 rounded-xl text-xs font-black tracking-[0.2em] hover:bg-neon-cyan transition-all flex items-center justify-center gap-2 group uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAcquiring ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> PROCESSING...
                  </>
                ) : (
                  <>
                    Acquire Asset
                    <Zap size={14} className="group-hover:fill-current" />
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Footer Meta */}
        <div className="bg-black/40 p-3 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-ghost uppercase tracking-widest">
           <div className="flex items-center gap-2">
             <Lock size={10} /> Encrypted Transaction
           </div>
           <div>KONKRED SECURE v2.4</div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolDetails;
