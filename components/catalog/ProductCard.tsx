import React from 'react';
import type { ProductRecord } from '../../catalog/types.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: ProductRecord;
  onOpen: (slug: string) => void;
}

/**
 * Shared catalogue card — a tool launcher. Clean product copy only:
 * category, name, short description, status and price. No risk warnings,
 * prompts, limitations or fabricated social proof.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpen }) => {
  const price = product.pricing.kitUsd;

  return (
    <article
      className="group relative bg-[#0E1319] border-2 border-black rounded-2xl p-6 flex flex-col gap-4 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#D98A2E] transition-all duration-150 min-h-[300px]"
    >
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={product.status} size="sm" />
      </div>

      <div className="space-y-1">
        <p className="text-[9px] font-mono uppercase tracking-widest text-amber-500 font-bold">
          {product.category}
        </p>
        <h3 className="text-lg font-mono font-black text-white uppercase tracking-tight leading-snug">
          {product.name}
        </h3>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed flex-1">
        {product.shortDescription}
      </p>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
          <span className="text-zinc-500">
            {product.demoStatus.available ? 'Sample data included' : 'Pilot access'}
          </span>
          <span className="text-zinc-400">
            {product.validationReport.status === 'pending' ? 'Validation: Pending' : 'Validation: Available'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-black text-white">
            {price != null ? `${product.pricing.currency} ${price.toLocaleString('en-US')}` : 'Enterprise Pilot'}
          </span>
          <button
            onClick={() => onOpen(product.slug)}
            aria-label={`Launch ${product.name}`}
            className="inline-flex items-center gap-1.5 bg-amber-500 text-black font-mono font-black text-[10px] uppercase tracking-widest px-3 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Launch Tool <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
};
