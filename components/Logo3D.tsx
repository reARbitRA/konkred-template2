import React, { useState } from 'react';

interface Logo3DProps {
  className?: string;
  size?: number;
}

const Logo3D: React.FC<Logo3DProps> = ({ className = '', size = 32 }) => {
  // Generate unique IDs for defs to prevent collision when multiple logo instances exist on the same page
  const [uniqueId] = useState(() => Math.random().toString(36).substr(2, 9));
  const clipId = `reveal-clip-${uniqueId}`;
  const metalGradId = `metal-grad-${uniqueId}`;
  const goldGradId = `gold-grad-${uniqueId}`;
  const circuitRecessGradId = `circuit-recess-${uniqueId}`;
  const neonGlowId = `neon-glow-${uniqueId}`;

  return (
    <div 
      className={`konkred-logo-container relative preserve-3d group ${className}`}
      style={{ 
        width: size, 
        height: size,
        perspective: '1200px',
      }}
    >
      {/* Ambient background glow mapped directly to current logo state (Acid vs Crimson) */}
      <div className="absolute inset-0 bg-[var(--logo-accent)]/10 blur-[40px] rounded-full scale-150 opacity-50 group-hover:opacity-100 transition-all duration-700" />

      {/* Main interactive SVG block inside the 3D rotating chassis */}
      <div className="w-full h-full relative preserve-3d animate-logo-subtle">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full ignited-logo"
        >
          <defs>
            {/* Dynamic clip-path that wipes from right to left */}
            <clipPath id={clipId}>
              <rect className="logo-wipe-rect" x="0" y="0" width="100" height="100" />
            </clipPath>

            {/* Neon Accent Glow Filter */}
            <filter id={neonGlowId} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Premium Metallic Brushed Gradient representing the chrome outer plating */}
            <linearGradient id={metalGradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="15%" stopColor="#E4E4E7" />
              <stop offset="45%" stopColor="#8E9196" />
              <stop offset="70%" stopColor="#D4D4D8" />
              <stop offset="100%" stopColor="#18181B" />
            </linearGradient>

            {/* Inward shadow gradient for internal circuitry depth */}
            <linearGradient id={circuitRecessGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020204" />
              <stop offset="100%" stopColor="#0B0B14" />
            </linearGradient>
          </defs>

          {/* Group wrapper mapped to the live loading reveal mask */}
          <g clipPath={`url(#${clipId})`}>
            
            {/* 1. INTERNAL DEEP RECESSED CORE (Internal computer chassis) */}
            <path 
              d="M38 42 L68 28 V68 L38 82 Z" 
              fill={`url(#${circuitRecessGradId})`} 
              stroke="#0c0d14" 
              strokeWidth="0.8" 
            />

            {/* 2. GLOWING LOGICAL CIRCUITS (The central network traces matching Image 3) */}
            <g filter={`url(#${neonGlowId})`} className="circuit-traces">
              {/* Dynamic circuit paths */}
              <path 
                d="M 42 46 L 52 41 L 62 46" 
                stroke="var(--logo-accent)" 
                strokeWidth="0.8" 
                strokeLinecap="round" 
                opacity="0.85" 
              />
              <path 
                d="M 44 58 L 50 62 L 56 59 L 64 63" 
                stroke="var(--logo-accent)" 
                strokeWidth="0.6" 
                strokeLinecap="round" 
                strokeDasharray="1 1.5" 
              />
              <path 
                d="M 40 70 L 54 63 L 60 71" 
                stroke="var(--logo-accent)" 
                strokeWidth="0.8" 
                strokeLinecap="round" 
                opacity="0.9" 
              />
              <path 
                d="M 48 38 L 48 64 L 62 50" 
                stroke="var(--logo-accent)" 
                strokeWidth="0.5" 
                strokeLinecap="round" 
              />

              {/* High-tech node joints */}
              <circle cx="62" cy="46" r="1.2" fill="var(--logo-accent)" className="ping-node" />
              <circle cx="64" cy="63" r="1.0" fill="var(--logo-accent)" />
              <circle cx="60" cy="71" r="1.3" fill="var(--logo-accent)" className="ping-node" style={{ animationDelay: '0.4s' }} />
              <circle cx="48" cy="38" r="0.9" fill="var(--logo-accent)" />
            </g>

            {/* 3. CORE FRONT METAL FLANGE (Left vertical column of the K-Hexagon) */}
            <g className="logo-panel-left">
              {/* Left outer panel face */}
              <path 
                d="M16 32 L38 42 V82 L16 72 Z" 
                fill={`url(#${metalGradId})`} 
                stroke="#09090b" 
                strokeWidth="0.4" 
              />
              {/* Left inner lip bevel (gives 3D mechanical volume) */}
              <path 
                d="M38 42 L42 40 V80 L38 82 Z" 
                fill="#0e0f12" 
              />
              {/* Left facet highlights for subtle brushed reflection */}
              <path 
                d="M18 34 L36 42" 
                stroke="#ffffff" 
                strokeWidth="0.5" 
                opacity="0.25" 
              />
            </g>

            {/* 4. SOLID TOP PLATE (The roof of the isometric cube) */}
            <g className="logo-panel-top">
              <path 
                d="M16 32 L50 15 L84 32 L50 48 Z" 
                fill={`url(#${metalGradId})`} 
                stroke="#000000" 
                strokeWidth="0.3" 
              />
              {/* Bevel divider line following structural axis of Image 2 */}
              <path 
                d="M16 32 L50 48" 
                stroke="#09090b" 
                strokeWidth="0.4" 
                opacity="0.4" 
              />
              <path 
                d="M50 15 L50 48" 
                stroke="#09090b" 
                strokeWidth="0.3" 
                opacity="0.3" 
              />
            </g>

            {/* 5. UPPER RIGHT MONOGRAM LEG (The primary top wing extension of K) */}
            <g className="logo-panel-wing-upper">
              {/* Plate surface */}
              <path 
                d="M48 50 L78 35 L84 38 L54 53 Z" 
                fill={`url(#${metalGradId})`} 
                stroke="#09090b" 
                strokeWidth="0.3" 
              />
              {/* Underside thickness shadow */}
              <path 
                d="M54 53 L84 38 V43 L54 58 Z" 
                fill="#0b0b0e" 
              />
              {/* Highlighting edge crease */}
              <path 
                d="M48 50 L78 35" 
                stroke="#ffffff" 
                strokeWidth="0.4" 
                opacity="0.3" 
              />
            </g>

            {/* 6. LOWER RIGHT MONOGRAM LEG (The primary bottom wing extension of K) */}
            <g className="logo-panel-wing-lower">
              {/* Plate surface */}
              <path 
                d="M44 54 L84 74 L78 77 L38 57 Z" 
                fill={`url(#${metalGradId})`} 
                stroke="#09090b" 
                strokeWidth="0.3" 
              />
              {/* Side profile bevel */}
              <path 
                d="M38 57 L78 77 V82 L38 62 Z" 
                fill="#0c0c0f" 
              />
            </g>

          </g>
        </svg>

        {/* Dynamic 3D Floor Shadow under the logo */}
        <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-4/5 h-[8px] bg-black/75 blur-md rounded-full transform scale-y-50" />
      </div>

      {/* Scoped CSS styling for our hardware flicker, load reveals, and dynamic variables */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --logo-accent: var(--acid, #ccff00);
        }

        .konkred-logo-container {
          --logo-accent: var(--acid, #ccff00);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .konkred-logo-container:hover {
          --logo-accent: var(--crimson, #ff003c);
        }

        /* 1. Right to Left Clip path slide-in reveal on mount */
        @keyframes logo-wipe-action {
          0% {
            transform: translateX(100px);
          }
          100% {
            transform: translateX(0px);
          }
        }

        .logo-wipe-rect {
          animation: logo-wipe-action 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* 2. Modern neon ignition flicker right after the slide-in finishes */
        @keyframes logo-ignite-ambient {
          0% {
            filter: drop-shadow(0 0 0px transparent);
            opacity: 0.3;
          }
          10% {
            filter: drop-shadow(0 0 15px var(--logo-accent));
            opacity: 1;
          }
          15% {
            filter: drop-shadow(0 0 2px var(--logo-accent));
            opacity: 0.5;
          }
          22% {
            filter: drop-shadow(0 0 25px var(--logo-accent));
            opacity: 1;
          }
          30% {
            filter: drop-shadow(0 0 4px var(--logo-accent));
            opacity: 0.7;
          }
          40% {
            filter: drop-shadow(0 0 35px var(--logo-accent));
            opacity: 1;
          }
          100% {
            filter: drop-shadow(0 0 10px var(--logo-accent));
            opacity: 1;
          }
        }

        .ignited-logo {
          opacity: 0;
          animation: logo-ignite-ambient 0.8s cubic-bezier(0.25, 1, 0.5, 1) 1.2s both;
        }

        /* 3. Constant slow hover flicker mode (gives realistic hardware neon pulse) */
        @keyframes constant-hover-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 15px var(--logo-accent));
            opacity: 1;
          }
          12% {
            filter: drop-shadow(0 0 3px var(--logo-accent));
            opacity: 0.82;
          }
          24% {
            filter: drop-shadow(0 0 22px var(--logo-accent));
            opacity: 1;
          }
          36% {
            filter: drop-shadow(0 0 6px var(--logo-accent));
            opacity: 0.9;
          }
          48% {
            filter: drop-shadow(0 0 28px var(--logo-accent));
            opacity: 1;
          }
          70% {
            filter: drop-shadow(0 0 8px var(--logo-accent));
            opacity: 0.85;
          }
        }

        .konkred-logo-container:hover .ignited-logo {
          animation: constant-hover-pulse 0.6s ease-in-out infinite !important;
        }

        /* 4. Subtle floating orbit motion */
        @keyframes subtle-float {
          0% { transform: translateY(0) rotateY(-8deg) rotateX(4deg); }
          50% { transform: translateY(-4px) rotateY(8deg) rotateX(-2deg); }
          100% { transform: translateY(0) rotateY(-8deg) rotateX(4deg); }
        }

        .animate-logo-subtle {
          animation: subtle-float 6s ease-in-out infinite;
        }

        /* Circuit Node Pulse Effects */
        @keyframes node-ping {
          0%, 100% { r: 1px; opacity: 0.6; }
          50% { r: 1.8px; opacity: 1; }
        }

        .ping-node {
          animation: node-ping 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default Logo3D;
