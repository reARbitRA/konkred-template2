/**
 * CTA rail — acquisition options for a portfolio entry.
 * Checkout/CRM are not configured: every button opens the test-mode inquiry
 * form and records an analytics event. Nothing is charged and no fake
 * purchase success is ever rendered.
 */
import React, { useState } from 'react';
import type { PortfolioEntry } from '../../content/catalogue/types.ts';
import { ProductInquiryModal, type InquiryIntent } from '../catalog/ProductInquiryModal.tsx';
import { track } from '../../utils/analytics.ts';
import { ShoppingBag, FlaskConical, Rocket, LayoutGrid } from 'lucide-react';

const money = (usd: number | null) => (usd == null ? null : `$${usd.toLocaleString('en-US')}`);

export const CtaRail: React.FC<{ entry: PortfolioEntry }> = ({ entry }) => {
  const [intent, setIntent] = useState<InquiryIntent | null>(null);
  const p = entry.pricing;

  const open = (i: InquiryIntent, event: Parameters<typeof track>[0]) => {
    track(event, entry.id);
    setIntent(i);
  };

  const rows: { intent: InquiryIntent; icon: typeof ShoppingBag; label: string; note: string; cls: string; event: Parameters<typeof track>[0] }[] = [];
  if (p.kitFromUsd != null || entry.type === 'WORKFLOW') {
    rows.push({
      intent: 'workflow_kit', icon: ShoppingBag, label: 'Get the Workflow Kit',
      note: money(p.kitFromUsd) ? `from ${money(p.kitFromUsd)}` : 'on request',
      cls: 'bg-amber-500 text-black border-black hover:bg-black hover:text-amber-400', event: 'kit_cta_click',
    });
  }
  if (p.sprintFromUsd != null || entry.type === 'SUITE') {
    rows.push({
      intent: 'validation_sprint', icon: FlaskConical, label: 'Book Validation Sprint',
      note: money(p.sprintFromUsd) ? `from ${money(p.sprintFromUsd)}` : 'scoped',
      cls: 'bg-cyan-500 text-black border-black hover:bg-black hover:text-cyan-400', event: 'sprint_request',
    });
  }
  rows.push(entry.status === 'INTERNAL_CONTROLLED_PILOT' || entry.status === 'CONDITIONAL_VALIDATION'
    ? {
        intent: 'enterprise_pilot', icon: Rocket, label: 'Request Controlled Pilot',
        note: 'named owner · supervised',
        cls: 'bg-purple-500 text-black border-black hover:bg-black hover:text-purple-400', event: 'controlled_pilot_request',
      }
    : {
        intent: 'enterprise_pilot', icon: Rocket, label: 'Request Enterprise Pilot',
        note: 'scoped + supervised',
        cls: 'bg-purple-500 text-black border-black hover:bg-black hover:text-purple-400', event: 'enterprise_request',
      });

  return (
    <aside aria-label="Acquisition options" className="space-y-3">
      <div className="bg-[#0E1319] border-2 border-black rounded-2xl p-5 space-y-3 sticky top-24 shadow-[4px_4px_0px_0px_#000000]">
        <p className="font-mono font-black uppercase tracking-widest text-[10px] text-white">
          {entry.type === 'SUITE' ? 'Suite engagements' : 'Get this workflow'}
        </p>
        {rows.map(({ intent: i, icon: Icon, label, note, cls, event }) => (
          <button
            key={i}
            onClick={() => open(i, event)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 font-mono font-black text-[11px] uppercase tracking-widest border-2 rounded-xl transition-all cursor-pointer ${cls}`}
          >
            <span className="flex items-center gap-2"><Icon size={14} /> {label}</span>
            <span className="text-[8px] font-bold normal-case tracking-normal opacity-70">{note}</span>
          </button>
        ))}
        <button
          onClick={() => open('all_catalog_workspace', 'enterprise_request')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 font-mono font-black text-[11px] uppercase tracking-widest border-2 rounded-xl transition-all cursor-pointer bg-white text-black border-black hover:bg-zinc-200"
        >
          <LayoutGrid size={14} /> All-Catalog Workspace
        </button>
        {p.note && (
          <p className="text-[9px] font-mono text-zinc-500 leading-relaxed pt-1">{p.note}</p>
        )}
        <p className="text-[9px] font-mono text-zinc-600 leading-relaxed">
          Checkout is in test mode — forms record your inquiry, nothing is charged.
        </p>
      </div>
      {intent && (
        <ProductInquiryModal intent={intent} productName={entry.title} onClose={() => setIntent(null)} />
      )}
    </aside>
  );
};
