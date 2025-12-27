import React, { useState, useMemo } from 'react';
import { Listing, AssetType, PageView } from '../types.ts';
import { ASSET_TYPES, CATEGORIES, FEATURED_LISTINGS_DEMO, SORT_OPTIONS } from '../constants.ts';
import ListingCard from '../components/marketplace/ListingCard.tsx';
import { Search, SlidersHorizontal, ArrowLeft, Filter, X } from 'lucide-react';

interface MarketplacePageProps {
  // Added listings prop to match usage in App.tsx
  listings: Listing[];
  onNavigate: (page: PageView) => void;
  onOpenListing: (listing: Listing) => void;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ listings, onNavigate, onOpenListing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minAuditScore, setMinAuditScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('trending');
  const [showFilters, setShowFilters] = useState(true);

  // Filter Logic - updated to use listings prop
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedType !== 'all' && listing.type !== selectedType) return false;
      if (selectedCategory !== 'all' && listing.category !== selectedCategory) return false;
      if (listing.auditScore < minAuditScore) return false;
      return true;
    }).sort((a, b) => {
        if (sortBy === 'price_low') return a.pricing.amount - b.pricing.amount;
        if (sortBy === 'price_high') return b.pricing.amount - a.pricing.amount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // Default
    });
  }, [listings, searchQuery, selectedType, selectedCategory, minAuditScore, sortBy]);

  return (
    <div className="min-h-screen bg-void pt-20 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center gap-4">
             <button onClick={() => onNavigate('landing')} className="text-ghost hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <h1 className="text-2xl font-display font-bold text-white">Marketplace</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" size={16} />
                <input 
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-void-200 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-ghost focus:outline-none focus:border-neon-cyan/50 transition-colors"
                />
            </div>
            
            <div className="flex gap-3">
               <button 
                 onClick={() => setShowFilters(!showFilters)}
                 className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showFilters ? 'bg-void-200 border-white/20 text-white' : 'border-white/10 text-ghost hover:text-white'}`}
               >
                 <Filter size={16} />
                 Filters
               </button>
               <div className="relative">
                 <select 
                   value={sortBy} 
                   onChange={(e) => setSortBy(e.target.value)}
                   className="appearance-none bg-void-200 border border-white/10 rounded-lg pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan/50"
                 >
                   {SORT_OPTIONS.map(opt => (
                     <option key={opt.value} value={opt.value}>{opt.label}</option>
                   ))}
                 </select>
               </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
             <aside className="w-64 flex-shrink-0 space-y-8 animate-in slide-in-from-left-4 duration-300">
                {/* Asset Types */}
                <div>
                   <h3 className="text-xs font-mono font-bold text-ghost uppercase tracking-wider mb-3">Asset Type</h3>
                   <div className="space-y-1">
                      <button 
                        onClick={() => setSelectedType('all')}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedType === 'all' ? 'bg-neon-cyan/10 text-neon-cyan font-medium' : 'text-ghost-light hover:text-white hover:bg-white/5'}`}
                      >
                        All Assets
                      </button>
                      {ASSET_TYPES.map(type => (
                        <button 
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedType === type.id ? 'bg-neon-cyan/10 text-neon-cyan font-medium' : 'text-ghost-light hover:text-white hover:bg-white/5'}`}
                        >
                          {type.name}s
                        </button>
                      ))}
                   </div>
                </div>

                {/* Categories */}
                <div>
                   <h3 className="text-xs font-mono font-bold text-ghost uppercase tracking-wider mb-3">Category</h3>
                   <div className="space-y-1">
                      <button 
                        onClick={() => setSelectedCategory('all')}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedCategory === 'all' ? 'bg-neon-cyan/10 text-neon-cyan font-medium' : 'text-ghost-light hover:text-white hover:bg-white/5'}`}
                      >
                        All Categories
                      </button>
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedCategory === cat.id ? 'bg-neon-cyan/10 text-neon-cyan font-medium' : 'text-ghost-light hover:text-white hover:bg-white/5'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Audit Score Slider */}
                <div>
                   <h3 className="text-xs font-mono font-bold text-ghost uppercase tracking-wider mb-3">Min. Audit Score</h3>
                   <div className="px-1">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={minAuditScore} 
                        onChange={(e) => setMinAuditScore(parseInt(e.target.value))}
                        className="w-full h-1 bg-void-300 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2 text-xs text-ghost font-mono">
                        <span>0</span>
                        <span className="text-neon-cyan font-bold">{minAuditScore}+</span>
                        <span>100</span>
                      </div>
                   </div>
                </div>
             </aside>
          )}

          {/* Grid */}
          <main className="flex-grow">
             {filteredListings.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                 <div className="w-16 h-16 bg-void-300 rounded-full flex items-center justify-center mb-4 text-ghost">
                    <Search size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">No listings found</h3>
                 <p className="text-ghost text-sm max-w-xs mx-auto">Try adjusting your search terms or filters to find what you're looking for.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredListings.map(listing => (
                   <ListingCard 
                     key={listing.id} 
                     listing={listing} 
                     onClick={() => onOpenListing(listing)}
                   />
                 ))}
               </div>
             )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;