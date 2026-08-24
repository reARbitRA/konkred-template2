# KONKRED 36-Workflow Agent Send Checklist

## Send these first — required

Attach or make these files available to the GitHub-connected repository agent:

1. `KONKRED_36_IMPLEMENTATION_TRIGGER_PROMPT.md`
   - Main execution instruction. Paste this into the agent prompt.

2. `KONKRED_36_WORKFLOW_COMPREHENSIVE_GUIDEBOOK.md`
   - Product, UX, operating, validation, monetization and publishing reference for all 36 entries.

3. `ARB_CANONICAL_MERGED_PROMPTS.md`
   - Full canonical prompt library for the 21 ARB suites.

4. `merged_upgraded_prompts.md`
   - Full canonical prompt library for the earlier 15 validated workflows.

5. `arb_merged_validation/canonical_manifest.json`
   - Machine-readable manifest for the 21 suites.

6. `arb_merged_validation/validation_summary.json`
   - Machine-readable ARB preflight results.

7. `konkred_validation/validation_summary.json`
   - Machine-readable results for the earlier 15 workflows.

8. `konkred_site_purge_audit.md`
   - Exact mock-feature purge and flagship-preservation requirements.

9. `ARB_MONETIZATION_STRATEGY_AND_BLUEPRINT.md`
   - Detailed pricing, commerce, website and enterprise monetization blueprint.

## Make these directories available for implementation

### ARB suite package

```text
arb_merged_validation/products/
arb_merged_validation/reports/validation_report.md
arb_merged_validation/data/derived/
arb_merged_validation/source_manifest.json
```

### Earlier 15-workflow package

```text
konkred_validation/products/
konkred_validation/reports/validation_report.md
konkred_validation/data/derived/
konkred_validation/source_manifest.json
```

The agent needs the product folders for prompt text, product descriptions, validation results and public-demo metadata.

## Optional reference files

Send only if the agent needs the full source-ledger or repository workflow detail:

```text
ARB_CANONICAL_SOURCE_LEDGER.md
ARB_CANONICAL_MERGE_VALIDATION_REPORT.md
konkred_repo_agent_blueprint.md
```

## Do not send as primary instructions

Avoid sending these together with the new 36-workflow trigger unless clearly labelled historical:

```text
KONKRED_FINAL_STARTING_PROMPT.md
KONKRED_AGENT_PACKET.md
```

Those files were written for the earlier 15-product website scope and may conflict with the new 36-entry implementation prompt.

Do not send the following as primary implementation material:

```text
konkred_validation/ALL_TEXT_FILES_MERGED.md
konkred_validation_full.zip
konkred_validation_products.zip
konkred_agent_packet.zip
```

They are archival or unnecessarily large for the agent.

## Agent access requirements outside the documents

The agent also needs:

- Read/write access to the actual KONKRED GitHub repository
- Permission to create a feature branch and Pull Request
- Vercel Preview deployment access/status visibility
- Repository build/test commands
- Environment-variable names only; never paste secret values into the prompt
- A rule that production merge and deployment require human approval

## Correct order

```text
1. Paste KONKRED_36_IMPLEMENTATION_TRIGGER_PROMPT.md
2. Attach the comprehensive guidebook
3. Attach the two canonical prompt libraries
4. Attach the two validation summaries
5. Attach the purge audit and monetization blueprint
6. Make both product directories available
7. Let the agent inspect the repository first
8. Require audit + plan + branch before implementation
```
