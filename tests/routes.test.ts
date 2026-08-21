import { describe, it, expect } from 'vitest';
import { getPageFromPath, getPathForPage, PAGE_ROUTES } from '../utils/routes.ts';
import { PRODUCTS } from '../catalog/products.ts';

describe('route map — all 15 product slugs', () => {
  it('every product slug maps to a product_detail route', () => {
    for (const product of PRODUCTS) {
      const match = getPageFromPath(`/products/${product.slug}`);
      expect(match.page).toBe('product_detail');
      expect(match.slug).toBe(product.slug);
    }
  });

  it('getPathForPage round-trips every product detail URL', () => {
    for (const product of PRODUCTS) {
      const url = getPathForPage('product_detail', product.slug);
      expect(url).toBe(`/products/${product.slug}`);
      expect(getPageFromPath(url).slug).toBe(product.slug);
    }
  });

  it('catalogue route resolves for /products and /catalogue', () => {
    expect(getPageFromPath('/products').page).toBe('products');
    expect(getPageFromPath('/catalogue').page).toBe('products');
  });
});

describe('route map — preserved flagship routes', () => {
  it('audit routes resolve to the audit-only page (no forge tabs)', () => {
    // /forge-audit and /audit both render the single-purpose AuditPage
    for (const p of ['/forge-audit', '/audit', '/auditor']) {
      expect(['forge_audit', 'audit']).toContain(getPageFromPath(p).page);
    }
  });

  it('redaeye resolves to redaeye; sandbox is kept private as the same component', () => {
    expect(getPageFromPath('/redaeye').page).toBe('redaeye');
    // /redaeye-sandbox is a private dev alias that renders the same sandbox
    expect(getPageFromPath('/redaeye-sandbox').page).toBe('redaeye_sandbox');
    expect(PAGE_ROUTES.redaeye).toBe('/redaeye');
  });

  it('fullkonk resolves to /fullkonk', () => {
    expect(getPageFromPath('/fullkonk').page).toBe('fullkonk');
    expect(PAGE_ROUTES.fullkonk).toBe('/fullkonk');
  });
});

describe('route map — purged routes never render fake pages', () => {
  const PURGED_PATHS = [
    '/wallet', '/enclave', '/usage', '/library', '/seller-dashboard', '/buyer-dashboard',
    '/checkout', '/wizard', '/affiliate', '/admin', '/dispute', '/metrics', '/usage-metrics',
    '/playgrounds', '/intel-report', '/listing', '/listing/L1',
  ];

  it.each(PURGED_PATHS)('purged route %s resolves to 404', (p) => {
    const match = getPageFromPath(p);
    expect(match.page).toBe('not_found');
  });

  it('marketplace/ktools/pricing redirect to the product catalogue (replacement routes)', () => {
    for (const p of ['/marketplace', '/ktools', '/pricing', '/catalogue']) {
      const match = getPageFromPath(p);
      expect(match.page).toBe('products');
      expect(match.redirectedFrom).toBe(p);
    }
  });

  it('forge redirects to fullkonk (deprecated forge merged)', () => {
    const match = getPageFromPath('/forge');
    expect(match.page).toBe('fullkonk');
  });

  it('unknown paths resolve to 404', () => {
    expect(getPageFromPath('/definitely-not-a-route').page).toBe('not_found');
    expect(getPageFromPath('/xyzzy').page).toBe('not_found');
  });
});
