/**
 * Minimal, honest site configuration for KONKRED.
 * Replaces the old data.ts module (which contained mock marketplace listings,
 * fake protocols, fake sellers and fake system-status claims).
 */

export interface SiteFooterData {
  version: string;
  tagline: string;
}

export const SITE = {
  name: 'KONKRED',
  domain: 'konkred.xyz',
  tagline: 'AI workflow marketplace and product platform',
  footer: {
    version: 'v2.6.0',
    tagline: 'AI workflows, audits and product builds for enterprises.',
  } satisfies SiteFooterData,
} as const;
