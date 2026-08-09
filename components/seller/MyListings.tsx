
import React from 'react';
import { Listing } from '../../types.ts';
import { Package, MoreHorizontal, Zap, Shield, Eye, Trash2, Edit3, CheckCircle } from 'lucide-react';
import Badge from '../common/Badge.tsx';

interface MyListingsProps {
  listings: Listing[];
}

const MyListings: React.FC<MyListingsProps> = ({ listings }) => {
  return (
    <div className="bg-void-100 border-4 border-black shadow-brutalist overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 font-sans">
      <div className="p-10 border-b-4 border-black flex justify-between items-center bg-black/20">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-signal text-black border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
               <Package size={28} />
            </div>
            <div>
               <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight">Active_Inventory</h3>
               <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1 tracking-widest font-bold">{listings.length} Deployed_Modules_On_Node</p>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-6 py-3 border-4 border-black bg-black text-white text-[10px] font-mono font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_#D98A2E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Export_Ledger_</button>
         </div>
      </div>

      <div className="overflow-x-auto">
         <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-black text-zinc-500 uppercase tracking-widest border-b-4 border-black">
               <tr>
                  <th className="px-10 py-6 font-black">Asset_Designation</th>
                  <th className="px-10 py-6 font-black text-center">Market_Value</th>
                  <th className="px-10 py-6 font-black text-center">Audit_Index</th>
                  <th className="px-10 py-6 font-black text-center">Node_Status</th>
                  <th className="px-10 py-6 text-right font-black">Actions_</th>
               </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
               {listings.length === 0 ? (
                   <tr><td colSpan={5} className="p-32 text-center text-zinc-600 italic uppercase tracking-[0.3em] font-black bg-black/20">No localized protocols detected on node_</td></tr>
               ) : listings.map((item) => (
                 <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-10 py-10">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-black border-2 border-zinc-800 flex-shrink-0 flex items-center justify-center text-signal group-hover:bg-signal group-hover:text-black group-hover:border-black transition-all shadow-[2px_2px_0px_#000]">
                              {item.type === 'api' ? <Zap size={20} /> : <Shield size={20} />}
                          </div>
                          <div>
                              <span className="text-lg text-white font-black group-hover:text-signal transition-colors block mb-1 uppercase tracking-tighter leading-none">{item.title}</span>
                              <div className="flex items-center gap-3">
                                 <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 border border-zinc-800 uppercase tracking-[0.1em]">{item.type}</span>
                                 <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">ID: {item.id.slice(0, 12)}</span>
                              </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-10 text-white font-black text-xl font-display text-center">${item.pricing.amount.toFixed(2)}</td>
                    <td className="px-10 py-10 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <span className={`text-sm font-black bg-black border-2 border-black px-3 py-1 ${item.auditScore > 90 ? 'text-signal shadow-[2px_2px_0px_#D98A2E]' : 'text-white'}`}>{item.auditScore}%</span>
                       </div>
                    </td>
                    <td className="px-10 py-10 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <div className="w-2 h-2 bg-signal animate-ping" />
                          <span className="text-signal font-black text-[10px] tracking-widest">DEPLOYED_</span>
                        </div>
                    </td>
                    <td className="px-10 py-10 text-right">
                       <div className="flex justify-end gap-3">
                          {[
                            { icon: Eye, label: 'View', color: 'hover:bg-blue-500' },
                            { icon: Edit3, label: 'Edit', color: 'hover:bg-signal hover:text-black' },
                            { icon: Trash2, label: 'Delete', color: 'hover:bg-red-500' }
                          ].map((btn, i) => (
                            <button key={i} className={`w-10 h-10 bg-black border-2 border-zinc-800 flex items-center justify-center text-white transition-all shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${btn.color}`}>
                               <btn.icon size={16} />
                            </button>
                          ))}
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
