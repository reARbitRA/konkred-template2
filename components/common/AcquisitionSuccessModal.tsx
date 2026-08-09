import React, { useEffect, useState } from 'react';
import { Listing } from '../../types.ts';
import { Check, ShieldCheck, Terminal, Download, Zap, Cpu, ArrowRight } from 'lucide-react';
import Badge from './Badge.tsx';

interface AcquisitionSuccessModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onViewEnclave: () => void;
}

export const AcquisitionSuccessModal: React.FC<AcquisitionSuccessModalProps> = ({
  listing,
  isOpen,
  onClose,
  onViewEnclave
}) => {
  const [flash, setFlash] = useState(true);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "[CHAIN_CLEAR] Validating multi-sig transaction hash on-chain...",
    "[ENCLAVE_ALLOC] Allocating zero-trust isolated execution pod...",
    "[KEY_GEN] Generating asymmetric ECDSA node signature...",
    "[UPLINK_SUCCESS] Asset binaries successfully mapped to local enclave."
  ];

  useEffect(() => {
    if (isOpen) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 250);
      
      const interval = setInterval(() => {
        setLogIndex(prev => (prev < logs.length - 1 ? prev + 1 : prev));
      }, 400);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setLogIndex(0);
    }
  }, [isOpen]);

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-void/90 backdrop-blur-2xl animate-in fade-in duration-300">
      
      {/* High-Contrast Flash Effect */}
      {flash && (
        <div className="fixed inset-0 bg-neon-cyan/40 z-[160] pointer-events-none transition-opacity duration-300 animate-out fade-out" />
      )}

      <div className="relative w-full max-w-lg concrete-card bg-[#0A0F1D] border-2 border-neon-green/40 p-8 lg:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(16,185,129,0.2)] text-center space-y-8 animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Neon Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-neon-green/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Success Icon */}
        <div className="relative mx-auto w-20 h-20 bg-neon-green/20 rounded-3xl border border-neon-green/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] group">
          <Check className="text-neon-green stroke-[3]" size={42} />
          <div className="absolute inset-0 bg-neon-green/20 rounded-3xl blur-md -z-10" />
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <Badge variant="cyan" className="font-mono text-[9px] uppercase tracking-widest px-3 py-1">
            ACQUISITION_VERIFIED // 200_OK
          </Badge>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
            Protocol Mapped
          </h2>
          <p className="text-ghost text-sm leading-relaxed max-w-sm mx-auto font-light">
            License for <span className="text-white font-bold">{listing.title}</span> has been signed and injected into your enclave node.
          </p>
        </div>

        {/* Simulated Console Log Viewport */}
        <div className="bg-black/80 border border-white/10 rounded-2xl p-4 text-left font-mono text-[10px] space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-ghost/60 border-b border-white/10 pb-2 mb-2">
            <span className="flex items-center gap-1.5">
              <Terminal size={12} className="text-neon-green" /> ENCLAVE_LOG
            </span>
            <span className="text-neon-green font-bold">LIVE_STREAM</span>
          </div>

          {logs.slice(0, logIndex + 1).map((log, i) => (
            <div key={i} className="text-ghost-light flex items-center gap-2 animate-in fade-in duration-200">
              <span className="text-neon-green font-bold">&gt;</span>
              <span className={i === logIndex ? 'text-white font-bold' : ''}>{log}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onViewEnclave}
            className="flex-1 py-4 px-6 rounded-2xl bg-neon-green text-black font-mono font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            VIEW IN ENCLAVE <ArrowRight size={14} />
          </button>
          <button
            onClick={onClose}
            className="py-4 px-6 rounded-2xl border border-white/10 text-ghost hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionSuccessModal;
