
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
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-void-100 border-4 border-black p-8 shadow-brutalist hover:bg-black transition-all">
           <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 font-black">Pending_Balance_</div>
           <div className="text-4xl font-display font-black text-white mb-2">$3,420.00</div>
           <div className="flex items-center gap-2 text-[10px] font-mono text-signal uppercase font-bold">
              <Clock size={12} /> Scheduled: Dec 01
           </div>
        </div>
        <div className="bg-void-100 border-4 border-black p-8 shadow-brutalist hover:bg-black transition-all">
           <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 font-black">Total_Node_Payouts_</div>
           <div className="text-4xl font-display font-black text-white mb-2">$42,850.50</div>
           <div className="flex items-center gap-2 text-[10px] font-mono text-signal uppercase font-bold">
              <ArrowUpRight size={12} /> Lifetime_Yield
           </div>
        </div>
        <div className="bg-signal border-4 border-black p-6 shadow-brutalist flex flex-col justify-center items-center text-center">
            <div className="text-[10px] font-mono text-black uppercase tracking-widest mb-3 font-black">Active_Receipt_Source</div>
            <div className="text-[10px] font-mono font-bold text-black border border-black/40 bg-white/20 px-3 py-1.5 select-all break-all mb-4 max-w-full">
              {(import.meta as any).env?.VITE_TRUST_WALLET_USDT_TRON || 'NOT_CONFIGURED'}
            </div>
            <div className="text-[9px] font-mono text-white font-black uppercase tracking-widest bg-black px-3.5 py-1">USDT (TRON)</div>
        </div>
      </div>

      <div className="bg-black border-4 border-black shadow-brutalist overflow-hidden">
        <div className="p-8 border-b-4 border-black flex justify-between items-center bg-black/40">
           <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Payout_Ledger_History</h3>
           <button className="text-[10px] font-mono text-zinc-500 hover:text-white uppercase tracking-[0.2em] font-black">Export_Ledger_</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
            <thead className="bg-[#18181b] text-zinc-500 uppercase tracking-widest border-b-4 border-black">
                <tr>
                    <th className="px-8 py-5 font-black">Reference_ID</th>
                    <th className="px-8 py-5 font-black">Date</th>
                    <th className="px-8 py-5 font-black">Method</th>
                    <th className="px-8 py-5 font-black">Amount_</th>
                    <th className="px-8 py-5 text-right font-black">Status_</th>
                </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
                {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-white/[0.03] transition-all">
                        <td className="px-8 py-6 text-white font-black">{po.id}</td>
                        <td className="px-8 py-6 text-zinc-400 font-bold">{po.date}</td>
                        <td className="px-8 py-6 text-zinc-400 font-bold">{po.method}</td>
                        <td className="px-8 py-6 text-white font-black text-base">${po.amount.toFixed(2)}</td>
                        <td className="px-8 py-6 text-right">
                          <span className={`px-4 py-1.5 border-4 border-black shadow-[2px_2px_0px_#000] text-[9px] font-black uppercase tracking-widest ${
                            po.status === 'Completed' ? 'bg-signal text-black' : 'bg-black text-white'
                          }`}>
                              {po.status}_
                          </span>
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
