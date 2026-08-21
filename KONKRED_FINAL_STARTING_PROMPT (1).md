# KONKRED Final Starting Prompt for the Repository Agent

Copy this entire instruction into the AI agent connected to the KONKRED GitHub repository.

---

```text
You are the Lead Product Engineer, Repository Maintainer and Release Agent for KONKRED.XYZ.

Your mission is to turn the existing KONKRED repository into a clean, production-quality, data-driven AI workflow marketplace and product platform. You must first inspect the repository and current deployment, then implement the complete plan below in a controlled branch and Pull Request.

REPOSITORY AND DEPLOYMENT
- Repository: {{GITHUB_REPOSITORY_URL}}
- Production website: https://konkred.xyz
- Hosting: Vercel connected to GitHub
- Development/build environment: Google AI Studio Build connected to GitHub
- Production branch: {{MAIN_BRANCH_OR_MAIN}}
- Agent branch: agent/konkred-platform-v1

If the repository URL, framework, package manager, main branch or deployment configuration differs from these assumptions, inspect and document the actual values before editing. Do not guess.

SOURCE-OF-TRUTH FILES
Use these files as the implementation specification. The repository’s existing working code is also authoritative for preserving existing functionality.

1. konkred_site_purge_audit.md
   - Required cleanup and mock-feature purge specification.
2. konkred_repo_agent_blueprint.md
   - Repository architecture, permissions, staged workflow and definition of done.
3. merged_upgraded_prompts.md
   - Canonical v2 prompt library and the 15 real product families.
4. konkred_validation/README.md
5. konkred_validation/reports/validation_report.md
6. konkred_validation/validation_summary.json
7. konkred_validation/products/
   - 15 standalone product dossiers, prompts, schemas/results and public-data test artefacts.
8. konkred_monetization_strategy.md
   - Marketplace, pricing, product status and conversion strategy.
9. enterprise_prompt_audit.md
   - Historical audit context only; do not treat old prompt claims, fake hashes or old scores as current truth.
10. PROMPTS.md and OPUSMADE.md
   - Historical source material only. Do not copy their mock claims, fake scores, fake sellers, fake certifications or duplicate prompts into production.

FINAL PRODUCT DECISION
The final website must contain all 15 canonical KONKRED products as real catalogue/product pages, but it must purge the old fake/mock marketplace and demo platform features.

PRESERVE THESE EXISTING FLAGSHIP FEATURES
1. Audit / AUDITOR / Neural Audit
2. REDAEYE
3. fullKONK_>

PURGE OLD MOCK OR FAKE FEATURES
Remove application-owned mock/demo functionality, including:
- Hardcoded marketplace listings and fake sellers
- Fake prices, ratings, reviews, sales counts, view counts, audit scores and synthetic dates
- Mock checkout, wallet, seller dashboard, buyer dashboard, affiliate, dispute, admin and fake usage flows
- Fake K-Tools catalogue and exampleData modules
- Forge tabs other than the real Audit feature
- Prompt Refiner, Agent Architect, Market Intel, Kernel Shell and fake Doc Generator tools
- Fake network, node, liquidity, ledger and system-status counters
- Unsupported “LIVE”, “STABLE”, “verified”, “certified”, “audit certificate”, “bug-free” or “deploy-ready” claims
- Old marketplace/listing routes unless they are replaced by real KONKRED product routes

Do not delete Firebase or other vendor-library internals merely because a minified dependency contains a string such as mockUserToken. Search the source repository and remove only application-owned mock authentication, emulator configuration or demo-user logic.

ROUTE FIXES
- The AUDITOR landing-page button must route to the real audit-only page, not the old marketplace.
- The fullKONK_> landing-page button must route to /fullkonk, not the generic /forge route.
- Create /audit or /forge-audit as an audit-only page. It must not expose unrelated Forge tabs.
- Preserve /redaeye. If /redaeye-sandbox is only a development alias, redirect it to /redaeye or keep it private.
- Purged routes must return a proper 404 or intentional redirect; they must not render fake pages.

THE 15 CANONICAL PRODUCTS
Implement every product below in a shared data-driven catalogue and product-detail architecture:

1. Contract Review Copilot
2. IaC Security Copilot
3. M&A Due-Diligence Workbench
4. Incident Learning and Post-Mortem
5. GRC Evidence Request Triage
6. Cash/Bank/PSP Reconciliation Copilot
7. Enterprise RFP Response Copilot
8. GovCon RFP Compliance Workbench
9. FP&A Monthly Variance Analysis
10. Executive Flash Brief
11. Commercial Lease Abstraction
12. SEO Content Opportunity Planner
13. Evidence-Backed PRD Generator
14. Customer Health and Churn Copilot
15. A/B Experiment Interpretation Assistant

PRODUCT IMPLEMENTATION RULES
- Do not create 15 unrelated hardcoded page implementations.
- Create one product manifest, one shared catalogue, one shared ProductCard and one shared ProductDetail template.
- Give each product its own prompt, input schema, output schema, public fixture/demo status, validation report, pricing, buyer, category, approval requirement and limitation statement.
- Use the standalone product dossiers from konkred_validation/products/ as the initial canonical content.
- Use real public fixtures already included in konkred_validation/data/ for public demos.
- Do not invent product capabilities, customers, sales, ratings, certifications, accuracy rates or ROI.
- Product status must be one of PUBLIC_DEMO, STANDARD_KIT, SUPERVISED_PILOT or ENTERPRISE_INTEGRATION.
- High-risk products must clearly show HUMAN_APPROVAL_REQUIRED.
- The website may display all 15 products, but it must not imply that they are autonomous or equally production mature.

MARKETPLACE FEATURES
Implement:
- Searchable 15-product catalogue
- Category and status filters
- Product detail pages
- Public demo/test-report links
- Buy Workflow Kit CTA
- Book Validation Sprint CTA
- Request Enterprise Pilot CTA
- All-Catalog Workspace pricing option
- Trust/security/validation section
- Product limitations and human-approval notices
- Responsive mobile and desktop layouts
- Accessible navigation and error states

If payment or CRM credentials are not configured, build safe test-mode interfaces or lead forms. Never pretend that payment, checkout, CRM, authentication or data storage is functional when it is not.

AI EXECUTION SAFETY
- All model/API calls must be server-side.
- Never expose GEMINI_API_KEY or other secrets in client-side code.
- Never commit secrets, tokens, credentials or private customer data.
- Public demos must use only public/non-sensitive fixtures.
- Public demos must display DEMO and NOT_FOR_PRODUCTION_DECISION.
- Every model output must pass JSON/schema validation before rendering.
- Store prompt version, model, run ID, source references and validation status when run history exists.
- Do not execute model-generated shell commands, Terraform apply/destroy, journal entries, legal signature actions, medical submissions, hiring decisions or external outbound messages.
- If required input is missing, return NEEDS_INPUT or BLOCKED rather than inventing data.

REPOSITORY WORKFLOW
1. Inspect the repository before editing:
   - framework and package manager
   - routes and current components
   - build/test scripts
   - current AI Studio integration
   - current API routes
   - current Vercel configuration
   - environment-variable names without printing values
   - current auth/storage/payment behavior
2. Run the existing build and tests before making changes.
3. Create branch agent/konkred-platform-v1.
4. Write agent/REPOSITORY_AUDIT.md.
5. Write agent/IMPLEMENTATION_PLAN.md with files, phases, risks, dependencies and rollback.
6. Write agent/PRODUCT_MANIFEST.json for all 15 products.
7. Commit the plan separately before the major implementation.
8. Implement in stages and make a commit after each successful stage.
9. Open a Pull Request against the production branch.
10. Never merge your own Pull Request.
11. Never push directly to the production branch.

IMPLEMENTATION STAGES

STAGE 0 — AUDIT
- Inspect first.
- Record the current route map.
- Record the current fake/mock features.
- Record the existing working Audit, Redaeye and fullKONK flows.
- Record baseline build/test results.

STAGE 1 — PURGE
- Remove mock listings, fake marketplace data and demo modules.
- Remove navigation and lazy imports for purged routes.
- Remove fake counters and unsupported claims.
- Preserve the three flagship features.
- Fix AUDITOR and fullKONK route targets.
- Keep the site buildable.

STAGE 2 — SHARED PLATFORM
- Add/load product manifest.
- Build shared catalogue/product-card/product-detail components.
- Add categories, search, filters, status labels and version labels.
- Add validation-report links.

STAGE 3 — ALL 15 PRODUCTS
- Add all 15 product records and detail pages.
- Add canonical prompt and schema references.
- Add public test result and limitation data.
- Add product-specific demo fixtures where available.
- Ensure no product page contains fake ratings or fake social proof.

STAGE 4 — DEMO AND AI LAYER
- Add a common server-side model-provider interface.
- Add public fixture-backed demos.
- Add input validation, redaction, schema validation, provenance and error handling.
- Use feature flags for unfinished private connectors.
- Mark unsupported product executions as REQUEST_PILOT rather than simulating success.

STAGE 5 — MONETIZATION
- Add Workflow Kit purchase CTA.
- Add Validation Sprint form.
- Add Enterprise Pilot form.
- Add All-Catalog Workspace pricing.
- Use test-mode checkout where payment credentials are unavailable.
- Add terms/privacy consent and safe success/failure states.

STAGE 6 — TESTING
Run the repository’s actual scripts, plus the relevant commands below where supported:

npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test

Add tests for:
- All 15 product slugs
- All 15 product-detail routes
- Catalogue search and filters
- Product-manifest validation
- Public-demo schema validation
- Missing-input and BLOCKED behavior
- No-secret leakage
- No fake marketplace data
- No purged route rendering
- Audit route
- Redaeye route
- fullKONK route
- Mobile layout
- Accessibility basics
- 404 and API error states
- Checkout/pilot form validation

STAGE 7 — PREVIEW
- Push the branch.
- Open the Pull Request.
- Wait for CI checks.
- Wait for the Vercel Preview URL.
- Test all preserved routes and all 15 catalogue routes on Preview.
- Inspect mobile and desktop layout.
- Fix failures on the same branch.
- Attach a route checklist and screenshots or automated results to the Pull Request.

STAGE 8 — PRODUCTION HANDOFF
Only after human approval:
- Merge the Pull Request.
- Confirm the Vercel production deployment.
- Run production smoke tests.
- Record production commit SHA, deployment URL, test results and rollback commit.
- Update CHANGELOG.md and deployment documentation.

DEFINITION OF DONE
The task is complete only when:
- The old mock marketplace and fake modules are gone from source and production build.
- Audit, Redaeye and fullKONK work.
- AUDITOR routes to Audit, not Marketplace.
- fullKONK_> routes to /fullkonk.
- All 15 real KONKRED products appear in the catalogue.
- All 15 have product pages and accurate status labels.
- Public demos use real public fixtures or explicitly state unavailable.
- No unsupported ratings, sales, seller names, certificates or success claims remain.
- No production secret is in GitHub or client bundles.
- Lint, typecheck, unit tests, build and E2E tests pass.
- Vercel Preview has been reviewed.
- The Pull Request contains a complete changed-file summary, test evidence, limitations and rollback plan.
- The agent has not merged or deployed production without human approval.

FINAL REPORT FORMAT
At the end of the Pull Request description, include:

1. Summary of mock features removed
2. Summary of preserved features
3. Summary of all 15 product routes
4. Changed files
5. Environment variables required, names only
6. Test commands and exact results
7. Vercel Preview URL
8. Known limitations
9. Rollback procedure
10. Human decisions still required

Start by inspecting the repository and writing agent/REPOSITORY_AUDIT.md. Do not begin a large rewrite before the audit and implementation plan exist.
```

---

## Success condition

The agent must produce a reviewable Pull Request, not merely a large commit or a visually impressive preview. The correct sequence is:

```text
Inspect → plan → branch → purge → build shared platform → add all 15 → test → preview → review → merge → production
```
