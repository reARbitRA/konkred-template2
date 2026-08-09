
import React, { useState, useEffect, useMemo } from 'react';
import { Listing, PageView } from '../types.ts';
import { SORT_OPTIONS } from '../constants.ts';
import { databaseService } from '../services/database.ts';

// Components
import SearchBar from '../components/marketplace/SearchBar.tsx';
import Filters from '../components/marketplace/Filters.tsx';
import ListingGrid from '../components/marketplace/ListingGrid.tsx';
import AppTester from '../components/common/AppTester.tsx';
import { SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface MarketplacePageProps {
  onNavigate: (page: PageView) => void;
  onOpenListing: (listing: Listing) => void;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ onNavigate, onOpenListing }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [testingListing, setTestingListing] = useState<Listing | null>(null);

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
              onQuickTest={(listing) => setTestingListing(listing)}
            />
          </div>
        </div>

        {/* AppTester Modal */}
        {testingListing && (
          <AppTester 
            listing={testingListing} 
            isOpen={!!testingListing} 
            onClose={() => setTestingListing(null)} 
            onAcquire={(l) => {
              setTestingListing(null);
              onOpenListing(l);
            }} 
          />
        )}

        {/* Pricing Matrix Section */}
        <section className="mt-28 pt-20 border-t border-white/5 space-y-12" id="marketplace-pricing-matrix">
           <div className="text-center space-y-4">
              <span className="text-[10px] font-mono tracking-[0.3em] text-accent-cyan uppercase bg-accent-cyan/10 px-3 py-1.5 rounded-full border border-accent-cyan/20">
                 Licensing Nodes
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-white font-display">Transparent Licensing Plans</h2>
              <p className="text-text-secondary max-w-md mx-auto text-sm font-light">
                 Acquire instant access to the entire repository or deploy to independent enclaves.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-surface-1 border border-white/5 hover:border-accent-cyan/20 transition-all rounded-2xl p-8 flex flex-col justify-between">
                 <div className="space-y-4">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary">Free Tier</span>
                    <h3 className="text-2xl font-bold text-white font-display">Explorer</h3>
                    <div className="flex items-baseline gap-1">
                       <span className="text-4xl font-extrabold text-white font-mono">$0</span>
                       <span className="text-xs text-text-secondary">/ forever</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-light">
                       Access to basic applications, public models, and standardized system instructions with simple email opt-in.
                    </p>
                    <ul className="space-y-2 pt-4 text-xs text-text-secondary border-t border-white/5">
                       <li className="flex items-center gap-2">🟢 Basic App Library</li>
                       <li className="flex items-center gap-2">🟢 Client-side caching</li>
                       <li className="flex items-center gap-2">🟢 Standard logic nodes</li>
                    </ul>
                 </div>
                 <button onClick={() => onNavigate('contact')} className="w-full mt-8 py-3 bg-surface-2 hover:bg-surface-1 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-white/5 transition-all">
                    Register Client Node
                 </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-surface-1 border border-accent-cyan/30 shadow-lg shadow-accent-cyan/5 transition-all rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-accent-cyan text-black text-[9px] font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl">
                    Popular
                 </div>
                 <div className="space-y-4">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-accent-cyan">Pro Tier</span>
                    <h3 className="text-2xl font-bold text-white font-display">Professional</h3>
                    <div className="flex items-baseline gap-1">
                       <span className="text-4xl font-extrabold text-white font-mono">$49</span>
                       <span className="text-xs text-text-secondary">/ month</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-light">
                       Full access to all 50+ applications, premium agent endpoints, custom prompt variables, and automatic updates.
                    </p>
                    <ul className="space-y-2 pt-4 text-xs text-text-secondary border-t border-white/5">
                       <li className="flex items-center gap-2">🟢 Complete 50+ Apps</li>
                       <li className="flex items-center gap-2">🟢 Priority model routers</li>
                       <li className="flex items-center gap-2">🟢 Weekly logic patches</li>
                    </ul>
                 </div>
                 <button onClick={() => onNavigate('contact')} className="w-full mt-8 py-3 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all font-bold">
                    Establish Uplink
                 </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-surface-1 border border-white/5 hover:border-neon-purple/20 transition-all rounded-2xl p-8 flex flex-col justify-between">
                 <div className="space-y-4">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary">Dedicated Enclave</span>
                    <h3 className="text-2xl font-bold text-white font-display">Enterprise / Custom</h3>
                    <div className="flex items-baseline gap-1">
                       <span className="text-4xl font-extrabold text-white font-mono">Custom</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-light">
                       Bespoke deployment inside clean server clusters, proprietary database structures, and Arbitra 4 validation.
                    </p>
                    <ul className="space-y-2 pt-4 text-xs text-text-secondary border-t border-white/5">
                       <li className="flex items-center gap-2">🟢 Direct database integrations</li>
                       <li className="flex items-center gap-2">🟢 Full API proxy systems</li>
                       <li className="flex items-center gap-2">🟢 Live prompt audits</li>
                    </ul>
                 </div>
                 <button onClick={() => onNavigate('contact')} className="w-full mt-8 py-3 bg-surface-2 hover:bg-surface-1 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl border border-white/5 transition-all">
                    Initiate Advisory
                 </button>
              </div>
           </div>
        </section>
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
