import React from 'react';
import { Listing } from '../../types.ts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, ArrowUpRight, Zap, Target, Eye, ShoppingCart, Percent } from 'lucide-react';

interface AnalyticsProps {
  listings: Listing[];
}

const Analytics: React.FC<AnalyticsProps> = ({ listings }) => {
  // Define fallback high-fidelity default listings so the dashboard is beautifully populated on first load
  const defaultSellerListings: Listing[] = [
    {
      id: "p1",
      sellerId: "U1",
      seller: { name: "KONKRED Archive", verified: true, totalSales: 142 },
      title: "SaaS Valuation Model v4",
      shortDescription: "DCF & comparable B2B SaaS acquisition framework.",
      description: "",
      type: "protocol",
      category: "Finance",
      pricing: { mode: "one_time", amount: 249, currency: "USD" },
      delivery: "download",
      auditScore: 98,
      rating: 5.0,
      reviewCount: 42,
      featured: true,
      salesCount: 142,
      viewCount: 710,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["Structured Output", "XLSX Source"]
    },
    {
      id: "p2",
      sellerId: "U1",
      seller: { name: "KONKRED Archive", verified: true, totalSales: 210 },
      title: "GDPR Audit Core",
      shortDescription: "EU data privacy compliance checklist.",
      description: "",
      type: "protocol",
      category: "Compliance",
      pricing: { mode: "one_time", amount: 199, currency: "USD" },
      delivery: "download",
      auditScore: 95,
      rating: 4.8,
      reviewCount: 31,
      featured: true,
      salesCount: 210,
      viewCount: 940,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["PDF Gen", "Legal"]
    },
    {
      id: "p3",
      sellerId: "U1",
      seller: { name: "KONKRED Archive", verified: true, totalSales: 88 },
      title: "Crisis Response Unit",
      shortDescription: "Templates for immediate PR crisis management.",
      description: "",
      type: "protocol",
      category: "Operations",
      pricing: { mode: "one_time", amount: 89, currency: "USD" },
      delivery: "download",
      auditScore: 82,
      rating: 4.2,
      reviewCount: 15,
      featured: false,
      salesCount: 88,
      viewCount: 410,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["Playbook"]
    },
    {
      id: "p4",
      sellerId: "U1",
      seller: { name: "KONKRED Archive", verified: true, totalSales: 95 },
      title: "Board Deck Architect",
      shortDescription: "Narrative structures for Series B+ fundraising.",
      description: "",
      type: "protocol",
      category: "Strategy",
      pricing: { mode: "one_time", amount: 349, currency: "USD" },
      delivery: "download",
      auditScore: 95,
      rating: 4.9,
      reviewCount: 42,
      featured: true,
      salesCount: 95,
      viewCount: 480,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["Strategy"]
    }
  ];

  const activeListings = listings.length > 0 ? listings : defaultSellerListings;

  // Prepare data for the Bar Chart
  const chartData = activeListings.map(l => ({
    name: l.title.length > 15 ? l.title.substring(0, 15) + '...' : l.title,
    fullName: l.title,
    Views: l.viewCount,
    Sales: l.salesCount,
    conversionRate: l.viewCount > 0 ? ((l.salesCount / l.viewCount) * 100).toFixed(1) : '0.0'
  }));

  // Aggregated summaries for active listings
  const totalViews = activeListings.reduce((sum, item) => sum + (item.viewCount || 0), 0);
  const totalSales = activeListings.reduce((sum, item) => sum + (item.salesCount || 0), 0);
  const avgConversion = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0.0';

  // Custom tooltips matching the dashboard theme
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-void-100 border border-white/10 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-md">
          <p className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3 pb-1.5 border-b border-white/5">
            {data.fullName}
          </p>
          <div className="space-y-2 text-[11px] font-mono">
            <div className="flex justify-between gap-8 items-center">
              <span className="text-ghost flex items-center gap-1.5 uppercase"><Eye size={10} className="text-neon-cyan" /> Views</span>
              <span className="text-neon-cyan font-black">{data.Views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-8 items-center">
              <span className="text-ghost flex items-center gap-1.5 uppercase"><ShoppingCart size={10} className="text-neon-blue" /> Sales</span>
              <span className="text-neon-blue font-black">{data.Sales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-8 items-center pt-2 border-t border-white/5">
              <span className="text-ghost flex items-center gap-1.5 uppercase"><Percent size={10} className="text-neon-green" /> Conversion</span>
              <span className="text-neon-green font-black">{data.conversionRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      
      {/* Dynamic Snapshot Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="concrete-card p-6 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-ghost uppercase tracking-widest">Total_Protocol_Views</p>
            <p className="text-3xl font-black text-white font-display">{totalViews.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/15 flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(255,149,0,0.1)]">
            <Eye size={20} />
          </div>
        </div>

        <div className="concrete-card p-6 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-ghost uppercase tracking-widest">Total_Acquisitions</p>
            <p className="text-3xl font-black text-white font-display">{totalSales.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-neon-blue/5 border border-neon-blue/15 flex items-center justify-center text-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <ShoppingCart size={20} />
          </div>
        </div>

        <div className="concrete-card p-6 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-ghost uppercase tracking-widest">Avg_Node_Conversion</p>
            <p className="text-3xl font-black text-white font-display">{avgConversion}%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-neon-green/5 border border-neon-green/15 flex items-center justify-center text-neon-green shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Performance Graph */}
        <div className="lg:col-span-8 concrete-card p-10 rounded-[2.5rem] bg-black/40 border border-white/5 flex flex-col justify-between">
           <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                 <h3 className="text-lg font-bold text-white uppercase tracking-tight">Active_Protocol_Telemetry</h3>
                 <p className="text-[10px] text-ghost font-mono uppercase mt-1 tracking-widest">Visualizing client views and acquisition metrics side-by-side</p>
              </div>
              <div className="flex gap-4">
                 <span className="text-[9px] font-mono text-neon-green bg-neon-green/5 border border-neon-green/20 px-3 py-1 rounded-lg uppercase tracking-wider">LIVE_TELEMETRY</span>
              </div>
           </header>

           <div className="h-80 w-full relative bg-void-300/20 p-4 rounded-2xl border border-white/[0.02]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                 >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
                    <XAxis 
                       dataKey="name" 
                       stroke="rgba(255, 255, 255, 0.4)" 
                       fontSize={9} 
                       fontFamily="var(--font-mono, monospace)"
                       tickLine={false}
                       axisLine={false}
                    />
                    <YAxis 
                       stroke="rgba(255, 255, 255, 0.4)" 
                       fontSize={9} 
                       fontFamily="var(--font-mono, monospace)"
                       tickLine={false}
                       axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Legend 
                       verticalAlign="top" 
                       height={36} 
                       iconSize={8}
                       iconType="circle"
                       wrapperStyle={{ 
                          fontSize: '9px', 
                          fontFamily: 'var(--font-mono, monospace)', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.15em',
                          color: '#e4e4e7'
                       }} 
                    />
                    {/* View Count is color #ff9500 (neon-cyan theme) */}
                    <Bar 
                       dataKey="Views" 
                       name="View Telemetry" 
                       fill="#ff9500" 
                       radius={[4, 4, 0, 0]} 
                       maxBarSize={30} 
                    />
                    {/* Sales Count is color #3b82f6 (neon-blue theme) */}
                    <Bar 
                       dataKey="Sales" 
                       name="Sales Telemetry" 
                       fill="#3b82f6" 
                       radius={[4, 4, 0, 0]} 
                       maxBarSize={30} 
                    />
                 </BarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/5 opacity-40" />
           </div>

           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-2 font-mono text-[9px] text-ghost uppercase tracking-widest border-t border-white/5 pt-4">
              <span>ACTIVE LISTINGS: {activeListings.length}</span>
              <span className="text-[8px] opacity-60">AGGREGATE RATIO OUTPERFORMING HIGH-PERFORMANCE BENCHMARK</span>
           </div>
        </div>

        {/* Secondary Metrics */}
        <div className="lg:col-span-4 space-y-8">
           <div className="concrete-card p-8 rounded-3xl bg-void-100 border border-white/5 flex flex-col justify-between h-[calc(50%-1rem)]">
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

           <div className="concrete-card p-8 rounded-3xl bg-void-100 border border-white/5 flex flex-col justify-between h-[calc(50%-1rem)]">
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
