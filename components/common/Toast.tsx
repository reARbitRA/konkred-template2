
import React from 'react';
import { ToastMessage } from '../../types.ts';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle size={18} className="text-neon-green" />,
    error: <AlertCircle size={18} className="text-neon-red" />,
    info: <Info size={18} className="text-neon-blue" />,
    warning: <AlertCircle size={18} className="text-neon-gold" />,
  };

  const borders = {
    success: 'border-neon-green/30 bg-neon-green/5',
    error: 'border-neon-red/30 bg-neon-red/5',
    info: 'border-neon-blue/30 bg-neon-blue/5',
    warning: 'border-neon-gold/30 bg-neon-gold/5',
  };

  return (
    <div className={`pointer-events-auto flex items-center gap-4 bg-void-300 border ${borders[toast.type]} px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right-12 fade-in duration-300 min-w-[300px] backdrop-blur-xl`}>
      {icons[toast.type]}
      <span className="text-xs font-mono font-medium text-white tracking-wide">{toast.message}</span>
      <button onClick={onDismiss} className="ml-auto text-ghost hover:text-white transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
