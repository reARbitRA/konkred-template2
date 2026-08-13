
import React from 'react';
import { X, User, ShieldCheck } from 'lucide-react';
import { Protocol } from '../types';

interface AcquirersListProps {
  protocol: Protocol;
  onClose: () => void;
}

const AcquirersList: React.FC<AcquirersListProps> = ({ protocol, onClose }) => {
  // Generate deterministic mock data based on protocol ID
  const acquirers = Array.from({ length: 8 }).map((_, i) => ({
    id: `acq-${protocol.id}-${i}`,
    name: `User_0x${(parseInt(protocol.id, 36) + i * 12345).toString(16).toUpperCase().slice(0, 4)}...${(i * 987).toString(16).toUpperCase().slice(0, 3)}`,
    time: `${Math.max(1, i * 3 + (parseInt(protocol.id || '1', 36) % 3) + 1)}h ago`,
    verified: i % 3 === 0
  }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-sm concrete-card bg-[#08080A] border border-white/10 shadow-2xl overflow-hidden animate-zoom-in rounded-2xl">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">Recent Acquisitions</h3>
                <p className="text-[10px] font-mono text-ghost uppercase tracking-widest mt-0.5 truncate max-w-[200px]">{protocol.title}</p>
            </div>
            <button onClick={onClose} className="text-ghost hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"><X size={16} /></button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
            {acquirers.map((acq, index) => (
                <div key={acq.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] border-b border-white/[0.02] transition-colors group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-void-300 flex items-center justify-center border border-white/5 text-ghost group-hover:text-neon-cyan group-hover:border-neon-cyan/20 transition-colors">
                            <User size={14} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-white font-bold tracking-wide">{acq.name}</span>
                                {acq.verified && <ShieldCheck size={10} className="text-neon-green" />}
                            </div>
                            <span className="text-[9px] font-mono text-ghost uppercase tracking-widest block mt-0.5">Verified Node</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-mono text-ghost/70 uppercase block">{acq.time}</span>
                    </div>
                </div>
            ))}
        </div>
        <div className="p-3 bg-black/40 text-center border-t border-white/5">
            <span className="text-[8px] font-mono text-ghost/40 uppercase tracking-[0.3em]">Ledger_Sync_Active</span>
        </div>
      </div>
    </div>
  );
};

export default AcquirersList;
