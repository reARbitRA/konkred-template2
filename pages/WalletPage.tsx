import React, { useState, useEffect } from 'react';
import { 
    Wallet, ArrowUpRight, TrendingUp, History, ExternalLink, 
    RefreshCw, Layers, ArrowLeft, ArrowDownLeft, X, ShieldCheck 
} from 'lucide-react';
import Badge from '../components/common/Badge';
import { PageView } from '../types';
import { useToast } from '../contexts/ToastContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

const WalletPage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const { user, updateUser } = useAuth();
  const [balance, setBalance] = useState(user?.balance?.fiat ?? 1000);
  const [earnings, setEarnings] = useState(user?.stats?.totalEarnings ?? 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

  useEffect(() => {
    if (user) {
      setBalance(user.balance.fiat);
      setEarnings(user.stats.totalEarnings);
    }
  }, [user]);

  const [history, setHistory] = useState([
    { ref: 'TXN-84729', type: 'PURCHASE', asset: 'FinanceGPT v4', amount: -149.00, status: 'SUCCESS', date: 'Dec 01' },
    { ref: 'TXN-84730', type: 'DEPOSIT', asset: 'USDT Uplink', amount: 500.00, status: 'SUCCESS', date: 'Nov 28' },
    { ref: 'TXN-84731', type: 'PURCHASE', asset: 'LegalAudit Pro', amount: -89.00, status: 'SUCCESS', date: 'Nov 25' },
  ]);

  const handleAddCredits = () => {
    setIsProcessing(true);
    showToast('Connecting to secure payment gateway...', 'info');
    
    // Simulate gateway confirmation
    setTimeout(() => {
        const deposit = 500.00;
        const newBalance = balance + deposit;
        setBalance(newBalance);
        if (updateUser && user) {
          updateUser({
            balance: {
              ...user.balance,
              fiat: newBalance
            }
          });
        }
        setHistory(prev => [{
            ref: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
            type: 'DEPOSIT',
            asset: 'Manual Uplink',
            amount: deposit,
            status: 'SUCCESS',
            date: 'Today'
        }, ...prev]);
        setIsProcessing(false);
        showToast('Liquidity successfully synchronized! +$500.00 credited.', 'success');
    }, 2000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (!amountNum || amountNum <= 0) {
        showToast('Please specify a valid numeric withdrawal amount.', 'warning');
        return;
    }
    if (amountNum > earnings) {
        showToast(`Insufficient core earnings. Maximum withdrawable value: $${earnings.toLocaleString()}`, 'error');
        return;
    }
    if (!withdrawAddress.trim() || withdrawAddress.length < 30) {
        showToast('Please provide a secure, valid cryptocurrency destination node address (minimum 30 char length limit).', 'warning');
        return;
    }

    setIsSubmittingWithdraw(true);
    showToast('Broadcasting withdrawal proposal to the distributed enclave ledger...', 'info');

    setTimeout(() => {
        const newEarnings = earnings - amountNum;
        setEarnings(newEarnings);
        if (updateUser && user) {
          updateUser({
            stats: {
              ...user.stats,
              totalEarnings: newEarnings
            }
          });
        }
        setHistory(prev => [{
            ref: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
            type: 'PURCHASE', // Mapping to generic withdraw style
            asset: 'Earnings Payout',
            amount: -amountNum,
            status: 'SUCCESS',
            date: 'Today'
        }, ...prev]);
        setIsSubmittingWithdraw(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        showToast(`Withdrawal of $${amountNum.toFixed(2)} completed! Funds successfully dispatched to node.`, 'success');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-void p-8 pt-28 font-sans relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Liquidity Node</h1>
            <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.2em]">Operational Balance // TXN Ledger</p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={handleAddCredits}
                disabled={isProcessing}
                className="bg-neon-cyan text-black font-mono font-bold text-xs py-4 px-8 rounded-xl tracking-widest uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50"
            >
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <ArrowUpRight size={16} />}
                {isProcessing ? 'SYNCHRONIZING...' : 'Add Credits'}
            </button>
          </div>
        </header>

        {/* Info Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="concrete-card p-10 rounded-3xl relative overflow-hidden group border border-neon-cyan/10 hover:border-neon-cyan/20 transition-all bg-black/40">
                <div className="absolute -right-4 -bottom-4 text-white/5 transform group-hover:scale-110 transition-transform duration-1000">
                    <Wallet size={160} />
                </div>
                <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-6">Current Balance</div>
                <div className="text-6xl font-black text-white font-display mb-4">${balance.toLocaleString()}</div>
                <div className="text-xs text-neon-green flex items-center gap-2 font-mono">
                    <TrendingUp size={14} /> +8.4% Efficiency Boost Active
                </div>
            </div>

            <div className="concrete-card p-10 rounded-3xl bg-black/40 border border-white/5">
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

            <div className="concrete-card p-10 rounded-3xl bg-black/40 flex flex-col justify-between border border-white/5">
                <div>
                    <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-6">Yield Velocity</div>
                    <div className="text-3xl font-bold text-white font-display">${earnings.toLocaleString()}</div>
                </div>
                <button 
                  onClick={() => {
                    setWithdrawAmount(earnings.toString());
                    setShowWithdrawModal(true);
                  }}
                  className="text-[10px] text-neon-cyan hover:underline uppercase tracking-widest font-black flex items-center gap-2 self-start py-2 border-b border-dashed border-neon-cyan/30"
                >
                    WITHDRAW EARNINGS <ExternalLink size={12} />
                </button>
            </div>
        </div>

        {/* Ledger Table Section */}
        <div className="concrete-card rounded-3xl overflow-hidden bg-black/40 border border-white/5">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-3">
                <History size={16} className="text-neon-cyan animate-pulse" /> Network Ledger
            </h3>
            <Badge variant="gray">Live Telemetry</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-[#0b0b0e] text-ghost uppercase tracking-widest border-b border-white/5">
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

      {/* Modern Dialog Withdraw Modal Popup */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={() => { if (!isSubmittingWithdraw) setShowWithdrawModal(false); }}
          />
          <form 
            onSubmit={handleWithdrawSubmit}
            className="relative w-full max-w-md concrete-card bg-void-200 border border-white/10 shadow-2xl overflow-hidden rounded-2xl animate-in zoom-in-95"
          >
            <div className="p-8 space-y-6">
              
              {/* Header Box */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <ArrowDownLeft size={18} className="text-neon-cyan animate-pulse" />
                    Withdraw Earnings
                  </h3>
                  <p className="text-xs text-ghost mt-1 font-sans">Broadcast instant stablecoin payouts directly to external crypto nodes.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isSubmittingWithdraw}
                  className="text-ghost hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Amount form input */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase">
                  <span className="text-ghost">Payout Amount (USD)</span>
                  <span className="text-neon-cyan font-bold">Max available: ${earnings.toLocaleString()}</span>
                </div>
                <input 
                  type="number"
                  step="0.01"
                  required
                  disabled={isSubmittingWithdraw}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-md text-white font-mono placeholder:text-zinc-700 outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
                  placeholder="e.g. 100.00"
                />
              </div>

              {/* Destination Address node */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Destination Vault Node Address</label>
                <input 
                  type="text"
                  required
                  disabled={isSubmittingWithdraw}
                  value={withdrawAddress}
                  onChange={e => setWithdrawAddress(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-xs text-white font-mono placeholder:text-zinc-700 outline-none focus:border-neon-cyan transition-all"
                  placeholder="e.g. 0x8a92bC76d8b... (ERC-20/Solana Address)"
                />
              </div>

              {/* Security Advisory note */}
              <div className="bg-neon-cyan/5 border border-neon-cyan/20 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck size={18} className="text-neon-cyan flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-ghost leading-relaxed font-sans">
                  Vault distributions are immutable. Please verify the destination signature correctly to avoid total asset compromise.
                </p>
              </div>

              {/* Actions Footer row */}
              <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isSubmittingWithdraw}
                  className="px-5 py-3 border border-white/5 rounded-xl hover:bg-white/5 text-xs text-ghost font-mono uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmittingWithdraw}
                  className="px-5 py-3 bg-neon-cyan hover:bg-neon-cyan/95 text-black font-black rounded-xl text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] disabled:opacity-50"
                >
                  {isSubmittingWithdraw ? <RefreshCw size={14} className="animate-spin" /> : null}
                  {isSubmittingWithdraw ? 'Broadcasting...' : 'INITIATE_PAYOUT'}
                </button>
              </div>

            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default WalletPage;
