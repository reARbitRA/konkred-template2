
import React from 'react';
import { CreditCard, Info } from 'lucide-react';

/**
 * Account billing — honest state. Payment credentials are not configured on
 * this platform, so no payment methods or invoices are displayed. This page
 * never pretends a wallet, card or invoice history exists.
 */
const Billing: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-6 border-b border-white/5">
        <div>
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Billing</h2>
          <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">
            Payment Methods & Invoices
          </p>
        </div>
      </div>

      <div className="concrete-card p-8 rounded-2xl border-white/10 bg-white/[0.02] flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
          <CreditCard size={18} className="text-amber-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest">
            No payment methods configured
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
            Payment processing is not configured in this environment. When a payment provider is
            connected, cards, wallets and invoices will appear here. Until then, no charges are
            processed and no fake transaction history is displayed.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        <Info size={12} className="text-amber-500" />
        <span>Inquiries are collected as leads only — see the product catalogue for test-mode forms.</span>
      </div>
    </div>
  );
};

export default Billing;
