
import React from 'react';
import { ASSET_TYPES, CATEGORIES } from '../../constants.ts';
import { SlidersHorizontal, RotateCcw, X, Shield, Cpu, Filter } from 'lucide-react';

interface FiltersProps {
  selectedType: string;
  selectedCategory: string;
  minScore: number;
  onTypeChange: (type: string) => void;
  onCategoryChange: (cat: string) => void;
  onScoreChange: (score: number) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  selectedType, selectedCategory, minScore,
  onTypeChange, onCategoryChange, onScoreChange, onReset,
  isMobile, onClose
}) => {
  return (
    <aside className={`${isMobile ? 'w-full' : 'w-64'} space-y-10`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-xl font-display font-bold text-white flex items-center gap-3">
             <Filter size={20} className="text-neon-cyan" /> Filters
           </h2>
           <button onClick={onClose} className="p-2 text-ghost hover:text-white"><X /></button>
        </div>
      )}

      <FilterBlock label="Asset Class" icon={Cpu}>
        <SideButton active={selectedType === 'all'} onClick={() => onTypeChange('all')}>All Assets</SideButton>
        {ASSET_TYPES.map(t => (
          <SideButton key={t.id} active={selectedType === t.id} onClick={() => onTypeChange(t.id)}>{t.name}</SideButton>
        ))}
      </FilterBlock>

      <FilterBlock label="Industry Verticals" icon={SlidersHorizontal}>
        <SideButton active={selectedCategory === 'all'} onClick={() => onCategoryChange('all')}>All Industries</SideButton>
        {CATEGORIES.map(c => (
          <SideButton key={c.id} active={selectedCategory === c.id} onClick={() => onCategoryChange(c.id)}>{c.name}</SideButton>
        ))}
      </FilterBlock>

      <FilterBlock label="Min Audit Score" icon={Shield}>
        <div className="px-2 pt-2">
          <input 
            type="range" min="0" max="100" step="5" 
            value={minScore} onChange={(e) => onScoreChange(parseInt(e.target.value))}
            className="w-full h-1 bg-void-300 rounded-lg appearance-none cursor-pointer accent-neon-cyan" 
          />
          <div className="flex justify-between text-[10px] font-mono text-ghost mt-3">
            <span className="opacity-50">SCORE_0</span>
            <span className="text-neon-cyan font-black bg-neon-cyan/5 border border-neon-cyan/20 px-2 py-0.5 rounded">
              {minScore}+
            </span>
            <span className="opacity-50">100</span>
          </div>
        </div>
      </FilterBlock>

      <button 
        onClick={onReset}
        className="w-full py-4 border border-dashed border-white/10 text-[10px] font-mono text-ghost hover:text-white hover:border-white/30 hover:bg-white/5 transition-all rounded-xl flex items-center justify-center gap-3"
      >
        <RotateCcw size={12} />
        RESET TELEMETRY
      </button>
    </aside>
  );
};

const FilterBlock = ({ label, icon: Icon, children }: any) => (
  <div className="space-y-5">
    <h3 className="text-[10px] font-mono font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
      <Icon size={12} className="text-neon-cyan" /> {label}
    </h3>
    <div className="flex flex-col gap-1.5">{children}</div>
  </div>
);

const SideButton = ({ active, onClick, children }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all border ${
      active 
        ? 'bg-neon-cyan/10 text-neon-cyan font-bold border-neon-cyan/30 shadow-[0_0_15px_rgba(255,149,0,0.05)]' 
        : 'text-ghost border-transparent hover:text-white hover:bg-white/5 hover:border-white/5'
    }`}
  >
    {children}
  </button>
);

export default Filters;
