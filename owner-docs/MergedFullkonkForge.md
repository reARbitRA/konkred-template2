Yes. Here's the complete code.

---

### `services/fullkonk.ts`

```typescript
import { ProviderID, GenerateRequest, StreamChunk, PipelineStage } from '../types';

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
```

---

### Server additions — append to `server.ts`

```typescript
// ─── fullKONK_> ROUTES ──────────────────────────────────────────
// Append these to your existing server.ts

import { getSortedProviders, markRateLimited, isRateLimited, SYSTEM_PROMPTS, PROVIDERS } from './services/fullkonk';

// GET /api/fullkonk/providers
app.get('/api/fullkonk/providers', (_req, res) => {
  const list = PROVIDERS.map(p => ({
    id:     p.id,
    name:   p.name,
    models: p.models,
    hasKey: !!process.env[p.envKey],
  }));
  res.json({ providers: list });
});

// POST /api/fullkonk/generate  (SSE streaming)
app.post('/api/fullkonk/generate', async (req, res) => {
  const { prompt, mode = 'fullstack', provider: preferredProvider, model, temperature = 0.4, maxTokens = 8192, systemPrompt } = req.body;

  if (!prompt?.trim()) {
    return res.status(400).json({ error: 'prompt required' });
  }

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const send = (chunk: object) => {
    if (!res.writableEnded) res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  };

  // ── streaming fetch helper ───────────────────────────────────
  async function streamStage(
    task: string,
    messages: { role: string; content: string }[],
    onChunk: (text: string) => void,
  ): Promise<string> {
    const providers = preferredProvider
      ? [PROVIDERS.find(p => p.id === preferredProvider)!, ...getSortedProviders(task).filter(p => p.id !== preferredProvider)]
      : getSortedProviders(task);

    for (const prov of providers) {
      if (!prov) continue;
      const apiKey = process.env[prov.envKey];
      if (!apiKey) continue;
      if (isRateLimited(prov.id)) continue;

      const selectedModel = model && prov.models.some(m => m.id === model)
        ? model
        : prov.models[0].id;

      send({ type: 'provider', provider: prov.name, model: selectedModel });

      try {
        const response = await fetch(`${prov.baseUrl}/chat/completions`, {
          method:  'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type':  'application/json',
            'HTTP-Referer':  'https://konkred.xyz',
            'X-Title':       'fullKONK_>',
          },
          body: JSON.stringify({
            model: selectedModel,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: true,
          }),
          signal: req.socket.destroyed ? AbortSignal.abort() : undefined,
        });

        if (response.status === 429) {
          markRateLimited(prov.id);
          send({ type: 'failover', from: prov.name });
          continue;
        }

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`${response.status}: ${err}`);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let full = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value).split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') continue;
            try {
              const parsed = JSON.parse(raw);
              const text = parsed.choices?.[0]?.delta?.content ?? '';
              if (text) { full += text; onChunk(text); }
            } catch {}
          }
        }

        return full;

      } catch (err: any) {
        if (err?.message?.includes('429')) markRateLimited(prov.id);
        send({ type: 'failover', from: prov.name, error: err?.message });
        continue;
      }
    }

    throw new Error('All providers exhausted.');
  }

  try {
    // ── REVIEW mode ─────────────────────────────────────────────
    if (mode === 'review') {
      send({ type: 'stage', stage: 'review' });
      let out = '';
      await streamStage('verify',
        [
          { role: 'system', content: systemPrompt || SYSTEM_PROMPTS.verify },
          { role: 'user',   content: prompt },
        ],
        chunk => { out += chunk; send({ type: 'delta', content: chunk }); },
      );
      send({ type: 'done' });
      return;
    }

    // ── STAGE 1: ARCHITECT ───────────────────────────────────────
    send({ type: 'stage', stage: 'architect' });
    let architecture = '';
    await streamStage('architect',
      [
        { role: 'system', content: systemPrompt || SYSTEM_PROMPTS.architect },
        { role: 'user',   content: `Design the complete architecture for: ${prompt}` },
      ],
      chunk => { architecture += chunk; send({ type: 'delta', content: chunk }); },
    );

    if (res.writableEnded) return;

    // ── STAGE 2: BUILD ───────────────────────────────────────────
    if (mode === 'frontend' || mode === 'fullstack') {
      send({ type: 'stage', stage: 'frontend' });
      let frontend = '';
      await streamStage('frontend',
        [
          { role: 'system', content: SYSTEM_PROMPTS.frontend },
          { role: 'user',   content: `Architecture:\n${architecture}\n\nImplement the complete frontend.` },
        ],
        chunk => { frontend += chunk; send({ type: 'delta', content: chunk }); },
      );

      if (mode === 'fullstack' && !res.writableEnded) {
        send({ type: 'stage', stage: 'backend' });
        let backend = '';
        await streamStage('backend',
          [
            { role: 'system', content: SYSTEM_PROMPTS.backend },
            { role: 'user',   content: `Architecture:\n${architecture}\n\nFrontend done. Implement the complete backend.` },
          ],
          chunk => { backend += chunk; send({ type: 'delta', content: chunk }); },
        );

        if (!res.writableEnded) {
          send({ type: 'stage', stage: 'verify' });
          let verified = '';
          await streamStage('verify',
            [
              { role: 'system', content: SYSTEM_PROMPTS.verify },
              { role: 'user',   content: `Architecture:\n${architecture}\n\nFrontend:\n${frontend}\n\nBackend:\n${backend}\n\nVerify and fix integration.` },
            ],
            chunk => { verified += chunk; send({ type: 'delta', content: chunk }); },
          );
        }
      }
    } else if (mode === 'backend') {
      send({ type: 'stage', stage: 'backend' });
      await streamStage('backend',
        [
          { role: 'system', content: SYSTEM_PROMPTS.backend },
          { role: 'user',   content: `Architecture:\n${architecture}\n\nImplement the complete backend.` },
        ],
        chunk => send({ type: 'delta', content: chunk }),
      );
    }

    send({ type: 'done' });

  } catch (err: any) {
    send({ type: 'error', error: err?.message ?? 'Pipeline failed' });
  } finally {
    if (!res.writableEnded) res.end();
  }
});
```

---

### `types.ts` — append to your existing types file

```typescript
// ─── fullKONK_> TYPES ────────────────────────────────────────────

export type ProviderID = 'groq' | 'deepseek' | 'cerebras' | 'sambanova' | 'openrouter';

export type BuildMode = 'fullstack' | 'frontend' | 'backend' | 'review';

export type PipelineStage =
  | 'idle'
  | 'architect'
  | 'frontend'
  | 'backend'
  | 'verify'
  | 'review'
  | 'done'
  | 'error';

export interface FKMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  stage?: PipelineStage;
  timestamp: number;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface GenerateRequest {
  prompt: string;
  mode: BuildMode;
  provider?: ProviderID;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface StreamChunk {
  type: 'stage' | 'delta' | 'provider' | 'failover' | 'file' | 'done' | 'error';
  stage?: PipelineStage;
  content?: string;
  provider?: string;
  model?: string;
  from?: string;
  error?: string;
  file?: GeneratedFile;
}
```

---

### `pages/FullKonkPage.tsx`

```tsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BuildMode,
  FKMessage,
  GeneratedFile,
  StreamChunk,
  PipelineStage,
} from '../types';

// ─── CONSTANTS ───────────────────────────────────────────────────

const MODES: { id: BuildMode; label: string; glyph: string }[] = [
  { id: 'fullstack', label: 'FULL-STACK', glyph: '⬡' },
  { id: 'frontend',  label: 'FRONTEND',   glyph: '◈' },
  { id: 'backend',   label: 'BACKEND',    glyph: '⬢' },
  { id: 'review',    label: 'REVIEW',     glyph: '◎' },
];

const STAGE_ORDER: PipelineStage[] = ['architect', 'frontend', 'backend', 'verify', 'done'];

const STAGE_LABELS: Record<string, string> = {
  architect: 'ARCHITECT',
  frontend:  'FRONTEND',
  backend:   'BACKEND',
  verify:    'VERIFY',
  review:    'REVIEW',
  done:      'COMPLETE',
};

const LANG_COLORS: Record<string, string> = {
  ts:         '#0055FF',
  tsx:        '#0055FF',
  typescript: '#0055FF',
  js:         '#FFD700',
  jsx:        '#FFD700',
  css:        '#FF003C',
  json:       '#00FF88',
  prisma:     '#9B00FF',
  sql:        '#00DDFF',
  bash:       '#FF003C',
  yaml:       '#FF6B00',
  dockerfile: '#00DDFF',
};

const SUGGESTIONS = [
  'A SaaS invoice management dashboard with Stripe billing',
  'A real-time collaborative kanban board with WebSocket',
  'A multi-tenant CMS with RBAC and analytics',
  'An API developer portal with key management and rate limiting',
];

// ─── FILE EXTRACTION ─────────────────────────────────────────────

function extractFiles(content: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const re = /```(\w+)?\s*(?:\/\/\s*([\w/.\-]+))?\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const lang    = m[1] || 'text';
    const path    = m[2] || `output.${lang}`;
    const code    = m[3].trim();
    if (code.length > 30) files.push({ path, content: code, language: lang });
  }
  return files;
}

// ─── COPY TO CLIPBOARD ───────────────────────────────────────────

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

// ─── DOWNLOAD ZIP ────────────────────────────────────────────────

async function downloadZip(files: GeneratedFile[]) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  files.forEach(f => zip.file(f.path, f.content));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'fullkonk-output.zip';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── SCANLINE OVERLAY ────────────────────────────────────────────

function Scanlines() {
  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      pointerEvents:   'none',
      zIndex:          9999,
      background:      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
    }} />
  );
}

// ─── PIPELINE STATUS BAR ─────────────────────────────────────────

interface PipelineStatusProps {
  stage:     PipelineStage;
  text:      string;
  streaming: boolean;
  onStop:    () => void;
}

function PipelineStatus({ stage, text, streaming, onStop }: PipelineStatusProps) {
  if (stage === 'idle') return null;

  const stageIdx   = STAGE_ORDER.indexOf(stage);
  const isReview   = stage === 'review';
  const stages     = isReview ? ['review', 'done'] : STAGE_ORDER;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           16,
        padding:       '8px 20px',
        background:    '#050505',
        borderBottom:  '1px solid #1a1a1a',
        flexShrink:    0,
        flexWrap:      'wrap',
        fontFamily:    '"JetBrains Mono", monospace',
        fontSize:      10,
      }}
    >
      {/* Stages */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {stages.map((s, i) => {
          const idx     = STAGE_ORDER.indexOf(s as PipelineStage);
          const done    = stageIdx > idx;
          const active  = stageIdx === idx;
          const color   = done ? '#00FF88' : active ? '#FFD700' : '#2a2a2a';
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display:       'flex',
                alignItems:    'center',
                gap:            5,
                color,
                transition:    'color .3s',
                letterSpacing: 2,
              }}>
                <div style={{
                  width:       18,
                  height:      18,
                  border:      `1px solid ${color}`,
                  display:     'flex',
                  alignItems:  'center',
                  justifyContent: 'center',
                  fontSize:    9,
                  transition:  'border-color .3s',
                  position:    'relative',
                }}>
                  {done ? '✓' : active ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: .8, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width:       8,
                        height:      8,
                        border:      '1px solid #FFD700',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                      }}
                    />
                  ) : i + 1}
                </div>
                <span>{STAGE_LABELS[s]}</span>
              </div>
              {i < stages.length - 1 && (
                <div style={{
                  width:      20,
                  height:      1,
                  background: done ? '#00FF88' : '#1a1a1a',
                  margin:     '0 6px',
                  transition: 'background .3s',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Status text */}
      {text && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#444', flex: 1 }}>
          <motion.div
            animate={{ opacity: [1, .2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ width: 4, height: 4, background: '#FFD700', borderRadius: '50%' }}
          />
          {text}
        </div>
      )}

      {/* Stop */}
      {streaming && (
        <button
          onClick={onStop}
          style={{
            background:    '#FF003C',
            border:        'none',
            color:         '#fff',
            fontFamily:    '"JetBrains Mono", monospace',
            fontSize:       10,
            fontWeight:     700,
            letterSpacing:  2,
            padding:        '4px 12px',
            cursor:         'pointer',
          }}
        >
          ■ STOP
        </button>
      )}
    </motion.div>
  );
}

// ─── PROVIDER BAR ────────────────────────────────────────────────

interface ProviderBarProps {
  provider:         string;
  model:            string;
  onProviderChange: (v: string) => void;
  onModelChange:    (v: string) => void;
  disabled?:        boolean;
}

interface ProviderOption {
  id:     string;
  name:   string;
  hasKey: boolean;
  models: { id: string; label: string }[];
}

function ProviderBar({ provider, model, onProviderChange, onModelChange, disabled }: ProviderBarProps) {
  const [options, setOptions] = useState<ProviderOption[]>([]);

  useEffect(() => {
    fetch('/api/fullkonk/providers')
      .then(r => r.json())
      .then(d => setOptions((d.providers as ProviderOption[]).filter(p => p.hasKey)))
      .catch(() => {});
  }, []);

  const current = options.find(p => p.id === provider);

  const handleProvider = (id: string) => {
    onProviderChange(id);
    const p = options.find(o => o.id === id);
    if (p?.models[0]) onModelChange(p.models[0].id);
  };

  const selectStyle: React.CSSProperties = {
    background:    '#0a0a0a',
    border:        '1px solid #2a2a2a',
    borderRight:   'none',
    color:         '#888',
    fontFamily:    '"JetBrains Mono", monospace',
    fontSize:       10,
    padding:        '5px 10px',
    cursor:         'pointer',
    outline:        'none',
    height:         30,
    opacity:        disabled ? .4 : 1,
  };

  return (
    <div style={{ display: 'flex' }}>
      <select value={provider} onChange={e => handleProvider(e.target.value)} disabled={disabled} style={selectStyle}>
        {options.length === 0
          ? <option>Loading...</option>
          : options.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
        }
      </select>
      <select value={model} onChange={e => onModelChange(e.target.value)} disabled={disabled} style={{ ...selectStyle, borderRight: '1px solid #2a2a2a' }}>
        {(current?.models ?? []).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
      </select>
    </div>
  );
}

// ─── CODE OUTPUT ─────────────────────────────────────────────────

interface CodeOutputProps {
  files:         GeneratedFile[];
  activeFile:    string | null;
  onSelectFile:  (p: string) => void;
  streaming:     boolean;
}

function CodeOutput({ files, activeFile, onSelectFile, streaming }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);
  const current = files.find(f => f.path === activeFile) ?? files[0] ?? null;

  const handleCopy = () => {
    if (!current) return;
    copyText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  if (files.length === 0) {
    return (
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        height:         '100%',
        background:     '#050505',
        gap:            12,
        opacity:        .4,
        fontFamily:     '"JetBrains Mono", monospace',
      }}>
        <motion.div
          animate={streaming ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: 36, color: '#333' }}
        >
          {streaming ? '◎' : '◈'}
        </motion.div>
        <div style={{ color: '#444', fontSize: 12, letterSpacing: 2 }}>
          {streaming ? 'GENERATING...' : 'OUTPUT APPEARS HERE'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#050505' }}>
      {/* File tabs */}
      <div style={{
        display:      'flex',
        overflowX:    'auto',
        background:   '#030303',
        borderBottom: '1px solid #111',
        flexShrink:    0,
      }}>
        {files.map(f => {
          const lang  = f.language.toLowerCase();
          const color = LANG_COLORS[lang] || '#555';
          const isActive = f.path === activeFile;
          return (
            <button
              key={f.path}
              onClick={() => onSelectFile(f.path)}
              title={f.path}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:             5,
                padding:         '7px 14px',
                border:          'none',
                borderRight:    '1px solid #111',
                borderBottom:   isActive ? `2px solid ${color}` : '2px solid transparent',
                background:     isActive ? '#050505' : 'transparent',
                color:          isActive ? '#fff' : '#444',
                fontFamily:     '"JetBrains Mono", monospace',
                fontSize:        10,
                cursor:          'pointer',
                whiteSpace:      'nowrap',
                flexShrink:      0,
                transition:      'all .15s',
              }}
            >
              <div style={{ width: 6, height: 6, background: color, flexShrink: 0 }} />
              {f.path.split('/').pop()}
            </button>
          );
        })}
      </div>

      {/* File actions */}
      {current && (
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:           10,
          padding:       '6px 14px',
          borderBottom: '1px solid #0d0d0d',
          background:   '#030303',
          flexShrink:    0,
        }}>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: '#444', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {current.path}
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: LANG_COLORS[current.language.toLowerCase()] || '#555', letterSpacing: 1, textTransform: 'uppercase' }}>
            {current.language}
          </span>
          <button onClick={handleCopy} style={actionBtnStyle}>{copied ? '✓ COPIED' : '⎘ COPY'}</button>
          <button onClick={() => downloadZip(files)} style={actionBtnStyle}>↓ ZIP ({files.length})</button>
        </div>
      )}

      {/* Code */}
      {current && (
        <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
          {/* Line numbers */}
          <div style={{
            padding:     '14px 0',
            background:  '#030303',
            borderRight: '1px solid #0d0d0d',
            flexShrink:   0,
            userSelect:   'none',
          }}>
            {current.content.split('\n').map((_, i) => (
              <div key={i} style={{
                padding:     '0 12px',
                fontFamily:  '"JetBrains Mono", monospace',
                fontSize:     11,
                lineHeight:  '1.7',
                color:       '#222',
                textAlign:   'right',
                minWidth:     40,
              }}>
                {i + 1}
              </div>
            ))}
          </div>
          <pre style={{
            margin:     0,
            padding:    '14px 20px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize:    11,
            lineHeight: '1.7',
            color:      '#ccc',
            whiteSpace: 'pre',
            flexShrink:  0,
            minWidth:   0,
          }}>
            {current.content}
          </pre>
        </div>
      )}
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  fontFamily:    '"JetBrains Mono", monospace',
  fontSize:       9,
  letterSpacing:  1,
  color:          '#444',
  background:     'none',
  border:         '1px solid #1a1a1a',
  padding:        '3px 10px',
  cursor:         'pointer',
  transition:     'all .15s',
  whiteSpace:     'nowrap',
};

// ─── CHAT PANEL ──────────────────────────────────────────────────

interface ChatPanelProps {
  messages:              FKMessage[];
  streaming:             boolean;
  systemPrompt:          string;
  temperature:           number;
  maxTokens:             number;
  onSystemPromptChange:  (v: string) => void;
  onTemperatureChange:   (v: number) => void;
  onMaxTokensChange:     (v: number) => void;
  onSend:                (p: string) => void;
  onClear:               () => void;
}

function ChatPanel({
  messages, streaming, systemPrompt, temperature, maxTokens,
  onSystemPromptChange, onTemperatureChange, onMaxTokensChange,
  onSend, onClear,
}: ChatPanelProps) {
  const [input,        setInput]        = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const t = input.trim();
    if (!t || streaming) return;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    onSend(t);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#080808' }}>

      {/* Toolbar */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:           8,
        padding:       '9px 14px',
        borderBottom: '1px solid #111',
        flexShrink:    0,
      }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: 3, color: '#2a2a2a', textTransform: 'uppercase', marginRight: 'auto' }}>
          // TERMINAL
        </span>
        <button style={iconBtnStyle} onClick={() => setShowSettings(s => !s)} title="Settings">⚙</button>
        <button style={iconBtnStyle} onClick={onClear} disabled={streaming} title="Clear">✕</button>
      </div>

      {/* Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              overflow:     'hidden',
              borderBottom: '1px solid #111',
              background:   '#050505',
              flexShrink:    0,
            }}
          >
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, letterSpacing: 3, color: '#9B00FF', marginBottom: 6, textTransform: 'uppercase' }}>
                SYSTEM PROMPT
              </div>
              <textarea
                value={systemPrompt}
                onChange={e => onSystemPromptChange(e.target.value)}
                placeholder="Override system behavior..."
                rows={3}
                style={{
                  width:      '100%',
                  background: '#0d0d0d',
                  border:     '1px solid #222',
                  color:      '#777',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize:    10,
                  padding:     '7px',
                  resize:      'none',
                  outline:     'none',
                  lineHeight: '1.6',
                  boxSizing:  'border-box',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <SliderRow label="Temperature" min={0} max={1} step={0.01} value={temperature} onChange={onTemperatureChange} display={temperature.toFixed(2)} />
                <SliderRow label="Max Tokens"  min={1024} max={16384} step={512} value={maxTokens} onChange={onMaxTokensChange} display={maxTokens.toLocaleString()} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
            <motion.div
              animate={{ opacity: [.4, 1, .4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 22, color: '#FFD700', letterSpacing: 4 }}
            >
              fullKONK_&gt;
            </motion.div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: '#333', letterSpacing: 1 }}>
              DESCRIBE WHAT YOU WANT TO BUILD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320, marginTop: 8 }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{
                    background:   '#0a0a0a',
                    border:       '1px solid #1a1a1a',
                    color:        '#444',
                    padding:      '7px 12px',
                    fontSize:      10,
                    textAlign:    'right',
                    cursor:       'pointer',
                    fontFamily:   '"JetBrains Mono", monospace',
                    transition:   'all .15s',
                    lineHeight:   '1.5',
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#FFD700'; (e.target as HTMLElement).style.color = '#FFD700'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#1a1a1a'; (e.target as HTMLElement).style.color = '#444'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .25 }}
            >
              {msg.role === 'user' ? (
                <div style={{
                  background:  '#111',
                  border:      '1px solid #222',
                  padding:     '9px 13px',
                  fontSize:    13,
                  color:       '#fff',
                  fontFamily:  '"Space Grotesk", sans-serif',
                }}>
                  {msg.content}
                </div>
              ) : (
                <div style={{
                  position:   'relative',
                  padding:    '10px 13px',
                  background: '#030f03',
                  border:     '1px solid #0f200f',
                }}>
                  <div style={{
                    position:   'absolute',
                    top:        -8,
                    right:       8,
                    background: '#00FF88',
                    color:      '#000',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize:    7,
                    fontWeight:  700,
                    padding:    '1px 5px',
                    letterSpacing: 1,
                  }}>
                    {msg.stage ? STAGE_LABELS[msg.stage] || 'AI' : 'AI'}
                  </div>
                  <pre style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize:    10,
                    color:      '#00FF88',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    wordBreak:  'break-word',
                    margin:      0,
                  }}>
                    {msg.content}
                    {streaming && idx === messages.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: .7, repeat: Infinity }}
                        style={{ display: 'inline-block', width: 6, height: 12, background: '#00FF88', verticalAlign: 'middle', marginRight: 2 }}
                      />
                    )}
                  </pre>
                </div>
              )}
            </motion.div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display:      'flex',
        gap:           8,
        padding:       '10px 12px',
        borderTop:    '1px solid #111',
        flexShrink:    0,
        background:   '#050505',
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={onInputChange}
          onKeyDown={onKey}
          disabled={streaming}
          placeholder="Describe what you want to build..."
          rows={1}
          style={{
            flex:       1,
            background: '#0d0d0d',
            border:     '1px solid #222',
            color:      '#fff',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize:    13,
            padding:    '7px 11px',
            outline:    'none',
            resize:     'none',
            maxHeight:   160,
            overflowY:  'auto',
            lineHeight: '1.5',
            opacity:    streaming ? .4 : 1,
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() && !streaming}
          style={{
            background:    streaming ? '#FF003C' : '#FFD700',
            border:        'none',
            color:         streaming ? '#fff' : '#000',
            fontFamily:    '"JetBrains Mono", monospace',
            fontSize:       10,
            fontWeight:     700,
            letterSpacing:  2,
            padding:        '8px 16px',
            cursor:         'pointer',
            alignSelf:      'flex-end',
            whiteSpace:     'nowrap',
            opacity:        (!input.trim() && !streaming) ? .3 : 1,
            transition:     'all .15s',
          }}
        >
          {streaming ? '■ STOP' : 'BUILD →'}
        </button>
      </div>
    </div>
  );
}

// ─── SLIDER ROW ──────────────────────────────────────────────────

function SliderRow({ label, min, max, step, value, onChange, display }: {
  label:    string;
  min:      number;
  max:      number;
  step:     number;
  value:    number;
  onChange: (v: number) => void;
  display:  string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#444', width: 90, flexShrink: 0 }}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: '#FFD700', cursor: 'pointer' }}
      />
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#FFD700', width: 52, textAlign: 'right' }}>{display}</span>
    </div>
  );
}

// ─── ICON BUTTON ─────────────────────────────────────────────────

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border:     '1px solid #1a1a1a',
  color:      '#444',
  width:       26,
  height:      26,
  cursor:      'pointer',
  fontSize:    12,
  display:    'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all .15s',
  padding:     0,
};

// ─── MAIN PAGE ───────────────────────────────────────────────────

export default function FullKonkPage() {
  const [mode,          setMode]          = useState<BuildMode>('fullstack');
  const [messages,      setMessages]      = useState<FKMessage[]>([]);
  const [stage,         setStage]         = useState<PipelineStage>('idle');
  const [stageText,     setStageText]     = useState('');
  const [files,         setFiles]         = useState<GeneratedFile[]>([]);
  const [streaming,     setStreaming]      = useState(false);
  const [activeFile,    setActiveFile]    = useState<string | null>(null);
  const [provider,      setProvider]      = useState('groq');
  const [model,         setModel]         = useState('llama-3.3-70b-versatile');
  const [temperature,   setTemperature]   = useState(0.4);
  const [maxTokens,     setMaxTokens]     = useState(8192);
  const [systemPrompt,  setSystemPrompt]  = useState('');
  const [currentStage,  setCurrentStage]  = useState<PipelineStage>('idle');

  const abortRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((msg: Omit<FKMessage, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }]);
  }, []);

  const appendToLast = useCallback((content: string, stage: PipelineStage) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === 'assistant' && last.stage === stage) {
        return [...prev.slice(0, -1), { ...last, content: last.content + content }];
      }
      return [...prev, { role: 'assistant', content, id: crypto.randomUUID(), timestamp: Date.now(), stage }];
    });
  }, []);

  const handleSend = useCallback(async (prompt: string) => {
    if (!prompt.trim() || streaming) return;

    abortRef.current = new AbortController();
    setStreaming(true);
    setStage('architect');
    setStageText('Initializing...');
    setFiles([]);
    setActiveFile(null);

    addMessage({ role: 'user', content: prompt });

    try {
      const res = await fetch('/api/fullkonk/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ prompt, mode, provider, model, temperature, maxTokens, systemPrompt: systemPrompt || undefined }),
        signal:  abortRef.current.signal,
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(e.error);
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let activeStage: PipelineStage = 'architect';

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
              activeStage = chunk.stage as PipelineStage;
              setStage(activeStage);
              setCurrentStage(activeStage);
              setStageText(chunk.content || STAGE_LABELS[activeStage] || '');
              break;
            case 'provider':
              setStageText(`${chunk.provider} / ${chunk.model}`);
              break;
            case 'failover':
              setStageText(`Switching from ${chunk.from}...`);
              break;
            case 'delta':
              appendToLast(chunk.content || '', activeStage);
              // extract files on the fly
              if (chunk.content) {
                setFiles(prev => {
                  const all = extractFiles(
                    prev.map(f => '```' + f.language + '\n// ' + f.path + '\n' + f.content + '\n```').join('\n') + chunk.content
                  );
                  return all.length ? all : prev;
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
        addMessage({ role: 'assistant', content: `ERROR: ${err.message}`, stage: 'error' });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [streaming, mode, provider, model, temperature, maxTokens, systemPrompt, addMessage, appendToLast]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
    setStage('idle');
    setStageText('');
  }, []);

  const handleClear = useCallback(() => {
    setMessages([]);
    setFiles([]);
    setStage('idle');
    setStageText('');
    setActiveFile(null);
  }, []);

  // Extract files from full assistant output whenever messages change
  useEffect(() => {
    const allText = messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n');
    const extracted = extractFiles(allText);
    if (extracted.length > 0) {
      setFiles(extracted);
      if (!activeFile && extracted[0]) setActiveFile(extracted[0].path);
    }
  }, [messages]);

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100vh',
      background:    '#000',
      color:         '#fff',
      overflow:      'hidden',
      fontFamily:    '"Space Grotesk", sans-serif',
    }}>
      <Scanlines />

      {/* ── TOP BAR ── */}
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:            14,
        padding:        '0 18px',
        height:         54,
        background:    '#000',
        borderBottom:  '3px solid #1a1a1a',
        flexShrink:     0,
        flexWrap:      'wrap',
        position:      'relative',
        zIndex:         10,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto' }}>
          <motion.div
            animate={{ opacity: [1, .3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 8, height: 8, background: '#FF003C', borderRadius: '50%', boxShadow: '0 0 8px #FF003C' }}
          />
          <span style={{
            fontFamily:    '"Orbitron", sans-serif',
            fontSize:       15,
            fontWeight:     900,
            color:          '#FFD700',
            letterSpacing:  3,
            textTransform: 'uppercase',
          }}>
            fullKONK_&gt;
          </span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize:    9,
            color:      '#2a2a2a',
            letterSpacing: 2,
          }}>
            konkred.xyz
          </span>
        </div>

        {/* Mode selector */}
        <div style={{ display: 'flex' }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => !streaming && setMode(m.id)}
              title={m.label}
              style={{
                padding:       '5px 14px',
                background:    mode === m.id ? '#FFD700' : 'transparent',
                border:        '1px solid ' + (mode === m.id ? '#FFD700' : '#222'),
                borderRight:   'none',
                color:         mode === m.id ? '#000' : '#444',
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:       9,
                fontWeight:     700,
                letterSpacing:  2,
                cursor:         streaming ? 'not-allowed' : 'pointer',
                whiteSpace:     'nowrap',
                opacity:        streaming && mode !== m.id ? .4 : 1,
                transition:     'all .15s',
              }}
            >
              {m.glyph} {m.label}
            </button>
          ))}
          <div style={{ width: 1, background: '#222' }} />
        </div>

        {/* Provider selector */}
        <ProviderBar
          provider={provider}
          model={model}
          onProviderChange={setProvider}
          onModelChange={setModel}
          disabled={streaming}
        />
      </div>

      {/* ── PIPELINE STATUS ── */}
      <PipelineStatus
        stage={stage}
        text={stageText}
        streaming={streaming}
        onStop={handleStop}
      />

      {/* ── MAIN LAYOUT ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '380px 1fr',
        flex:                 1,
        overflow:            'hidden',
      }}>
        {/* LEFT — chat */}
        <div style={{ borderRight: '3px solid #111', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <ChatPanel
            messages={messages}
            streaming={streaming}
            systemPrompt={systemPrompt}
            temperature={temperature}
            maxTokens={maxTokens}
            onSystemPromptChange={setSystemPrompt}
            onTemperatureChange={setTemperature}
            onMaxTokensChange={setMaxTokens}
            onSend={handleSend}
            onClear={handleClear}
          />
        </div>

        {/* RIGHT — code output */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <CodeOutput
            files={files}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            streaming={streaming}
          />
        </div>
      </div>
    </div>
  );
}
```

---

### Route registration

Add this wherever your other routes are defined — React Router, or whichever router you're using:

```tsx
// In your router config — exact syntax depends on your router
{ path: '/fullkonk', element: <FullKonkPage /> }
```

And in `Navbar.tsx`, add the link alongside Forge or wherever it fits:

```tsx
<NavLink to="/fullkonk">fullKONK_&gt;</NavLink>
```

---

### Install one dependency

```bash
npm install jszip
```

Everything else — React 19, Framer Motion v12, Tailwind, Firebase, TypeScript — is already in your stack.