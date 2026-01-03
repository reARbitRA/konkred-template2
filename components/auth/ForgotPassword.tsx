
import React, { useState } from 'react';
import { X, Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordProps {
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-void/90 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md concrete-card border border-white/10 p-10 rounded-[2rem] shadow-2xl animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-6 right-6 text-ghost hover:text-white transition-colors">
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-8">
             <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-green border border-neon-green/20 animate-in zoom-in">
                <CheckCircle size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Recovery Uplink Established</h3>
             <p className="text-ghost text-sm leading-relaxed mb-8">Secure reset instructions have been transmitted to <span className="text-white font-mono">{email}</span>.</p>
             <button onClick={onClose} className="text-xs font-mono font-bold text-white uppercase tracking-widest hover:text-neon-green transition-colors">Close Transmission</button>
          </div>
        ) : (
          <>
            <header className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Recover Credentials</h2>
              <p className="text-ghost text-xs mt-2 uppercase tracking-widest font-mono">Restore Access to Neural Node</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Registered Email Uplink</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost" size={16} />
                   <input 
                     type="email" required value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="architect@uplink.io"
                     className="w-full bg-void-200 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-sm text-white focus:border-neon-cyan outline-none transition-all font-mono"
                   />
                </div>
              </div>

              <button 
                type="submit" disabled={status === 'loading'}
                className="w-full bg-white text-black py-5 rounded-xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-xs hover:bg-neon-cyan transition-all shadow-lg shadow-white/5"
              >
                {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <>Initialize Reset <ArrowRight size={16} /></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
