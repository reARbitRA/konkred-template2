# KONKRED — Route Matrix (36 catalogue entries + platform + legacy)
**STATUS: IMPLEMENTED** — routing shipped in `utils/routes.ts` + `content/catalogue/portfolio-36.json`; verified by `tests/routes.test.ts` (12 tests) and `tests/portfolio.test.ts`. Legacy `/products/:slug` URLs redirect to `/tools/:slug`; `/products`, `/marketplace`, `/ktools` redirect to `/catalogue`. Platform routes `/pricing`, `/kits/:slug`, `/sprint`, `/enterprise`, `/partners`, `/validation` are live pages.


Canonical source: `content/catalogue/portfolio-36.json`. Every row below is asserted by
`tests/routes.test.ts` and exercised by `tests/e2e/portfolio.spec.ts`.

Uniqueness rules enforced at build time: unique `id`, unique `slug`, unique `route`, every `parentId`
resolves to an existing SUITE entry, every WORKFLOW route lives under `/tools/`, every SUITE route lives
under `/suites/`.

---

## 1. Suites — 21 entries (`type: "SUITE"`)

| # | Route | Slug | Title | Canonical ID |
| --- | --- | --- | --- | --- |
| 1 | `/suites/customer-support-control` | `customer-support-control` | Customer Support Control Suite | `KONKRED-ARB-CSM-CONTROL-CANON-0001-v1.0` |
| 2 | `/suites/finance-close-reporting` | `finance-close-reporting` | Finance Close, Reconciliation & Reporting Suite | `KONKRED-ARB-FIN-CLOSE-CANON-0001-v1.0` |
| 3 | `/suites/finance-planning-treasury` | `finance-planning-treasury` | Finance Planning, Treasury & Liquidity Suite | `KONKRED-ARB-FIN-PLAN-CANON-0001-v1.0` |
| 4 | `/suites/finance-ap-ar-operations` | `finance-ap-ar-operations` | Finance AP/AR, Billing & Collections Operations Suite | `KONKRED-ARB-FIN-APAR-CANON-0001-v1.0` |
| 5 | `/suites/finance-risk-crime-credit` | `finance-risk-crime-credit` | Finance Risk, Crime & Credit Analytics Suite | `KONKRED-ARB-FIN-RISK-CANON-0001-v1.0` |
| 6 | `/suites/finance-tax-revenue-compliance` | `finance-tax-revenue-compliance` | Finance Tax, Revenue Recognition & Compliance Suite | `KONKRED-ARB-FIN-TAX-CANON-0001-v1.0` |
| 7 | `/suites/investment-ma-analytics` | `investment-ma-analytics` | Investment & M&A Analytics Workbench | `KONKRED-ARB-FIN-MA-CANON-0001-v1.0` |
| 8 | `/suites/pricing-monetization-science` | `pricing-monetization-science` | Pricing & Monetization Science Suite | `KONKRED-ARB-GRO-PRICING-CANON-0001-v1.0` |
| 9 | `/suites/healthcare-revenue-cycle` | `healthcare-revenue-cycle` | Healthcare Revenue Cycle Review Suite | `KONKRED-ARB-HEL-RCM-CANON-0001-v1.0` |
| 10 | `/suites/clinical-patient-decision-support` | `clinical-patient-decision-support` | Clinical & Patient-Care Decision-Support Copilot | `KONKRED-ARB-HEALTH-CLINICAL-CANON-0001-v1.0` |
| 11 | `/suites/clinical-trials-life-sciences` | `clinical-trials-life-sciences` | Clinical Trials & Life-Sciences Operations Suite | `KONKRED-ARB-LISC-TRIALS-CANON-0001-v1.0` |
| 12 | `/suites/healthcare-operations-compliance` | `healthcare-operations-compliance` | Healthcare Operations, Privacy & Compliance Suite | `KONKRED-ARB-HEALTH-OPS-CANON-0001-v1.0` |
| 13 | `/suites/fraud-identity-financial-crime` | `fraud-identity-financial-crime` | Fraud, Identity & Financial-Crime Triage Suite | `KONKRED-ARB-SEC-FRAUD-CANON-0001-v1.0` |
| 14 | `/suites/security-access-data-integrity` | `security-access-data-integrity` | Security Risk, Access & Data-Integrity Suite | `KONKRED-ARB-SEC-GRC-CANON-0001-v1.0` |
| 15 | `/suites/legal-contract-transaction` | `legal-contract-transaction` | Legal Contract & Transaction Review Suite | `KONKRED-ARB-LEG-CONTRACT-CANON-0001-v1.0` |
| 16 | `/suites/legal-regulatory-privacy-ai` | `legal-regulatory-privacy-ai` | Legal Regulatory, Privacy & AI-Governance Suite | `KONKRED-ARB-LEG-REG-CANON-0001-v1.0` |
| 17 | `/suites/hr-hiring-privacy-onboarding` | `hr-hiring-privacy-onboarding` | HR Hiring, Privacy & Onboarding Suite | `KONKRED-ARB-HR-PEOPLE-CANON-0001-v1.0` |
| 18 | `/suites/communications-control` | `communications-control` | Communications Control Suite | `KONKRED-ARB-COMMS-CONTROL-CANON-0001-v1.0` |
| 19 | `/suites/marketing-sales-evidence` | `marketing-sales-evidence` | Marketing & Sales Evidence Module Library | `KONKRED-ARB-MKT-SALES-CANON-0001-v1.0` |
| 20 | `/suites/operations-procurement` | `operations-procurement` | Operations & Procurement Intelligence Suite | `KONKRED-ARB-OPS-PROCUREMENT-CANON-0001-v1.0` |
| 21 | `/suites/mixed-quick-win-workflows` | `mixed-quick-win-workflows` | Mixed Quick-Win Control Workflows | `KONKRED-ARB-MSC-CONTROL-CANON-0001-v1.0` |

## 2. Workflows — 15 entries (`type: "WORKFLOW"`)

| # | Route | Slug | Title | Canonical ID | Parent route |
| --- | --- | --- | --- | --- | --- |
| 1 | `/tools/contract-review` | `contract-review` | Contract Review Copilot | `KONKRED-LEG-CON-CANON-0001-v2.0` | `/suites/legal-contract-transaction` |
| 2 | `/tools/iac-security` | `iac-security` | IaC Security Copilot | `KONKRED-SEC-IAC-CANON-0001-v2.0` | `/suites/security-access-data-integrity` |
| 3 | `/tools/ma-diligence` | `ma-diligence` | M&A Due-Diligence Workbench | `KONKRED-FIN-DD-CANON-0001-v2.0` | `/suites/investment-ma-analytics` |
| 4 | `/tools/incident-postmortem` | `incident-postmortem` | Incident Learning and Post-Mortem | `KONKRED-OPS-SRE-CANON-0001-v2.0` | `/suites/mixed-quick-win-workflows` |
| 5 | `/tools/grc-evidence` | `grc-evidence` | GRC Evidence Request Triage | `KONKRED-SEC-GRC-CANON-0001-v2.0` | `/suites/legal-regulatory-privacy-ai` |
| 6 | `/tools/reconciliation` | `reconciliation` | Cash/Bank/PSP Reconciliation Copilot | `KONKRED-FIN-REC-CANON-0001-v2.0` | `/suites/finance-close-reporting` |
| 7 | `/tools/enterprise-rfp` | `enterprise-rfp` | Enterprise RFP Response Copilot | `KONKRED-SAL-RFP-CANON-0001-v2.0` | `/suites/marketing-sales-evidence` |
| 8 | `/tools/govcon-rfp` | `govcon-rfp` | GovCon RFP Compliance Workbench | `KONKRED-GOV-RFP-CANON-0001-v2.0` | `/suites/operations-procurement` |
| 9 | `/tools/fpa-variance` | `fpa-variance` | FP&A Monthly Variance Analysis | `KONKRED-FIN-FPA-CANON-0001-v2.0` | `/suites/finance-planning-treasury` |
| 10 | `/tools/executive-flash` | `executive-flash` | Executive Flash Brief | `KONKRED-EXC-BRF-CANON-0001-v2.0` | `/suites/finance-close-reporting` |
| 11 | `/tools/lease-abstraction` | `lease-abstraction` | Commercial Lease Abstraction | `KONKRED-LEG-CRE-CANON-0001-v2.0` | `/suites/legal-contract-transaction` |
| 12 | `/tools/seo-planner` | `seo-planner` | SEO Content Opportunity Planner | `KONKRED-MKT-SEO-CANON-0001-v2.0` | `/suites/marketing-sales-evidence` |
| 13 | `/tools/evidence-backed-prd` | `evidence-backed-prd` | Evidence-Backed PRD Generator | `KONKRED-PRD-CANON-0001-v2.0` | `/suites/marketing-sales-evidence` |
| 14 | `/tools/customer-health` | `customer-health` | Customer Health and Churn Copilot | `KONKRED-CSM-CHR-CANON-0001-v2.0` | `/suites/customer-support-control` |
| 15 | `/tools/ab-experiment` | `ab-experiment` | A/B Experiment Interpretation Assistant | `KONKRED-DAT-ABT-CANON-0001-v2.0` | `/suites/pricing-monetization-science` |

### Suites that are parents

`legal-contract-transaction` (2 children), `marketing-sales-evidence` (3), `finance-close-reporting` (2),
`security-access-data-integrity` (1), `investment-ma-analytics` (1), `mixed-quick-win-workflows` (1),
`legal-regulatory-privacy-ai` (1), `operations-procurement` (1), `finance-planning-treasury` (1),
`customer-support-control` (1), `pricing-monetization-science` (1). The remaining 10 suites have no child
workflow yet; their pages state that plainly instead of showing an empty "related tools" strip.

## 3. Legacy workflow slug → canonical route (redirect table)

The 15 workflows previously lived at `/products/<old-slug>`. Old URLs stay reachable and redirect (URL is
replaced, no fake page is rendered).

| Legacy URL | Redirects to |
| --- | --- |
| `/products/contract-review-copilot` | `/tools/contract-review` |
| `/products/iac-security-copilot` | `/tools/iac-security` |
| `/products/ma-due-diligence-workbench` | `/tools/ma-diligence` |
| `/products/incident-learning-postmortem` | `/tools/incident-postmortem` |
| `/products/grc-evidence-request-triage` | `/tools/grc-evidence` |
| `/products/reconciliation-copilot` | `/tools/reconciliation` |
| `/products/rfp-response-copilot` | `/tools/enterprise-rfp` |
| `/products/govcon-rfp-compliance-workbench` | `/tools/govcon-rfp` |
| `/products/fpa-variance-analysis` | `/tools/fpa-variance` |
| `/products/executive-flash-brief` | `/tools/executive-flash` |
| `/products/commercial-lease-abstraction` | `/tools/lease-abstraction` |
| `/products/seo-content-opportunity-planner` | `/tools/seo-planner` |
| `/products/evidence-backed-prd-generator` | `/tools/evidence-backed-prd` |
| `/products/customer-health-churn-copilot` | `/tools/customer-health` |
| `/products/ab-experiment-interpretation` | `/tools/ab-experiment` |
| `/products/<unknown>` | `/404` |

## 4. Platform routes

| Route | Purpose |
| --- | --- |
| `/` | Landing |
| `/catalogue` | Combined 36-entry catalogue index (suites + workflows, filterable by type/category/status) |
| `/products` | Alias → `/catalogue` |
| `/marketplace`, `/ktools`, `/sell` | Legacy aliases → `/catalogue` |
| `/pricing` | Commercial ladder: demo → kit → sprint → pilot → managed → workspace → enterprise |
| `/kits/:slug` | Per-entry Workflow Kit page (only for entries that offer a kit) |
| `/sprint` | Validation Sprint request |
| `/enterprise` | Enterprise workspace / OEM request |
| `/partners` | Partner / reseller request |
| `/validation` | Validation index: per-entry evidence status and links |
| `/404` | Intentional not-found |

## 5. Preserved flagship routes (must not change)

| Route | Feature |
| --- | --- |
| `/forge-audit` (aliases `/audit`, `/auditor`) | Audit / AUDITOR / Neural Audit |
| `/redaeye` (alias `/redaeye-sandbox`, legacy `/redaeye_sandbox`) | REDAEYE |
| `/fullkonk` (legacy `/forge` redirects here) | fullKONK_> |

## 6. Purged routes that must resolve to `/404`

`/wizard`, `/checkout`, `/wallet`, `/enclave`, `/library`, `/usage`, `/seller-dashboard`, `/buyer-dashboard`,
`/affiliate`, `/admin`, `/dispute`, `/metrics`, `/usage-metrics`, `/playgrounds`, `/intel-report`,
`/listing`, `/listing/:id`, and any unknown path.
