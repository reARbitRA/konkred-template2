# KONKRED Platform v1 — Purge of mock marketplace, data-driven 15-product catalogue, honest demos & test-mode monetization

Closes the "konkred platform v1" mission. This PR turns `konkred-template2` from the legacy mock "AI Asset Marketplace" into a clean, production-quality, data-driven AI workflow marketplace and product platform.

> **Branch note:** the mission brief specified `agent/konkred-platform-v1`; this Arena session is fixed to `arena/01a0246b-konkred-template2` (documented in `agent/REPOSITORY_AUDIT.md §1`). All work lives on this branch; the PR targets `main`. **No production merge/deploy happens without human approval.**

## What changed

### 1. Summary of mock features removed
- **Hardcoded marketplace & fake sellers:** `data.ts` (`MOCK_LISTINGS`, fake sellers CyberSec Labs / Quantitative Logic Corp / Nexus Automation, fake prices, ratings, review counts, sales/view counts, fake audit scores `AUD-8841` etc.), `services/database.ts` mock fallbacks, `services/payments.ts` mock payment intents.
- **Mock commerce flows:** marketplace, listing detail, listing wizard, checkout, wallet, seller dashboard, buyer dashboard, usage metrics, affiliate, dispute, admin, pricing, playgrounds, intel-report pages + `marketplace/`, `seller/`, `buyer/`, `enclave/`, `modals/` component trees; `AppTester` fake metrics/cost calculator; `AcquisitionSuccessModal`.
- **Forge fakes:** removed all Forge tabs except the real Neural Audit — Prompt Refiner (`OptimizeTool`), Agent Architect (`AgentBuilder`), Market Intel (`EnterpriseArmory` + `services/gemini.ts` + `lib/enterpriseTools.ts` exampleData), Kernel Shell (`SystemTerminal`/`TerminalTool`, fake `v4.2.0-STABLE`), fake Doc Generator (`DocumentTool`), `GlobalMap`.
- **Fake K-Tools catalogue:** `KToolsPage` ("51 LIVE TOOLS") + the 51-tool `ToolLibrarySection` in `KonkredSections.tsx`.
- **Fake network/node/liquidity/ledger counters:** `ValuationTerminal`, `AcquirersList`, `Protocol*`, `Tools`/`ToolCard`, `useGlobalStats`, footer counters, unused landing components with fake stats.
- **Unsupported claims:** "LIVE", "STABLE", "verified/certified", "audit certificates", "bug-free, deploy-ready", "1M+ tokens/day", "400+ exploit vectors", "30+ LLM providers", fake invoice/card history in account Billing, fake doc statuses, blog view counts and marketplace-premium editorial claims.
- Purged routes now resolve to a **real 404 page** or an **intentional redirect** (see route table below). No fake page renders anywhere.

### 2. Summary of preserved features
- **Audit / AUDITOR / Neural Audit** — real `AuditTool` (moved to `components/audit/`) + server-side Gemini via `/api/ai/generate`, now on a **dedicated audit-only page** at `/forge-audit` (alias `/audit`) with **no unrelated Forge tabs**.
- **REDAEYE** — `/redaeye` preserved (React adversarial sandbox + static `public/redaeye.html`); `/redaeye-sandbox` kept private as the same component.
- **fullKONK_>** — `/fullkonk` + all `/api/fullkonk/*` server routes, orchestrator, provider failover, sessions/analytics, GitHub export untouched.
- Real auth (Firebase), contact form (now with honest storage success/failure), waitlist, account/settings pages.

### 3. Route fixes & all 15 product routes
- AUDITOR landing button → `/forge-audit` (was `/marketplace`) ✅
- fullKONK landing button → `/fullkonk` (was `/forge`) ✅
- `/forge` → redirects to `/fullkonk`; `/marketplace`, `/ktools`, `/pricing`, `/catalogue` → redirect to `/products`; `/wallet`, `/checkout`, `/enclave`, `/seller-dashboard`, `/listing/*`, etc. → 404.

All 15 canonical products have catalogue cards and detail pages under the **shared manifest-driven architecture** (one manifest, one catalogue, one card, one detail template — no per-product hardcoded pages):

| # | Slug | Category | Status |
|---|------|----------|--------|
| 1 | `contract-review-copilot` | Legal & Contracts | PUBLIC_DEMO |
| 2 | `iac-security-copilot` | Security & GRC | SUPERVISED_PILOT |
| 3 | `ma-due-diligence-workbench` | M&A & Transactions | ENTERPRISE_INTEGRATION |
| 4 | `incident-learning-postmortem` | Security & GRC | PUBLIC_DEMO |
| 5 | `grc-evidence-request-triage` | Security & GRC | STANDARD_KIT |
| 6 | `reconciliation-copilot` | Finance & Accounting | STANDARD_KIT |
| 7 | `rfp-response-copilot` | Sales & Business Development | SUPERVISED_PILOT |
| 8 | `govcon-rfp-compliance-workbench` | Sales & Business Development | SUPERVISED_PILOT |
| 9 | `fpa-variance-analysis` | Finance & Accounting | STANDARD_KIT |
| 10 | `executive-flash-brief` | Executive & Strategy | PUBLIC_DEMO |
| 11 | `commercial-lease-abstraction` | Legal & Contracts | STANDARD_KIT |
| 12 | `seo-content-opportunity-planner` | Marketing & Content | PUBLIC_DEMO |
| 13 | `evidence-backed-prd-generator` | Product & Engineering | PUBLIC_DEMO |
| 14 | `customer-health-churn-copilot` | Customer Success | SUPERVISED_PILOT |
| 15 | `ab-experiment-interpretation` | Data & Experimentation | PUBLIC_DEMO |

Every product: canonical prompt, input/output JSON schemas, buyer, pricing proposal, limitation statements, validation status (`pending` until a validation sprint), risk level, and **HUMAN_APPROVAL_REQUIRED** notices on all high-risk products. No product implies autonomous or production-equal maturity.

### 4. Changed files
157 files changed, +5,042 / −15,930. Highlights:
- **Deleted (~100 files):** all marketplace/seller/buyer/enclave/forge/modals/landing trees, `data.ts`, `services/payments.ts`, `services/gemini.ts`, `lib/enterpriseTools.ts`, 17 purged pages, unused hooks/components.
- **New:** `agent/REPOSITORY_AUDIT.md`, `agent/IMPLEMENTATION_PLAN.md`, `agent/PRODUCT_MANIFEST.json` (+ byte-identical `catalog/product-manifest.json`), `catalog/{types,validate,products,fixtures}.ts`, `catalog/fixtures/*` (11 synthetic public fixtures + README), `pages/{CataloguePage,ProductDetailPage,AuditPage,NotFoundPage}.tsx`, `components/catalog/*` (ProductCard, StatusBadge, RiskBadge, ProductDemo, ProductInquiryModal), `components/audit/AuditTool.tsx`, `services/demoService.ts`, `vitest.config.ts`, `playwright.config.ts`, `tests/*` (6 unit files + e2e).
- **Modified:** `App.tsx`, `utils/routes.ts`, `types.ts`, `constants.ts`, `Navbar`, `SystemFooter`, `LandingPage`, `KonkredSections`, `services/{ai,database}.ts`, `server.ts` (new `/api/demo/run`), `index.html`, `CommandPalette`, `DocumentationPage`, `AcademyPage`, `BlogHub`, `ResourcesPage`, `ConsultingPage`, `Billing`, `Notifications`, `SignupModal`, `RedaeyeSandbox` text, `package.json` (+vitest/playwright), `tsconfig.json`, `.gitignore`, `public/redaeye.html` (link fix).

### 5. Environment variables required (names only — never values)
`GEMINI_API_KEY` (required for live audit + demos), `ENABLE_PRODUCT_DEMOS` (demo feature flag), plus existing optional provider keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `XAI_API_KEY`, `CEREBRAS_API_KEY`, `SAMBANOVA_API_KEY`, `NVIDIA_API_KEY`, `HUGGINGFACE_API_KEY`, `GITHUB_TOKEN`, `QWEN_ACCESS_KEY_ID`, `QWEN_ACCESS_KEY_SECRET`, `TOGETHER_API_KEY`, `FIREWORKS_API_KEY`, `PERPLEXITY_API_KEY`), `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`, `SQL_HOST`/`SQL_USER`/`SQL_PASSWORD`/`SQL_DB_NAME`, `VITE_APP_NAME`, `VITE_API_URL`. All AI keys are **server-side only**; none appear in client bundles.

### 6. Test commands & exact results (local sandbox, commit `4e026c4`)
| Command | Result |
| :--- | :--- |
| `npm ci` | ✅ |
| `npm run lint` / `npm run typecheck` (`tsc --noEmit`) | ✅ 0 errors |
| `npm test` (vitest) | ✅ **99/99 passed** (6 files) |
| `npm run build` | ✅ |
| `npm run build:vercel` | ✅ |
| `npx playwright test` | ⚠️ 33 tests collected; **chromium download blocked in this sandbox** (network-restricted CDN) — suite is CI-ready and must run where browsers can be installed |

Coverage includes: 15 product slugs + detail routes, catalogue search/filters, manifest validation (statuses, uniqueness, no fabricated fields, manifest copy equality), demo input/output schema validation (NEEDS_INPUT / BLOCKED incl. nested enums), inquiry-form validation, no-secret leakage, no fake marketplace data, purged-route behavior, audit/redaeye/fullkonk routes, API health + demo gating + 404/error states, mobile overflow + accessibility basics (E2E).

### 7. Vercel Preview URL
**https://konkred-template2-kx81hrixe-ari-miyanjis-projects.vercel.app** (deployment `5471632`, state: success)

> Note: the Vercel account has **deployment protection** enabled — the preview URL requires
> Vercel login (the owner can view it; anonymous visitors are redirected to Vercel auth).

### 8. Known limitations
- Payment/CRM credentials are **not configured**: all purchase/booking CTAs are **test-mode lead forms** — nothing is charged, and the UI says so explicitly.
- Public demos are **gated** (`ENABLE_PRODUCT_DEMOS` + a server-side AI key). In previews without a key, demos return **REQUEST_PILOT** instead of simulating success.
- All 15 validation reports are **pending** — no accuracy/ROI claims are made anywhere.
- 4 products (M&A DD, RFP Response, GovCon, Lease Abstraction) have **no public fixture** and correctly state demos are unavailable (pilot entry).
- Playwright E2E could not execute in this sandbox (browser download blocked) — needs a CI environment.
- `lib/fullkonk-server.cjs` (pre-existing committed build artifact) is regenerated by `build:vercel` and may appear in the diff.
- Product kit prices are **proposals** pending human confirmation.

### 9. Rollback procedure
1. Each stage is an isolated commit (`00d332a` → `4e026c4`); the PR can be closed without merging with zero impact on `main`/production.
2. If a problem appears after merge: `git revert <merge-commit>` on `main` (or redeploy the previous production SHA in Vercel — instant rollback, no code change).
3. No data migrations were introduced; reverting restores the previous UI/routes fully.

### 10.1 UX revision — product pages are sellable micro-tools (owner feedback, 2026-08-21)

Per owner direction, the 15 product pages no longer display spec-sheet content:
- **Removed from the public UI:** HUMAN_APPROVAL_REQUIRED banners, risk badges, the
  written prompt, input/output schema blocks, and detailed limitation lists.
- **Added:** an interactive micro-tool on every product page — form fields generated
  from the product's input schema, "Load Sample Data" (synthetic public fixture),
  Run → schema-validated output, and friendly NEEDS_INPUT / REQUEST_PILOT / error states.
- Prompts, schemas, limitations, risk and approval metadata remain in the manifest
  (backend/internal) and are delivered as part of the Workflow Kit — they are no longer
  shown to customers.
- All 15 products now include a public synthetic sample fixture (4 new fixtures added:
  M&A DD, RFP Response, GovCon, Lease Abstraction) so every tool is loadable with sample data.
- Catalogue cards: removed risk/approval chips; CTA renamed to "Launch Tool".

### 10. Human decisions still required
1. Approve/merge this PR (agent will not merge itself).
2. Confirm proposed Workflow Kit / Validation Sprint / All-Catalog Workspace pricing.
3. Configure payment + CRM (Stripe/lead DB) to move CTAs out of test mode; set `ENABLE_PRODUCT_DEMOS=true` and `GEMINI_API_KEY` for live demos.
4. Approve product status labels (PUBLIC_DEMO / STANDARD_KIT / SUPERVISED_PILOT / ENTERPRISE_INTEGRATION) and the 15 canonical prompts.
5. Schedule validation sprints to replace `pending` validation reports.
6. Decide whether the 4 pilot-only products should receive public fixtures.

---

### Definition-of-done checklist
- [x] Old mock marketplace & fake modules gone from source and production build
- [x] Audit, REDAEYE, fullKONK work; AUDITOR → audit-only page; fullKONK → `/fullkonk`
- [x] 15 products in catalogue, all with detail pages, accurate status labels, no fake social proof
- [x] Public demos use public fixtures or explicitly state unavailable; demos show DEMO / NOT_FOR_PRODUCTION_DECISION
- [x] No secrets in GitHub or client bundles
- [x] Lint, typecheck, unit tests, build pass; E2E CI-ready
- [ ] Vercel Preview reviewed (pending CI)
- [ ] Human approval before merge/deploy (this step)
