/**
 * Scope & review — compact, neutral, secondary panel BELOW the product.
 * Owner direction: sellable micro-tools first; approval scope and boundaries
 * live here in calm language — no red banners, no raw prompts, no
 * self-critical walls of text above the product.
 *
 * Satisfies the publishing standard: human-approval notice and
 * "What this tool does not do" are present on every entry.
 */
import React from 'react';
import type { PortfolioEntry } from '../../content/catalogue/types.ts';

function doesNotDo(entry: PortfolioEntry): string[] {
  const items: string[] = [];
  if (entry.exclusions.length) {
    items.push(...entry.exclusions.slice(0, 2));
  } else if (entry.productBoundary) {
    items.push(entry.productBoundary);
  } else {
    items.push('Does not execute external actions — every output is a draft for human review.');
  }
  if (!items.some((i) => /autonomous|external action/i.test(i))) {
    items.push('No autonomous execution: outputs require a human decision before anything happens.');
  }
  return items.slice(0, 3);
}

export const ScopeReviewPanel: React.FC<{ entry: PortfolioEntry }> = ({ entry }) => (
  <aside
    aria-label="Scope and review"
    className="border border-zinc-800 bg-[#0B0F14] rounded-xl px-5 py-4 space-y-2.5"
  >
    <h4 className="font-mono font-bold uppercase tracking-widest text-[9px] text-zinc-500">Scope &amp; review</h4>
    <p className="text-[11px] text-zinc-400 leading-relaxed">
      <span className="text-zinc-300 font-semibold">Reviewed by:</span>{' '}
      {entry.humanApprover ?? 'a named owner in your organization'}.
    </p>
    <details className="group">
      <summary className="text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer font-mono uppercase tracking-wider text-[10px] list-none">
        ▸ What this {entry.type === 'SUITE' ? 'suite' : 'tool'} does not do
      </summary>
      <ul className="mt-2 space-y-1.5">
        {doesNotDo(entry).map((d, i) => (
          <li key={i} className="text-[11px] text-zinc-500 leading-relaxed flex gap-2">
            <span className="text-zinc-700 font-mono">—</span>
            <span>{d.replace(/\.$/, '')}.</span>
          </li>
        ))}
      </ul>
    </details>
  </aside>
);
