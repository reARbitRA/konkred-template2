
import React, { useEffect, useState } from 'react';
import Logo3D from './Logo3D.tsx';
import { Shield, Zap, Lock, Cpu, Globe, BarChart3, Binary } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING_CORE");
  const [nodeId] = useState(() => `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1600); 
          return 100;
        }
        return Math.min(prev + (Math.random() * 5 + 1), 100);
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
        <div className="relative mb-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-[0.5px] border-neon-cyan/5 rounded-full animate-spin-slow"></div>
          <Logo3D size={220} className="relative z-10" />
        </div>

        <div className="mb-16 space-y-4">
          <h1 className="text-6xl font-display font-black tracking-[0.4em] text-white">KONKRED</h1>
          <p className="text-[10px] font-mono text-neon-cyan tracking-[0.6em] uppercase font-black">Production Uplink Active</p>
        </div>

        <div className="w-[450px] space-y-6">
          <div className="flex justify-between items-end font-mono text-[10px] uppercase tracking-[0.3em] text-ghost">
            <div className="flex items-center gap-3">
               <Binary size={16} className="text-neon-cyan animate-pulse" />
               <span className="text-white font-bold">{status}</span>
            </div>
            <span className="text-white font-black">{Math.round(progress)}%</span>
          </div>
          
          <div className="relative h-[2px] w-full bg-void-300 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple transition-all duration-300 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            />
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
