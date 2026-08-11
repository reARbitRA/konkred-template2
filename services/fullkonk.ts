import { ProviderID, PipelineStage } from '../types';

// ─── PROVIDER REGISTRY ───────────────────────────────────────────

export interface ProviderDef {
  id: ProviderID;
  name: string;
  baseUrl: string;
  envKey: string;
  priority: Record<string, number>;
  models: { id: string; label: string }[];
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    envKey: 'GROQ_API_KEY',
    priority: { architect: 3, frontend: 1, backend: 2, verify: 2 },
    models: [
      { id: 'llama-3.3-70b-versatile',        label: 'Llama 3.3 70B'     },
      { id: 'llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout'     },
      { id: 'qwen-qwq-32b',                   label: 'Qwen QwQ 32B'      },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    envKey: 'DEEPSEEK_API_KEY',
    priority: { architect: 1, frontend: 3, backend: 1, verify: 1 },
    models: [
      { id: 'deepseek-chat',     label: 'DeepSeek V3' },
      { id: 'deepseek-reasoner', label: 'DeepSeek R1' },
    ],
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    envKey: 'CEREBRAS_API_KEY',
    priority: { architect: 4, frontend: 4, backend: 3, verify: 3 },
    models: [
      { id: 'gpt-oss-120b', label: 'GPT-OSS 120B' },
      { id: 'llama3.1-8b', label: 'Llama 3.1 8B'  },
    ],
  },
  {
    id: 'sambanova',
    name: 'SambaNova',
    baseUrl: 'https://api.sambanova.ai/v1',
    envKey: 'SAMBANOVA_API_KEY',
    priority: { architect: 2, frontend: 2, backend: 4, verify: 4 },
    models: [
      { id: 'Llama-4-Maverick-17B-128E-Instruct', label: 'Llama 4 Maverick' },
      { id: 'DeepSeek-V3.1-Terminus',             label: 'DeepSeek V3.1'    },
      { id: 'Qwen3-235B',                         label: 'Qwen3 235B'       },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    envKey: 'OPENROUTER_API_KEY',
    priority: { architect: 5, frontend: 5, backend: 5, verify: 5 },
    models: [
      { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 (free)' },
      { id: 'deepseek/deepseek-r1:free',               label: 'DeepSeek R1 (free)' },
      { id: 'qwen/qwen3-235b-a22b:free',               label: 'Qwen3 235B (free)' },
    ],
  },
];

// ─── RATE LIMIT TRACKER ──────────────────────────────────────────

const rateLimited = new Map<string, number>();

export function markRateLimited(id: string) {
  rateLimited.set(id, Date.now() + 60_000);
}

export function isRateLimited(id: string): boolean {
  const until = rateLimited.get(id);
  if (!until) return false;
  if (Date.now() > until) { rateLimited.delete(id); return false; }
  return true;
}

export function getSortedProviders(task: string): ProviderDef[] {
  return [...PROVIDERS]
    .filter(p => !isRateLimited(p.id))
    .sort((a, b) => (a.priority[task] ?? 9) - (b.priority[task] ?? 9));
}

// ─── SYSTEM PROMPTS ──────────────────────────────────────────────

export const SYSTEM_PROMPTS: Record<string, string> = {
  architect: `You are a senior software architect. Given a product idea, output a complete architecture plan:

## OVERVIEW
## TECH STACK
## COMPONENT TREE (ASCII)
## API CONTRACT (all endpoints, methods, request/response shapes)
## DATABASE SCHEMA (complete)
## FILE STRUCTURE (complete tree)
## KEY DECISIONS

Be specific and opinionated. Output the plan only — no code.`,

  frontend: `You are a senior frontend engineer. You write complete, production-ready React TypeScript code.
Use: React 19, TypeScript strict, Tailwind CSS, Framer Motion v12.
Rules: No truncation. Every component fully typed. All errors handled. Accessible. Mobile-first.
Output complete file contents with file paths as comments.`,

  backend: `You are a senior backend engineer. You write complete Node.js/TypeScript API code.
Use: Express 5, TypeScript strict, Firebase Firestore, Zod validation.
Rules: Validate all inputs. Handle all errors with proper status codes. Return { data?, error? }.
Output complete file contents with file paths as comments.`,

  verify: `You are a principal engineer doing integration review.
Check: API call signatures match routes. Types consistent across frontend/backend. All imports resolve.
Fix what is broken. Output corrected complete files only. List issues first.`,
};
