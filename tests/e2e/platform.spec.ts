import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Load the canonical manifest directly (playwright runs under Node ESM).
const manifest = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'catalog/product-manifest.json'), 'utf8')
) as { products: Array<{ slug: string; name: string }> };

const PRODUCTS = manifest.products;

/**
 * E2E smoke tests for the KONKRED platform (post-purge).
 * Requires the dev server on :3000 (playwright webServer config handles it).
 */

test.describe('15 product catalogue', () => {
  test('catalogue page lists all 15 products', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('heading', { name: /Workflow Products/i })).toBeVisible();
    for (const product of PRODUCTS) {
      await expect(page.getByRole('heading', { name: new RegExp(product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })).toBeVisible();
    }
  });

  for (const product of PRODUCTS) {
    test(`product detail page renders for ${product.slug}`, async ({ page }) => {
      await page.goto(`/products/${product.slug}`);
      await expect(page.getByRole('heading', { name: new RegExp(product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })).toBeVisible();
      // Limitations section is always present
      await expect(page.getByText('Limitations', { exact: true })).toBeVisible();
    });
  }

  test('catalogue search filters results', async ({ page }) => {
    await page.goto('/products');
    const search = page.getByRole('searchbox', { name: 'Search products' });
    await search.fill('contract review');
    await expect(page.getByRole('heading', { name: /Contract Review Copilot/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Reconciliation Copilot/i })).toBeHidden();
  });

  test('catalogue status filter works', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('combobox', { name: 'Filter by status' }).selectOption('PUBLIC_DEMO');
    // All visible cards should carry a Public Demo badge
    await expect(page.getByText('Public Demo', { exact: false }).first()).toBeVisible();
  });

  test('catalogue category filter works', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('combobox', { name: 'Filter by category' }).selectOption('Finance & Accounting');
    await expect(page.getByRole('heading', { name: /Reconciliation Copilot/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Contract Review Copilot/i })).toBeHidden();
  });
});

test.describe('flagship routes', () => {
  test('AUDITOR routes to the audit-only page at /forge-audit', async ({ page }) => {
    await page.goto('/forge-audit');
    await expect(page.getByRole('heading', { name: /AUDITOR/i })).toBeVisible();
    // Audit-only: no forge tool tabs
    await expect(page.getByText('Prompt Refiner')).toBeHidden();
  });

  test('/audit alias renders the audit page', async ({ page }) => {
    await page.goto('/audit');
    await expect(page.getByRole('heading', { name: /AUDITOR/i })).toBeVisible();
  });

  test('REDAEYE renders at /redaeye', async ({ page }) => {
    await page.goto('/redaeye');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('fullKONK_> renders at /fullkonk', async ({ page }) => {
    await page.goto('/fullkonk');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('landing fullKONK card routes to /fullkonk', async ({ page }) => {
    await page.goto('/');
    const card = page.getByRole('button', { name: /Open fullKONK/i });
    await card.click();
    await expect(page).toHaveURL(/\/fullkonk/);
  });

  test('landing AUDITOR card routes to the audit page', async ({ page }) => {
    await page.goto('/');
    const card = page.getByRole('button', { name: /Open AUDITOR/i });
    await card.click();
    await expect(page).toHaveURL(/\/forge-audit/);
  });
});

test.describe('purged routes', () => {
  test('/marketplace redirects to the product catalogue', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByRole('heading', { name: /Workflow Products/i })).toBeVisible();
  });

  test('/forge redirects to /fullkonk', async ({ page }) => {
    await page.goto('/forge');
    await expect(page).toHaveURL(/\/fullkonk/);
  });

  test('/wallet returns the 404 page, not a fake wallet', async ({ page }) => {
    await page.goto('/wallet');
    await expect(page.getByText('ERROR_404', { exact: false })).toBeVisible();
    await expect(page.getByText('Node Not Found', { exact: true })).toBeVisible();
  });

  test('/ktools redirects to the product catalogue', async ({ page }) => {
    await page.goto('/ktools');
    await expect(page).toHaveURL(/\/products/);
  });
});

test.describe('mobile layout & accessibility basics', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('catalogue has no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('/products');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });

  test('product detail page has no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('/products/contract-review-copilot');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });

  test('catalogue exposes semantic landmarks and accessible controls', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(page.getByRole('searchbox')).toBeVisible();
    // every product card has an accessible "Details" button
    const detailButtons = page.getByRole('button', { name: /Details/i });
    expect(await detailButtons.count()).toBeGreaterThanOrEqual(15);
  });

  test('404 page offers accessible navigation', async ({ page }) => {
    await page.goto('/definitely-not-real');
    const browseButton = page.getByRole('button', { name: /Browse Products/i });
    await expect(browseButton).toBeVisible();
    await browseButton.click();
    await expect(page).toHaveURL(/\/products/);
  });
});
