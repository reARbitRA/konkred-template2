import React from 'react';
import { Linkedin, X } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-16 px-6 flex justify-center bg-void relative overflow-hidden border-t border-white/5">
      {/* Background Texture Overlay (Simulated Concrete) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"></div>
      
      <div className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-12 z-10 px-12 py-8 concrete-card rounded-2xl border border-white/5">
        {/* Left Side: ARBITRA STUDIO */}
        <div className="flex items-center gap-6">
          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-neon-cyan transition-all transform hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            <X size={28} strokeWidth={2.5} />
          </a>
          
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-mono font-black tracking-[0.2em] text-white uppercase italic drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              ARBITRA STUDIO
            </span>
          </div>
        </div>

        {/* Separator Line - Neon Cyan Glitch Style */}
        <div className="hidden md:block h-10 w-[3px] bg-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.8),0_0_5px_rgba(255,255,255,0.5)] relative">
          <div className="absolute -left-[4px] top-1/4 w-[2px] h-1/2 bg-white/40 blur-[1px]"></div>
          <div className="absolute -right-[4px] bottom-1/4 w-[2px] h-1/2 bg-white/40 blur-[1px]"></div>
        </div>

        {/* Right Side: ARI MIYANJI */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xl md:text-2xl font-mono font-black tracking-[0.2em] text-white uppercase italic drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              ARI MIYANJI
            </span>
          </div>

          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-neon-cyan transition-all transform hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            <Linkedin size={28} fill="currentColor" strokeWidth={0} />
          </a>
        </div>

        {/* Shine effect on container */}
        <div className="absolute -inset-x-4 -inset-y-4 rounded-3xl bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none border border-white/5 backdrop-blur-[1px]"></div>
      </div>
    </footer>
  );
};

export default Footer;