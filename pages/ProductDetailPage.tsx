import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { getProductBySlug } from '../catalog/products.ts';
import { StatusBadge } from '../components/catalog/StatusBadge.tsx';
import { MicroTool } from '../components/catalog/MicroTool.tsx';
import { ProductInquiryModal, type InquiryIntent } from '../components/catalog/ProductInquiryModal.tsx';
import { ArrowLeft, ShoppingBag, FlaskConical, Rocket, LayoutGrid, Users } from 'lucide-react';

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
 * Shared product page — a customer-facing micro-tool.
 * Prompt, schemas, limitations and approval metadata stay in the product
 * manifest (backend); the UI shows only product copy, the tool and CTAs.
 */
const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const product = getProductBySlug(slug);
  const [activeInquiry, setActiveInquiry] = useState<InquiryIntent | null>(null);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-[#0B0F14] text-white flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center space-y-4">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Product not found: {slug}
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
        <StatusBadge status={product.status} />
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
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
              {product.description}
            </p>
            <div className="flex items-start gap-2.5 text-xs text-zinc-400 max-w-3xl">
              <Users size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p><span className="font-mono font-black uppercase tracking-widest text-zinc-300">Built for:</span> {product.buyer}</p>
            </div>
          </div>

          {/* The micro-tool */}
          <MicroTool product={product} />
        </div>

        {/* Sidebar: acquisition CTAs */}
        <aside className="lg:col-span-4 space-y-4" aria-label="Acquisition options">
          <div className="bg-[#0E1319] border-2 border-black rounded-2xl p-6 space-y-4 sticky top-24 shadow-[4px_4px_0px_0px_#000000]">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
                Workflow Kit {price ? `· ${product.pricing.currency} ${price.toLocaleString('en-US')}` : ''}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {product.status === 'PUBLIC_DEMO' && 'Catalogue entry with a runnable tool. The kit is available on request.'}
                {product.status === 'STANDARD_KIT' && 'Prompt, schemas and runbook for self-serve execution by your team.'}
                {product.status === 'SUPERVISED_PILOT' && 'Supervised pilot with KONKRED engineers, scoped to your data.'}
                {product.status === 'ENTERPRISE_INTEGRATION' && 'Enterprise integration engagement, scoped with your team.'}
              </p>
            </div>

            {[
              { intent: 'workflow_kit' as InquiryIntent, icon: ShoppingBag, label: 'Buy Workflow Kit', note: price ? `${product.pricing.currency} ${price.toLocaleString('en-US')}` : 'Contact for pricing' },
              { intent: 'validation_sprint' as InquiryIntent, icon: FlaskConical, label: 'Book Validation Sprint', note: 'Get the validation report' },
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
              Purchases and bookings are in test mode — forms record your inquiry, nothing is charged.
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
