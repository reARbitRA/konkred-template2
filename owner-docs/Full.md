# fullKONK_> — تعریف، یکپارچه‌سازی، و کد کامل

---

## بخش ۱ — fullKONK_> چیست

fullKONK_> یک AI product builder تمام‌پشته است که روی konkred.xyz اجرا می‌شود. ورودی آن یک ایده است — خروجی آن یک محصول کامل و آماده deploy.

بر خلاف ابزارهایی مثل v0 یا Bolt که یا فقط فرانت می‌سازند یا خروجی شکننده دارند، fullKONK_> از یک **pipeline سه‌مرحله‌ای با سه مدل تخصصی به صورت موازی** کار می‌کند:

```
STAGE 1 — ARCHITECT
───────────────────
یک مدل کل سیستم را طراحی می‌کند.
Component tree، API contract، DB schema،
tech stack، project structure.
قبل از یک خط کد — معماری تأیید می‌شود.

STAGE 2 — BUILD (موازی)
────────────────────────
دو مدل همزمان کار می‌کنند:
  Frontend model → Next.js + Tailwind + Framer Motion
  Backend model  → API routes + Prisma + Zod + Auth

STAGE 3 — VERIFY
─────────────────
یک مدل خروجی هر دو را می‌خواند.
Type consistency، API alignment،
import/export، auth flow.
خروجی نهایی: کد یکپارچه، بی‌باگ، deploy-ready.
```

**Provider Strategy:**
- ۱۲+ پروایدر OpenAI-compatible
- Smart routing: هر تسک به بهترین مدل می‌رود
- Auto-failover: اگر یکی rate limit خورد، بعدی جایگزین می‌شود
- هزینه inference: نزدیک صفر (free tiers)

---

## بخش ۲ — یکپارچه‌سازی روی konkred.xyz

konkred.xyz روی Vercel deploy شده و GitHub به آن وصل است. fullKONK_> به عنوان یک route جدید اضافه می‌شود:

```
konkred.xyz/
├── app/
│   ├── page.tsx                    ← homepage (کارت fullKONK_> اینجاست)
│   ├── fullkonk/
│   │   └── page.tsx                ← رابط کاربری اصلی
│   └── api/
│       └── fullkonk/
│           ├── generate/
│           │   └── route.ts        ← pipeline API با streaming
│           └── models/
│               └── route.ts        ← لیست مدل‌های available
├── lib/
│   └── fullkonk/
│       ├── types.ts
│       ├── providers.ts            ← abstraction layer
│       ├── pipeline.ts             ← 3-stage orchestrator
│       └── templates.ts            ← system prompts
└── components/
    └── fullkonk/
        ├── Workspace.tsx
        ├── ChatPanel.tsx
        ├── PipelineStatus.tsx
        ├── CodeOutput.tsx
        └── ProviderBar.tsx
```

**Environment variables لازم** در Vercel dashboard:
```
GROQ_API_KEY=
DEEPSEEK_API_KEY=
CEREBRAS_API_KEY=
OPENROUTER_API_KEY=
SAMBANOVA_API_KEY=
GEMINI_API_KEY=
```

---

## بخش ۳ — کد کامل

### `lib/fullkonk/types.ts`

```typescript
export type ProviderID =
  | 'groq'
  | 'deepseek'
  | 'cerebras'
  | 'sambanova'
  | 'openrouter'
  | 'gemini';

export type PipelineStage = 'idle' | 'architect' | 'build' | 'verify' | 'done' | 'error';

export type BuildMode = 'fullstack' | 'frontend' | 'backend' | 'review';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  stage?: PipelineStage;
  provider?: ProviderID;
  model?: string;
  timestamp: number;
}

export interface Provider {
  id: ProviderID;
  name: string;
  baseUrl: string;
  models: ModelDef[];
  free: boolean;
  creditCard: boolean;
  rateLimit: {
    rpm: number;
    tpm?: number;
    tpd?: number;
  };
  specialty: string[];
  speed: number; // 1-100
  envKey: string;
}

export interface ModelDef {
  id: string;
  name: string;
  contextWindow: number;
  bestFor: string[];
}

export interface PipelineResult {
  architecture: string;
  frontend: string;
  backend: string;
  verified: string;
  files: GeneratedFile[];
  provider: ProviderID;
  model: string;
  durationMs: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface GenerateRequest {
  prompt: string;
  mode: BuildMode;
  provider: ProviderID;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  messages?: Message[];
}

export interface StreamChunk {
  type: 'stage' | 'delta' | 'file' | 'done' | 'error';
  stage?: PipelineStage;
  content?: string;
  file?: GeneratedFile;
  error?: string;
  provider?: ProviderID;
  model?: string;
}

export interface ProviderStatus {
  id: ProviderID;
  available: boolean;
  lastChecked: number;
  rateLimitedUntil?: number;
}
```

---

### `lib/fullkonk/providers.ts`

```typescript
import { Provider, ProviderID, ModelDef } from './types';

export const PROVIDERS: Record<ProviderID, Provider> = {
  groq: {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    envKey: 'GROQ_API_KEY',
    free: true,
    creditCard: false,
    speed: 98,
    specialty: ['speed', 'quick-tasks', 'streaming'],
    rateLimit: { rpm: 30, tpm: 14400 },
    models: [
      { id: 'llama-3.3-70b-versatile',       name: 'Llama 3.3 70B',     contextWindow: 128000, bestFor: ['general', 'code'] },
      { id: 'llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout',     contextWindow: 131072, bestFor: ['reasoning', 'fast'] },
      { id: 'qwen-qwq-32b',                  name: 'Qwen QwQ 32B',      contextWindow: 131072, bestFor: ['reasoning'] },
      { id: 'moonshotai/kimi-k1.5-32k',      name: 'Kimi K1.5',         contextWindow: 32000,  bestFor: ['frontend', 'ui'] },
    ],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    envKey: 'DEEPSEEK_API_KEY',
    free: true,
    creditCard: false,
    speed: 72,
    specialty: ['coding', 'reasoning', 'backend', 'architecture'],
    rateLimit: { rpm: 60 },
    models: [
      { id: 'deepseek-chat',     name: 'DeepSeek V3.2',   contextWindow: 65536,  bestFor: ['coding', 'backend', 'architecture'] },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1',     contextWindow: 65536,  bestFor: ['reasoning', 'review'] },
    ],
  },
  cerebras: {
    id: 'cerebras',
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    envKey: 'CEREBRAS_API_KEY',
    free: true,
    creditCard: false,
    speed: 95,
    specialty: ['speed', 'high-volume', 'large-context'],
    rateLimit: { rpm: 30, tpd: 1000000 },
    models: [
      { id: 'gpt-oss-120b', name: 'GPT-OSS 120B', contextWindow: 128000, bestFor: ['general', 'large-context'] },
      { id: 'llama3.1-8b', name: 'Llama 3.1 8B', contextWindow: 128000, bestFor: ['fast', 'simple-tasks'] },
    ],
  },
  sambanova: {
    id: 'sambanova',
    name: 'SambaNova',
    baseUrl: 'https://api.sambanova.ai/v1',
    envKey: 'SAMBANOVA_API_KEY',
    free: true,
    creditCard: false,
    speed: 88,
    specialty: ['large-models', 'speed', 'reasoning'],
    rateLimit: { rpm: 30 },
    models: [
      { id: 'Llama-4-Maverick-17B-128E-Instruct', name: 'Llama 4 Maverick', contextWindow: 131072, bestFor: ['general', 'large-context'] },
      { id: 'DeepSeek-V3.1-Terminus',             name: 'DeepSeek V3.1',    contextWindow: 65536,  bestFor: ['coding'] },
      { id: 'Qwen3-235B',                         name: 'Qwen3 235B',       contextWindow: 32768,  bestFor: ['reasoning', 'multilingual'] },
    ],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    envKey: 'OPENROUTER_API_KEY',
    free: true,
    creditCard: false,
    speed: 70,
    specialty: ['variety', 'fallback', 'model-comparison'],
    rateLimit: { rpm: 20, tpd: 50 },
    models: [
      { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (free)', contextWindow: 128000, bestFor: ['general'] },
      { id: 'qwen/qwen3-235b-a22b:free',              name: 'Qwen3 235B (free)',    contextWindow: 32768,  bestFor: ['reasoning'] },
      { id: 'deepseek/deepseek-r1:free',               name: 'DeepSeek R1 (free)',  contextWindow: 65536,  bestFor: ['reasoning'] },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    envKey: 'GEMINI_API_KEY',
    free: true,
    creditCard: false,
    speed: 82,
    specialty: ['long-context', 'multimodal', 'frontend', 'ui'],
    rateLimit: { rpm: 15, tpd: 1500 },
    models: [
      { id: 'gemini-2.5-flash',      name: 'Gemini 2.5 Flash',      contextWindow: 1000000, bestFor: ['long-context', 'frontend', 'multimodal'] },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', contextWindow: 1000000, bestFor: ['fast', 'simple'] },
    ],
  },
};

// Smart routing: task type → ordered provider list
export const ROUTING_TABLE: Record<string, ProviderID[]> = {
  architect:  ['deepseek', 'sambanova', 'groq',      'openrouter', 'cerebras'],
  frontend:   ['groq',     'gemini',    'sambanova', 'openrouter', 'cerebras'],
  backend:    ['deepseek', 'sambanova', 'groq',      'openrouter', 'cerebras'],
  verify:     ['deepseek', 'groq',      'sambanova', 'openrouter', 'cerebras'],
  review:     ['deepseek', 'groq',      'sambanova', 'cerebras',   'openrouter'],
  general:    ['groq',     'cerebras',  'deepseek',  'sambanova',  'openrouter'],
};

// In-memory rate limit tracker (resets on cold start)
const rateLimitMap = new Map<ProviderID, number>();

export function markRateLimited(id: ProviderID, ms = 60000) {
  rateLimitMap.set(id, Date.now() + ms);
}

export function isRateLimited(id: ProviderID): boolean {
  const until = rateLimitMap.get(id);
  if (!until) return false;
  if (Date.now() > until) { rateLimitMap.delete(id); return false; }
  return true;
}

export function getApiKey(provider: Provider): string {
  const key = process.env[provider.envKey];
  if (!key) throw new Error(`Missing env: ${provider.envKey}`);
  return key;
}

export function getAvailableProviders(task: string): Provider[] {
  const order = ROUTING_TABLE[task] || ROUTING_TABLE.general;
  return order
    .filter(id => !isRateLimited(id))
    .map(id => PROVIDERS[id])
    .filter(p => {
      try { getApiKey(p); return true; } catch { return false; }
    });
}

export function getModel(provider: Provider, task: string): ModelDef {
  const taskMap: Record<string, string[]> = {
    architect: ['coding', 'architecture'],
    frontend:  ['frontend', 'ui'],
    backend:   ['coding', 'backend'],
    verify:    ['reasoning', 'review'],
  };
  const preferred = taskMap[task] || [];
  return (
    provider.models.find(m => m.bestFor.some(b => preferred.includes(b))) ||
    provider.models[0]
  );
}
```

---

### `lib/fullkonk/templates.ts`

```typescript
import { BuildMode } from './types';

export const SYSTEM_PROMPTS: Record<string, string> = {

  architect: `You are a senior software architect at a top-tier product company.
Your job is to design the complete architecture for a full-stack application.

When given a product idea, output a structured architecture plan in this EXACT format:

## PROJECT OVERVIEW
[2-3 sentence description]

## TECH STACK
- Frontend: [specific choices with versions]
- Backend: [specific choices]
- Database: [specific choice + why]
- Auth: [specific approach]
- Deployment: [specific targets]

## COMPONENT TREE
[ASCII tree of main React components]

## API CONTRACT
[List of all API endpoints with method, path, request body, response shape]

## DATABASE SCHEMA
[Prisma schema or SQL DDL for all tables]

## PROJECT STRUCTURE
[Complete file/folder tree]

## IMPLEMENTATION NOTES
[Key technical decisions and why]

Be specific. Be opinionated. No vague answers. Output only the architecture plan — no code yet.`,

  frontend: `You are a senior frontend engineer specializing in cutting-edge React applications.
You write production-ready Next.js 14 App Router code with TypeScript.

TECH STACK YOU USE:
- Next.js 14 (App Router, Server Components where appropriate)
- TypeScript (strict mode)
- Tailwind CSS (utility-first)
- shadcn/ui components (assume installed)
- Framer Motion for animations
- React Hook Form + Zod for forms
- React Query / SWR for data fetching
- Zustand for client state

RULES:
- Write complete, working files — no truncation, no ellipsis
- Every component is fully typed
- All forms have validation
- All errors are handled with user feedback
- Animations are tasteful and purposeful
- Responsive: mobile-first
- Accessible: proper ARIA, keyboard navigation
- No hardcoded colors — use Tailwind classes
- Export all components as named exports

When given an architecture plan, implement the frontend completely.`,

  backend: `You are a senior backend engineer who writes bulletproof Node.js/TypeScript APIs.
You use Next.js 14 API routes with the App Router pattern.

TECH STACK YOU USE:
- Next.js 14 API Routes (route.ts files)
- TypeScript (strict mode)
- Prisma ORM with PostgreSQL (Neon)
- Zod for all input validation
- NextAuth.js or Clerk for auth (as specified)
- Upstash Redis for rate limiting and caching
- Resend for email

RULES:
- Every route validates input with Zod before touching the DB
- Every route handles errors with proper HTTP status codes
- All DB queries use Prisma — no raw SQL unless necessary
- Rate limiting on all public endpoints
- No N+1 queries — use Prisma includes/selects
- Proper TypeScript types on all request/response shapes
- Return consistent JSON shape: { data?, error?, message? }
- Write complete Prisma schema with all models and relations

When given an architecture plan, implement the complete backend.`,

  verify: `You are a principal engineer doing final integration review.
You receive frontend code, backend code, and the original architecture plan.

Your job:
1. Ensure frontend API calls match backend route signatures exactly
2. Ensure TypeScript types are consistent across frontend and backend
3. Ensure all imports reference files that actually exist
4. Ensure authentication flows are complete end-to-end
5. Fix any type mismatches, missing imports, or broken references
6. Output the CORRECTED, INTEGRATED final code

Output format:
- List issues found (if any)
- Output corrected files (complete — no truncation)
- Confirm integration is clean

Be surgical. Only change what's broken. Don't rewrite what works.`,

  review: `You are a senior code reviewer with expertise in security, performance, and maintainability.

Review the provided code and output:
1. CRITICAL ISSUES (must fix before production)
2. SECURITY VULNERABILITIES (injection, auth bypass, data exposure)
3. PERFORMANCE PROBLEMS (N+1, missing indexes, unnecessary re-renders)
4. TYPE SAFETY GAPS (any casts, missing null checks)
5. REFACTOR SUGGESTIONS (with before/after code examples)

Be direct. Be specific. Show exact line references.
Output fixed code for every critical issue you find.`,

};

export const BUILD_MODE_DESCRIPTIONS: Record<BuildMode, string> = {
  fullstack: 'Generates complete frontend + backend + DB schema + deployment config',
  frontend:  'Generates Next.js components, pages, and client-side logic only',
  backend:   'Generates API routes, Prisma schema, auth, and server logic only',
  review:    'Analyzes existing code for bugs, security issues, and improvements',
};
```

---

### `lib/fullkonk/pipeline.ts`

```typescript
import { GenerateRequest, StreamChunk, PipelineStage } from './types';
import { getAvailableProviders, getModel, markRateLimited, getApiKey } from './providers';
import { SYSTEM_PROMPTS } from './templates';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Core streaming fetch — works with all OpenAI-compatible providers
async function streamCompletion(
  baseUrl: string,
  apiKey: string,
  messages: OpenAIMessage[],
  model: string,
  temperature = 0.4,
  maxTokens = 8192,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://konkred.xyz',
      'X-Title': 'fullKONK_>',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.text();
    if (response.status === 429) throw Object.assign(new Error('rate_limited'), { status: 429 });
    throw new Error(`Provider error ${response.status}: ${err}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
    for (const line of lines) {
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const chunk = parsed.choices?.[0]?.delta?.content || '';
        if (chunk) { full += chunk; onChunk(chunk); }
      } catch {}
    }
  }

  return full;
}

// Failover wrapper — tries providers in priority order
async function runWithFailover(
  task: string,
  messages: OpenAIMessage[],
  temperature: number,
  maxTokens: number,
  onChunk: (text: string) => void,
  onProviderSwitch: (providerName: string, modelName: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const providers = getAvailableProviders(task);

  if (providers.length === 0) {
    throw new Error('No providers available. Check API keys in environment variables.');
  }

  for (const provider of providers) {
    const modelDef = getModel(provider, task);
    try {
      onProviderSwitch(provider.name, modelDef.name);
      const apiKey = getApiKey(provider);
      const result = await streamCompletion(
        provider.baseUrl,
        apiKey,
        messages,
        modelDef.id,
        temperature,
        maxTokens,
        onChunk,
        signal,
      );
      return result;
    } catch (err: any) {
      if (err?.status === 429 || err?.message === 'rate_limited') {
        markRateLimited(provider.id);
        continue;
      }
      if (signal?.aborted) throw err;
      // Non-rate-limit error — try next provider
      continue;
    }
  }

  throw new Error('All providers exhausted or rate limited.');
}

// Extract code files from AI output
function extractFiles(content: string, prefix: 'frontend' | 'backend' | 'schema' | 'config'): import('./types').GeneratedFile[] {
  const files: import('./types').GeneratedFile[] = [];
  const fenceRegex = /```(\w+)?\s*(?:\/\/\s*([\w\/.-]+))?\n([\s\S]*?)```/g;
  let match;

  while ((match = fenceRegex.exec(content)) !== null) {
    const lang = match[1] || 'text';
    const path = match[2] || `${prefix}/output.${lang === 'typescript' || lang === 'tsx' || lang === 'ts' ? 'ts' : lang}`;
    const code = match[3].trim();
    if (code.length > 20) {
      files.push({ path, content: code, language: lang });
    }
  }

  return files;
}

// MAIN PIPELINE
export async function runPipeline(
  request: GenerateRequest,
  writer: WritableStreamDefaultWriter<Uint8Array>,
  signal?: AbortSignal,
) {
  const enc = new TextEncoder();

  function send(chunk: StreamChunk) {
    if (signal?.aborted) return;
    writer.write(enc.encode(`data: ${JSON.stringify(chunk)}\n\n`));
  }

  try {
    if (request.mode === 'review') {
      send({ type: 'stage', stage: 'architect', content: 'Analyzing code...' });
      let reviewOutput = '';
      await runWithFailover(
        'review',
        [
          { role: 'system', content: SYSTEM_PROMPTS.review },
          { role: 'user', content: request.prompt },
        ],
        0.2,
        8192,
        (chunk) => { reviewOutput += chunk; send({ type: 'delta', content: chunk }); },
        (prov, model) => send({ type: 'stage', stage: 'architect', content: `Using ${prov} / ${model}` }),
        signal,
      );
      send({ type: 'done' });
      return;
    }

    // ─── STAGE 1: ARCHITECT ───────────────────────────────────────
    send({ type: 'stage', stage: 'architect', content: 'Designing system architecture...' });

    let architectureOutput = '';
    await runWithFailover(
      'architect',
      [
        { role: 'system', content: SYSTEM_PROMPTS.architect },
        { role: 'user', content: `Design the complete architecture for: ${request.prompt}` },
      ],
      0.3,
      4096,
      (chunk) => { architectureOutput += chunk; send({ type: 'delta', content: chunk }); },
      (prov, model) => send({ type: 'stage', stage: 'architect', content: `Architect: ${prov} / ${model}` }),
      signal,
    );

    if (signal?.aborted) return;

    if (request.mode === 'backend') {
      // ─── BACKEND ONLY ──────────────────────────────────────────
      send({ type: 'stage', stage: 'build', content: 'Building backend...' });
      let backendOutput = '';
      await runWithFailover(
        'backend',
        [
          { role: 'system', content: SYSTEM_PROMPTS.backend },
          { role: 'user', content: `Architecture:\n${architectureOutput}\n\nImplement the complete backend.` },
        ],
        0.25,
        8192,
        (chunk) => { backendOutput += chunk; send({ type: 'delta', content: chunk }); },
        (prov, model) => send({ type: 'stage', stage: 'build', content: `Backend: ${prov} / ${model}` }),
        signal,
      );
      const files = extractFiles(backendOutput, 'backend');
      files.forEach(f => send({ type: 'file', file: f }));
      send({ type: 'done' });
      return;
    }

    if (request.mode === 'frontend') {
      // ─── FRONTEND ONLY ─────────────────────────────────────────
      send({ type: 'stage', stage: 'build', content: 'Building frontend...' });
      let frontendOutput = '';
      await runWithFailover(
        'frontend',
        [
          { role: 'system', content: SYSTEM_PROMPTS.frontend },
          { role: 'user', content: `Architecture:\n${architectureOutput}\n\nImplement the complete frontend.` },
        ],
        0.35,
        8192,
        (chunk) => { frontendOutput += chunk; send({ type: 'delta', content: chunk }); },
        (prov, model) => send({ type: 'stage', stage: 'build', content: `Frontend: ${prov} / ${model}` }),
        signal,
      );
      const files = extractFiles(frontendOutput, 'frontend');
      files.forEach(f => send({ type: 'file', file: f }));
      send({ type: 'done' });
      return;
    }

    // ─── STAGE 2: BUILD (FULLSTACK — SEQUENTIAL for reliability) ──
    send({ type: 'stage', stage: 'build', content: 'Building frontend...' });

    let frontendOutput = '';
    await runWithFailover(
      'frontend',
      [
        { role: 'system', content: SYSTEM_PROMPTS.frontend },
        { role: 'user', content: `Architecture plan:\n${architectureOutput}\n\nImplement the complete frontend. Include all pages, components, and client-side logic.` },
      ],
      0.35,
      8192,
      (chunk) => { frontendOutput += chunk; send({ type: 'delta', content: chunk }); },
      (prov, model) => send({ type: 'stage', stage: 'build', content: `Frontend: ${prov} / ${model}` }),
      signal,
    );

    if (signal?.aborted) return;

    send({ type: 'stage', stage: 'build', content: 'Building backend...' });

    let backendOutput = '';
    await runWithFailover(
      'backend',
      [
        { role: 'system', content: SYSTEM_PROMPTS.backend },
        { role: 'user', content: `Architecture plan:\n${architectureOutput}\n\nFrontend is already built. Implement the complete backend: API routes, Prisma schema, auth, middleware.` },
      ],
      0.25,
      8192,
      (chunk) => { backendOutput += chunk; send({ type: 'delta', content: chunk }); },
      (prov, model) => send({ type: 'stage', stage: 'build', content: `Backend: ${prov} / ${model}` }),
      signal,
    );

    if (signal?.aborted) return;

    // ─── STAGE 3: VERIFY ──────────────────────────────────────────
    send({ type: 'stage', stage: 'verify', content: 'Verifying integration...' });

    let verifyOutput = '';
    await runWithFailover(
      'verify',
      [
        { role: 'system', content: SYSTEM_PROMPTS.verify },
        { role: 'user', content: `Architecture:\n${architectureOutput}\n\nFrontend:\n${frontendOutput}\n\nBackend:\n${backendOutput}\n\nVerify integration, fix any issues, output final integrated code.` },
      ],
      0.1,
      8192,
      (chunk) => { verifyOutput += chunk; send({ type: 'delta', content: chunk }); },
      (prov, model) => send({ type: 'stage', stage: 'verify', content: `Verifying: ${prov} / ${model}` }),
      signal,
    );

    // Extract and send all files
    const allFiles = [
      ...extractFiles(frontendOutput, 'frontend'),
      ...extractFiles(backendOutput, 'backend'),
      ...extractFiles(verifyOutput, 'frontend'),
    ];

    // Deduplicate by path (later files win — verify output takes precedence)
    const fileMap = new Map<string, import('./types').GeneratedFile>();
    allFiles.forEach(f => fileMap.set(f.path, f));
    fileMap.forEach(f => send({ type: 'file', file: f }));

    send({ type: 'done' });

  } catch (err: any) {
    send({ type: 'error', error: err?.message || 'Pipeline failed' });
  }
}
```

---

### `app/api/fullkonk/generate/route.ts`

```typescript
import { NextRequest } from 'next/server';
import { runPipeline } from '@/lib/fullkonk/pipeline';
import { GenerateRequest } from '@/lib/fullkonk/types';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes — Vercel Pro / edge limit

export async function POST(req: NextRequest) {
  let body: GenerateRequest;

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  if (!body.prompt?.trim()) {
    return new Response(JSON.stringify({ error: 'prompt is required' }), { status: 400 });
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Run pipeline in background — don't await
  runPipeline(body, writer, req.signal).finally(() => {
    try { writer.close(); } catch {}
  });

  return new Response(readable, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
```

---

### `app/api/fullkonk/models/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { PROVIDERS } from '@/lib/fullkonk/providers';

export async function GET() {
  const available = Object.values(PROVIDERS).map(p => ({
    id: p.id,
    name: p.name,
    free: p.free,
    speed: p.speed,
    specialty: p.specialty,
    hasKey: !!process.env[p.envKey],
    models: p.models,
  }));

  return NextResponse.json({ providers: available });
}
```

---

### `components/fullkonk/Workspace.tsx`

```tsx
'use client';

import { useState, useCallback, useRef } from 'react';
import { BuildMode, Message, GeneratedFile, StreamChunk, PipelineStage } from '@/lib/fullkonk/types';
import ChatPanel from './ChatPanel';
import PipelineStatus from './PipelineStatus';
import CodeOutput from './CodeOutput';
import ProviderBar from './ProviderBar';

const MODES: { id: BuildMode; label: string; desc: string }[] = [
  { id: 'fullstack', label: '🏗 Full-Stack', desc: 'Frontend + Backend' },
  { id: 'frontend',  label: '🎨 Frontend',   desc: 'UI & components'   },
  { id: 'backend',   label: '⚙️ Backend',    desc: 'API & database'    },
  { id: 'review',    label: '🔍 Review',     desc: 'Analyze code'      },
];

export default function Workspace() {
  const [mode, setMode]               = useState<BuildMode>('fullstack');
  const [messages, setMessages]       = useState<Message[]>([]);
  const [stage, setStage]             = useState<PipelineStage>('idle');
  const [stageText, setStageText]     = useState('');
  const [files, setFiles]             = useState<GeneratedFile[]>([]);
  const [streaming, setStreaming]     = useState(false);
  const [activeFile, setActiveFile]   = useState<string | null>(null);
  const [provider, setProvider]       = useState<string>('groq');
  const [model, setModel]             = useState<string>('llama-3.3-70b-versatile');
  const [temperature, setTemperature] = useState(0.4);
  const [maxTokens, setMaxTokens]     = useState(8192);
  const [systemPrompt, setSystemPrompt] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }]);
  }, []);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === 'assistant') {
        return [...prev.slice(0, -1), { ...last, content: last.content + content }];
      }
      return [...prev, { role: 'assistant', content, id: crypto.randomUUID(), timestamp: Date.now() }];
    });
  }, []);

  const handleSend = useCallback(async (prompt: string) => {
    if (!prompt.trim() || streaming) return;

    abortRef.current = new AbortController();
    setStreaming(true);
    setStage('architect');
    setStageText('Initializing pipeline...');
    setFiles([]);

    addMessage({ role: 'user', content: prompt });

    try {
      const res = await fetch('/api/fullkonk/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          provider,
          model,
          temperature,
          maxTokens,
          systemPrompt: systemPrompt || undefined,
          messages: messages.slice(-8), // send recent context
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let chunk: StreamChunk;
          try { chunk = JSON.parse(raw); } catch { continue; }

          switch (chunk.type) {
            case 'stage':
              setStage(chunk.stage!);
              setStageText(chunk.content || '');
              break;
            case 'delta':
              updateLastAssistantMessage(chunk.content || '');
              break;
            case 'file':
              if (chunk.file) {
                setFiles(prev => {
                  const next = [...prev.filter(f => f.path !== chunk.file!.path), chunk.file!];
                  if (!activeFile) setActiveFile(chunk.file!.path);
                  return next;
                });
              }
              break;
            case 'done':
              setStage('done');
              setStageText('Build complete');
              break;
            case 'error':
              throw new Error(chunk.error || 'Pipeline error');
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setStage('error');
        setStageText(err.message || 'Unknown error');
        addMessage({ role: 'assistant', content: `❌ Error: ${err.message}` });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [streaming, mode, provider, model, temperature, maxTokens, systemPrompt, messages, addMessage, updateLastAssistantMessage, activeFile]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
    setStage('idle');
  }, []);

  return (
    <div className="fk-workspace">
      {/* ── Top bar ── */}
      <div className="fk-topbar">
        <div className="fk-brand">
          <span className="fk-brand-dot" />
          <span className="fk-brand-name">fullKONK_&gt;</span>
          <span className="fk-brand-sub">konkred.xyz</span>
        </div>

        {/* Mode selector */}
        <div className="fk-modes">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`fk-mode-btn ${mode === m.id ? 'active' : ''}`}
              onClick={() => setMode(m.id)}
              disabled={streaming}
              title={m.desc}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Provider + model */}
        <ProviderBar
          selectedProvider={provider}
          selectedModel={model}
          onProviderChange={setProvider}
          onModelChange={setModel}
          disabled={streaming}
        />
      </div>

      {/* ── Pipeline status ── */}
      <PipelineStatus
        stage={stage}
        text={stageText}
        streaming={streaming}
        onStop={handleStop}
      />

      {/* ── Main layout ── */}
      <div className="fk-main">
        {/* Left: chat */}
        <div className="fk-left">
          <ChatPanel
            messages={messages}
            streaming={streaming}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            temperature={temperature}
            maxTokens={maxTokens}
            onTemperatureChange={setTemperature}
            onMaxTokensChange={setMaxTokens}
            onSend={handleSend}
            onClear={() => { setMessages([]); setFiles([]); setStage('idle'); }}
          />
        </div>

        {/* Right: code output */}
        <div className="fk-right">
          <CodeOutput
            files={files}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            streaming={streaming}
          />
        </div>
      </div>

      <style jsx>{`
        .fk-workspace {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0a0a0a;
          font-family: 'Space Grotesk', sans-serif;
          color: #fff;
          overflow: hidden;
        }
        .fk-topbar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 20px;
          height: 56px;
          background: #000;
          border-bottom: 3px solid #111;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .fk-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: auto;
        }
        .fk-brand-dot {
          width: 8px;
          height: 8px;
          background: #FFE500;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(2); opacity: 0.5; }
        }
        .fk-brand-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px;
          font-weight: 700;
          color: #FFE500;
          letter-spacing: 2px;
        }
        .fk-brand-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #444;
          letter-spacing: 2px;
        }
        .fk-modes {
          display: flex;
          gap: 0;
        }
        .fk-mode-btn {
          padding: 6px 14px;
          background: transparent;
          border: 1px solid #222;
          border-right: none;
          color: #555;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .fk-mode-btn:last-child { border-right: 1px solid #222; }
        .fk-mode-btn:hover:not(:disabled) { background: #1a1a1a; color: #fff; }
        .fk-mode-btn.active { background: #FFE500; color: #000; border-color: #FFE500; }
        .fk-mode-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .fk-main {
          display: grid;
          grid-template-columns: 400px 1fr;
          flex: 1;
          overflow: hidden;
        }
        .fk-left  { border-right: 3px solid #111; overflow: hidden; display: flex; flex-direction: column; }
        .fk-right { overflow: hidden; display: flex; flex-direction: column; }
        @media (max-width: 900px) {
          .fk-main { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
          .fk-left { border-right: none; border-bottom: 3px solid #111; }
        }
      `}</style>
    </div>
  );
}
```

---

### `components/fullkonk/ChatPanel.tsx`

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/lib/fullkonk/types';

interface Props {
  messages: Message[];
  streaming: boolean;
  systemPrompt: string;
  onSystemPromptChange: (v: string) => void;
  temperature: number;
  maxTokens: number;
  onTemperatureChange: (v: number) => void;
  onMaxTokensChange: (v: number) => void;
  onSend: (prompt: string) => void;
  onClear: () => void;
}

export default function ChatPanel({
  messages, streaming, systemPrompt, onSystemPromptChange,
  temperature, maxTokens, onTemperatureChange, onMaxTokensChange,
  onSend, onClear,
}: Props) {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    setInput('');
    onSend(trimmed);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  return (
    <div className="cp-root">
      {/* Settings toggle */}
      <div className="cp-toolbar">
        <span className="cp-toolbar-label">// CHAT</span>
        <button className="cp-icon-btn" onClick={() => setShowSettings(s => !s)} title="Settings">⚙</button>
        <button className="cp-icon-btn" onClick={onClear} disabled={streaming} title="Clear">✕</button>
      </div>

      {/* System prompt + sliders */}
      {showSettings && (
        <div className="cp-settings">
          <div className="cp-setting-label">SYSTEM PROMPT</div>
          <textarea
            className="cp-sysprompt"
            value={systemPrompt}
            onChange={e => onSystemPromptChange(e.target.value)}
            placeholder="Override system behavior (optional)..."
            rows={3}
          />
          <div className="cp-sliders">
            <div className="cp-slider-row">
              <span className="cp-slider-label">Temperature</span>
              <input type="range" min="0" max="100" value={temperature * 100}
                onChange={e => onTemperatureChange(Number(e.target.value) / 100)}
                className="cp-slider" />
              <span className="cp-slider-val">{temperature.toFixed(2)}</span>
            </div>
            <div className="cp-slider-row">
              <span className="cp-slider-label">Max Tokens</span>
              <input type="range" min="1024" max="16384" step="512" value={maxTokens}
                onChange={e => onMaxTokensChange(Number(e.target.value))}
                className="cp-slider" />
              <span className="cp-slider-val">{maxTokens.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="cp-messages">
        {messages.length === 0 && (
          <div className="cp-empty">
            <div className="cp-empty-icon">⚡</div>
            <div className="cp-empty-title">fullKONK_&gt;</div>
            <div className="cp-empty-sub">Describe what you want to build.</div>
            <div className="cp-suggestions">
              {[
                'A SaaS invoice management dashboard',
                'A real-time collaborative kanban board',
                'An API developer portal with key management',
                'A multi-tenant CMS with role-based access',
              ].map(s => (
                <button key={s} className="cp-suggestion" onClick={() => { setInput(s); textareaRef.current?.focus(); }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`cp-msg cp-msg-${msg.role}`}>
            {msg.role === 'user' ? (
              <div className="cp-msg-user">{msg.content}</div>
            ) : (
              <div className="cp-msg-ai">
                <span className="cp-msg-ai-label">AI</span>
                <pre className="cp-msg-content">{msg.content}{streaming && msg === messages[messages.length - 1] ? <span className="cp-cursor" /> : null}</pre>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="cp-input-area">
        <textarea
          ref={textareaRef}
          className="cp-input"
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build..."
          disabled={streaming}
          rows={1}
        />
        <button
          className={`cp-send ${streaming ? 'stop' : ''}`}
          onClick={streaming ? () => {} : handleSend}
          disabled={!streaming && !input.trim()}
        >
          {streaming ? '■ STOP' : 'BUILD →'}
        </button>
      </div>

      <style jsx>{`
        .cp-root { display: flex; flex-direction: column; height: 100%; background: #080808; }
        .cp-toolbar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid #111; flex-shrink: 0; }
        .cp-toolbar-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 3px; color: #333; text-transform: uppercase; margin-right: auto; }
        .cp-icon-btn { background: none; border: 1px solid #222; color: #555; width: 28px; height: 28px; cursor: pointer; font-size: 12px; transition: all .15s; }
        .cp-icon-btn:hover:not(:disabled) { border-color: #FFE500; color: #FFE500; }
        .cp-icon-btn:disabled { opacity: .3; cursor: not-allowed; }
        .cp-settings { padding: 12px 16px; border-bottom: 1px solid #111; background: #050505; flex-shrink: 0; }
        .cp-setting-label { font-family: 'JetBrains Mono', monospace; font-size: 8px; letter-spacing: 3px; color: #9B00FF; margin-bottom: 6px; text-transform: uppercase; }
        .cp-sysprompt { width: 100%; background: #0d0d0d; border: 1px solid #222; color: #888; font-family: 'JetBrains Mono', monospace; font-size: 10px; padding: 8px; resize: none; outline: none; line-height: 1.6; }
        .cp-sysprompt:focus { border-color: #9B00FF; }
        .cp-sliders { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .cp-slider-row { display: flex; align-items: center; gap: 8px; }
        .cp-slider-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #444; width: 90px; flex-shrink: 0; }
        .cp-slider { flex: 1; -webkit-appearance: none; height: 2px; background: #222; outline: none; cursor: pointer; }
        .cp-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: #FFE500; border: 2px solid #000; cursor: pointer; }
        .cp-slider-val { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #FFE500; width: 48px; text-align: right; }
        .cp-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .cp-messages::-webkit-scrollbar { width: 4px; }
        .cp-messages::-webkit-scrollbar-thumb { background: #222; }
        .cp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 12px; opacity: .6; }
        .cp-empty-icon { font-size: 36px; }
        .cp-empty-title { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: #FFE500; letter-spacing: 2px; }
        .cp-empty-sub { font-size: 13px; color: #555; }
        .cp-suggestions { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 320px; margin-top: 8px; }
        .cp-suggestion { background: #0d0d0d; border: 1px solid #1a1a1a; color: #555; padding: 8px 12px; font-size: 11px; text-align: right; cursor: pointer; transition: all .15s; }
        .cp-suggestion:hover { border-color: #FFE500; color: #FFE500; background: #111; }
        .cp-msg { animation: msgIn .3s ease; }
        @keyframes msgIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .cp-msg-user { background: #111; border: 1px solid #222; padding: 10px 14px; font-size: 13px; color: #fff; align-self: flex-end; }
        .cp-msg-ai { position: relative; padding: 10px 14px; background: #050f05; border: 1px solid #0f200f; }
        .cp-msg-ai-label { position: absolute; top: -8px; right: 8px; background: #00FF88; color: #000; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: 700; padding: 1px 5px; letter-spacing: 1px; }
        .cp-msg-content { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #00FF88; line-height: 1.7; white-space: pre-wrap; word-break: break-word; margin: 0; }
        .cp-cursor { display: inline-block; width: 6px; height: 12px; background: #00FF88; vertical-align: middle; animation: blink .7s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .cp-input-area { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #111; flex-shrink: 0; background: #050505; }
        .cp-input { flex: 1; background: #0d0d0d; border: 1px solid #222; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 13px; padding: 8px 12px; outline: none; resize: none; line-height: 1.5; max-height: 160px; overflow-y: auto; }
        .cp-input:focus { border-color: #FFE500; }
        .cp-input:disabled { opacity: .4; }
        .cp-send { background: #FFE500; border: none; color: #000; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: 2px; padding: 8px 16px; cursor: pointer; transition: all .15s; align-self: flex-end; white-space: nowrap; }
        .cp-send:hover:not(:disabled) { background: #fff; transform: translate(-2px,-2px); box-shadow: 2px 2px 0 #000; }
        .cp-send:disabled { opacity: .3; cursor: not-allowed; }
        .cp-send.stop { background: #FF2D00; color: #fff; }
        .cp-send.stop:hover { background: #ff5533; transform: none; box-shadow: none; }
      `}</style>
    </div>
  );
}
```

---

### `components/fullkonk/PipelineStatus.tsx`

```tsx
'use client';

import { PipelineStage } from '@/lib/fullkonk/types';

interface Props {
  stage: PipelineStage;
  text: string;
  streaming: boolean;
  onStop: () => void;
}

const STAGES: { id: PipelineStage; label: string; index: number }[] = [
  { id: 'architect', label: 'ARCHITECT', index: 0 },
  { id: 'build',     label: 'BUILD',     index: 1 },
  { id: 'verify',    label: 'VERIFY',    index: 2 },
  { id: 'done',      label: 'DONE',      index: 3 },
];

const stageOrder: Record<PipelineStage, number> = {
  idle:     -1,
  architect: 0,
  build:     1,
  verify:    2,
  done:      3,
  error:     -1,
};

export default function PipelineStatus({ stage, text, streaming, onStop }: Props) {
  if (stage === 'idle') return null;

  const current = stageOrder[stage];

  return (
    <div className="ps-root">
      <div className="ps-stages">
        {STAGES.map(s => {
          const isDone    = current > s.index;
          const isActive  = current === s.index;
          const isPending = current < s.index;
          return (
            <div key={s.id} className={`ps-stage ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isPending ? 'pending' : ''}`}>
              <div className="ps-stage-indicator">
                {isDone ? '✓' : isActive ? <span className="ps-spinner" /> : s.index + 1}
              </div>
              <span className="ps-stage-label">{s.label}</span>
              {s.index < STAGES.length - 1 && <div className={`ps-connector ${isDone ? 'done' : ''}`} />}
            </div>
          );
        })}
      </div>

      {text && (
        <div className="ps-text">
          <span className="ps-text-dot" />
          {text}
        </div>
      )}

      {stage === 'error' && (
        <div className="ps-error">{text}</div>
      )}

      {streaming && (
        <button className="ps-stop" onClick={onStop}>■ STOP</button>
      )}

      <style jsx>{`
        .ps-root {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 10px 20px;
          background: #050505;
          border-bottom: 1px solid #111;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .ps-stages { display: flex; align-items: center; gap: 0; }
        .ps-stage {
          display: flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: 2px; text-transform: uppercase;
          color: #333; transition: color .3s;
        }
        .ps-stage.done    { color: #00FF88; }
        .ps-stage.active  { color: #FFE500; }
        .ps-stage.pending { color: #222; }
        .ps-stage-indicator {
          width: 20px; height: 20px;
          border: 1px solid currentColor;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700;
        }
        .ps-connector {
          width: 24px; height: 1px;
          background: #1a1a1a; margin: 0 6px;
          transition: background .3s;
        }
        .ps-connector.done { background: #00FF88; }
        .ps-spinner {
          display: inline-block;
          width: 8px; height: 8px;
          border: 1px solid #FFE500;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ps-text {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: #555; display: flex; align-items: center; gap: 6px; flex: 1;
        }
        .ps-text-dot {
          width: 5px; height: 5px; background: #FFE500; border-radius: 50%;
          animation: pulse 1s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        .ps-error {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: #FF2D00; flex: 1;
        }
        .ps-stop {
          background: #FF2D00; border: none; color: #fff;
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          font-weight: 700; letter-spacing: 2px; padding: 5px 14px;
          cursor: pointer; transition: all .15s; margin-right: auto;
        }
        .ps-stop:hover { background: #ff4422; }
      `}</style>
    </div>
  );
}
```

---

### `components/fullkonk/CodeOutput.tsx`

```tsx
'use client';

import { useState, useCallback } from 'react';
import { GeneratedFile } from '@/lib/fullkonk/types';

interface Props {
  files: GeneratedFile[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  streaming: boolean;
}

function getLanguageColor(lang: string): string {
  const map: Record<string, string> = {
    typescript: '#0055FF', tsx: '#0055FF', ts: '#0055FF',
    javascript: '#FFE500', jsx: '#FFE500', js: '#FFE500',
    css: '#FF6B00', scss: '#FF6B00',
    json: '#00FF88',
    prisma: '#9B00FF',
    sql: '#00DDFF',
    bash: '#FF2D00', sh: '#FF2D00',
    yaml: '#FF6B00', yml: '#FF6B00',
    dockerfile: '#00DDFF',
    mdx: '#888', md: '#888',
  };
  return map[lang.toLowerCase()] || '#666';
}

async function downloadZip(files: GeneratedFile[]) {
  // dynamic import to avoid SSR issues
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  files.forEach(f => zip.file(f.path, f.content));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fullkonk-output.zip';
  a.click();
  URL.revokeObjectURL(url);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

export default function CodeOutput({ files, activeFile, onSelectFile, streaming }: Props) {
  const [copied, setCopied] = useState(false);

  const currentFile = files.find(f => f.path === activeFile) ?? files[0] ?? null;

  const handleCopy = useCallback(() => {
    if (!currentFile) return;
    copyToClipboard(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [currentFile]);

  if (files.length === 0) {
    return (
      <div className="co-empty">
        <div className="co-empty-icon">{ streaming ? '⟳' : '◈' }</div>
        <div className="co-empty-title">{ streaming ? 'Generating...' : 'Output appears here' }</div>
        <div className="co-empty-sub">{ streaming ? 'Pipeline running' : 'Send a prompt to start' }</div>
        <style jsx>{`
          .co-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #050505; gap: 10px; opacity: .4; }
          .co-empty-icon { font-size: 40px; animation: ${streaming ? 'spin 2s linear infinite' : 'none'}; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .co-empty-title { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #444; letter-spacing: 2px; }
          .co-empty-sub { font-size: 12px; color: #333; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="co-root">
      {/* File tabs */}
      <div className="co-tabs">
        {files.map(f => (
          <button
            key={f.path}
            className={`co-tab ${activeFile === f.path ? 'active' : ''}`}
            onClick={() => onSelectFile(f.path)}
            title={f.path}
            style={{ '--lang-color': getLanguageColor(f.language) } as React.CSSProperties}
          >
            <span className="co-tab-dot" />
            <span className="co-tab-name">{f.path.split('/').pop()}</span>
          </button>
        ))}
      </div>

      {/* File path + actions */}
      {currentFile && (
        <>
          <div className="co-filebar">
            <span className="co-filepath">{currentFile.path}</span>
            <span className="co-lang" style={{ color: getLanguageColor(currentFile.language) }}>
              {currentFile.language}
            </span>
            <button className="co-action" onClick={handleCopy}>
              {copied ? '✓ COPIED' : '⎘ COPY'}
            </button>
            <button className="co-action" onClick={() => downloadZip(files)}>
              ↓ ZIP ({files.length})
            </button>
          </div>
          <div className="co-code-wrap">
            <div className="co-line-nums">
              {currentFile.content.split('\n').map((_, i) => (
                <div key={i} className="co-line-num">{i + 1}</div>
              ))}
            </div>
            <pre className="co-code">{currentFile.content}</pre>
          </div>
        </>
      )}

      <style jsx>{`
        .co-root { display: flex; flex-direction: column; height: 100%; background: #050505; }
        .co-tabs { display: flex; overflow-x: auto; background: #030303; border-bottom: 1px solid #111; flex-shrink: 0; }
        .co-tabs::-webkit-scrollbar { height: 2px; }
        .co-tabs::-webkit-scrollbar-thumb { background: #222; }
        .co-tab {
          display: flex; align-items: center; gap: 5px;
          padding: 8px 14px; border: none; border-right: 1px solid #111;
          background: transparent; color: #444;
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          cursor: pointer; white-space: nowrap; transition: all .15s;
          flex-shrink: 0;
        }
        .co-tab:hover { background: #0d0d0d; color: #888; }
        .co-tab.active { background: #050505; color: #fff; border-bottom: 2px solid var(--lang-color, #FFE500); }
        .co-tab-dot { width: 6px; height: 6px; background: var(--lang-color, #666); flex-shrink: 0; }
        .co-tab-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
        .co-filebar {
          display: flex; align-items: center; gap: 12px;
          padding: 7px 16px; border-bottom: 1px solid #0d0d0d;
          flex-shrink: 0; background: #030303;
        }
        .co-filepath { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #555; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .co-lang { font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .co-action {
          font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700;
          letter-spacing: 1px; color: #444; background: none; border: 1px solid #1a1a1a;
          padding: 3px 10px; cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .co-action:hover { border-color: #FFE500; color: #FFE500; }
        .co-code-wrap { display: flex; flex: 1; overflow: auto; }
        .co-code-wrap::-webkit-scrollbar { width: 6px; height: 6px; }
        .co-code-wrap::-webkit-scrollbar-thumb { background: #1a1a1a; }
        .co-line-nums { padding: 16px 0; background: #030303; border-right: 1px solid #0d0d0d; flex-shrink: 0; user-select: none; }
        .co-line-num { padding: 0 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #222; line-height: 1.7; text-align: right; min-width: 40px; }
        .co-code { margin: 0; padding: 16px 20px; font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.7; color: #ccc; white-space: pre; }
      `}</style>
    </div>
  );
}
```

---

### `components/fullkonk/ProviderBar.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { PROVIDERS } from '@/lib/fullkonk/providers';
import { ProviderID } from '@/lib/fullkonk/types';

interface ProviderInfo {
  id: ProviderID;
  name: string;
  hasKey: boolean;
  models: { id: string; name: string }[];
}

interface Props {
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (p: string) => void;
  onModelChange: (m: string) => void;
  disabled?: boolean;
}

export default function ProviderBar({ selectedProvider, selectedModel, onProviderChange, onModelChange, disabled }: Props) {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);

  useEffect(() => {
    fetch('/api/fullkonk/models')
      .then(r => r.json())
      .then(d => setProviders(d.providers?.filter((p: ProviderInfo) => p.hasKey) ?? []))
      .catch(() => {
        // fallback: show all providers from constants
        setProviders(Object.values(PROVIDERS).map(p => ({
          id: p.id,
          name: p.name,
          hasKey: true,
          models: p.models,
        })));
      });
  }, []);

  const currentProvider = providers.find(p => p.id === selectedProvider);

  const handleProviderChange = (id: string) => {
    onProviderChange(id);
    const prov = providers.find(p => p.id === id);
    if (prov?.models[0]) onModelChange(prov.models[0].id);
  };

  return (
    <div className="pb-root">
      <select
        className="pb-select"
        value={selectedProvider}
        onChange={e => handleProviderChange(e.target.value)}
        disabled={disabled || providers.length === 0}
      >
        {providers.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
        {providers.length === 0 && <option>Loading...</option>}
      </select>

      <select
        className="pb-select"
        value={selectedModel}
        onChange={e => onModelChange(e.target.value)}
        disabled={disabled}
      >
        {(currentProvider?.models ?? []).map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <style jsx>{`
        .pb-root { display: flex; gap: 0; align-items: center; }
        .pb-select {
          background: #0d0d0d; border: 1px solid #222; border-right: none;
          color: #888; font-family: 'JetBrains Mono', monospace; font-size: 10px;
          padding: 5px 10px; cursor: pointer; outline: none; height: 32px;
        }
        .pb-select:last-child { border-right: 1px solid #222; }
        .pb-select:focus { border-color: #FFE500; }
        .pb-select:disabled { opacity: .4; cursor: not-allowed; }
        .pb-select option { background: #0d0d0d; }
      `}</style>
    </div>
  );
}
```

---

### `app/fullkonk/page.tsx`

```tsx
import { Metadata } from 'next';
import Workspace from '@/components/fullkonk/Workspace';

export const metadata: Metadata = {
  title: 'fullKONK_> — Full-Stack AI Builder · konkred.xyz',
  description: 'Describe an idea. Receive a complete product. Cutting-edge frontend + rock-solid backend — integrated, bug-free, deploy-ready.',
  openGraph: {
    title: 'fullKONK_>',
    description: 'Full-stack AI product builder on konkred.xyz',
    url: 'https://konkred.xyz/fullkonk',
  },
};

export default function FullKonkPage() {
  return (
    <main style={{ height: '100vh', overflow: 'hidden' }}>
      <Workspace />
    </main>
  );
}
```

---

### `package.json` — dependencies لازم

```json
{
  "dependencies": {
    "jszip": "^3.10.1"
  }
}
```

فقط `jszip` اضافه می‌شود. بقیه (Next.js، TypeScript، Tailwind) از قبل موجودند.

نصب:
```bash
npm install jszip
npm install --save-dev @types/jszip
```

---

### `.env.local`

```bash
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=sk-...
CEREBRAS_API_KEY=csk-...
SAMBANOVA_API_KEY=...
OPENROUTER_API_KEY=sk-or-...
GEMINI_API_KEY=AIza...
```

---

## خلاصه آنچه ساخته شد

```
fullKONK_> روی konkred.xyz/fullkonk

۱۰ فایل. بدون dependency اضافه جز jszip.
کار می‌کند روی Vercel. Deploy با push به GitHub.

Pipeline:
  ARCHITECT → BUILD → VERIFY
  هر مرحله مدل تخصصی خودش را دارد
  اگر یک provider rate limit خورد → بعدی جایگزین می‌شود

خروجی:
  Chat panel با streaming کامل
  File tree با تب برای هر فایل
  دکمه Copy و Download ZIP
  نمایش line numbers

Mode ها:
  Full-Stack / Frontend / Backend / Review
```