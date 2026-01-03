
import React from 'react';
import { Listing } from '../../types.ts';
import { Package, MoreHorizontal, Zap, Shield, Eye, Trash2, Edit3, CheckCircle } from 'lucide-react';
import Badge from '../common/Badge.tsx';

interface MyListingsProps {
  listings: Listing[];
}

const MyListings: React.FC<MyListingsProps> = ({ listings }) => {
  return (
    <div className="concrete-card rounded-[2.5rem] overflow-hidden bg-black/20 border-white/5 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neon-cyan/10 rounded-2xl flex items-center justify-center text-neon-cyan border border-neon-cyan/20">
               <Package size={24} />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white uppercase tracking-tight">Active_Inventory</h3>
               <p className="text-[10px] text-ghost font-mono uppercase mt-1 tracking-widest">{listings.length} Deployed Modules</p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-ghost hover:text-white transition-all uppercase tracking-widest">Export_CSV</button>
         </div>
      </div>

      <div className="overflow-x-auto">
         <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-void-300 text-ghost uppercase tracking-widest">
               <tr>
                  <th className="px-10 py-6">Asset_Designation</th>
                  <th className="px-10 py-6">Market_Value</th>
                  <th className="px-10 py-6">Audit_Index</th>
                  <th className="px-10 py-6">Node_Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {listings.length === 0 ? (
                   <tr><td colSpan={5} className="p-32 text-center text-ghost italic uppercase tracking-[0.3em] opacity-40">No localized protocols detected on node.</td></tr>
               ) : listings.map((item) => (
                 <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-void-400 flex-shrink-0 border border-white/5 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
                              {item.type === 'api' ? <Zap size={20} /> : <Shield size={20} />}
                          </div>
                          <div>
                              <span className="text-base text-white font-black group-hover:text-neon-cyan transition-colors block mb-1">{item.title}</span>
                              <div className="flex items-center gap-3">
                                 <Badge variant="gray" size="sm">{item.type}</Badge>
                                 <span className="text-[8px] text-ghost opacity-40 uppercase">ID: {item.id}</span>
                              </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-white font-bold text-base font-display">${item.pricing.amount.toFixed(2)}</td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <span className={`text-sm font-black ${item.auditScore > 90 ? 'text-neon-green' : 'text-neon-gold'}`}>{item.auditScore}%</span>
                          <CheckCircle size={14} className="text-neon-blue" />
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                          <span className="text-neon-green font-bold">DEPLOYED</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-3">
                          <button className="p-3 bg-white/5 rounded-xl text-ghost hover:text-white hover:bg-white/10 transition-all" title="View in Market">
                             <Eye size={16} />
                          </button>
                          <button className="p-3 bg-white/5 rounded-xl text-ghost hover:text-white hover:bg-white/10 transition-all" title="Edit Logic">
                             <Edit3 size={16} />
                          </button>
                          <button className="p-3 bg-white/5 rounded-xl text-ghost hover:text-neon-red hover:bg-neon-red/5 transition-all" title="Terminate Asset">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default MyListings;
