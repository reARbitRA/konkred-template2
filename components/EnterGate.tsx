import React, { useState } from 'react';
import { Lock, ChevronRight, Github } from 'lucide-react';

interface EnterGateProps {
  onEnter: () => void;
}

const EnterGate: React.FC<EnterGateProps> = ({ onEnter }) => {
  const [isEntering, setIsEntering] = useState(false);
  const [identity, setIdentity] = useState('');
  const [key, setKey] = useState('');

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real scenario we would validate, but here we just animate entry
    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 1500); // Wait for animation to finish
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );

  const PerplexityIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
       <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 18.5C13.6569 18.5 15 17.1569 15 15.5C15 13.8431 13.6569 12.5 12 12.5C10.3431 12.5 9 13.8431 9 15.5C9 17.1569 10.3431 18.5 12 18.5ZM12 11.5C13.6569 11.5 15 10.1569 15 8.5C15 6.84315 13.6569 5.5 12 5.5C10.3431 5.5 9 6.84315 9 8.5C9 10.1569 10.3431 11.5 12 11.5ZM6.5 15.5C6.5 17.1569 7.84315 18.5 9.5 18.5C11.1569 18.5 12.5 17.1569 12.5 15.5C12.5 13.8431 11.1569 12.5 9.5 12.5C7.84315 12.5 6.5 13.8431 6.5 15.5ZM17.5 15.5C17.5 17.1569 16.1569 18.5 14.5 18.5C12.8431 18.5 11.5 17.1569 11.5 15.5C11.5 13.8431 12.8431 12.5 14.5 12.5C16.1569 12.5 17.5 13.8431 17.5 15.5ZM17.5 8.5C17.5 10.1569 16.1569 11.5 14.5 11.5C12.8431 11.5 11.5 10.1569 11.5 8.5C11.5 6.84315 12.8431 5.5 14.5 5.5C16.1569 5.5 17.5 6.84315 17.5 8.5ZM6.5 8.5C6.5 10.1569 7.84315 11.5 9.5 11.5C11.1569 11.5 12.5 10.1569 12.5 8.5C12.5 6.84315 11.1569 5.5 9.5 5.5C7.84315 5.5 6.5 6.84315 6.5 8.5Z" fillRule="evenodd" clipRule="evenodd"/>
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden">
       {/* Ambient Background */}
       <div className={`absolute inset-0 z-0 opacity-[0.03] grid-bg pointer-events-none scale-150 animate-[pulse_8s_ease-in-out_infinite] transition-opacity duration-1000 ${isEntering ? 'opacity-0' : ''}`} />
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-0 pointer-events-none" />
       
       <div className="relative z-10 text-center flex flex-col items-center w-full max-w-md px-6">
         
         {/* System Status Line */}
         <div className={`flex flex-col items-center gap-2 animate-slide-up delay-100 opacity-0 fill-mode-forwards transition-opacity duration-500 ${isEntering ? 'opacity-0' : ''}`}>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-zinc-800 to-zinc-500 mb-8"></div>
         </div>
         
         {/* Headline */}
         <div className="animate-slide-up delay-200 opacity-0 fill-mode-forwards relative mb-12">
           <h1 className={`text-5xl md:text-7xl font-black tracking-tighter select-none relative z-10 transition-all duration-1000 ease-in-out ${
             isEntering 
               ? 'text-orange-500 drop-shadow-[0_0_50px_rgba(249,115,22,0.8)] scale-110 blur-[1px]' 
               : 'text-white mix-blend-difference'
           }`}>
             KONKRED
           </h1>
           {/* Subtle glow behind text */}
           <div className={`absolute inset-0 blur-3xl z-0 rounded-full transform scale-x-150 transition-colors duration-1000 ${
             isEntering ? 'bg-orange-600/20' : 'bg-white/5'
           }`}></div>
         </div>
         
         {/* Login Form */}
         <form 
           onSubmit={handleAuthenticate}
           className={`w-full space-y-6 animate-slide-up delay-300 opacity-0 fill-mode-forwards transition-all duration-700 ${isEntering ? '!opacity-0 translate-y-10' : ''}`}
         >
           <div className="space-y-4">
             <div className="relative group">
               <input 
                 type="text" 
                 value={identity}
                 onChange={(e) => setIdentity(e.target.value)}
                 placeholder="IDENTITY"
                 className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-500 py-2 text-center text-sm font-mono text-white placeholder-zinc-700 outline-none transition-colors uppercase tracking-widest"
               />
               <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
             </div>
             
             <div className="relative group">
               <input 
                 type="password" 
                 value={key}
                 onChange={(e) => setKey(e.target.value)}
                 placeholder="ACCESS KEY"
                 className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-500 py-2 text-center text-sm font-mono text-white placeholder-zinc-700 outline-none transition-colors uppercase tracking-widest"
               />
               <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
             </div>
           </div>

           <button 
             type="submit"
             className="group relative w-full inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono text-xs font-bold tracking-[0.25em] text-white uppercase transition-all duration-500 bg-transparent border border-zinc-800 hover:border-zinc-500 cursor-pointer mt-8"
           >
             <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-600 transition-opacity duration-500"></span>
             
             <span className="relative z-10 group-hover:text-white transition-colors duration-200 flex items-center gap-2">
               [ AUTHENTICATE ]
               <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
             </span>
           </button>
           
           <div className="pt-4 flex justify-center gap-4 border-t border-transparent">
             <button type="button" onClick={() => setIsEntering(true) || setTimeout(onEnter, 1500)} className="p-2 text-zinc-600 hover:text-white transition-colors border border-transparent hover:border-zinc-800 rounded-full">
               <GoogleIcon />
             </button>
             <button type="button" onClick={() => setIsEntering(true) || setTimeout(onEnter, 1500)} className="p-2 text-zinc-600 hover:text-white transition-colors border border-transparent hover:border-zinc-800 rounded-full">
               <Github size={14} />
             </button>
             <button type="button" onClick={() => setIsEntering(true) || setTimeout(onEnter, 1500)} className="p-2 text-zinc-600 hover:text-white transition-colors border border-transparent hover:border-zinc-800 rounded-full">
               <PerplexityIcon />
             </button>
           </div>
           
           <div className="text-center">
              <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest cursor-pointer hover:text-zinc-400">Recover Credentials</span>
           </div>
         </form>
       </div>

       {/* Footer Metadata */}
       <div className={`absolute bottom-12 w-full px-12 flex justify-between items-end animate-in delay-500 opacity-0 fill-mode-forwards text-[10px] text-zinc-800 font-mono tracking-widest uppercase transition-opacity duration-500 ${isEntering ? 'opacity-0' : ''}`}>
          <div className="flex items-center gap-2">
            <Lock size={10} />
            <span>Encrypted Session</span>
          </div>
          <div>Secure Environment v2.04</div>
       </div>
    </div>
  );
};

export default EnterGate;