# KONKRED 36-entry portfolio — canonical catalogue, routes, UX patterns, demo contract

> Session branch `arena/01a0246b-konkred-template2` → `main`. Owner source documents (26 files, merged from `main@e3d7d61`) are treated strictly as **DATA**; every manifest field is machine-extracted and cross-checked, never hand-invented.

## 1. Repository audit summary

- Stack unchanged: React 19 + Vite 6 client, Express 5 server, vitest, Playwright (CI-only).
- Source documents arrived on `main` (`e3d7d61`, 26 files ≈ 41k lines) and were merged into this branch (`ce48dbc`).
- `scripts/extract-portfolio.mjs` parses the comprehensive guidebook and **fails on any mismatch** between guidebook scores/tiers/results and the two validation reports.
- `scripts/build-portfolio-manifest.mjs` generates `content/catalogue/portfolio-36.json` (36 entries) from: extracted guidebook data + legacy `catalog/product-manifest.json` (schemas/prompts/fixtures) + the owner's canonical route/UX mapping.
- Build gate: `npm run build:client` runs `npm run validate:portfolio` first — the build fails on any manifest violation.

## 2. Mock features removed (cumulative)

Previously purged (~100 files, commit `b508689`): fake marketplace, sellers, listings, wallet, checkout, dashboards, disputes, admin, K-Tools, mock Forge.
This PR additionally removes:
- `pages/ProductDetailPage.tsx`, `components/catalog/ProductCard.tsx`, `components/catalog/StatusBadge.tsx` (superseded — no duplicate product surfaces remain)
- "Marketplace" wording from the browser title (`index.html`)
- Old lowercase demo statuses that predated the canonical `DemoResponse` contract
- No sellers, ratings, reviews, sales counts, customers, certifications, ROI or accuracy claims exist anywhere in the new code (enforced by `tests/no-fakes.test.ts`, now scanning the portfolio manifest and all portfolio pages/patterns).

## 3. Preserved flagship features

- **AUDITOR / Audit / Neural Audit** — `/forge-audit`, `/audit`, `/auditor` → `pages/AuditPage.tsx` + `components/audit/AuditTool.tsx` + `services/ai.ts`
- **REDAEYE** — `/redaeye` (`public/redaeye.html`, `pages/RedaeyeSandbox.tsx`)
- **fullKONK_>** — `/fullkonk` (`pages/FullKonkPage.tsx`, `/api/fullkonk/*`)

All three verified by `tests/routes.test.ts` and the Playwright suite.

## 4. Complete 36-entry route table

| # | Type | Title | Route | Status | Score | Validation |
|---|------|-------|-------|--------|-------|------------|
| 1 | SUITE | Customer Support Control Suite | `/suites/customer-support-control` | `PUBLIC_CATALOGUE_SUPERVISED` | 86/100 | PASS |
| 2 | SUITE | Finance Close, Reconciliation & Reporting Suite | `/suites/finance-close-reporting` | `PUBLIC_CATALOGUE_SUPERVISED` | 88/100 | PASS |
| 3 | SUITE | Finance Planning, Treasury & Liquidity Suite | `/suites/finance-planning-treasury` | `PUBLIC_CATALOGUE_SUPERVISED` | 84/100 | PASS |
| 4 | SUITE | Finance AP/AR, Billing & Collections Operations Suite | `/suites/finance-ap-ar-operations` | `PUBLIC_CATALOGUE_SUPERVISED` | 84/100 | PASS |
| 5 | SUITE | Finance Risk, Crime & Credit Analytics Suite | `/suites/finance-risk-crime-credit` | `INTERNAL_CONTROLLED_PILOT` | 83/100 | PASS |
| 6 | SUITE | Finance Tax, Revenue Recognition & Compliance Suite | `/suites/finance-tax-revenue-compliance` | `INTERNAL_CONTROLLED_PILOT` | 84/100 | PASS |
| 7 | SUITE | Investment & M&A Analytics Workbench | `/suites/investment-ma-analytics` | `PUBLIC_CATALOGUE_SUPERVISED` | 84/100 | PASS |
| 8 | SUITE | Pricing & Monetization Science Suite | `/suites/pricing-monetization-science` | `PUBLIC_CATALOGUE_SUPERVISED` | 82/100 | PASS |
| 9 | SUITE | Healthcare Revenue Cycle Review Suite | `/suites/healthcare-revenue-cycle` | `INTERNAL_CONTROLLED_PILOT` | 84/100 | PASS |
| 10 | SUITE | Clinical & Patient-Care Decision-Support Copilot | `/suites/clinical-patient-decision-support` | `INTERNAL_CONTROLLED_PILOT` | 83/100 | PASS |
| 11 | SUITE | Clinical Trials & Life-Sciences Operations Suite | `/suites/clinical-trials-life-sciences` | `INTERNAL_CONTROLLED_PILOT` | 84/100 | PASS |
| 12 | SUITE | Healthcare Operations, Privacy & Compliance Suite | `/suites/healthcare-operations-compliance` | `INTERNAL_CONTROLLED_PILOT` | 83/100 | PASS |
| 13 | SUITE | Fraud, Identity & Financial-Crime Triage Suite | `/suites/fraud-identity-financial-crime` | `INTERNAL_CONTROLLED_PILOT` | 82/100 | PASS |
| 14 | SUITE | Security Risk, Access & Data-Integrity Suite | `/suites/security-access-data-integrity` | `PUBLIC_CATALOGUE_SUPERVISED` | 86/100 | PASS |
| 15 | SUITE | Legal Contract & Transaction Review Suite | `/suites/legal-contract-transaction` | `PUBLIC_CATALOGUE_SUPERVISED` | 85/100 | PASS |
| 16 | SUITE | Legal Regulatory, Privacy & AI-Governance Suite | `/suites/legal-regulatory-privacy-ai` | `INTERNAL_CONTROLLED_PILOT` | 84/100 | PASS |
| 17 | SUITE | HR Hiring, Privacy & Onboarding Suite | `/suites/hr-hiring-privacy-onboarding` | `INTERNAL_CONTROLLED_PILOT` | 83/100 | PASS |
| 18 | SUITE | Communications Control Suite | `/suites/communications-control` | `PUBLIC_CATALOGUE_SUPERVISED` | 84/100 | PASS |
| 19 | SUITE | Marketing & Sales Evidence Module Library | `/suites/marketing-sales-evidence` | `PUBLIC_CATALOGUE_SUPERVISED` | 82/100 | PASS |
| 20 | SUITE | Operations & Procurement Intelligence Suite | `/suites/operations-procurement` | `PUBLIC_CATALOGUE_SUPERVISED` | 84/100 | PASS |
| 21 | SUITE | Mixed Quick-Win Control Workflows | `/suites/mixed-quick-win-workflows` | `INTERNAL_CONTROLLED_PILOT` | 83/100 | PASS |
| 22 | WORKFLOW | Contract Review Copilot | `/tools/contract-review` | `PUBLIC_DEMO` | 84/100 | PASS |
| 23 | WORKFLOW | IaC Security Copilot | `/tools/iac-security` | `PUBLIC_CATALOGUE_SUPERVISED` | 83/100 | PASS |
| 24 | WORKFLOW | M&A Due-Diligence Workbench | `/tools/ma-diligence` | `ENTERPRISE_INTEGRATION` | 82/100 | PASS |
| 25 | WORKFLOW | Incident Learning and Post-Mortem | `/tools/incident-postmortem` | `PUBLIC_DEMO` | 84/100 | PASS |
| 26 | WORKFLOW | GRC Evidence Request Triage | `/tools/grc-evidence` | `WORKFLOW_KIT` | 84/100 | PASS |
| 27 | WORKFLOW | Cash/Bank/PSP Reconciliation Copilot | `/tools/reconciliation` | `WORKFLOW_KIT` | 82/100 | PASS |
| 28 | WORKFLOW | Enterprise RFP Response Copilot | `/tools/enterprise-rfp` | `PUBLIC_CATALOGUE_SUPERVISED` | 82/100 | PASS |
| 29 | WORKFLOW | GovCon RFP Compliance Workbench | `/tools/govcon-rfp` | `PUBLIC_CATALOGUE_SUPERVISED` | 85/100 | PASS |
| 30 | WORKFLOW | FP&A Monthly Variance Analysis | `/tools/fpa-variance` | `WORKFLOW_KIT` | 82/100 | PASS |
| 31 | WORKFLOW | Executive Flash Brief | `/tools/executive-flash` | `PUBLIC_DEMO` | 81/100 | PASS |
| 32 | WORKFLOW | Commercial Lease Abstraction | `/tools/lease-abstraction` | `WORKFLOW_KIT` | 82/100 | PASS |
| 33 | WORKFLOW | SEO Content Opportunity Planner | `/tools/seo-planner` | `PUBLIC_DEMO` | 81/100 | PASS |
| 34 | WORKFLOW | Evidence-Backed PRD Generator | `/tools/evidence-backed-prd` | `CONDITIONAL_VALIDATION` | 84/100 | CONDITIONAL |
| 35 | WORKFLOW | Customer Health and Churn Copilot | `/tools/customer-health` | `PUBLIC_CATALOGUE_SUPERVISED` | 82/100 | PASS |
| 36 | WORKFLOW | A/B Experiment Interpretation Assistant | `/tools/ab-experiment` | `PUBLIC_DEMO` | 85/100 | PASS |

Legacy redirects: `/products/<legacySlug>` → `/tools/<slug>` (all 15), `/products` `/marketplace` `/ktools` `/sell` → `/catalogue`.
Platform routes: `/pricing`, `/kits/:slug`, `/sprint`, `/enterprise`, `/partners`, `/validation`.
Purged routes (`/checkout`, `/wallet`, `/seller-dashboard`, …) remain 404.

## 5. Complete UIUX differentiation matrix

All 36 entries ship a **dedicated** interaction-pattern component under `components/portfolio/patterns/` — each with a unique layout skeleton and `data-testid="pattern-<slug>"`:

- `suites-a.tsx` (11): ticket-queue command center · close checklist+approval drawer · scenario sliders lab · three-way-match workbench · model-governance console · authority-timeline workpaper · data-room cockpit · pricing lab with guardrail chart · RCM review board · clinician evidence desk · trial-ops timeline
- `suites-b.tsx` (10): control-map grid · SVG evidence graph · findings console with severity filters · synchronized document studio · obligation graph · HR governance board · comms approval studio with editable canvas · claims registry/matrix tabs · procurement cockpit · controlled module selector
- `workflows.tsx` (15): split-pane contract review · IaC code viewer + finding matrix · diligence workstream board · timeline scrubber · evidence kanban · deterministic ledger-matching lanes · RFP readiness matrix · source-coordinate navigator · waterfall/table variance toggle · KPI threshold composer · lease extraction sheet with quote anchors · topic-cluster bubble canvas · PRD traceability board · account signal cards · A/B validity console

Uniqueness is enforced by test (`tests/portfolio.test.ts`: 36 distinct pattern slugs, every entry covered).

## 6. Manifest/schema validation result

```
$ npm run validate:portfolio
portfolio manifest VALID — 36 entries (21 suites + 15 workflows), ids/slugs/routes unique,
parents resolve, validators linked, no autonomous actions.
```

Validator (`content/catalogue/validate.ts`) enforces: unique id/slug/route · parent resolution + parentRoute match · controlled tiers (`PUBLIC_CATALOGUE_SUPERVISED`, `INTERNAL_CONTROLLED_PILOT`, `CONDITIONAL_VALIDATION`, `ENTERPRISE_INTEGRATION`) must name a human approver · `autonomousActions === []` · `validationReport`/`promptReference` files exist · PASS/CONDITIONAL entries must cite test focus + recorded result + public sources · `publicDemo: true` requires an available demo + existing fixture · 21/15 counts · 15 unique legacy slug mappings · routes match entry type.

## 7. Public demo/validation result by product

| Product | Slug | Demo state | Validation evidence |
|---|---|---|---|
| Customer Support Control Suite | `customer-support-control` | no executable demo — evidence page + interface preview | `PASS` — Public incident timeline and public churn benchmark used to test evide |
| Finance Close, Reconciliation & Reporting Suite | `finance-close-reporting` | no executable demo — evidence page + interface preview | `PASS` — Public bank/ledger example data and public budget/investor data used t |
| Finance Planning, Treasury & Liquidity Suite | `finance-planning-treasury` | no executable demo — evidence page + interface preview | `PASS` — Public investor liquidity and revenue figures used to test reproducibl |
| Finance AP/AR, Billing & Collections Operations Suite | `finance-ap-ar-operations` | no executable demo — evidence page + interface preview | `PASS` — Public bank/ledger records and a public questionnaire used to test exc |
| Finance Risk, Crime & Credit Analytics Suite | `finance-risk-crime-credit` | no executable demo — evidence page + interface preview | `PASS` — Public AML guidance and public investor material used to test model/la |
| Finance Tax, Revenue Recognition & Compliance Suite | `finance-tax-revenue-compliance` | no executable demo — evidence page + interface preview | `PASS` — Public financial and control sources used to test missing-policy behav |
| Investment & M&A Analytics Workbench | `investment-ma-analytics` | no executable demo — evidence page + interface preview | `PASS` — Public investor-presentation evidence and reproducible ratio calculati |
| Pricing & Monetization Science Suite | `pricing-monetization-science` | no executable demo — evidence page + interface preview | `PASS` — Public A/B data and public SEO-factor data used to test external-stati |
| Healthcare Revenue Cycle Review Suite | `healthcare-revenue-cycle` | no executable demo — evidence page + interface preview | `PASS` — Public CMS coding information used to test versioned coding-source req |
| Clinical & Patient-Care Decision-Support Copilot | `clinical-patient-decision-support` | no executable demo — evidence page + interface preview | `PASS` — Public FDA AI/ML medical-device information used to test evidence-sour |
| Clinical Trials & Life-Sciences Operations Suite | `clinical-trials-life-sciences` | no executable demo — evidence page + interface preview | `PASS` — A public ClinicalTrials.gov record and public FDA GCP guidance used to |
| Healthcare Operations, Privacy & Compliance Suite | `healthcare-operations-compliance` | no executable demo — evidence page + interface preview | `PASS` — Public HHS HIPAA material used to test privacy-source traceability and |
| Fraud, Identity & Financial-Crime Triage Suite | `fraud-identity-financial-crime` | no executable demo — evidence page + interface preview | `PASS` — Public FinCEN guidance used to test policy/version and model-ground-tr |
| Security Risk, Access & Data-Integrity Suite | `security-access-data-integrity` | no executable demo — evidence page + interface preview | `PASS` — Public Terraform security patterns and public control checklist used t |
| Legal Contract & Transaction Review Suite | `legal-contract-transaction` | no executable demo — evidence page + interface preview | `PASS` — Public MSA and commercial lease sources used to test source-span extra |
| Legal Regulatory, Privacy & AI-Governance Suite | `legal-regulatory-privacy-ai` | no executable demo — evidence page + interface preview | `PASS` — Public European Commission AI Act and HHS material used to test jurisd |
| HR Hiring, Privacy & Onboarding Suite | `hr-hiring-privacy-onboarding` | no executable demo — evidence page + interface preview | `PASS` — Public EEOC Title VII material used to test job-related criteria, huma |
| Communications Control Suite | `communications-control` | no executable demo — evidence page + interface preview | `PASS` — Public incident postmortem used to test source-linked fact extraction, |
| Marketing & Sales Evidence Module Library | `marketing-sales-evidence` | no executable demo — evidence page + interface preview | `PASS` — Public RFP, SEO-factor and advertising-guidance sources used to test c |
| Operations & Procurement Intelligence Suite | `operations-procurement` | no executable demo — evidence page + interface preview | `PASS` — Public RFP and public incident material used to test source-preserving |
| Mixed Quick-Win Control Workflows | `mixed-quick-win-workflows` | no executable demo — evidence page + interface preview | `PASS` — Public IaC, incident and reconciliation sources used to test shared re |
| Contract Review Copilot | `contract-review` | publicDemo=true (fixture `catalog/fixtures/contract-review-sample.json`) | `PASS` — Public MSA source-span evidence and missing-playbook hard stop |
| IaC Security Copilot | `iac-security` | publicDemo=true (fixture `catalog/fixtures/iac-security-sample.json`) | `PASS` — Known IaC finding recall and destructive-command guard |
| M&A Due-Diligence Workbench | `ma-diligence` | publicDemo=true (fixture `catalog/fixtures/ma-due-diligence-sample.json`) | `PASS` — Public investor evidence, calculation lineage and conditional risk |
| Incident Learning and Post-Mortem | `incident-postmortem` | publicDemo=true (fixture `catalog/fixtures/incident-sample.json`) | `PASS` — Public postmortem timeline reconstruction |
| GRC Evidence Request Triage | `grc-evidence` | publicDemo=true (fixture `catalog/fixtures/grc-requests-sample.json`) | `PASS` — Exact control mapping and evidence-register normalization |
| Cash/Bank/PSP Reconciliation Copilot | `reconciliation` | publicDemo=true (fixture `catalog/fixtures/reconciliation-sample.json`) | `PASS` — Exact candidates, ambiguity detection and no automatic journal entry |
| Enterprise RFP Response Copilot | `enterprise-rfp` | publicDemo=true (fixture `catalog/fixtures/rfp-response-sample.json`) | `PASS` — Missing claims-registry negative grounding test |
| GovCon RFP Compliance Workbench | `govcon-rfp` | publicDemo=true (fixture `catalog/fixtures/govcon-rfp-sample.json`) | `PASS` — Requirement-cue extraction and source-quality handling |
| FP&A Monthly Variance Analysis | `fpa-variance` | publicDemo=true (fixture `catalog/fixtures/fpa-sample.json`) | `PASS` — Budget/actual normalization and policy-mismatch safety |
| Executive Flash Brief | `executive-flash` | publicDemo=true (fixture `catalog/fixtures/executive-brief-sample.json`) | `PASS` — KPI-threshold status, source coverage and distribution gate |
| Commercial Lease Abstraction | `lease-abstraction` | publicDemo=true (fixture `catalog/fixtures/commercial-lease-sample.json`) | `PASS` — Required-term extraction and exact holdover quote |
| SEO Content Opportunity Planner | `seo-planner` | publicDemo=true (fixture `catalog/fixtures/seo-sample.json`) | `PASS` — Tool-data sufficiency and no-fabricated-forecast guard |
| Evidence-Backed PRD Generator | `evidence-backed-prd` | publicDemo=true (fixture `catalog/fixtures/prd-sample.json`) | `CONDITIONAL` — Public research synthesis and engineering-review separation |
| Customer Health and Churn Copilot | `customer-health` | publicDemo=true (fixture `catalog/fixtures/customer-health-sample.json`) | `PASS` — Calibrated reference model and explainable risk mode |
| A/B Experiment Interpretation Assistant | `ab-experiment` | publicDemo=true (fixture `catalog/fixtures/ab-test-sample.json`) | `PASS` — External statistical reference agreement and stats-engine guard |

Demo endpoint (`POST /api/demo/run`) returns the canonical contract:
`status ∈ COMPLETE|NEEDS_INPUT|BLOCKED|INCOMPLETE_SOURCE_SET|NEEDS_EXTERNAL_VALIDATOR|ERROR`, `productId`, `runId`, `sourceRefs`, `validation{schema,provenance,safety}`, `limitations`, `actionsExecuted: []`.
In this environment (no `GEMINI_API_KEY`/`API_KEY`) model-backed runs return `NEEDS_EXTERNAL_VALIDATOR` — labelled honestly, never faked. Suites never expose a fake demo engine.

## 8. Test commands and exact outputs

```
$ npm run lint && npm run typecheck   # tsc --noEmit
exit 0 (no errors)

$ npm test                            # vitest run
Test Files  7 passed (7)
     Tests  104 passed (104)

$ npm run validate:portfolio
portfolio manifest VALID — 36 entries …

$ npm run build                       # validate + vite build + server bundle
✓ built in 8.26s ; dist/server.cjs 323.9 kb ; exit 0

$ npm run build:vercel                # validate + vite build + esbuild api bundle
lib/fullkonk-server.cjs 4.1mb ; exit 0
```

Playwright (`npm run test:e2e`): suite rewritten for all 36 routes + redirects + platform pages. **Collected, not executed in this sandbox** — the browser CDN is blocked here (D-013); it runs in CI or on the reviewer's machine.

## 9. Vercel Preview URL

Latest push deploys automatically to the project's Vercel preview:
https://konkred-template2-kx81hrixe-ari-miyanjis-projects.vercel.app
(deployment protected by Vercel login; each push to this branch produces a fresh preview URL in the Vercel dashboard)

## 10. Environment variable names (names only — no values in repo, client or PR)

Server/model: `GEMINI_API_KEY`, `API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `XAI_API_KEY`, `CEREBRAS_API_KEY`, `SAMBANOVA_API_KEY`, `NVIDIA_API_KEY`, `HUGGINGFACE_API_KEY`, `TOGETHER_API_KEY`, `FIREWORKS_API_KEY`, `PERPLEXITY_API_KEY`, `QWEN_ACCESS_KEY_ID`, `QWEN_ACCESS_KEY_SECRET`, `GITHUB_TOKEN`
Auth/site: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `VITE_APP_NAME`, `VITE_API_URL`, `VITE_TRUST_WALLET_USDT_TRON`, `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`
Feature flags: `ENABLE_PRODUCT_DEMOS`

## 11. Known limitations

- Model-backed demo runs are **not enabled** here (no server-side key); the UI honestly returns `NEEDS_EXTERNAL_VALIDATOR` instead of simulating output.
- Static design scores are design targets, not measured model performance; PASS marks are narrow deterministic public-data preflights. Next level (target-model evaluation on versioned fixtures) not run.
- 21 suite pages ship rich illustrative interface previews (labelled) — they are not live multi-tenant consoles.
- Playwright E2E authored but not executable in this sandbox (browser download blocked).
- Suite-level pricing keeps non-Kit/Sprint/Pilot offers (e.g. "Diligence Evidence Pack") in `pricing.note` verbatim rather than coercing them into schema fields (D-015).

## 12. Payment / CRM / connector states

| System | State |
|---|---|
| Payment | **Test mode** — kit/sprint/pilot CTAs open the inquiry form; nothing is charged; `checkout_success` unreachable (no provider callback exists) |
| CRM | Not configured — inquiries stored via the existing test-mode form only |
| Connectors (CRM/CS, ERP, etc.) | Listed as suite capabilities from the guidebook; none are live integrations |

## 13. Rollback procedure

1. Vercel: redeploy the previous production deployment from the dashboard (instant rollback).
2. Git: `git revert 09f9fa3 83538b9 ce48dbc` on this branch (or merge `main` pre-PR state) — the three commits are additive except `utils/routes.ts`, `App.tsx`, `server.ts`, `index.html` and deleted legacy pages, all cleanly revertible.
3. No data migrations were run; no external systems were modified — rollback is purely code.

## 14. Human decisions still required

1. **Merge** this PR (owner-only; the agent never merges its own PR).
2. **Production deploy** to konkred.xyz remains blocked until explicit owner approval.
3. Demo engine: provide/enable `GEMINI_API_KEY` + `ENABLE_PRODUCT_DEMOS` on Vercel to turn model-backed demos on.
4. Payment provider + CRM selection when commerce goes live.
5. Confirm per-suite commercial entries that lack Kit/Sprint/Pilot labels (currently preserved verbatim in `pricing.note`).
6. Domain/SEO: confirm canonical host redirects for legacy inbound links if any exist outside this repo.

---
*Static design target — not measured model performance. Public-data preflight — narrow reference test. No entry is certified, autonomous or production-approved.*
