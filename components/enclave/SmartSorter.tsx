
import React from 'react';
import { Filter, Star, Clock, Tag, X } from 'lucide-react';
import { Listing } from '../../types.ts';

interface SmartSorterProps {
  listings: Listing[];
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
  sortConfig: {
    key: 'auditScore' | 'createdAt';
    direction: 'asc' | 'desc';
  };
  setSortConfig: (config: { key: 'auditScore' | 'createdAt', direction: 'asc' | 'desc' }) => void;
  filterHighAudit: boolean;
  setFilterHighAudit: (val: boolean) => void;
  filterRecent: boolean;
  setFilterRecent: (val: boolean) => void;
}

const SmartSorter: React.FC<SmartSorterProps> = ({ 
  listings, 
  activeCategories, 
  setActiveCategories,
  sortConfig,
  setSortConfig,
  filterHighAudit,
  setFilterHighAudit,
  filterRecent,
  setFilterRecent
}) => {
  // Extract unique categories from listings
  const categories: string[] = Array.from(new Set(listings.map(l => l.category)));

  const toggleCategory = (category: string) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter(c => c !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  return (
    <div className="bg-black/60 border-4 border-black p-8 mb-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-brutalist">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black border-2 border-black shadow-[2px_2px_0px_#D98A2E] flex items-center justify-center text-signal">
            <Filter size={20} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Smart_Sorter_</h4>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] font-black">Optimizing_Node_Inventory_View_</p>
          </div>
        </div>

        {/* Filter Chips (Boolean) */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilterHighAudit(!filterHighAudit)}
            className={`px-5 py-2.5 border-4 border-black text-[10px] font-mono font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              filterHighAudit 
                ? 'bg-signal text-black' 
                : 'bg-black text-zinc-500 hover:text-white'
            }`}
          >
            Audit_Score_&gt;=90
          </button>

          <button
            onClick={() => setFilterRecent(!filterRecent)}
            className={`px-5 py-2.5 border-4 border-black text-[10px] font-mono font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              filterRecent 
                ? 'bg-signal text-black' 
                : 'bg-black text-zinc-500 hover:text-white'
            }`}
          >
            Recent_Deployment_
          </button>

          <div className="h-10 w-[2px] bg-zinc-800 mx-2 hidden md:block" />

          {/* Sort Controls */}
          <button
            onClick={() => setSortConfig({ 
              key: 'auditScore', 
              direction: sortConfig.key === 'auditScore' && sortConfig.direction === 'desc' ? 'asc' : 'desc' 
            })}
            className={`flex items-center gap-2 px-5 py-2.5 border-4 border-black text-[10px] font-mono font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              sortConfig.key === 'auditScore' 
                ? 'bg-white text-black' 
                : 'bg-black text-zinc-500 hover:text-white'
            }`}
          >
            <Star size={12} />
            Sort_Value_ {sortConfig.key === 'auditScore' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
          </button>

          <button
            onClick={() => setSortConfig({ 
              key: 'createdAt', 
              direction: sortConfig.key === 'createdAt' && sortConfig.direction === 'desc' ? 'asc' : 'desc' 
            })}
            className={`flex items-center gap-2 px-5 py-2.5 border-4 border-black text-[10px] font-mono font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              sortConfig.key === 'createdAt' 
                ? 'bg-white text-black' 
                : 'bg-black text-zinc-500 hover:text-white'
            }`}
          >
            <Clock size={12} />
            Sort_Age_ {sortConfig.key === 'createdAt' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="space-y-4 pt-4 border-t-2 border-zinc-900">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] font-black flex items-center gap-2">
            <Tag size={12} /> Filter_By_Protocol_Category_
          </span>
          {(activeCategories.length > 0 || filterHighAudit || filterRecent) && (
            <button 
              onClick={() => {
                setActiveCategories([]);
                setFilterHighAudit(false);
                setFilterRecent(false);
              }}
              className="text-[10px] text-zinc-500 hover:text-red-500 transition-all uppercase font-black flex items-center gap-2"
            >
              <X size={12} /> Purge_Filters_
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 border-2 text-[10px] font-mono font-black uppercase tracking-wider transition-all ${
                activeCategories.includes(category)
                  ? 'bg-signal text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-black text-zinc-600 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
          {categories.length === 0 && (
              <span className="text-[10px] text-zinc-800 font-mono italic font-black uppercase tracking-widest">No protocols detected in sector_</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartSorter;
