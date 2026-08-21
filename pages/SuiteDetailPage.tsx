/**
 * Canonical ARB suite page (/suites/:slug).
 * Order: identity → unique interface pattern → child workflows → module map →
 * evidence → compact scope panel. CTA rail in the sidebar.
 */
import React, { useEffect } from 'react';
import type { PageView } from '../types.ts';
import { getEntryBySlug, getChildren } from '../content/catalogue/portfolio.ts';
import type { PortfolioEntry } from '../content/catalogue/types.ts';
import { Pattern } from '../components/portfolio/patterns/index.tsx';
import { StatusChip, DesignScore, ValidationBadge, EvidencePanel } from '../components/portfolio/Evidence.tsx';
import { ScopeReviewPanel } from '../components/portfolio/ScopeReviewPanel.tsx';
import { CtaRail } from '../components/portfolio/CtaRail.tsx';
import { track } from '../utils/analytics.ts';
import { ArrowLeft, ArrowRight, Layers, Boxes } from 'lucide-react';

interface Props {
  slug: string;
  onNavigate: (page: PageView, slug?: string) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section aria-label={title} className="space-y-2.5">
    <h3 className="font-mono font-black uppercase tracking-widest text-xs text-white">{title}</h3>
    {children}
  </section>
);

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
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-2 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button onClick={() => onNavigate('catalogue')} className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 hover:text-white transition-colors group cursor-pointer">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO CATALOGUE</span>
        </button>
        <div className="flex items-center gap-3">
          <ValidationBadge status={entry.validationStatus} />
          <StatusChip status={entry.status} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold flex items-center gap-2">
              <Layers size={12} /> {entry.category} · ARB SUITE
            </p>
            <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight uppercase leading-tight">{entry.title}</h1>
            <p className="text-base text-zinc-300 leading-relaxed max-w-3xl">{entry.jobToBeDone}</p>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">{entry.definition}</p>
            <div className="flex flex-wrap items-start gap-6 pt-1">
              <div className="text-xs text-zinc-400 max-w-md">
                <span className="font-mono font-black uppercase tracking-widest text-zinc-300">Built for: </span>{entry.buyer}
              </div>
              <DesignScore score={entry.staticDesignScore} />
            </div>
            <p className="font-mono text-[9px] text-zinc-600">{entry.id} · updated {entry.updatedAt}</p>
          </div>

          <Pattern entry={entry} />

          {children.length > 0 && (
            <Section title={`Entry workflows (${children.length})`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {children.map((c) => (
                  <button key={c.slug} onClick={() => onNavigate('workflow_detail', c.slug)} className="text-left border-2 border-black bg-[#0E1319] rounded-2xl p-4 hover:border-amber-500/60 transition-colors cursor-pointer shadow-[3px_3px_0px_0px_#000000]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-cyan-400 font-black border border-cyan-500/30 rounded px-1.5 py-0.5">Workflow</span>
                      <StatusChip status={c.status} size="sm" />
                    </div>
                    <p className="font-mono font-black text-sm text-white">{c.title}</p>
                    <p className="text-[11px] text-zinc-400 leading-snug mt-1.5 line-clamp-2">{c.jobToBeDone}</p>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 mt-3">Launch tool <ArrowRight size={11} /></span>
                  </button>
                ))}
              </div>
            </Section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title={`Modules retained (${entry.modules.length})`}>
              <ul className="space-y-1.5">
                {entry.modules.map((m) => (
                  <li key={m} className="text-[11px] text-zinc-300 flex gap-2 leading-snug"><span className="text-amber-500 font-mono">▸</span>{m}</li>
                ))}
              </ul>
            </Section>
            <Section title={`Included use cases (${entry.useCases.length})`}>
              <ul className="space-y-1.5">
                {entry.useCases.map((u) => (
                  <li key={u} className="text-[11px] text-zinc-400 flex gap-2 leading-snug"><span className="text-zinc-600 font-mono">▸</span>{u}</li>
                ))}
              </ul>
            </Section>
            <Section title="Inputs (reference contract)">
              <ul className="space-y-1.5">
                {entry.inputSummary.map((i) => (
                  <li key={i} className="text-[11px] text-zinc-300 font-mono flex gap-2 leading-snug"><span className="text-cyan-500">→</span>{i}</li>
                ))}
              </ul>
            </Section>
            <Section title="Outputs (reference contract)">
              <ul className="space-y-1.5">
                {entry.outputSummary.map((o) => (
                  <li key={o} className="text-[11px] text-zinc-400 font-mono flex gap-2 leading-snug"><span className="text-emerald-500">←</span>{o}</li>
                ))}
              </ul>
            </Section>
          </div>

          {(entry.validators.length > 0 || entry.controlRequirements.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {entry.validators.length > 0 && (
                <Section title="Deterministic validators">
                  <div className="flex flex-wrap gap-1.5">
                    {entry.validators.map((v) => (
                      <span key={v} className="text-[10px] font-mono text-zinc-300 border border-zinc-700 rounded-lg px-2 py-1 bg-white/[0.03]">{v}</span>
                    ))}
                  </div>
                </Section>
              )}
              {entry.controlRequirements.length > 0 && (
                <Section title="Operating controls">
                  <ul className="space-y-1.5">
                    {entry.controlRequirements.map((c) => (
                      <li key={c} className="text-[11px] text-zinc-400 flex gap-2 leading-snug"><span className="text-zinc-600 font-mono">—</span>{c}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          )}

          <EvidencePanel entry={entry} />
          <ScopeReviewPanel entry={entry} />
        </div>

        <div className="lg:col-span-4 space-y-4">
          <CtaRail entry={entry} />
          <div className="border border-zinc-800 rounded-xl p-4 bg-[#0B0F14] space-y-2">
            <p className="font-mono font-bold uppercase tracking-widest text-[9px] text-zinc-500 flex items-center gap-1.5"><Boxes size={11} /> Technical references</p>
            <p className="text-[10px] font-mono text-zinc-500">validation: <span className="text-zinc-400">{entry.validationReport}</span></p>
            <p className="text-[10px] font-mono text-zinc-500">prompts: <span className="text-zinc-400">{entry.promptReference}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiteDetailPage;
