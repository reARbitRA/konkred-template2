import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'green' | 'gold' | 'red' | 'gray';
  className?: string;
  size?: 'sm' | 'md';
  title?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '', size = 'sm', title }) => {
  const variants = {
    cyan: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/20',
    purple: 'bg-neon-purple/15 text-neon-purple border-neon-purple/20',
    green: 'bg-neon-green/15 text-neon-green border-neon-green/20',
    gold: 'bg-neon-gold/15 text-neon-gold border-neon-gold/20',
    red: 'bg-neon-red/15 text-neon-red border-neon-red/20',
    gray: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
  };

  return (
    <span 
      title={title}
      className={`inline-flex items-center justify-center font-mono uppercase tracking-wider rounded-sm border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;