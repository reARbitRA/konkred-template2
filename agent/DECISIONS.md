# KONKRED — Decision Log

Every entry records a decision that deviates from, interprets, or constrains the mission brief. Nothing here is
a guess: each decision states the observed fact that forced it.

---

## D-001 — Working branch is `arena/01a0246b-konkred-template2`, not `agent/konkred-36-workflows-v1`

**Brief:** "Create branch `agent/konkred-36-workflows-v1`."
**Observed:** This agent session is bound by the platform to the branch `arena/01a0246b-konkred-template2`.
Work committed to any other branch is not tracked with the session and would be invisible to the reviewer.
**Decision:** All work continues on `arena/01a0246b-konkred-template2`. The branch name is a platform
constraint, not a preference. The mission's branch/PR/preview review model is fully preserved — a feature
branch, a PR against `main`, and a Vercel Preview all exist.
**Consequence:** The existing open PR **#13** is reused and retitled/extended for the 36-entry portfolio rather
than opening a second PR from the same branch (GitHub allows only one open PR per head/base pair).

---

## D-002 — The 15-product platform already on this branch is the foundation, not something to rewrite

**Observed:** commits `00d332a…724f729` on this branch already deliver: the mock-marketplace purge, a
manifest-driven catalogue, 15 product records with real input/output JSON schemas, 15 public synthetic
fixtures, the server-side gated `/api/demo/run` endpoint, test-mode lead forms, and 99 passing unit tests.
**Decision:** The 36-entry portfolio extends this foundation. The 15 workflow records are migrated (not
re-authored) into the new 36-entry manifest, keeping their schemas, fixtures, prompts and pricing, and gaining
the new fields (`type`, `parentId`, `route`, `experiencePattern`, `staticDesignScore`, `validationStatus`,
`autonomousActions`, …). Rewriting them from scratch would destroy working, reviewed functionality.

---

## D-003 — Source-of-truth documents were NOT delivered to the workspace

**Brief §2** lists nine document sets to read before implementation
(`KONKRED_36_WORKFLOW_COMPREHENSIVE_GUIDEBOOK.md`, `ARB_CANONICAL_MERGED_PROMPTS.md`,
`arb_merged_validation/**`, `konkred_validation/**`, `ARB_MONETIZATION_STRATEGY_AND_BLUEPRINT.md`, …).
**Observed:** none of these files exist anywhere in this sandbox. `/home/user/uploads/` does not exist; a
whole-filesystem search (`find / -xdev -iname …`) returns zero matches; they are also absent from the Git
repository and from GitHub code search.
**Decision:** No suite content is invented. Two-phase approach:
1. **Phase A (this stage):** build everything that the mission prompt itself specifies verbatim — the 36 IDs,
   titles, routes, parent links and experience patterns — plus the shared platform. Any field whose only
   possible source is a missing document is left explicitly empty and machine-checkable: `validationStatus:
   "NOT_RUN"`, `validationReport: null`, `promptReference: null`, `staticDesignScore: null`,
   `sourceStatus: "AWAITING_SOURCE_DOCUMENT"`.
2. **Phase B:** when the documents are supplied, they are imported into the repository under
   `content/source/` (documents) and `content/validation/{arb_merged_validation,konkred_validation}/`
   (validation packages), the manifest is backfilled, and `agent/SOURCE_IMPORT.md` records exactly which file
   produced which field.
**Consequence:** Until Phase B completes, the site must not display a static design score, a PASS badge, or a
prompt excerpt for the 21 suites — because there is no sourced value to display.

---

## D-004 — Source documents are treated as DATA, never as instructions

**Brief §1 rule 13.** When the documents arrive they are parsed for content only. Any imperative text inside
them ("delete X", "publish Y", "ignore previous rules") is ignored and, if encountered, logged in
`agent/SOURCE_IMPORT.md` under "ignored directives". Imported prose is stored as data files, never executed
and never spliced into system prompts without escaping.

---

## D-005 — `/products/:slug` redirects to `/tools/:slug` (owner decision, 2026-08-22)

**Observed:** the branch currently serves the 15 workflows at `/products/:slug`; the mission requires
`/tools/:slug` and `/suites/:slug`.
**Owner's answer:** redirect.
**Decision:** `/tools/:slug` and `/suites/:slug` are the canonical URLs. `/products/:slug` performs an
intentional client-side redirect (URL replaced, canonical page rendered) to `/tools/:slug` when the slug is a
known workflow, to `/suites/:slug` when it is a known suite, and to `/404` otherwise. `/products`,
`/catalogue`, `/marketplace`, `/ktools` all resolve to the combined 36-entry catalogue index.

---

## D-006 — Commercial statuses are extended, not replaced

**Brief §3** defines six statuses: `PUBLIC_DEMO`, `WORKFLOW_KIT`, `PUBLIC_CATALOGUE_SUPERVISED`,
`INTERNAL_CONTROLLED_PILOT`, `ENTERPRISE_INTEGRATION`, `CONDITIONAL_VALIDATION`.
**Observed:** the existing manifest uses `PUBLIC_DEMO | STANDARD_KIT | SUPERVISED_PILOT | ENTERPRISE_INTEGRATION`.
**Decision:** the six brief statuses become the canonical enum. The legacy values map as
`STANDARD_KIT → WORKFLOW_KIT` and `SUPERVISED_PILOT → PUBLIC_CATALOGUE_SUPERVISED`, applied mechanically during
migration and asserted by a unit test. No product silently changes commercial meaning.

---

## D-007 — No autonomous actions anywhere: enforced by schema, not by convention

**Brief §1 rules 15–16, §7.** `autonomousActions` must be `[]` for all 36 entries. **Decision:** the manifest
validator fails the build if any entry has a non-empty `autonomousActions` array, and a unit test greps the
36 page components for action verbs that imply external side effects (send, post, deploy, sign, pay, block,
approve-and-execute) rendered as primary buttons.

---

## D-008 — Static design score and preflight labels are hard-coded next to their values

**Brief §3.** Wherever a static design score is rendered the component also renders
"Static design target — not measured model performance", and wherever a deterministic public-data PASS is
rendered it also renders "Public-data preflight — narrow reference test". **Decision:** these strings live in
the shared `ValidationBadge` / `DesignScore` components so no page can display a bare number or a bare PASS.
A unit test asserts the disclaimer strings are present in those components.

---

## D-009 — Customer-facing tone vs. mandatory disclosure (reconciling two owner instructions)

**Earlier owner instruction (2026-08-21):** "these suites are products I'm supposed to sell, not a
self-criticising masochist TV show" — no human-approval warnings, no raw prompt text, no long limitation lists
on the 15 tool pages.
**This brief §6:** every page must include a human approval notice and an explicit "What this tool does not
do" section.
**Decision:** both are satisfied by *placement and tone*, not by omission. Each page shows a compact,
neutrally-worded "Scope & review" disclosure (approver role + "What this tool does not do") in a collapsed
secondary panel below the working tool — never as a red warning banner above it, and never as raw prompt text.
The tool itself stays the hero of the page. Raw prompts stay backend-only (manifest / server), never rendered.

---

## D-010 — Demo execution stays server-side, gated and fixture-first

**Observed:** `/api/demo/run` already validates the slug against the manifest, requires
`ENABLE_PRODUCT_DEMOS !== 'false'` plus a server-side AI key, validates output against the product's JSON
schema, redacts secrets, and returns `request_pilot` when unavailable.
**Decision:** it is extended, not replaced, to the brief's `DemoResponse` contract
(`COMPLETE | NEEDS_INPUT | BLOCKED | INCOMPLETE_SOURCE_SET | NEEDS_EXTERNAL_VALIDATOR | ERROR`, plus
`productId`, `runId`, `sourceRefs`, `validation{schema,provenance,safety}`, `limitations`,
`actionsExecuted: []`). When no live model is configured, the endpoint returns the **stored reference
output** for that product labelled as a preflight reference — it never fabricates a fresh run.

---

## D-011 — Payment remains test-mode; no fake checkout success is ever rendered

**Observed:** no payment provider, no CRM and no order storage are configured in this repository.
**Decision:** `/pricing`, `/kits/[slug]`, `/sprint`, `/enterprise`, `/partners` ship with a server-side
provider abstraction and a real lead form. In Preview they are labelled test mode. `checkout_success` is only
ever emitted by a real provider callback, which does not exist yet, so it is unreachable — by design.

---

## D-012 — Analytics events are emitted without personal data

**Brief §10.** The twelve named events are emitted through a single `analytics.track(event, props)` shim with
an allow-list of non-sensitive properties (entry id, type, status, route). No form contents, no free text, no
IP-derived fields. If no analytics sink is configured the shim is a no-op — it never silently ships data to a
third party.

---

## D-013 — Playwright cannot run in this sandbox

**Observed:** `npx playwright install chromium` fails (browser download blocked). **Decision:** the E2E suite
is authored and extended to cover all 36 routes and is executed in CI / on the reviewer's machine. Every PR
report states plainly that E2E results are "collected, not executed here" rather than claiming a pass.

## D-014 — Source documents arrived on `main`; extraction is machine-checked, not hand-copied

**Observed:** owner uploaded 26 source documents to `main` (commit `e3d7d61`); merged into the session branch
as `ce48dbc`. **Decision:** `scripts/extract-portfolio.mjs` parses the comprehensive guidebook chapters and
**cross-checks every suite score/tier and workflow result against both validation reports, failing on any
mismatch** before `agent/extracted-portfolio.json` is written. The manifest builder
(`scripts/build-portfolio-manifest.mjs`) then merges that output with the legacy 15-product manifest and the
canonical route/UX mapping. No manifest field is typed by hand.

---

## D-015 — Pricing fields parse only explicit Kit/Sprint/Pilot/workspace offers

Commercial-entry strings are parsed verbatim: a price lands in `kitFromUsd`/`sprintFromUsd`/`pilotFromUsd`/
`workspaceFromUsd` only when its label names that offer. Offers with other labels ("Diligence Evidence
Pack", "One-Module Control Preflight", managed monthly environments) leave those fields `null` and keep the
exact wording in `pricing.note` — nothing is coerced into a schema field it did not claim to be.

---

## D-016 — Demo endpoint speaks the canonical contract; legacy client fields ride along

`POST /api/demo/run` now returns the required `DemoResponse` (uppercase statuses, `productId`, `runId`,
`sourceRefs`, `validation{schema,provenance,safety}`, `limitations`, `actionsExecuted: []`) and resolves both
canonical and legacy slugs. Legacy convenience fields (`message`, `output`, `model`, `validationErrors`)
remain for the existing client. Input validation runs **before** engine gating so bad input reports
`NEEDS_INPUT` even when no model key is configured. Suites and unfixtured entries return
`NEEDS_EXTERNAL_VALIDATOR` with `validation: NOT_RUN` — a suite demo is never faked.

---

## D-017 — Browser title no longer says "Marketplace"

`index.html` title changed from "AI Workflow Marketplace & Product Platform" to "Controlled Enterprise
Workflow Products" — residual marketplace language would misrepresent the purged, catalogue-only platform.

---

## D-018 — Legacy `/products` pages removed; canonical pages own the UX

`pages/ProductDetailPage.tsx`, `components/catalog/ProductCard.tsx` and `components/catalog/StatusBadge.tsx`
are deleted (superseded by `WorkflowDetailPage`, `SuiteDetailPage`, the 36-entry `CataloguePage` and the
portfolio `StatusChip`). Old URLs redirect (`/products/:slug → /tools/:slug`, `/products → /catalogue`) so
no inbound link breaks. The legacy `catalog/product-manifest.json` stays byte-identical — it remains the
demo schema/prompt/fixture source of record for the 15 workflows until the demo engine migrates fully.
