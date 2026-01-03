
import React, { useState } from 'react';
import { Wallet, ArrowUpRight, TrendingUp, History, ExternalLink, RefreshCw, Layers, ArrowLeft } from 'lucide-react';
import Badge from '../components/common/Badge';
import { PageView } from '../types';

const WalletPage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [balance, setBalance] = useState(4820.50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([
    { ref: 'TXN-84729', type: 'PURCHASE', asset: 'FinanceGPT v4', amount: -149.00, status: 'SUCCESS', date: 'Dec 01' },
    { ref: 'TXN-84730', type: 'DEPOSIT', asset: 'USDT Uplink', amount: 500.00, status: 'SUCCESS', date: 'Nov 28' },
    { ref: 'TXN-84731', type: 'PURCHASE', asset: 'LegalAudit Pro', amount: -89.00, status: 'SUCCESS', date: 'Nov 25' },
  ]);

  const handleAddCredits = () => {
    setIsProcessing(true);
    // Simulate gateway confirmation
    setTimeout(() => {
        const deposit = 500.00;
        setBalance(prev => prev + deposit);
        setHistory(prev => [{
            ref: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
            type: 'DEPOSIT',
            asset: 'Manual Uplink',
            amount: deposit,
            status: 'SUCCESS',
            date: 'Today'
        }, ...prev]);
        setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-void p-8 pt-28 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Liquidity Node</h1>
            <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.2em]">Operational Balance // TXN Ledger</p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={handleAddCredits}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-3 py-4 px-8 uppercase font-black tracking-widest disabled:opacity-50"
            >
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                {isProcessing ? 'SYNCHRONIZING...' : 'Add Credits'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="concrete-card p-10 rounded-3xl relative overflow-hidden group border-neon-cyan/20">
                <div className="absolute -right-4 -bottom-4 text-white/5 transform group-hover:scale-110 transition-transform duration-1000">
                    <Wallet size={160} />
                </div>
                <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-6">Current Balance</div>
                <div className="text-6xl font-black text-white font-display mb-4">${balance.toLocaleString()}</div>
                <div className="text-xs text-neon-green flex items-center gap-2 font-mono">
                    <TrendingUp size={14} /> +8.4% Efficiency Boost Active
                </div>
            </div>

            <div className="concrete-card p-10 rounded-3xl bg-black/40">
                <div className="flex justify-between items-start mb-8">
                    <div className="text-[10px] font-mono text-ghost uppercase tracking-widest">Metering Threshold</div>
                    <Badge variant="cyan">Pro Tier</Badge>
                </div>
                <div className="space-y-4">
                    <div className="h-2 w-full bg-void-400 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-cyan transition-all duration-1000" style={{ width: '64%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono uppercase">
                        <span className="text-ghost">Usage consumed</span>
                        <span className="text-white">64% / $5,000</span>
                    </div>
                </div>
            </div>

            <div className="concrete-card p-10 rounded-3xl bg-black/40 flex flex-col justify-between">
                <div>
                    <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-6">Yield Velocity</div>
                    <div className="text-3xl font-bold text-white font-display">$840.12</div>
                </div>
                <button className="text-[10px] text-neon-cyan hover:underline uppercase tracking-widest font-black flex items-center gap-2">
                    WITHDRAW EARNINGS <ExternalLink size={12} />
                </button>
            </div>
        </div>

        <div className="concrete-card rounded-3xl overflow-hidden bg-black/40">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-3">
                <History size={16} className="text-neon-cyan" /> Network Ledger
            </h3>
            <Badge variant="gray">Live Telemetry</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-void-300 text-ghost uppercase tracking-widest">
                <tr>
                    <th className="px-8 py-6">Ref_ID</th>
                    <th className="px-8 py-6">Protocol_Class</th>
                    <th className="px-8 py-6">Target_Asset</th>
                    <th className="px-8 py-6">Liquidity_Delta</th>
                    <th className="px-8 py-6 text-right">Verification</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {history.map((tx, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-8 py-6 text-ghost group-hover:text-white">{tx.ref}</td>
                        <td className="px-8 py-6">
                            <Badge variant={tx.type === 'DEPOSIT' ? 'green' : 'gray'}>{tx.type}</Badge>
                        </td>
                        <td className="px-8 py-6 text-white font-bold">{tx.asset}</td>
                        <td className={`px-8 py-6 font-black ${tx.amount > 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="px-8 py-6 text-right">
                            <span className="text-neon-green inline-flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            {tx.status}
                            </span>
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
