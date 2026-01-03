import React from 'react';

interface Logo3DProps {
  className?: string;
  size?: number;
}

const Logo3D: React.FC<Logo3DProps> = ({ className = '', size = 32 }) => {
  return (
    <div 
      className={`relative preserve-3d group ${className}`}
      style={{ 
        width: size, 
        height: size,
        perspective: '1200px'
      }}
    >
      {/* 3D Pivot Point */}
      <div className="w-full h-full relative preserve-3d animate-logo-orbit">
        
        {/* Deep Aura Glow behind the logo */}
        <div className="absolute inset-0 bg-neon-cyan/20 blur-[60px] rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Procedural Brushed Metal Filter */}
            <filter id="brushed-metal" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.6 0.01" numOctaves="3" seed="2" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" result="destaturatedNoise" />
              <feComponentTransfer in="destaturatedNoise" result="highContrastNoise">
                <feFuncR type="linear" slope="1.5" intercept="-0.2"/>
                <feFuncG type="linear" slope="1.5" intercept="-0.2"/>
                <feFuncB type="linear" slope="1.5" intercept="-0.2"/>
              </feComponentTransfer>
              <feComposite operator="in" in2="SourceGraphic" />
              <feBlend mode="overlay" in2="SourceGraphic" />
            </filter>

            {/* Glowing Trace Filter */}
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Premium Metallic Gradients */}
            <linearGradient id="metal-primary" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E4E4E7" />
              <stop offset="50%" stopColor="#71717A" />
              <stop offset="75%" stopColor="#A1A1AA" />
              <stop offset="100%" stopColor="#27272A" />
            </linearGradient>

            <linearGradient id="circuit-recess" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#050508" />
              <stop offset="100%" stopColor="#0D0D15" />
            </linearGradient>

            <linearGradient id="glow-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>

          {/* MAIN ISOMETRIC K-CUBE GEOMETRY */}
          
          {/* Right Recessed Face (Neural Enclave) */}
          <path d="M50 48 L88 32 V72 L50 88 Z" fill="url(#circuit-recess)" stroke="#11111A" strokeWidth="0.5" />
          
          {/* Circuit Traces on the Enclave Face */}
          <g filter="url(#neon-glow)">
            <path d="M55 55 Q65 50 75 58" stroke="#3B82F6" strokeWidth="0.8" strokeLinecap="round" className="animate-pulse" />
            <path d="M58 65 L70 75 L82 72" stroke="#8B5CF6" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="1 2" />
            <path d="M62 80 Q72 88 84 82" stroke="#EC4899" strokeWidth="1" strokeLinecap="round" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
            
            {/* Solder Nodes */}
            <circle cx="75" cy="58" r="1.2" fill="#3B82F6" />
            <circle cx="82" cy="72" r="1" fill="#8B5CF6" />
            <circle cx="84" cy="82" r="1.5" fill="#EC4899" />
          </g>

          {/* Top Plate (Brushed Metal) */}
          <path d="M12 32 L50 15 L88 32 L50 48 Z" fill="url(#metal-primary)" filter="url(#brushed-metal)" />
          
          {/* Left Plate (Brushed Metal) */}
          <path d="M12 32 L50 48 V88 L12 72 Z" fill="#27272A" />
          <path d="M12 32 L50 48 V88 L12 72 Z" fill="url(#metal-primary)" filter="url(#brushed-metal)" opacity="0.7" />

          {/* CARVED "K" STRUCTURE (Metallic Monogram) */}
          
          {/* Stem of K */}
          <g>
            <path d="M22 38 L35 44 V82 L22 76 Z" fill="url(#metal-primary)" filter="url(#brushed-metal)" stroke="#000" strokeWidth="0.1" />
            <path d="M35 44 L42 41 V79 L35 82 Z" fill="#09090B" /> {/* Perspective edge */}
          </g>

          {/* Upper Arm of K */}
          <g>
            <path d="M35 55 L70 40 L82 45 L45 62 Z" fill="url(#metal-primary)" filter="url(#brushed-metal)" stroke="#000" strokeWidth="0.1" />
            <path d="M45 62 L82 45 V50 L45 67 Z" fill="#09090B" /> {/* Depth shadow */}
          </g>

          {/* Lower Arm of K */}
          <g>
            <path d="M35 55 L82 75 L70 82 L35 62 Z" fill="url(#metal-primary)" filter="url(#brushed-metal)" stroke="#000" strokeWidth="0.1" />
            <path d="M35 62 L70 82 V87 L35 67 Z" fill="#09090B" />
          </g>

          {/* Shine Effect (Animated Reflection) */}
          <path d="M12 32 L50 15 L88 32 L50 48 Z" fill="white" opacity="0">
            <animate attributeName="opacity" values="0;0.15;0" dur="5s" repeatCount="indefinite" />
          </path>
        </svg>

        {/* 3D Floor Shadow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/60 blur-3xl -z-10 transform translate-y-14 scale-y-50 scale-x-75"></div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logo-orbit {
          0% { transform: rotateY(-18deg) rotateX(8deg); }
          50% { transform: rotateY(18deg) rotateX(-4deg); }
          100% { transform: rotateY(-18deg) rotateX(8deg); }
        }
        .animate-logo-orbit {
          animation: logo-orbit 12s ease-in-out infinite;
        }
        .preserve-3d { transform-style: preserve-3d; }
      `}} />
    </div>
  );
};

export default Logo3D;