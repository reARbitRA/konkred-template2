import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Github, Mail, Sparkles } from 'lucide-react';

interface JoinNetworkProps {
  onClose: () => void;
}

const JoinNetwork: React.FC<JoinNetworkProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate marketing API endpoint hit
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-black border border-white/10 shadow-2xl p-1 animate-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
        
        <div className="p-8 flex flex-col items-center text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-ghost hover:text-white transition-colors">
            <X size={20} />
          </button>

          <div className="w-16 h-16 bg-neon-cyan/10 border border-neon-cyan/20 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
            <Sparkles className="text-neon-cyan" size={32} />
          </div>

          <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">Early Access</h2>
          <p className="text-ghost text-sm mb-8 leading-relaxed">
            Join the executive waitlist for the KONKRED v3 release. <br/>Verified identities receive priority node allocation.
          </p>

          {status === 'success' ? (
            <div className="w-full bg-neon-green/5 border border-neon-green/20 p-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="text-neon-green" size={48} />
              <div className="space-y-1">
                <span className="text-neon-green font-mono text-sm font-black tracking-widest block uppercase">Telemetry Confirmed</span>
                <p className="text-ghost-light text-xs">You are #142 in queue for System Entry.</p>
              </div>
              <button onClick={onClose} className="mt-4 text-[10px] font-mono text-ghost hover:text-white underline">RETURN TO HUB</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Identity Designation</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ari Miyanji"
                  className="w-full bg-void-200 border border-white/10 focus:border-neon-cyan px-4 py-4 text-sm text-white placeholder-ghost outline-none transition-all rounded-xl font-mono"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Communication Uplink</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="executive@konkred.xyz"
                  className="w-full bg-void-200 border border-white/10 focus:border-neon-cyan px-4 py-4 text-sm text-white placeholder-ghost outline-none transition-all rounded-xl font-mono"
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-neon-cyan hover:shadow-neon-cyan text-black font-black py-4 rounded-xl text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all mt-6 uppercase"
              >
                {status === 'loading' ? (
                  <span className="animate-pulse">PROCESSING TELEMETRY...</span>
                ) : (
                  <>
                    SECURE EARLY ACCESS <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center gap-4 w-full opacity-30">
            <div className="h-px bg-white/10 flex-grow"></div>
            <span className="text-[9px] text-ghost font-mono uppercase tracking-[0.3em]">System v2.84</span>
            <div className="h-px bg-white/10 flex-grow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinNetwork;