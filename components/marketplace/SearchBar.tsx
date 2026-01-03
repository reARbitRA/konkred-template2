
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { databaseService } from '../../services/database.ts';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onToggleFilters: () => void;
  activeFiltersCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onToggleFilters, activeFiltersCount }) => {
  const [query, setQuery] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRecent = async () => {
      const data = await databaseService.getRecentSearches();
      setRecent(data);
    };
    loadRecent();

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (q: string) => {
    setQuery(q);
    onSearch(q);
    databaseService.saveSearch(q);
    setShowRecent(false);
  };

  return (
    <div className="relative w-full md:w-[500px]" ref={containerRef}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost group-focus-within:text-neon-cyan transition-colors" size={18} />
        <input 
          value={query}
          onFocus={() => setShowRecent(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value); // Real-time debounce handled by parent ideally
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleExecuteSearch(query)}
          placeholder="Query protocol library..." 
          className="w-full bg-void-100 border border-white/10 rounded-2xl pl-12 pr-24 py-4 text-sm text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 outline-none transition-all placeholder:text-ghost/50" 
        />
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button onClick={() => handleExecuteSearch('')} className="p-1.5 hover:bg-white/5 rounded-lg text-ghost">
              <X size={16} />
            </button>
          )}
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button 
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
              activeFiltersCount > 0 ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'text-ghost hover:text-white hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal size={14} />
            {activeFiltersCount > 0 && <span>{activeFiltersCount}</span>}
          </button>
        </div>
      </div>

      {/* Recent Searches Dropdown */}
      {showRecent && recent.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 concrete-card bg-void-50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-white/5 bg-white/[0.02]">
            <span className="text-[9px] font-mono text-ghost uppercase tracking-widest px-2">Recent Uplinks</span>
          </div>
          <div className="flex flex-col">
            {recent.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleExecuteSearch(s)}
                className="flex items-center gap-3 px-5 py-3 text-xs text-ghost-light hover:text-white hover:bg-white/5 text-left group transition-colors"
              >
                <Clock size={12} className="text-ghost group-hover:text-neon-cyan" />
                <span className="flex-1 truncate">{s}</span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-neon-cyan" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
