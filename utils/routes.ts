import { PageView } from '../types.ts';

export interface RouteMatch {
  page: PageView;
  listingId?: string;
}

export const PAGE_ROUTES: Record<PageView, string> = {
  landing: '/',
  marketplace: '/marketplace',
  listing_detail: '/listing',
  wizard: '/wizard',
  forge_audit: '/forge-audit',
  forge: '/forge',
  fullkonk: '/fullkonk',
  playgrounds: '/playgrounds',
  intel_report: '/intel-report',
  wallet: '/wallet',
  usage: '/enclave',
  seller_dashboard: '/seller-dashboard',
  account: '/account',
  academy: '/academy',
  intel: '/intel',
  network: '/network',
  advisory: '/advisory',
  documentation: '/docs',
  career: '/career',
  resources: '/resources',
  ktools: '/ktools',
  pricing: '/pricing',
  checkout: '/checkout',
  enter: '/login',
  join_network: '/join',
  verify_email: '/verify-email',
  contact: '/contact',
  usage_metrics: '/metrics',
  affiliate: '/affiliate',
  admin: '/admin',
  dispute: '/dispute',
  style_guide: '/style-guide',
  redaeye: '/redaeye',
  redaeye_sandbox: '/redaeye-sandbox',
};

/**
 * Get clean URL path for a given page and optional listing ID.
 */
export function getPathForPage(page: PageView, listingId?: string): string {
  if (page === 'listing_detail' && listingId) {
    return `/listing/${encodeURIComponent(listingId)}`;
  }
  if (page === 'checkout' && listingId) {
    return `/checkout/${encodeURIComponent(listingId)}`;
  }
  return PAGE_ROUTES[page] || '/';
}

/**
 * Parse pathname into PageView and optional parameters.
 */
export function getPageFromPath(path: string): RouteMatch {
  const cleanPath = path.split('?')[0].toLowerCase().replace(/\/$/, '') || '/';

  if (cleanPath === '' || cleanPath === '/') {
    return { page: 'landing' };
  }

  // Listing details: /listing/:id
  if (cleanPath.startsWith('/listing/')) {
    const id = decodeURIComponent(cleanPath.replace('/listing/', '').split('/')[0]);
    return { page: 'listing_detail', listingId: id };
  }

  // Checkout: /checkout/:id or /checkout
  if (cleanPath.startsWith('/checkout/')) {
    const id = decodeURIComponent(cleanPath.replace('/checkout/', '').split('/')[0]);
    return { page: 'checkout', listingId: id };
  }

  // Match against PAGE_ROUTES
  for (const [pageKey, routePath] of Object.entries(PAGE_ROUTES)) {
    if (cleanPath === routePath) {
      return { page: pageKey as PageView };
    }
  }

  // Fallback aliases
  if (cleanPath === '/sell') return { page: 'wizard' };
  if (cleanPath === '/library' || cleanPath === '/usage') return { page: 'usage' };
  if (cleanPath === '/forum') return { page: 'network' };
  if (cleanPath === '/consulting') return { page: 'advisory' };
  if (cleanPath === '/documentation') return { page: 'documentation' };
  if (cleanPath === '/enter') return { page: 'enter' };
  if (cleanPath === '/join-network') return { page: 'join_network' };
  if (cleanPath === '/usage-metrics') return { page: 'usage_metrics' };
  if (cleanPath === '/redaeye_sandbox') return { page: 'redaeye_sandbox' };

  return { page: 'landing' };
}
