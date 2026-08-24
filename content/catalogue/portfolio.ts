/**
 * Portfolio loader — typed access to the canonical 36-entry catalogue.
 */
import raw from './portfolio-36.json';
import type { PortfolioEntry, PortfolioManifest, PortfolioStatus } from './types.ts';

export const PORTFOLIO = raw as unknown as PortfolioManifest;
export const ENTRIES: PortfolioEntry[] = PORTFOLIO.entries;
export const SUITES: PortfolioEntry[] = ENTRIES.filter((e) => e.type === 'SUITE');
export const WORKFLOWS: PortfolioEntry[] = ENTRIES.filter((e) => e.type === 'WORKFLOW');
export const STATUS_LEGEND = PORTFOLIO.manifest.statusLegend;
export const PORTFOLIO_CATEGORIES: string[] = [...new Set(ENTRIES.map((e) => e.category))].sort();

const bySlug = new Map(ENTRIES.map((e) => [e.slug, e]));
const byRoute = new Map(ENTRIES.map((e) => [e.route, e]));
const byLegacySlug = new Map(
  ENTRIES.filter((e) => e.legacySlug).map((e) => [e.legacySlug as string, e]),
);

export function getEntryBySlug(slug: string): PortfolioEntry | undefined {
  return bySlug.get(slug);
}

export function getEntryByRoute(route: string): PortfolioEntry | undefined {
  return byRoute.get(route);
}

export function getEntryByLegacySlug(slug: string): PortfolioEntry | undefined {
  return byLegacySlug.get(slug);
}

export function getChildren(suiteId: string): PortfolioEntry[] {
  return WORKFLOWS.filter((w) => w.parentId === suiteId);
}

export function searchEntries(query: string, type?: 'SUITE' | 'WORKFLOW'): PortfolioEntry[] {
  const q = query.trim().toLowerCase();
  const pool = type ? ENTRIES.filter((e) => e.type === type) : ENTRIES;
  if (!q) return pool;
  return pool.filter((e) =>
    e.title.toLowerCase().includes(q) ||
    e.jobToBeDone?.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q) ||
    (e.buyer || '').toLowerCase().includes(q) ||
    e.modules.some((m) => m.toLowerCase().includes(q)),
  );
}

export function formatFromPrice(usd: number | null | undefined): string | null {
  if (usd == null) return null;
  return `from $${usd.toLocaleString('en-US')}`;
}

export function entriesByStatus(status: PortfolioStatus): PortfolioEntry[] {
  return ENTRIES.filter((e) => e.status === status);
}
