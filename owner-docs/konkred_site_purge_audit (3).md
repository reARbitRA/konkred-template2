# KONKRED.XYZ Live-Site Mock-Feature Purge Audit

**Inspection date:** 20 August 2026  
**Site inspected:** https://konkred.xyz/  
**Source available:** Deployed Vercel HTML and JavaScript bundle only  
**Repository changed:** No — GitHub repository URL/access was not provided

## Executive finding

The deployed site contains a large amount of mock/demo marketplace and platform functionality. The landing page advertises four tools, but the JavaScript bundle contains:

- A hardcoded mock marketplace listing array with synthetic sellers, prices, ratings, sales counts, view counts, audit scores and dates.
- Mock marketplace, checkout, seller, buyer, wallet, usage, affiliate, dispute and admin flows.
- A large K-Tools catalogue containing example data and mock modules.
- A Forge page with several non-audit demo tools, including prompt refinement, agent architecture, market intelligence, terminal, document generation and finance/ERP examples.
- Fake-looking status/version/count language such as `STABLE`, `v4.2.0-stable`, `51 Filterable modules ready for deployment`, synthetic sales and rating figures.
- A Firebase SDK `mockUserToken` symbol in the shipped bundle. This appears to be library code; it must not be deleted blindly. Remove only application-level emulator/mock-auth usage after checking the source repository.

## Preserve

The requested surviving features are:

1. **Audit / AUDITOR / Neural Audit**
2. **REDAEYE**
3. **fullKONK_>**

Preserve the landing page shell, brand identity, legal pages and a real contact/support route only if they are actually backed by working functionality.

### Important route defects found

- The landing-page **AUDITOR** button currently calls `t("marketplace")`, which routes to the mock marketplace rather than the audit tool.
- The landing-page **fullKONK_>** button currently calls `t("forge")`, while a separate `/fullkonk` route exists. This should be changed to the actual `/fullkonk` route.
- Both `forge_audit` and `forge` currently render the same ForgePage component. The ForgePage contains multiple tools, not only audit. Create an audit-only page or an `initialTool="audit"` mode that hides every other tab.
- `/redaeye` and `/redaeye-sandbox` currently use the Redaeye sandbox implementation. Keep the intended Redaeye route and decide whether the sandbox alias should redirect to it or remain private.

---

# 1. Purge list

## Remove from production navigation and routing

Remove or redirect the following unless a route is required internally by one of the three preserved products:

```text
/marketplace
/listing/*
/checkout/*
/sell
/wizard
/playgrounds
/intel-report
/wallet
/enclave
/seller-dashboard
/account          # keep only if required for real preserved-product auth
/academy
/intel
/network
/advisory
/docs             # keep only if it contains real product documentation
/career
/resources
/ktools
/pricing          # replace with real KONKRED pricing if desired
/metrics
/affiliate
/admin
/dispute
/style-guide
/forge             # replace with fullKONK or remove
```

Keep or add:

```text
/
/audit or /forge-audit
/redaeye
/fullkonk
/contact          # only if connected to a real destination
/login            # only if needed by preserved products
```

If removing a route, return a proper 404 or redirect to `/`/`/audit`; do not leave a blank lazy-loading page.

## Remove mock data

Delete application-owned mock data equivalent to:

- `FT=[{id:"L1", ...}]` hardcoded marketplace listings.
- Synthetic sellers such as `CyberSec Labs`, `Quantitative Logic Corp`, `Nexus Automation` and `JurisAI Systems`.
- Fake fields: `salesCount`, `viewCount`, `rating`, `reviewCount`, `auditScore`, `auditReportId`, `featured`, `trending` and synthetic timestamps.
- Mock catalog entries such as `ent-01`, `ent-02`, `ent-03`, `ent-04`, `auto-*` and their `exampleData` values.
- Mock marketplace checkout/license/acquisition flows.
- Mock wallet balances, purchased-enclave lists and fake seller/buyer dashboards.
- Fake system health, node, network, liquidity and ledger counters.
- “51 Filterable modules ready for deployment” unless the number is generated from a real catalogue.
- Any “system status” or version number that is not generated from a real build/deployment source.

Do not delete Firebase/vendor-library internals merely because the minified bundle contains the string `mockUserToken`. First search the source repository for application use of:

```text
mockUserToken
connectAuthEmulator
useEmulator
MOCK_USER
mockUser
firebaseConfig demo project
```

Remove only application-level fake-auth initialization or demo-user creation.

---

# 2. Forge purge

The current ForgePage contains these tool tabs:

```text
Neural Audit
Prompt Refiner
Agent Architect
Market Intel
Kernel Shell
```

The app also contains an extensive enterprise/K-Tools module catalogue with mock reconciliation, ERP, CFO, autonomous-agent, reporting and example-data records.

## Keep

- Neural Audit
- Its actual `/api/ai/generate` or audit service integration, if it is real and tested
- Input validation, output schema validation and manual-review warning

## Remove

- Prompt Refiner
- Agent Architect
- Market Intel
- Kernel Shell
- Doc Generator
- K-Tools catalogue
- Example finance/ERP data
- “Autonomous agents” demo modules
- Mock audit score generation if it is not backed by a real evaluator

## Audit page requirement

Create an isolated component:

```text
AuditPage
├── source input
├── real audit request
├── structured result
├── evidence/limitations
├── manual review notice
└── no other tabs
```

The audit page must not claim AES-256, proprietary scoring, exportable certificates or “verified” results unless those capabilities exist and are validated in the source repository.

---

# 3. Landing-page replacement

Replace the current fake marketplace/product section with exactly three real feature cards:

## AUDITOR

- Route: `/audit` or `/forge-audit`
- CTA: `Open Auditor`
- Copy must describe the real audit workflow.
- Do not route to `/marketplace`.

## REDAEYE

- Route: `/redaeye`
- CTA: `Open Redaeye`
- Keep the sandbox only if it is intentionally part of the product.

## fullKONK_>

- Route: `/fullkonk`
- CTA: `Open fullKONK_>`
- Do not route the landing button to the generic Forge route.

Remove claims such as:

- “Four Tools. One Platform” if only three remain.
- “bug-free, deploy-ready”
- “7-formula scoring system (proprietary)” unless documented
- “Exportable audit certificates” unless generated by a real audit system
- “51 Filterable modules”
- Synthetic `LIVE`, sales or rating labels

---

# 4. Recommended source-level change plan

## Phase 1 — safety branch

```bash
git checkout -b purge-mock-features
```

Before editing:

```bash
npm ci
npm run lint
npm run typecheck || true
npm test || true
npm run build
```

Record the baseline in `docs/mock-feature-purge.md`.

## Phase 2 — remove mock data and routes

- Delete application-owned mock listing/catalog constants.
- Remove lazy imports for purged pages.
- Remove route-map entries for purged pages.
- Remove navigation links and command-palette entries.
- Remove footer links to purged features.
- Remove mock checkout, wallet, seller, buyer, affiliate, dispute and admin actions.
- Replace unavailable routes with 404 or a controlled redirect.

## Phase 3 — isolate preserved features

- Create `AuditPage` from the audit tab only.
- Change AUDITOR navigation to the audit route.
- Change fullKONK landing navigation to `/fullkonk`.
- Preserve Redaeye route and explicitly decide the sandbox behavior.
- Keep shared auth only if one of the preserved products uses a real backend.

## Phase 4 — test

Required checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test
```

Route tests:

- `/` returns 200
- `/audit` or `/forge-audit` returns 200
- `/redaeye` returns 200
- `/fullkonk` returns 200
- Every purged route returns 404 or an intentional redirect
- No mock listing names appear in rendered HTML or JavaScript
- No `exampleData`, `salesCount`, `viewCount`, `MOCK_USER` or application mock-auth code remains
- No checkout/wallet/seller/buyer UI remains unless explicitly real
- Audit, Redaeye and fullKONK smoke tests pass
- Vercel Preview is reviewed before merging to `main`

## Phase 5 — deploy

- Open a Pull Request.
- Review the Vercel Preview deployment.
- Confirm production route behavior after merge.
- Purge stale cached assets if the old JavaScript bundle continues to be served.
- Record the production commit SHA and deployment URL.

---

# 5. Agent instruction to perform the purge

```text
You are the KONKRED repository cleanup and release agent.

MISSION
Purge application-owned mock, fake, demo and placeholder marketplace/platform features from the KONKRED.XYZ repository. Preserve only the real landing shell and these three product surfaces:

1. Audit / AUDITOR / Neural Audit
2. REDAEYE
3. fullKONK_>

SOURCE OF TRUTH
- Inspect the repository source, not the deployed minified bundle alone.
- Compare source behavior against the live deployment at https://konkred.xyz.
- Do not assume a feature is real because it has a polished UI, price, rating, sales count, audit score or status label.

SAFETY
- Create branch purge-mock-features.
- Never edit or merge main directly.
- Do not delete Firebase/vendor library internals blindly.
- Remove application-owned mock data and fake flows.
- Preserve real audit, Redaeye and fullKONK functionality.
- Do not invent replacement backend functionality.
- If a preserved feature depends on a purged route, document and fix the dependency.

PURGE
- Hardcoded marketplace listings and fake sellers
- Synthetic ratings, reviews, sales, views, prices, timestamps and audit scores
- Mock catalog/exampleData modules
- Marketplace, listing, checkout, seller, buyer, wallet, usage, affiliate, admin and dispute flows
- K-Tools example module catalogue
- Forge tabs other than Neural Audit
- Fake network/node/liquidity/ledger status displays
- Fake system version/status claims
- Navigation and lazy imports for purged routes

PRESERVE
- Landing page
- Audit-only page
- REDAEYE
- fullKONK_>
- Real contact/support route if it has a real destination
- Real authentication only if required by the preserved products

ROUTE FIXES
- AUDITOR must route to the audit-only page, not marketplace.
- fullKONK_> must route to /fullkonk, not generic /forge.
- Redaeye sandbox must either redirect to /redaeye or be explicitly documented as a preserved Redaeye component.

DELIVERABLES
1. docs/mock-feature-purge.md
2. docs/preserved-features.md
3. updated routes/navigation
4. removed mock data/constants
5. audit-only component
6. route and bundle tests
7. updated product copy with no unsupported claims
8. Pull Request with changed-file summary, test results, Vercel Preview URL and rollback plan

DEFINITION OF DONE
- Audit, Redaeye and fullKONK routes work.
- Purged routes do not render fake screens.
- Mock marketplace listings and example catalog data are absent from the production build.
- No fake prices, ratings, sellers, sales counts or audit certificates appear.
- Build, lint, typecheck, unit and E2E tests pass.
- Vercel Preview is manually reviewed.
- The agent does not merge or deploy production without human approval.
```

---

## Conclusion

The live site can be cleaned, but I cannot push the purge to GitHub from the deployed URL alone. The repository URL or repository access is required to modify the source and trigger a real Vercel deployment.
