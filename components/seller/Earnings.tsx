
import React from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowDownLeft, ArrowUpRight, Download, PieChart } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const Earnings: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        
        {/* Main Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 concrete-card p-10 rounded-[2.5rem] bg-black/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <header className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-2 flex items-center gap-2">
                            <DollarSign size={12} /> Total Revenue (Net)
                        </div>
                        <div className="text-6xl font-black text-white font-display tracking-tight">$42,850.50</div>
                    </div>
                    <Badge variant="green" size="md">+14.2% vs Last Month</Badge>
                </header>

                {/* CSS/SVG Area Chart */}
                <div className="h-48 w-full relative mt-auto">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0,80 C20,70 40,90 60,40 S80,10 100,20 L100,100 L0,100 Z" fill="url(#revenue-grad)" />
                        <path d="M0,80 C20,70 40,90 60,40 S80,10 100,20" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </svg>
                    {/* Data Points */}
                    <div className="absolute top-[20%] right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-white shadow-[0_0_15px_rgba(16,185,129,1)] animate-pulse" />
                </div>
                
                <div className="flex justify-between mt-4 text-[9px] font-mono text-ghost uppercase tracking-widest relative z-10">
                    <span>Oct 01</span>
                    <span>Oct 15</span>
                    <span>Nov 01</span>
                    <span>Nov 15</span>
                    <span>Today</span>
                </div>
            </div>

            <div className="space-y-8">
                <div className="concrete-card p-8 rounded-3xl bg-black/40 border-white/5">
                    <div className="flex items-center gap-3 mb-4 text-ghost uppercase text-[10px] font-mono tracking-widest">
                        <Calendar size={14} /> Next Payout
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">Dec 01, 2024</div>
                    <div className="text-sm text-neon-gold font-mono mb-6">$3,420.00 Pending</div>
                    <div className="w-full bg-void-300 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-neon-gold h-full w-[85%] relative">
                            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                    </div>
                    <div className="mt-2 text-right text-[8px] font-mono text-ghost uppercase">85% to Threshold</div>
                </div>

                <div className="concrete-card p-8 rounded-3xl bg-neon-cyan/5 border-neon-cyan/10 flex items-center justify-between group cursor-pointer hover:bg-neon-cyan/10 transition-colors">
                    <div>
                        <div className="text-white font-bold text-lg mb-1">Download Report</div>
                        <div className="text-[10px] text-ghost font-mono uppercase tracking-widest">CSV / PDF Format</div>
                    </div>
                    <div className="w-12 h-12 bg-neon-cyan text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Download size={20} />
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="concrete-card rounded-[2.5rem] overflow-hidden bg-black/20 border-white/5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-3">
                    <PieChart size={16} className="text-neon-purple" /> Revenue Sources
                </h3>
                <div className="flex gap-2">
                    <Badge variant="gray">Last 30 Days</Badge>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {[
                    { label: 'One-Time Sales', val: '$24,200', pct: '56%', trend: '+8%', color: 'blue' },
                    { label: 'Subscriptions', val: '$12,450', pct: '29%', trend: '+22%', color: 'purple' },
                    { label: 'API Metering', val: '$6,200', pct: '15%', trend: '+4%', color: 'orange' },
                ].map((stat, i) => (
                    <div key={i} className="p-8 hover:bg-white/[0.02] transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-3 h-3 rounded-full bg-neon-${stat.color} shadow-[0_0_10px_currentColor]`} />
                            <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded border border-neon-green/20">{stat.trend}</span>
                        </div>
                        <div className="text-2xl font-black text-white mb-1">{stat.val}</div>
                        <div className="flex justify-between items-end">
                            <div className="text-xs text-ghost uppercase font-mono tracking-widest">{stat.label}</div>
                            <div className="text-sm font-bold text-white opacity-50">{stat.pct}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Earnings;
