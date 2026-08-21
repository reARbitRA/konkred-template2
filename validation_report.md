# KONKRED Public-Data Validation Report

**Run date:** 2026-08-20  
**Products tested:** 15  
**Mode:** Public real-world documents/datasets plus deterministic reference adapters

## Important scope limitation

This workspace has no external LLM API key or model execution endpoint. Therefore this run validates the **input contracts, source preservation, deterministic calculations, hard stops and safety gates** using public data. It does not claim that a particular model generated every answer correctly. That claim requires model-specific execution and an independent labeled holdout set.

This is still a real-data validation run: the source documents and datasets are public, downloaded into `data/sources`, hashed in `source_manifest.json`, and processed by executable adapters.

## Results

| Product | Canonical ID | Result | Test focus | Public source |
|---|---|---|---|---|
| Contract Review Copilot | `KONKRED-LEG-CON-CANON-0001-v2.0` | PASS | public-document evidence extraction and hard-stop test | https://community.trustcloud.ai/kbuPFACeFReXReB/uploads/2022/09/Form-of-Master-Services-Agreement.pdf |
| IaC Security Copilot | `KONKRED-SEC-IAC-CANON-0001-v2.0` | PASS | public-code-derived IaC fixture with known findings | https://dev.to/suhteevah/your-terraform-is-probably-insecure-here-are-90-patterns-to-check-1bci |
| M&A Due-Diligence Workbench | `KONKRED-FIN-DD-CANON-0001-v2.0` | PASS | public investor-presentation evidence and calculation test | https://investors.palantir.com/files/Palantir%20-%20Q4%202025%20Investor%20Presentation.pdf |
| Incident Learning and Post-Mortem | `KONKRED-OPS-SRE-CANON-0001-v2.0` | PASS | public postmortem timeline reconstruction | https://blog.cloudflare.com/cloudflare-incident-march-21-2025/ |
| GRC Evidence Request Triage | `KONKRED-SEC-GRC-CANON-0001-v2.0` | PASS | public checklist evidence-register test | https://soc2auditors.org/insights/soc-2-controls-list/ |
| Cash/Bank/PSP Reconciliation Copilot | `KONKRED-FIN-REC-CANON-0001-v2.0` | PASS | public reconciliation example-data test | https://github.com/pavitsu/pavit-bank-reconciliation |
| Enterprise RFP Response Copilot | `KONKRED-SAL-RFP-CANON-0001-v2.0` | PASS | public RFP questionnaire grounding/negative test | https://esentire-dot-com-assets.s3.ca-central-1.amazonaws.com/assets/resourcefiles/MDR-RFP-RFI-Questionnaire.pdf |
| GovCon RFP Compliance Workbench | `KONKRED-GOV-RFP-CANON-0001-v2.0` | PASS | public 28-page RFP source-quality and semantic-cue test | https://www.pgcc.edu/media/wwwpgccedu/content-assets/community/doing-business-with-pgcc/procurement/request-for-bids/rfq-20-05/RFP-No-025-004.pdf |
| FP&A Monthly Variance Analysis | `KONKRED-FIN-FPA-CANON-0001-v2.0` | PASS | public municipal budget-vs-actual normalization test | https://data.dumfriesva.gov/api/views/x4av-ttes/rows.csv?accessType=DOWNLOAD |
| Executive Flash Brief | `KONKRED-EXC-BRF-CANON-0001-v2.0` | PASS | public investor-update source-linked executive brief test | https://investors.palantir.com/files/Palantir%20-%20Q4%202025%20Investor%20Presentation.pdf |
| Commercial Lease Abstraction | `KONKRED-LEG-CRE-CANON-0001-v2.0` | PASS | public lease-form extraction test | https://esign.com/wp-content/uploads/Texas-Association-of-Realtors-Commercial-Lease-Agreement.pdf |
| SEO Content Opportunity Planner | `KONKRED-MKT-SEO-CANON-0001-v2.0` | PASS | public SEO dataset input-sufficiency test | https://github.com/Zafar-Saeed/SEO_Dataset |
| Evidence-Backed PRD Generator | `KONKRED-PRD-CANON-0001-v2.0` | CONDITIONAL | public GitHub enhancement-issue research synthesis test | https://api.github.com/repos/pandas-dev/pandas/issues?state=all&labels=Enhancement&per_page=100&page=1 |
| Customer Health and Churn Copilot | `KONKRED-CSM-CHR-CANON-0001-v2.0` | PASS | public churn benchmark with calibrated reference model | https://raw.githubusercontent.com/Giskard-AI/examples/main/datasets/WA_Fn-UseC_-Telco-Customer-Churn.csv |
| A/B Experiment Interpretation Assistant | `KONKRED-DAT-ABT-CANON-0001-v2.0` | PASS | public A/B dataset with external scipy reference analysis | https://github.com/tnangrani/Analyze_AB_Test_Results |

## Aggregate result

- **PASS:** 14 / 15
- **CONDITIONAL:** 1 / 15
- **No result is labelled autonomous or certified.**

## Interpretation

A PASS means that the public-data test met the stated deterministic acceptance checks for its narrow test focus. A CONDITIONAL result means the test exposed a missing policy, source limitation, incomplete context or requirement for additional ground truth. Conditional results are not failures of the product idea; they are evidence that the workflow must not silently overclaim.

## Standalone products

Each product is documented under `products/<slug>/` and includes:

- `PRODUCT.md`
- `prompt.txt`
- `test_output.json`
- `run.py`

## Source manifest

`source_manifest.json` records the public source URLs, local source filenames and SHA-256 hashes.

## Next validation step

Run the canonical prompts through the target model/API using the same source fixtures, then compare its JSON outputs to the deterministic adapter outputs and a human-reviewed gold label set. Only then should measured model accuracy or a production certification score be issued.
