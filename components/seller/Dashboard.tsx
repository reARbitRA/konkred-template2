
import React from 'react';
import { Activity, TrendingUp, Users, DollarSign } from 'lucide-react';

const DashboardWidget: React.FC = () => {
  return (
    <div className="concrete-card bg-black/40 border-white/5 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} className="text-neon-green" /> Node Status
        </h3>
        <span className="flex items-center gap-1.5 text-[9px] font-mono text-neon-green">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
          ONLINE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-void-200 rounded-2xl border border-white/5">
          <div className="text-[9px] font-mono text-ghost uppercase tracking-widest mb-2">Revenue (24h)</div>
          <div className="text-xl font-black text-white flex items-center gap-1">
            <span className="text-neon-cyan">$</span>842.00
          </div>
        </div>
        <div className="p-4 bg-void-200 rounded-2xl border border-white/5">
          <div className="text-[9px] font-mono text-ghost uppercase tracking-widest mb-2">Views</div>
          <div className="text-xl font-black text-white flex items-center gap-2">
            2.4k <TrendingUp size={12} className="text-neon-green" />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-ghost">Profile Rating</span>
          <span className="text-white font-bold">4.9/5.0</span>
        </div>
        <div className="w-full h-1 bg-void-400 rounded-full overflow-hidden">
          <div className="h-full bg-neon-purple w-[98%]"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidget;
