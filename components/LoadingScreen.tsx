import React, { useEffect, useState } from 'react';
import Logo3D from './Logo3D.tsx';
import { Shield, Zap, Lock, Cpu, Globe, BarChart3, Binary, Eye } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING_CORE");
  const [nodes, setNodes] = useState<string[]>([]);

  useEffect(() => {
    // Generate technical node IDs for the HUD
    setNodes(Array.from({ length: 6 }, () => `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`));

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1600); 
          return 100;
        }
        const jump = Math.random() > 0.85 ? 15 : Math.floor(Math.random() * 3) + 1;
        return Math.min(prev + jump, 100);
      });
    }, 70);

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
    }, 1100);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center overflow-hidden">
      {/* Cinematic HUD Layer */}
      <div className="absolute inset-0 scanline opacity-20"></div>
      <div className="absolute inset-0 opacity-[0.05] grid-bg pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
      
      {/* Background Data Clusters (Matching reference image aesthetic) */}
      <div className="absolute top-20 right-20 opacity-30 hidden lg:block animate-pulse">
        <div className="flex items-center gap-3 text-neon-cyan mb-3">
          <BarChart3 size={40} />
          <div className="h-10 w-px bg-white/10" />
          <div className="font-mono text-[8px] text-ghost space-y-0.5">
            <div>DATA_CORE: 98.4%</div>
            <div>THROUGHPUT: 4GB/s</div>
            <div>NODES: 1,242</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
        <div className="font-mono text-[8px] text-ghost space-y-1.5 border-l border-white/10 pl-4">
          {nodes.map((node, i) => <div key={i} className="flex gap-4"><span>[ NODE_{i+1} ]</span> <span className="text-white">{node}</span></div>)}
        </div>
      </div>

      {/* Central Assembly */}
      <div className="relative z-20 flex flex-col items-center text-center">
        
        {/* Holographic Assembly Area */}
        <div className="relative mb-24">
          {/* Animated Telemetry Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-[0.5px] border-neon-cyan/5 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-[0.5px] border-dashed border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          
          {/* Core Energy Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-neon-cyan/5 blur-[100px] animate-pulse"></div>

          {/* HIGH-FIDELITY K-CUBE LOGO */}
          <Logo3D size={220} className="relative z-10" />
        </div>

        {/* Branding & Mission */}
        <div className="mb-16 space-y-4">
          <h1 className="text-6xl font-display font-black tracking-[0.4em] text-white">KONKRED</h1>
          <div className="flex items-center justify-center gap-6">
             <div className="h-px w-16 bg-gradient-to-l from-neon-cyan to-transparent"></div>
             <p className="text-[10px] font-mono text-neon-cyan tracking-[0.6em] uppercase font-black">Next-Gen AI Platform</p>
             <div className="h-px w-16 bg-gradient-to-r from-neon-cyan to-transparent"></div>
          </div>
        </div>

        {/* Progress System */}
        <div className="w-[450px] space-y-6">
          <div className="flex justify-between items-end font-mono text-[10px] uppercase tracking-[0.3em] text-ghost">
            <div className="flex items-center gap-3">
               <Binary size={16} className="text-neon-cyan animate-pulse" />
               <span className="text-white font-bold">{status}</span>
            </div>
            <span className="text-white font-black">{progress}%</span>
          </div>
          
          <div className="relative h-[2px] w-full bg-void-300 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple transition-all duration-300 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%] animate-shimmer" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[7px] font-mono text-zinc-700 tracking-[0.5em] uppercase">
            <span>UPLINK_STABLE</span>
            <span>OS_v2.0.4-STABLE</span>
            <span>BOOT_HASH_0xFD42</span>
          </div>
        </div>
      </div>

      {/* Decorative Peripheral HUD */}
      <div className="absolute bottom-12 w-full px-16 flex justify-between items-center opacity-40">
        <div className="flex items-center gap-5 font-mono text-[9px] tracking-[0.3em] text-ghost">
          <Cpu size={16} className="text-neon-cyan" />
          <span>VIRTUAL_MACHINE_ACTIVE</span>
        </div>
        <div className="h-[0.5px] bg-white/10 flex-grow mx-16"></div>
        <div className="flex items-center gap-5 font-mono text-[9px] tracking-[0.3em] text-ghost">
          <span>SECURE_ENVIRONMENT_LOCKED</span>
          <Lock size={16} className="text-neon-cyan" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;