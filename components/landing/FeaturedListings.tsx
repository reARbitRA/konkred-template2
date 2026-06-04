import React, { useState, useEffect } from 'react';
import { Listing } from '../../types.ts';
import { databaseService } from '../../services/database.ts';
import { Star, ArrowUpRight, Loader2 } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const FeaturedListings: React.FC<{ onNavigate: (page: any) => void; onOpenListing: (l: Listing) => void }> = ({ onNavigate, onOpenListing }) => {
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const data = await databaseService.getListings({
          limit: 3,
          sortBy: 'featured'
        });
        setFeatured(data);
      } catch (err) {
        console.error("Featured fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-32 bg-void relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="flex justify-between items-end mb-16">
           <div>
              <h2 className="text-4xl font-display font-black text-white uppercase tracking-tight mb-2">Curated <span className="text-neon-purple">Drops</span></h2>
              <p className="text-ghost font-mono text-sm uppercase tracking-[0.2em]">High-Demand Architectures</p>
           </div>
           <button onClick={() => onNavigate('marketplace')} className="text-xs font-bold font-mono text-white hover:text-neon-purple transition-colors flex items-center gap-2 group uppercase tracking-widest">
              View Marketplace <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[420px] rounded-[2rem] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {featured.map((listing, i) => (
               /* FIX: Ensured the key is passed here in the parent map, while TiltCard is correctly typed to handle it */
               <TiltCard key={listing.id} listing={listing} onClick={() => onOpenListing(listing)} index={i} />
             ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* FIX: Explicitly typed TiltCard as React.FC to handle React-specific props like key correctly and ensure clear prop definition */
interface TiltCardProps {
  listing: Listing;
  onClick: () => void;
  index: number;
}

const TiltCard: React.FC<TiltCardProps> = ({ listing, onClick, index }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative h-[420px] w-full perspective-1000 cursor-pointer"
    >
      <div className="relative h-full w-full bg-[#0a0a0c] border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col">
         <div className="p-8 flex-1 flex flex-col z-10 relative">
            <div className="flex justify-between items-start mb-6">
               <Badge variant={index % 2 === 0 ? 'purple' : 'cyan'} className="backdrop-blur-md bg-opacity-10">{listing.type}</Badge>
               <div className="flex items-center gap-1.5 text-white font-bold text-xs bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                  <Star size={12} className="fill-neon-gold text-neon-gold" /> {listing.rating}
               </div>
            </div>

            <div className="flex-1">
               <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight group-hover:text-neon-purple transition-colors">{listing.title}</h3>
               <p className="text-sm text-ghost leading-relaxed line-clamp-3">{listing.shortDescription}</p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-ghost uppercase tracking-widest mb-1">Settlement</span>
                  <span className="text-xl font-bold text-white">${listing.pricing.amount}</span>
               </div>
               <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300`}>
                  <ArrowUpRight size={18} />
               </div>
            </div>
         </div>

         <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
         <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-neon-${index % 2 === 0 ? 'purple' : 'cyan'}/10 blur-[60px] rounded-full group-hover:opacity-100 opacity-50 transition-opacity duration-700`} />
      </div>
    </div>
  );
};

export default FeaturedListings;