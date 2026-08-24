/**
 * Scope & review — ONE quiet footer line under the product.
 * Owner direction: sellable micro-tools, no internal walls of text.
 * The full boundary/approval data stays in the manifest (backend); the page
 * shows only a short reviewed-by line and a collapsed "doesn't do" list.
 */
import React from 'react';
import type { PortfolioEntry } from '../../content/catalogue/types.ts';

function doesNotDo(entry: PortfolioEntry): string[] {
  const items: string[] = [];
  if (entry.exclusions.length) {
    items.push(...entry.exclusions.slice(0, 2));
  } else if (entry.productBoundary) {
    items.push(entry.productBoundary);
  }
  if (!items.some((i) => /autonomous|external action/i.test(i))) {
    items.push('No autonomous execution: outputs require a human decision.');
  }
  return items.slice(0, 3);
}

const shortApprover = (a: string) => a.split(/[;.]| plus /)[0].trim();

export const ScopeReviewPanel: React.FC<{ entry: PortfolioEntry }> = ({ entry }) => (
  <footer aria-label="Scope and review" className="border-t-2 pt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5" style={{ borderColor: 'var(--k-line)' }}>
    <span className="text-[10px]" style={{ color: 'var(--k-mut)' }}>
      Reviewed by <span style={{ color: 'var(--k-ink)' }}>{entry.humanApprover ? shortApprover(entry.humanApprover) : 'a named owner in your team'}</span>
    </span>
    <span className="text-[10px]">·</span>
    <span className="text-[10px]" style={{ color: 'var(--k-mut)' }}>Outputs are drafts — nothing sends, posts, signs or pays automatically</span>
    <details className="group">
      <summary className="text-[10px] cursor-pointer list-none font-mono uppercase tracking-[0.15em]" style={{ color: 'var(--k-mut)' }}>what this {entry.type === 'SUITE' ? 'suite' : 'tool'} doesn't do ▸</summary>
      <ul className="mt-1.5 space-y-1">
        {doesNotDo(entry).map((d, i) => (
          <li key={i} className="text-[10px] leading-relaxed" style={{ color: 'var(--k-mut)' }}>— {d.replace(/\.$/, '')}.</li>
        ))}
      </ul>
    </details>
  </footer>
);
