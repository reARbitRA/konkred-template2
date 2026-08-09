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
  // Define fallback high-fidelity default listings
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["PDF Gen", "Legal"]
    }
  ];

  const activeListings = listings.length > 0 ? listings : defaultSellerListings;

  // Prepare data for the Bar Chart
  const chartData = activeListings.map(l => ({
    name: l.title.length > 12 ? l.title.substring(0, 10) + '...' : l.title,
    fullName: l.title,
    Views: l.viewCount,
    Sales: l.salesCount,
    conversionRate: l.viewCount > 0 ? ((l.salesCount / l.viewCount) * 100).toFixed(1) : '0.0'
  }));

  const totalViews = activeListings.reduce((sum, item) => sum + (item.viewCount || 0), 0);
  const totalSales = activeListings.reduce((sum, item) => sum + (item.salesCount || 0), 0);
  const avgConversion = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(1) : '0.0';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black border-4 border-black p-5 shadow-[4px_4px_0px_#000] relative z-20">
          <p className="text-[10px] font-mono font-black text-white uppercase tracking-wider mb-3 pb-2 border-b-2 border-black">
            {data.fullName}
          </p>
          <div className="space-y-2 text-[10px] font-mono">
            <div className="flex justify-between gap-8 items-center">
              <span className="text-zinc-400 flex items-center gap-1.5 uppercase font-bold text-[9px]"><Eye size={12} className="text-signal" /> Views_</span>
              <span className="text-white font-black">{data.Views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-8 items-center">
              <span className="text-zinc-400 flex items-center gap-1.5 uppercase font-bold text-[9px]"><ShoppingCart size={12} className="text-[#22d3ee]" /> Sales_</span>
              <span className="text-[#22d3ee] font-black">{data.Sales.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-8 items-center pt-2 border-t-2 border-black">
              <span className="text-zinc-400 flex items-center gap-1.5 uppercase font-bold text-[9px]"><Percent size={12} className="text-signal" /> Conv_</span>
              <span className="text-signal font-black">{data.conversionRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total_Node_Views', val: totalViews.toLocaleString(), icon: Eye, color: 'text-signal' },
          { label: 'Total_Acquisitions', val: totalSales.toLocaleString(), icon: ShoppingCart, color: 'text-[#22d3ee]' },
          { label: 'Avg_Conversion_Rate', val: `${avgConversion}%`, icon: TrendingUp, color: 'text-signal' }
        ].map((stat, i) => (
          <div key={i} className="bg-void-100 border-4 border-black p-6 flex items-center justify-between shadow-brutalist hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutalist-hover transition-all">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-3xl font-display font-black text-white">{stat.val}</p>
            </div>
            <div className={`w-12 h-12 border-4 border-black bg-black flex items-center justify-center ${stat.color} shadow-[2px_2px_0px_#000]`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart Card */}
        <div className="lg:col-span-8 bg-void-100 border-4 border-black p-8 shadow-brutalist flex flex-col justify-between">
           <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div className="space-y-1">
                 <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Node_Telemetry_Report</h3>
                 <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">Protocol engagement vs acquisition capacity</p>
              </div>
              <div className="bg-black px-4 py-1.5 border-2 border-black shadow-[2px_2px_0px_#D98A2E]">
                 <span className="text-[9px] font-mono text-signal font-black uppercase tracking-widest animate-pulse">SYSTEM_LIVE_</span>
              </div>
           </header>

           <div className="h-96 w-full relative bg-black p-6 border-4 border-black shadow-[4px_4px_0px_#000]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                    <XAxis 
                       dataKey="name" 
                       stroke="#71717a" 
                       fontSize={9} 
                       fontFamily="JetBrains Mono"
                       tickLine={false}
                       axisLine={false}
                       className="uppercase font-bold"
                    />
                    <YAxis 
                       stroke="#71717a" 
                       fontSize={9} 
                       fontFamily="JetBrains Mono"
                       tickLine={false}
                       axisLine={false}
                       className="uppercase font-bold"
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(217,138,46,0.05)' }} />
                    <Legend 
                       verticalAlign="top" 
                       height={40} 
                       iconSize={10}
                       iconType="rect"
                       wrapperStyle={{ 
                          fontSize: '10px', 
                          fontFamily: 'JetBrains Mono', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.15em',
                          fontWeight: '900',
                          color: '#fff',
                          paddingBottom: '20px'
                       }} 
                    />
                    <Bar dataKey="Views" name="Views_" fill="#D98A2E" radius={0} maxBarSize={30} stroke="#000" strokeWidth={2} />
                    <Bar dataKey="Sales" name="Sales_" fill="#22d3ee" radius={0} maxBarSize={30} stroke="#000" strokeWidth={2} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Secondary Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-black border-4 border-black p-8 shadow-brutalist flex flex-col justify-between h-[250px] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutalist-hover transition-all">
              <div>
                 <div className="flex justify-between mb-6">
                    <div className="w-10 h-10 bg-signal text-black border-2 border-black flex items-center justify-center font-black">
                      <Target size={20} />
                    </div>
                    <ArrowUpRight size={16} className="text-zinc-500" />
                 </div>
                 <h4 className="text-[10px] font-mono text-zinc-500 uppercase mb-2 font-bold tracking-widest">Target_Liquidity_Threshold</h4>
                 <div className="text-4xl font-display font-black text-white">$15K <span className="text-zinc-700 text-xl">/ $20K</span></div>
              </div>
              <div className="w-full h-4 bg-zinc-900 border-2 border-black mt-8">
                 <div className="h-full bg-signal border-r-2 border-black w-3/4 shadow-[0_0_10px_rgba(217,138,46,0.3)]" />
              </div>
           </div>

           <div className="bg-signal border-4 border-black p-8 shadow-brutalist flex flex-col justify-between h-[250px] group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutalist-hover transition-all">
              <div className="text-black">
                 <div className="flex justify-between mb-6">
                    <div className="w-10 h-10 bg-black text-white border-2 border-black flex items-center justify-center font-black">
                      <Zap size={20} />
                    </div>
                    <span className="text-[11px] bg-black text-white px-2 py-0.5 font-mono font-black border border-black shadow-[2px_2px_0px_#000]">+12.4%_</span>
                 </div>
                 <h4 className="text-[10px] font-mono text-zinc-900 uppercase mb-2 font-bold tracking-widest">Compute_Efficiency_Node</h4>
                 <div className="text-4xl font-display font-black">99.84%</div>
              </div>
              <p className="text-[10px] text-zinc-900 font-mono font-bold leading-relaxed uppercase">Uptime levels crossing global validator clusters. Optimal stability achieved.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
