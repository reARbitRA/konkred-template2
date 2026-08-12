import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={!isLoading ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md concrete-card bg-void-200 border border-white/10 shadow-2xl overflow-hidden animate-zoom-in rounded-2xl">
        <div className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-neon-orange/10 rounded-full flex-shrink-0 flex items-center justify-center border border-neon-orange/20">
              <AlertTriangle className="text-neon-orange" size={24} />
            </div>
            <div className="flex-1">
              <h2 id="dialog-title" className="text-lg font-bold text-white mb-2">{title}</h2>
              <p id="dialog-description" className="text-sm text-ghost-light leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border-2 border-white/10 rounded-xl text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-xs font-mono disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-3 bg-neon-cyan text-black rounded-xl font-black uppercase tracking-widest hover:shadow-neon-cyan transition-all flex items-center justify-center gap-3 text-xs font-mono disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              {isLoading ? 'Processing...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
