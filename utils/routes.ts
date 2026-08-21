import { PageView } from '../types.ts';

export interface RouteMatch {
  page: PageView;
  listingId?: string;
  slug?: string;
}

/**
 * Route map for the KONKRED platform (post-purge).
 *
 * Purged legacy routes (marketplace, listing, wallet, seller/buyer dashboards,
 * checkout, wizard, affiliate, admin, dispute, metrics, ktools, forge tools,
 * playgrounds, intel-report, pricing) intentionally redirect to a real page or
 * resolve to the 404 page — they never render fake pages.
 */
export const PAGE_ROUTES: Record<PageView, string> = {
  landing: '/',
  forge_audit: '/forge-audit',
  audit: '/audit',
  fullkonk: '/fullkonk',
  redaeye: '/redaeye',
  redaeye_sandbox: '/redaeye-sandbox',
  products: '/products',
  product_detail: '/products/:slug',
  not_found: '/404',
  academy: '/academy',
  intel: '/intel',
  network: '/network',
  advisory: '/advisory',
  documentation: '/docs',
  career: '/career',
  resources: '/resources',
  enter: '/login',
  join_network: '/join',
  account: '/account',
  contact: '/contact',
  style_guide: '/style-guide',
  verify_email: '/verify-email',
};

/**
 * Intentional redirect map for purged routes.
 * Maps a legacy pathname to the PageView it should resolve to.
 */
const REDIRECTS: Record<string, PageView> = {
  '/marketplace': 'products', // replaced by the real product catalogue
  '/catalogue': 'products',
  '/ktools': 'products',
  '/pricing': 'products',
  '/forge': 'fullkonk', // The Forge merged into fullKONK_>
  '/forge-audit-old': 'forge_audit',
  '/redaeye_sandbox': 'redaeye', // dev alias -> canonical
  '/sell': 'products',
  '/wizard': 'not_found',
  '/checkout': 'not_found',
  '/wallet': 'not_found',
  '/enclave': 'not_found',
  '/library': 'not_found',
  '/usage': 'not_found',
  '/seller-dashboard': 'not_found',
  '/buyer-dashboard': 'not_found',
  '/affiliate': 'not_found',
  '/admin': 'not_found',
  '/dispute': 'not_found',
  '/metrics': 'not_found',
  '/usage-metrics': 'not_found',
  '/playgrounds': 'not_found',
  '/intel-report': 'not_found',
  '/listing': 'not_found',
};

/**
 * Get clean URL path for a given page and optional parameters.
 */
export function getPathForPage(page: PageView, slug?: string): string {
  if (page === 'product_detail' && slug) {
    return `/products/${encodeURIComponent(slug)}`;
  }
  if (page === 'forge_audit') return '/forge-audit';
  return PAGE_ROUTES[page] || '/';
}

/**
 * Parse pathname into PageView and optional parameters.
 * Redirects for purged routes are resolved here; callers should replace the
 * URL with the resolved path when a redirect is returned.
 */
export function getPageFromPath(path: string): RouteMatch & { redirectedFrom?: string } {
  const cleanPath = path.split('?')[0].toLowerCase().replace(/\/$/, '') || '/';

  if (cleanPath === '' || cleanPath === '/') {
    return { page: 'landing' };
  }

  // Product detail: /products/:slug
  if (cleanPath.startsWith('/products/')) {
    const slug = decodeURIComponent(cleanPath.replace('/products/', '').split('/')[0]);
    if (!slug) return { page: 'products' };
    return { page: 'product_detail', slug };
  }

  // Purged marketplace listing details: /listing/:id -> 404 (replaced by products)
  if (cleanPath.startsWith('/listing/')) {
    return { page: 'not_found', redirectedFrom: cleanPath };
  }

  // Exact route match
  for (const [pageKey, routePath] of Object.entries(PAGE_ROUTES)) {
    if (cleanPath === routePath) {
      return { page: pageKey as PageView };
    }
  }

  // Aliases
  if (cleanPath === '/audit' || cleanPath === '/auditor') return { page: 'forge_audit' };
  if (cleanPath === '/forum') return { page: 'network' };
  if (cleanPath === '/consulting') return { page: 'advisory' };
  if (cleanPath === '/documentation') return { page: 'documentation' };
  if (cleanPath === '/enter') return { page: 'enter' };
  if (cleanPath === '/join-network') return { page: 'join_network' };

  // Intentional redirects for purged routes
  const redirect = REDIRECTS[cleanPath];
  if (redirect) {
    return { page: redirect, redirectedFrom: cleanPath };
  }

  // Unknown -> 404
  return { page: 'not_found' };
}
