import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCT_MANIFEST, PRODUCTS } from '../catalog/products.ts';
import { validateManifest } from '../catalog/validate.ts';

const AGENT_MANIFEST = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'agent/PRODUCT_MANIFEST.json'), 'utf8')
);
const CATALOG_MANIFEST = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'catalog/product-manifest.json'), 'utf8')
);

describe('product manifest', () => {
  it('agent/PRODUCT_MANIFEST.json and catalog/product-manifest.json are byte-identical', () => {
    expect(CATALOG_MANIFEST).toEqual(AGENT_MANIFEST);
  });

  it('contains exactly 15 products', () => {
    expect(PRODUCTS).toHaveLength(15);
    expect(PRODUCT_MANIFEST.products).toHaveLength(15);
  });

  it('has unique slugs and ids', () => {
    const slugs = PRODUCTS.map(p => p.slug);
    const ids = PRODUCTS.map(p => p.id);
    expect(new Set(slugs).size).toBe(15);
    expect(new Set(ids).size).toBe(15);
  });

  it('passes full manifest validation with zero issues', () => {
    const issues = validateManifest(PRODUCT_MANIFEST);
    expect(issues).toEqual([]);
  });

  it('all 15 canonical products are present', () => {
    const names = PRODUCTS.map(p => p.name).sort();
    expect(names).toEqual([
      'A/B Experiment Interpretation Assistant',
      'Cash/Bank/PSP Reconciliation Copilot',
      'Commercial Lease Abstraction',
      'Contract Review Copilot',
      'Customer Health and Churn Copilot',
      'Enterprise RFP Response Copilot',
      'Evidence-Backed PRD Generator',
      'Executive Flash Brief',
      'FP&A Monthly Variance Analysis',
      'GRC Evidence Request Triage',
      'GovCon RFP Compliance Workbench',
      'IaC Security Copilot',
      'Incident Learning and Post-Mortem',
      'M&A Due-Diligence Workbench',
      'SEO Content Opportunity Planner',
    ]);
  });

  it('every product has a valid status from the allowed enum', () => {
    for (const product of PRODUCTS) {
      expect(PRODUCT_MANIFEST.manifest.statuses).toContain(product.status);
    }
  });

  it('high-risk products require human approval; low-risk products do not', () => {
    for (const product of PRODUCTS) {
      if (product.risk === 'high') {
        expect(product.humanApprovalRequired).toBe(true);
      }
      if (product.risk === 'low') {
        expect(product.humanApprovalRequired).toBe(false);
      }
    }
  });

  it('every product has prompt, input schema, output schema, limitations and pricing', () => {
    for (const product of PRODUCTS) {
      expect(product.prompt.length).toBeGreaterThan(40);
      expect(product.inputSchema).toBeTruthy();
      expect(product.outputSchema).toBeTruthy();
      expect(product.limitations.length).toBeGreaterThan(0);
      expect(product.pricing.currency).toBe('USD');
      expect(product.validationReport.status).toBe('pending');
    }
  });

  it('no product contains fabricated social-proof fields', () => {
    const serialized = JSON.stringify(PRODUCTS).toLowerCase();
    for (const banned of ['"rating"', '"reviewcount"', '"salescount"', '"viewcount"', '"auditscore"', '"certified"']) {
      expect(serialized).not.toContain(banned);
    }
  });

  it('available demos reference an existing fixture file', () => {
    for (const product of PRODUCTS) {
      if (product.demoStatus.available) {
        expect(product.demoStatus.fixturePath).toBeTruthy();
        const fixturePath = path.join(process.cwd(), product.demoStatus.fixturePath!);
        expect(fs.existsSync(fixturePath), `${fixturePath} missing`).toBe(true);
      }
    }
  });
});
