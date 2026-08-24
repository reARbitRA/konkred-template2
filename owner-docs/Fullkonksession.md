### `services/fullkonk.sessions.ts`

```typescript
// services/fullkonk.sessions.ts

import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { FKMessage, GeneratedFile, BuildMode } from '../types';

export interface FKSession {
  id:         string;
  userId:     string;
  title:      string;
  mode:       BuildMode;
  provider:   string;
  model:      string;
  messages:   FKMessage[];
  files:      GeneratedFile[];
  createdAt:  number;
  updatedAt:  number;
  tokenCount: number;
  stage:      string;
}

export interface FKSessionCreate {
  userId:   string;
  title:    string;
  mode:     BuildMode;
  provider: string;
  model:    string;
}

// Create new session
export async function createSession(data: FKSessionCreate): Promise<string> {
  const ref = await addDoc(collection(db, 'fk_sessions'), {
    ...data,
    messages:   [],
    files:      [],
    tokenCount: 0,
    stage:      'idle',
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  });
  return ref.id;
}

// Update session with messages and files
export async function updateSession(
  sessionId: string,
  data: Partial<Pick<FKSession, 'messages' | 'files' | 'stage' | 'tokenCount' | 'title'>>
): Promise<void> {
  await updateDoc(doc(db, 'fk_sessions', sessionId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Get sessions for a user
export async function getUserSessions(userId: string, count = 20): Promise<FKSession[]> {
  const q = query(
    collection(db, 'fk_sessions'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id:         d.id,
      userId:     data.userId,
      title:      data.title,
      mode:       data.mode,
      provider:   data.provider,
      model:      data.model,
      messages:   data.messages ?? [],
      files:      data.files ?? [],
      tokenCount: data.tokenCount ?? 0,
      stage:      data.stage ?? 'idle',
      createdAt:  (data.createdAt as Timestamp)?.toMillis?.() ?? 0,
      updatedAt:  (data.updatedAt as Timestamp)?.toMillis?.() ?? 0,
    } satisfies FKSession;
  });
}

// Get single session
export async function getSession(sessionId: string): Promise<FKSession | null> {
  const snap = await getDoc(doc(db, 'fk_sessions', sessionId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id:         snap.id,
    userId:     data.userId,
    title:      data.title,
    mode:       data.mode,
    provider:   data.provider,
    model:      data.model,
    messages:   data.messages ?? [],
    files:      data.files ?? [],
    tokenCount: data.tokenCount ?? 0,
    stage:      data.stage ?? 'idle',
    createdAt:  (data.createdAt as Timestamp)?.toMillis?.() ?? 0,
    updatedAt:  (data.updatedAt as Timestamp)?.toMillis?.() ?? 0,
  };
}

// Generate title from first user message
export function generateSessionTitle(prompt: string): string {
  return prompt.length > 60 ? prompt.slice(0, 57) + '...' : prompt;
}
```

---

### `services/fullkonk.analytics.ts`

```typescript
// services/fullkonk.analytics.ts

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  getCountFromServer,
} from 'firebase/firestore';

export interface UsageEvent {
  id:         string;
  userId:     string;
  provider:   string;
  model:      string;
  mode:       string;
  stage:      string;
  tokens:     number;
  durationMs: number;
  success:    boolean;
  createdAt:  number;
}

export interface UsageSummary {
  totalGenerations: number;
  totalTokens:      number;
  totalDurationMs:  number;
  byProvider:       Record<string, { count: number; tokens: number }>;
  byMode:           Record<string, number>;
  failoverCount:    number;
  avgDurationMs:    number;
}

// Log a usage event
export async function logUsage(data: Omit<UsageEvent, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'fk_usage'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// Get usage summary for a user over N days
export async function getUserUsageSummary(userId: string, days = 30): Promise<UsageSummary> {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  const q = query(
    collection(db, 'fk_usage'),
    where('userId', '==', userId),
    where('createdAt', '>=', Timestamp.fromMillis(since)),
    orderBy('createdAt', 'desc'),
    limit(1000),
  );

  const snap = await getDocs(q);
  const events = snap.docs.map(d => d.data() as Omit<UsageEvent, 'id'>);

  const summary: UsageSummary = {
    totalGenerations: events.length,
    totalTokens:      0,
    totalDurationMs:  0,
    byProvider:       {},
    byMode:           {},
    failoverCount:    0,
    avgDurationMs:    0,
  };

  for (const e of events) {
    summary.totalTokens     += e.tokens      ?? 0;
    summary.totalDurationMs += e.durationMs  ?? 0;

    if (!summary.byProvider[e.provider]) {
      summary.byProvider[e.provider] = { count: 0, tokens: 0 };
    }
    summary.byProvider[e.provider].count  += 1;
    summary.byProvider[e.provider].tokens += e.tokens ?? 0;

    summary.byMode[e.mode] = (summary.byMode[e.mode] ?? 0) + 1;
  }

  summary.avgDurationMs = events.length
    ? Math.round(summary.totalDurationMs / events.length)
    : 0;

  return summary;
}

// Get recent events
export async function getRecentEvents(userId: string, count = 10): Promise<UsageEvent[]> {
  const q = query(
    collection(db, 'fk_usage'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    id:         d.id,
    ...(d.data() as Omit<UsageEvent, 'id'>),
    createdAt: (d.data().createdAt as Timestamp)?.toMillis?.() ?? 0,
  }));
}
```

---

### `services/fullkonk.github.ts`

```typescript
// services/fullkonk.github.ts

import { GeneratedFile } from '../types';

export interface GitHubConfig {
  token:  string;
  owner:  string;
  repo:   string;
  branch: string;
  message: string;
}

export interface GitHubExportResult {
  success:  boolean;
  prUrl?:   string;
  commitSha?: string;
  filesUploaded: number;
  errors:   string[];
}

// Base64 encode for GitHub API
function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

// Get or create branch
async function ensureBranch(config: GitHubConfig): Promise<void> {
  const base = `https://api.github.com/repos/${config.owner}/${config.repo}`;
  const headers = {
    'Authorization': `Bearer ${config.token}`,
    'Content-Type':  'application/json',
    'Accept':        'application/vnd.github+json',
  };

  // Get default branch SHA
  const repoRes = await fetch(`${base}/git/refs/heads/main`, { headers });
  if (!repoRes.ok) throw new Error('Cannot access repository. Check token and repo name.');
  const repoData = await repoRes.json();
  const sha = repoData.object.sha;

  // Check if branch exists
  const branchRes = await fetch(`${base}/git/refs/heads/${config.branch}`, { headers });
  if (branchRes.status === 404) {
    // Create branch
    await fetch(`${base}/git/refs`, {
      method:  'POST',
      headers,
      body: JSON.stringify({ ref: `refs/heads/${config.branch}`, sha }),
    });
  }
}

// Get existing file SHA (needed for updates)
async function getFileSha(
  config: GitHubConfig,
  path: string,
): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`,
    {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept':        'application/vnd.github+json',
      },
    },
  );
  if (!res.ok) return undefined;
  const data = await res.json();
  return data.sha;
}

// Upload a single file
async function uploadFile(
  config: GitHubConfig,
  file: GeneratedFile,
): Promise<void> {
  const sha = await getFileSha(config, file.path);

  const body: Record<string, string> = {
    message: config.message,
    content: toBase64(file.content),
    branch:  config.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${file.path}`,
    {
      method:  'PUT',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type':  'application/json',
        'Accept':        'application/vnd.github+json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? `Failed to upload ${file.path}`);
  }
}

// Create PR
async function createPR(config: GitHubConfig): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls`,
    {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type':  'application/json',
        'Accept':        'application/vnd.github+json',
      },
      body: JSON.stringify({
        title: `[fullKONK_>] ${config.message}`,
        head:  config.branch,
        base:  'main',
        body:  `Generated by fullKONK_> on konkred.xyz\n\n${config.message}`,
      }),
    },
  );
  if (!res.ok) return '';
  const data = await res.json();
  return data.html_url ?? '';
}

// Main export function
export async function exportToGitHub(
  files: GeneratedFile[],
  config: GitHubConfig,
): Promise<GitHubExportResult> {
  const errors: string[] = [];
  let filesUploaded = 0;
  let prUrl = '';

  try {
    await ensureBranch(config);
  } catch (err: any) {
    return { success: false, errors: [err.message], filesUploaded: 0 };
  }

  for (const file of files) {
    try {
      await uploadFile(config, file);
      filesUploaded++;
    } catch (err: any) {
      errors.push(`${file.path}: ${err.message}`);
    }
  }

  if (filesUploaded > 0 && config.branch !== 'main') {
    try {
      prUrl = await createPR(config);
    } catch {
      // PR creation failure is non-fatal
    }
  }

  return {
    success:       filesUploaded > 0,
    prUrl:         prUrl || undefined,
    filesUploaded,
    errors,
  };
}
```

---

### Server additions — append to `server.ts`

```typescript
// ─── APPEND TO server.ts ─────────────────────────────────────────────────────
// Session and analytics routes for fullKONK_>
// These run server-side using Firebase Admin SDK
// If you are using Firebase client SDK on server, adjust imports accordingly

import { logUsage, getUserUsageSummary, getRecentEvents } from './services/fullkonk.analytics';

// GET /api/fullkonk/sessions/:userId
app.get('/api/fullkonk/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = Math.min(Number(req.query.count) || 20, 50);
    // Import getUserSessions — uses client SDK, so call from frontend directly
    // This route is a pass-through if you want server-side fetching
    res.json({ message: 'Fetch sessions client-side via firebase SDK', userId, count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/fullkonk/usage
app.post('/api/fullkonk/usage', async (req, res) => {
  try {
    const { userId, provider, model, mode, stage, tokens, durationMs, success } = req.body;
    if (!userId || !provider) return res.status(400).json({ error: 'userId and provider required' });
    await logUsage({ userId, provider, model, mode, stage, tokens: tokens ?? 0, durationMs: durationMs ?? 0, success: success ?? true });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/fullkonk/analytics/:userId
app.get('/api/fullkonk/analytics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const days = Math.min(Number(req.query.days) || 30, 90);
    const [summary, recent] = await Promise.all([
      getUserUsageSummary(userId, days),
      getRecentEvents(userId, 10),
    ]);
    res.json({ summary, recent });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/fullkonk/github/export
app.post('/api/fullkonk/github/export', async (req, res) => {
  const { exportToGitHub } = await import('./services/fullkonk.github');
  try {
    const { files, token, owner, repo, branch = 'fullkonk-output', message = 'Generated by fullKONK_>' } = req.body;
    if (!files?.length) return res.status(400).json({ error: 'files required' });
    if (!token || !owner || !repo) return res.status(400).json({ error: 'token, owner, repo required' });
    const result = await exportToGitHub(files, { token, owner, repo, branch, message });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

---

### `components/fullkonk/SessionSidebar.tsx`

```tsx
// components/fullkonk/SessionSidebar.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserSessions, FKSession } from '../../services/fullkonk.sessions';

interface Props {
  userId:          string;
  activeSessionId: string | null;
  onSelect:        (session: FKSession) => void;
  onNew:           () => void;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const m    = Math.floor(diff / 60000);
  const h    = Math.floor(diff / 3600000);
  const d    = Math.floor(diff / 86400000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

const MODE_COLORS: Record<string, string> = {
  fullstack: '#FFD700',
  frontend:  '#0055FF',
  backend:   '#00FF88',
  review:    '#FF003C',
};

export default function SessionSidebar({ userId, activeSessionId, onSelect, onNew }: Props) {
  const [sessions, setSessions] = useState<FKSession[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserSessions(userId, 30)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
      background:    '#030303',
      borderRight:   '1px solid #1a1a1a',
      fontFamily:    '"JetBrains Mono", monospace',
    }}>
      {/* Header */}
      <div style={{
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        padding:        '10px 12px',
        borderBottom:  '1px solid #111',
        flexShrink:     0,
      }}>
        <span style={{ fontSize: 9, letterSpacing: 3, color: '#333', textTransform: 'uppercase' }}>
          // HISTORY
        </span>
        <button
          onClick={onNew}
          style={{
            background:    '#FFD700',
            border:        'none',
            color:         '#000',
            fontSize:       9,
            fontWeight:     700,
            letterSpacing:  2,
            padding:        '4px 10px',
            cursor:         'pointer',
            fontFamily:    '"JetBrains Mono", monospace',
          }}
        >
          + NEW
        </button>
      </div>

      {/* Session list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && (
          <div style={{ padding: 16, fontSize: 10, color: '#333', textAlign: 'center' }}>
            Loading...
          </div>
        )}
        {!loading && sessions.length === 0 && (
          <div style={{ padding: 16, fontSize: 10, color: '#2a2a2a', textAlign: 'center' }}>
            No sessions yet
          </div>
        )}
        <AnimatePresence>
          {sessions.map(s => {
            const isActive = s.id === activeSessionId;
            const modeColor = MODE_COLORS[s.mode] ?? '#555';
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => onSelect(s)}
                style={{
                  display:         'flex',
                  flexDirection:   'column',
                  gap:              4,
                  width:           '100%',
                  padding:          '10px 12px',
                  background:      isActive ? '#0a0a0a' : 'transparent',
                  border:          'none',
                  borderRight:     isActive ? `3px solid ${modeColor}` : '3px solid transparent',
                  borderBottom:    '1px solid #080808',
                  cursor:          'pointer',
                  textAlign:       'right',
                  transition:      'all .15s',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = '#050505';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Title */}
                <div style={{
                  fontSize:     10,
                  color:        isActive ? '#fff' : '#666',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace:   'nowrap',
                  fontFamily:   '"Space Grotesk", sans-serif',
                }}>
                  {s.title || 'Untitled'}
                </div>
                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 8, color: modeColor, letterSpacing: 1, textTransform: 'uppercase' }}>
                    {s.mode}
                  </span>
                  <span style={{ fontSize: 8, color: '#2a2a2a' }}>·</span>
                  <span style={{ fontSize: 8, color: '#333' }}>{timeAgo(s.updatedAt)}</span>
                  {s.files.length > 0 && (
                    <>
                      <span style={{ fontSize: 8, color: '#2a2a2a' }}>·</span>
                      <span style={{ fontSize: 8, color: '#333' }}>{s.files.length} files</span>
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

### `components/fullkonk/AnalyticsDashboard.tsx`

```tsx
// components/fullkonk/AnalyticsDashboard.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UsageSummary, UsageEvent } from '../../services/fullkonk.analytics';

interface Props {
  userId: string;
  onClose: () => void;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ height: 4, background: '#111', flex: 1, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: .8, ease: 'easeOut' }}
        style={{ height: '100%', background: color }}
      />
    </div>
  );
}

function StatCard({ label, value, sub, color = '#FFD700' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{
      padding:   '18px 20px',
      border:    '1px solid #1a1a1a',
      background:'#050505',
      display:   'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 22, fontWeight: 900, color }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#333' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function AnalyticsDashboard({ userId, onClose }: Props) {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [recent,  setRecent]  = useState<UsageEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [days,    setDays]    = useState(30);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/fullkonk/analytics/${userId}?days=${days}`)
      .then(r => r.json())
      .then(d => { setSummary(d.summary); setRecent(d.recent ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId, days]);

  const providers = summary ? Object.entries(summary.byProvider).sort((a, b) => b[1].count - a[1].count) : [];
  const maxCount  = providers[0]?.[1].count ?? 1;

  const PROVIDER_COLORS: Record<string, string> = {
    groq:       '#FFD700',
    deepseek:   '#0055FF',
    cerebras:   '#00FF88',
    sambanova:  '#FF6B00',
    openrouter: '#9B00FF',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position:       'fixed',
        inset:           0,
        background:     'rgba(0,0,0,.92)',
        zIndex:          100,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:         20,
        backdropFilter: 'blur(4px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: .96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background:  '#0a0a0a',
          border:      '3px solid #1a1a1a',
          width:       '100%',
          maxWidth:     900,
          maxHeight:   '88vh',
          overflowY:  'auto',
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {/* Header */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          padding:        '14px 20px',
          borderBottom:  '1px solid #1a1a1a',
          flexShrink:     0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: 3, color: '#FFD700', textTransform: 'uppercase' }}>
              // ANALYTICS
            </span>
            <div style={{ display: 'flex', gap: 0 }}>
              {[7, 30, 90].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  style={{
                    padding:    '3px 10px',
                    background: days === d ? '#FFD700' : 'transparent',
                    border:     '1px solid #222',
                    borderRight: 'none',
                    color:      days === d ? '#000' : '#444',
                    fontSize:    9,
                    fontWeight:  700,
                    letterSpacing: 1,
                    cursor:      'pointer',
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {d}D
                </button>
              ))}
              <div style={{ width: 1, background: '#222' }} />
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid #222', color: '#555', width: 28, height: 28, cursor: 'pointer', fontSize: 13 }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#333', fontSize: 11 }}>
              LOADING...
            </div>
          ) : !summary ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#333', fontSize: 11 }}>
              No data yet. Build something first.
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, marginBottom: 1 }}>
                <StatCard label="Generations"  value={summary.totalGenerations} color="#FFD700" />
                <StatCard label="Total Tokens" value={summary.totalTokens.toLocaleString()} color="#00FF88" />
                <StatCard label="Avg Duration" value={`${(summary.avgDurationMs / 1000).toFixed(1)}s`} color="#0055FF" />
                <StatCard label="Providers Used" value={Object.keys(summary.byProvider).length} color="#FF003C" />
              </div>

              {/* Provider breakdown */}
              {providers.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: '#333', textTransform: 'uppercase', marginBottom: 12 }}>
                    // PROVIDER USAGE
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {providers.map(([id, data]) => (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 80, fontSize: 9, color: PROVIDER_COLORS[id] ?? '#555', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right', flexShrink: 0 }}>
                          {id}
                        </div>
                        <Bar value={data.count} max={maxCount} color={PROVIDER_COLORS[id] ?? '#555'} />
                        <div style={{ fontSize: 9, color: '#555', width: 60, textAlign: 'right', flexShrink: 0 }}>
                          {data.count} req
                        </div>
                        <div style={{ fontSize: 9, color: '#333', width: 80, textAlign: 'right', flexShrink: 0 }}>
                          {data.tokens.toLocaleString()} tok
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode breakdown */}
              {Object.keys(summary.byMode).length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: '#333', textTransform: 'uppercase', marginBottom: 12 }}>
                    // MODE BREAKDOWN
                  </div>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {Object.entries(summary.byMode).map(([mode, count]) => {
                      const pct = Math.round((count / summary.totalGenerations) * 100);
                      const modeColors: Record<string, string> = { fullstack: '#FFD700', frontend: '#0055FF', backend: '#00FF88', review: '#FF003C' };
                      return (
                        <div key={mode} style={{ flex: pct, background: modeColors[mode] ?? '#333', padding: '10px 8px', minWidth: 40 }}>
                          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 8, color: '#000', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                            {mode}
                          </div>
                          <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: 14, fontWeight: 900, color: '#000', marginTop: 4 }}>
                            {pct}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent activity */}
              {recent.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: '#333', textTransform: 'uppercase', marginBottom: 12 }}>
                    // RECENT ACTIVITY
                  </div>
                  <div style={{ border: '1px solid #111' }}>
                    {recent.map((e, i) => (
                      <div key={e.id} style={{
                        display:       'flex',
                        alignItems:    'center',
                        gap:            12,
                        padding:        '8px 12px',
                        borderBottom:  i < recent.length - 1 ? '1px solid #0d0d0d' : 'none',
                        fontSize:       9,
                      }}>
                        <div style={{ color: e.success ? '#00FF88' : '#FF003C', width: 8, flexShrink: 0 }}>
                          {e.success ? '●' : '✕'}
                        </div>
                        <div style={{ color: PROVIDER_COLORS[e.provider] ?? '#555', width: 70, flexShrink: 0, letterSpacing: 1 }}>
                          {e.provider}
                        </div>
                        <div style={{ color: '#444', width: 70, flexShrink: 0 }}>
                          {e.mode}
                        </div>
                        <div style={{ color: '#333', flex: 1 }}>
                          {e.tokens.toLocaleString()} tokens
                        </div>
                        <div style={{ color: '#222', flexShrink: 0 }}>
                          {(e.durationMs / 1000).toFixed(1)}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
```

---

### `components/fullkonk/GitHubExportModal.tsx`

```tsx
// components/fullkonk/GitHubExportModal.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedFile } from '../../types';
import { GitHubExportResult } from '../../services/fullkonk.github';

interface Props {
  files:   GeneratedFile[];
  onClose: () => void;
}

export default function GitHubExportModal({ files, onClose }: Props) {
  const [token,   setToken]   = useState('');
  const [owner,   setOwner]   = useState('');
  const [repo,    setRepo]    = useState('');
  const [branch,  setBranch]  = useState('fullkonk-output');
  const [message, setMessage] = useState('Generated by fullKONK_> · konkred.xyz');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<GitHubExportResult | null>(null);
  const [error,   setError]   = useState('');

  const handleExport = async () => {
    if (!token.trim() || !owner.trim() || !repo.trim()) {
      setError('Token, owner, and repo are required.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/fullkonk/github/export', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, token, owner, repo, branch, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Export failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width:      '100%',
    background: '#050505',
    border:     '1px solid #222',
    color:      '#fff',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize:    11,
    padding:    '8px 10px',
    outline:    'none',
    boxSizing:  'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily:    '"JetBrains Mono", monospace',
    fontSize:       9,
    color:          '#444',
    letterSpacing:  2,
    textTransform: 'uppercase',
    marginBottom:   5,
    display:       'block',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position:       'fixed',
        inset:           0,
        background:     'rgba(0,0,0,.9)',
        zIndex:          200,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:         20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: .95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background:  '#0a0a0a',
          border:      '3px solid #1a1a1a',
          width:       '100%',
          maxWidth:     480,
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {/* Header */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:         '12px 16px',
          borderBottom:   '1px solid #1a1a1a',
        }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: '#FFD700', textTransform: 'uppercase' }}>
            // EXPORT TO GITHUB
          </span>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #222', color: '#555', width: 26, height: 26, cursor: 'pointer', fontSize: 12 }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* File count */}
          <div style={{ fontSize: 10, color: '#444', padding: '8px 10px', border: '1px solid #111', background: '#050505' }}>
            {files.length} file{files.length !== 1 ? 's' : ''} ready to export
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {files.slice(0, 6).map(f => (
                <span key={f.path} style={{ fontSize: 8, color: '#333', padding: '2px 6px', border: '1px solid #111' }}>
                  {f.path.split('/').pop()}
                </span>
              ))}
              {files.length > 6 && (
                <span style={{ fontSize: 8, color: '#2a2a2a', padding: '2px 6px' }}>
                  +{files.length - 6} more
                </span>
              )}
            </div>
          </div>

          {/* GitHub Personal Access Token */}
          <div>
            <label style={labelStyle}>GitHub Token (repo scope)</label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="ghp_..."
              style={inputStyle}
            />
            <div style={{ fontSize: 8, color: '#2a2a2a', marginTop: 4 }}>
              Token is sent to your server — never stored on konkred.xyz
            </div>
          </div>

          {/* Owner + Repo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Owner / Org</label>
              <input value={owner} onChange={e => setOwner(e.target.value)} placeholder="yourusername" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Repository</label>
              <input value={repo} onChange={e => setRepo(e.target.value)} placeholder="my-project" style={inputStyle} />
            </div>
          </div>

          {/* Branch */}
          <div>
            <label style={labelStyle}>Branch</label>
            <input value={branch} onChange={e => setBranch(e.target.value)} style={inputStyle} />
          </div>

          {/* Commit message */}
          <div>
            <label style={labelStyle}>Commit Message</label>
            <input value={message} onChange={e => setMessage(e.target.value)} style={inputStyle} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ fontSize: 10, color: '#FF003C', padding: '8px 10px', border: '1px solid #FF003C', background: '#0d0000' }}>
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div style={{ fontSize: 10, padding: '10px', border: `1px solid ${result.success ? '#00FF88' : '#FF003C'}`, background: result.success ? '#001a00' : '#0d0000' }}>
              <div style={{ color: result.success ? '#00FF88' : '#FF003C', fontWeight: 700, marginBottom: 6 }}>
                {result.success ? `✓ ${result.filesUploaded} files exported` : '✕ Export failed'}
              </div>
              {result.prUrl && (
                <a href={result.prUrl} target="_blank" rel="noreferrer" style={{ color: '#FFD700', fontSize: 9, display: 'block', marginTop: 4 }}>
                  → View Pull Request
                </a>
              )}
              {result.errors.length > 0 && (
                <div style={{ marginTop: 6, color: '#FF003C', fontSize: 9 }}>
                  {result.errors.map((e, i) => <div key={i}>{e}</div>)}
                </div>
              )}
            </div>
          )}

          {/* Action */}
          {!result && (
            <button
              onClick={handleExport}
              disabled={loading}
              style={{
                background:    loading ? '#222' : '#FFD700',
                border:        'none',
                color:         loading ? '#555' : '#000',
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:       10,
                fontWeight:     700,
                letterSpacing:  2,
                padding:        '11px',
                cursor:         loading ? 'not-allowed' : 'pointer',
                transition:     'all .15s',
                textTransform: 'uppercase',
              }}
            >
              {loading ? 'EXPORTING...' : '↑ PUSH TO GITHUB'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
```

---

### Updated `pages/FullKonkPage.tsx` — top section only, showing where to wire everything in

```tsx
// pages/FullKonkPage.tsx
// Add these imports to your existing FullKonkPage.tsx

import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getAuth }                 from 'firebase/auth';
import SessionSidebar              from '../components/fullkonk/SessionSidebar';
import AnalyticsDashboard          from '../components/fullkonk/AnalyticsDashboard';
import GitHubExportModal           from '../components/fullkonk/GitHubExportModal';
import { FKSession, createSession, updateSession, getSession, generateSessionTitle } from '../services/fullkonk.sessions';
import { logUsage }                from '../services/fullkonk.analytics';

// Inside FullKonkPage component, add these state vars:
/*
  const [userId,         setUserId]         = useState<string | null>(null);
  const [activeSession,  setActiveSession]  = useState<string | null>(null);
  const [showSidebar,    setShowSidebar]    = useState(true);
  const [showAnalytics,  setShowAnalytics]  = useState(false);
  const [showGitHub,     setShowGitHub]     = useState(false);
  const startTimeRef = useRef<number>(0);
*/

// Get user on mount:
/*
  useEffect(() => {
    const auth = getAuth();
    const unsub = auth.onAuthStateChanged(u => setUserId(u?.uid ?? null));
    return unsub;
  }, []);
*/

// When user sends a message, create session:
/*
  // At start of handleSend, after validation:
  let sessionId = activeSession;
  if (!sessionId && userId) {
    sessionId = await createSession({
      userId,
      title:    generateSessionTitle(prompt),
      mode,
      provider,
      model,
    });
    setActiveSession(sessionId);
  }
  startTimeRef.current = Date.now();
*/

// After pipeline completes, update session + log usage:
/*
  if (sessionId && userId) {
    await updateSession(sessionId, { messages, files, stage: 'done' });
    await logUsage({
      userId,
      provider,
      model,
      mode,
      stage:      'done',
      tokens:     0,       // token count not returned by all providers
      durationMs: Date.now() - startTimeRef.current,
      success:    true,
    });
  }
*/

// Load session when user clicks history:
/*
  const handleSelectSession = async (session: FKSession) => {
    setActiveSession(session.id);
    setMessages(session.messages);
    setFiles(session.files);
    setMode(session.mode);
    setProvider(session.provider);
    setModel(session.model);
    setStage('done');
  };
*/

// In the JSX layout, add sidebar and modals:
/*
  <div style={{ display: 'grid', gridTemplateColumns: showSidebar ? '200px 380px 1fr' : '380px 1fr', ... }}>
    {showSidebar && userId && (
      <SessionSidebar
        userId={userId}
        activeSessionId={activeSession}
        onSelect={handleSelectSession}
        onNew={() => { handleClear(); setActiveSession(null); }}
      />
    )}
    ... rest of layout ...
  </div>

  // In top bar, add buttons:
  <button onClick={() => setShowSidebar(s => !s)}>≡ HISTORY</button>
  <button onClick={() => setShowAnalytics(true)}>◎ ANALYTICS</button>
  {files.length > 0 && (
    <button onClick={() => setShowGitHub(true)}>↑ GITHUB</button>
  )}

  // Modals:
  <AnimatePresence>
    {showAnalytics && userId && (
      <AnalyticsDashboard userId={userId} onClose={() => setShowAnalytics(false)} />
    )}
    {showGitHub && (
      <GitHubExportModal files={files} onClose={() => setShowGitHub(false)} />
    )}
  </AnimatePresence>
*/
```

---

### Firestore rules — add to your existing rules

```
// firestore.rules — add these collections

match /fk_sessions/{sessionId} {
  allow read, write: if request.auth != null
    && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null
    && request.auth.uid == request.resource.data.userId;
}

match /fk_usage/{eventId} {
  allow read: if request.auth != null
    && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null
    && request.auth.uid == request.resource.data.userId;
  allow update, delete: if false;
}
```

---

**چهار چیز اضافه شد، همه روی stack واقعی تو:**

| چی              | کجا                                              |
| --------------- | ------------------------------------------------ |
| Session history | Firestore `fk_sessions`                          |
| Usage analytics | Firestore `fk_usage` + `/api/fullkonk/analytics` |
| GitHub export   | `/api/fullkonk/github/export` + modal            |
| Session sidebar | کنار chat panel                                  |
