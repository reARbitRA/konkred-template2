# KONKRED — UI/UX Differentiation Matrix (36 entries)
**STATUS: IMPLEMENTED** — all 36 patterns shipped as dedicated components under `components/portfolio/patterns/` (`suites-a.tsx` 1–11, `suites-b.tsx` 12–21, `workflows.tsx` 1–15, registry in `index.tsx`). Each renders `data-testid="pattern-<slug>"`; uniqueness enforced by `tests/portfolio.test.ts`.


Purpose: prove that the 36 pages share one design system but are **not** clones. Each entry below states its
layout skeleton, the interaction that only it has, the atomic data unit the user manipulates, the shape of the
rendered output, and its distinctive empty/blocked state.

## 0. What is shared (design system — identical everywhere)

| Shared asset | Role |
| --- | --- |
| Design tokens (`styles/tokens.css`) | colour, type scale, spacing, radius, focus ring, motion durations |
| `ProductShell` | identity header (title, canonical ID, type badge, parent breadcrumb), status tier, buyer/approver strip, CTA rail, responsive 1→2→3 column grid |
| `ValidationBadge` | validation status + mandatory label "Public-data preflight — narrow reference test" |
| `DesignScore` | static score + mandatory label "Static design target — not measured model performance" |
| `EvidencePanel` | output evidence with per-item source reference |
| `SourceLedger` | fixture name, source URL, test date, limitations |
| `ApprovalGate` | human approver role + "what this tool does not do" (collapsed secondary panel, neutral tone) |
| `CtaRail` | commercial state buttons (demo / validation / kit / sprint / pilot / enterprise) driven by manifest status |
| `DemoRunner` | shared state machine: idle → needs-input → running → COMPLETE / NEEDS_INPUT / BLOCKED / INCOMPLETE_SOURCE_SET / NEEDS_EXTERNAL_VALIDATOR / ERROR |

## 1. What is unique (per entry)

Every entry supplies its own **layout component**, **signature interaction**, **input surface**, **output
renderer** and **empty/blocked copy**. No entry reuses another entry's layout component.

### Suites (21)

| # | Entry / route | Layout skeleton | Signature interaction (unique to this page) | Atomic data unit | Output rendering | Distinctive empty / blocked state |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Customer Support Control — `/suites/customer-support-control` | 3-col: queue │ ticket detail │ account rail | SLA countdown ring that re-orders the ticket queue live; policy-vs-reply diff view | Support ticket | Suggested reply + policy citations side by side | "No ticket selected — pick one from the queue" |
| 2 | Finance Close & Reporting — `/suites/finance-close-reporting` | Top close-calendar strip + exceptions table + right approval drawer | Day-of-close stepper (D-1…D+5) that filters the exception table | Close task / journal exception | Exception table with balance deltas and tie-out status | "Period not opened — select a close period" |
| 3 | Finance Planning & Treasury — `/suites/finance-planning-treasury` | Left assumptions form │ centre liquidity cards │ bottom scenario compare | Sensitivity sliders that recompute liquidity cards and pin scenarios for A/B comparison | Assumption line | Scenario columns with deltas per driver | "No assumptions set — the model has nothing to flex" |
| 4 | Finance AP/AR Operations — `/suites/finance-ap-ar-operations` | Split: document viewer │ three-way-match matrix, bottom owner/SLA queue | Three-way-match grid (PO × GRN × Invoice) with cell-level drill to the document region | Invoice line | Match matrix + unposted adjustment drawer (never posts) | "No document set — upload PO, receipt and invoice" |
| 5 | Finance Risk, Crime & Credit — `/suites/finance-risk-crime-credit` | Governance console: metadata health strip + calibration/drift cards + alert list + fairness panel | Calibration/drift card set with per-segment toggle and appeal review sub-panel | Model/alert record | Governance findings with evidence per alert | "Model metadata incomplete — governance review cannot start" |
| 6 | Finance Tax & Revenue Compliance — `/suites/finance-tax-revenue-compliance` | Workpaper: vertical authority timeline │ rule-to-evidence map │ open questions | Effective-date timeline scrubber that swaps the applicable rule set | Authority citation | Workpaper memo with rule → evidence links | "No authority selected for this period" |
| 7 | Investment & M&A Analytics — `/suites/investment-ma-analytics` | Cockpit with workstream tabs, thesis board, calculation register, missing-doc queue | Thesis evidence board: drag a document onto a thesis claim to bind evidence | Diligence document | Claim ↔ evidence ledger + calculation register | "Data room empty — no workstream can be evaluated" |
| 8 | Pricing & Monetization Science — `/suites/pricing-monetization-science` | Lab: experiment setup │ scenario sliders │ guardrail chart │ approval gate | Guardrail chart with breach markers that block the approval gate | Price/packaging scenario | Scenario table + guardrail verdict | "No guardrails defined — pricing change cannot be assessed" |
| 9 | Healthcare Revenue Cycle — `/suites/healthcare-revenue-cycle` | Review board: claim cards │ payer-policy compare │ qualified-review gate | De-identification status banner gating every claim card before content renders | De-identified claim | Denial-code evidence pairs with payer policy quotes | "PHI status unverified — content stays hidden" |
| 10 | Clinical Decision-Support — `/suites/clinical-patient-decision-support` | Evidence desk: clinical-question header │ source comparison columns │ uncertainty panel | Source comparison columns with an uncertainty meter per statement | Clinical source | Statement-level evidence with agreement/disagreement | "Clinician sign-off missing — output stays in draft" |
| 11 | Clinical Trials & Life Sciences — `/suites/clinical-trials-life-sciences` | Horizontal milestone timeline + protocol/registry tabs + alerts + TMF gaps | Milestone timeline with registry-vs-protocol discrepancy pins | Trial milestone / TMF artefact | Data-quality alert list + gap register | "No protocol loaded — timeline cannot be built" |
| 12 | Healthcare Ops, Privacy & Compliance — `/suites/healthcare-operations-compliance` | Control coverage heat grid + evidence period filter + minimization panel + owner queue | Coverage heat grid where a cell opens the evidence period drilldown | Control × period cell | Coverage map with evidence references | "No evidence period selected" |
| 13 | Fraud, Identity & Financial Crime — `/suites/fraud-identity-financial-crime` | Case board: entity link graph │ alternative explanations │ appeal panel │ handoff | Entity link graph where selecting an edge lists the evidence supporting it | Entity / relationship | Triage narrative with alternative explanations ranked | "No case selected — no entity graph to draw" |
| 14 | Security Risk, Access & Data Integrity — `/suites/security-access-data-integrity` | Findings console: code/plan viewer │ severity filter chips │ control mapping │ verification drawer | Severity chip filter bound to line anchors in the plan/code viewer | Finding | Findings list mapped to controls, read-only verification steps | "No plan or config supplied" |
| 15 | Legal Contract & Transaction — `/suites/legal-contract-transaction` | Review studio: synchronized source viewer │ clause list │ playbook compare │ counsel rail | Scroll-synced highlight: selecting a clause scrolls and highlights the source span | Clause | Clause-by-clause deviation vs playbook | "No playbook selected — deviations cannot be judged" |
| 16 | Legal Regulatory, Privacy & AI Governance — `/suites/legal-regulatory-privacy-ai` | Authority map: jurisdiction selector │ effective-date timeline │ obligation graph │ org-fact gaps | Jurisdiction × obligation matrix that greys out obligations with unknown org facts | Obligation | Obligation register with authority citations and gaps | "Organization facts missing — obligations cannot be applied" |
| 17 | HR Hiring, Privacy & Onboarding — `/suites/hr-hiring-privacy-onboarding` | Governance board: job-related criteria │ consent/retention checklist │ fairness review │ decision record | Append-only human decision record (entries are typed by a person, never by the model) | Criterion / decision entry | Structured process review, no candidate ranking | "No job-related criteria defined — review refuses to proceed" |
| 18 | Communications Control — `/suites/communications-control` | Studio: fact ledger │ draft canvas │ channel preview tabs │ distribution gate | Fact-to-claim linking: every sentence in the draft must bind to a ledger fact or is flagged | Fact / claim | Draft with per-sentence provenance + accessibility preview | "Fact ledger empty — the draft cannot be substantiated" |
| 19 | Marketing & Sales Evidence — `/suites/marketing-sales-evidence` | Workbench: claims registry │ requirement matrix │ content canvas │ consent gate | Claim substantiation chips (substantiated / unsupported / prohibited) filtering the canvas | Marketing claim | Claims register with evidence status | "No claims registered" |
| 20 | Operations & Procurement — `/suites/operations-procurement` | Cockpit: solicitation explorer │ supplier scorecard │ dependency map │ scenario board | Supplier scorecard bars driven by explicitly-weighted criteria the user sets | Supplier / solicitation | Scorecard + dependency findings (no award decision) | "No solicitation or supplier data loaded" |
| 21 | Mixed Quick-Win Workflows — `/suites/mixed-quick-win-workflows` | Module selector grid + authority scope panel + validator status + owner approval | Module picker where each module states its explicit authority boundary before it can be opened | Module | Per-module output within the declared boundary | "No module selected — no authority is in scope" |

### Workflows (15)

| # | Entry / route | Layout skeleton | Signature interaction (unique to this page) | Atomic data unit | Output rendering | Distinctive empty / blocked state |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Contract Review Copilot — `/tools/contract-review` | Two-pane: contract text │ risk findings | Risk-level filter that dims non-matching spans in the contract pane | Clause span | Risk-tagged clause cards with quotes | NEEDS_INPUT: "Paste at least 200 characters of contract text" |
| 2 | IaC Security Copilot — `/tools/iac-security` | Code viewer + finding matrix + verification drawer | Click a finding → jump to the exact line; drawer shows read-only verification commands (never executed) | Resource / line | Severity × resource matrix | NEEDS_INPUT: "Paste Terraform/CloudFormation/K8s config" |
| 3 | M&A Due-Diligence Workbench — `/tools/ma-diligence` | Workstream kanban + thesis evidence ledger | Workstream column collapse with per-column completeness meter | Diligence item | Findings grouped by workstream with open questions | INCOMPLETE_SOURCE_SET: lists which workstream documents are missing |
| 4 | Incident Learning & Post-Mortem — `/tools/incident-postmortem` | Timeline scrubber + impact cards + causal lanes | Draggable time scrubber that filters events and impact cards to a window | Timeline event | Contributing-factor lanes (no blame language) | NEEDS_INPUT: "Add at least two timestamped events" |
| 5 | GRC Evidence Request Triage — `/tools/grc-evidence` | Kanban columns: new → mapped → assigned → ready | Drag a request between columns; control mapping and owner set inline | Evidence request | Request cards with control IDs and owners | NEEDS_INPUT: "Paste the auditor's request list" |
| 6 | Reconciliation Copilot — `/tools/reconciliation` | Three lanes: exact │ ambiguous │ unmatched + balance footer | Lane totals that must reconcile; ambiguous items require a human choice, never auto-matched | Transaction pair | Match lanes with variance footer | NEEDS_INPUT: "Provide both ledger and bank/PSP lines" |
| 7 | Enterprise RFP Response Copilot — `/tools/enterprise-rfp` | Requirement × claim matrix with readiness meter | Per-requirement readiness toggle (supported / partial / gap) recomputing the readiness meter | Requirement | Matrix rows with claim source and status | NEEDS_INPUT: "Paste requirement list" |
| 8 | GovCon RFP Compliance Workbench — `/tools/govcon-rfp` | Section tree (L/M/C) + source-coordinate viewer + amendment conflict panel | Amendment overlay that shows conflicting instructions between base solicitation and amendments | Solicitation section | Compliance matrix with page/§ coordinates | INCOMPLETE_SOURCE_SET: "Amendments referenced but not supplied" |
| 9 | FP&A Monthly Variance Analysis — `/tools/fpa-variance` | Variance dashboard with waterfall ⇄ table toggle | Waterfall bar click drills into the driver evidence for that bridge segment | Variance line | Bridge chart + variance table with drivers | NEEDS_INPUT: "Provide actuals and budget for the same period" |
| 10 | Executive Flash Brief — `/tools/executive-flash` | KPI threshold cards feeding a brief composer canvas | Threshold editor: only KPIs breaching a user-set threshold enter the brief | KPI | Draft brief with per-line KPI reference and draft banner | NEEDS_INPUT: "No KPI values supplied" |
| 11 | Commercial Lease Abstraction — `/tools/lease-abstraction` | Abstraction sheet grid with source quote anchors | Term row → source quote anchor popover; missing terms flagged rather than inferred | Lease term | Term sheet with quote per term, gaps marked MISSING | NEEDS_INPUT: "Paste lease text" |
| 12 | SEO Content Opportunity Planner — `/tools/seo-planner` | Cluster canvas + data-sufficiency banner + calendar grid | Cluster bubble sizing tied to supplied data volume; banner states when the data is too thin to plan | Topic / cluster | Cluster map + calendar rows | INCOMPLETE_SOURCE_SET: "Keyword data insufficient for prioritisation" |
| 13 | Evidence-Backed PRD Generator — `/tools/evidence-backed-prd` | Traceability board: research ↔ requirement links + engineering review queue | Every requirement must trace to a research item or it renders as UNSUPPORTED | Requirement | PRD sections with traceability column | CONDITIONAL banner: business/analytics/engineering inputs still required |
| 14 | Customer Health & Churn Copilot — `/tools/customer-health` | Portfolio triage grid + signal cards + intervention plan builder | Model-mode banner (rules-based vs model-based) that changes how signals are labelled | Account | Account triage list with signals and suggested interventions | NEEDS_INPUT: "No account usage/support signals supplied" |
| 15 | A/B Experiment Interpretation — `/tools/ab-experiment` | Result console: validity checklist │ guardrails │ decision gate | Validity checklist that hard-blocks the decision gate when a check fails (e.g. SRM) | Metric / variant | Metric table with intervals and validity verdict | BLOCKED: "Sample ratio mismatch — result cannot be interpreted" |

## 2. Parent/child differentiation (suite vs its child workflow)

Where a workflow shares a domain with its parent suite, the two pages differ by **scope object**, not by copy:

| Pair | Suite page works on | Workflow page works on |
| --- | --- | --- |
| Legal Contract Suite ↔ Contract Review Copilot | a transaction: many documents, playbook set, counsel escalation queue | one contract: clause-level risk pass |
| Legal Contract Suite ↔ Lease Abstraction | transaction document set | one lease: fixed term-sheet grid |
| Security Suite ↔ IaC Security Copilot | estate-wide findings, controls, access | one plan/config file with line anchors |
| Marketing & Sales Suite ↔ Enterprise RFP / SEO / PRD | claims registry across the org | one RFP / one keyword set / one PRD |
| Finance Close Suite ↔ Reconciliation / Executive Flash | a whole close period | one reconciliation set / one brief |
| Investment Suite ↔ M&A Workbench | multi-workstream data room | one diligence workstream board |
| Support Suite ↔ Customer Health | live ticket queue | account portfolio snapshot |
| Pricing Suite ↔ A/B Experiment | pricing/packaging scenarios | one experiment readout |
| Ops & Procurement ↔ GovCon RFP | supplier portfolio and dependencies | one solicitation compliance matrix |
| Regulatory Suite ↔ GRC Evidence Triage | obligation register across jurisdictions | one auditor evidence request batch |
| Mixed Quick-Win ↔ Incident Post-Mortem | module authority selector | one incident timeline |

## 3. Enforcement

- Manifest field `experiencePattern` is required, non-empty and **unique across all 36** (build-time check).
- Manifest field `layoutComponent` names a real component file; a unit test asserts the file exists and that
  no two entries name the same component.
- E2E: for each of the 36 routes, the test asserts the presence of that page's signature element
  (test id `pattern-<slug>`), so a page that silently falls back to a generic renderer fails CI.
