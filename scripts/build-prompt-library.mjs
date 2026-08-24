/**
 * Prompt Foundry — builds the fullKONK_> specialized prompt library.
 *
 * Deterministic assembly: 12 category blueprints × 4 pipeline tasks
 * (architect / frontend / backend / verify) = 48 enterprise-grade prompts,
 * every one carrying the KONKRED operating envelope (typed contracts, zod
 * validation, no secrets client-side, honest states, human review).
 *
 * The same architecture scales to 1000: more categories and variants feed
 * the same assembler (see owner-docs/PROMPT_FOUNDRY.md for the scale-up
 * plan the owner can run with any frontier model).
 *
 * Output: content/fullkonk/prompts/library.json
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const VERSION = 'konkred-seed-v1';
const UPDATED = '2026-08-23';

/* ── category blueprints: real domains, concrete entities ── */
const CATEGORIES = [
  {
    id: 'invoicing-billing', name: 'Invoicing & Billing',
    entities: 'customers, invoices, line items, tax rates, payments, dunning rules, credit notes',
    flows: 'draft → send → partial-pay → settle; recurring schedules; overdue escalation; refunds as credit notes',
    data: 'invoices(id, customer_id, status, due_at, currency, totals); line_items; payments; plans; subscriptions',
    standards: 'money as integer minor units, idempotent payment webhooks, tax lines stored not recomputed, no client-side price authority',
    edge: 'double-send race, partial refund after write-off, currency mismatch on late payment',
  },
  {
    id: 'crm-pipeline', name: 'CRM & Sales Pipeline',
    entities: 'leads, contacts, accounts, deals, activities, stages',
    flows: 'capture → qualify → stage moves with reason codes → win/loss with cause; activity logging',
    data: 'deals(id, account_id, stage, value, probability, expected_close); activities; stage_history',
    standards: 'every stage change stores who/when/why; probabilities are advisory not predictive claims; soft-delete with audit',
    edge: 'deal reopened after close, contact merged across accounts, duplicate lead capture',
  },
  {
    id: 'booking-scheduling', name: 'Booking & Scheduling',
    entities: 'resources, services, availability rules, bookings, waitlist entries',
    flows: 'availability check → hold (TTL) → confirm → reschedule/cancel with policy; waitlist promotion',
    data: 'bookings(id, resource_id, service_id, window_start, window_end, status); availability_rules; holds',
    standards: 'timezone-explicit windows, pessimistic hold or optimistic concurrency on slots, cancellation policy evaluated server-side',
    edge: 'double-booking race on last slot, DST shift on recurring bookings, no-show fee vs policy',
  },
  {
    id: 'commerce-ops', name: 'Commerce Operations',
    entities: 'products, SKUs, inventory, orders, fulfillments, returns',
    flows: 'cart → order → payment → allocation → fulfillment split → return/RMA',
    data: 'orders(id, status, totals); order_items; inventory(sku_id, location, on_hand, reserved); shipments; rmas',
    standards: 'reserve-then-commit inventory, totals computed server-side from price book, returns never mutate history',
    edge: 'oversell during flash concurrency, split shipment partial return, price change after order',
  },
  {
    id: 'content-cms', name: 'Content & CMS',
    entities: 'documents, blocks, media, revisions, publications, roles',
    flows: 'draft → review → scheduled publish → unpublish; revision compare/rollback',
    data: 'documents(id, status, published_at); revisions(document_id, body, author); media; roles',
    standards: 'immutable revisions, publication is a pointer to a revision, RBAC on workflow transitions',
    edge: 'concurrent edits on one draft, scheduled publish while unpublished revision exists, media orphaning',
  },
  {
    id: 'analytics-dashboards', name: 'Analytics & Dashboards',
    entities: 'events, metrics, segments, dashboards, alerts',
    flows: 'event ingest → validation → aggregation → segment queries → dashboard render; threshold alerts',
    data: 'events(id, name, props, occurred_at); metric_definitions; segments; dashboards; alert_rules',
    standards: 'events validated against a versioned schema, aggregates materialized not recomputed per request, alert thresholds explicit',
    edge: 'late-arriving events after aggregation, metric definition change vs historical series, timezone bucketing',
  },
  {
    id: 'auth-identity', name: 'Auth & Identity',
    entities: 'users, sessions, credentials, tenants, roles, invitations',
    flows: 'signup → verify → login → session lifecycle → password reset → invite accept; tenant membership',
    data: 'users(id, email, status); sessions(token_hash, expires_at); memberships(user_id, tenant_id, role)',
    standards: 'passwords hashed (argon2/bcrypt), sessions stored as hashes with expiry+revocation, least-privilege roles, reset tokens single-use and time-boxed',
    edge: 'email reuse across tenants, session revocation on password change, invitation expiry',
  },
  {
    id: 'chat-messaging', name: 'Chat & Messaging',
    entities: 'conversations, participants, messages, attachments, read states',
    flows: 'start conversation → send → edit/delete window → read receipts → presence',
    data: 'conversations(id, type); messages(id, conversation_id, sender_id, body, sent_at, edited_at); read_states',
    standards: 'delivery at-least-once with client dedupe keys, edit window enforced server-side, attachments scanned and size-capped',
    edge: 'multi-device read state, message during participant removal, backpressure on history scroll',
  },
  {
    id: 'hr-onboarding', name: 'HR & Onboarding',
    entities: 'candidates, applications, interview stages, offers, employees, tasks',
    flows: 'application → screening → interview loop → decision (human, reason-coded) → offer → onboarding task chain',
    data: 'applications(id, candidate_id, stage, status); stage_events; offers; onboarding_tasks',
    standards: 'no automated reject decisions — human decision records with reason codes; PII minimized and access-logged; retention clocks on applicants',
    edge: 'candidate reapplies after rejection window, offer declined → reopen stage, GDPR erasure vs audit trail',
  },
  {
    id: 'project-management', name: 'Project Management',
    entities: 'projects, tasks, assignees, sprints, dependencies, attachments',
    flows: 'backlog → sprint planning → in-progress → review → done; dependency blocking; scope change log',
    data: 'tasks(id, project_id, assignee_id, status, estimate, sprint_id); dependencies(task_id, blocks_id); change_log',
    standards: 'status transitions validated against workflow, dependency cycles rejected, estimates stored as submitted not inferred',
    edge: 'task moved across sprints mid-flight, dependency removed after block resolved, concurrent assignee change',
  },
  {
    id: 'education-lms', name: 'Education & LMS',
    entities: 'courses, lessons, enrollments, progress, assessments, grades',
    flows: 'enroll → lesson progression gated on completion → assessment attempt → grade release',
    data: 'enrollments(user_id, course_id, status); progress(lesson_id, user_id, completed_at); attempts; grades',
    standards: 'attempts immutable once submitted, grades released explicitly not automatically on submit, progress derived from events',
    edge: 'late enrollment mid-course, retake policy, lesson reorder after progress exists',
  },
  {
    id: 'support-desk', name: 'Support Desk',
    entities: 'tickets, customers, SLA policies, macros, escalations, CSAT',
    flows: 'intake → triage → assign → SLA clock → resolve → CSAT; escalation on breach risk',
    data: 'tickets(id, customer_id, priority, status, sla_due_at); events; sla_policies; csat',
    standards: 'SLA computed from policy version at ticket open, every state change an event, macros expand into reviewable drafts — never auto-sent',
    edge: 'reopen after resolve restarts SLA subset, priority change mid-ticket, customer merge',
  },
];

/* ── pipeline task templates (roles from the fullKONK docs) ── */
const ENVELOPE = [
  'OUTPUT CONTRACT: code in fenced blocks, each fence tagged with its file path.',
  'QUALITY: typed end-to-end (no any), zod-validated inputs at every boundary, errors handled and surfaced honestly — empty/error states are designed, never blank.',
  'SAFETY: no secrets or tokens client-side; no external side effect without an explicit server action.',
].join(' ');

const TASKS = {
  architect: {
    title: 'System architecture for',
    body: (c) => `You are the ARCHITECT stage of fullKONK_>. Design the complete system for a ${c.name} product.
DOMAIN ENTITIES: ${c.entities}.
CORE FLOWS: ${c.flows}.
DATA MODEL (reference): ${c.data}.
STANDARDS: ${c.standards}.
EDGE CASES TO DESIGN FOR: ${c.edge}.
Deliver, in order: (1) tech stack with one-line justifications, (2) component tree, (3) API contract — every endpoint with method, request/response types, error codes, (4) complete database schema with relations and indexes, (5) project file structure, (6) the three riskiest edge cases and how the design absorbs them. No code yet — decisions and contracts only. ${ENVELOPE}`,
  },
  frontend: {
    title: 'Frontend build for',
    body: (c) => `You are the FRONTEND BUILD stage of fullKONK_>. Implement the UI for a ${c.name} product from the approved architecture.
DOMAIN CONTEXT: entities are ${c.entities}; primary flows: ${c.flows}.
Build: typed React components (or the stack the architect chose), data-fetching with loading/error/empty states for every view, forms with client validation mirroring the server zod schemas, and navigation covering the flows above. Do not invent endpoints — code against the API contract. Do not fake data; every list has a real empty state. ${ENVELOPE}`,
  },
  backend: {
    title: 'Backend build for',
    body: (c) => `You are the BACKEND BUILD stage of fullKONK_>. Implement the server for a ${c.name} product from the approved architecture.
DATA MODEL: ${c.data}. STANDARDS: ${c.standments ?? c.standards}. EDGE CASES: ${c.edge}.
Build: API routes per the contract with zod request validation and typed responses, the database schema/migrations, service functions enforcing the flows (${c.flows}) with explicit transaction boundaries, and auth/permission checks on every protected route. Money/dates per standards. Every failure returns a typed error — never a silent catch. ${ENVELOPE}`,
  },
  verify: {
    title: 'Integration verification for',
    body: (c) => `You are the VERIFY stage of fullKONK_>. Review the frontend and backend of a ${c.name} product against the architecture.
CHECK: (1) every API endpoint the frontend calls exists with matching types, (2) DB schema covers all entities — ${c.entities} — and their relations, (3) type consistency across boundaries (no silent coercions), (4) auth applied on every protected route, (5) the edge cases ${c.edge} are actually handled, not just mentioned, (6) empty/error states exist for every async view.
OUTPUT: a findings table (severity, file, issue, exact fix) then corrected code only for real defects. Do not rewrite working code stylistically. ${ENVELOPE}`,
  },
};

/* ── assemble ── */
const library = [];
for (const c of CATEGORIES) {
  for (const [task, def] of Object.entries(TASKS)) {
    library.push({
      id: `${c.id}:${task}`,
      category: c.id,
      categoryName: c.name,
      task,
      title: `${def.title} ${c.name}`,
      body: def.body(c),
      version: VERSION,
      updatedAt: UPDATED,
    });
  }
}

const out = {
  manifest: {
    name: 'fullKONK_> specialized prompt library',
    version: VERSION,
    generatedAt: UPDATED,
    counts: { total: library.length, categories: CATEGORIES.length, tasks: Object.keys(TASKS).length },
    scalePlan: 'Seed set assembled deterministically. Scale path to 1000: 25 categories × 10 variants — see owner-docs/PROMPT_FOUNDRY.md.',
    envelope: 'Every prompt enforces typed contracts, zod validation, honest empty/error states, no client-side secrets, no silent side effects.',
    integrityNote: 'Prompts are build instructions for generated products. They never claim certification, accuracy, or guaranteed outcomes.',
  },
  prompts: library,
};

mkdirSync('content/fullkonk/prompts', { recursive: true });
writeFileSync('content/fullkonk/prompts/library.json', JSON.stringify(out, null, 2) + '\n');
console.log(`prompt library: ${library.length} prompts across ${CATEGORIES.length} categories × ${Object.keys(TASKS).length} tasks`);
