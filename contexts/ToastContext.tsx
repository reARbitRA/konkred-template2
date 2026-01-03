
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContextValue {
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
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

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
