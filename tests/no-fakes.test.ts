import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCTS } from '../catalog/products.ts';

/**
 * Stage 1 purge verification: no fake marketplace/demo modules may remain in
 * the source tree, and no banned claims may appear in the catalogue.
 */
const ROOT = process.cwd();

const MUST_NOT_EXIST = [
  'data.ts',
  'services/payments.ts',
  'services/gemini.ts',
  'lib/enterpriseTools.ts',
  'pages/MarketplacePage.tsx',
  'pages/ListingPage.tsx',
  'pages/ListingWizard.tsx',
  'pages/WalletPage.tsx',
  'pages/SellerDashboard.tsx',
  'pages/BuyerDashboard.tsx',
  'pages/UsageDashboard.tsx',
  'pages/AffiliatePage.tsx',
  'pages/DisputePage.tsx',
  'pages/AdminPage.tsx',
  'pages/KToolsPage.tsx',
  'pages/ForgePage.tsx',
  'pages/CheckoutPage.tsx',
  'pages/PricingPage.tsx',
  'pages/PlaygroundsPage.tsx',
  'pages/IntelReportPage.tsx',
  'components/marketplace',
  'components/seller',
  'components/buyer',
  'components/enclave',
  'components/forge',
  'components/modals',
  'components/landing',
  'components/ProtocolCard.tsx',
  'components/ProtocolDetails.tsx',
  'components/Protocols.tsx',
  'components/Tools.tsx',
  'components/ToolCard.tsx',
  'components/ValuationTerminal.tsx',
  'components/AcquirersList.tsx',
  'components/DemoView.tsx',
  'components/common/AppTester.tsx',
  'hooks/useGlobalStats.ts',
];

describe('no fake marketplace data in source', () => {
  it.each(MUST_NOT_EXIST)('purged path %s does not exist', (p) => {
    expect(fs.existsSync(path.join(ROOT, p)), `${p} still exists`).toBe(false);
  });

  it('source tree contains no MOCK_LISTINGS usage', () => {
    const src = collectSource();
    // Match usage (assignment/import/export/reference), not prose comments.
    expect(src).not.toMatch(/MOCK_LISTINGS\s*[=:[]/);
    expect(src).not.toMatch(/import[^;]*MOCK_LISTINGS/);
    expect(src).not.toMatch(/MOCK_PROTOCOLS/);
  });

  it('catalogue records contain no fake sellers, ratings or scores', () => {
    for (const product of PRODUCTS) {
      expect(JSON.stringify(product)).not.toMatch(/"seller"/i);
      expect(JSON.stringify(product)).not.toMatch(/"rating"/i);
      expect(JSON.stringify(product)).not.toMatch(/"salesCount"/i);
      expect(JSON.stringify(product)).not.toMatch(/"auditScore"/i);
    }
  });

  it('new platform source contains no unsupported claims', () => {
    const files = [
      'pages/CataloguePage.tsx',
      'pages/ProductDetailPage.tsx',
      'components/catalog/ProductCard.tsx',
      'components/catalog/MicroTool.tsx',
      'components/catalog/ProductInquiryModal.tsx',
      'pages/NotFoundPage.tsx',
    ];
    for (const file of files) {
      const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
      expect(content, `${file} contains unsupported claim`).not.toMatch(/bug-free|deploy-ready|autonomous production|100% accurate|zero-hallucination/i);
    }
  });
});

function collectSource(): string {
  const dirs = ['App.tsx', 'pages', 'components', 'services', 'catalog', 'utils', 'contexts', 'hooks'];
  let out = '';
  for (const entry of dirs) {
    const p = path.join(ROOT, entry);
    if (fs.statSync(p).isDirectory()) {
      walk(p, outFile => { out += fs.readFileSync(outFile, 'utf8'); });
    } else {
      out += fs.readFileSync(p, 'utf8');
    }
  }
  return out;
}

function walk(dir: string, cb: (file: string) => void): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (/\.(ts|tsx)$/.test(entry.name)) cb(full);
  }
}
