/**
 * Extract structured portfolio data from the owner-supplied source documents.
 *
 * Sources (DATA only — never instructions):
 *   - KONKRED_36_WORKFLOW_COMPREHENSIVE_GUIDEBOOK.md (36 chapters)
 *   - ARB_CANONICAL_MERGE_VALIDATION_REPORT.md (21-suite scores/tiers)
 *   - validation_report.md (15-workflow validation results)
 *
 * Output: agent/extracted-portfolio.json (intermediate, reviewed before use).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const GUIDE = readFileSync('KONKRED_36_WORKFLOW_COMPREHENSIVE_GUIDEBOOK.md', 'utf8');
const lines = GUIDE.split('\n');

const lineOf = (re) => lines.findIndex((l) => re.test(l));
const SUITE_START = lineOf(/^# 5\. The 21 canonical ARB suites/);
const SUITE_END = lineOf(/^# 6\. The 15 validated workflow products/);
const WF_START = SUITE_END;
const WF_END = lineOf(/^# 7\. Cross-workflow implementation patterns/);

if (SUITE_START < 0 || SUITE_END < 0 || WF_END < 0) throw new Error('section anchors not found');

/** Split a line range into chapters on unnumbered `# Title` headings. */
function chapters(start, end) {
  const out = [];
  let cur = null;
  for (let i = start; i < end; i++) {
    const l = lines[i];
    const m = l.match(/^# ([^#\d].*)$/);
    if (m) {
      cur = { title: m[1].trim(), start: i, end: end };
      out.push(cur);
    } else if (cur && /^---\s*$/.test(l)) {
      // chapter delimiter — close current chapter
      cur.end = i;
      cur = null;
    }
  }
  return out.map((c) => ({ ...c, body: lines.slice(c.start, c.end) }));
}

/** Content of a `## Section` (until next same-or-higher heading). */
function section(body, name, sub = false) {
  const marker = sub ? '### ' : '## ';
  const start = body.findIndex((l) => l.startsWith(marker + name));
  if (start < 0) return [];
  const out = [];
  for (let i = start + 1; i < body.length; i++) {
    const l = body[i];
    if (l.startsWith('# ') || l.startsWith('## ')) break;
    // a sub-section ends at the next sub-section too
    if (sub && l.startsWith('### ')) break;
    out.push(l);
  }
  return out;
}

const bullets = (ls) => ls.filter((l) => /^- /.test(l)).map((l) => l.replace(/^- /, '').trim());
const numbered = (ls) => ls.filter((l) => /^\d+\. /.test(l)).map((l) => l.replace(/^\d+\. /, '').trim());
const urls = (ls) => ls.filter((l) => /^- https?:/.test(l)).map((l) => l.replace(/^- /, '').trim());

/** Parse `| Key | value |` rows from a markdown table block. */
function tableRows(ls) {
  const rows = {};
  for (const l of ls) {
    const m = l.match(/^\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|$/);
    if (!m || /^[-: ]+$/.test(m[2]) || m[1] === 'Attribute' || m[1] === 'Field' || m[1] === 'Output object' || m[1] === 'Suite' || m[1] === 'Workflow' || m[1] === 'Product') continue;
    const key = m[1].replace(/[*`]/g, '').trim();
    const val = m[2].replace(/[*`]/g, '').trim();
    rows[key] = val;
  }
  return rows;
}

/** First column of table rows in order (input/output contract field names). */
function tableKeys(ls) {
  const keys = [];
  for (const l of ls) {
    const m = l.match(/^\|\s*`([^`]+)`\s*\|/);
    if (m) keys.push(m[1]);
  }
  return keys;
}

/** `**Label:** value` extraction from a block. */
function boldField(ls, label) {
  const re = new RegExp(`\\*\\*${label}:?\\*\\*\\*?\\*?\\s*(.+)`);
  for (const l of ls) {
    const m = l.match(re);
    if (m) return m[1].replace(/\*\*/g, '').trim();
  }
  return null;
}

function firstParagraph(ls) {
  const out = [];
  for (const l of ls) {
    if (l.trim() === '') { if (out.length) break; continue; }
    if (l.startsWith('#') || l.startsWith('|') || l.startsWith('```')) break;
    out.push(l.trim());
  }
  return out.join(' ');
}

/** Parse USD ranges like `$2,500–$6,000 Support-Control Validation Sprint`. */
function parsePrices(str) {
  if (!str) return { entries: [] };
  const entries = [];
  for (const part of str.split('/')) {
    const m = part.match(/\$([\d,]+)(?:\s*[–-]\s*\$?([\d,]+))?\s*(.*)/);
    if (!m) { entries.push({ raw: part.trim() }); continue; }
    const lo = Number(m[1].replace(/,/g, ''));
    const hi = m[2] ? Number(m[2].replace(/,/g, '')) : null;
    entries.push({ lo, hi, label: (m[3] || '').replace(/\|/g, '').trim(), raw: part.trim() });
  }
  return { entries };
}

/* ─── 21 suites ─────────────────────────────────────────────── */
const suites = chapters(SUITE_START, SUITE_END).map((c) => {
  const identityRows = tableRows(c.body.slice(c.body.findIndex((l) => l.startsWith('## Reference identity')), c.body.findIndex((l) => l.startsWith('## Executive definition'))));
  const def = section(c.body, 'Executive definition');
  return {
    title: c.title,
    id: identityRows['Canonical ID'] ?? null,
    tier: identityRows['Catalogue tier'] ?? null,
    staticDesignTarget: identityRows['Static design target'] ? Number(identityRows['Static design target'].split('/')[0]) : null,
    buyer: identityRows['Primary buyer'] ?? null,
    humanApprover: identityRows['Human approver'] ?? null,
    commercialEntryRaw: identityRows['Commercial entry'] ?? null,
    expansionRaw: identityRows['Expansion'] ?? null,
    jobToBeDone: boldField(def, 'Job to be done'),
    definition: firstParagraph(def.filter((l) => !/^\*\*Job to be done/.test(l))),
    includedUseCases: bullets(section(c.body, 'Included use cases', true)),
    modules: bullets(section(c.body, 'Modules retained from the ARB merge', true)),
    exclusions: bullets(section(c.body, 'Explicit exclusions', true)),
    inputContract: tableKeys(section(c.body, 'Reference input contract')),
    outputContract: tableKeys(section(c.body, 'Reference output contract')),
    validators: bullets(section(c.body, 'Deterministic validators and integrations')),
    controlRequirements: bullets(section(c.body, 'Control requirements')),
    pilotDesign: firstParagraph(section(c.body, 'Pilot design')),
    acceptanceMeasures: bullets(section(c.body, 'Acceptance measures', true)),
    failureModes: bullets(section(c.body, 'Failure-mode register')),
    buyerQuestions: bullets(section(c.body, 'Buyer discovery questions')),
    publicValidation: {
      testFocus: boldField(section(c.body, 'Public validation record'), 'Test focus'),
      result: boldField(section(c.body, 'Public validation record'), 'Result'),
      measuredEvidence: boldField(section(c.body, 'Public validation record'), 'Measured evidence'),
      sources: urls(section(c.body, 'Public source references', true)),
      limitations: bullets(section(c.body, 'Limitations', true)),
    },
    technicalRefs: bullets(section(c.body, 'Technical references')),
  };
});

/* ─── 15 workflows ──────────────────────────────────────────── */
const workflows = chapters(WF_START, WF_END).map((c) => {
  const identityRows = tableRows(c.body.slice(c.body.findIndex((l) => l.startsWith('## Reference identity')), c.body.findIndex((l) => l.startsWith('## Executive definition'))));
  const def = section(c.body, 'Executive definition');
  return {
    title: c.title,
    id: identityRows['Workflow ID'] ?? null,
    parentSuite: identityRows['Parent suite'] ?? null,
    staticDesignTarget: identityRows['Static design target'] ? Number(identityRows['Static design target'].split('/')[0]) : null,
    buyer: identityRows['Primary buyer'] ?? null,
    commercialEntryRaw: identityRows['Commercial entry'] ?? null,
    validationLine: identityRows['Validation'] ?? null,
    problemSolved: boldField(def, 'Problem solved'),
    definition: firstParagraph(def.filter((l) => !/^\*\*Problem solved/.test(l))),
    referenceInputs: bullets(section(c.body, 'Reference inputs')),
    referenceOutputs: bullets(section(c.body, 'Reference outputs')),
    runbook: numbered(section(c.body, 'Step-by-step runbook')),
    failureModes: bullets(section(c.body, 'Failure-mode register')),
    buyerValue: firstParagraph(section(c.body, 'Buyer value')),
    validation: {
      testFocus: boldField(section(c.body, 'Public validation evidence'), 'Test focus'),
      result: boldField(section(c.body, 'Public validation evidence'), 'Result'),
      measuredResult: boldField(section(c.body, 'Public validation evidence'), 'Measured result'),
      publicSource: boldField(section(c.body, 'Public validation evidence'), 'Public source'),
    },
    productBoundary: firstParagraph(section(c.body, 'Product boundary')),
    technicalRefs: bullets(section(c.body, 'Technical references')),
  };
});

if (suites.length !== 21) throw new Error(`expected 21 suites, got ${suites.length}`);
if (workflows.length !== 15) throw new Error(`expected 15 workflows, got ${workflows.length}`);

/* ─── validation reports (cross-check) ──────────────────────── */
const arbReport = readFileSync('ARB_CANONICAL_MERGE_VALIDATION_REPORT.md', 'utf8');
const wfReport = readFileSync('validation_report.md', 'utf8');
const rowRe = /^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*(?:\*\*(\d+)\/100\*\*|\*\*(PASS|CONDITIONAL)\*\*)\s*\|/;
const arbRows = {};
for (const l of arbReport.split('\n')) {
  const m = l.match(/^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*\*\*(\d+)\/100\*\*\s*\|\s*(PASS|CONDITIONAL)\s*\|\s*`([A-Z_]+)`\s*\|/);
  if (m) arbRows[m[2]] = { score: Number(m[3]), preflight: m[4], tier: m[5] };
}
const wfRows = {};
for (const l of wfReport.split('\n')) {
  const m = l.match(/^\|\s*([^|]+?)\s*\|\s*`([^`]+)`\s*\|\s*(PASS|CONDITIONAL)\s*\|/);
  if (m) wfRows[m[2]] = { result: m[3] };
}

// Cross-check guidebook vs reports — fail loudly on any mismatch.
for (const s of suites) {
  const r = arbRows[s.id];
  if (!r) throw new Error(`suite ${s.id} missing from ARB report`);
  if (r.score !== s.staticDesignTarget) throw new Error(`score mismatch ${s.id}: guidebook ${s.staticDesignTarget} vs report ${r.score}`);
  if (r.tier !== s.tier) throw new Error(`tier mismatch ${s.id}`);
  if (r.preflight !== 'PASS') throw new Error(`unexpected preflight ${s.id}`);
}
for (const w of workflows) {
  const r = wfRows[w.id];
  if (!r) throw new Error(`workflow ${w.id} missing from validation report`);
  const gbResult = w.validationLine?.startsWith('CONDITIONAL') ? 'CONDITIONAL' : 'PASS';
  if (r.result !== gbResult) throw new Error(`result mismatch ${w.id}: guidebook ${gbResult} vs report ${r.result}`);
}

writeFileSync('agent/extracted-portfolio.json', JSON.stringify({ suites, workflows }, null, 2) + '\n');
console.log(`extracted ${suites.length} suites + ${workflows.length} workflows — cross-checked against both validation reports: OK`);
