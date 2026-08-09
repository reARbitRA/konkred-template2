
export interface EnterpriseTool {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  systemPrompt: string;
  schema: any;
  exampleData: any;
}

export const ENTERPRISE_CATEGORIES = [
  { id: 'recon', label: 'Reconciliation & Close', icon: 'RefreshCw' },
  { id: 'audit', label: 'Data Quality & ERP', icon: 'ShieldCheck' },
  { id: 'procurement', label: 'AP & Vendor Flow', icon: 'Layers' },
  { id: 'reporting', label: 'Analytics & Dashboards', icon: 'BarChart3' },
  { id: 'cfo', label: 'CFO Strategic', icon: 'GanttChart' },
  { id: 'time', label: 'Time Recapture', icon: 'Clock' },
  { id: 'erp', label: 'ERP Automation', icon: 'Cpu' },
  { id: 'autonomous', label: 'Autonomous Agents', icon: 'Terminal' }
];

export const ENTERPRISE_TOOLS: EnterpriseTool[] = [
  // --- RECON & CLOSE ---
  {
    id: 'ent-01',
    category: 'recon',
    title: 'Multi-Entity Reconciliation',
    description: 'Automated bank-to-ledger matching across multiple global legal entities.',
    icon: 'RefreshCw',
    systemPrompt: 'You are a Senior Reconciliation Architect. Analyze the provided bank statement and ledger data. Identify matches, timing differences, and unexplained variances. Output a structured reconciliation report.',
    schema: {
      type: "object",
      properties: {
        matches: { type: "array", items: { type: "object", properties: { date: { type: "string" }, amount: { type: "number" }, ref: { type: "string" }, type: { type: "string" } } } },
        variances: { type: "array", items: { type: "object", properties: { amount: { type: "number" }, reason: { type: "string" }, severity: { type: "string" } } } },
        summary: { type: "string" }
      }
    },
    exampleData: {
      bank: [{ date: "2024-03-01", amount: 1500.00, ref: "TXN-001" }],
      ledger: [{ date: "2024-03-01", amount: 1500.00, ref: "GL-404" }]
    }
  },
  {
    id: 'ent-02',
    category: 'recon',
    title: 'Month-End Close Checklist',
    description: 'Dynamic checklist generator based on specific entity structure and ledger state.',
    icon: 'CheckCircle2',
    systemPrompt: 'Generate a comprehensive month-end close checklist tailored to the provided entity profile and ERP system.',
    schema: {
      type: "object",
      properties: {
        tasks: { type: "array", items: { type: "object", properties: { task: { type: "string" }, owner: { type: "string" }, priority: { type: "string" }, deadline: { type: "string" } } } }
      }
    },
    exampleData: { entity: "Global Tech Inc", systems: ["NetSuite", "ADP"] }
  },
  {
    id: 'ent-03',
    category: 'recon',
    title: 'Variance Analysis Generator',
    description: 'Detects and explains Budget vs. Actual (BVA) variances using AI reasoning.',
    icon: 'BarChart3',
    systemPrompt: 'Perform a detailed variance analysis on the provided budget and actual data. Identify key drivers for over/under performance.',
    schema: {
      type: "object",
      properties: {
        variances: { type: "array", items: { type: "object", properties: { category: { type: "string" }, variance: { type: "number" }, percentage: { type: "string" }, explanation: { type: "string" } } } }
      }
    },
    exampleData: { budget: 50000, actual: 62000, category: "Marketing Spend" }
  },

  // --- DATA QUALITY & ERP ---
  {
    id: 'ent-04',
    category: 'audit',
    title: 'ERP Data Validation',
    description: 'Scans ERP datasets for inconsistencies, duplicates, and missing metadata.',
    icon: 'ShieldCheck',
    systemPrompt: 'You are an ERP Data Integrity Auditor. Scan the provided records for validation errors, formatting issues, or logic gaps.',
    schema: {
      type: "object",
      properties: {
        issues: { type: "array", items: { type: "object", properties: { record_id: { type: "string" }, issue: { type: "string" }, suggestion: { type: "string" } } } }
      }
    },
    exampleData: { records: [{ id: "INV-101", amount: -50, date: "Invalid" }] }
  },

  // --- CFO STRATEGIC ---
  {
    id: 'ent-13',
    category: 'cfo',
    title: 'CFO Strategic Recapture',
    description: 'Analyzes executive schedules to automate low-value reporting and administrative burden.',
    icon: 'Clock',
    systemPrompt: 'Review the executive activity log. Identify tasks that can be delegated to AI agents or automated via workflow.',
    schema: {
      type: "object",
      properties: {
        optimizations: { type: "array", items: { type: "object", properties: { task: { type: "string" }, time_saved: { type: "string" }, agent_type: { type: "string" } } } }
      }
    },
    exampleData: { logs: ["Reviewing manual BVA spreadsheets for 4 hours", "Approval of 50 travel expenses"] }
  },

  // --- AUTONOMOUS AGENTS (The new ones) ---
  {
    id: 'auto-01',
    category: 'autonomous',
    title: 'Autonomous Bug Hunter',
    description: 'Scans codebase for logical errors, UI breaks, and performance bottlenecks.',
    icon: 'Terminal',
    systemPrompt: 'You are an Autonomous Bug Hunter. Analyze the provided code snippets or bug reports. Identify the root cause and provide a fix.',
    schema: {
      type: "object",
      properties: {
        bugs: { type: "array", items: { type: "object", properties: { file: { type: "string" }, severity: { type: "string" }, issue: { type: "string" }, fix: { type: "string" } } } }
      }
    },
    exampleData: { code: "function add(a,b) { return a - b; }" }
  },
  {
    id: 'auto-02',
    category: 'autonomous',
    title: 'UI Auto-Polish',
    description: 'Refines spacing, typography, and color systems to ensure premium aesthetic.',
    icon: 'Palette',
    systemPrompt: 'Refine the UI implementation. Focus on 8px grid system, color contrast (WCAG AA), and typography hierarchy.',
    schema: {
      type: "object",
      properties: {
        improvements: { type: "array", items: { type: "object", properties: { element: { type: "string" }, change: { type: "string" }, rationale: { type: "string" } } } }
      }
    },
    exampleData: { component: "Button with inconsistent padding and low contrast text" }
  },
  {
    id: 'auto-11',
    category: 'autonomous',
    title: 'Ultimate Auto-Fixer',
    description: 'A global agent that performs full-project cleanup, optimization, and bug fixing.',
    icon: 'Wand2',
    systemPrompt: 'Perform a full project review. Scan for bugs, UI/UX issues, performance, and accessibility violations. Output a comprehensive fix plan.',
    schema: {
      type: "object",
      properties: {
        analysis: { type: "object", properties: { bugs: { type: "number" }, ui_ux: { type: "number" }, perf: { type: "number" } } },
        applied_fixes: { type: "array", items: { type: "object", properties: { file: { type: "string" }, summary: { type: "string" } } } }
      }
    },
    exampleData: { project_state: "Unfinished landing page, missing loading states" }
  },
  {
    id: 'ent-08',
    category: 'audit',
    title: 'Journal Entry Generator',
    description: 'Converts unstructured transaction descriptions into double-entry accounting records.',
    icon: 'RefreshCw',
    systemPrompt: 'You are an Expert Accountant. Convert the provided transaction description into a valid double-entry journal record.',
    schema: { type: "object", properties: { entries: { type: "array", items: { type: "object", properties: { account: { type: "string" }, debit: { type: "number" }, credit: { type: "number" } } } } } },
    exampleData: { desc: "Paid $500 for office supplies using petty cash." }
  },
  {
    id: 'ent-10',
    category: 'reporting',
    title: 'Executive Dashboard Data Gen',
    description: 'Synthesizes high-level KPIs and trends for C-suite consumption.',
    icon: 'BarChart3',
    systemPrompt: 'Analyze the raw financial metrics and generate a set of executive-level KPIs and trend summaries.',
    schema: { type: "object", properties: { kpis: { type: "array", items: { type: "object", properties: { label: { type: "string" }, value: { type: "string" }, trend: { type: "string" } } } } } },
    exampleData: { raw: "Revenue $1M, COGS $400k, Last Month Revenue $900k" }
  },
  {
    id: 'ent-20',
    category: 'procurement',
    title: 'Intelligent Payment Run',
    description: 'Optimizes payment timing to maximize early payment discounts and preserve DPO.',
    icon: 'RefreshCw',
    systemPrompt: 'Analyze the provided AP aging and discount terms. Suggest a payment run that maximizes ROI.',
    schema: { type: "object", properties: { payments: { type: "array", items: { type: "object", properties: { vendor: { type: "string" }, amount: { type: "number" }, discount: { type: "number" } } } } } },
    exampleData: { ap: [{ vendor: "Dell", amt: 1000, term: "2/10 n/30", date: "2024-03-05" }] }
  },
  {
    id: 'auto-13',
    category: 'autonomous',
    title: 'Professional Polish Protocol',
    description: 'Transforms basic apps into premium $10k SaaS products with depth and micro-interactions.',
    icon: 'Sparkles',
    systemPrompt: 'Evaluate the app for professional polish. Suggest skeleton loaders, optimistic updates, and toast notifications.',
    schema: { type: "object", properties: { visual_fixes: { type: "array", items: { type: "string" } }, ux_enhancements: { type: "array", items: { type: "string" } } } },
    exampleData: { state: "Simple list with no loading states or feedback" }
  },
  {
    id: 'auto-08',
    category: 'autonomous',
    title: 'Code Quality Upgrader',
    description: 'Refactors complex logic into clean, modular, and type-safe architectures.',
    icon: 'Code2',
    systemPrompt: 'Refactor the provided code for better readability and maintainability. Apply DRY and KISS principles.',
    schema: { type: "object", properties: { refactored_code: { type: "string" }, changes: { type: "array", items: { type: "string" } } } },
    exampleData: { code: "if(x==1){if(y==2){doThing();}}else{doOther();}" }
  },
  {
    id: 'ent-15',
    category: 'cfo',
    title: 'Decision Support Modeler',
    description: 'Creates complex financial scenarios (M&A, Capex, Hiring) via natural language simulation.',
    icon: 'Brain',
    systemPrompt: 'You are a Financial Scenario Analyst. Model the provided business case. Show P&L impact, cash flow burn, and ROI metrics.',
    schema: { type: "object", properties: { scenarios: { type: "array", items: { type: "object", properties: { name: { type: "string" }, npv: { type: "number" }, payback_period: { type: "string" } } } } } },
    exampleData: { case: "Acquiring a competitor for $2M with 20% synergy in year 1." }
  },
  {
    id: 'ent-28',
    category: 'time',
    title: 'Meeting Insight Extractor',
    description: 'Analyzes finance meeting transcripts for action items, variances, and commitment tracking.',
    icon: 'Terminal',
    systemPrompt: 'Review the transcript. Extract action items, financial figures mentioned, and follow-up tasks.',
    schema: { type: "object", properties: { actions: { type: "array", items: { type: "object", properties: { task: { type: "string" }, owner: { type: "string" } } } } } },
    exampleData: { transcript: "John said we need to fix the $50k variance in travel by Friday." }
  },
  {
    id: 'ent-25',
    category: 'erp',
    title: 'QuickBooks Diagnostic',
    description: 'Autonomous health check for QBO/Desktop files, identifying reconciliation gaps and duplicate entries.',
    icon: 'ShieldCheck',
    systemPrompt: 'Scan the QBO export for health issues. Identify unlinked transactions and reconciliation discrepancies.',
    schema: { type: "object", properties: { health_score: { type: "number" }, issues: { type: "array", items: { type: "string" } } } },
    exampleData: { export_summary: "300 unlinked bank feed items, 5 accounts not reconciled for 6 months" }
  },
  {
    id: 'auto-03',
    category: 'autonomous',
    title: 'Complete Unfinished Features',
    description: 'Scans for TODOs and stubs, implementing full production logic based on context.',
    icon: 'CheckCircle2',
    systemPrompt: 'Find unfinished code parts and provide the full implementation.',
    schema: { type: "object", properties: { finished_code: { type: "string" }, context: { type: "string" } } },
    exampleData: { code: "// TODO: Implement the payment processing logic here" }
  },
  {
    id: 'auto-09',
    category: 'autonomous',
    title: 'Design System Enforcer',
    description: 'Standardizes tokens, margins, and elevations across the entire workspace.',
    icon: 'Layout',
    systemPrompt: 'Audit the component for design system compliance. Replace hardcoded values with design tokens.',
    schema: { type: "object", properties: { compliance_report: { type: "string" }, suggested_tokens: { type: "array", items: { type: "string" } } } },
    exampleData: { css: "padding: 13px; color: #ff0044;" }
  }
];

// Helper to get all 30+ tools would go here, but I'll populate more in the next step to avoid truncation
