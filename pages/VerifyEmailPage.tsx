
import React from 'react';
import { Mail, Shield, CheckCircle } from 'lucide-react';

interface VerifyEmailPageProps {
  email: string;
  onNavigateLogin: () => void;
}

const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ email, onNavigateLogin }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-void-gradient p-6">
      <div className="relative w-full max-w-md concrete-card border border-white/10 shadow-2xl p-1 animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
        
        <div className="p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <Mail className="text-neon-cyan" size={40} />
          </div>

          <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-4 uppercase">Verify Your Uplink</h2>
          <p className="text-ghost text-sm mb-8 leading-relaxed max-w-sm">
            We have transmitted a secure verification link to the designated email address below. Please check your inbox to finalize your node creation.
          </p>

          <div className="w-full bg-void-200 concrete-card px-6 py-4 rounded-xl mb-10 text-center font-mono text-neon-cyan border border-white/5">
            {email}
          </div>
          
          <button 
            onClick={onNavigateLogin}
            className="w-full bg-white hover:bg-neon-cyan text-black font-black py-5 rounded-xl text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all uppercase shadow-lg shadow-white/10"
          >
            PROCEED TO LOGIN
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-3 opacity-50">
            <Shield size={14} className="text-neon-green" />
            <span className="text-[9px] font-mono text-ghost uppercase tracking-[0.2em]">Secure Handshake Protocol v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
