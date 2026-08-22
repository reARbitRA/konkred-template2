/**
 * Canonical ARB suite page (/suites/:slug).
 * Owner direction: sellable page, not a spec sheet. Preview → workflows inside
 * → price/CTA. Modules, contracts, validators and full evidence stay in the
 * manifest (backend); one quiet evidence line remains on the page.
 */
import React, { useEffect } from 'react';
import type { PageView } from '../types.ts';
import { getEntryBySlug, getChildren } from '../content/catalogue/portfolio.ts';
import type { PortfolioEntry } from '../content/catalogue/types.ts';
import { Pattern } from '../components/portfolio/patterns/index.tsx';
import { StatusChip, EvidenceLine } from '../components/portfolio/Evidence.tsx';
import { ScopeReviewPanel } from '../components/portfolio/ScopeReviewPanel.tsx';
import { CtaRail } from '../components/portfolio/CtaRail.tsx';
import { track } from '../utils/analytics.ts';
import { ArrowLeft, ArrowRight, Layers, Wrench } from 'lucide-react';

interface Props {
  slug: string;
  onNavigate: (page: PageView, slug?: string) => void;
}

const SuiteDetailPage: React.FC<Props> = ({ slug, onNavigate }) => {
  const entry: PortfolioEntry | undefined = getEntryBySlug(slug);
  useEffect(() => { if (entry) track('suite_view', entry.id); }, [entry?.id]);

  if (!entry || entry.type !== 'SUITE') {
    return (
      <div className="min-h-[60vh] bg-[#0B0F14] text-white flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">Suite not found: {slug}</p>
          <button onClick={() => onNavigate('catalogue')} className="inline-flex items-center gap-2 bg-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
            <ArrowLeft size={14} /> Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  const children = getChildren(entry.id);

  return (
    <div className="min-h-screen bg-[#0B0F14] brutal-grid-bg text-white font-sans pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="pt-2 pb-5 border-b border-white/10 flex items-center justify-between gap-4">
          <button onClick={() => onNavigate('catalogue')} className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 hover:text-white transition-colors group cursor-pointer">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Catalogue</span>
          </button>
          <StatusChip status={entry.status} />
        </div>

        {/* Header */}
        <div className="py-8 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center gap-2">
            <Layers size={12} /> {entry.category} · Suite
          </p>
          <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight uppercase leading-tight">{entry.title}</h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">{entry.jobToBeDone}</p>
          <p className="text-xs text-zinc-500">For {entry.buyer?.toLowerCase()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-9 brutal-stagger">
            {/* The suite at a glance */}
            <Pattern entry={entry} />

            {/* What's inside — one line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-mono text-zinc-500">
              <span><span className="text-zinc-300 font-bold">{entry.modules.length}</span> modules</span>
              <span className="text-zinc-700">·</span>
              <span><span className="text-zinc-300 font-bold">{children.length}</span> ready-to-run workflow tools</span>
              <span className="text-zinc-700">·</span>
              <span><span className="text-zinc-300 font-bold">{entry.publicValidation.sources.length}</span> public reference sources</span>
            </div>

            {/* Entry workflows — the sales path */}
            {children.length > 0 && (
              <section aria-label="Workflows in this suite" className="space-y-3">
                <h3 className="font-mono font-black uppercase tracking-widest text-xs text-white">Run a workflow now</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {children.map((c) => (
                    <button key={c.slug} onClick={() => onNavigate('workflow_detail', c.slug)} className="text-left border-2 border-black bg-[#0E1319] rounded-2xl p-4 hover:border-amber-500/60 transition-colors cursor-pointer shadow-[3px_3px_0px_0px_#000000] brutal-press">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-cyan-400 font-black border border-cyan-500/30 rounded px-1.5 py-0.5"><Wrench size={9} /> Tool</span>
                        {c.pricing.kitFromUsd != null && <span className="font-mono text-[10px] text-amber-400 font-bold">from ${c.pricing.kitFromUsd.toLocaleString()}</span>}
                      </div>
                      <p className="font-mono font-black text-sm text-white">{c.title}</p>
                      <p className="text-[11px] text-zinc-400 leading-snug mt-1.5 line-clamp-2">{c.jobToBeDone}</p>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 mt-3">Launch tool <ArrowRight size={11} /></span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="space-y-4">
              <EvidenceLine entry={entry} onOpenValidation={() => onNavigate('validation')} />
              <ScopeReviewPanel entry={entry} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <CtaRail entry={entry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiteDetailPage;
