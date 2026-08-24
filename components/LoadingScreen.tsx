
import React, { useEffect, useState } from 'react';
import { Shield, Zap, Lock, Cpu, Globe, BarChart3, Binary } from 'lucide-react';
import { KonkredLogo } from './brand/KonkredLogo.tsx';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING_CORE");
  const [nodeId] = useState(() => {
    const arr = new Uint8Array(3);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(arr);
    return `0x${Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800); 
          return 100;
        }
        return Math.min(prev + 5, 100);
      });
    }, 50);

    const texts = [
      "SYNCHRONIZING_ENCLAVES...", 
      "DECRYPTING_ARCHITECTURE...", 
      "ESTABLISHING_UPLINK...", 
      "CALIBRATING_INTEL_STREAM...", 
      "VERIFYING_NODE_LOGIC...",
      "NOMINAL_ACCESS_GRANTED"
    ];
    let idx = 0;
    const textInterval = setInterval(() => {
      setStatus(texts[idx]);
      idx = (idx + 1) % texts.length;
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 scanline opacity-20"></div>
      <div className="absolute inset-0 opacity-[0.05] grid-bg pointer-events-none"></div>
      
      <div className="relative z-20 flex flex-col items-center text-center">
        <div className="mb-12 space-y-5">
          <KonkredLogo size={84} className="brutal-stamp" />
          <h1 className="sr-only">KONKRED</h1>
          <p className="text-[10px] font-mono text-amber-400 tracking-[0.6em] uppercase font-black ml-[0.6em]">
            Production Uplink Active
          </p>
        </div>

        <div className="w-[450px] max-w-[90vw] space-y-6">
          <div className="flex justify-between items-end font-mono text-[10px] uppercase tracking-[0.3em] text-ghost">
            <div className="flex items-center gap-3">
               <Binary size={16} className="text-amber-400 animate-pulse" />
               <span className="text-white font-bold">{status}</span>
            </div>
            <span className="text-white font-black">{Math.round(progress)}%</span>
          </div>
          
          <div className="relative h-3 w-full border-2 border-black bg-black/60 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-150 ease-step"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="flex-1 border-r-2 border-black/70 last:border-r-0" />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-[7px] font-mono text-zinc-700 tracking-[0.5em] uppercase">
            <span>UPLINK: SECURE</span>
            <span>NODE_ID: {nodeId}</span>
            <span>OS_v2.5.0-PROD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
