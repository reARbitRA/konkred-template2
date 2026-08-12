
import React, { useState } from 'react';
import { X, Lock, ChevronRight, Fingerprint, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import Loader from '../common/Loader.tsx';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, key);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication sequence failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-void/90 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md concrete-card border border-white/10 p-10 rounded-[2rem] shadow-2xl animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-6 right-6 text-ghost hover:text-white transition-colors">
          <X size={20} />
        </button>

        <header className="text-center mb-10">
           <div className="w-16 h-16 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl flex items-center justify-center text-neon-cyan mx-auto mb-6">
              <Lock size={32} />
           </div>
           <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Access Node</h2>
           <p className="text-ghost text-xs mt-2 uppercase tracking-widest font-mono">Verify Neural Identity</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-neon-red/10 border border-neon-red/20 rounded-xl flex items-center gap-3 text-neon-red text-[10px] font-mono uppercase animate-in shake-in">
              <AlertCircle size={14} /> [ERROR] {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Identity Designation</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ari@konkred.xyz"
              className="w-full bg-void-200 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-neon-cyan outline-none transition-all font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Secure Access Key</label>
            <input 
              type="password" required value={key} onChange={e => setKey(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-void-200 border border-white/10 rounded-xl px-5 py-4 text-sm text-white focus:border-neon-cyan outline-none transition-all font-mono"
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-white text-black py-5 rounded-xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-xs hover:bg-neon-cyan transition-all shadow-lg shadow-white/5"
          >
            {isLoading ? <Loader size={14} /> : <><Fingerprint size={18} /> Authenticate Session</>}
          </button>
        </form>

        <footer className="mt-8 pt-8 border-t border-white/5 text-center">
           <button className="text-[10px] font-mono text-ghost hover:text-white uppercase tracking-widest underline decoration-white/10">Request Access Key</button>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;
