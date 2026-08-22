/**
 * Suite page (/suites/:slug) — brutalist panel.
 * Preview → workflows inside → price/CTA. Kicker badges on amber, slabs with
 * hard shadows, mono microtype. Honesty lines at the bottom.
 */
import React, { useEffect, useState } from 'react';
import type { PageView } from '../types.ts';
import { getEntryBySlug, getChildren } from '../content/catalogue/portfolio.ts';
import type { PortfolioEntry } from '../content/catalogue/types.ts';
import { Pattern } from '../components/portfolio/patterns/index.tsx';
import { ScopeReviewPanel } from '../components/portfolio/ScopeReviewPanel.tsx';
import { EvidenceLine } from '../components/portfolio/Evidence.tsx';
import { Typewriter } from '../components/brand/Typewriter.tsx';
import { track } from '../utils/analytics.ts';
import { ProductInquiryModal, type InquiryIntent } from '../components/catalog/ProductInquiryModal.tsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  slug: string;
  onNavigate: (page: PageView, slug?: string) => void;
}

const SuiteDetailPage: React.FC<Props> = ({ slug, onNavigate }) => {
  const entry: PortfolioEntry | undefined = getEntryBySlug(slug);
  useEffect(() => { if (entry) track('suite_view', entry.id); }, [entry?.id]);
  const [intent, setIntent] = useState<InquiryIntent | null>(null);

  if (!entry || entry.type !== 'SUITE') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-24" style={{ background: 'var(--k-bg)', color: 'var(--k-ink)' }}>
        <div className="text-center space-y-4">
          <p className="k-mono text-xs uppercase tracking-widest" style={{ color: 'var(--k-mut)' }}>SUITE NOT FOUND — {slug}</p>
          <button onClick={() => onNavigate('catalogue')} className="k-btn k-btn-acc">Back to the Floor</button>
        </div>
      </div>
    );
  }

  const children = getChildren(entry.id);
  const sprint = entry.pricing.sprintFromUsd;

  const cta = (i: InquiryIntent, ev: Parameters<typeof track>[0], label: string, accent: string) => (
    <button
      onClick={() => { track(ev, entry.id); setIntent(i); }}
      className="k-btn w-full"
      style={{ background: accent, color: 'var(--k-on-acc)' }}
    >{label}</button>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--k-bg)', color: 'var(--k-ink)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-10">
        {/* top bar */}
        <div className="pt-5 pb-4 flex items-center justify-between gap-4 border-b-4" style={{ borderColor: 'var(--k-edge)' }}>
          <button onClick={() => onNavigate('catalogue')} className="inline-flex items-center gap-2 k-mono text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer" style={{ color: 'var(--k-amber)' }}>
            <ArrowLeft size={15} /> THE FLOOR
          </button>
          <span className="k-badge">{entry.status.replace(/_/g, ' ')}</span>
        </div>

        {/* header */}
        <header className="py-10 space-y-5 brutal-rise">
          <span className="k-badge" style={{ background: 'var(--k-violet)', letterSpacing: '.28em' }}>{entry.category} · SUITE</span>
          <h1 className="k-title text-4xl sm:text-6xl max-w-4xl">{entry.title}</h1>
          <Typewriter as="p" text={entry.jobToBeDone ?? ''} speed={12} className="block text-[15px] leading-relaxed max-w-2xl" style={{ color: 'var(--k-mut)' }} />
          <p className="k-mono text-[11px]" style={{ color: 'var(--k-mut)' }}>FOR {entry.buyer?.toUpperCase()}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 k-mono text-[10px] tracking-[0.2em] pt-1" style={{ color: 'var(--k-mut)' }}>
            <span><b className="text-[13px]" style={{ color: 'var(--k-ink)' }}>{entry.modules.length}</b> MODULES</span>
            <span><b className="text-[13px]" style={{ color: 'var(--k-ink)' }}>{children.length}</b> READY-TO-RUN TOOLS</span>
            <span><b className="text-[13px]" style={{ color: 'var(--k-ink)' }}>{entry.publicValidation.sources.length}</b> PUBLIC SOURCES</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
          <div className="lg:col-span-8 space-y-9">
            <Pattern entry={entry} />
            <EvidenceLine entry={entry} onOpenValidation={() => onNavigate('validation')} />

            {/* entry workflows */}
            {children.length > 0 && (
              <section aria-label="Workflows in this suite" className="space-y-4">
                <h3 className="k-title text-lg">RUN A WORKFLOW NOW</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 brutal-stagger">
                  {children.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => onNavigate('workflow_detail', c.slug)}
                      className="k-slab brutal-press text-left p-5 flex flex-col gap-3 cursor-pointer"
                      style={{ ['--slab-c' as string]: 'var(--k-cyan)', transform: 'rotate(0deg)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="k-mono text-[8px] font-bold tracking-[0.25em] border-2 px-1.5 py-0.5" style={{ borderColor: 'var(--k-edge)' }}>TOOL</span>
                        {c.pricing.kitFromUsd != null && (
                          <span className="k-mono text-[11px] font-black" style={{ color: 'var(--k-amber)' }}>FROM ${c.pricing.kitFromUsd.toLocaleString()}</span>
                        )}
                      </div>
                      <div>
                        <p className="k-title text-[15px] leading-snug">{c.title}</p>
                        <p className="text-[11.5px] leading-snug mt-1.5 line-clamp-2" style={{ color: 'var(--k-mut)' }}>{c.jobToBeDone}</p>
                      </div>
                      <span className="mt-auto k-mono text-[10px] font-black tracking-[0.2em] flex items-center gap-1.5" style={{ color: 'var(--k-amber)' }}>WATCH CHANNEL <ArrowRight size={11} /></span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <ScopeReviewPanel entry={entry} />
          </div>

          {/* price + CTA rail */}
          <aside className="lg:col-span-4" aria-label="Pricing">
            <div className="k-slab p-6 space-y-5 sticky top-24" style={{ ['--slab-c' as string]: 'var(--k-amber)', transform: 'rotate(0.6deg)' }}>
              <div>
                <p className="k-mono text-[9px] tracking-[0.3em]" style={{ color: 'var(--k-mut)' }}>VALIDATION SPRINT</p>
                <p className="k-title text-3xl mt-1" style={{ color: 'var(--k-amber)' }}>
                  {sprint != null ? `FROM $${sprint.toLocaleString()}` : 'SCOPED'}
                </p>
              </div>
              <div className="space-y-2.5">
                {cta('validation_sprint', 'sprint_request', 'BOOK SPRINT', 'var(--k-amber)')}
                {cta('enterprise_pilot', entry.status === 'INTERNAL_CONTROLLED_PILOT' ? 'controlled_pilot_request' : 'enterprise_request',
                  entry.status === 'INTERNAL_CONTROLLED_PILOT' ? 'CONTROLLED PILOT' : 'ENTERPRISE PILOT', 'var(--k-violet)')}
              </div>
              <p className="k-mono text-[9px] leading-relaxed" style={{ color: 'var(--k-mut)' }}>
                TEST MODE — THE FORM RECORDS YOUR REQUEST, NOTHING IS CHARGED.
              </p>
            </div>
          </aside>
        </div>
      </div>
      {intent && <ProductInquiryModal intent={intent} productName={entry.title} onClose={() => setIntent(null)} />}
    </div>
  );
};

export default SuiteDetailPage;
