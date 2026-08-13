
import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import Loader from '../common/Loader.tsx';

import { databaseService } from '../../services/database.ts';

interface WaitlistModalProps {
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    
    try {
      const generatedId = await databaseService.joinWaitlist(email.trim());
      setTicketId(generatedId);
      setStatus('success');
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 perspective-1000">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-md animate-in zoom-in-95 duration-500 preserve-3d">
        
        {/* Success State: Holographic Ticket */}
        {status === 'success' ? (
          <div className="concrete-card bg-black border border-neon-cyan/50 p-0 rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(255,149,0,0.2)] transform hover:rotate-y-12 transition-transform duration-500">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan shadow-[0_0_15px_rgba(255,149,0,1)]"></div>
            
            <div className="p-8 text-center relative z-10">
              <div className="w-16 h-16 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-cyan/20 animate-pulse">
                <Sparkles className="text-neon-cyan" size={32} />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">Access Granted</h2>
              <p className="text-ghost text-xs font-mono uppercase tracking-widest mb-8">Priority Uplink Established</p>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
                <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mb-1">Your Designation</p>
                <p className="text-3xl font-black text-white font-display tracking-widest">{ticketId}</p>
              </div>

              <button onClick={onClose} className="text-xs font-mono font-bold text-ghost hover:text-white uppercase tracking-widest">
                [ CLOSE TERMINAL ]
              </button>
            </div>
            
            {/* Holographic Sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>
        ) : (
          /* Form State */
          <div className="concrete-card bg-[#08080a] border border-white/10 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <button onClick={onClose} className="absolute top-6 right-6 text-ghost hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-purple/20 blur-[80px] rounded-full pointer-events-none"></div>

            <header className="mb-8">
              <div className="flex items-center gap-2 text-neon-purple mb-4">
                <ShieldCheck size={18} />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">Private Beta</span>
              </div>
              <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Request Access</h2>
              <p className="text-ghost-light text-sm mt-3 leading-relaxed">
                Join the executive network of architects building the autonomous economy. Limited node allocation available for Q4.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Corporate Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost group-focus-within:text-neon-purple transition-colors" size={16} />
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ari@konkred.xyz"
                    className="w-full bg-void-200 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-neon-purple outline-none transition-all font-mono placeholder:text-ghost/30"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-white text-black py-5 rounded-xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-xs hover:bg-neon-purple hover:text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300"
              >
                {status === 'loading' ? <Loader size={16} /> : <>Initialize Uplink <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-ghost uppercase tracking-widest">
              <span>Slots Remaining: 142</span>
              <span>Node: US-EAST</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
