
import React from 'react';
import { CreditCard, Download, Plus, Clock } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const Billing: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
       <div className="flex justify-between items-end pb-6 border-b border-white/5">
          <div>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Liquidity Methods</h2>
             <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">Payment Sources & Invoices</p>
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-[10px] font-mono text-white transition-all uppercase tracking-widest border border-white/10">
             <Plus size={12} /> Add Method
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="concrete-card p-6 rounded-2xl border-neon-cyan/30 bg-neon-cyan/5 relative group">
             <div className="absolute top-4 right-4">
                <Badge variant="cyan">Default</Badge>
             </div>
             <CreditCard className="text-neon-cyan mb-6" size={32} />
             <div className="text-lg font-mono text-white font-bold mb-1">•••• •••• •••• 4284</div>
             <div className="flex justify-between text-xs text-ghost uppercase tracking-widest">
                <span>Visa Ultra</span>
                <span>Exp 12/28</span>
             </div>
          </div>
          <div className="concrete-card p-6 rounded-2xl border-dashed border-white/10 flex flex-col items-center justify-center text-ghost hover:border-white/20 hover:text-white transition-all cursor-pointer min-h-[160px]">
             <Plus size={32} className="mb-2 opacity-50" />
             <span className="text-[10px] font-mono uppercase tracking-widest">Connect New Wallet</span>
          </div>
       </div>

       <div className="mt-12">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
             <Clock size={16} className="text-ghost" /> Settlement History
          </h3>
          <div className="concrete-card rounded-2xl overflow-hidden bg-black/20 border-white/5">
             <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-void-300 text-ghost uppercase tracking-widest">
                   <tr>
                      <th className="px-6 py-4">Invoice_ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Receipt</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {[
                      { id: 'INV-001', date: 'Oct 24, 2024', amount: '$149.00', status: 'Paid' },
                      { id: 'INV-002', date: 'Oct 12, 2024', amount: '$49.00', status: 'Paid' },
                      { id: 'INV-003', date: 'Sep 28, 2024', amount: '$249.00', status: 'Paid' },
                   ].map((inv, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                         <td className="px-6 py-4 text-white font-bold">{inv.id}</td>
                         <td className="px-6 py-4 text-ghost">{inv.date}</td>
                         <td className="px-6 py-4 text-white">{inv.amount}</td>
                         <td className="px-6 py-4"><Badge variant="green">{inv.status}</Badge></td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-ghost hover:text-neon-cyan transition-colors">
                               <Download size={14} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default Billing;
