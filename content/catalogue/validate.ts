/**
 * Build-time validator for the canonical 36-entry portfolio manifest.
 * Fails loudly on any invented, duplicated or orphaned data.
 */
import type { PortfolioEntry, PortfolioManifest, PortfolioStatus, ValidationStatus } from './types.ts';

export const STATUSES: PortfolioStatus[] = [
  'PUBLIC_DEMO',
  'WORKFLOW_KIT',
  'PUBLIC_CATALOGUE_SUPERVISED',
  'INTERNAL_CONTROLLED_PILOT',
  'ENTERPRISE_INTEGRATION',
  'CONDITIONAL_VALIDATION',
];

const VALIDATION_STATUSES: ValidationStatus[] = ['PASS', 'CONDITIONAL', 'NOT_RUN'];

/** Statuses whose products are controlled and therefore require a named human approver. */
export const CONTROLLED_STATUSES: PortfolioStatus[] = [
  'PUBLIC_CATALOGUE_SUPERVISED',
  'INTERNAL_CONTROLLED_PILOT',
  'CONDITIONAL_VALIDATION',
  'ENTERPRISE_INTEGRATION',
];

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

/** `exists` is injected so the pure validator stays usable in browser bundles. */
export function validatePortfolio(
  manifest: PortfolioManifest,
  exists: (relativePath: string) => boolean = () => true,
): ValidationResult {
  const errors: string[] = [];
  const entries = manifest.entries ?? [];

  // ── required counts ──
  const suites = entries.filter((e) => e.type === 'SUITE');
  const workflows = entries.filter((e) => e.type === 'WORKFLOW');
  if (suites.length !== 21) errors.push(`expected 21 SUITE entries, found ${suites.length}`);
  if (workflows.length !== 15) errors.push(`expected 15 WORKFLOW entries, found ${workflows.length}`);

  // ── uniqueness: id, slug, route ──
  for (const key of ['id', 'slug', 'route'] as const) {
    const seen = new Map<string, PortfolioEntry>();
    for (const e of entries) {
      const v = e[key];
      if (!v) { errors.push(`${e.id ?? '(no id)'}: empty ${key}`); continue; }
      if (seen.has(v)) errors.push(`duplicate ${key} "${v}" on ${e.id} and ${seen.get(v)!.id}`);
      seen.set(v, e);
    }
  }

  const byId = new Map(entries.map((e) => [e.id, e]));

  // ── per-entry checks ──
  for (const e of entries) {
    const tag = e.id ?? e.slug ?? '(unknown)';

    if (!STATUSES.includes(e.status)) errors.push(`${tag}: invalid status "${e.status}"`);
    if (!VALIDATION_STATUSES.includes(e.validationStatus)) errors.push(`${tag}: invalid validationStatus "${e.validationStatus}"`);
    if (e.autonomousActions == null || !Array.isArray(e.autonomousActions) || e.autonomousActions.length !== 0) {
      errors.push(`${tag}: autonomousActions must be an empty array`);
    }
    if (typeof e.staticDesignScore !== 'number' || e.staticDesignScore < 0 || e.staticDesignScore > 100) {
      errors.push(`${tag}: staticDesignScore must be a number 0-100`);
    }
    if (!e.experiencePattern || e.experiencePattern.length < 10) errors.push(`${tag}: missing experiencePattern`);
    if (!Array.isArray(e.inputSummary) || e.inputSummary.length === 0) errors.push(`${tag}: empty inputSummary`);
    if (!Array.isArray(e.outputSummary) || e.outputSummary.length === 0) errors.push(`${tag}: empty outputSummary`);
    if (!e.route?.startsWith(e.type === 'SUITE' ? '/suites/' : '/tools/')) errors.push(`${tag}: route "${e.route}" does not match its type`);

    // controlled tiers need a named human approver
    if (CONTROLLED_STATUSES.includes(e.status) && (!e.humanApprover || e.humanApprover.trim().length < 3)) {
      errors.push(`${tag}: status ${e.status} requires a named human approver`);
    }

    // every entry must reference a validation report and a prompt source that exist
    if (!e.validationReport || !exists(e.validationReport)) errors.push(`${tag}: validationReport missing or not found: ${e.validationReport}`);
    if (!e.promptReference || !exists(e.promptReference)) errors.push(`${tag}: promptReference missing or not found: ${e.promptReference}`);

    // validation evidence must be traceable
    if (e.validationStatus === 'PASS' || e.validationStatus === 'CONDITIONAL') {
      if (!e.publicValidation?.testFocus) errors.push(`${tag}: ${e.validationStatus} without testFocus`);
      if (!e.publicValidation?.result) errors.push(`${tag}: ${e.validationStatus} without recorded result`);
      if (!e.publicValidation?.sources?.length) errors.push(`${tag}: ${e.validationStatus} without public source references`);
    }

    if (e.type === 'SUITE') {
      if (e.parentId != null) errors.push(`${tag}: SUITE must have parentId null`);
      if (e.publicDemo) errors.push(`${tag}: SUITE cannot claim a runnable publicDemo (no executable demo wired)`);
      if (!e.humanApprover) errors.push(`${tag}: SUITE requires a human approver`);
      if (!e.modules?.length) errors.push(`${tag}: SUITE without retained modules`);
    } else {
      // WORKFLOW
      const parent = e.parentId ? byId.get(e.parentId) : undefined;
      if (!parent) errors.push(`${tag}: missing parent ${e.parentId}`);
      else if (parent.type !== 'SUITE') errors.push(`${tag}: parent ${parent.id} is not a SUITE`);
      else if (parent.route !== e.parentRoute) errors.push(`${tag}: parentRoute ${e.parentRoute} != parent route ${parent.route}`);
      if (e.publicDemo) {
        if (!e.demo?.available) errors.push(`${tag}: publicDemo true but demo.available false`);
        if (!e.demo?.fixturePath || !exists(e.demo.fixturePath)) errors.push(`${tag}: publicDemo true but fixture missing: ${e.demo?.fixturePath}`);
        if (!e.demo?.prompt) errors.push(`${tag}: publicDemo true but no prompt reference`);
      }
    }
  }

  // every legacy 15 workflow slug must map to exactly one workflow entry (redirect integrity)
  const legacySlugs = workflows.map((w) => w.legacySlug).filter(Boolean) as string[];
  if (new Set(legacySlugs).size !== legacySlugs.length) errors.push('duplicate legacySlug mapping');
  if (legacySlugs.length !== 15) errors.push(`expected 15 legacy slugs, found ${legacySlugs.length}`);

  return { ok: errors.length === 0, errors };
}
