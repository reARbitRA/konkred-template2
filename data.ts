import { AppData, Listing, Protocol } from './types.ts';

export const INITIAL_PROTOCOLS: Protocol[] = [
  {
    id: 'P1',
    category: 'Security',
    level: 'Enterprise',
    title: 'Adversarial Prompt Guardrail v4',
    description: 'Autonomous zero-latency defense layer enforcing deterministic input/output sanitization and preventing system prompt leaks.',
    price: '$499',
    isVerified: true,
    tags: ['Security', 'Sanitization', 'Guardrails'],
    acquisitionCount: 1420
  },
  {
    id: 'P2',
    category: 'Finance',
    level: 'Advanced',
    title: 'SaaS Valuation & Liquidity Engine',
    description: 'Algorithmic financial modelling framework integrating real-time Stripe revenue streams with Monte Carlo scenario simulations.',
    price: '$299',
    isVerified: true,
    tags: ['Fintech', 'Valuation', 'Stripe'],
    acquisitionCount: 890
  },
  {
    id: 'P3',
    category: 'Legal',
    level: 'Enterprise',
    title: 'Automated GDPR & EU AI Act Compliance Core',
    description: 'Comprehensive static & dynamic code audit suite enforcing automated PII redaction and EU AI Act risk categorizations.',
    price: '$750',
    isVerified: true,
    tags: ['Compliance', 'GDPR', 'Audit'],
    acquisitionCount: 640
  },
  {
    id: 'P4',
    category: 'Agents',
    level: 'Advanced',
    title: 'Deterministic Multi-Agent Swarm Orchestrator',
    description: 'Fault-tolerant consensus protocol for multi-agent DAG execution with automated retry fallbacks and state checkpointing.',
    price: '$350',
    isVerified: true,
    tags: ['Multi-Agent', 'Orchestration', 'DAG'],
    acquisitionCount: 2150
  }
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'L1',
    sellerId: 'S1',
    seller: {
      name: 'CyberSec Labs',
      verified: true,
      totalSales: 1420
    },
    title: 'Adversarial Prompt Guardrail v4',
    shortDescription: 'Autonomous zero-latency defense layer enforcing deterministic input/output sanitization.',
    description: 'Production-grade security module designed to intercept and neutralize jailbreak attempts, indirect prompt injections, and system prompt extraction attacks in real-time. Operates with sub-10ms overhead.',
    type: 'prompt_system',
    category: 'Security',
    pricing: {
      mode: 'one_time',
      amount: 499,
      currency: 'USD'
    },
    delivery: 'download',
    auditScore: 98,
    auditReportId: 'AUD-8841',
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    trending: true,
    tags: ['Security', 'Jailbreak Defense', 'Sanitization', 'Guardrails'],
    salesCount: 1420,
    viewCount: 18400,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'L2',
    sellerId: 'S2',
    seller: {
      name: 'Quantitative Logic Corp',
      verified: true,
      totalSales: 890
    },
    title: 'SaaS Valuation & Liquidity Engine',
    shortDescription: 'Algorithmic financial modelling framework integrating Stripe revenue streams.',
    description: 'Full-stack financial analysis engine. Imports live MRR, churn rate, LTV, CAC, and cash runway data to output institutional-grade investor decks, DCF valuations, and sensitivity heatmaps.',
    type: 'workflow',
    category: 'Finance',
    pricing: {
      mode: 'one_time',
      amount: 299,
      currency: 'USD'
    },
    delivery: 'repo_access',
    auditScore: 95,
    auditReportId: 'AUD-7312',
    rating: 4.8,
    reviewCount: 94,
    featured: true,
    trending: false,
    tags: ['Fintech', 'Valuation', 'Stripe', 'Financial Modeling'],
    salesCount: 890,
    viewCount: 11200,
    createdAt: '2026-01-20T14:30:00Z',
    updatedAt: '2026-02-05T09:15:00Z'
  },
  {
    id: 'L3',
    sellerId: 'S3',
    seller: {
      name: 'Nexus Automation',
      verified: true,
      totalSales: 2150
    },
    title: 'Deterministic Multi-Agent Swarm Orchestrator',
    shortDescription: 'Fault-tolerant consensus protocol for multi-agent DAG execution.',
    description: 'High-throughput agent orchestration framework built on distributed queue state machines. Handles parallel tool execution, automated failovers across LLM providers, and structured output verification.',
    type: 'agent',
    category: 'Automation',
    pricing: {
      mode: 'subscription',
      amount: 350,
      currency: 'USD',
      interval: 'month'
    },
    delivery: 'api_key',
    auditScore: 99,
    auditReportId: 'AUD-9901',
    rating: 5.0,
    reviewCount: 310,
    featured: true,
    trending: true,
    tags: ['Multi-Agent', 'Orchestration', 'DAG', 'Autonomy'],
    salesCount: 2150,
    viewCount: 29800,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-08T16:20:00Z'
  },
  {
    id: 'L4',
    sellerId: 'S4',
    seller: {
      name: 'JurisAI Systems',
      verified: true,
      totalSales: 640
    },
    title: 'Automated GDPR & EU AI Act Compliance Core',
    shortDescription: 'Comprehensive code audit suite enforcing PII redaction & EU AI Act risk checks.',
    description: 'Automated compliance pipeline for AI applications. Scans prompt pipelines, RAG stores, and user telemetry logs to guarantee compliance with EU AI Act High-Risk classification and GDPR Article 17.',
    type: 'protocol',
    category: 'Legal',
    pricing: {
      mode: 'one_time',
      amount: 750,
      currency: 'USD'
    },
    delivery: 'download',
    auditScore: 97,
    auditReportId: 'AUD-6520',
    rating: 4.9,
    reviewCount: 72,
    featured: false,
    trending: true,
    tags: ['Compliance', 'GDPR', 'EU AI Act', 'Audit'],
    salesCount: 640,
    viewCount: 8900,
    createdAt: '2026-01-25T11:45:00Z',
    updatedAt: '2026-02-02T10:00:00Z'
  }
];

export const APP_DATA: AppData = {
  hero: {
    status: "SYSTEM_PRODUCTION_NODE",
    headline: "STRUCTURAL CAPITAL MARKETPLACE",
    subheadline: "Acquire verified methodologies, autonomous agents, and deterministic logic protocols. Optimized for professional architects and industrial workflows.",
  },
  protocols: INITIAL_PROTOCOLS,
  tools: [],
  footer: {
    systemStatus: "STABLE",
    version: "v4.2.0-stable"
  }
};
