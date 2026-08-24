# fullKONK_> PROMPT FOUNDRY — the engineered master prompt

**برای صاحب محصول (فارسی):** این سند یک «پرامپت کارخانه» است. کافیه بخش MASTER PROMPT رو
کپی کنی توی قوی‌ترین مدلی که داری (Claude / GPT / Gemini)، ۲۰ بار اجرا کنی (هر بار یک دسته)،
و خروجی JSON رو همون‌جا توی `owner-docs/prompts/` آپلود کنی. نتیجه: کتابخانه ۱۰۰۰تایی با
کیفیت یکدست — چون هر بچ از همین قاعده واحد ساخته میشه. من هسته ۴۸تایی رو از قبل ساختم و
pipeline الان ازش استفاده می‌کنه.

---

## MASTER PROMPT (copy everything between the lines)

────────────────────────────────────────────────────
You are the KONKRED PROMPT FOUNDRY. Your job is to manufacture specialized
build prompts for fullKONK_>, an AI product builder with a 3-stage pipeline
(ARCHITECT → parallel FRONTEND + BACKEND build → VERIFY).

Run profile: CATEGORY = {fill one from the matrix below}, VARIANT BATCH = 10.

### Step 1 — Recall the category
Write down (do not skip): the domain's entities, its 4–6 core flows, its
reference data model, its 3 engineering standards (money/time/permissions
rules), and its 3 hardest edge cases. Be concrete and senior-level. If any
item is generic filler, the batch fails.

### Step 2 — Manufacture 10 prompts
For variant 1–10, pick a distinct realistic sub-product of the category
(e.g. for Booking: clinic scheduling, field-service dispatch, classroom
booking, restaurant floor, equipment rental, …). For each sub-product write
ALL FOUR pipeline prompts (architect, frontend, backend, verify), so each
variant contributes 4 entries → 40 entries per run.

### Quality law (every prompt obeys)
- Role + stage is stated first ("You are the ARCHITECT stage of fullKONK_>").
- Concrete entities/flows from Step 1 — no "etc.", no "as needed".
- OUTPUT CONTRACT: code in fenced blocks, each fence tagged with its file path.
- Typed end-to-end, zod validation at boundaries, designed empty/error states.
- No secrets client-side; no external side effect without an explicit server action.
- NEVER claim: certified, bug-free, deploy-ready, production-guaranteed, X% accurate.
- Length 700–1500 characters. Dense, imperative, zero fluff paragraphs.

### Output format (strict JSON — no prose around it)
```json
{ "batch": { "category": "<category-id>", "variantCount": 10, "generatedAt": "<date>", "source": "owner-run prompt-foundry v1" },
  "prompts": [
    { "id": "<category-id>:<variant-slug>:<task>",
      "category": "<category-id>", "categoryName": "<Human Name>",
      "task": "architect|frontend|backend|verify",
      "title": "<Task> for <Sub-product>",
      "body": "<the prompt>", "version": "foundry-v1", "updatedAt": "<date>" }
  ] }
```

### Self-check before answering (fix, then output)
1. Exactly 40 prompt objects, unique ids. 2. Every body 700–1500 chars.
3. No banned claims. 4. Every body names real entities from Step 1.
5. JSON parses. If any check fails, repair silently and re-verify.
────────────────────────────────────────────────────

## The 25-category matrix (25 × 40 = 1000)

| # | Category id | Category |
|---|---|---|
| 1 | invoicing-billing | Invoicing & Billing ✅ seeded |
| 2 | crm-pipeline | CRM & Sales Pipeline ✅ seeded |
| 3 | booking-scheduling | Booking & Scheduling ✅ seeded |
| 4 | commerce-ops | Commerce Operations ✅ seeded |
| 5 | content-cms | Content & CMS ✅ seeded |
| 6 | analytics-dashboards | Analytics & Dashboards ✅ seeded |
| 7 | auth-identity | Auth & Identity ✅ seeded |
| 8 | chat-messaging | Chat & Messaging ✅ seeded |
| 9 | hr-onboarding | HR & Onboarding ✅ seeded |
| 10 | project-management | Project Management ✅ seeded |
| 11 | education-lms | Education & LMS ✅ seeded |
| 12 | support-desk | Support Desk ✅ seeded |
| 13 | logistics-fleet | Logistics & Fleet |
| 14 | inventory-warehouse | Inventory & Warehouse |
| 15 | real-estate-listings | Real Estate & Listings |
| 16 | fitness-wellness | Fitness & Wellness Studios |
| 17 | restaurant-pos | Restaurant & POS |
| 18 | event-management | Event Management |
| 19 | legal-matter | Legal Matter Management |
| 20 | accounting-ledger | Accounting & Ledger |
| 21 | healthcare-clinical-ops | Healthcare Clinical Ops (non-diagnostic) |
| 22 | insurance-claims | Insurance Claims Processing |
| 23 | construction-projects | Construction & Field Projects |
| 24 | media-publishing | Media & Publishing |
| 25 | internal-tools-admin | Internal Tools & Admin Consoles |

**How to run:** 25 runs × 40 prompts = 1000. Save each JSON answer as
`owner-docs/prompts/<category-id>.json`. The agent merges, validates
(same schema + quality law), and regenerates the library.

## Why this beats hand-writing 1000

1. **Consistency** — every prompt inherits the same envelope; hand-written
   libraries drift in quality after the first hundred.
2. **Reviewability** — batches are validated by schema + banned-claim scan
   before entering the pipeline (tests run on every merge).
3. **Cost** — your 25 runs on any frontier model vs. weeks of writing.
4. **The seed already works** — the repo's 48-prompt core is live in
   fullKONK's PLAYBOOK selector today; foundry batches slot into the same file.
