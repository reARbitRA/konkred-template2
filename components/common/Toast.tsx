import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircle size={18} className="text-neon-green" />,
    error: <AlertCircle size={18} className="text-neon-red" />,
    info: <Info size={18} className="text-neon-blue" />,
    warning: <AlertCircle size={18} className="text-neon-gold" />,
  };

  const borders = {
    success: 'border-neon-green/30',
    error: 'border-neon-red/30',
    info: 'border-neon-blue/30',
    warning: 'border-neon-gold/30',
  };

  return (
    <div className={`fixed bottom-10 right-10 z-[200] flex items-center gap-4 bg-void-300 border ${borders[type]} px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right-4 duration-300`}>
      {icons[type]}
      <span className="text-sm font-medium text-white">{message}</span>
      <button onClick={onDismiss} className="ml-4 text-ghost hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;