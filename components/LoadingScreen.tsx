import React, { useEffect, useState } from 'react';
import Logo3D from './Logo3D.tsx';
import { Shield, Zap, Lock, Cpu, Globe } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING");
  const [hex, setHex] = useState("0x000000");

  useEffect(() => {
    // Advanced progress simulation (non-linear)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1200); 
          return 100;
        }
        // Artificial stutter for high-tech feel
        const jump = Math.random() > 0.8 ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 3) + 1;
        return Math.min(prev + jump, 100);
      });
    }, 100);

    const textInterval = setInterval(() => {
      const texts = [
        "DECRYPTING ARCHITECTURE", 
        "SYNCING NEURAL CORES", 
        "VERIFYING LICENSE MAPS", 
        "ESTABLISHING SECURE UPLINK", 
        "LOADING PROTOCOL REGISTRY",
        "BUFFERING ASSET PAYLOADS"
      ];
      setStatus(texts[Math.floor(Math.random() * texts.length)]);
      setHex(`0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`);
    }, 600);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-void flex flex-col items-center justify-center overflow-hidden">
      {/* HUD Layers */}
      <div className="absolute inset-0 scanline opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-[300px] grid-plane opacity-20 pointer-events-none"></div>

      {/* Peripheral Technical Data (Left) */}
      <div className="absolute top-10 left-10 hidden md:flex flex-col gap-2 font-mono text-[8px] text-ghost opacity-40">
        <div className="flex gap-4"><span>CPU_USAGE</span><span className="text-neon-cyan">84.2%</span></div>
        <div className="flex gap-4"><span>MEM_STABLE</span><span className="text-neon-green">TRUE</span></div>
        <div className="flex gap-4"><span>ENCR_NODE</span><span className="text-white">AES_256_GCM</span></div>
        <div className="mt-4 flex flex-col gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-zinc-800">[{i}]</span>
              <span>VERIFY_PACKET_{i*142}... OK</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peripheral Technical Data (Right) */}
      <div className="absolute top-10 right-10 hidden md:flex flex-col items-end gap-2 font-mono text-[8px] text-ghost opacity-40">
        <div className="flex gap-4"><span className="text-white">NODE_LOCATION: US-EAST-1</span><Globe size={10} /></div>
        <div className="flex gap-4"><span className="text-white">SESSION_ID: {hex}</span><Lock size={10} /></div>
        <div className="mt-4 w-32 h-20 border border-white/5 bg-black/40 p-2 overflow-hidden">
           <div className="flex flex-wrap gap-1">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className={`w-1 h-1 ${Math.random() > 0.3 ? 'bg-neon-cyan' : 'bg-zinc-900'} rounded-full`}></div>
              ))}
           </div>
        </div>
      </div>

      {/* Central Content */}
      <div className="relative z-20 flex flex-col items-center text-center">
        {/* The 3D LOGO with Ambient Rings */}
        <div className="relative mb-16 transform scale-125 md:scale-150">
          <Logo3D size={100} />
          
          {/* Pulsing Loading Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-neon-cyan/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full animate-pulse"></div>
          
          {/* Floating Icons */}
          <div className="absolute -top-12 -left-12 p-3 bg-void border border-white/10 rounded-xl animate-bounce">
            <Shield size={20} className="text-neon-cyan" />
          </div>
          <div className="absolute -bottom-12 -right-12 p-3 bg-void border border-white/10 rounded-xl animate-bounce delay-150">
            <Zap size={20} className="text-neon-gold" />
          </div>
        </div>

        {/* Branding */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-display font-black tracking-widest text-white">KONKRED</h1>
          <div className="h-px w-12 bg-neon-cyan mx-auto opacity-50"></div>
        </div>

        {/* Progress System */}
        <div className="w-64 space-y-4">
          <div className="flex justify-between items-end font-mono text-[9px] uppercase tracking-[0.2em] text-ghost">
            <span className="animate-pulse">{status}</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          
          <div className="relative h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-cyan transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,149,0,0.8)]"
              style={{ width: `${progress}%` }}
            />
            {/* Glow sweep */}
            <div 
              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[scanline_2s_linear_infinite]"
              style={{ left: `${progress - 15}%` }}
            />
          </div>

          <p className="text-[8px] font-mono text-zinc-600 tracking-widest uppercase">
            System Integrity: <span className="text-neon-green">OPTIMIZED</span> // Hardware: <span className="text-neon-green">NOMINAL</span>
          </p>
        </div>
      </div>

      {/* Footer Meta */}
      <div className="absolute bottom-10 w-full px-12 flex justify-between items-center opacity-30">
        <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.3em] text-ghost">
          <Cpu size={12} />
          <span>VIRTUAL_MACHINE_ENCLAVE_v4.2</span>
        </div>
        <div className="h-px bg-white/10 flex-grow mx-8"></div>
        <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.3em] text-ghost">
          <span>SECURE_BOOT_SEQUENCE</span>
          <Lock size={12} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;