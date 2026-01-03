
import React from 'react';
import { BarChart3, TrendingUp, ArrowUpRight, Zap, Target } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Performance Graph */}
        <div className="lg:col-span-8 concrete-card p-10 rounded-[2.5rem] bg-black/40">
           <header className="flex justify-between items-center mb-12">
              <div>
                 <h3 className="text-lg font-bold text-white uppercase tracking-tight">Revenue_Stream_Telemetry</h3>
                 <p className="text-[10px] text-ghost font-mono uppercase mt-1 tracking-widest">Global Marketplace Activity // 30D</p>
              </div>
              <div className="flex gap-4">
                 <span className="text-[9px] font-mono text-neon-green bg-neon-green/5 border border-neon-green/20 px-2 py-1 rounded">LIVE_FEED</span>
              </div>
           </header>

           <div className="h-64 w-full relative group">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                   <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff9500" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ff9500" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <path d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,10 L400,100 L0,100 Z" fill="url(#chart-grad)" />
                <path d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,10" fill="none" stroke="#ff9500" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(255,149,0,0.5)]" />
              </svg>
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-6 pointer-events-none border-b border-white/5">
                 {[1,2,3,4,5,6].map(i => <div key={i} className="border-r border-white/[0.03] h-full" />)}
              </div>
           </div>

           <div className="flex justify-between mt-6 font-mono text-[8px] text-ghost uppercase tracking-widest">
              <span>Nov 01</span>
              <span>Nov 10</span>
              <span>Nov 20</span>
              <span>Today</span>
           </div>
        </div>

        {/* Secondary Metrics */}
        <div className="lg:col-span-4 space-y-8">
           <div className="concrete-card p-8 rounded-3xl bg-void-100 border-white/5 flex flex-col justify-between h-[calc(50%-1rem)]">
              <div>
                 <div className="flex justify-between mb-4">
                    <Target size={20} className="text-neon-blue" />
                    <ArrowUpRight size={14} className="text-ghost" />
                 </div>
                 <h4 className="text-[10px] font-mono text-ghost uppercase mb-2">Acquisition Goal</h4>
                 <div className="text-3xl font-black text-white">$15k / $20k</div>
              </div>
              <div className="w-full h-1.5 bg-void-300 rounded-full mt-6 overflow-hidden">
                 <div className="h-full bg-neon-blue w-3/4 animate-pulse" />
              </div>
           </div>

           <div className="concrete-card p-8 rounded-3xl bg-void-100 border-white/5 flex flex-col justify-between h-[calc(50%-1rem)]">
              <div>
                 <div className="flex justify-between mb-4">
                    <Zap size={20} className="text-neon-purple" />
                    <span className="text-[10px] text-neon-green font-mono">+12.4%</span>
                 </div>
                 <h4 className="text-[10px] font-mono text-ghost uppercase mb-2">Node Efficiency</h4>
                 <div className="text-3xl font-black text-white">99.84%</div>
              </div>
              <p className="text-[9px] text-ghost leading-relaxed mt-4">Uptime maintained across global CDN clusters.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
