# KONKRED — REPOSITORY AUDIT

> Stage 0 audit. Written before any code changes. All facts below were verified in the
> checked-out repository at commit `585a61e564fcc8be53f2e58d2f61fe21363189bd`
> (branch `arena/01a0246b-konkred-template2`, based on `main`).

---

## 1. ASSUMPTIONS VS. ACTUAL VALUES

The mission brief assumed a set of values. The actual values in this checkout differ;
they were inspected rather than guessed:

| Assumption (brief) | Actual (verified) |
| :--- | :--- |
| Repository URL `{{GITHUB_REPOSITORY_URL}}` (placeholder, never filled) | `https://github.com/reARbitRA/konkred-template2` (this checkout). Repos `reARbitRA/konkred-template1`, `reARbitRA/KONKRED`, `reARbitRA/KONKRED-main--1-`, `reARbitRA/KONKRED-AUDIT` also exist; none contain the referenced spec files. |
| Source-of-truth files (`konkred_site_purge_audit.md`, `konkred_repo_agent_blueprint.md`, `merged_upgraded_prompts.md`, `konkred_validation/`, `konkred_monetization_strategy.md`, `enterprise_prompt_audit.md`, `PROMPTS.md`, `OPUSMADE.md`) | **Not present** in this repository, in any branch, or anywhere on GitHub (code search: 0 hits). The 15-product list, purge list, route fixes, statuses, and monetization requirements from the mission brief are therefore treated as the implementation specification, and the existing working code is treated as authoritative for preserving functionality. |
| Production website | `https://konkred.xyz` — reachable; currently serves the SPA titled **"KONKRED \| The AI Asset Marketplace"** with a boot/loading screen ("UPLINK: SECURENODE_ID: 0x1ACFB6OS_v2.5.0-PROD"). This confirms the live site is the old mock marketplace, which must be replaced. |
| Hosting | Vercel, connected to GitHub (verified via `vercel.json` + production deployment history). |
| Production branch | `main` (remote `refs/heads/main` at `585a61e…`). |
| Agent branch `agent/konkred-platform-v1` | **Not used.** This Arena session is fixed to branch `arena/01a0246b-konkred-template2`; per session constraints all work is committed to and pushed from `arena/01a0246b-konkred-template2`, and the Pull Request opens from that branch against `main`. No other branches are created or pushed. |
| Google AI Studio Build connected to GitHub | Cannot be verified from this sandbox; noted as unverified. No AI Studio-specific config exists in the repo (the app uses Gemini via `@google/genai` server-side). |
| Package manager | `npm` (committed `package-lock.json`; `bun.lock` also present but all scripts/CI use npm). Baseline used `npm ci`. |

---

## 2. FRAMEWORK & TOOLING (verified)

- **Language / build:** TypeScript (strict-ish, `tsc --noEmit`), Vite 6, React 19, `esbuild` for server bundling.
- **Runtime app:** React SPA + Express 5 server (`server.ts`).
- **Vercel:** `vercel.json` → build `npm run build:vercel` (vite build + esbuild bundle of `server.ts` into `lib/fullkonk-server.cjs`), output `dist`, function `api/index.ts` (serverless wrapper around the bundled Express app), rewrites all non-asset paths to `/index.html`, `/api/(.*)` to the function.
- **Server-side AI:** `@google/genai` + multi-provider HTTP proxies, all keys read from `process.env` **server-side only** (`/api/ai/generate`).
- **Database:** Firebase (client `firebase`, admin `firebase-admin`, Firestore) + optional PostgreSQL via Drizzle (`src/db/`), used for GitHub OAuth user sync.
- **Styling:** Tailwind loaded from CDN (`cdn.tailwindcss.com`) in `index.html` + custom CSS in `styles/globals.css`. No Tailwind build step.
- **Tests:** **None.** No `npm test`, no vitest/jest/playwright, no CI workflow files in the repo. `lint` = `tsc --noEmit`.
- **Env vars (names only, from `.env.example` + source):** `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `XAI_API_KEY`, `CEREBRAS_API_KEY`, `SAMBANOVA_API_KEY`, `NVIDIA_API_KEY`, `HUGGINGFACE_API_KEY`, `GITHUB_TOKEN`, `QWEN_ACCESS_KEY_ID`, `QWEN_ACCESS_KEY_SECRET`, `TOGETHER_API_KEY`, `FIREWORKS_API_KEY`, `PERPLEXITY_API_KEY`, `VITE_APP_NAME`, `VITE_API_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `VITE_TRUST_WALLET_USDT_TRON`, `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`.
- **Secrets:** No `.env` committed; `.env*` gitignored. `firebase-applet-config.json` contains a Firebase **web API key** (`AIzaSyDEW…`) — that is a public client config key (not a server secret); access control is enforced by `firestore.rules`, not by the key.

---

## 3. BASELINE BUILD / TEST RESULTS (before any change)

| Command | Result |
| :--- | :--- |
| `npm ci` | ✅ 13–15 s, no errors |
| `npm run lint` (`tsc --noEmit`) | ✅ 0 errors |
| `npm run build` | ✅ vite build + esbuild `dist/server.cjs` (warning: chunks >500 kB, pre-existing) |
| `npm run build:vercel` | ✅ client build + `lib/fullkonk-server.cjs` bundle |
| `npm test` | ❌ **does not exist** (no test script) |
| `npx playwright test` | ❌ not configured |

---

## 4. CURRENT ROUTE MAP (SPA, `utils/routes.ts` + `App.tsx`)

| Route | Page component | Verdict |
| :--- | :--- | :--- |
| `/` | `LandingPage` | KEEP (purge fake claims/CTAs) |
| `/marketplace` | `MarketplacePage` | PURGE → replace with product catalogue |
| `/listing/:id`, `/listing` | `ListingPage` | PURGE |
| `/wizard` | `ListingWizard` | PURGE |
| `/forge-audit` | `ForgePage` (tabs incl. audit) | FIX → audit-only page |
| `/forge` | `ForgePage` | PURGE → redirect to `/fullkonk` |
| `/fullkonk` | `FullKonkPage` | KEEP (flagship) |
| `/playgrounds` | `PlaygroundsPage` | PURGE (demo/playground shell w/ fake claims) |
| `/intel-report` | `IntelReportPage` | PURGE (marketplace-adjacent telemetry UI) |
| `/wallet` | `WalletPage` | PURGE (mock wallet) |
| `/enclave` | `BuyerDashboard` | PURGE (fake buyer dashboard) |
| `/seller-dashboard` | `SellerDashboard` | PURGE (fake seller dashboard) |
| `/account` | `AccountPage` | KEEP (real profile/settings) |
| `/academy` | `AcademyPage` | KEEP (marketing) — remove marketplace references if any |
| `/intel` | `BlogHub` | KEEP (editorial; historical material) |
| `/network` | `ForumPage` | KEEP (community) |
| `/advisory` | `ConsultingPage` | KEEP (services marketing) |
| `/docs` | `DocumentationPage` | KEEP (remove fake "LIVE" API doc claims) |
| `/career`, `/resources` | `CareerPage`, `ResourcesPage` | KEEP |
| `/ktools` | `KToolsPage` | PURGE (fake 51-tool catalogue) |
| `/pricing` | `PricingPage` | PURGE → replaced by catalogue/product pricing CTAs |
| `/checkout` | `CheckoutPage` | PURGE → replaced by lead/test-mode forms |
| `/login` | `EnterGate` | KEEP (real Firebase auth) |
| `/join` | `JoinNetwork` | KEEP (waitlist/join flow) |
| `/verify-email` | `VerifyEmailPage` | KEEP (real) |
| `/contact` | `ContactPage` | KEEP (real contact form) |
| `/metrics` | `UsageDashboard` | PURGE (fake usage flow) |
| `/affiliate` | `AffiliatePage` | PURGE |
| `/admin` | `AdminPage` | PURGE (fake admin) |
| `/dispute` | `DisputePage` | PURGE |
| `/style-guide` | `StyleGuide` | KEEP (internal) |
| `/redaeye` | `RedaeyeSandbox` (App maps `redaeye` → `RedaeyeSandbox`; `RedaeyePage` iframe exists but unused; Express also serves static `public/redaeye.html` locally) | KEEP (flagship) |
| `/redaeye-sandbox` | `RedaeyeSandbox` | FIX → dev alias; redirect to `/redaeye` |

### API routes (Express, `server.ts` + `api/index.ts`) — all server-side
- `GET /api/health`
- `GET /api/auth/github/url`, `GET /auth/callback` (GitHub OAuth → custom Firebase token)
- `POST /api/ai/generate` — multi-provider AI proxy (**keys server-side only**) — KEEP
- `GET /api/fullkonk/providers`, `GET /api/fullkonk/health`, `POST /api/fullkonk/optimize-prompt`, `POST /api/fullkonk/generate` (SSE), `GET /api/fullkonk/sessions/:userId`, `POST /api/fullkonk/usage`, `GET /api/fullkonk/analytics/:userId`, `POST /api/fullkonk/github/export` — fullKONK (KEEP)
- `GET /redaeye`, `/redaeye.html` — static file (local Express mode; KEEP)

---

## 5. FAKE / MOCK FEATURES FOUND (purge targets)

**Data layer**
- `data.ts` — `MOCK_LISTINGS` (fake sellers: "CyberSec Labs", "Quantitative Logic Corp", "Nexus Automation", …), fake prices ($499/$299/$750/$350), fake ratings (4.9, 4.8…), review counts, sales counts, view counts, fake audit scores (98/95) and fake audit report IDs (`AUD-8841`, `AUD-7312`), synthetic dates; `INITIAL_PROTOCOLS` with fake `acquisitionCount` (1,420 / 890 / 640 / 2,150); `APP_DATA` with `systemStatus: "STABLE"` and fake hero claims.
- `services/database.ts` — falls back to `MOCK_LISTINGS` whenever Firestore is empty or errors; fake `statistics/global` doc; fake waitlist ticket, wallet transaction `ref` + `status: 'COMPLETED'`, dispute `DSP-…` ids.
- `types.ts` / `constants.ts` — marketplace `Listing`, `Protocol`, `GlobalStats`, license multipliers, trust points ("Zero-Hallucination", "Secure Settlement"), `HOW_IT_WORKS_BUYER/SELLER`.

**Marketplace & commerce (mock flows)**
- `pages/MarketplacePage`, `ListingPage`, `ListingWizard`, `CheckoutPage`, `WalletPage`, `SellerDashboard`, `BuyerDashboard`, `UsageDashboard`, `AffiliatePage`, `DisputePage`, `AdminPage`, `PricingPage`, `PlaygroundsPage`, `IntelReportPage`.
- `components/marketplace/*`, `components/seller/*`, `components/buyer/*`, `components/common/AppTester.tsx` (fake test metrics: latency/cpu/memory + fake cost calculator + "production_enclave" runner), `components/common/AcquisitionSuccessModal.tsx`, `components/modals/UpgradePromptModal.tsx`.
- `services/payments.ts` — mock payment-intent interface pointing at non-existent `/api/payments/*`.

**Forge fake tools (only Neural Audit is real)**
- `components/forge/ToolSelector.tsx` (tabs), `OptimizeTool.tsx` (Prompt Refiner), `AgentBuilder.tsx` (Agent Architect), `EnterpriseArmory.tsx` (Market Intel; sole consumer of `lib/enterpriseTools.ts`), `SystemTerminal.tsx` / `TerminalTool.tsx` (Kernel Shell — fake `v4.2.0-STABLE`, fake "verified at 94%"), `DocumentTool.tsx` (fake Doc Generator), `GlobalMap.tsx`.
- `lib/enterpriseTools.ts` — fake enterprise tool catalogue with `exampleData` modules (purge target).
- `services/gemini.ts` — `runMarketScan` / `suggestNodeConnections` (Market Intel helpers), only used by AgentBuilder → purge with it.
- `services/ai.ts` — `runGenericAgent` used by fake tools; keep `runAudit` (real Audit).

**Fake K-Tools catalogue**
- `pages/KToolsPage.tsx` ("51 LIVE TOOLS") + `ToolLibrarySection` in `components/KonkredSections.tsx` (51 `SYSTEM_TOOLS` "Active Modules", "LIVE MODULE RUNNER").
- `pages/LandingPage.tsx` K-Tools card ("51 TOOLS LIVE").

**Fake network/node/liquidity/ledger/system counters**
- `components/JoinNetwork.tsx` (network claims), `components/AcquirersList.tsx` (fake acquirers, `verified: i % 3 === 0`), `components/ValuationTerminal.tsx` (`v4.2.0-STABLE`, fake valuation outputs), `components/NetworkJoinLoadingScreen.tsx`, `components/Protocols.tsx`, `components/ProtocolCard.tsx`, `components/ProtocolDetails.tsx`, `components/Tools.tsx`, `components/ToolCard.tsx`, `hooks/useGlobalStats.ts`, `components/layout/SystemHUD.tsx` (retired stub), `components/SystemFooter.tsx` (protocol/tool counters), `components/About.tsx`, `components/GetAccess.tsx`, `components/DemoView.tsx`, `components/Footer.tsx`, unused `components/landing/*` (Hero, CTA, Stats, Pricing, Trust, HowItWorks, Pillars, Tools, FeaturedListings, WaitlistModal, BrutalistWidgets).

**Unsupported claims ("LIVE", "STABLE", "verified", "certified", "bug-free", "deploy-ready", fake scores)**
- `LandingPage.tsx` — "LIVE" badges on fullKONK/AUDITOR cards, "bug-free, deploy-ready", "Exportable audit certificates", "400+ Exploit Vectors", "30+ LLM Providers", "1M+ Tokens/day" counter, "12+ AI Providers" counter, `$0 To Start`.
- `KToolsPage.tsx` ("51 LIVE TOOLS"), `ForgePage.tsx` ("FORGE KERNEL ACTIVE"), `DocumentationPage.tsx` (fake "LIVE" API docs), `BlogHub.tsx` (claims about "verified listings trading at a premium"), `KonkredSections.tsx` (LIVE_SECURE portal, Active Modules), `ValuationTerminal.tsx`, `SystemTerminal.tsx`/`TerminalTool.tsx` (`v4.2.0-STABLE`), `seller/Analytics.tsx`, `common/AcquisitionSuccessModal.tsx`, `landing/BrutalistWidgets.tsx` ("INTEGRITY: 99.4% Sigma verified"), `landing/CTA.tsx`.

**Auth / Firebase**
- **No** emulator config, no `useEmulator`, no anonymous sign-in, no mock-user tokens in application code (`firebase` SDK internals may contain such strings in minified builds — those are vendor files and are not removed). Auth is real Firebase Auth; **keep**.

---

## 6. PRESERVED FLAGSHIP FEATURES (working, must not break)

1. **Audit / AUDITOR / Neural Audit** — `components/forge/AuditTool.tsx` + `services/ai.ts#runAudit` → `POST /api/ai/generate` (server-side Gemini, JSON schema-validated response, persisted to Firestore `audits`). Requires auth + ≥50-char input. **Fix:** AUDITOR landing CTA currently routes to `/marketplace` (wrong) and the audit currently lives inside ForgePage with unrelated tabs.
2. **REDAEYE** — `/redaeye` renders `RedaeyeSandbox` (React adversarial lab, 21 kB) plus static `public/redaeye.html` (141 kB sales/diagnostic page) served by Express locally; `RedaeyePage` iframe wrapper exists but is unused. Keep `/redaeye`; redirect `/redaeye-sandbox` → `/redaeye`.
3. **fullKONK_>** — `pages/FullKonkPage.tsx` + `/api/fullkonk/*` server routes + `services/fullkonk.*` orchestrator (SSE streaming, provider failover, GitHub export, sessions, usage analytics). **Fix:** landing CTA routes to `/forge` (wrong) → must route to `/fullkonk`.

---

## 7. RISKS & NOTES

- Deleting `data.ts`/`MOCK_LISTINGS` will break imports in `App.tsx`, `Wishlist.tsx`, `services/database.ts` — all of which are purge targets or will be updated.
- `lib/fullkonk-server.cjs` (≈4 MB) is a committed build artifact regenerated by `build:vercel`; it may show as changed after builds.
- No test framework exists; adding one (vitest) is required to satisfy the definition of done. Playwright E2E requires browser binaries — will be attempted; if the sandbox cannot run browsers it will be documented as CI-only.
- Firestore access is governed by `firestore.rules`; demo/lead forms must degrade gracefully (never fake success when the write fails).
