import React from 'react';
import type { ProductRisk } from '../../catalog/types.ts';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface RiskBadgeProps {
  risk: ProductRisk;
  humanApprovalRequired?: boolean;
}

/**
 * Honest risk label. High-risk products always surface the
 * HUMAN_APPROVAL_REQUIRED notice.
 */
export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk, humanApprovalRequired }) => {
  const styles: Record<ProductRisk, string> = {
    low: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/40',
    medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
    high: 'bg-red-500/15 text-red-400 border-red-500/40',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono font-black uppercase tracking-wider text-[9px] border rounded px-2 py-1 ${styles[risk]}`}>
      {risk === 'high' ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
      {risk.toUpperCase()} RISK
    </span>
  );
};

export const HumanApprovalNotice: React.FC = () => (
  <div
    role="note"
    className="flex items-start gap-3 border border-red-500/40 bg-red-500/10 rounded-xl px-4 py-3"
  >
    <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
    <div>
      <p className="text-[11px] font-mono font-black uppercase tracking-widest text-red-400">
        HUMAN_APPROVAL_REQUIRED
      </p>
      <p className="text-xs text-zinc-300 leading-relaxed mt-1">
        Model outputs are decision-support only. A qualified human owner must review and
        approve any business, legal, financial or security action before it is taken.
        This product never executes actions autonomously.
      </p>
    </div>
  </div>
);
