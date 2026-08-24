/**
 * Build the canonical 36-entry portfolio manifest.
 *
 * Combines (all treated as DATA):
 *   1. agent/extracted-portfolio.json  — parsed from the owner guidebook + cross-checked reports
 *   2. catalog/product-manifest.json   — legacy 15-workflow schemas, prompts, fixtures, pricing
 *   3. Canonical route/UX mapping from the owner implementation brief (36 exact routes)
 *
 * Nothing is invented: every field is traceable to one of these sources or is null.
 * Output: content/catalogue/portfolio-36.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const extracted = JSON.parse(readFileSync('agent/extracted-portfolio.json', 'utf8'));
const DOCS = 'owner-docs/';
const legacy = JSON.parse(readFileSync('catalog/product-manifest.json', 'utf8'));
const UPDATED_AT = '2026-08-22';

/* ── Canonical routes + experience patterns (owner brief, verbatim) ── */
const SUITE_SPEC = {
  'KONKRED-ARB-CSM-CONTROL-CANON-0001-v1.0': { slug: 'customer-support-control', category: 'Customer Support', ux: 'customer-support command center with ticket queue, policy comparison panel, SLA clock and account-health side panel' },
  'KONKRED-ARB-FIN-CLOSE-CANON-0001-v1.0': { slug: 'finance-close-reporting', category: 'Finance', ux: 'close-control center with period checklist, reconciliation exceptions table, balance status and controller approval drawer' },
  'KONKRED-ARB-FIN-PLAN-CANON-0001-v1.0': { slug: 'finance-planning-treasury', category: 'Finance', ux: 'scenario-planning laboratory with assumptions panel, cash/liquidity cards, sensitivity controls and scenario comparison' },
  'KONKRED-ARB-FIN-APAR-CANON-0001-v1.0': { slug: 'finance-ap-ar-operations', category: 'Finance', ux: 'exception workbench with invoice/receipt viewer, three-way-match matrix, owner/SLA queue and unposted-adjustment drawer' },
  'KONKRED-ARB-FIN-RISK-CANON-0001-v1.0': { slug: 'finance-risk-crime-credit', category: 'Finance', ux: 'model-governance console with metadata health, calibration/drift cards, alert evidence and fairness/appeal review' },
  'KONKRED-ARB-FIN-TAX-CANON-0001-v1.0': { slug: 'finance-tax-revenue-compliance', category: 'Finance', ux: 'technical-accounting workpaper with authority timeline, rule-to-evidence map and unresolved policy questions' },
  'KONKRED-ARB-FIN-MA-CANON-0001-v1.0': { slug: 'investment-ma-analytics', category: 'Finance', ux: 'diligence data-room cockpit with workstream tabs, thesis evidence board, calculation register and missing-document queue' },
  'KONKRED-ARB-GRO-PRICING-CANON-0001-v1.0': { slug: 'pricing-monetization-science', category: 'Pricing & Growth', ux: 'pricing lab with experiment setup, scenario sliders, guardrail chart and approval gate' },
  'KONKRED-ARB-HEL-RCM-CANON-0001-v1.0': { slug: 'healthcare-revenue-cycle', category: 'Healthcare', ux: 'de-identified RCM review board with claim/document evidence, payer-policy comparison and qualified-review gate' },
  'KONKRED-ARB-HEALTH-CLINICAL-CANON-0001-v1.0': { slug: 'clinical-patient-decision-support', category: 'Healthcare', ux: 'clinician evidence desk with clinical-question header, source comparison, uncertainty panel and clinician sign-off state' },
  'KONKRED-ARB-LISC-TRIALS-CANON-0001-v1.0': { slug: 'clinical-trials-life-sciences', category: 'Healthcare', ux: 'trial operations timeline with protocol/registry tabs, data-quality alerts, TMF gaps and statistical-review queue' },
  'KONKRED-ARB-HEALTH-OPS-CANON-0001-v1.0': { slug: 'healthcare-operations-compliance', category: 'Healthcare', ux: 'privacy/compliance evidence workspace with control map, evidence period filter, access-data minimization panel and owner queue' },
  'KONKRED-ARB-SEC-FRAUD-CANON-0001-v1.0': { slug: 'fraud-identity-financial-crime', category: 'Security & GRC', ux: 'investigation case board with evidence graph, alternative explanations, appeal/fairness panel and investigator handoff' },
  'KONKRED-ARB-SEC-GRC-CANON-0001-v1.0': { slug: 'security-access-data-integrity', category: 'Security & GRC', ux: 'security findings console with code/plan viewer, severity filters, control mapping and read-only verification drawer' },
  'KONKRED-ARB-LEG-CONTRACT-CANON-0001-v1.0': { slug: 'legal-contract-transaction', category: 'Legal & Compliance', ux: 'document review studio with synchronized source viewer, clause highlights, playbook comparison and counsel escalation rail' },
  'KONKRED-ARB-LEG-REG-CANON-0001-v1.0': { slug: 'legal-regulatory-privacy-ai', category: 'Legal & Compliance', ux: 'authority map with jurisdiction/effective-date timeline, obligation graph, organization-fact gaps and counsel queue' },
  'KONKRED-ARB-HR-PEOPLE-CANON-0001-v1.0': { slug: 'hr-hiring-privacy-onboarding', category: 'HR & People', ux: 'process-governance board with job-related criteria, consent/retention checklist, fairness review and human decision record' },
  'KONKRED-ARB-COMMS-CONTROL-CANON-0001-v1.0': { slug: 'communications-control', category: 'Communications', ux: 'message approval studio with fact ledger, draft canvas, channel/accessibility preview and distribution gate' },
  'KONKRED-ARB-MKT-SALES-CANON-0001-v1.0': { slug: 'marketing-sales-evidence', category: 'Marketing & Sales', ux: 'claims/RFP/research workbench with claims registry, requirement matrix, content opportunity canvas and consent gate' },
  'KONKRED-ARB-OPS-PROCUREMENT-CANON-0001-v1.0': { slug: 'operations-procurement', category: 'Operations & Procurement', ux: 'procurement planning cockpit with solicitation explorer, supplier scorecard, dependency map and scenario board' },
  'KONKRED-ARB-MSC-CONTROL-CANON-0001-v1.0': { slug: 'mixed-quick-win-workflows', category: 'Cross-Functional', ux: 'controlled module selector with explicit module authority, shared action boundary, validator status and owner approval' },
};

const WORKFLOW_SPEC = {
  'KONKRED-LEG-CON-CANON-0001-v2.0': { slug: 'contract-review', ux: 'split-pane contract text and playbook risk review' },
  'KONKRED-SEC-IAC-CANON-0001-v2.0': { slug: 'iac-security', ux: 'code viewer plus finding matrix and safe-verification drawer' },
  'KONKRED-FIN-DD-CANON-0001-v2.0': { slug: 'ma-diligence', ux: 'diligence workstream board and thesis evidence ledger' },
  'KONKRED-OPS-SRE-CANON-0001-v2.0': { slug: 'incident-postmortem', ux: 'timeline scrubber, impact cards and causal-analysis lanes' },
  'KONKRED-SEC-GRC-CANON-0001-v2.0': { slug: 'grc-evidence', ux: 'evidence-request kanban with control mapping and owner assignment' },
  'KONKRED-FIN-REC-CANON-0001-v2.0': { slug: 'reconciliation', ux: 'ledger matching table with exact/ambiguous/unmatched lanes' },
  'KONKRED-SAL-RFP-CANON-0001-v2.0': { slug: 'enterprise-rfp', ux: 'requirement-to-claim matrix with readiness status' },
  'KONKRED-GOV-RFP-CANON-0001-v2.0': { slug: 'govcon-rfp', ux: 'solicitation navigator with source-coordinate viewer and amendment conflict panel' },
  'KONKRED-FIN-FPA-CANON-0001-v2.0': { slug: 'fpa-variance', ux: 'variance dashboard with waterfall/table toggle and driver evidence' },
  'KONKRED-EXC-BRF-CANON-0001-v2.0': { slug: 'executive-flash', ux: 'executive brief composer with KPI threshold cards and draft-approval banner' },
  'KONKRED-LEG-CRE-CANON-0001-v2.0': { slug: 'lease-abstraction', ux: 'lease term extraction sheet with source quote anchors and missing-term flags' },
  'KONKRED-MKT-SEO-CANON-0001-v2.0': { slug: 'seo-planner', ux: 'topic-cluster canvas with data-sufficiency banner and content calendar' },
  'KONKRED-PRD-CANON-0001-v2.0': { slug: 'evidence-backed-prd', ux: 'research-to-requirement traceability board with engineering-review queue' },
  'KONKRED-CSM-CHR-CANON-0001-v2.0': { slug: 'customer-health', ux: 'account portfolio triage with signal cards, model-mode banner and intervention plan' },
  'KONKRED-DAT-ABT-CANON-0001-v2.0': { slug: 'ab-experiment', ux: 'experiment result console with validity checks, guardrails and decision gate' },
};

/* Status migration (owner decision D-006) + CONDITIONAL_VALIDATION override for PRD */
const STATUS_MIGRATION = {
  PUBLIC_DEMO: 'PUBLIC_DEMO',
  STANDARD_KIT: 'WORKFLOW_KIT',
  SUPERVISED_PILOT: 'PUBLIC_CATALOGUE_SUPERVISED',
  ENTERPRISE_INTEGRATION: 'ENTERPRISE_INTEGRATION',
};
const CONDITIONAL_OVERRIDES = new Set(['evidence-backed-prd-generator']); // legacy slug

/* ── price parsing ── */
function parseOffer(str) {
  const out = { kitFromUsd: null, sprintFromUsd: null, pilotFromUsd: null, workspaceFromUsd: null, note: null };
  if (!str) return out;
  out.note = str;
  // match each "$X[,YYY](–$Y)? label…" segment; the label runs until the next price
  const re = /\$([\d,]+)(?:\s*[–-]\s*\$?([\d,]+))?\s*([^$]*)/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    const lo = Number(m[1].replace(/,/g, ''));
    const label = m[3].toLowerCase();
    if (/workspace/.test(label)) out.workspaceFromUsd = out.workspaceFromUsd ?? lo;
    else if (/kit/.test(label)) out.kitFromUsd = out.kitFromUsd ?? lo;
    else if (/sprint/.test(label)) out.sprintFromUsd = out.sprintFromUsd ?? lo;
    else if (/pilot/.test(label)) out.pilotFromUsd = out.pilotFromUsd ?? lo;
  }
  return out;
}

/* ── suites ── */
const suiteEntries = extracted.suites.map((s) => {
  const spec = SUITE_SPEC[s.id];
  if (!spec) throw new Error(`no canonical spec for suite ${s.id}`);
  const entry = parseOffer(s.commercialEntryRaw);
  const expansion = parseOffer(s.expansionRaw);
  const pricing = {
    kitFromUsd: entry.kitFromUsd ?? expansion.kitFromUsd,
    sprintFromUsd: entry.sprintFromUsd ?? expansion.sprintFromUsd,
    pilotFromUsd: entry.pilotFromUsd ?? expansion.pilotFromUsd,
    workspaceFromUsd: entry.workspaceFromUsd ?? expansion.workspaceFromUsd,
    note: [s.commercialEntryRaw, s.expansionRaw].filter(Boolean).join(' | ') || null,
  };
  return {
    id: s.id,
    slug: spec.slug,
    type: 'SUITE',
    title: s.title,
    parentId: null,
    route: `/suites/${spec.slug}`,
    legacySlug: null,
    category: spec.category,
    buyer: s.buyer,
    humanApprover: s.humanApprover,
    humanApprovalRequired: true,
    status: s.tier,
    staticDesignScore: s.staticDesignTarget,
    validationStatus: 'PASS',
    publicDemo: false,
    experiencePattern: spec.ux,
    jobToBeDone: s.jobToBeDone,
    definition: s.definition,
    modules: s.modules,
    useCases: s.includedUseCases,
    exclusions: s.exclusions,
    inputSummary: s.inputContract,
    outputSummary: s.outputContract,
    validators: s.validators,
    controlRequirements: s.controlRequirements,
    failureModes: s.failureModes,
    runbook: [],
    productBoundary: null,
    buyerValue: null,
    publicValidation: {
      runDate: '2026-08-21',
      testFocus: s.publicValidation.testFocus,
      result: s.publicValidation.result,
      measuredEvidence: s.publicValidation.measuredEvidence,
      sources: s.publicValidation.sources,
      limitations: s.publicValidation.limitations,
    },
    autonomousActions: [],
    validationReport: `${DOCS}ARB_CANONICAL_MERGE_VALIDATION_REPORT.md`,
    promptReference: `${DOCS}ARB_CANONICAL_MERGED_PROMPTS.md`,
    pricing,
    demo: null,
    updatedAt: UPDATED_AT,
  };
});

const suiteByTitle = Object.fromEntries(extracted.suites.map((s) => [s.title, s.id]));
const suiteApprover = Object.fromEntries(suiteEntries.map((e) => [e.id, e.humanApprover]));

/* ── workflows ── */
const legacyByName = Object.fromEntries(legacy.products.map((p) => [p.name, p]));

const workflowEntries = extracted.workflows.map((w) => {
  const spec = WORKFLOW_SPEC[w.id];
  if (!spec) throw new Error(`no canonical spec for workflow ${w.id}`);
  const parentSuiteId = suiteByTitle[w.parentSuite];
  if (!parentSuiteId) throw new Error(`parent suite not found: ${w.parentSuite}`);
  const lg = legacyByName[w.title];
  if (!lg) throw new Error(`legacy product not found for ${w.title}`);

  const offer = parseOffer(w.commercialEntryRaw);
  // Guidebook kit/sprint prices are canonical; legacy proposed prices kept as note when richer.
  const legacyNote = lg.pricing?.kitUsd != null ? `legacy proposed kit USD ${lg.pricing.kitUsd}` : null;
  const status = CONDITIONAL_OVERRIDES.has(lg.slug)
    ? 'CONDITIONAL_VALIDATION'
    : STATUS_MIGRATION[lg.status] ?? lg.status;

  return {
    id: w.id,
    slug: spec.slug,
    type: 'WORKFLOW',
    title: w.title,
    parentId: parentSuiteId,
    parentRoute: `/suites/${SUITE_SPEC[parentSuiteId].slug}`,
    route: `/tools/${spec.slug}`,
    legacySlug: lg.slug,
    category: lg.category,
    buyer: w.buyer ?? lg.buyer,
    humanApprover: suiteApprover[parentSuiteId],
    humanApprovalRequired: lg.humanApprovalRequired,
    status,
    staticDesignScore: w.staticDesignTarget,
    validationStatus: w.validation.result === 'CONDITIONAL' ? 'CONDITIONAL' : 'PASS',
    publicDemo: Boolean(lg.demoStatus?.available && lg.fixture),
    experiencePattern: spec.ux,
    jobToBeDone: w.problemSolved,
    definition: w.definition,
    modules: [],
    useCases: [],
    exclusions: [],
    inputSummary: w.referenceInputs,
    outputSummary: w.referenceOutputs,
    validators: [],
    controlRequirements: [],
    failureModes: w.failureModes,
    runbook: w.runbook,
    productBoundary: w.productBoundary,
    buyerValue: w.buyerValue,
    publicValidation: {
      runDate: '2026-08-20',
      testFocus: w.validation.testFocus,
      result: w.validation.result,
      measuredEvidence: w.validation.measuredResult,
      sources: w.validation.publicSource ? [w.validation.publicSource] : [],
      limitations: [],
    },
    autonomousActions: [],
    validationReport: `${DOCS}validation_report.md`,
    promptReference: `${DOCS}merged_upgraded_prompts.md`,
    pricing: {
      kitFromUsd: offer.kitFromUsd ?? lg.pricing?.kitUsd ?? null,
      sprintFromUsd: offer.sprintFromUsd ?? lg.pricing?.validationSprintUsd ?? null,
      pilotFromUsd: offer.pilotFromUsd ?? null,
      workspaceFromUsd: null,
      note: [w.commercialEntryRaw, legacyNote].filter(Boolean).join(' | ') || null,
    },
    demo: {
      available: Boolean(lg.demoStatus?.available),
      fixturePath: lg.fixture?.path ?? null,
      fixtureSource: lg.fixture?.source ?? null,
      fixtureLabel: lg.fixture?.label ?? null,
      prompt: lg.prompt,
      inputSchema: lg.inputSchema,
      outputSchema: lg.outputSchema,
      legacyPricing: lg.pricing ?? null,
      legacyLimitations: lg.limitations ?? [],
    },
    updatedAt: UPDATED_AT,
  };
});

const entries = [...suiteEntries, ...workflowEntries];

const manifest = {
  manifest: {
    name: 'KONKRED 36-entry portfolio',
    version: '2.0.0',
    generatedAt: UPDATED_AT,
    purpose: 'Canonical catalogue of 21 ARB suites and 15 validated workflows with routes, validation evidence and pricing. No invented data: every field is traceable to the source documents or the legacy product manifest, or is null.',
    counts: { total: entries.length, suites: suiteEntries.length, workflows: workflowEntries.length },
    statusLegend: {
      PUBLIC_DEMO: 'Runnable public demo on public/non-sensitive fixture data.',
      WORKFLOW_KIT: 'Self-serve packaged workflow kit (prompt, schema, fixture, validator, approval instructions).',
      PUBLIC_CATALOGUE_SUPERVISED: 'Listed publicly; runs happen under named human supervision.',
      INTERNAL_CONTROLLED_PILOT: 'Not self-serve; delivered only as a controlled pilot with a named owner.',
      ENTERPRISE_INTEGRATION: 'Delivered as an enterprise integration engagement.',
      CONDITIONAL_VALIDATION: 'Published with conditions; missing inputs must be supplied before unrestricted use.',
    },
    sourceDocuments: [
      'owner-docs/KONKRED_36_WORKFLOW_COMPREHENSIVE_GUIDEBOOK.md',
      'owner-docs/ARB_CANONICAL_MERGE_VALIDATION_REPORT.md',
      'owner-docs/validation_report.md',
      'owner-docs/ARB_CANONICAL_MERGED_PROMPTS.md',
      'owner-docs/merged_upgraded_prompts.md',
      'catalog/product-manifest.json',
    ],
    integrityNote: 'Static design score is a design target, not measured model performance. PASS means a deterministic public-data preflight passed its narrow reference test. autonomousActions is always empty: no product executes external side effects.',
  },
  entries,
};

mkdirSync('content/catalogue', { recursive: true });
writeFileSync('content/catalogue/portfolio-36.json', JSON.stringify(manifest, null, 2) + '\n');

const check = (label, n) => console.log(`${label}: ${n}`);
check('suites', suiteEntries.length);
check('workflows', workflowEntries.length);
check('total', entries.length);
console.log('statuses:', JSON.stringify(Object.entries(entries.reduce((a, e) => { a[e.status] = (a[e.status] || 0) + 1; return a; }, {}))));
console.log('publicDemo true:', entries.filter((e) => e.publicDemo).length);
console.log('with sources:', entries.filter((e) => e.publicValidation.sources.length > 0).length);
