
import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { FEATURED_LISTINGS_DEMO } from '../../constants.ts';
import Badge from '../common/Badge.tsx';

const Wishlist: React.FC = () => {
  // Simulating wishlist data using a subset of demo listings
  const savedItems = FEATURED_LISTINGS_DEMO.slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <header className="flex justify-between items-end pb-6 border-b border-white/5">
          <div>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Saved Protocols</h2>
             <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">Shortlisted Assets for Acquisition</p>
          </div>
          <Badge variant="gray">{savedItems.length} Items</Badge>
       </header>

       {savedItems.length === 0 ? (
           <div className="py-24 text-center concrete-card border-dashed border-white/10 rounded-[2rem] bg-black/10">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Heart size={32} className="text-ghost opacity-20" />
               </div>
               <p className="text-ghost text-sm uppercase tracking-widest">Wishlist Empty</p>
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {savedItems.map(item => (
                   <div key={item.id} className="concrete-card p-6 rounded-3xl flex flex-col justify-between group hover:border-neon-cyan/30 transition-all bg-black/40">
                       <div>
                           <div className="flex justify-between items-start mb-4">
                               <Badge variant="cyan" size="sm">{item.type}</Badge>
                               <button className="text-ghost hover:text-neon-red transition-colors p-2 hover:bg-neon-red/10 rounded-lg">
                                   <Trash2 size={16} />
                               </button>
                           </div>
                           <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-neon-cyan transition-colors">{item.title}</h3>
                           <p className="text-xs text-ghost-light line-clamp-2 leading-relaxed mb-6">{item.shortDescription}</p>
                       </div>
                       
                       <div className="flex items-center justify-between pt-6 border-t border-white/5">
                           <div className="flex flex-col">
                               <span className="text-[9px] text-ghost font-mono uppercase tracking-widest">Valuation</span>
                               <span className="text-xl font-bold text-white font-display">${item.pricing.amount}</span>
                           </div>
                           <button className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-cyan transition-all flex items-center gap-2 shadow-lg">
                               Acquire <ArrowRight size={12} />
                           </button>
                       </div>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};

export default Wishlist;
