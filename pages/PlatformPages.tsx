/**
 * Platform pages: /pricing, /sprint, /enterprise, /partners, /validation, /kits/:slug
 * Content comes from the portfolio manifest and the published packaging
 * reference (offer ladder, sprint scope, enterprise capabilities, OEM partner
 * categories). Ranges are labelled planning ranges; nothing is charged here —
 * checkout is test-mode.
 */
import React, { useEffect } from 'react';
import type { PageView } from '../types.ts';
import { ENTRIES, WORKFLOWS, SUITES, getEntryBySlug } from '../content/catalogue/portfolio.ts';
import { StatusChip, ValidationBadge, DesignScore } from '../components/portfolio/Evidence.tsx';
import { ProductInquiryModal, type InquiryIntent } from '../components/catalog/ProductInquiryModal.tsx';
import { track } from '../utils/analytics.ts';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PageProps {
  onNavigate: (page: PageView, slug?: string) => void;
}

const Shell: React.FC<{ eyebrow: string; title: string; lead: string; back?: () => void; children: React.ReactNode }> = ({ eyebrow, title, lead, back, children }) => (
  <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 pt-6">
    <div className="max-w-6xl mx-auto px-6 md:px-8">
      {back && (
        <button onClick={back} className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 hover:text-white transition-colors cursor-pointer mb-8">
          <ArrowLeft size={16} /> BACK
        </button>
      )}
      <div className="pb-8 border-b border-white/10 space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">{eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight uppercase">{title}</h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">{lead}</p>
      </div>
      <div className="pt-8">{children}</div>
    </div>
  </div>
);

const InquiryButton: React.FC<{ intent: InquiryIntent; label: string; event: Parameters<typeof track>[0]; product?: string }> = ({ intent, label, event, product }) => {
  const [open, setOpen] = useStateSafe(false);
  return (
    <>
      <button
        onClick={() => { track(event, product); if (event === 'kit_cta_click') track('checkout_start', product); setOpen(true); }}
        className="bg-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest px-6 py-3.5 border-2 border-black hover:bg-black hover:text-amber-400 hover:border-amber-500 transition-all cursor-pointer"
      >
        {label}
      </button>
      {open && <ProductInquiryModal intent={intent} productName={product ?? 'KONKRED platform'} onClose={() => setOpen(false)} />}
    </>
  );
};
// tiny wrapper so InquiryButton stays a single component
function useStateSafe(initial: boolean) {
  const [v, s] = React.useState(initial);
  return [v, s] as const;
}

/* ── /pricing ── */
export const PricingPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => { track('catalogue_view', 'pricing'); }, []);
  const ladder = [
    { name: 'Workflow Kit', range: '$97 – $297', note: 'one workflow: prompt, schemas, setup guide, public fixture, validator, approval instructions' },
    { name: 'Validation Sprint', range: '$1,500 – $10,000', note: 'fixed-scope: one workflow, one sample, one approver, one deliverable pack' },
    { name: 'Fixed-price Pilot', range: '$6,000 – $25,000', note: 'controlled pilot with named owner and acceptance measures' },
    { name: 'Managed workflow', range: '$1,500 – $15,000 / month', note: 'KONKRED-operated delivery with review and governance' },
    { name: 'Team / All-Catalog Workspace', range: '$599 – $4,000 / month', note: 'shared run history, policies, queues, evidence and exports' },
    { name: 'Enterprise setup', range: '$20,000 – $75,000 + recurring', note: 'SSO/RBAC, private tenant, connectors, audit logs, security review' },
  ];
  return (
    <Shell eyebrow="Pricing" title="Offer ladder" lead="Planning ranges from the published packaging reference. Price includes model/tool usage, review time, support and governance. Exact quotes come from a scoping call — nothing is charged on this site.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ladder.map((l) => (
          <div key={l.name} className="border-2 border-black bg-[#0E1319] rounded-2xl p-5 shadow-[3px_3px_0px_0px_#000000] space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-mono font-black text-sm text-white uppercase">{l.name}</h3>
              <span className="font-mono font-black text-amber-400 text-sm">{l.range}</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">{l.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 space-y-3">
        <h3 className="font-mono font-black uppercase tracking-widest text-xs">Workflow kit prices (catalogue)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {WORKFLOWS.filter((w) => w.pricing.kitFromUsd != null).map((w) => (
            <button key={w.slug} onClick={() => onNavigate('kit_detail', w.slug)} className="flex items-center justify-between gap-2 border border-zinc-800 rounded-xl px-3.5 py-2.5 bg-[#0E1319] hover:border-amber-500/50 cursor-pointer">
              <span className="text-[11px] text-zinc-300 truncate">{w.title}</span>
              <span className="font-mono font-black text-[11px] text-amber-400 shrink-0">${w.pricing.kitFromUsd?.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-10"><InquiryButton intent="all_catalog_workspace" label="Request a scoping call" event="enterprise_request" /></div>
    </Shell>
  );
};

/* ── /sprint ── */
export const SprintPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => { track('sprint_request', 'sprint-page'); }, []);
  const deliverables = [
    'Current-state workflow map', 'Data/privacy assessment', 'Configured workflow', 'Validation report',
    'Exception log', 'Human review checklist', 'Measured baseline and time-cost range', 'Pilot recommendation',
  ];
  return (
    <Shell eyebrow="Engagement" title="Validation Sprint" lead="A paid, fixed-scope engagement: one workflow, one representative sample, one policy/authority pack, one named approver, one acceptance definition — and one fixed deliverable pack.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2.5">
          <h3 className="font-mono font-black uppercase tracking-widest text-xs">You receive</h3>
          {deliverables.map((d) => (
            <p key={d} className="text-[12px] text-zinc-300 flex items-start gap-2.5"><CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />{d}</p>
          ))}
        </div>
        <div className="space-y-3">
          <div className="border-2 border-black bg-[#0E1319] rounded-2xl p-5 space-y-2">
            <p className="font-mono font-black uppercase tracking-widest text-[10px] text-zinc-500">Sprint entry prices (from the catalogue)</p>
            <div className="space-y-1.5">
              {[...SUITES.filter((s) => s.pricing.sprintFromUsd).map((s) => [s.title, s.pricing.sprintFromUsd] as const),
                ...WORKFLOWS.filter((w) => w.pricing.sprintFromUsd).map((w) => [w.title, w.pricing.sprintFromUsd] as const)].slice(0, 12).map(([t, p]) => (
                <div key={t} className="flex justify-between text-[11px]"><span className="text-zinc-400 truncate">{t}</span><span className="font-mono text-amber-400 shrink-0 ml-2">${p?.toLocaleString()}</span></div>
              ))}
            </div>
          </div>
          <InquiryButton intent="validation_sprint" label="Book a Validation Sprint" event="sprint_request" />
        </div>
      </div>
    </Shell>
  );
};

/* ── /enterprise ── */
export const EnterprisePage: React.FC<PageProps> = () => {
  useEffect(() => { track('enterprise_request', 'enterprise-page'); }, []);
  const caps = ['SSO/RBAC', 'Private tenant or deployment', 'Customer policy packs', 'Retention and deletion', 'Connectors', 'Audit logs', 'Security review', 'Support/SLA', 'Training', 'Usage metering'];
  return (
    <Shell eyebrow="For organizations" title="Enterprise integration" lead="Enterprise delivery includes the governance layer around the workflows: identity, isolation, policy packs, evidence retention and review queues. High-impact products are delivered as controlled pilots — never unrestricted self-serve execution.">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {caps.map((c) => <div key={c} className="border border-zinc-800 rounded-xl px-3.5 py-3 bg-[#0E1319] text-[11px] text-zinc-300 font-mono">{c}</div>)}
      </div>
      <div className="mt-8 border border-zinc-800 rounded-2xl p-5 bg-[#0E1319] space-y-2">
        <h3 className="font-mono font-black uppercase tracking-widest text-xs">Controlled-pilot catalogue</h3>
        <p className="text-[11px] text-zinc-400 leading-relaxed">These products run only with a named human approver and a controlled environment:</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {ENTRIES.filter((e) => e.status === 'INTERNAL_CONTROLLED_PILOT' || e.status === 'CONDITIONAL_VALIDATION').map((e) => (
            <span key={e.slug} className="text-[10px] font-mono text-orange-300 border border-orange-500/30 bg-orange-500/5 rounded-lg px-2 py-1">{e.title}</span>
          ))}
        </div>
      </div>
      <div className="mt-8"><InquiryButton intent="enterprise_pilot" label="Request Enterprise Pilot" event="enterprise_request" /></div>
    </Shell>
  );
};

/* ── /partners ── */
export const PartnersPage: React.FC<PageProps> = () => {
  const sectors = ['GRC consultancies', 'Accounting firms', 'Legal-ops providers', 'Proposal/RFP teams', 'Healthcare RCM vendors', 'Procurement advisors', 'Cloud consultancies', 'Atlassian partners'];
  return (
    <Shell eyebrow="Channel" title="Partners & OEM" lead="KONKRED workflows embed into existing advisory and platform relationships. Partner categories from the published monetization reference — no reseller claims beyond that.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {sectors.map((s) => <div key={s} className="border border-zinc-800 rounded-xl px-3.5 py-4 bg-[#0E1319] text-[11px] text-zinc-300 font-mono text-center">{s}</div>)}
      </div>
      <div className="mt-8 border border-zinc-800 rounded-2xl p-5 bg-[#0E1319]">
        <h3 className="font-mono font-black uppercase tracking-widest text-xs mb-2">What partners get</h3>
        <p className="text-[11px] text-zinc-400 leading-relaxed">Workflow kits at partner terms, joint validation sprints, and supervised pilots inside your delivery envelope. Partner contracts and margins are agreed directly — nothing automatic on this page.</p>
      </div>
      <div className="mt-8"><InquiryButton intent="enterprise_pilot" label="Start a partner conversation" event="enterprise_request" product="KONKRED Partners" /></div>
    </Shell>
  );
};

/* ── /validation ── */
export const ValidationPage: React.FC<PageProps> = ({ onNavigate }) => {
  useEffect(() => { track('validation_view'); }, []);
  const pass = ENTRIES.filter((e) => e.validationStatus === 'PASS').length;
  const cond = ENTRIES.filter((e) => e.validationStatus === 'CONDITIONAL').length;
  return (
    <Shell eyebrow="Evidence" title="Validation record" lead="Every catalogue entry carries a public-data preflight: a deterministic, narrow reference test on public documents or datasets. PASS means that test met its acceptance checks — it is not model accuracy, not certification and not production approval.">
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[['preflight PASS', pass], ['CONDITIONAL', cond], ['total entries', ENTRIES.length]].map(([k, v]) => (
          <div key={k as string} className="border-2 border-black bg-[#0E1319] rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000000]">
            <p className="font-mono font-black text-2xl text-amber-400">{v as number}</p>
            <p className="font-mono uppercase tracking-widest text-[9px] text-zinc-500 mt-1">{k as string}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {ENTRIES.map((e) => (
          <button key={e.slug} onClick={() => onNavigate(e.type === 'SUITE' ? 'suite_detail' : 'workflow_detail', e.slug)}
            className="w-full text-left border border-zinc-800 rounded-xl px-4 py-3 bg-[#0E1319] hover:border-amber-500/50 cursor-pointer flex flex-wrap items-center gap-3">
            <span className={`font-mono text-[8px] uppercase tracking-widest font-black border rounded px-1.5 py-0.5 ${e.type === 'SUITE' ? 'text-amber-400 border-amber-500/30' : 'text-cyan-400 border-cyan-500/30'}`}>{e.type}</span>
            <span className="text-[12px] text-zinc-200 flex-1 min-w-40">{e.title}</span>
            <ValidationBadge status={e.validationStatus} />
            <span className="font-mono text-[9px] text-zinc-600">{e.publicValidation.sources.length} source{e.publicValidation.sources.length === 1 ? '' : 's'} · {e.publicValidation.runDate}</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-[10px] font-mono text-zinc-600 leading-relaxed">
        Static design target — not measured model performance. Public-data preflight — narrow reference test.
        Next validation level (target-model evaluation on versioned fixtures) has not been run for any entry.
      </p>
    </Shell>
  );
};

/* ── /kits/:slug ── */
export const KitDetailPage: React.FC<PageProps & { slug: string }> = ({ onNavigate, slug }) => {
  const entry = getEntryBySlug(slug);
  if (!entry || entry.type !== 'WORKFLOW') {
    return (
      <Shell eyebrow="Kit" title="Kit not found" lead={`No workflow kit exists for "${slug}".`} back={() => onNavigate('catalogue')}>
        <InquiryButton intent="workflow_kit" label="Back to catalogue" event="kit_cta_click" />
      </Shell>
    );
  }
  const includes = ['Prompt (versioned)', 'Input/output schemas', 'Setup guide', 'Public fixture', 'Validator/checklist', 'Failure modes', 'Human approval instructions', 'Version and licence terms'];
  return (
    <Shell eyebrow={`Workflow kit · ${entry.category}`} title={entry.title} lead="A packaged kit your team runs inside your own environment: everything needed for one controlled workflow, nothing that executes external actions." back={() => onNavigate('workflow_detail', entry.slug)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2.5">
          <h3 className="font-mono font-black uppercase tracking-widest text-xs">Kit includes</h3>
          {includes.map((i) => <p key={i} className="text-[12px] text-zinc-300 flex items-start gap-2.5"><CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />{i}</p>)}
          <div className="pt-3"><StatusChip status={entry.status} /></div>
        </div>
        <div className="space-y-4">
          <div className="border-2 border-black bg-[#0E1319] rounded-2xl p-5 shadow-[3px_3px_0px_0px_#000000] space-y-2">
            <p className="font-mono uppercase tracking-widest text-[9px] text-zinc-500">Kit price</p>
            <p className="font-mono font-black text-3xl text-amber-400">
              {entry.pricing.kitFromUsd != null ? `$${entry.pricing.kitFromUsd.toLocaleString()}` : 'On request'}
            </p>
            {entry.pricing.note && <p className="text-[9px] font-mono text-zinc-600">{entry.pricing.note}</p>}
            <p className="text-[10px] font-mono text-zinc-500 pt-1">Test mode — the form records your order; payment is arranged manually, nothing is charged now.</p>
          </div>
          <div className="space-y-2"><DesignScore score={entry.staticDesignScore} /></div>
          <InquiryButton intent="workflow_kit" label={`Order the ${entry.title} kit`} event="kit_cta_click" product={entry.title} />
        </div>
      </div>
    </Shell>
  );
};
