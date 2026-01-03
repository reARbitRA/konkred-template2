
import React from 'react';
import Loader from './Loader.tsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 font-mono uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-neon-cyan text-black font-black hover:shadow-neon-cyan",
    secondary: "bg-white/10 text-white font-bold hover:bg-white/20 border border-white/10",
    outline: "border-2 border-white/10 text-white hover:border-white/20 hover:bg-white/5",
    danger: "border-2 border-neon-red/30 text-neon-red hover:bg-neon-red/10",
    ghost: "text-ghost hover:text-white transition-colors"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-10 py-4 text-sm"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader size={14} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
      {/* Brutalist hover effect */}
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
    </button>
  );
};

export default Button;
