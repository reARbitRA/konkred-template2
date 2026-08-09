
import React from 'react';
import { Listing } from '../../types.ts';
import ListingCard from './ListingCard.tsx';
import { SearchX, LayoutGrid, List } from 'lucide-react';
import Loader from '../common/Loader.tsx';

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
  onOpenListing: (listing: Listing) => void;
  onQuickTest?: (listing: Listing) => void;
  viewMode?: 'grid' | 'list';
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading, onOpenListing, onQuickTest, viewMode = 'grid' }) => {
  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-6">
        <Loader size={48} label="Synchronizing Archives..." />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-32 text-center concrete-card border-dashed border-white/10 rounded-[2rem] bg-black/20 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
           <SearchX size={40} className="text-ghost opacity-20" />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">No Match Detected</h3>
        <p className="text-ghost text-sm max-w-xs mx-auto font-light leading-relaxed">
          Refine your search telemetry or recalibrate industry vertical filters.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 text-[10px] font-mono text-neon-cyan hover:text-white uppercase tracking-widest underline decoration-neon-cyan/20"
        >
          Reset Global Telemetry
        </button>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
        : 'grid-cols-1'
    } animate-in fade-in duration-700`}>
      {listings.map(listing => (
        <ListingCard 
          key={listing.id} 
          listing={listing} 
          onClick={() => onOpenListing(listing)} 
          onQuickTest={onQuickTest ? () => onQuickTest(listing) : undefined}
        />
      ))}
    </div>
  );
};

export default ListingGrid;
