# Enterprise Prompt Portfolio — Realistic Rating, Ranking and Audit

**Files reviewed**

- `/home/user/uploads/PROMPTS.md`
- `/home/user/uploads/OPUSMADE.md`

**Review date:** 20 August 2026

## Executive verdict

These are strong **prompt concept briefs and workflow templates**, not enterprise-ready autonomous systems. The best work is the repeated use of explicit inputs, structured outputs, evidence checklists, assumptions, handoff notes, and human-review gates. That is genuinely useful.

The portfolio nevertheless overstates its readiness and economics. As written, **none of the high-stakes prompts should be allowed to sign contracts, block CI/CD, post journal entries, send medical appeals, make hiring decisions, or issue investment recommendations without external controls and accountable human approval**.

The biggest value is not the prompt text. It is the proposed workflow around the prompt: source ingestion, retrieval, deterministic calculation, policy/version management, validation, routing, audit logging, and human sign-off.

### My bottom-line scores

- **Best production draft:** Product Requirements Document generator — **74/100**
- **Best high-value workflow candidate:** GovCon RFP shredder, long variant — **73/100**
- **Best operational compliance candidate:** SOC 2 / ISO evidence triage — **72/100**
- **Best legal prompt design:** Deterministic playbook contract review — **70/100**, but still copilot-only
- **Highest risk:** Medical denial appeals, long variant — **30/100**
- **Most commercially unsafe:** Multi-touch outbound sequence — **38/100**
- **Most misleading claim:** “100% accurate,” “98% success,” “80%+ overturn rate,” and similar unvalidated claims

Scores are design-review scores, not measured model accuracy. A 70 means “useful supervised internal pilot after engineering,” not “ready to sell as an autonomous digital employee.”

---

## 1. Corpus and provenance audit

### What is actually in the files

| File | What the file claims | What is actually identifiable | Finding |
|---|---:|---:|---|
| `PROMPTS.md` | Several generation batches and a 20-prompt sequence | **25 identifiable KONKRED prompt blocks**, labelled P1–P20 plus two later batches of 3 and 2; also one non-KONKRED monetization meta-prompt | Numbering is not a clean catalogue. P10/P13, P11/P14 and P12/P15 are duplicated variants. |
| `OPUSMADE.md` | “21,” then “32” total prompts | **18 actual prompt blocks**: prompts 1–7 and 22–32 | Prompts 8–21 are absent as bodies. The file is not a complete 32-prompt corpus. |
| Both files | Certified, production-ready prompts | Mostly Markdown templates with placeholders and deployment suggestions | No test results, golden set, acceptance metrics, versioned policy bundles, or execution evidence are supplied. |

For this audit I consolidated exact duplicates but retained materially different variants. That produces **34 assessable prompt/variant families**, including the Google AI Studio monetization meta-prompt. The occurrence map is below.

### Important duplication and ID defects

1. `KONKRED-LEG-CON-0001-20260103` is used for more than one different contract-review prompt.
2. `KONKRED-SEC-AUD-0002-20260103` is used for SOC evidence triage and for IaC auditing.
3. `KONKRED-FIN-DUE-0003-20260103` is reused for different M&A prompt bodies.
4. The same or near-identical contract, IaC, M&A, GovCon, cash-reconciliation, medical, and SRE concepts appear in multiple generations without a clear parent/child/version relationship.
5. Prompt numbers restart at “#1” in later batches, making prompt numbers non-unique.
6. The final `OPUSMADE.md` claim of 32 generated prompts cannot be reconciled with the 18 prompt bodies in that file.
7. The first OPUSMADE catalogue says 21 prompts but lists 19 rows; it says Legal has 7 rows but shows 6, Security has 4 but shows 3, and its M&A top-five value of `$1,090.20` is not the value shown for the listed data-room prompt.
8. The final category table says Product Management has two prompts and an average of `$627.18`, while the visible Product Management body shows one prompt with a claimed net value of `$642.18`.

### Integrity/hash audit

The SHA-256 labels are not enterprise integrity verification:

- A hash is meaningful only when the exact byte scope, canonicalization, encoding, generation process, and signer are defined.
- Several hash-like strings are visibly malformed by length or character set.
- Some are placeholders such as `[COMPUTE_LOCALLY_PER_HASH_SCOPE_RULES]`.
- `e3b0c442…b855` is the well-known SHA-256 of an empty string, not evidence that a full prompt was hashed.
- Many others use obvious sequential or patterned filler. A valid-looking 64-hex-character string is not proof that it was computed from the prompt.
- A URL, brand box, license line, or hash inside a prompt does not create provenance, licensing, or tamper evidence.

To make integrity real, store the canonical prompt body outside the runtime prompt, compute a digest over a documented byte range, record the model/config/policy bundle, and sign the manifest with a controlled key. Do not present a decorative hash as certification.

---

## 2. Rating method

The score is a realistic **enterprise prompt-readiness score**, not a score of how polished the document looks.

| Dimension | Weight | What I looked for |
|---|---:|---|
| Task and input contract | 20 | Clear scope, required fields, source fidelity, manageable context |
| Reasoning/evidence design | 20 | Separation of observed facts, inference and unknowns; reproducibility |
| Output reliability | 15 | One machine contract, schema discipline, traceability, validation |
| Safety and domain controls | 20 | Human gates, privacy, legal/medical/financial/security safeguards |
| Deployment readiness | 15 | Tool integration, versioning, routing, monitoring, failure handling |
| Economic realism | 10 | Defensible savings, error cost, API/integration cost, adoption assumptions |

### Score interpretation

- **90–100:** rare; measured, controlled, domain-approved production component
- **80–89:** strong pilot candidate after targeted engineering and evaluation
- **70–79:** useful supervised enterprise copilot; not autonomous
- **60–69:** promising proof of concept or internal assistant; significant redesign required
- **Below 60:** template/brainstorming asset or unsafe as written

---

## 3. Overall ranking

The ranking is by **practical enterprise usefulness after reasonable controls**, not by the claimed D.L.A. net value. Exact duplicate occurrences are grouped in one row.

| Rank | Prompt / occurrence(s) | Claimed net value | Realistic score | Disposition | Main reason |
|---:|---|---:|---:|---|---|
| 1 | **O25 — PRD from user research** (`KONKRED-PRD-DOC-0157-20260213`) | $642.18 | **74** | Pilot after rewrite | Strong draft artifact and handoff structure; must stop inventing technical design and metrics. |
| 2 | **O28 — GovCon RFP shredder, long** (`KONKRED-GOV-PRO-0112-20260213`) | $821.33 | **73** | Pilot with document pipeline | High-value, operational output; “100%/98%” claim and RFP semantic coverage are not credible as written. |
| 3 | **P8 — SOC 2 / ISO evidence triage** (`KONKRED-SEC-AUD-0002-20260103`) | $173.01 | **72** | Pilot after framework grounding | Good task decomposition, ownership and evidence packaging; control mapping cannot be best-effort in an audit. |
| 4 | **P7/O7 — deterministic contract playbook review** (`KONKRED-LEG-CON-0001-20260103`) | $180.43 | **70** | Copilot only | Best legal structure, with rules, anchors and assumptions; model output is not deterministic and redlines need counsel. |
| 5 | **O32 — comprehensive SRE post-mortem** (`KONKRED-OPS-POST-0096-20260213`) | $541.55 | **69** | Internal supervised pilot | Comprehensive and blameless, but forces causal/cultural conclusions and contains hypothetical content that may leak into reports. |
| 6 | **O29 — cash/PSP reconciliation, long** (`KONKRED-FIN-REC-0003-20260213`) | $193.19 | **68** | Tool-assisted copilot | Useful workflow and SOP; matching and JEs should be produced by code/accounting rules, not free-form generation. |
| 7 | **O27 — A/B test synthesis** (`KONKRED-DAT-ABT-0753-20260213`) | $306.27 | **67** | Statistical engine plus LLM | Good checklist; the model must not calculate or decide from raw results without a reproducible stats engine. |
| 8 | **P21 — commercial lease abstraction** (`KONKRED-LEG-CON-0042-20260127`) | $1,060.85 | **66** | Extraction copilot | Narrow extraction is useful; “standard” holdover ranges and above-market judgments need jurisdiction and market data. |
| 9 | **P9 — cash/PSP triage, concise** (`KONKRED-FIN-REC-0003-20260103`) | $193.19 | **64** | Merge into O29 | Good concise skeleton but too little accounting context for safe JEs or fuzzy matching. |
| 10 | **P1/O1 — broad vendor contract risk extraction** (`KONKRED-LEG-CON-0001-20250126`) | $493.59 | **63** | Copilot only | Strong report layout; exposure, market comparison, page references and redlines are frequently unsupported. |
| 11 | **P3/O3 — M&A data-room synthesis** (`KONKRED-FIN-DUE-0001-20250126`) | $862.80 | **62** | RAG/map-reduce pilot | Good deal-team structure, but a 500-document room cannot be reliably treated as one pasted context. |
| 12 | **O26 — churn risk and intervention playbook** (`KONKRED-CSM-CHR-0624-20260213`) | $312.25 | **62** | Calibrated-model copilot | Good action orientation; scores and retention probabilities are placeholders, not predictions. |
| 13 | **P17 — technical RFP response writer** (`KONKRED-SAL-2024JUN-0001-v1.0`) | $122.38 | **61** | Grounded drafting pilot | Product-doc grounding is good; the “generic Fortune 500 proof point” conflicts with the anti-hallucination rule. |
| 14 | **P23 — M&A financial statement analysis** (`KONKRED-FIN-DUE-0104-20260127`) | $411.20 | **61** | Calculator-backed copilot | Useful questions and bridge format; no proper financial input schema or calculation layer. |
| 15 | **P20 — executive flash report** (`KONKRED-EXC-2024JUN-0001-v1.0`) | $425.60 | **60** | Low-risk drafting pilot | Concise and useful, but traffic-light status based on “sentiment” is not executive risk analysis. |
| 16 | **P2/O2 — broad IaC security audit** (`KONKRED-SEC-IAC-0001-20250126`) | $443.74 | **59** | Scanner-backed copilot | Good threat-model intent; no AST/plan/tool verification, and automatic remediation is dangerous. |
| 17 | **P24 — GovCon shredder, concise** (`KONKRED-ENT-RFP-0112-20260127`) | $695.50 | **59** | Merge into O28 | Verbatim matrix is a useful start, but keyword rules miss legal and proposal semantics. |
| 18 | **P19 — monthly variance analysis** (`KONKRED-FIN-2024JUN-0001-v1.0`) | $282.14 | **58** | Calculator-backed copilot | Clear inputs and unexplained-variance fallback; filtering, percentages, forecasts and root causes need code/data validation. |
| 19 | **P22 — Terraform/IaC compliance** (`KONKRED-SEC-AUD-0089-20260127`) | $186.77 | **58** | Scanner-backed copilot | Specific checks are helpful; CIS/NIST mappings and HCL fixes are not guaranteed by the prompt. |
| 20 | **P18 — simple post-mortem generator** (`KONKRED-OPS-2024JUN-0001-v1.0`) | $195.70 | **57** | Merge into O32 | Usable outline, but severity, resolution and root cause may be invented from sparse logs. |
| 21 | **O31 — enterprise RFP response / win themes** (`KONKRED-SAL-RFP-0118-20260213`) | $799.49 | **57** | Rewrite with claims registry | Impressive breadth, but it invites invented certifications, SLAs, customer results, architecture and pricing commitments. |
| 22 | **P5/O5 — lean incident RCA** (`KONKRED-ENG-SRE-0521-20260103`) | $431.60 | **56** | Merge into O32 | “Based only on data” is good; forced five whys and role-only action ownership are weak. |
| 23 | **P10/P13 — Gold Standard vs counterparty deviation** (`KONKRED-LEG-CON-0001-20260103`) | $1,045.90 | **56** | Rewrite and merge | Useful diff concept, but only four clause families are scanned and “no hedging” is unsafe. |
| 24 | **P11/P14 — focused IaC audit** (`KONKRED-SEC-AUD-0002-20260103`) | $317.15 | **56** | Merge into P2/P22 | Concise JSON and missing-context handling help, but the code and compliance assumptions remain unverified. |
| 25 | **P4/O4 — strict MSA/NDA playbook** (`KONKRED-LEG-CON-0104-20260103`) | $612.51 | **55** | Rewrite | Fixed Delaware/NY, Net-45, 2x and IP rules are company-specific policy, not general legal truth; JSON plus Markdown is a broken interface. |
| 26 | **P6/O6 — commercial DD red flags** (`KONKRED-FIN-DUE-0882-20260103`) | $829.40 | **54** | Narrow internal use | Evidence discipline is positive, but 10-K/risk-factor text is not enough for valuation or legal conclusions. |
| 27 | **O23 — SEO gap analysis and calendar** (`KONKRED-MKT-SEO-0338-20260213`) | $417.40 | **52** | Tool-backed planner only | Without SERP/keyword/traffic tools, the output will fabricate competitive data and traffic potential. |
| 28 | **O22 — interview scorecard/debrief** (`KONKRED-HR-REC-0441-20260213`) | $141.52 | **50** | High-impact assistive only | Evidence structure helps, but “culture fit,” candidate ranking and offer parameters create employment-law and bias risk. |
| 29 | **P12/P15 — short M&A synthesis** (`KONKRED-FIN-DUE-0003-20260103`) | $1,090.20 | **48** | Retire/merge | Too little schema, evidence and financial logic for the claimed investment-committee use. |
| 30 | **M1 — Google AI Studio monetization meta-prompt** (tail of `PROMPTS.md`) | N/A | **42** | Brainstorming only | Stale date/model assumptions, unmeasurable novelty filter, no live research, and speculative revenue forecasts. |
| 31 | **P16 — five-vector contract compliance scan** (`KONKRED-LGL-2024JUN-0001-v1.0`) | $159.77 | **41** | Retire as written | “Not found = LOW” and “if Low, sign” are materially unsafe. Scope is also too narrow for an NDA/vendor decision. |
| 32 | **O24 — multi-touch outbound sequence** (`KONKRED-SAL-OUT-0219-20260213`) | $158.31 | **38** | Rewrite for compliance or retire | Opt-out, personalization, tracking, LinkedIn and unsupported proof-point practices can create legal and reputational exposure. |
| 33 | **P25 — concise medical denial appeal** (`KONKRED-MED-BIL-0205-20260127`) | $94.20 | **34** | Rewrite completely | It asks the model to assert standard of care and coding/legal positions from insufficient evidence. |
| 34 | **O30 — long medical denial appeal** (`KONKRED-MED-BIL-0205-20260213`) | $94.20 | **30** | Do not deploy as written | It can invent statutes, payer policy, guidelines, deadlines and “deemed approval”; it processes PHI and creates a ready-to-send document. |

Where scores tie, I place the prompt with the clearer bounded workflow and lower operational risk first. The score—not the catalogue’s claimed net value—should govern prioritization.

---

## 4. Prompt-by-prompt audit

### 4.1 P1/O1 — Legal Contract Risk Extraction — 63/100

**What is good**

- The input contract metadata is materially better than a generic “summarize this contract” prompt.
- It asks for exact text, clause references, exposure, negotiation priorities, favorable terms, missing clauses, and a clause matrix.
- The handoff to an attorney is directionally correct.

**Critical defects**

- Raw pasted text does not reliably provide page numbers. OCR may also corrupt “verbatim” quotes.
- “Market comparison,” quantified liability and walk-away thresholds are not derivable from the contract alone.
- The prompt does not require an explicit corporate playbook, approved fallback language, or source for market standards.
- It asks for a comprehensive review and a large appendix, which increases context overflow and omission risk.
- A role claim such as “15 years of Fortune 500 experience” is not a control.
- Its 90% success rate is an assertion, not a benchmark.

**Production fix**

Use a contract parser that emits clause IDs and source spans; pass a versioned playbook and jurisdiction policy; force each finding into `OBSERVED`, `INFERRED`, `MISSING`, or `UNRESOLVED`; prohibit unsupported dollar estimates; and require attorney approval before redlines or signature readiness.

---

### 4.2 P2/O2 — Broad IaC Security Audit — 59/100

**What is good**

- Cloud provider, framework, environment, data classification, threat priorities and existing controls are useful context.
- The threat-model and blast-radius framing is much better than a flat scanner list.
- It asks for resource location, attack scenario, remediation, verification and compliance mapping.

**Critical defects**

- A text-only LLM cannot reliably reason over provider versions, modules, dynamic blocks, variables, data sources, state, plan output, defaults, or cross-file references.
- CVSS, MITRE ATT&CK and SOC 2/HIPAA/FedRAMP mappings require controlled taxonomies and current versions.
- “Copy-paste ready” fixes and an automated remediation shell script can create outages or weaken security.
- A single format is not valid across AWS, Azure, GCP, Terraform, CloudFormation, Pulumi and CDK.
- The prompt contains malformed/incomplete code-fence examples in places, which harms parser reliability.

**Production fix**

Run Terraform validate/plan, provider-aware static analysis, OPA/Conftest and cloud scanners first. Give the model structured findings plus relevant code, make it read-only, require a human to approve each fix, and test generated changes in an isolated plan before any merge.

---

### 4.3 P3/O3 — M&A Due-Diligence Data-Room Synthesis — 62/100

**What is good**

- Deal stage, thesis, known concerns and document index are sensible inputs.
- The red/yellow/confirmatory split, missing-document list, management questions and specialist referrals reflect actual deal-team work.
- The report is designed for action rather than academic summary.

**Critical defects**

- “500+ documents” cannot safely be handled as one `DOCUMENT_CONTENT_OR_SUMMARIES` field. Retrieval and hierarchical synthesis are needed.
- The valuation dashboard invites the model to invent adjusted EV, QoE adjustments, NRR, working capital and capex values.
- The prompt mixes financial, legal, tax, HR and technology diligence without separate evidence standards or owners.
- “Management representation” may not exist in the supplied documents; the template may produce a false comparison.
- There is no evidence ledger requiring document ID, page, paragraph, date, source type and calculation lineage.

**Production fix**

Use document-level extraction, a finding ledger, deterministic financial calculations, and separate legal/tax/tech workstreams. Require every number to link to source rows or a documented formula; use ranges and scenario labels instead of point estimates when inputs are incomplete.

---

### 4.4 P4/O4 — Contract Risk Analysis against Fixed MSA/NDA Playbook — 55/100

**What is good**

- The rules are explicit and easy to test.
- The intention to return JSON for systems and a human-readable table is sensible.
- The prompt names a few real commercial issues: indemnity, payment, liability, governing law, termination and IP.

**Critical defects**

- The playbook is presented as if it were universally correct. Net 45, Delaware/New York, a 2x cap and client ownership are company policy choices.
- There is no party role, contract value, data type, service model, jurisdiction analysis or governing policy source.
- JSON plus Markdown in one response is not a reliable machine interface.
- “Legally sound” redline language cannot be guaranteed by a language model.
- It does not properly handle missing clauses; it mostly searches for violations.

**Production fix**

Make the playbook a required, versioned input. Return one strict JSON schema and render Markdown downstream. Include `PASS/FAIL/MISSING/AMBIGUOUS`, source spans, policy rule IDs, and an attorney-review gate. Do not let the result authorize signature.

---

### 4.5 P5/O5 — Lean Incident RCA — 56/100

**What is good**

- “Based only on provided data” and exact timestamp checking are good anti-hallucination instincts.
- Blameless language and specific corrective actions are appropriate.
- The output is short enough to be usable.

**Critical defects**

- A five-whys chain is not always five levels and often cannot establish a cultural/systemic cause from Slack logs.
- The prompt asks for a root cause even when the data may only support a proximate cause.
- Owners are roles, not actual accountable people or teams, and there are no due dates or tracking IDs.
- Impact fields such as users and revenue are not available in the inputs and may be invented.

**Production fix**

Create a source-linked event ledger, then separate confirmed facts, hypotheses, contributing factors and unknowns. Allow “root cause not established.” Populate owners and due dates from an incident directory and create actual issue records through a ticketing tool.

---

### 4.6 P6/O6 — Commercial Due-Diligence Red Flags — 54/100

**What is good**

- It explicitly rejects generic “market volatility” filler.
- A direct evidence requirement and management Q&A list are useful.
- The output is intentionally narrower than a full deal memo.

**Critical defects**

- A 10-K, earnings transcript or CIM is not enough to validate EBITDA, customer concentration or legal exposure.
- Probability, severity and mitigation potential are not tied to a defined scoring model.
- “Customer concentration >20%” is an example threshold, not a universal red flag.
- The output has no source page/section identifier beyond “Pg X,” and no missing-data register beyond a loose confidence line.

**Production fix**

Define materiality by deal and industry; require source citations and date; distinguish issuer disclosure from verified diligence evidence; include a “not assessed” status; and send financial, legal, tax and operational findings to their specialists.

---

### 4.7 P7/O7 — Deterministic Contract Playbook Review — 70/100

**What is good**

- This is the strongest legal design in the collection.
- It uses explicit rule statuses, evidence snippets, clause anchors, an assumption log, fallback positions, negotiation notes and a maximum risk count.
- The default playbook is more coherent than the fixed six-rule MSA prompt.
- It recognizes ambiguity and asks for `[VERIFY]` tags.

**Critical defects**

- A generative model does not become deterministic because the prompt says “deterministic.” Determinism requires a parser, rule engine, fixed decoding/configuration and post-validation.
- Assuming Delaware when governing law is absent is inappropriate in a legal workflow.
- “No clarifying questions” is counterproductive when party role, playbook, jurisdiction or contract text is missing.
- Suggested legal language remains a draft, not an approved redline.
- “Top 12 by expected loss” can hide a critical issue outside the cutoff if ranking is wrong.

**Production fix**

Block on missing critical inputs or route to a human. Replace default law with `UNASSESSED`. Use a clause/rule engine for deterministic checks, then let the model explain findings. Keep redlines behind counsel approval and preserve the original source spans.

---

### 4.8 P8 — SOC 2 / ISO Evidence Triage — 72/100

**What is good**

- This is one of the most operational prompts: it converts PBC requests into evidence items, owners, systems, collection steps, frequencies, storage paths and reuse scores.
- Deduplication, manual fallback and proof-of-review requirements are valuable.
- The YAML package specification is a useful downstream artifact.

**Critical defects**

- “Best-effort mapping” to a control ID is not acceptable as audit evidence.
- Defaults such as “last 12 months” and screenshots allowed with redaction may be wrong for the audit scope or evidence policy.
- It lacks population, sample, period, system scope, evidence freshness, control owner, approver, integrity and retention fields.
- It can invent an owner or source system if the directory is absent.

**Production fix**

Supply the exact framework and criteria version, control library, audit period, scope, evidence policy and owner directory. Treat unmapped items as `UNMAPPED`, not guessed. Add evidence provenance, population/sample metadata, approval timestamps, redaction status and chain of custody.

---

### 4.9 P9 — Cash/PSP Matching and Close Triage — 64/100

**What is good**

- It asks for matching rules, exception ownership, SLAs, JEs, bottleneck actions and an SOP.
- The distinction between exact, fuzzy and payout-batch matching is directionally useful.
- It handles partial data and multiple currencies better than many prompts.

**Critical defects**

- Matching is a transaction-processing problem. The model should not decide one-to-many, many-to-one, duplicates, reversals or settlement matching from prose alone.
- No source-row IDs, reconciliation period, opening/closing balances, sign conventions, currency conversion source or tolerance policy are required.
- Journal entries may be syntactically balanced but economically wrong.
- “Fuzzy match with similarity >70%” is not a controlled accounting policy.

**Production fix**

Use a deterministic reconciliation engine, attach every result to source rows, require a balanced JE and support packet, and send every proposed entry to controller approval. Let the LLM classify exceptions and draft explanations only.

---

### 4.10 P10/P13 — Gold Standard vs Counterparty Deviation — 56/100

**What is good**

- Baseline-versus-counterparty comparison is a better bounded task than generic contract review.
- It asks for concrete counter-redlines and quantification of liability-cap changes.

**Critical defects**

- It only mandates four topic families; deviations in data protection, audit, security, warranties, insurance, assignment, fees and service levels can be missed.
- It provides no robust way to detect additions, deletions, changed definitions or cross-reference effects.
- `RISK_TOLERANCE` is undefined and not tied to a decision table.
- “No hedging language” actively suppresses appropriate uncertainty.
- The executive summary appears after the table despite many enterprise parsers expecting it first.

**Production fix**

Use a real document-diff/section alignment layer, enumerate every changed clause, require a rule ID and source span, and permit `AMBIGUOUS`/`VERIFY`. Put legal drafting behind an approved fallback library and counsel review.

---

### 4.11 P11/P14 — Focused IaC Audit — 56/100

**What is good**

- It has a compact JSON contract and a short set of concrete checks.
- The no-false-positive instruction for intended public resources is useful.
- It at least acknowledges incomplete code by asking for confidence or missing context.

**Critical defects**

- “Exact HCL remediation” is not possible without provider/resource version, module context and surrounding configuration.
- Wildcard IAM, public access and encryption are context-dependent and cannot be judged from a simple pattern.
- A single compliance framework string is insufficient to select valid control mappings.
- There is no source line, code span, scanner evidence, or verification result in the schema.

**Production fix**

Feed findings from a real IaC scanner and a validated plan. Return resource address, source span, control version, evidence, false-positive rationale and “fix requires review.” Never use this prompt alone as a CI blocker.

---

### 4.12 P12/P15 — Short M&A Synthesis — 48/100

**What is good**

- The task is clearly aimed at an investment-committee brief.
- It names EBITDA add-backs, customer concentration, margins, working capital and thesis alignment.
- The explicit “INSUFFICIENT DATA” instruction is helpful.

**Critical defects**

- The input is a single free-text blob with no periods, currency, units, source documents, account IDs or management-versus-actual distinction.
- The output table has only one metric row and cannot support the stated task.
- “Validate all add-backs” cannot be done without accounting policy, recurring/one-time evidence and supporting schedules.
- The 20% concentration example is an arbitrary threshold.

**Production fix**

Retire it or merge it into the data-room workflow. Require normalized P&L/BS tables, source references, period definitions, formulas, adjustment categories, scenario ranges and a specialist-review status.

---

### 4.13 P16 — Five-Vector Contract Compliance Scan — 41/100

**What is good**

- It is narrow and easy to understand.
- It requests exact quotes and has a useful “do not infer intent” principle.
- It could work as a low-risk intake triage if the decision output were removed.

**Critical defects**

- The anti-hallucination rule says: if a clause is not found, mark it `NOT FOUND` and **LOW**. Absence of a liability cap, termination right or confidentiality protection is not necessarily low risk; it may be high or unassessed.
- The deployment guide says “If Risk Score is Low, sign,” which is unsafe legal automation.
- A jurisdiction mismatch is not inherently a substantive legal risk without forum, party, transaction and enforcement context.
- Five vectors are not enough for an NDA or vendor agreement.
- It has no human gate, no source page/span, no policy version and no data/privacy review.

**Disposition:** retire as written. Rebuild it as “five-vector intake triage; no signature recommendation; missing = UNASSESSED; counsel review required.”

---

### 4.14 P17 — Technical RFP Response Writer — 61/100

**What is good**

- Product documentation is explicitly supplied as the source of truth.
- The prompt says not to invent features and to admit missing knowledge.
- A 200-word limit and direct-answer structure are commercially useful.

**Critical defects**

- It asks for a “generic use case” such as Fortune 500 banks even when no such proof exists in the product documents. That directly conflicts with its grounding rule.
- Competitor comparisons are not supportable merely because a competitor name is provided.
- It does not preserve the RFP requirement ID, source citation, compliance status or approved claim reference.
- “READY TO PASTE” is too strong when the knowledge-base answer is incomplete.

**Production fix**

Use an approved claims/evidence registry. Return `COMPLIANT`, `PARTIAL`, `NON-COMPLIANT`, `MISSING EVIDENCE` and citations before drafting. Require sales-engineering and legal/security review for commitments and comparisons.

---

### 4.15 P18 — Simple Blameless Post-Mortem — 57/100

**What is good**

- It is simple enough for routine use.
- The timeline, five-whys, impact and action table cover the minimum post-mortem shape.
- It includes an ambiguity fallback.

**Critical defects**

- It sets `Status: Resolved` and infers SEV-1/SEV-2 without a formal incident policy input.
- It provides no source links, evidence confidence, action due date, tracking ID or follow-up review.
- The five-whys format can produce a neat but unsupported narrative.

**Production fix:** merge into O32, preserving the short output option but adding source-linked facts, an unknowns section, action IDs/owners/dates and policy-based severity.

---

### 4.16 P19 — Monthly Variance Analysis — 58/100

**What is good**

- It clearly separates financial data from operational context.
- The unexplained-variance fallback is safer than guessing.
- It aims for a concise board-facing output.

**Critical defects**

- Filtering only `Variance > threshold` misses negative variances and needs an explicit absolute/semantic rule.
- Percentage variance can be undefined or misleading for a zero/very small budget.
- Rounding to the nearest thousand can hide material small items and distort totals.
- Operational context can explain correlation, not prove causation.
- Forward-looking risk projections lack a formula, horizon and assumptions.

**Production fix:** calculate variances in code, expose source rows and units, separate `observed`, `management explanation`, and `analyst hypothesis`, and define materiality by account class.

---

### 4.17 P20 — Executive Flash Report — 60/100

**What is good**

- Very clear audience, length and output.
- It explicitly surfaces conflicting department updates.
- The “ask” section is useful for a chief-of-staff workflow.

**Critical defects**

- A traffic light “based on the sentiment of the updates” is not a robust health assessment.
- The prompt lacks KPI definitions, thresholds, period comparisons, source links and confidence.
- “Burn/runway” and “revenue/pipeline” summaries can be invented if updates are qualitative.
- Sending directly to board/investors without an executive approval step is not appropriate.

**Production fix:** define KPI source fields and thresholds, preserve update provenance, show missing/conflicting data explicitly, and route the draft to the CEO/CFO/chief of staff for approval.

---

### 4.18 P21 — Commercial Lease Audit — 66/100

**What is good**

- Narrow scope and exact-excerpt requirement reduce open-ended hallucination.
- The selected terms—CAM, holdover, relocation and TI clawback—are commercially relevant.
- The missing-critical-clauses footer is useful.

**Critical defects**

- “Standard is 125–150%” is not a universal legal or market standard; it varies by market, asset, lease and negotiation context.
- Above-market analysis requires a benchmark source and comparable assumptions.
- The prompt omits many material lease fields: escalations, options, exclusivity/use, insurance, defaults/remedies, guarantees, casualty/condemnation, SNDA, operating expense definitions and audit rights.
- Exact quotes require page/paragraph-preserving OCR, which is not specified.
- “Zero interpretation errors” is not a credible control statement.

**Production fix:** provide lease type, market, benchmark source and tenant/landlord posture; expand the abstraction schema; calculate percentages in code; preserve source pages; label risk as policy-based or market-based; require real-estate counsel review.

---

### 4.19 P22 — Terraform/IaC Compliance — 58/100

**What is good**

- It focuses on common high-impact classes: public ingress, encryption and wildcard IAM.
- It asks for CIS/NIST references and HCL remediation.
- It acknowledges missing modules in the broader variant.

**Critical defects**

- “Zero tolerance” is not a policy implementation and produces false positives for intentional public services.
- CIS/NIST IDs depend on cloud provider, service, benchmark edition and scope.
- HCL snippets cannot be trusted without provider/module/version context.
- No plan, state, variable values, network paths, exceptions or compensating controls are required.

**Production fix:** merge with P2, use scanner/OPA evidence, require a named benchmark version and exception register, and make all remediation proposals non-blocking until verified.

---

### 4.20 P23 — M&A Financial Statement Analysis — 61/100

**What is good**

- Horizontal and vertical analysis is a reasonable bounded task.
- The CFO “grill list” format encourages specific questions.
- “INSUFFICIENT DATA” is explicitly required.

**Critical defects**

- The input has no enforced table schema, period definitions, currency, sign convention or account hierarchy.
- The model is asked to identify add-backs and calculate an EBITDA bridge without a formula or accounting policy.
- “Top five concerns” can be filled with plausible but unsupported anomalies.
- No source row/period reference is required for each inquiry.

**Production fix:** normalize financial statements and compute ratios/bridges programmatically. Let the model explain anomalies that already have source IDs and show the exact calculation behind every question.

---

### 4.21 P24 — Concise GovCon RFP Shredder — 59/100

**What is good**

- Verbatim extraction and page/section mapping are the right basic outputs.
- It distinguishes mandatory and optional language at a high level.
- Leaving proposal mapping blank rather than hallucinating it is good.

**Critical defects**

- The rule that `Will` is mandatory is wrong in many RFP contexts: it may describe a Government action, not an offeror obligation.
- Searching for “Shall,” “Must,” “Will,” “Required” and “Responsible for” is a lexical heuristic, not compliance analysis.
- Requirements can appear in tables, forms, attachments, incorporated references, amendments, Section B, Section H, Section I, Section J and portal instructions.
- Page references are not reliable after plain-text copying.
- It does not extract evaluation factors, page limits, forms, submission rules or amendment precedence.

**Production fix:** use the long O28 architecture, ingest the original versioned document and attachments, preserve page/paragraph/table coordinates, and label each item as offeror requirement, Government commitment, evaluation criterion, information, ambiguity or out of scope.

---

### 4.22 P25 — Concise Medical Denial Appeal — 34/100

**What is good**

- It requests the denial reason, CPT/ICD-10 data and clinical summary.
- It tries to directly address the payer’s stated reason.
- A clinician or experienced biller could use the structure as a drafting checklist.

**Critical defects**

- It asks the model to assert standard of care and coding positions without requiring the actual payer policy or authoritative guideline text.
- It can turn missing clinical evidence into persuasive prose.
- It does not address PHI minimization, payer-specific appeal levels, submission deadlines, state/federal applicability or provider review.
- “Ready-to-sign PDF” is an unsafe operational claim.

**Production fix:** only draft from supplied EOB/payer policy/guidelines; mark absent sources as `[SOURCE REQUIRED]`; prohibit invented legal/coding claims; use a clinician/coder sign-off and a PHI-compliant environment.

---

### 4.23 O22 — Technical Interview Scorecard — 50/100

**What is good**

- Evidence, interviewer alignment, inconsistencies and missing data are useful debrief features.
- A competency framework and structured scores can improve consistency if externally defined.
- The prompt recognizes split decisions and bias indicators.

**Critical defects**

- “Culture Fit” is vague and can encode similarity bias or discrimination. Replace it with observable, job-related behaviors.
- It asks for a final hire/no-hire recommendation, offer parameters and compensation despite the absence of a validated decision policy.
- Candidate name, current company and other personal data are not necessary for scoring and increase privacy risk.
- “Defensible if challenged” is not achieved by a prompt; employment decisions need a documented, validated process and human accountability.

**Production fix:** make it evidence normalization only. Use anchored rubrics tied to job competencies, remove protected/personal attributes, capture interviewer rationale, monitor adverse impact and require a trained hiring panel to make the decision.

---

### 4.24 O23 — SEO Content Gap Analysis — 52/100

**What is good**

- It captures audience, goals, capacity, intent mix and existing inventory.
- The cluster map, calendar, briefs, internal links and resource plan are practical outputs.
- It explicitly asks for conservative traffic projections.

**Critical defects**

- Listing competitor URLs does not give the model live rankings, traffic, domain authority or keyword difficulty.
- The prompt asks for exact monthly traffic and ROI numbers without requiring a tool result or timestamp.
- “Top 3 within six months” is not a valid generic target.
- No technical SEO, content quality, cannibalization, SERP feature, localization or YMYL review is included.

**Production fix:** feed timestamped exports from approved SEO tools and live page data; preserve source URLs and metrics; return ranges and assumptions; separate editorial ideas from validated opportunities; do not claim traffic forecasts without a model.

---

### 4.25 O24 — Multi-Touch Outbound Sequence — 38/100

**What is good**

- It distinguishes ICP, persona, trigger events, channels, testing and disqualification.
- It optimizes for replies rather than vanity open rates.
- Segmentation by enterprise/mid-market/SMB is commercially sensible as a starting hypothesis.

**Critical defects**

- It has no lawful-basis, consent, suppression-list, unsubscribe, regional privacy or platform-terms implementation.
- The “not interested” response asks for a reason after an opt-out and therefore risks continuing unwanted processing.
- It encourages potentially fabricated mutual connections, recent events, social proof and customer outcomes.
- Tracking pixels, LinkedIn activity, endorsements and scraping introduce privacy and platform-compliance issues.
- Seven touches in fourteen days plus a “breakup” gimmick is not automatically appropriate for enterprise buyers.
- Open/reply/acceptance targets are unsupported and should not be treated as forecasts.

**Production fix:** install a legal/compliance layer before copy generation: suppression and DNC checks, lawful basis, consent records, regional templates, truthful personalization with source links, frequency caps, and immediate stop processing after opt-out.

---

### 4.26 O25 — PRD Generator — 74/100

**What is good**

- This is the most complete general-purpose operational template in the portfolio.
- It covers problem evidence, JTBD, metrics, requirements, UX/error states, NFRs, dependencies, scope, rollout, rollback, decisions and sign-off.
- It gives engineering and design a useful shared handoff shape.

**Critical defects**

- It asks research notes to generate architecture, API endpoints, database schema and exact performance targets that may not be known.
- Quotes, sample sizes, competitor features and targets can be invented unless the source text is rigidly preserved.
- The prompt mentions RICE/ICE/Kano but does not actually calculate or apply a prioritization method.
- The template is so long that it may produce low-signal boilerplate and hide the key decision.
- “Confidence” is self-reported rather than measured against evidence coverage.

**Production fix:** split into a research-evidence pass and a PRD drafting pass. Carry source IDs for every claim, mark unknown fields `TBD`, require engineering to own technical design, define a real prioritization formula, and use a short executive decision section before the long appendix.

---

### 4.27 O26 — Churn Risk and Intervention Playbook — 62/100

**What is good**

- It covers usage, engagement, relationship and commercial signals.
- It turns risk into owners, timelines, resource requirements, no-go criteria and systemic fixes.
- The health-score formula is at least explicit instead of hidden.

**Critical defects**

- Risk scores, intervention success rates and retention probabilities are placeholders presented in predictive language.
- The weights and thresholds are not calibrated against historical outcomes and may create false precision.
- Correlation does not establish root cause; e.g., lower usage may follow an already-decided cancellation.
- Expansion recommendations for healthy accounts can create pressure or conflict with customer intent.
- Account/usage/support data can contain personal or commercially sensitive information.

**Production fix:** use a validated, calibrated model or call the result a heuristic. Show feature provenance, cohort performance, uncertainty and calibration. Keep interventions and concessions behind CSM/leadership approval and enforce privacy/retention controls.

---

### 4.28 O27 — A/B Test Results Synthesis — 67/100

**What is good**

- It explicitly asks about SRM, power, duration, guardrails, multiple testing, segments, confidence intervals and business impact.
- It distinguishes statistical from practical significance.
- The next-step and rollout sections are useful for stakeholder communication.

**Critical defects**

- A language model should not calculate p-values, confidence intervals, power or Bayesian probabilities from pasted text as the authoritative result.
- The decision matrix is too simple for sequential peeking, multiple variants, ratio metrics, clustered/account experiments, novelty effects, CUPED, interference or noncompliance.
- The glossary says a p-value is the probability that results occurred by chance, which is an inaccurate simplification.
- “Achieved power” is often misused after observing results; post-hoc power is not a substitute for interval precision.
- There is no requirement for a preregistered estimand, analysis plan, or raw-data/code reproducibility.

**Production fix:** compute in R/Python or the experiment platform, pass verified statistics to the model, include the analysis method and estimand, preserve the experiment ID and query, and make ship decisions human-approved.

---

### 4.29 O28 — Long GovCon RFP Compliance Matrix — 73/100

**What is good**

- This is one of the highest-value concepts: Sections C/L/M, requirements, page limits, formats, evaluation factors, deliverables, ambiguities, questions, outline and writing assignments.
- Verbatim requirement text and source paragraph references are exactly the right audit direction.
- The outputs can map cleanly to proposal-management systems.

**Critical defects**

- “Every Shall/Must/Will” is not a complete or correct semantic rule; the prompt itself says “Will” is mandatory in one place.
- It omits or under-specifies Sections A/B/H/I/J, attachments, exhibits, forms, amendments, incorporated standards, clauses and portal metadata.
- Plain extracted text may destroy page, table, footnote and paragraph coordinates.
- “100% accurate” and 98% success are not defensible without a measured recall benchmark.
- Proposal-section mappings, win themes and writing assignments may be reasonable guesses, not RFP facts.
- Output size can exceed context or become operationally unwieldy.

**Production fix:** ingest the original versioned RFP and all incorporated material; preserve coordinates and amendments; classify each extracted item semantically; expose unmapped/conflicting requirements; use chunked output and a completeness validator; require a proposal manager to certify the matrix.

---

### 4.30 O29 — Long Cash/Bank/PSP Reconciliation — 68/100

**What is good**

- The prompt recognizes clearing accounts, timing differences, fees, chargebacks, FX and close bottlenecks.
- The SOP and exception-register design could be useful around a real reconciliation engine.
- It includes owner/SLA/support fields and a controller-review gate.

**Critical defects**

- The sample JEs contain realistic-looking account numbers, amounts, customer IDs and a `ch_abc123` reference. These examples can contaminate a generated workpaper or be mistaken for actual data.
- It describes matching as “deterministic,” but an LLM output is not a controlled matching engine.
- Generic confidence values such as “100%” and “95%” are not calibrated.
- It can recommend postings affecting cash, AR, revenue or FX without accounting-policy context.
- It proposes auto-approval thresholds without entity policy, segregation of duties or audit controls.

**Production fix:** remove realistic fake examples or label them unmistakably as non-production fixtures; use source-row IDs and a double-entry engine; require account-policy mapping, support attachments, segregation-of-duties checks and controller approval. Let the model draft exception narratives, not post entries.

---

### 4.31 O30 — Long Medical Denial Appeal — 30/100

**What is good**

- It has richer patient/claim/denial/payer input fields than the concise version.
- It requests denial-specific arguments, supporting documents and provider review.
- The checklist catches some obvious clerical failures.

**Critical defects**

- It invites invented medical guidelines, payer policies, FDA status, NCCI positions, state insurance statutes, appeal rights and deadlines.
- The text includes universal-sounding assertions such as payment within 30 days and “deemed approval,” which are not safe defaults across payers and jurisdictions.
- The citation to 42 CFR §411.15 is not a general definition that can simply be used to support every medical-necessity appeal.
- “80%+ overturn rate” is an unsubstantiated performance claim.
- It handles highly sensitive PHI and produces a ready-to-send legal/medical document.
- It tells the model to write “medical-legal arguments” while disclaiming legal-advice risk.

**Disposition:** do not deploy as written. Build a payer-policy-grounded drafting assistant that quotes only supplied authority, marks missing sources, minimizes PHI, and requires billing, coding and provider review before submission.

---

### 4.32 O31 — Enterprise RFP/RFI Response and Win Themes — 57/100

**What is good**

- Customer context, pain points, strategic priorities, compliance-first answering and win-theme placement are useful.
- The response sections cover technical, implementation, pricing, support, security, references and risk.
- The checklist recognizes pricing, commitments, references and executive approval.

**Critical defects**

- It repeatedly supplies invented-looking certifications, encryption standards, SLAs, uptime, customer outcomes, response times, pricing, references and implementation timelines.
- “No mention of competitors by name” does not prevent unsupported superiority claims.
- The prompt does not require a claim/evidence ID or a source location for each promise.
- “Complete RFP response” is too broad without a question-by-question parser, required forms, page constraints and legal/commercial policy.
- Security, data residency and service commitments are contractual commitments, not copywriting.

**Production fix:** split into compliance extraction, approved-answer retrieval, draft response, and commitment review. Require every claim to resolve to an evidence-library item or `MISSING APPROVED EVIDENCE`; block unsupported certifications, pricing and SLAs.

---

### 4.33 O32 — Comprehensive SRE Post-Mortem — 69/100

**What is good**

- It covers impact, timeline, metrics, proximate/contributing/systemic factors, wins, failures, actions, lessons and review gates.
- It is substantially more useful than a generic “write a post-mortem” prompt.
- The blameless orientation is appropriate.

**Critical defects**

- The long template contains hypothetical example details such as a missing database index, 1M users and specific SQL. A model may repeat these as if they were facts.
- It treats five whys and “systemic root cause” as mandatory even when evidence only supports a proximate cause.
- “Incident resolved: root cause fixed” conflates restoration, mitigation and permanent correction.
- Names, owners and dates are placeholders; the report cannot be final without an incident directory and ticket links.
- Revenue, SLA credits, user impact and error budget data can be hallucinated if absent.

**Production fix:** move examples outside the runtime prompt; require source citations and an explicit facts/inferences/unknowns split; allow unresolved root cause; distinguish detected/mitigated/resolved/remediated; create action tickets and perform privacy review.

---

### 4.34 M1 — Google AI Studio monetization meta-prompt — 42/100

This is not an enterprise workflow prompt; it is a constrained ideation prompt at the end of `PROMPTS.md`.

**What is good**

- It forces implementation steps, customer, revenue mechanics, cost, moat and risks.
- Ranking dimensions and anti-pattern filters can improve brainstorming discipline.

**Critical defects**

- It is dated “as of December 2025”; the current review date is August 2026, so its platform/model/pricing assumptions need refresh.
- It asks for “latest” capabilities and exact current API pricing without requiring live sources or a browsing/tool step.
- “Genuinely untapped,” “zero AI saturation,” “already has 10+ competitors,” and “featured in major newsletters” are not operationally defined or measurable.
- Realistic month-one revenue and first-mover moat are speculative unless validated with interviews, search, competitor and pricing data.
- It forces exactly ten ideas, which encourages filler after the best few.

**Production fix:** make it a research workflow: collect dated sources, record evidence and counterevidence, score demand and competition with a defined rubric, produce scenario ranges, identify assumptions, and separate hypothesis from validated opportunity.

---

## 5. Cross-cutting defects across the portfolio

### A. Confidence scores are not evidence
“Confidence: 92%” generated by the same model that produced the answer is not a calibrated probability. Replace it with measurable fields such as:

- Source coverage: percentage of required inputs with source IDs
- Quote exactness: exact-match rate against source text
- Calculation check: passed/failed by a deterministic validator
- Rule coverage: rules evaluated / rules required
- Unknown rate: unresolved items / total items
- Human override rate and error rate on a labeled test set

### B. “No clarifying questions” is usually the wrong enterprise policy
Missing party role, jurisdiction, contract playbook, RFP attachments, statistical method, payer policy, accounting policy, or incident telemetry should cause a structured `BLOCKED`/`NEEDS_INPUT` status. A confident assumption is not a substitute for a required fact.

### C. “Based only on provided data” conflicts with many requested outputs
Several prompts simultaneously require source-only analysis and ask for market comparisons, legal validity, clinical standards, current laws, valuation impact, root cultural causes, traffic estimates or competitor positioning. Every output should label:

1. **Observed:** directly supported by a source
2. **Calculated:** reproducible from cited inputs
3. **Inferred:** reasoned hypothesis
4. **Unknown:** cannot be established
5. **Recommended:** proposed action, not a fact

### D. Long templates create omission risk
A 5,000-word output skeleton does not guarantee completeness. It can reduce signal-to-noise, exceed context/output limits and make reviewers skip the important parts. Use a compact decision layer plus linked appendices generated in separate stages.

### E. Structured output is not the same as valid output
A Markdown table or JSON-looking block can still contain wrong quotes, invalid JSON, truncated code, unbalanced numbers or inconsistent IDs. Every machine output needs a parser and validation step outside the model.

### F. Human review gates are too weak or too late
“Attorney review required,” “controller review required,” or “provider review required” at the bottom of a prompt is not an enforcement mechanism. The integration must prevent downstream action until the required approval is recorded.

### G. The deployment notes are aspirational
Naming Ironclad, Jira, Greenhouse, Gainsight, Excel, GitHub Actions or Confluence does not establish an integration. A production specification needs API/authentication boundaries, data retention, failure behavior, idempotency, rate limits, retry policy, access control and observability.

### H. Prompt injection and data handling are not addressed
Contracts, RFPs, logs, support tickets, customer notes and PDFs are untrusted input. The prompts need an explicit rule that embedded instructions inside source documents are data, not instructions. Sensitive inputs also need redaction, tenant isolation, retention and deletion controls.

---

## 6. D.L.A. economics audit

The arithmetic of many individual scorecards is internally close, but the economic model is not a reliable business case.

### Problems in the calculation

- `GrossLaborValue = hours × hourly rate` assumes the entire manual task disappears. In practice the output still requires ingestion, exception handling, review, corrections, approvals and recordkeeping.
- The stated hourly rate may be a billing rate, not an avoidable cost or realized customer savings.
- WaitCost assumes the reviewer is idle during generation; enterprise workflows often run asynchronously.
- ReadingCost is often understated because domain review is the main control, not a trivial parse.
- FixingCost is an arbitrary rerun percentage and does not model false negatives, which are especially expensive in legal, security, finance and medical work.
- API cost excludes OCR, retrieval, embeddings, tool calls, storage, logging, retries, guard models, privacy controls, integration and support.
- “Throughput multiplier” is not measured accuracy or adoption.
- Claimed success rates from 85% to 98% have no benchmark, sample size, task definition, confidence interval or failure taxonomy.

### Realistic value model

Use a range such as:

`Expected annual value = volume × (verified minutes avoided × loaded avoidable cost) × adoption × first-pass yield − human review cost − platform/integration cost − expected error loss`

For high-stakes work, show at least three scenarios: conservative, expected and upside. Do not price a prompt from a senior attorney’s billable rate unless the buyer has demonstrated that the work is actually displaced and can be accepted by a lower-cost workflow.

### Scorecard inconsistencies found

- The medical scorecard claims `$94.20`; the visible arithmetic is approximately `$94.26` using the displayed deductions.
- The OPUSMADE initial catalogue has inconsistent counts and values, including an M&A top-five value not matching its visible row.
- The OPUSMADE final total may be arithmetically consistent with its stated aggregate numbers, but those aggregates are not reproducible from the visible prompt bodies and missing prompt numbers.
- A `$20 minimum threshold` is a business rule, not evidence that a prompt creates enterprise value.

---

## 7. Recommended consolidation plan

Do not sell 34 prompt variants. Consolidate into a smaller portfolio of controlled workflow products.

| Product/workflow | Merge these | Keep | Remove or change |
|---|---|---|---|
| Contract review copilot | P1, P4, P7, P10, P16 | Playbook rules, source spans, fallback redlines | Default jurisdiction, auto-sign instruction, unsupported market/legal claims |
| IaC security copilot | P2, P11, P22 | Threat context plus scanner evidence | LLM-only CI blocking, auto-remediation scripts, unversioned compliance mappings |
| M&A diligence workbench | P3, P6, P12, P23 | Evidence ledger, missing-doc list, management questions | One-context-room design, unsupported valuation numbers |
| Incident learning workflow | P5, P18, O32 | Source-linked timeline, blameless actions | Forced five whys, hypothetical examples, invented systemic causes |
| GovCon compliance workbench | P24, O28 | C/L/M matrices, attachments, page limits, writing assignments | Keyword-only logic and “100% accuracy” claims |
| Reconciliation copilot | P9, O29 | Exception taxonomy and close SOP | LLM matching/posting; use a deterministic engine |
| RFP response copilot | P17, O31 | Approved evidence and per-question answer structure | Unverified claims, certifications, SLAs, references and pricing |
| Medical appeal drafting | P25, O30 | Payer-policy-grounded drafting only | Statute/guideline invention, universal deadlines, ready-to-send automation |
| Product discovery/PRD | O25 | Evidence-backed research synthesis and decision PRD | Auto-generated architecture/schema unless explicitly supplied |
| Experiment analysis | O27 | Executive interpretation of verified statistics | LLM-as-calculator and simplistic ship matrix |
| GRC evidence triage | P8 | Evidence register and package specification | Best-effort control mappings |
| CS health review | O26 | Action planning with calibrated model inputs | Placeholder probabilities and automatic concessions |

HR, SEO, outbound, lease and executive-reporting prompts can remain separate, but only after domain-specific policy, source and approval changes.

---

## 8. Minimum enterprise architecture for these prompts

1. **Intake validator**
   - Validate required fields, file type, period, jurisdiction, policy version and tenant.
   - Block or route when critical inputs are missing; do not silently assume.

2. **Source preservation**
   - Store document ID, version, page/table/line/span, timestamp and hash.
   - Treat source content as untrusted data, not instructions.

3. **Deterministic extraction/calculation layer**
   - Contract clause parser/diff engine
   - IaC parser, Terraform plan and scanners
   - Financial/reconciliation/statistical code
   - RFP coordinates and amendment resolver
   - Payer-policy and approved-claims retrieval

4. **LLM reasoning layer**
   - Give it structured facts and cited excerpts.
   - Require facts/inferences/unknowns separation.
   - Use a strict JSON schema; render Markdown downstream.

5. **Verifier layer**
   - Exact quote check
   - Arithmetic and double-entry balance check
   - JSON/schema validation
   - Rule/control coverage check
   - Unsupported-claim detector
   - PII/PHI/secret scan
   - Citation/source-span check

6. **Decision and approval layer**
   - No signature, posting, deployment block, patient submission, hiring decision or external send until approval is recorded.
   - Enforce segregation of duties where applicable.

7. **Evaluation and monitoring**
   - Golden datasets by domain
   - Recall and false-negative measurement
   - Human override and escalation rate
   - Citation/quote exactness
   - Calibration of confidence/probability
   - Cost, latency, failure and retry metrics
   - Adversarial/prompt-injection tests
   - Versioned regression tests for every prompt change

---

## Final recommendation

**Keep the underlying ideas; do not keep the portfolio claims.** The strongest commercial story is a set of supervised, evidence-grounded workflow accelerators with measurable time savings—not “certified digital employees” that are already enterprise ready.

Prioritize a pilot of **O25 PRD, O28 GovCon, P8 evidence triage, P7 contract playbook, and O32 SRE**. Build them with external validators and labeled evaluation sets. Merge duplicates before selling. Rewrite or quarantine the **medical, outbound, hiring, auto-remediation, auto-posting and auto-signature** flows until their domain governance is implemented.

The portfolio can become credible, but its present maturity is best described as:

> **Well-presented enterprise prompt library / workflow blueprint — not validated production automation.**
