
import React from 'react';
import { CATEGORIES } from '../../constants.ts';
import { Layers, Activity, Scale, HeartPulse, PieChart } from 'lucide-react';

const iconMap: any = {
  legal: Scale,
  healthcare: HeartPulse,
  finance: PieChart,
  support: Activity,
  marketing: Layers
};

const Categories: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {CATEGORIES.map(cat => {
        const Icon = iconMap[cat.id] || Layers;
        return (
          <button key={cat.id} className="concrete-card p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-all group border-white/5 hover:border-neon-cyan/30">
            <div className="w-12 h-12 bg-void-300 rounded-full flex items-center justify-center text-ghost group-hover:text-neon-cyan group-hover:scale-110 transition-all">
               <Icon size={20} />
            </div>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-widest">{cat.name}</span>
          </button>
        )
      })}
    </div>
  );
};

export default Categories;
