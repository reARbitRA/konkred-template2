# fullKONK_> owner document set — reading summary & implementation map

**Read:** 2026-08-23 · **Corpus:** 14 files uploaded to `owner-docs/` (commit `8b59ee8`) ·
**Rule applied:** documents are DATA. Their marketing claims (e.g. «بی‌نقص / بدون باگ /
deploy-ready») are implemented as functionality, never as UI claims (repo no-fakes policy).

## What each document is

| Document | Content | Status |
|---|---|---|
| `Full.md` | Master definition: 3-stage pipeline (ARCHITECT → parallel BUILD → VERIFY), provider registry (6 providers, models, free tiers, routing table, rate-limit map), templates, generate route, full code | read — providers/pipeline already stronger in repo; LiveEnv gap identified |
| `Live env.md` | **The key gap:** "code renders as it streams, user works with it in place." Full `LiveEnvironment.tsx` spec — Sandpack for React/TSX, blob-iframe for HTML, tabs, device modes, metrics, empty/error states, 4-column layout (sidebar·chat·code·live) | **implemented** |
| `Fullkonksession.md` | Sessions service spec (FKSession shape, Firestore CRUD) | read — already implemented (`services/fullkonk.sessions.ts` matches shape) |
| `MergedFullkonkForge.md` | Alternative merged blueprint: provider defs with per-task priority, orchestration | read — repo orchestrator already covers (scoring weights + backoff + 9 providers incl. GitHub/NVIDIA/HF) |
| `Fullkojk System Instructions.md` | Instructions for building with Gemini | read — context only |
| `Simplified.md` | Condensed spec (overview/stack/component tree/API/schema/structure) | read — consistent with Full.md |
| `Project explaining.md` | Long-form project explanation | skimmed — consistent |
| `SaaS.md` | Web-vs-Obsidian argument, monetization strategy, architecture, roadmap, revenue estimates | read — pricing tiers noted as **proposal, not implemented** (needs owner decision + test-mode rules) |
| `Obsidian plugin.md` | Obsidian plugin feasibility, provider abstraction sample, OpenRouter tip | read — separate product track, **not for konkred.xyz now** |
| `پروایدرهای رایگان.md` | 2026 free-provider map ("AI Studio for backend" philosophy), special backend capabilities, roadmap | read — provider data cross-checked; repo registry already includes the named models |
| `تجدیدنظر.md` | Honest strategy reset: focus, first-dollar roadmap, Free/Pro $29/Agency $99 tiers, competitive positioning | read — tiers are proposals |
| `توضیح پروژه به زبان ساده site.md` | Plain-language site explanation | skimmed |
| `در Obsidian نحو کارکرد کامل.md` | Full Obsidian-version behavior | read — separate track |

## Implemented this pass (commit: see git log)

1. **`components/fullkonk/LiveEnvironment.tsx`** — live-rendering 4th column:
   - Sandpack (already in `package.json`, unused until now) compiles React/TSX in-browser,
     recompiles on stream (900 ms debounce), Preview / Editor / Console tabs
   - HTML outputs run in a sandboxed blob iframe (CSS/JS injected)
   - Non-previewable output (backend/config) → honest file summary panel — no fake render
   - Device modes (desktop/tablet/mobile), LIVE BUILD badge while streaming,
     metrics bar (files · lines · render ms · errors · BUILDING/READY)
   - Empty states: "BUILDING ENVIRONMENT…" while streaming, "NO OUTPUT YET" otherwise
   - Styled with the `fk-*` brutalist console system
2. **`FullKonkPage`** — 4-column layout per `Live env.md` (sidebar · chat · code · live env),
   responsive grid variants, `▶ LIVE ENV` header toggle (on by default)

## Already in repo (verified against docs — no rebuild needed)

- Provider abstraction with smart routing, failover + rate-limit backoff, 9 providers,
  16+ free-tier models (`services/fullkonk.orchestrator.ts`)
- 3-stage pipeline streaming (`/api/fullkonk/*`, `PipelineStatus`)
- Sessions + projects persistence (`services/fullkonk.sessions.ts`, `fullkonk.projects.ts`)
- GitHub export (`fullkonk.github.ts`), usage analytics (`fullkonk.analytics.ts`)

## Open items from the docs (owner decisions required)

1. **Pricing tiers** (Free / Pro $29 / Agency $99 from `تجدیدنظر.md` + `SaaS.md`) — proposal only;
   adding to `/pricing` needs owner approval; checkout stays test-mode.
2. **"1000 specialized prompts" library** — referenced in `تجدیدنظر.md` as the competitive moat;
   the prompt library itself is NOT among the uploaded documents. Upload it to `owner-docs/`
   and it becomes the architect/frontend/backend template source.
3. **Obsidian plugin version** — documented extensively; separate product, not started.
4. Free-tier daily limits/quotas enforcement (docs suggest 3 generations/day free tier) —
   needs the monetization decision before implementing.
