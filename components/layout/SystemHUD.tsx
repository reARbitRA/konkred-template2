
import React, { useEffect, useState } from 'react';
import { Wifi, Battery, Zap } from 'lucide-react';

const SystemHUD: React.FC = () => {
  const [time, setTime] = useState('');
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(14);

  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].split('.')[0] + ' UTC');
      setFps(Math.floor(58 + Math.random() * 4));
      setLatency(Math.floor(12 + Math.random() * 8));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-white/10 rounded-tl-xl" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-white/10 rounded-tr-xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-white/10 rounded-bl-xl" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-white/10 rounded-br-xl" />

      {/* Top Center Notches */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
         <div className="w-12 h-1 bg-white/10" />
         <div className="w-12 h-1 bg-white/10" />
         <div className="w-12 h-1 bg-white/10" />
      </div>

      {/* System Stats Top Right */}
      <div className="absolute top-8 right-8 text-[9px] font-mono text-ghost flex flex-col items-end gap-1 opacity-50">
         <div className="flex items-center gap-3">
            <span>{time}</span>
            <div className="w-px h-3 bg-white/20" />
            <span className="text-neon-green">NOMINAL</span>
         </div>
         <div className="flex items-center gap-3">
            <span>FPS: {fps}</span>
            <div className="w-px h-3 bg-white/20" />
            <span>LATENCY: {latency}ms</span>
         </div>
      </div>

      {/* Decorative Scan Lines (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-20 pointer-events-none" />

      {/* Bottom Center Status */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[8px] font-mono text-ghost uppercase tracking-[0.2em] opacity-40">
         <span className="flex items-center gap-2"><Wifi size={10} /> NET_UPLINK_SECURE</span>
         <span className="w-1 h-1 bg-white/20 rounded-full" />
         <span className="flex items-center gap-2"><Zap size={10} /> SYS_PWR_100%</span>
         <span className="w-1 h-1 bg-white/20 rounded-full" />
         <span className="flex items-center gap-2"><Battery size={10} /> ENCLAVE_LOCKED</span>
      </div>
    </div>
  );
};

export default SystemHUD;
