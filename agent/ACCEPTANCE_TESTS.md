# KONKRED — Acceptance Tests (36-entry portfolio)

Each row is an executable check, its runner, and the file that owns it. "Status" is filled in as stages land;
no row may be marked PASS from reasoning — only from a command's output pasted into
`agent/IMPLEMENTATION_PLAN.md`.

## A. Manifest and data integrity — `tests/portfolio.test.ts` (vitest)

| ID | Assertion |
| --- | --- |
| A-01 | `content/catalogue/portfolio-36.json` contains exactly 36 entries |
| A-02 | Exactly 21 entries have `type: "SUITE"`, exactly 15 have `type: "WORKFLOW"` |
| A-03 | All 36 `id` values are unique and match the canonical IDs in `agent/ROUTE_MATRIX.md` |
| A-04 | All 36 `slug` values are unique |
| A-05 | All 36 `route` values are unique; SUITE routes start `/suites/`, WORKFLOW routes start `/tools/` |
| A-06 | Every WORKFLOW `parentId` resolves to an existing SUITE `id`; every SUITE has `parentId: null` |
| A-07 | `experiencePattern` is present, non-empty and unique across all 36 |
| A-08 | `layoutComponent` is present, unique, and the referenced file exists on disk |
| A-09 | `autonomousActions` is `[]` for all 36 entries |
| A-10 | `status` ∈ {PUBLIC_DEMO, WORKFLOW_KIT, PUBLIC_CATALOGUE_SUPERVISED, INTERNAL_CONTROLLED_PILOT, ENTERPRISE_INTEGRATION, CONDITIONAL_VALIDATION} |
| A-11 | Every `INTERNAL_CONTROLLED_PILOT` entry has a non-empty `humanApprover` |
| A-12 | Every entry has `buyer`, `humanApprover`, `inputSummary[]`, `outputSummary[]` non-empty |
| A-13 | Every entry has either a resolvable `validationReport` path **or** `validationStatus: "NOT_RUN"` with `sourceStatus` explaining why |
| A-14 | `staticDesignScore` is either `null` or an integer 0–100 sourced from an imported document (never generated) |
| A-15 | The Evidence-Backed PRD workflow has `status: "CONDITIONAL_VALIDATION"` until its missing inputs are supplied |
| A-16 | No entry contains fabricated commercial fields (rating, reviews, sales, customers, ROI, accuracy, certification) |
| A-17 | The 15 workflow records preserve their pre-migration `inputSchema`, `outputSchema` and fixture path byte-for-byte |
| A-18 | Manifest copies in `content/catalogue/` and `agent/PRODUCT_MANIFEST.json` are byte-identical |

## B. Routing — `tests/routes.test.ts` (vitest)

| ID | Assertion |
| --- | --- |
| B-01 | All 21 `/suites/*` paths resolve to the suite page with the right slug |
| B-02 | All 15 `/tools/*` paths resolve to the workflow page with the right slug |
| B-03 | `/catalogue` and `/products` resolve to the catalogue index |
| B-04 | Each legacy `/products/<old-slug>` redirects to its `/tools/<slug>` equivalent (15 rows) |
| B-05 | `/products/<unknown>`, `/tools/<unknown>`, `/suites/<unknown>` resolve to 404 |
| B-06 | `/forge-audit`, `/audit`, `/auditor` resolve to the audit page |
| B-07 | `/redaeye`, `/redaeye-sandbox`, `/redaeye_sandbox` resolve to REDAEYE |
| B-08 | `/fullkonk` resolves to fullKONK; `/forge` redirects to `/fullkonk` |
| B-09 | All purged routes (wallet, checkout, seller-dashboard, admin, dispute, …) resolve to 404 |
| B-10 | `/pricing`, `/kits/:slug`, `/sprint`, `/enterprise`, `/partners`, `/validation` resolve to real pages |

## C. Demo contract — `tests/demo-contract.test.ts` + `tests/api.test.ts` (vitest)

| ID | Assertion |
| --- | --- |
| C-01 | Every `/api/demo/run` response validates against the `DemoResponse` type (status, productId, runId, sourceRefs, result, validation{schema,provenance,safety}, limitations, actionsExecuted) |
| C-02 | `actionsExecuted` is always `[]` |
| C-03 | Missing required input → `NEEDS_INPUT` with field-level errors, never a fabricated result |
| C-04 | Malformed / schema-violating model output → `BLOCKED` and the output is discarded |
| C-05 | Missing source documents → `INCOMPLETE_SOURCE_SET` |
| C-06 | Entries requiring an external validator → `NEEDS_EXTERNAL_VALIDATOR` |
| C-07 | Unknown slug → HTTP 404 |
| C-08 | With no AI key configured, a public-demo entry returns the **stored reference output** flagged as preflight, never a claimed fresh run |
| C-09 | Controlled/high-impact entries return `REQUEST_CONTROLLED_PILOT` instead of self-serve execution |
| C-10 | Secrets in input text are redacted before any echo (`sk-…`, `AIza…`, `gh[pousr]_…`, PEM blocks, `password=`) |

## D. Honesty / no-fakes — `tests/no-fakes.test.ts` (vitest)

| ID | Assertion |
| --- | --- |
| D-01 | No source file renders seller, buyer, rating, review, sales-count, view-count or customer-logo data |
| D-02 | Banned unqualified claim strings absent from customer-facing components: "certified", "verified", "bug-free", "deploy-ready", "LIVE", "STABLE", "guaranteed", "100% accurate" |
| D-03 | Any rendered static design score is accompanied by "Static design target — not measured model performance" |
| D-04 | Any rendered PASS is accompanied by "Public-data preflight — narrow reference test" |
| D-05 | No component renders raw prompt text from the manifest |
| D-06 | No page exposes an autonomous action control (send / post / deploy / sign / pay / block / award) |
| D-07 | Fake payment success strings are absent; `checkout_success` is only emitted from a provider callback path |

## E. Secrets — `tests/secrets.test.ts` (vitest)

| ID | Assertion |
| --- | --- |
| E-01 | No API-key-shaped literal in tracked source (allow-list: `.env.example`, Firebase public web config) |
| E-02 | No `process.env.*_API_KEY` read in client-side code (`components/`, `pages/`, `catalog/`, `src/`) |
| E-03 | Built client bundle in `dist/assets/*.js` contains no key-shaped literal |

## F. E2E — `tests/e2e/portfolio.spec.ts` (Playwright, CI only in this sandbox)

| ID | Assertion |
| --- | --- |
| F-01 | Each of the 36 routes returns 200, renders its title and its `data-testid="pattern-<slug>"` signature element |
| F-02 | Catalogue lists 36 entries and links to all 36 routes |
| F-03 | Suite page links to its child workflows; workflow page links to its parent suite |
| F-04 | Audit, REDAEYE and fullKONK routes render their real tools |
| F-05 | 404 page renders for purged routes |
| F-06 | Mobile viewport (390×844): no horizontal scroll, primary CTA reachable on all 36 pages |
| F-07 | Accessibility basics: one `h1` per page, all form controls labelled, visible focus ring, main landmark present |
| F-08 | Lead forms show honest success/failure and never render payment success |

## G. Build / toolchain

| ID | Command | Expected |
| --- | --- | --- |
| G-01 | `npm ci` | exit 0 |
| G-02 | `npm run lint` | exit 0, 0 errors |
| G-03 | `npm run typecheck` | exit 0, 0 errors |
| G-04 | `npm test` | all vitest files pass |
| G-05 | `npm run build` | exit 0 |
| G-06 | `npm run build:vercel` | exit 0 |
| G-07 | `npx playwright test` | CI only — sandbox cannot download browsers |
