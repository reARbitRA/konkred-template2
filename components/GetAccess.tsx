import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface GetAccessProps {
  onOpen: () => void;
  onDemo: () => void;
}

const GetAccess: React.FC<GetAccessProps> = ({ onOpen, onDemo }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-24 border-t border-zinc-900 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        <div>
           <h2 className="text-3xl font-bold mb-4 text-white">Intel Dispatch</h2>
           <p className="text-zinc-500 font-light leading-relaxed max-w-md">
             Join 4,000+ executives receiving our weekly briefing on structural capital and operational protocols. Zero noise.
           </p>
        </div>

        <div className="flex flex-col gap-4">
           <form onSubmit={handleSubscribe} className="relative w-full max-w-md">
             <input 
               type="email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Enter your email frequency..."
               className="w-full bg-zinc-900 border border-zinc-800 focus:border-white pl-5 pr-14 py-4 text-sm text-white placeholder-zinc-600 outline-none transition-colors font-mono concrete-card"
             />
             <button 
               type="submit"
               className={`absolute right-2 top-2 bottom-2 p-2 transition-colors duration-300 ${
                 subscribed ? 'bg-green-500 text-black' : 'bg-white text-black hover:bg-zinc-200'
               }`}
               disabled={subscribed}
             >
               {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
             </button>
           </form>
           
           <div className="h-6">
             {subscribed ? (
               <div className="flex items-center gap-2 text-[10px] font-mono text-green-500 uppercase tracking-widest animate-in fade-in slide-in-from-left-2 duration-300">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                 <span>Subscription Confirmed // Welcome</span>
               </div>
             ) : (
               <div className="flex gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest animate-in fade-in duration-300">
                 <span>Weekly Updates</span>
                 <span>New Protocol Alerts</span>
               </div>
             )}
           </div>
        </div>

      </div>
    </section>
  );
};

export default GetAccess;