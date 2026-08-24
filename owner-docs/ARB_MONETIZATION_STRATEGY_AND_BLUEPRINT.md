# KONKRED ARB Portfolio — Monetization Strategy & Implementation Blueprint

**Date:** 21 August 2026  
**Portfolio:** 21 canonical ARB products, merged from 293 unique ARB IDs and 52 MKT modules  
**Validation status:** 21/21 deterministic public-data preflight tests passed  
**Commercial model:** services-led SaaS with workflow kits, validation sprints, managed delivery and enterprise licensing

---

## Executive decision

KONKRED should not monetize this portfolio as 345 separate prompt listings.

The sellable asset is:

> **A tested, source-linked and human-approved workflow for completing an expensive enterprise task.**

The prompt is only one layer. Customers pay for the complete operating workflow:

```text
Source ingestion
    ↓
Input and policy validation
    ↓
KONKRED workflow
    ↓
Evidence, calculation and schema validation
    ↓
Human review and approval
    ↓
Export, integration or managed delivery
```

### Recommended revenue sequence

```text
Free public-data demo
    ↓
Workflow Kit
    ↓
Paid Validation Sprint
    ↓
Fixed-price Pilot
    ↓
Managed Workflow Retainer
    ↓
Team / All-Catalog Workspace
    ↓
Enterprise connectors, private deployment and OEM licensing
    ↓
App/cloud marketplaces and benchmark licensing
```

The portfolio should be visible on the website now. Commercial sequencing determines which products receive the strongest sales effort; it does **not** remove the other products from the catalogue.

---

# 1. Commercial product architecture

## 1.1 Two release tiers

| Tier | Products | How to sell |
|---|---:|---|
| `PUBLIC_CATALOGUE_SUPERVISED` | 11 | Public demo, Workflow Kit, Validation Sprint, supervised pilot and workspace access |
| `INTERNAL_CONTROLLED_PILOT` | 10 | Public explanation and safety-gated demo, paid validation, domain-owner pilot and enterprise implementation; no autonomous claims or unrestricted self-serve execution |

### Internal controlled-pilot products

- Finance Risk, Crime & Credit Analytics
- Finance Tax, Revenue Recognition & Compliance
- Healthcare Revenue Cycle Review
- Clinical & Patient-Care Decision Support
- Clinical Trials & Life-Sciences Operations
- Healthcare Operations, Privacy & Compliance
- Fraud, Identity & Financial-Crime Triage
- Legal Regulatory, Privacy & AI Governance
- HR Hiring, Privacy & Onboarding
- Mixed Quick-Win Control Workflows

These remain monetizable. Their commercial label is **controlled workflow support**, not autonomous decisioning or certification.

## 1.2 What every paid SKU contains

Every product sale should include more than a prompt:

1. Versioned prompt and global runtime policy
2. Input contract and blocking conditions
3. Output contract and product-specific fields
4. Source/provenance rules
5. Deterministic validation requirements
6. Public test fixture and test result
7. Human approval and escalation design
8. Setup and permissions guide
9. Known limitations and non-goals
10. Version history and update policy
11. License terms
12. Support boundary and upgrade path

---

# 2. Product monetization matrix

The prices below are planning ranges, not guaranteed market prices or ROI claims. Final pricing should be adjusted after the first 10–20 qualified opportunities and after measuring delivery time, review burden, model/tool cost and customer acceptance.

| Canonical product | Primary buyer | First paid offer | Planning price | Expansion path | Tier |
|---|---|---|---:|---|---|
| Customer Support Control Suite | Support Ops / Customer Success | Support-control Validation Sprint | $2,500–$6,000 | Managed health, policy and escalation workspace | Public supervised |
| Finance Close, Reconciliation & Reporting | Controller / Accounting Ops | Close and reconciliation sprint | $3,500–$10,000 | Monthly close workspace and ERP/PSP connector | Public supervised |
| Finance Planning, Treasury & Liquidity | FP&A / Treasurer | Scenario and liquidity validation | $2,500–$7,500 | Planning workspace and recurring finance reviews | Public supervised |
| Finance AP/AR, Billing & Collections | AP/AR Manager / Controller | Exception-routing implementation sprint | $3,000–$9,000 | ERP, invoice and payment operations workspace | Public supervised |
| Finance Risk, Crime & Credit | CRO / Compliance / Credit Policy | Controlled model-governance validation | $5,000–$15,000 | Private risk review environment and monitoring | Internal controlled pilot |
| Finance Tax, Revenue Recognition & Compliance | Tax Director / Technical Accounting | Rule-pack and workpaper validation | $4,000–$12,000 | Versioned policy and evidence workspace | Internal controlled pilot |
| Investment & M&A Analytics | Deal Lead / Transaction Services | Diligence evidence-pack sprint | $4,000–$12,000 per engagement | Reusable data-room and portfolio workspace | Public supervised |
| Pricing & Monetization Science | Pricing / Product / Finance | Pricing experiment and scenario sprint | $3,000–$10,000 | Pricing analytics workspace and recurring reviews | Public supervised |
| Healthcare Revenue Cycle Review | RCM / Coding / Compliance | De-identified RCM validation sprint | $6,000–$20,000 | Governed RCM review service and private deployment | Internal controlled pilot |
| Clinical & Patient-Care Decision Support | Clinical Governance / Care Ops | Evidence and governance validation | $10,000–$30,000 | Private clinician-review environment | Internal controlled pilot |
| Clinical Trials & Life-Sciences Operations | Clinical Ops / Biostatistics / Regulatory | Trial-evidence workflow validation | $8,000–$25,000 | TMF, registry and statistical-review workspace | Internal controlled pilot |
| Healthcare Operations, Privacy & Compliance | Healthcare Privacy / Security / Ops | Privacy and evidence-readiness sprint | $6,000–$18,000 | Private GRC and operational evidence workspace | Internal controlled pilot |
| Fraud, Identity & Financial-Crime Triage | Fraud Ops / FCC / Identity Risk | Alert-evidence and governance sprint | $8,000–$25,000 | Private case-review and model-governance environment | Internal controlled pilot |
| Security Risk, Access & Data Integrity | Security / Data Owner / Service Owner | Read-only control and IaC review sprint | $3,000–$10,000 | Security workspace, scanner and ticket connector | Public supervised |
| Legal Contract & Transaction Review | Commercial Counsel / Legal Ops | Contract-playbook validation sprint | $3,000–$9,000 | CLM connector and legal review workspace | Public supervised |
| Legal Regulatory, Privacy & AI Governance | Legal / Compliance / Privacy | Jurisdiction/source-pack validation | $6,000–$20,000 | Private regulatory research and control workspace | Internal controlled pilot |
| HR Hiring, Privacy & Onboarding | HR / Employment Counsel / People Ops | Assistive HR process validation | $5,000–$15,000 | Governed HR workflow environment | Internal controlled pilot |
| Communications Control Suite | Communications / Security / Legal | Crisis and policy-communications sprint | $2,000–$6,000 | Managed communications review and measurement | Public supervised |
| Marketing & Sales Evidence Module Library | Marketing / Sales / Proposal Ops | RFP/claims/research workflow kit or sprint | $97–$5,000 | Claims registry, proposal and research workspace | Public supervised |
| Operations & Procurement Intelligence | Procurement / Supply Chain / S&OP | Requirement and supplier-evidence sprint | $3,000–$10,000 | Procurement and scenario workspace | Public supervised |
| Mixed Quick-Win Control Workflows | IT / Security / Finance / Ops | One-module control preflight | $2,000–$6,000 | Module-specific controlled pilot | Internal controlled pilot |

---

# 3. Offer ladder and pricing

## 3.1 Free public-data demo

**Price:** Free  
**Purpose:** Demonstrate evidence handling and capture a qualified lead.

Each demo should show:

- Public source used
- Source count or record count
- Structured result
- Source references
- A calculated value where applicable
- What the workflow could not establish
- Human approval requirement
- Link to the validation report
- CTA for a Validation Sprint

Every demo must be labelled:

> **PUBLIC DEMO — NOT FOR PRODUCTION DECISIONING**

## 3.2 KONKRED Workflow Kit

**Planning price:** $97–$297 per product  
**Bundle price:** $497–$1,497 per domain bundle

The buyer receives:

- Prompt and runtime policy
- Input/output contracts
- Product-specific rules
- Validation checklist
- Public fixture
- Setup guide
- Sample rendered output
- Failure-mode guide
- License and update policy

Do not sell kits for sensitive workflows as if the buyer can safely deploy them without policy, privacy and domain review. For internal controlled-pilot products, use a **Request Controlled Validation** CTA instead of unrestricted instant delivery.

## 3.3 Validation Sprint

**Planning price:** $2,500–$10,000 depending on risk and connector scope  
**Duration:** 7–15 business days  
**Scope:** One workflow, one representative sample, one named owner and one success definition.

### Deliverables

- Current-state process map
- Source and data-quality assessment
- Configured prompt/schema package
- Customer-specific policy mapping
- Deterministic validator plan
- Test results and exception log
- Human-review checklist
- Privacy/security boundary
- Measured baseline and time-cost estimate
- Pilot proposal and fixed scope

### Sprint success criteria

- Source coverage measured
- Critical missing-input fixtures stop correctly
- Unsupported-claim rate recorded
- Human acceptance/rejection recorded
- Correction time measured
- Integration requirements documented
- Customer owner signs the acceptance report

The sprint is the primary conversion product because it is easier to approve than a large software contract and creates the evidence required for a recurring subscription.

## 3.4 Fixed-price Pilot

**Planning price:** $6,000–$25,000  
**Duration:** 30–60 days

Includes:

- One private workflow
- One or two connectors
- Controlled customer data
- Reviewer queue
- Run history
- Approval records
- Schema/provenance validation
- Weekly review meeting
- End-of-pilot evaluation

The pilot must define what is **not** included: autonomous action execution, unlimited connectors, legal/clinical certification, custom model training or production SLA unless separately contracted.

## 3.5 Managed Workflow Service

**Planning price:** $1,500–$15,000/month

KONKRED performs the recurring work with human review. Examples:

- Monthly close/reconciliation exception pack
- Weekly RFP compliance matrix
- Monthly contract-risk register
- GRC evidence request queue
- Per-incident postmortem package
- Quarterly pricing/market research review
- Controlled RCM documentation review

Pricing should include review time, source processing, storage, model/tool costs and support. Do not price only on tokens.

## 3.6 Team Workspace

| Plan | Planning price | Intended customer |
|---|---:|---|
| Explorer | Free | Public demos and validation reports |
| Analyst | $79–$199/month | Individual consultant or analyst |
| Team | $599–$2,500/month | 5–25 users, selected suites |
| All-Catalog | $1,499–$4,000/month | All 21 products, usage limits and shared history |
| Enterprise | Custom annual | SSO, private connectors, governance, retention and support |

Do not promise unlimited usage. Meter by runs, pages, evidence items, connector calls, storage and reviewer seats.

## 3.7 Enterprise and OEM

**Planning price:** $20,000–$75,000 setup plus $3,000–$15,000/month

Components:

- SSO/RBAC
- Private deployment or private tenant
- Customer-specific policy packs
- Connector configuration
- Audit log and retention controls
- Security review support
- SLA and support tier
- Usage reporting
- Version/change management
- Training and enablement

### White-label partner pricing

- Setup: $10,000–$30,000
- Platform minimum: $2,000–$8,000/month
- Per-client workspace: $250–$2,000/month
- Annual minimum: $25,000–$100,000

Best partners:

- vCISO and GRC consultancies
- Accounting and finance-advisory firms
- Proposal and GovCon consultants
- Legal-ops consultancies
- Healthcare RCM firms
- Procurement consultancies
- Atlassian and cloud implementation partners

---

# 4. Commercial sequencing

The website catalogue should show all 21 products. Sales effort should begin with workflows that have:

- A bounded task
- A visible buyer
- Public evidence
- Measurable review time
- Low integration complexity
- No need to claim autonomous decisioning

## Beachhead group A — first revenue

1. Finance Close, Reconciliation & Reporting
2. Security Risk, Access & Data Integrity
3. Legal Contract & Transaction Review
4. Operations & Procurement Intelligence
5. Marketing & Sales Evidence Module Library, especially RFP/security-response modules
6. Communications Control
7. Customer Support Control
8. Finance AP/AR Operations

## Group B — higher-value supervised pilots

- Finance Planning, Treasury & Liquidity
- Investment & M&A Analytics
- Pricing & Monetization Science
- Finance Tax, Revenue Recognition & Compliance

## Group C — controlled regulated pilots

- Healthcare Revenue Cycle
- Clinical Decision Support
- Clinical Trials & Life Sciences
- Healthcare Operations & Compliance
- Fraud/Identity/Financial Crime
- Legal Regulatory/Privacy/AI Governance
- HR Hiring/Privacy/Onboarding
- Mixed Quick-Win Workflows

Group C is not “not monetizable.” It requires higher pricing, stronger domain owners and longer validation cycles.

---

# 5. Website monetization blueprint

## 5.1 Required navigation

```text
Products
  /products
  /products/[slug]
  /demos
  /validation
Pricing
  /pricing
  /kits/[slug]
  /sprint
Workspace
  /workspace
Enterprise
  /enterprise
Partners
  /partners
Resources
  /docs
  /benchmarks
Preserved flagship features
  /audit
  /redaeye
  /fullkonk
```

The old fake marketplace, fake seller pages, fake wallet/checkout metrics and mock K-Tools must not remain in the source or production build.

## 5.2 Homepage structure

### Hero

> **Turn expensive enterprise review work into a source-linked workflow.**

> KONKRED turns contracts, RFPs, finance data, incidents, controls and operational records into structured work your team can validate, review and approve.

Primary CTA: `Run a public demo`  
Secondary CTA: `Book a Validation Sprint`

### Trust strip

> Public-data tested · Source-linked outputs · Human approval gates · Versioned workflows · No autonomous signing, posting or deployment

### Catalogue

Show all 21 products in a searchable grid. Each card displays:

- Buyer
- Domain
- Input type
- Output type
- Status tier
- Static design score label, clearly marked as design score
- Public validation status
- Human approver
- `View demo`
- `View validation`
- `Buy Kit` or `Request Controlled Pilot`

### Proof section

Use real validation facts:

- 21 canonical products
- 293 legacy ARB IDs consolidated
- 52 MKT modules consolidated
- 21/21 public-data preflight passes
- 0 external actions in validation
- Source limitations shown on every product

Do not display fake sales counts, ratings, reviews, “verified” sellers or synthetic audit scores.

## 5.3 Product page template

1. Product name and buyer
2. Problem and current manual workflow
3. What the workflow accepts
4. What it returns
5. Public validation fixture
6. Source/evidence panel
7. Human approval requirement
8. “What it does not do” box
9. Static design target and qualification
10. Price or pilot starting range
11. `Run Demo`, `Buy Kit`, `Book Sprint` or `Request Controlled Pilot`
12. Security/privacy notes
13. Version and update date

## 5.4 CTA routing rules

| Product tier | Primary CTA | Secondary CTA |
|---|---|---|
| Public supervised | Run Demo / Buy Kit | Book Sprint |
| Internal controlled pilot | View Public Test / Request Validation | Enterprise Pilot |
| All products | View Validation Report | All-Catalog Workspace |

Never route a product CTA to an unimplemented checkout or a fake marketplace listing. If payment is not configured, use a real lead form and label it `Request Access`.

---

# 6. Checkout and fulfilment blueprint

## 6.1 Provider abstraction

Use a provider interface so the website is not locked to one service:

```ts
interface CommerceProvider {
  createKitCheckout(input: {
    productId: string;
    customerEmail: string;
    mode: 'test' | 'live';
  }): Promise<{ url: string; checkoutId: string }>;

  createSprintCheckout(input: {
    productId: string;
    scope: string;
    customerEmail: string;
    mode: 'test' | 'live';
  }): Promise<{ url: string; checkoutId: string }>;
}
```

Keep provider keys server-side. Use test-mode checkout for previews. Do not mark a purchase flow live until payment, fulfilment, refund and webhook handling have been tested.

## 6.2 Fulfilment

After a Workflow Kit purchase:

1. Verify payment webhook
2. Create customer/license record
3. Send gated download or workspace invite
4. Record product version
5. Display setup guide
6. Offer a Sprint upgrade
7. Record consent and support boundary

After a Sprint request:

1. Capture workflow, buyer role and sample type
2. Capture data sensitivity and prohibited data
3. Collect payment/deposit or schedule a qualified call
4. Create CRM opportunity
5. Send scope and acceptance criteria
6. Assign human owner

## 6.3 Required data model

```ts
type Product = {
  id: string;
  slug: string;
  title: string;
  tier: 'PUBLIC_CATALOGUE_SUPERVISED' | 'INTERNAL_CONTROLLED_PILOT';
  buyer: string;
  modules: string[];
  kitPriceUsd?: number;
  sprintFromUsd: number;
  publicDemo: boolean;
  validationStatus: 'PASS' | 'CONDITIONAL' | 'NOT_RUN';
  staticDesignScore: number;
  humanApprover: string;
  autonomousActions: [];
  validationReport: string;
  version: string;
};
```

## 6.4 CRM pipeline

```text
Demo started
  → Demo completed
  → Email captured
  → Sprint qualified
  → Sprint paid
  → Pilot proposed
  → Pilot paid
  → Workspace active
  → Expansion / partner referral
```

Capture the product slug, source channel, buyer role, company size, data sensitivity, estimated run volume, connector needs and reason for purchase.

---

# 7. Distribution and acquisition

## 7.1 Direct founder-led sales

Start with permission-based outreach and demonstrations, not mass cold automation.

### Finance

- Controller and accounting-operations communities
- Finance-advisory firms
- ERP and accounting implementation partners
- Month-end close consultants

### Security/GRC

- vCISO firms
- SOC 2 consultants
- Cloud/security consultancies
- DevSecOps and incident-management communities

### Legal and RFP

- Legal-ops consultants
- APMP/proposal communities
- GovCon capture consultants
- CLM implementation partners

### Operations

- Procurement consultants
- Supply-chain advisory firms
- ERP/S&OP integrators

### Controlled regulated workflows

- Domain-specialist partners only
- Named human reviewer in every pilot
- No promise of legal, clinical, employment or financial-crime automation

## 7.2 Distribution marketplaces

Use external platforms primarily for discovery, procurement and partner reach:

| Channel | Use now | Monetization role |
|---|---|---|
| KONKRED direct site | Yes | Own customer, pricing and recurring revenue |
| Gumroad/Lemon Squeezy | Yes, for kits | Fast digital fulfilment and secondary checkout |
| PromptBase | Selected entry kits | Discovery, not enterprise core |
| SKILL.md/agent directories | Free/limited skills | Lead generation and ecosystem reach |
| GPT/Poe bots | Narrow discovery tools | Usage and awareness experiments |
| Hugging Face | Public demos/evals | Research visibility and lead generation |
| MCP servers | Read-only tools first | Developer/API monetization later |
| Atlassian Marketplace | After Jira/Confluence adapter | Native workflow distribution |
| Shopify App Store | Later, for support/returns | Retail-specific app revenue |
| AWS/Google/Microsoft Marketplace | After SaaS proof | Enterprise procurement and private offers |
| Benchmark/evaluation licensing | Start preparing now | Long-term high-margin asset |

Do not build around uncertain platform payouts. Keep the primary customer relationship and billing on KONKRED.

## 7.3 Partner offer

Create a partner page with:

- Who the partner serves
- Which suites they can implement
- Demo environment
- Reseller margin
- Implementation playbook
- Support boundary
- Per-client workspace model
- Co-branded or white-label option

Do not call partners “certified” until KONKRED has a real curriculum, assessment and renewal process.

---

# 8. 30-day money-now plan

## Days 1–3: package the sale

- Publish the 21-product manifest
- Add every product page and correct status tier
- Select five beachhead products for the first sales campaign
- Create one-page Sprint scope and acceptance template
- Create kit licence and fulfilment policy
- Set up direct checkout or payment links in test mode

## Days 4–7: convert the website

- Replace fake marketplace language
- Add `Run Demo`, `Book Sprint`, `Request Controlled Pilot`
- Add validation reports and limitations
- Add lead capture and CRM events
- Add a real contact route
- Add pricing ranges

## Days 8–14: launch proof-led demos

Launch public demos for:

1. Finance Close/Reconciliation
2. Security Risk/Data Integrity
3. Legal Contract Review
4. Operations/Procurement
5. Marketing/RFP Evidence

Use the remaining 16 products as catalogue pages with validation links and safe request forms.

## Days 15–21: sell five sprints

Target:

- 10 finance/accounting prospects
- 10 security/GRC prospects
- 10 legal/RFP prospects
- 10 operations/procurement prospects

Offer a fixed-scope Sprint, not a free custom build.

## Days 22–30: convert the first pilot

Target operating outcomes:

- 5 paid Sprint proposals
- 2 paid Sprints closed
- 1 Pilot proposal
- 1 recurring-service proposal
- 1 partner conversation

These are internal execution targets, not guarantees.

---

# 9. 90-day operating plan

## Days 31–45 — Deliver and measure

- Deliver the first Sprints
- Measure current review time and KONKRED review time
- Record unsupported claims and missing-input failures
- Turn every failure into a regression fixture
- Gather a written customer acceptance statement

## Days 46–60 — Productize the repeatable work

- Build the most-requested connector
- Add reviewer queue and run history
- Convert the best Sprint into a fixed-price Pilot
- Publish one anonymized case study only with permission
- Add team workspace billing and seat/run limits

## Days 61–75 — Recurring revenue

- Convert successful pilots to monthly workspace or managed service
- Launch All-Catalog plan
- Add one partner implementation package
- Create a quarterly workflow review offer

## Days 76–90 — Expansion

- Add annual enterprise pricing
- Prepare one Atlassian, Shopify or cloud-marketplace adapter based on actual demand
- Package evaluation/benchmark licensing
- Create a partner referral process
- Review product-level gross contribution and retire only commercially weak packaging, not catalogue visibility

---

# 10. Metrics and unit economics

## Commercial funnel metrics

- Product-page view → demo start
- Demo completion rate
- Demo → Sprint lead
- Sprint lead → paid Sprint
- Sprint → Pilot
- Pilot → subscription
- Monthly recurring revenue
- Average contract value
- Gross contribution per customer
- Human review hours per delivered artifact
- Refund/chargeback rate
- Time to first value
- Expansion revenue

## Workflow-quality metrics

- Schema-valid output rate
- Source coverage
- Exact quote/reference fidelity
- Critical missing-input detection
- Unsupported-claim rate
- Human acceptance rate
- Correction time
- False-positive/false-negative rate where labels exist
- Approval turnaround
- Re-run/regression rate

Initial internal targets may include:

- 99%+ valid machine output after schema correction
- 100% critical missing-input stops on test fixtures
- 0 unsupported claims in approved external outputs
- Measured reduction in reviewer time on the customer’s workflow

These are internal targets, not public performance claims.

## Contribution formula

```text
Gross contribution
= customer revenue
− model/API cost
− retrieval/tool cost
− hosting/storage
− payment fees
− human review time
− support time
− refunds and chargebacks
```

For regulated workflows, price the reviewer and domain-owner time explicitly. The human gate is part of the product, not an overhead to hide.

## Illustrative monthly mix

| Revenue source | Example | Gross revenue |
|---|---|---:|
| Workflow Kits | 6 × $197 | $1,182 |
| Validation Sprints | 2 × $3,500 | $7,000 |
| Paid Pilot | 1 × $8,000 | $8,000 |
| Team Workspace | 2 × $1,250 | $2,500 |
| **Illustrative total** | | **$18,682** |

This is a planning scenario, not a forecast.

---

# 11. Trust, compliance and claim policy

KONKRED’s commercial advantage should be honest operational boundaries:

- Source references on material findings
- Visible missing inputs
- Versioned policies and prompts
- Named human approvers
- Public validation reports
- No fake social proof
- No unsupported ROI or accuracy claims
- No generic “certified” or “compliant” language

Avoid:

- “Autonomous digital employee”
- “100% accurate”
- “Certified compliance” without a real certification process
- “Ready to sign” or “ready to file”
- “Zero false positives”
- “Guaranteed savings”
- “AI will replace your reviewer”

Use:

> **Evidence-grounded workflow accelerator with source-linked outputs, deterministic validation and human approval.**

---

# 12. Repository-agent implementation checklist

Use this as the monetization work package for the GitHub/Vercel agent after the repository audit.

```text
MONETIZATION IMPLEMENTATION TASK

1. Inspect the existing repository before editing.
2. Preserve Audit, REDAEYE and fullKONK.
3. Remove application-owned fake marketplace data and fake counters.
4. Add the 21-product ARB manifest from canonical_manifest.json.
5. Build one shared catalogue and product-detail template.
6. Render all 21 product pages with correct tier/status labels.
7. Add public validation links and source limitations.
8. Add Run Demo, Buy Kit, Book Sprint and Request Controlled Pilot states.
9. Do not render fake checkout success, fake sales, fake ratings or fake enterprise customers.
10. Add a provider abstraction for payments and CRM; use test mode if live credentials are absent.
11. Keep keys server-side and do not commit secrets.
12. Add product-level analytics events without storing unnecessary sensitive data.
13. Add `/pricing`, `/sprint`, `/enterprise`, `/partners`, `/validation` and `/products/[slug]` routes.
14. Add schema tests for the product manifest and demo response.
15. Add E2E tests for all 21 product routes and all preserved flagship routes.
16. Open a branch and Pull Request; do not merge production.
17. Include exact test results, preview URL, changed files and rollback plan.
```

## Definition of done

- All 21 products are discoverable
- Product tiers are accurate
- Public demos are clearly labelled
- No fake/mock marketplace remains
- Payment and lead states are honest
- Test-mode and live-mode are separated
- Validation reports are linked
- High-impact products require controlled pilot requests
- Audit, REDAEYE and fullKONK remain functional
- CI and Vercel Preview pass
- Production merge remains a human decision

---

# Final blueprint

```text
21 canonical ARB products
        ↓
Public catalogue with truthful status
        ↓
Five proof-led beachhead demos
        ↓
$97–$297 Workflow Kits
        ↓
$2.5k–$10k Validation Sprints
        ↓
$6k–$25k fixed-price pilots
        ↓
$1.5k–$15k/month managed workflows
        ↓
$599–$4k/month team/all-catalog workspace
        ↓
$20k–$75k enterprise setup + recurring platform
        ↓
OEM, app marketplaces and benchmark licensing
```

**Immediate commercial priority:** monetize the complete catalogue, but sell the first revenue through Finance Close, Security/Data Integrity, Legal Contract Review, Operations/Procurement and Marketing/RFP evidence workflows. Use the controlled regulated suites for higher-value domain pilots, not low-price self-serve prompt downloads.

The durable asset is not a collection of instructions. It is a maintained, validated and accountable workflow product.
