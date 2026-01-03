
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, multiline, className = '', ...props }) => {
  const Component = multiline ? 'textarea' : 'input';
  
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <Component
          className={`
            w-full bg-void-200 concrete-card px-4 py-4 text-sm text-white placeholder-ghost 
            outline-none transition-all rounded-xl border border-white/5 focus:border-neon-cyan
            ${error ? 'border-neon-red/50 focus:border-neon-red' : ''}
            ${className}
          `}
          {...(props as any)}
        />
        {error && (
          <p className="mt-1 text-[10px] font-mono text-neon-red uppercase tracking-wider animate-in fade-in">
            [ERR]: {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
