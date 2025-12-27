import React from 'react';
import { CreditCard, Wallet, ArrowUpRight, TrendingUp, History, Info, ExternalLink } from 'lucide-react';
import Badge from '../components/common/Badge';

const WalletPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-void p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Commerce Hub</h1>
            <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.2em]">Wallet Management & Usage Analytics</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:border-white/20 transition-all font-mono">
              <History size={14} /> History
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-neon-cyan text-black text-xs font-bold uppercase tracking-widest hover:shadow-neon-cyan transition-all font-mono">
              <ArrowUpRight size={14} /> Add Credits
            </button>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-void-100 border border-white/10 p-6 rounded-lg relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-white/5 transform group-hover:scale-110 transition-transform duration-700">
              <Wallet size={120} />
            </div>
            <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-4">Total Balance</div>
            <div className="text-4xl font-black text-white font-display mb-1">$4,820.50</div>
            <div className="text-xs text-neon-green flex items-center gap-1 font-mono">
              <TrendingUp size={12} /> +$420.00 this month
            </div>
          </div>

          <div className="bg-void-100 border border-white/10 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[10px] font-mono text-ghost uppercase tracking-widest">Active Usage</div>
              <Badge variant="cyan">Metered</Badge>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-ghost-light uppercase mb-2">
                  <span>API Calls</span>
                  <span>72% of Limit</span>
                </div>
                <div className="h-1.5 w-full bg-void-300 rounded-full overflow-hidden">
                  <div className="h-full bg-neon-cyan transition-all duration-1000" style={{ width: '72%' }} />
                </div>
              </div>
              <div className="text-xs text-ghost leading-relaxed">
                Next billing cycle: <span className="text-white">Jan 01, 2025</span>
              </div>
            </div>
          </div>

          <div className="bg-void-100 border border-white/10 p-6 rounded-lg">
             <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-4">Affiliate Earnings</div>
             <div className="text-3xl font-bold text-white font-display mb-2">$124.90</div>
             <div className="flex items-center gap-2 text-[10px] text-ghost font-mono">
               <span className="text-white">12</span> Active referrals 
               <button className="text-neon-cyan hover:underline flex items-center gap-1">
                 Center <ExternalLink size={8} />
               </button>
             </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-void-100 border border-white/10 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white">Recent Transactions</h3>
            <div className="flex items-center gap-2 text-[10px] text-ghost font-mono uppercase">
              <Info size={12} className="text-neon-blue" />
              Auto-payout enabled
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-black/40 text-ghost uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-widest">Reference</th>
                  <th className="px-6 py-4 font-medium tracking-widest">Type</th>
                  <th className="px-6 py-4 font-medium tracking-widest">Asset</th>
                  <th className="px-6 py-4 font-medium tracking-widest">Amount</th>
                  <th className="px-6 py-4 font-medium tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3].map(i => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-ghost-light">TXN-00{i}84729</td>
                    <td className="px-6 py-4">
                      <span className="bg-white/5 px-2 py-0.5 rounded text-white">PURCHASE</span>
                    </td>
                    <td className="px-6 py-4 text-white">FinanceGPT v4.2</td>
                    <td className="px-6 py-4 text-white font-bold">-$149.00</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-neon-green">COMPLETED</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WalletPage;