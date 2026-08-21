/**
 * Product catalogue loader.
 * Imports the canonical manifest (runtime copy of agent/PRODUCT_MANIFEST.json)
 * and exposes typed lookup helpers.
 */
import manifest from './product-manifest.json';
import type { ProductManifest, ProductRecord } from './types.ts';

const typedManifest = manifest as ProductManifest;

export const PRODUCT_MANIFEST: ProductManifest = typedManifest;

export const PRODUCTS: ProductRecord[] = typedManifest.products;

export const CATEGORIES: string[] = [...new Set(PRODUCTS.map(p => p.category))].sort();

export const STATUSES = typedManifest.manifest.statuses;

export function getProductBySlug(slug: string): ProductRecord | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): ProductRecord[] {
  if (!category || category === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.category === category);
}

export function searchProducts(query: string): ProductRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.shortDescription.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.buyer || '').toLowerCase().includes(q)
  );
}

export function formatPrice(product: ProductRecord): string | null {
  const { kitUsd, currency } = product.pricing;
  if (kitUsd == null) return null;
  return `${currency} ${kitUsd.toLocaleString('en-US')}`;
}
