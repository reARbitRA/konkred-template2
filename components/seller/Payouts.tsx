
import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const Payouts: React.FC = () => {
  const payouts = [
    { id: 'PO-8429', amount: 1240.50, status: 'Completed', date: 'Nov 01, 2024', method: 'USDT (ERC20)' },
    { id: 'PO-8530', amount: 840.00, status: 'Processing', date: 'Nov 15, 2024', method: 'Bitcoin' },
    { id: 'PO-8612', amount: 2150.25, status: 'Scheduled', date: 'Dec 01, 2024', method: 'Wire Transfer' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="concrete-card p-8 rounded-3xl bg-black/40">
           <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-4">Pending Balance</div>
           <div className="text-4xl font-black text-white mb-2">$3,420.00</div>
           <div className="flex items-center gap-2 text-xs text-neon-gold">
              <Clock size={12} /> Scheduled: Dec 01
           </div>
        </div>
        <div className="concrete-card p-8 rounded-3xl bg-black/40">
           <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-4">Total Payouts</div>
           <div className="text-4xl font-black text-white mb-2">$42,850.50</div>
           <div className="flex items-center gap-2 text-xs text-neon-green">
              <ArrowUpRight size={12} /> Lifetime
           </div>
        </div>
        <div className="concrete-card p-8 rounded-3xl bg-neon-cyan/5 border-neon-cyan/20 flex flex-col justify-center items-center text-center">
           <button className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest">Configure Methods</button>
        </div>
      </div>

      <div className="concrete-card rounded-[2.5rem] overflow-hidden bg-black/20 border-white/5">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
           <h3 className="font-bold text-white uppercase tracking-tight">Payout Ledger</h3>
           <button className="text-[10px] font-mono text-ghost hover:text-white uppercase tracking-widest">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-void-300 text-ghost uppercase tracking-widest">
                <tr>
                    <th className="px-8 py-5">Reference_ID</th>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Method</th>
                    <th className="px-8 py-5">Amount</th>
                    <th className="px-8 py-5 text-right">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-white/[0.02]">
                        <td className="px-8 py-6 text-white font-bold">{po.id}</td>
                        <td className="px-8 py-6 text-ghost">{po.date}</td>
                        <td className="px-8 py-6 text-ghost">{po.method}</td>
                        <td className="px-8 py-6 text-white font-bold">${po.amount.toFixed(2)}</td>
                        <td className="px-8 py-6 text-right">
                        <Badge variant={po.status === 'Completed' ? 'green' : po.status === 'Processing' ? 'gold' : 'gray'}>
                            {po.status.toUpperCase()}
                        </Badge>
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

export default Payouts;
