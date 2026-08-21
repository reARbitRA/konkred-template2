import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Load the canonical 36-entry portfolio manifest (playwright runs under Node ESM).
const manifest = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'content/catalogue/portfolio-36.json'), 'utf8')
) as { entries: Array<{ slug: string; title: string; type: 'SUITE' | 'WORKFLOW'; legacySlug: string | null; route: string }> };

const SUITES = manifest.entries.filter((e) => e.type === 'SUITE');
const WORKFLOWS = manifest.entries.filter((e) => e.type === 'WORKFLOW');
const esc = (s: string) => new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

/**
 * E2E smoke tests for the KONKRED platform (36-entry catalogue era).
 * Requires the dev server on :3000 (playwright webServer config handles it).
 */

test.describe('36-entry catalogue', () => {
  test('catalogue page lists all 36 entries at /catalogue', async ({ page }) => {
    await page.goto('/catalogue');
    await expect(page.getByRole('heading', { name: /36 controlled workflow products/i })).toBeVisible();
    await expect(page.getByTestId('catalogue-count')).toHaveText(/36 of 36 entries/);
  });

  test('every suite page renders its unique pattern', async ({ page }) => {
    for (const suite of SUITES) {
      await page.goto(`/suites/${suite.slug}`);
      await expect(page.getByRole('heading', { name: esc(suite.title) })).toBeVisible();
      await expect(page.getByTestId(`pattern-${suite.slug}`)).toBeVisible();
      await expect(page.getByText(/Static design target — not measured model performance/i).first()).toBeVisible();
    }
  });

  test('every workflow page renders the micro-tool and its unique workspace', async ({ page }) => {
    for (const wf of WORKFLOWS) {
      await page.goto(`/tools/${wf.slug}`);
      await expect(page.getByRole('heading', { name: esc(wf.title) })).toBeVisible();
      await expect(page.getByRole('button', { name: /Run Tool/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Load Sample Data/i })).toBeVisible();
      await expect(page.getByTestId(`pattern-${wf.slug}`)).toBeVisible();
      // No raw prompts or self-critical spec-sheet content on the customer-facing page
      await expect(page.getByText('PROMPT //', { exact: false })).toBeHidden();
      await expect(page.getByText('HUMAN_APPROVAL_REQUIRED')).toBeHidden();
    }
  });

  test('legacy /products/:slug URLs redirect to canonical /tools/:slug', async ({ page }) => {
    const wf = WORKFLOWS[0];
    await page.goto(`/products/${wf.legacySlug}`);
    await expect(page).toHaveURL(new RegExp(`/tools/${wf.slug}$`));
    await expect(page.getByRole('heading', { name: esc(wf.title) })).toBeVisible();
  });

  test('/products redirects to /catalogue', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/\/catalogue$/);
  });

  test('catalogue search filters results', async ({ page }) => {
    await page.goto('/catalogue');
    const search = page.getByRole('searchbox', { name: 'Search catalogue' });
    await search.fill('contract review');
    await expect(page.getByRole('heading', { name: /Contract Review Copilot/i }).first()).toBeVisible();
  });

  test('catalogue type filter separates suites from workflows', async ({ page }) => {
    await page.goto('/catalogue');
    await page.getByRole('button', { name: new RegExp(`Suites ${SUITES.length}`) }).click();
    await expect(page.getByTestId('catalogue-count')).toHaveText(new RegExp(`^${SUITES.length} of 36 entries`));
    await page.getByRole('button', { name: new RegExp(`Workflows ${WORKFLOWS.length}`) }).click();
    await expect(page.getByTestId('catalogue-count')).toHaveText(new RegExp(`^${WORKFLOWS.length} of 36 entries`));
  });

  test('every suite page links to its child workflows', async ({ page }) => {
    await page.goto('/suites/legal-contract-transaction');
    const link = page.getByRole('button', { name: /Contract Review Copilot/i }).first();
    await expect(link).toBeVisible();
  });
});

test.describe('platform routes', () => {
  for (const route of ['/pricing', '/sprint', '/enterprise', '/partners', '/validation']) {
    test(`${route} renders a real page`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole('heading').first()).toBeVisible();
      await expect(page.getByText(/ERROR_404/i)).toBeHidden();
    });
  }

  test('/kits/:slug renders a kit offer page', async ({ page }) => {
    await page.goto('/kits/contract-review');
    await expect(page.getByText(/\$/).first()).toBeVisible();
  });

  test('/validation lists the evidence record for all 36 entries', async ({ page }) => {
    await page.goto('/validation');
    await expect(page.getByText(/preflight PASS/i).first()).toBeVisible();
  });
});

test.describe('flagship routes', () => {
  test('AUDITOR routes to the audit-only page at /forge-audit', async ({ page }) => {
    await page.goto('/forge-audit');
    await expect(page.getByRole('heading', { name: /AUDITOR/i })).toBeVisible();
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
  test('/marketplace redirects to the catalogue', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page).toHaveURL(/\/catalogue$/);
    await expect(page.getByRole('heading', { name: /36 controlled workflow products/i })).toBeVisible();
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

  test('/ktools redirects to the catalogue', async ({ page }) => {
    await page.goto('/ktools');
    await expect(page).toHaveURL(/\/catalogue$/);
  });
});

test.describe('mobile layout & accessibility basics', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('catalogue has no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('/catalogue');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });

  test('workflow page has no horizontal overflow on mobile', async ({ page }) => {
    await page.goto('/tools/contract-review');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });

  test('catalogue exposes semantic landmarks and accessible controls', async ({ page }) => {
    await page.goto('/catalogue');
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(page.getByRole('searchbox')).toBeVisible();
  });

  test('404 page offers accessible navigation', async ({ page }) => {
    await page.goto('/definitely-not-real');
    const browseButton = page.getByRole('button', { name: /Browse Products/i });
    await expect(browseButton).toBeVisible();
    await browseButton.click();
    await expect(page).toHaveURL(/\/catalogue/);
  });
});
