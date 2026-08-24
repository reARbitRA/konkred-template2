import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { validatePortfolio, CONTROLLED_STATUSES } from '../content/catalogue/validate.ts';
import { PORTFOLIO, ENTRIES, SUITES, WORKFLOWS } from '../content/catalogue/portfolio.ts';
import { PATTERN_SLUGS } from '../components/portfolio/patterns/index.tsx';

const ROOT = process.cwd();
const exists = (p: string) => fs.existsSync(path.join(ROOT, p));

describe('36-entry portfolio manifest', () => {
  it('validates against the build validator with real file existence checks', () => {
    const result = validatePortfolio(PORTFOLIO, exists);
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('contains exactly 21 suites and 15 workflows', () => {
    expect(SUITES).toHaveLength(21);
    expect(WORKFLOWS).toHaveLength(15);
    expect(ENTRIES).toHaveLength(36);
  });

  it('ids, slugs and routes are globally unique', () => {
    for (const key of ['id', 'slug', 'route'] as const) {
      expect(new Set(ENTRIES.map((e) => e[key])).size).toBe(36);
    }
  });

  it('every workflow parent resolves to an existing suite', () => {
    const suiteIds = new Set(SUITES.map((s) => s.id));
    for (const wf of WORKFLOWS) {
      expect(suiteIds.has(wf.parentId as string), `${wf.slug} parent missing`).toBe(true);
      const parent = SUITES.find((s) => s.id === wf.parentId);
      expect(wf.parentRoute).toBe(parent?.route);
    }
  });

  it('autonomousActions is an empty array on every entry', () => {
    for (const e of ENTRIES) {
      expect(Array.isArray(e.autonomousActions)).toBe(true);
      expect(e.autonomousActions).toHaveLength(0);
    }
  });

  it('controlled-tier products name a human approver', () => {
    for (const e of ENTRIES) {
      if (CONTROLLED_STATUSES.includes(e.status)) {
        expect(e.humanApprover, `${e.slug} (${e.status}) needs an approver`).toBeTruthy();
      }
    }
  });

  it('statuses use the six canonical values only', () => {
    const allowed = ['PUBLIC_DEMO', 'WORKFLOW_KIT', 'PUBLIC_CATALOGUE_SUPERVISED', 'INTERNAL_CONTROLLED_PILOT', 'ENTERPRISE_INTEGRATION', 'CONDITIONAL_VALIDATION'];
    for (const e of ENTRIES) expect(allowed).toContain(e.status);
  });

  it('all 21 suites have static design scores from the validation report', () => {
    for (const s of SUITES) {
      expect(typeof s.staticDesignScore).toBe('number');
      expect(s.staticDesignScore).toBeGreaterThanOrEqual(80);
      expect(s.validationStatus).toBe('PASS');
    }
  });

  it('PRD workflow is CONDITIONAL_VALIDATION with CONDITIONAL preflight', () => {
    const prd = WORKFLOWS.find((w) => w.slug === 'evidence-backed-prd');
    expect(prd?.status).toBe('CONDITIONAL_VALIDATION');
    expect(prd?.validationStatus).toBe('CONDITIONAL');
  });

  it('publicDemo is true only for workflows with an existing fixture', () => {
    for (const e of ENTRIES) {
      if (e.publicDemo) {
        expect(e.type).toBe('WORKFLOW');
        expect(e.demo?.available).toBe(true);
        expect(e.demo?.fixturePath && exists(e.demo.fixturePath)).toBe(true);
      }
    }
  });

  it('validation reports and prompt references exist in the repo', () => {
    for (const e of ENTRIES) {
      expect(e.validationReport && exists(e.validationReport), `${e.slug} validationReport`).toBe(true);
      expect(e.promptReference && exists(e.promptReference), `${e.slug} promptReference`).toBe(true);
    }
  });

  it('every PASS/CONDITIONAL entry cites at least one public source', () => {
    for (const e of ENTRIES) {
      if (e.validationStatus !== 'NOT_RUN') {
        expect(e.publicValidation.sources.length, `${e.slug} has no sources`).toBeGreaterThan(0);
        for (const s of e.publicValidation.sources) expect(s).toMatch(/^https?:\/\//);
      }
    }
  });

  it('every entry has a dedicated unique interaction pattern component', () => {
    expect(new Set(PATTERN_SLUGS).size).toBe(36);
    for (const e of ENTRIES) {
      expect(PATTERN_SLUGS, `${e.slug} lacks a pattern`).toContain(e.slug);
    }
  });

  it('extraction source documents remain in the repo (provenance)', () => {
    for (const doc of PORTFOLIO.manifest.sourceDocuments) {
      expect(exists(doc), `${doc} missing`).toBe(true);
    }
  });
});
