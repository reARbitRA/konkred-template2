import React, { useMemo, useState } from 'react';
import { PageView } from '../types.ts';
import { PRODUCTS, CATEGORIES, STATUSES, searchProducts } from '../catalog/products.ts';
import { ProductCard } from '../components/catalog/ProductCard.tsx';
import { ArrowLeft, Search, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import type { ProductStatus } from '../catalog/types.ts';

interface CataloguePageProps {
  onNavigate: (page: PageView, slug?: string) => void;
}

/**
 * Searchable 15-product catalogue with category and status filters.
 */
const CataloguePage: React.FC<CataloguePageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState<'all' | ProductStatus>('all');

  const results = useMemo(() => {
    let list = searchProducts(query);
    if (category !== 'all') list = list.filter(p => p.category === category);
    if (status !== 'all') list = list.filter(p => p.status === status);
    return list;
  }, [query, category, status]);

  const activeFilters = (category !== 'all' ? 1 : 0) + (status !== 'all' ? 1 : 0);

  const handleReset = () => {
    setQuery('');
    setCategory('all');
    setStatus('all');
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-2 pb-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-500 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>RETURN_TO_BASE (LANDING)</span>
        </button>
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
          {PRODUCTS.length} PRODUCTS // {STATUSES.length} STATUS LEVELS
        </span>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-10 pb-8">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-3">
          <SlidersHorizontal size={14} />
          <span>DATA-DRIVEN PRODUCT CATALOGUE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight uppercase mb-4">
          Workflow Products
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
          Fifteen AI workflow products, each delivered as an interactive micro-tool you can
          load and run with sample data. Status labels show how each product is delivered —
          kit, pilot or enterprise — so you always know what you're getting.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-6 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, buyers…"
            aria-label="Search products"
            className="w-full bg-[#0E1319] border-2 border-black rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            <SlidersHorizontal size={12} />
            <span>Filter:</span>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="bg-[#0E1319] border-2 border-black rounded-lg px-3 py-2 text-xs font-mono uppercase tracking-wider text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | ProductStatus)}
            aria-label="Filter by status"
            className="bg-[#0E1319] border-2 border-black rounded-lg px-3 py-2 text-xs font-mono uppercase tracking-wider text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>

          {activeFilters > 0 && (
            <button
              onClick={handleReset}
              className="text-[10px] font-mono uppercase tracking-widest text-amber-500 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Clear filters ({activeFilters})
            </button>
          )}

          <span className="ml-auto text-[11px] font-mono text-zinc-500">
            {results.length} of {PRODUCTS.length} products
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {results.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="font-mono text-sm uppercase tracking-widest text-zinc-400">
              No products match your filters.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 bg-amber-500 text-black font-mono font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(product => (
              <ProductCard
                key={product.slug}
                product={product}
                onOpen={(slug) => onNavigate('product_detail', slug)}
              />
            ))}
          </div>
        )}

        {/* Trust / security / validation section */}
        <section className="mt-16 border-t border-white/10 pt-10" aria-label="Trust and validation">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Server-Side AI Only',
                body: 'All model calls run through the KONKRED API with credentials held server-side. Client bundles never receive API keys.',
              },
              {
                title: 'Schema-Validated Outputs',
                body: 'Every demo/model response is validated against the product output schema before it renders. Invalid output is rejected, not displayed.',
              },
              {
                title: 'One Manifest, 15 Products',
                body: 'A single canonical manifest drives every card, tool and schema — updates ship consistently across the entire catalogue.',
              },
            ].map(item => (
              <div key={item.title} className="bg-[#0E1319] border-2 border-black rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-500" />
                  <h3 className="text-xs font-mono font-black uppercase tracking-widest text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CataloguePage;
