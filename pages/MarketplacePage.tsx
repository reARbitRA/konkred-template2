
import React, { useState, useEffect, useMemo } from 'react';
import { Listing, PageView } from '../types.ts';
import { SORT_OPTIONS } from '../constants.ts';
import { databaseService } from '../services/database.ts';

// Components
import SearchBar from '../components/marketplace/SearchBar.tsx';
import Filters from '../components/marketplace/Filters.tsx';
import ListingGrid from '../components/marketplace/ListingGrid.tsx';
import { SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface MarketplacePageProps {
  onNavigate: (page: PageView) => void;
  onOpenListing: (listing: Listing) => void;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate, onOpenListing }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState('trending');

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      const data = await databaseService.getListings({
        query: searchQuery,
        type: selectedType,
        category: selectedCategory,
        minScore,
        sortBy
      });
      setListings(data);
      setIsLoading(false);
    };

    const debounce = setTimeout(fetchListings, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedType, selectedCategory, minScore, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedCategory !== 'all') count++;
    if (minScore > 0) count++;
    return count;
  }, [selectedType, selectedCategory, minScore]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setMinScore(0);
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-32 px-8">
      <div className="max-w-[1600px] mx-auto">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>
        
        {/* Header System */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-2">
            <h1 className="text-5xl font-display font-black text-white tracking-tight leading-none uppercase">Marketplace</h1>
            <div className="flex items-center gap-4 text-ghost font-mono text-[9px] uppercase tracking-[0.4em]">
                <span>Verified Assets: {listings.length}</span>
                <span className="text-white/10">|</span>
                <span>Active Node: US-EAST-1</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <SearchBar 
              onSearch={setSearchQuery} 
              onToggleFilters={() => setShowMobileFilters(true)}
              activeFiltersCount={activeFiltersCount}
            />
            
            <div className="relative group min-w-[180px]">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost pointer-events-none" size={14} />
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-void-100 border border-white/10 text-ghost text-[10px] font-mono font-bold uppercase tracking-widest pl-12 pr-4 py-4 rounded-xl outline-none focus:border-neon-cyan appearance-none cursor-pointer hover:bg-white/5 transition-all"
                >
                    {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
          </div>
        </header>

        <div className="flex gap-16">
          {/* Desktop Filters */}
          <div className="hidden xl:block">
            <Filters 
              selectedType={selectedType}
              selectedCategory={selectedCategory}
              minScore={minScore}
              onTypeChange={setSelectedType}
              onCategoryChange={setSelectedCategory}
              onScoreChange={setMinScore}
              onReset={handleReset}
            />
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <ListingGrid 
              listings={listings} 
              isLoading={isLoading} 
              onOpenListing={onOpenListing} 
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] bg-void p-8 overflow-y-auto animate-in slide-in-from-bottom duration-300">
           <Filters 
              isMobile
              onClose={() => setShowMobileFilters(false)}
              selectedType={selectedType}
              selectedCategory={selectedCategory}
              minScore={minScore}
              onTypeChange={setSelectedType}
              onCategoryChange={setSelectedCategory}
              onScoreChange={setMinScore}
              onReset={handleReset}
            />
            <button 
                onClick={() => setShowMobileFilters(false)}
                className="btn-primary w-full py-5 mt-12 text-xs font-black uppercase tracking-widest"
            >
                Confirm Filters
            </button>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
