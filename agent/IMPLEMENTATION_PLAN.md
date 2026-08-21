# KONKRED — IMPLEMENTATION PLAN (agent/konkred-platform-v1 → session branch)

Mission: turn the repo into a clean, production-quality, data-driven AI workflow
marketplace/product platform: purge all mock/demo features, preserve the three flagship
features (Audit, REDAEYE, fullKONK_>), and ship a shared, manifest-driven catalogue of
the 15 canonical KONKRED products with honest status labels, safe demos, and
test-mode monetization CTAs.

Branches: work + PR from `arena/01a0246b-konkred-template2` against `main`
(the brief's `agent/konkred-platform-v1` is mapped to this session branch — see `REPOSITORY_AUDIT.md §1`).

---

## 0. KEY DECISIONS (from audit; deviations from the brief are documented)

- Source-of-truth files listed in the brief do not exist in the repo or on GitHub →
  the brief's own requirements + the existing working code are the specification.
- `agent/PRODUCT_MANIFEST.json` is the canonical 15-product manifest. The runtime imports a
  byte-identical copy at `catalog/product-manifest.json` (a test asserts equality).
- Product statuses use only `PUBLIC_DEMO | STANDARD_KIT | SUPERVISED_PILOT | ENTERPRISE_INTEGRATION`.
  Validation reports do not exist yet → every product's validation field is `pending`
  with an honest note; no fake scores, ratings, sales, certifications, or ROI anywhere.
- Payment/CRM credentials are not configured → all purchase/inquiry flows are **lead forms
  in test mode**, with explicit TEST-MODE notices and honest success/failure states.
- Public demos run against synthetic, clearly-labelled public sample fixtures only, are
  flagged `DEMO` / `NOT_FOR_PRODUCTION_DECISION`, are gated by a server-side feature flag,
  and every model response passes JSON schema validation before rendering.

---

## 1. FILE MAP (new/modified)

### New
- `agent/REPOSITORY_AUDIT.md` — this audit (Stage 0).
- `agent/IMPLEMENTATION_PLAN.md` — this file.
- `agent/PRODUCT_MANIFEST.json` — canonical 15-product manifest (validated by tests).
- `catalog/product-manifest.json` — byte-identical runtime copy.
- `catalog/fixtures/` — small public sample fixtures (JSON/CSV, synthetic, documented).
- `catalog/fixtures/README.md` — provenance/usage notes for fixtures.
- `src/catalog/types.ts` — `ProductRecord`, enums, JSON-schema helpers.
- `src/catalog/validate.ts` — manifest + schema validators (shared by app, API, tests).
- `src/catalog/products.ts` — manifest loading + lookup helpers (bySlug, categories, statuses).
- `src/catalog/prompts.ts` — canonical per-product system prompts (v1, referenced by slug).
- `src/pages/CataloguePage.tsx` — searchable/filterable 15-product catalogue.
- `src/pages/ProductDetailPage.tsx` — shared product-detail template.
- `src/pages/AuditPage.tsx` — audit-only page (wraps `AuditTool`; no Forge tabs).
- `src/pages/NotFoundPage.tsx` — 404.
- `src/components/catalog/ProductCard.tsx` — shared card.
- `src/components/catalog/StatusBadge.tsx`, `RiskBadge.tsx` — honest status/risk labels.
- `src/components/catalog/ProductInquiryModal.tsx` — test-mode lead forms (Workflow Kit /
  Validation Sprint / Enterprise Pilot / All-Catalog Workspace).
- `src/components/catalog/ProductDemo.tsx` — fixture-backed demo runner w/ DEMO banner.
- `src/services/demoService.ts` — client side of `/api/demo/:slug` (server-side AI, schema-validated).
- `src/server/routes/demo.ts`-ish: added inside `server.ts` — `POST /api/demo/run` + `GET /api/demo/fixtures/:slug`.
- `src/config/site.ts` — minimal honest site config (replaces `data.ts` APP_DATA).
- `tests/` (vitest) + `vitest.config.ts`; `tests/playwright/` smoke E2E (if runnable).
- `CHANGELOG.md` — release notes (Stage 8).

### Modified
- `App.tsx`, `utils/routes.ts`, `types.ts` — route map: add `/products`, `/products/:slug`,
  `/audit` alias, 404; redirects for purged routes; remove marketplace wiring.
- `index.html` — title/description ("AI Workflow Marketplace & Product Platform", no fake claims).
- `components/Navbar.tsx` — nav: Home / Products / fullKONK / REDAEYE / Audit / Docs / Contact.
- `components/SystemFooter.tsx` — remove fake counters.
- `components/KonkredSections.tsx` — remove `SYSTEM_TOOLS`/`ToolLibrarySection`; keep
  PremiumServices/DynamicBlog/Contact sections (strip fake claims).
- `pages/LandingPage.tsx` — fix AUDITOR → `/forge-audit`, fullKONK → `/fullkonk`,
  hero CTA → `/products`; remove LIVE/bug-free/deploy-ready/exploit-vector/counter claims;
  products section becomes "15 Workflow Products" linking to catalogue.
- `services/ai.ts` — keep `runAudit`; remove marketplace-only helpers.
- `server.ts` — add demo endpoints (server-side, gated, schema-validated, redacted).
- `package.json` — add `test` (vitest), `test:e2e` (playwright), typecheck script.
- `.gitignore` — add playwright artifacts if needed.

### Deleted (purged)
- `data.ts`, `services/payments.ts`, `services/gemini.ts`, `lib/enterpriseTools.ts`
- Pages: `MarketplacePage`, `ListingPage`, `ListingWizard`, `CheckoutPage`, `WalletPage`,
  `SellerDashboard`, `BuyerDashboard`, `UsageDashboard`, `AffiliatePage`, `DisputePage`,
  `AdminPage`, `KToolsPage`, `ForgePage`, `PricingPage`, `PlaygroundsPage`, `IntelReportPage`, `RedaeyePage` (unused iframe wrapper).
- Components: `marketplace/*`, `seller/*`, `buyer/*`, `forge/*` except `AuditTool` (moved to
  `components/audit/AuditTool.tsx`), `ProtocolCard`, `ProtocolDetails`, `Protocols`, `Tools`,
  `ToolCard`, `ValuationTerminal`, `AcquirersList`, `DemoView`, `About`, `GetAccess`,
  `NetworkJoinLoadingScreen`, `Footer`, `landing/*` unused set, `AppTester`,
  `AcquisitionSuccessModal`, `UpgradePromptModal`, modals used only by marketplace.
- `contexts/ModalContext.tsx` — strip marketplace modals (keep toast/modal plumbing).
- `constants.ts` — strip marketplace/listing constants (licenses, asset types, sort options,
  trust points, how-it-works); keep brand + AI provider config used by account pages.

---

## 2. PHASES (one commit per stage)

1. **Stage 1 — Purge** (`feat(purge): remove mock marketplace, forge fakes, K-Tools and fake claims`)
   - Delete purge targets; keep build green; fix AUDITOR/fullKONK route targets; add redirects.
2. **Stage 2 — Shared platform** (`feat(catalog): shared product manifest, catalogue, card and detail pages`)
   - Manifest + validation + routes + search/filters/status labels + 404.
3. **Stage 3 — 15 products** (`feat(catalog): all 15 product records, fixtures and detail content`)
   - Complete manifest content: prompts, input/output schemas, fixtures, limitations, pricing, buyers, statuses.
4. **Stage 4 — Demo & AI layer** (`feat(demo): server-side demo provider with schema validation and provenance`)
   - `/api/demo/run`, fixture endpoints, feature flag, DEMO banners, NEEDS_INPUT/BLOCKED, REQUEST_PILOT.
5. **Stage 5 — Monetization** (`feat(monetization): test-mode workflow-kit/sprint/pilot lead forms`)
   - Inquiry modal, consent + privacy, honest success/failure, All-Catalog Workspace option.
6. **Stage 6 — Testing** (`test: manifest, routes, schema, no-secrets, no-fakes, forms, e2e`)
   - vitest suites + playwright smoke; wire `npm test` / `npm run typecheck`.
7. **Stage 7 — Preview & PR** — push, open PR vs `main`, run CI, review Vercel preview, attach checklist.
8. **Stage 8 — Handoff** — only after human approval: merge, smoke-test production, record SHA/URL,
   update `CHANGELOG.md`. (Not executed by the agent without approval.)

---

## 3. RISKS & MITIGATION

| Risk | Mitigation |
| :--- | :--- |
| Purge breaks imports/build | Each purge stage ends with `npm run lint && npm run build`; imports verified with `git grep` before deletion. |
| Removing shared `types.ts` fields breaks kept pages | Keep type surface used by kept pages; remove only marketplace-specific consumers. |
| Demo endpoint could leak keys | All AI calls server-side only; client never receives keys; redaction on error paths. |
| Fake-maturity creep | Tests assert manifest statuses ∈ enum, no `rating`/`salesCount`/`reviewCount` fields in catalogue records, no banned claims in new pages. |
| Firestore writes failing in preview | Lead forms report honest failure with "test mode / not configured" state. |
| Playwright unavailable in sandbox | vitest suites are the gating tests; E2E marked CI-only if browsers cannot install. |
| `lib/fullkonk-server.cjs` churn | Pre-existing tracked artifact; regenerated by build:vercel; reviewed in PR. |

**Rollback:** every stage is a separate commit; production deploy is only merged after human
approval; rollback = `git revert` of the merge commit (or redeploy previous `main` SHA) —
details recorded in the PR.

---

## 4. DEFINITION OF DONE (checked at the end)
- [ ] No mock marketplace/fake modules in source or production build.
- [ ] Audit, REDAEYE, fullKONK work; AUDITOR → audit-only page; fullKONK → `/fullkonk`.
- [ ] 15 products in catalogue, all with detail pages, accurate status labels, no fake social proof.
- [ ] Public demos use public fixtures or explicitly state unavailable; all demos show DEMO/NOT_FOR_PRODUCTION_DECISION.
- [ ] No secrets in GitHub or client bundles; lint, typecheck, unit tests, build, E2E pass.
- [ ] Vercel preview reviewed; PR contains file summary, test evidence, limitations, rollback plan.
- [ ] No merge/deploy without human approval.

---

## 5. EXECUTION STATUS (2026-08-21)

| Stage | Status | Notes |
| :--- | :--- | :--- |
| 0 Audit | ✅ | `agent/REPOSITORY_AUDIT.md` (commit `00d332a`) |
| 1 Purge | ✅ | commit `b508689` — mock marketplace/forge/K-Tools removed; audit/fullKONK route targets fixed; purged routes → 404/redirect |
| 2 Shared platform | ✅ | commit `211e068` — manifest-driven catalogue, card, detail template, search/filters/status labels |
| 3 15 products | ✅ | commit `211e068` — full manifest records + 11 public fixtures |
| 4 Demo & AI layer | ✅ | commit `1579d65` — server-side `/api/demo/run`, schema validation, feature flag, REQUEST_PILOT |
| 5 Monetization | ✅ | commit `1579d65` — test-mode lead forms + All-Catalog Workspace CTA |
| 6 Testing | ✅ | commit `3650825` — vitest 99/99 pass; Playwright 33 tests CI-ready (browser download blocked in sandbox) |
| 7 Preview & PR | ⏳ this step | push `arena/01a0246b-konkred-template2`, open PR vs `main`, await Vercel preview |
| 8 Production handoff | ⛔ blocked | only after human approval — agent never merges/deploys unilaterally |

**Baseline vs. current:** `npm ci` ✅ · `npm run lint` (tsc) ✅ · `npm run typecheck` ✅ ·
`npm test` (vitest) ✅ 99/99 · `npm run build` ✅ · `npm run build:vercel` ✅ ·
`npx playwright test` — 33 tests collected; browser binary download is blocked in this
sandbox (network-restricted CDN), suite runs in CI/Vercel environments.

---

## 6. UX REVISION (owner feedback, 2026-08-21)

Product pages converted from spec sheets into **sellable micro-tools**:
- Removed from the customer-facing UI: HUMAN_APPROVAL_REQUIRED banners, risk badges,
  full prompt text, input/output schema blocks, detailed limitation lists.
- Each of the 15 workflows now renders an **interactive micro-tool**: form fields
  generated from the product's input schema, "Load Sample Data" (synthetic public
  fixture), Run → schema-validated output.
- Prompts, schemas, limitations, risk and approval metadata remain in the manifest
  (backend/internal) and in the Workflow Kit — they are no longer displayed on
  public product pages.
- Added public synthetic fixtures for the remaining 4 products (M&A DD, RFP Response,
  GovCon, Lease Abstraction) so all 15 tools are loadable with sample data.
- Catalogue cards: removed risk/approval chips; renamed CTA to "Launch Tool".

---

# PART II — 36-ENTRY PORTFOLIO MISSION (started 2026-08-22)

New mission: expand the platform from 15 workflow products to the **full KONKRED portfolio of 36
separately discoverable entries** — 21 canonical ARB **suites** (`/suites/*`) and the 15 validated
**workflows** (`/tools/*`) as child products — each with a unique page, unique URL, unique UI/UX
interaction pattern, public validation evidence, honest monetization states and supervised execution.

Companion documents: `agent/DECISIONS.md`, `agent/BASELINE_TEST_RESULTS.md`, `agent/ROUTE_MATRIX.md`,
`agent/UIUX_MATRIX.md`, `agent/ACCEPTANCE_TESTS.md`.

## II.0 Blocking input — source-of-truth documents are not in the workspace

The brief lists nine document sets to be read before implementation. **None of them exist in this
sandbox or in the repository** (verified: `/home/user/uploads/` absent, whole-filesystem search returns
zero matches, GitHub code search returns zero hits). See `agent/DECISIONS.md#D-003`.

Consequence, and the rule this plan follows: **no suite content is invented.** Fields whose only source
is a missing document are emitted as `null` / `NOT_RUN` with `sourceStatus: "AWAITING_SOURCE_DOCUMENT"`,
and the UI renders an explicit "evidence not yet published" state instead of a number or a badge.
When the documents are supplied they are imported under `content/source/` and
`content/validation/{arb_merged_validation,konkred_validation}/`, the manifest is backfilled, and
`agent/SOURCE_IMPORT.md` records file → field provenance for every value.

## II.1 Stage table

| Stage | Scope | Status |
| :--- | :--- | :--- |
| II-0 Baseline audit | Fresh baseline at `724f729`; env, scripts, routes, flagships, API surface, env var names | ✅ `agent/BASELINE_TEST_RESULTS.md` |
| II-1 Plan & matrices | Decisions, route matrix (36 + legacy + platform), UI/UX differentiation matrix, acceptance tests | ✅ this commit |
| II-2 Manifest | `content/catalogue/portfolio-36.json` (36 entries) + typed loader + build-time validator (fails on duplicate id/slug/route, missing parent, missing validation link, controlled-pilot without approver, non-empty `autonomousActions`) | ⏳ |
| II-3 Purge re-verification | Re-run the no-fakes sweep against the enlarged surface; retire 15-product-era copy that becomes inaccurate at 36 entries; keep Audit / REDAEYE / fullKONK untouched | ⏳ |
| II-4 Shared platform | Design tokens + `ProductShell`, `EvidencePanel`, `SourceLedger`, `ValidationBadge`, `DesignScore`, `ApprovalGate`, `CtaRail`, `DemoRunner`; catalogue index with type/category/status filters; suite ⇄ workflow relationship display; loading/empty/error/mobile states | ⏳ |
| II-5 36 unique pages | 21 suite layouts + 15 workflow layouts, each with its own layout component and signature interaction per `agent/UIUX_MATRIX.md` | ⏳ |
| II-6 Demos & evidence | `DemoResponse` contract (`COMPLETE / NEEDS_INPUT / BLOCKED / INCOMPLETE_SOURCE_SET / NEEDS_EXTERNAL_VALIDATOR / ERROR`), stored reference outputs labelled as preflight, source/limitation panels | ⏳ |
| II-7 Commerce & analytics | `/pricing`, `/kits/:slug`, `/sprint`, `/enterprise`, `/partners`, `/validation`; provider abstraction in test mode; consent + honest states; 12 analytics events with a non-sensitive property allow-list | ⏳ |
| II-8 Tests | Extend vitest suites (portfolio, routes, demo contract, no-fakes, secrets) and the Playwright suite to all 36 routes | ⏳ |
| II-9 PR & preview | Push staged commits, update PR #13 with the full 14-section report, verify all 36 URLs on the Vercel Preview | ⏳ |
| II-10 Production | ⛔ blocked — requires explicit human approval; the agent never merges its own PR and never deploys production |

## II.2 Invariants carried forward from Part I

- Flagships preserved: Audit/AUDITOR/Neural Audit, REDAEYE, fullKONK_>.
- Purged routes return a real 404 or an intentional redirect — never a fake page.
- No fabricated ratings, sales, sellers, customers, certifications, ROI or accuracy claims.
- All model calls server-side; no key or secret in client code or bundles.
- Owner UX direction (2026-08-21) still binds: pages are sellable working tools, not spec sheets.
  Mandatory disclosures (approver, "what this tool does not do") are rendered as a compact, neutral,
  secondary panel below the tool — see `agent/DECISIONS.md#D-009`.
