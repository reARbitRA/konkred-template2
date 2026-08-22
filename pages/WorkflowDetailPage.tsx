/**
 * Validated workflow page (/tools/:slug) — a sellable micro-tool.
 * Owner direction: the tool is the page. One-liner, run it, see the workspace,
 * clear price, one quiet evidence/scope line. Methodology detail lives in the
 * manifest (backend), not on this page.
 */
import React, { useEffect, useMemo } from 'react';
import type { PageView } from '../types.ts';
import { getEntryBySlug, SUITES } from '../content/catalogue/portfolio.ts';
import type { PortfolioEntry } from '../content/catalogue/types.ts';
import type { ProductRecord } from '../catalog/types.ts';
import { MicroTool } from '../components/catalog/MicroTool.tsx';
import { Pattern } from '../components/portfolio/patterns/index.tsx';
import { StatusChip, EvidenceLine } from '../components/portfolio/Evidence.tsx';
import { ScopeReviewPanel } from '../components/portfolio/ScopeReviewPanel.tsx';
import { CtaRail } from '../components/portfolio/CtaRail.tsx';
import { track } from '../utils/analytics.ts';
import { ArrowLeft } from 'lucide-react';

interface Props {
  slug: string;
  onNavigate: (page: PageView, slug?: string) => void;
}

const WorkflowDetailPage: React.FC<Props> = ({ slug, onNavigate }) => {
  const entry: PortfolioEntry | undefined = getEntryBySlug(slug);
  useEffect(() => { if (entry) track('workflow_view', entry.id); }, [entry?.id]);

  const parentSuite = SUITES.find((s) => s.id === entry?.parentId);

  const shim: ProductRecord | null = useMemo(() => {
    if (!entry?.demo) return null;
    return {
      id: entry.id,
      slug: entry.slug,
      name: entry.title,
      category: entry.category,
      status: 'PUBLIC_DEMO',
      risk: 'low',
      humanApprovalRequired: entry.humanApprovalRequired,
      shortDescription: entry.jobToBeDone ?? '',
      description: entry.definition ?? '',
      buyer: entry.buyer ?? '',
      prompt: entry.demo.prompt,
      inputSchema: entry.demo.inputSchema,
      outputSchema: entry.demo.outputSchema,
      fixture: entry.demo.fixturePath ? { path: entry.demo.fixturePath, label: entry.demo.fixtureLabel ?? '', source: entry.demo.fixtureSource ?? '' } : null,
      demoStatus: { available: entry.demo.available, fixturePath: entry.demo.fixturePath, note: '' },
      validationReport: { status: 'available', path: entry.validationReport, note: '' },
      pricing: (entry.demo.legacyPricing as unknown as ProductRecord['pricing']) ?? { kitUsd: null, validationSprintUsd: null, enterprisePilot: null, currency: 'USD', proposed: true },
      limitations: entry.demo.legacyLimitations,
    };
  }, [entry?.id]);

  if (!entry || entry.type !== 'WORKFLOW' || !shim) {
    return (
      <div className="min-h-[60vh] bg-[#0B0F14] text-white flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">Workflow not found: {slug}</p>
          <button onClick={() => onNavigate('catalogue')} className="inline-flex items-center gap-2 bg-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
            <ArrowLeft size={14} /> Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

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

        {/* Header — one screen, one message */}
        <div className="py-8 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight uppercase leading-tight">{entry.title}</h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">{entry.jobToBeDone}</p>
          <p className="text-xs text-zinc-500">
            For {entry.buyer?.toLowerCase()}
            {entry.parentRoute && parentSuite && (
              <>
                {' · '}
                <button onClick={() => onNavigate('suite_detail', parentSuite.slug)} className="text-cyan-400/90 hover:text-cyan-300 cursor-pointer">
                  part of the {parentSuite.title} →
                </button>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* The product */}
          <div className="lg:col-span-8 space-y-8 brutal-stagger">
            <MicroTool product={shim} fixtureKey={entry.legacySlug ?? undefined} />
            <Pattern entry={entry} />
            <div className="space-y-4">
              <EvidenceLine entry={entry} onOpenValidation={() => onNavigate('validation')} />
              <ScopeReviewPanel entry={entry} />
            </div>
          </div>

          {/* Price + CTA */}
          <div className="lg:col-span-4">
            <CtaRail entry={entry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetailPage;
