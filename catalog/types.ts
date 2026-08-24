/**
 * KONKRED product catalogue types.
 * These mirror catalog/product-manifest.json (canonical copy: agent/PRODUCT_MANIFEST.json).
 */

export type ProductStatus = 'PUBLIC_DEMO' | 'STANDARD_KIT' | 'SUPERVISED_PILOT' | 'ENTERPRISE_INTEGRATION';

export type ProductRisk = 'low' | 'medium' | 'high';

export interface ProductFixtureRef {
  path: string;
  label: string;
  source: string;
}

export interface ProductDemoStatus {
  available: boolean;
  fixturePath: string | null;
  note: string;
}

export interface ProductValidationReport {
  status: 'pending' | 'available';
  path: string | null;
  note: string;
}

export interface ProductPricing {
  kitUsd: number | null;
  validationSprintUsd: number | null;
  enterprisePilot: 'contact' | null;
  currency: string;
  proposed: boolean;
}

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: ProductStatus;
  risk: ProductRisk;
  humanApprovalRequired: boolean;
  shortDescription: string;
  description: string;
  buyer: string;
  prompt: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  fixture: ProductFixtureRef | null;
  demoStatus: ProductDemoStatus;
  validationReport: ProductValidationReport;
  pricing: ProductPricing;
  limitations: string[];
}

export interface ProductManifest {
  manifest: {
    name: string;
    version: string;
    generatedAt: string;
    purpose: string;
    statusLegend: Record<ProductStatus, string>;
    integrityNote: string;
    statuses: ProductStatus[];
  };
  products: ProductRecord[];
}
