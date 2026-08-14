export interface FullKonkTemplate {
  id: string;
  name: string;
  prompt: string;
}

export const FULLKONK_TEMPLATES: FullKonkTemplate[] = [
  { id: 'invoice', name: 'INVOICE OS', prompt: 'A SaaS invoice management dashboard with Stripe billing, role-based teams, recurring invoices, PDF export, and payment reminders.' },
  { id: 'kanban', name: 'LIVE KANBAN', prompt: 'A real-time collaborative kanban board with WebSocket presence, comments, activity history, and optimistic drag-and-drop.' },
  { id: 'cms', name: 'MULTI-TENANT CMS', prompt: 'A multi-tenant CMS with RBAC, editorial workflows, asset management, version history, and analytics.' },
  { id: 'developer', name: 'API PORTAL', prompt: 'An API developer portal with key management, documentation, usage analytics, webhooks, and rate limiting.' },
  { id: 'commerce', name: 'COMMERCE OPS', prompt: 'A headless commerce operations console with inventory, order workflows, customer support, and sales analytics.' },
  { id: 'booking', name: 'BOOKING NETWORK', prompt: 'A multi-location booking platform with staff calendars, availability rules, payments, reminders, and customer self-service.' },
];
