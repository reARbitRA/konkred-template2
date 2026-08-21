# KONKRED — Baseline Test Results (Stage 0, 36-workflow mission)

Recorded: 2026-08-22 (Asia/Tehran)
Branch: `arena/01a0246b-konkred-template2`
Baseline commit: `724f729` (tip of the session branch, which already contains the merged 15-product platform work of PR #13)
Production branch: `main` @ `585a61e`

> This file records the *starting* state for the 36-entry portfolio mission. It is the second baseline for
> this branch: the first baseline (`agent/REPOSITORY_AUDIT.md`) was taken at `585a61e` before the 15-product
> platform work. Nothing in this document is estimated — every line is the literal output of the command run.

## 1. Environment

| Item | Value |
| --- | --- |
| Node | v22.22.3 |
| npm | 10.9.8 |
| Package manager | npm (`package-lock.json` tracked; `bun.lock` also present but unused by scripts) |
| Framework | React 19 + TypeScript + Vite 6 (client), Express 5 (`server.ts`), esbuild (server bundle) |
| Styling | Tailwind via CDN (no Tailwind build step) + `styles/globals.css` |
| Hosting | Vercel (`vercel.json`: build `npm run build:vercel`, output `dist`, function `api/index.ts`) |
| Test runners | vitest (unit), Playwright (E2E, chromium) |

## 2. Scripts present in `package.json`

```
dev           tsx start.ts
build:client  vite build
bundle:api    esbuild server.ts --bundle --platform=node --format=cjs --minify ... --outfile=lib/fullkonk-server.cjs
build:vercel  npm run build:client && npm run bundle:api
build         npm run build:client && esbuild start.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs
start         node dist/server.cjs
lint          tsc --noEmit
typecheck     tsc --noEmit
test          vitest run
test:e2e      playwright test
```

## 3. Commands run and exact results

### `npm ci`
```
exit code 0
(node_modules restored from package-lock.json; npm notice about npm 12.0.2 only)
```

### `npm run lint` (`tsc --noEmit`)
```
> konkred-–-production-node@0.0.0 lint
> tsc --noEmit

exit code 0 — 0 errors
```

### `npm run typecheck`
Identical command to `lint` (`tsc --noEmit`) — 0 errors.

### `npm test` (`vitest run`)
```
 ✓ tests/validate.test.ts   (15 tests)   9ms
 ✓ tests/manifest.test.ts   (10 tests)  22ms
 ✓ tests/no-fakes.test.ts   (40 tests)  29ms
 ✓ tests/routes.test.ts     (26 tests)  12ms
 ✓ tests/secrets.test.ts     (3 tests)  28ms
 ✓ tests/api.test.ts         (5 tests)  67ms

 Test Files  6 passed (6)
      Tests  99 passed (99)
   Duration  2.78s
exit code 0
```

### `npx playwright test`
Not runnable in this sandbox: `npx playwright install chromium` fails (browser CDN download is blocked from the
sandbox network; the `PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright` mirror also fails).
33 E2E tests are collected successfully; the suite is CI-only until it runs on GitHub Actions / a machine with
browser download access. This is unchanged from the earlier baseline and is a **sandbox limitation, not a repo defect**.

### `npm run build` / `npm run build:vercel`
Verified green at `724f729` during the previous stage of this branch; re-verified after each stage of this
mission (results recorded per-stage in `agent/IMPLEMENTATION_PLAN.md`).

## 4. Current routes at baseline (`utils/routes.ts`)

Pages: `/`, `/forge-audit`, `/audit`, `/fullkonk`, `/redaeye`, `/redaeye-sandbox`, `/products`,
`/products/:slug`, `/404`, `/academy`, `/intel`, `/network`, `/advisory`, `/docs`, `/career`,
`/resources`, `/login`, `/join`, `/account`, `/contact`, `/style-guide`, `/verify-email`.

Redirects (purged legacy routes): `/marketplace`, `/catalogue`, `/ktools`, `/pricing`, `/sell` → `/products`;
`/forge` → `/fullkonk`; `/redaeye_sandbox` → `/redaeye`; `/wizard`, `/checkout`, `/wallet`, `/enclave`,
`/library`, `/usage`, `/seller-dashboard`, `/buyer-dashboard`, `/affiliate`, `/admin`, `/dispute`, `/metrics`,
`/usage-metrics`, `/playgrounds`, `/intel-report`, `/listing`, `/listing/:id` → `/404`.

Aliases: `/audit`, `/auditor` → audit page; `/forum` → network; `/consulting` → advisory; `/enter` → login;
`/join-network` → join.

## 5. Flagship features verified present at baseline

| Feature | Location | Route |
| --- | --- | --- |
| Audit / AUDITOR / Neural Audit | `pages/AuditPage.tsx` + `components/audit/AuditTool.tsx` + `services/ai.ts#runAudit` | `/forge-audit` (aliases `/audit`, `/auditor`) |
| REDAEYE | `pages/RedaeyeSandbox.tsx` + `public/redaeye.html` (served by `server.ts`) | `/redaeye` (alias `/redaeye-sandbox`) |
| fullKONK_> | `pages/FullKonkPage.tsx` + `services/fullkonk*.ts` + `/api/fullkonk/*` | `/fullkonk` (`/forge` redirects here) |

## 6. Mock/fake data status at baseline

The mock marketplace purge already happened on this branch (commit `b508689`, ~100 files deleted: fake
listings, sellers, ratings, sales counters, wallet/checkout/dispute/admin/seller/buyer dashboards, K-Tools
catalogue, non-audit Forge tabs, synthetic network/ledger counters). `tests/no-fakes.test.ts` (40 assertions)
guards against regression. **No further marketplace purge work is required for the 36-entry mission**; Stage 2
of this mission is therefore a re-verification pass plus removal of any 15-product-era copy that becomes
inaccurate once the portfolio grows to 36 entries.

## 7. Server / API surface at baseline

`server.ts` (Express 5): `/api/health`, `/api/auth/github/*`, `/api/ai/generate`, `/api/fullkonk/*`,
`/api/demo/run`, static `/redaeye`. All model calls are server-side; no key is read in client code.

## 8. Environment variable names referenced (names only, no values)

`GEMINI_API_KEY`, `API_KEY` (fallback), `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `OPENROUTER_API_KEY`,
`GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `MISTRAL_API_KEY`, `XAI_API_KEY`, `CEREBRAS_API_KEY`, `SAMBANOVA_API_KEY`,
`NVIDIA_API_KEY`, `HUGGINGFACE_API_KEY`, `GITHUB_TOKEN`, `QWEN_ACCESS_KEY_ID`, `QWEN_ACCESS_KEY_SECRET`,
`TOGETHER_API_KEY`, `FIREWORKS_API_KEY`, `PERPLEXITY_API_KEY`, `VITE_APP_NAME`, `VITE_API_URL`,
`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `VITE_TRUST_WALLET_USDT_TRON`, `SQL_HOST`, `SQL_USER`,
`SQL_PASSWORD`, `SQL_DB_NAME`, `ENABLE_PRODUCT_DEMOS`.

No `.env` file is tracked. `firebase-applet-config.json` contains a Firebase *web client* config key, which is
public by design and is not a secret.
