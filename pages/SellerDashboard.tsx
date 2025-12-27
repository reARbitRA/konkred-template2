import React from 'react';
import { PageView, Listing } from '../types';
import { ArrowLeft, DollarSign, Package, TrendingUp, Users, Plus, MoreHorizontal } from 'lucide-react';

interface SellerDashboardProps {
  // Added listings prop to match usage in App.tsx
  listings: Listing[];
  onNavigate: (page: PageView) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ listings, onNavigate }) => {
  return (
    <div className="min-h-screen bg-void pt-20 pb-12">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <button onClick={() => onNavigate('landing')} className="text-ghost hover:text-white transition-colors">
                   <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-display font-bold text-white">Seller Dashboard</h1>
             </div>
             <button className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                <Plus size={16} />
                New Listing
             </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             {[
               { label: 'Total Revenue', value: '$12,450', change: '+12%', icon: DollarSign, color: 'green' },
               { label: 'Active Listings', value: '8', change: '0', icon: Package, color: 'blue' },
               { label: 'Total Sales', value: '432', change: '+5%', icon: TrendingUp, color: 'purple' },
               { label: 'Views (30d)', value: '15.2k', change: '+22%', icon: Users, color: 'orange' },
             ].map((stat, i) => (
               <div key={i} className="bg-void-200 border border-white/5 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}>
                        <stat.icon size={20} />
                     </div>
                     <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-neon-green' : 'text-ghost'}`}>
                        {stat.change}
                     </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-ghost">{stat.label}</div>
               </div>
             ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Recent Listings Table */}
             <div className="lg:col-span-2 bg-void-200 border border-white/5 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                   <h3 className="font-bold text-white">Your Listings</h3>
                   <button className="text-sm text-neon-cyan hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-void-300 text-xs uppercase text-ghost font-mono">
                         <tr>
                            <th className="px-6 py-3">Product</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Sales</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3"></th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {/* Fallback to static list if listings prop is not used yet, or we can use the prop */}
                         {[1, 2, 3, 4].map((item) => (
                           <tr key={item} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-void-400 flex-shrink-0"></div>
                                    <span className="text-sm text-white font-medium">Enterprise Legal Agent v2</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-ghost-light">$149.00</td>
                              <td className="px-6 py-4 text-sm text-ghost-light">24</td>
                              <td className="px-6 py-4">
                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                    Active
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button className="text-ghost hover:text-white">
                                    <MoreHorizontal size={16} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             {/* Activity Feed */}
             <div className="bg-void-200 border border-white/5 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-6">
                   {[
                     { text: 'New sale: SEO Content System', time: '2 mins ago', type: 'sale' },
                     { text: 'Payout processed: $1,240.00', time: '1 day ago', type: 'payout' },
                     { text: 'New review (5★) on Legal Agent', time: '2 days ago', type: 'review' },
                   ].map((activity, i) => (
                     <div key={i} className="flex gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-neon-cyan flex-shrink-0"></div>
                        <div>
                           <p className="text-sm text-white">{activity.text}</p>
                           <p className="text-xs text-ghost mt-1">{activity.time}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default SellerDashboard;