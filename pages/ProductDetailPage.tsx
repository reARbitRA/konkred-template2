import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { getProductBySlug } from '../catalog/products.ts';
import { StatusBadge } from '../components/catalog/StatusBadge.tsx';
import { RiskBadge, HumanApprovalNotice } from '../components/catalog/RiskBadge.tsx';
import { ProductDemo } from '../components/catalog/ProductDemo.tsx';
import { ProductInquiryModal, type InquiryIntent } from '../components/catalog/ProductInquiryModal.tsx';
import { ArrowLeft, FileText, ShoppingBag, FlaskConical, Rocket, LayoutGrid, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: PageView, slug?: string) => void;
}

const CTA_STYLES: Record<InquiryIntent, string> = {
  workflow_kit: 'bg-amber-500 text-black border-black hover:bg-black hover:text-amber-400',
  validation_sprint: 'bg-cyan-500 text-black border-black hover:bg-black hover:text-cyan-400',
  enterprise_pilot: 'bg-purple-500 text-black border-black hover:bg-black hover:text-purple-400',
  all_catalog_workspace: 'bg-white text-black border-black hover:bg-zinc-200',
};

/**
 * Shared product-detail template. Renders every product from the manifest —
 * no per-product hardcoded pages.
 */
const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const product = getProductBySlug(slug);
  const [activeInquiry, setActiveInquiry] = useState<InquiryIntent | null>(null);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-[#0B0F14] text-white flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle size={28} className="mx-auto text-amber-500" />
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Unknown product slug: {slug}
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 bg-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  const price = product.pricing.kitUsd;

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-2 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('products')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO CATALOGUE</span>
        </button>
        <div className="flex items-center gap-2">
          <StatusBadge status={product.status} />
          <RiskBadge risk={product.risk} humanApprovalRequired={product.humanApprovalRequired} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
              {product.category}
            </p>
            <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight uppercase leading-tight">
              {product.name}
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
              {product.description}
            </p>
          </div>

          {product.humanApprovalRequired && <HumanApprovalNotice />}

          <div className="space-y-6">
            <section aria-label="Product details">
              <h2 className="font-mono font-black uppercase tracking-widest text-sm text-white mb-3 flex items-center gap-2">
                <FileText size={15} className="text-amber-500" /> Product Details
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0E1319] border-2 border-black rounded-xl p-4">
                  <dt className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Primary Buyer</dt>
                  <dd className="text-xs text-zinc-300 leading-relaxed">{product.buyer}</dd>
                </div>
                <div className="bg-[#0E1319] border-2 border-black rounded-xl p-4">
                  <dt className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Validation Report</dt>
                  <dd className="text-xs text-zinc-300">
                    {product.validationReport.status === 'available' ? (
                      <span className="text-emerald-400">Available</span>
                    ) : (
                      <span className="text-amber-400">Pending — produced by a validation sprint</span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Prompt + schemas */}
            <section aria-label="Prompt and schemas">
              <h2 className="font-mono font-black uppercase tracking-widest text-sm text-white mb-3">
                Canonical Prompt &amp; Schemas
              </h2>
              <div className="space-y-3">
                <div className="bg-[#0E1319] border-2 border-black rounded-xl p-4">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-2">PROMPT // v1</p>
                  <p className="text-xs text-zinc-300 leading-relaxed font-mono">{product.prompt}</p>
                </div>
                <details className="bg-[#0E1319] border-2 border-black rounded-xl p-4 group">
                  <summary className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-black cursor-pointer select-none">
                    Input Schema (JSON)
                  </summary>
                  <pre className="mt-3 bg-black/60 rounded-lg p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto">
                    {JSON.stringify(product.inputSchema, null, 2)}
                  </pre>
                </details>
                <details className="bg-[#0E1319] border-2 border-black rounded-xl p-4 group">
                  <summary className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-black cursor-pointer select-none">
                    Output Schema (JSON)
                  </summary>
                  <pre className="mt-3 bg-black/60 rounded-lg p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto">
                    {JSON.stringify(product.outputSchema, null, 2)}
                  </pre>
                </details>
              </div>
            </section>

            {/* Public demo */}
            <ProductDemo product={product} />

            {/* Limitations */}
            <section aria-label="Limitations">
              <h2 className="font-mono font-black uppercase tracking-widest text-sm text-white mb-3 flex items-center gap-2">
                <ShieldCheck size={15} className="text-amber-500" /> Limitations
              </h2>
              <ul className="space-y-2">
                {product.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-[#0E1319] border-2 border-black rounded-xl px-4 py-3">
                    <span className="text-amber-500 font-mono text-xs mt-0.5">→</span>
                    <span className="text-xs text-zinc-300 leading-relaxed">{limitation}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Sidebar: pricing + CTAs */}
        <aside className="lg:col-span-4 space-y-4" aria-label="Acquisition options">
          <div className="bg-[#0E1319] border-2 border-black rounded-2xl p-6 space-y-4 sticky top-24">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                Workflow Kit {price ? `· Proposed ${product.pricing.currency} ${price.toLocaleString('en-US')}` : ''}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {product.status === 'PUBLIC_DEMO' && 'Catalogue entry with public demo. The kit is available on request.'}
                {product.status === 'STANDARD_KIT' && 'Prompt + schemas + runbook for self-serve execution by your team.'}
                {product.status === 'SUPERVISED_PILOT' && 'Supervised pilot with KONKRED validation engineers.'}
                {product.status === 'ENTERPRISE_INTEGRATION' && 'Enterprise integration engagement with security review.'}
              </p>
            </div>

            {[
              { intent: 'workflow_kit' as InquiryIntent, icon: ShoppingBag, label: 'Buy Workflow Kit', note: price ? `${product.pricing.currency} ${price.toLocaleString('en-US')} (proposed)` : 'Contact for pricing' },
              { intent: 'validation_sprint' as InquiryIntent, icon: FlaskConical, label: 'Book Validation Sprint', note: 'Produces the validation report' },
              { intent: 'enterprise_pilot' as InquiryIntent, icon: Rocket, label: 'Request Enterprise Pilot', note: 'Scoped + supervised' },
            ].map(({ intent, icon: Icon, label, note }) => (
              <button
                key={intent}
                onClick={() => setActiveInquiry(intent)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 font-mono font-black text-[11px] uppercase tracking-widest border-2 rounded-xl transition-all cursor-pointer ${CTA_STYLES[intent]}`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={14} /> {label}
                </span>
                <span className="text-[8px] font-bold normal-case tracking-normal opacity-70">{note}</span>
              </button>
            ))}

            <button
              onClick={() => setActiveInquiry('all_catalog_workspace')}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-mono font-black text-[11px] uppercase tracking-widest border-2 rounded-xl transition-all cursor-pointer ${CTA_STYLES.all_catalog_workspace}`}
            >
              <LayoutGrid size={14} /> All-Catalog Workspace
            </button>

            <p className="text-[9px] font-mono text-zinc-500 leading-relaxed">
              All purchases and bookings are in TEST MODE — payment/CRM credentials are not
              configured. Forms record leads only; nothing is charged.
            </p>
          </div>
        </aside>
      </div>

      {activeInquiry && (
        <ProductInquiryModal
          intent={activeInquiry}
          productName={product.name}
          onClose={() => setActiveInquiry(null)}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
