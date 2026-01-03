
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  className?: string;
  label?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 24, className = '', label }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        <Loader2 size={size} className="text-neon-cyan animate-spin" />
        <div className="absolute inset-0 bg-neon-cyan/20 blur-xl animate-pulse rounded-full" />
      </div>
      {label && (
        <span className="text-[10px] font-mono text-ghost uppercase tracking-widest animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;
