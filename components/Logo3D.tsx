import React from 'react';

interface Logo3DProps {
  className?: string;
  size?: number;
}

const Logo3D: React.FC<Logo3DProps> = ({ className = '', size = 32 }) => {
  return (
    <div 
      className={`relative inline-block transition-transform duration-500 hover:scale-110 ${className}`} 
      style={{ width: size, height: size }}
    >
      {/* Subtle Bottom Drop Shadow (Floor shadow) */}
      <div 
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/40 blur-md rounded-full pointer-events-none"
      />

      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[2px_4px_4px_rgba(0,0,0,0.4)]"
      >
        {/* Front Face - Left Bar */}
        <path d="M35 30 V70 H48 V30 Z" fill="white" />
        {/* Side Face - Left Bar */}
        <path d="M48 30 L55 25 V65 L48 70 Z" fill="#9CA3AF" />
        {/* Top Face - Left Bar */}
        <path d="M35 30 L42 25 H55 L48 30 Z" fill="#F3F4F6" />

        {/* Top Branch - Front */}
        <path d="M48 50 L65 30 H75 L55 52 Z" fill="white" />
        {/* Top Branch - Top edge */}
        <path d="M65 30 L72 25 H82 L75 30 Z" fill="#F3F4F6" />
        {/* Top Branch - Inner side (shading) */}
        <path d="M55 52 L62 47 L82 25 L75 30 Z" fill="#6B7280" />

        {/* Bottom Branch - Front */}
        <path d="M48 52 L65 72 H75 L55 50 Z" fill="white" />
        {/* Bottom Branch - Bottom/Side edge */}
        <path d="M65 72 L72 67 L82 45 L75 50 Z" fill="#9CA3AF" />
        
        {/* Polished Wireframe Accents */}
        <path d="M42 25 L35 30" stroke="#374151" strokeWidth="0.75" />
        <path d="M55 25 L82 25" stroke="#374151" strokeWidth="0.75" />
        <path d="M82 25 L82 45" stroke="#374151" strokeWidth="0.75" />
        <path d="M48 30 L35 30" stroke="#374151" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

export default Logo3D;