import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import AnalyticsDashboard from '../components/fullkonk/AnalyticsDashboard';
import ChatPanel from '../components/fullkonk/ChatPanel';
import CodeOutput from '../components/fullkonk/CodeOutput';
import GitHubExportModal from '../components/fullkonk/GitHubExportModal';
import PipelineStatus, { PipelineMetrics } from '../components/fullkonk/PipelineStatus';
import SessionSidebar from '../components/fullkonk/SessionSidebar';
import { createSession, FKSession, generateSessionTitle, updateSession } from '../services/fullkonk.sessions';
import { logUsage } from '../services/fullkonk.analytics';
import { saveProject } from '../services/fullkonk.projects';
import { AttachedCodeFile, BuildMode, FKMessage, FKProject, GeneratedFile, PipelineStage, StreamChunk } from '../types';

const MODES: { id: BuildMode; label: string }[] = [
  { id: 'fullstack', label: 'FULL-STACK' }, { id: 'frontend', label: 'FRONTEND' }, { id: 'backend', label: 'BACKEND' }, { id: 'review', label: 'REVIEW' },
];
const EXTENSIONS: Record<string, string> = { ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx', html: 'html', css: 'css', json: 'json', prisma: 'prisma', sql: 'sql', yaml: 'yaml', yml: 'yaml', sh: 'bash', bash: 'bash' };
interface ProviderOption { id: string; name: string; hasKey: boolean; models: { id: string; label: string }[] }

function normalizeLanguage(value: string, path: string): string {
  const raw = value.toLowerCase().trim();
  if (raw && raw !== 'text' && raw !== 'plaintext') return EXTENSIONS[raw] || raw;
  const extension = path.split('.').pop()?.toLowerCase() || 'text';
  return EXTENSIONS[extension] || extension;
}

function cleanPath(value: string): string {
  return value.trim().replace(/^['"`]|['"`]$/g, '').replace(/^\.\//, '').replace(/\\/g, '/').replace(/^\/+/, '');
}

export function extractFiles(content: string): GeneratedFile[] {
  const lines = content.split(/\r?\n/);
  const files = new Map<string, GeneratedFile>();
  let inFence = false;
  let marker = '```';
  let language = '';
  let buffer: string[] = [];
  let precedingPath = '';
  let unnamed = 0;
  const pathPattern = /(?:file(?:name)?\s*:\s*|^#{1,6}\s*|^\/\/\s*|^<!--\s*)([\w@+.,()\[\] -]+\/[\w@+.,()\[\]/ -]+|[\w@+(),\[\] -]+\.(?:tsx?|jsx?|css|html?|json|prisma|sql|ya?ml|sh))(?:\s*-->)?\s*$/i;

  for (const line of lines) {
    if (!inFence) {
      const pathMatch = line.trim().match(pathPattern);
      if (pathMatch) precedingPath = cleanPath(pathMatch[1]);
      const opening = line.match(/^\s*(`{3,}|~{3,})([^\s`]*)\s*(.*)$/);
      if (!opening) continue;
      inFence = true;
      marker = opening[1];
      language = opening[2] || '';
      const inlinePath = opening[3].match(/^(?:\/\/\s*|file:\s*)?([^\s]+\.[\w]+)\s*$/i);
      if (inlinePath) precedingPath = cleanPath(inlinePath[1]);
      buffer = [];
      continue;
    }
    if (line.trim() === marker || new RegExp(`^${marker[0]}{${marker.length},}$`).test(line.trim())) {
      inFence = false;
      const firstLinePath = buffer[0]?.match(/^\s*(?:\/\/|#|<!--)\s*(?:file(?:name)?\s*:\s*)?([^\s].*?\.[a-z0-9]+)\s*(?:-->)?\s*$/i);
      let path = firstLinePath ? cleanPath(firstLinePath[1]) : precedingPath;
      if (firstLinePath) buffer.shift();
      const code = buffer.join('\n').trim();
      if (code) {
        if (!path) {
          unnamed += 1;
          const ext = language.toLowerCase() || 'txt';
          path = `generated/output-${unnamed}.${ext === 'typescript' ? 'ts' : ext === 'javascript' ? 'js' : ext}`;
        }
        const normalizedLanguage = normalizeLanguage(language, path);
        files.set(path, { path, content: code, language: normalizedLanguage, isTest: /(?:^|\/)(?:__tests__\/|.*\.(?:test|spec)\.[jt]sx?$)/i.test(path) });
      }
      precedingPath = '';
      buffer = [];
      continue;
    }
    buffer.push(line);
  }
  return [...files.values()];
}

function mergeFiles(base: GeneratedFile[], generated: GeneratedFile[]): GeneratedFile[] {
  const merged = new Map(base.map(file => [file.path, file]));
  generated.forEach(file => merged.set(file.path, file));
  return [...merged.values()];
}

function isStreamChunk(value: unknown): value is StreamChunk {
  if (!value || typeof value !== 'object') return false;
  return typeof (value as { type?: unknown }).type === 'string';
}

async function authHeaders(): Promise<Record<string, string>> {
  const user = getAuth().currentUser;
  const token = user ? await user.getIdToken() : '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function FullKonkPage() {
  const [mode, setMode] = useState<BuildMode>('fullstack');
  const [messages, setMessages] = useState<FKMessage[]>([]);
  const [files, setFiles] = useState<GeneratedFile[]>([]);
  const [previousFiles, setPreviousFiles] = useState<GeneratedFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [stageText, setStageText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [provider, setProvider] = useState('google');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [providerOptions, setProviderOptions] = useState<ProviderOption[]>([]);
  const [temperature, setTemperature] = useState(0.4);
  const [maxTokens, setMaxTokens] = useState(8192);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [metrics, setMetrics] = useState<PipelineMetrics>({ tokensPerSecond: 0, totalTokens: 0, provider: '', elapsedMs: 0 });
  const [attachments, setAttachments] = useState<AttachedCodeFile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<FKProject | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [saveState, setSaveState] = useState('SAVE AS PROJECT');
  const abortRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef(0);
  const generationTextRef = useRef('');
  const baseFilesRef = useRef<GeneratedFile[]>([]);
  const latestPromptRef = useRef('');
  const metricsRef = useRef<PipelineMetrics>({ tokensPerSecond: 0, totalTokens: 0, provider: '', elapsedMs: 0 });

  useEffect(() => {
    const auth = getAuth();
    return auth.onAuthStateChanged(user => { setUserId(user?.uid || null); if (user) setShowSidebar(true); });
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/fullkonk/providers', { signal: controller.signal })
      .then(response => response.json() as Promise<{ providers?: ProviderOption[] }>)
      .then(data => {
        const available = (data.providers || []).filter(option => option.hasKey);
        setProviderOptions(available);
        if (available.length && !available.some(option => option.id === provider)) {
          setProvider(available[0].id);
          setModel(available[0].models[0]?.id || '');
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    if (!streaming) return;
    const timer = window.setInterval(() => setMetrics(value => ({ ...value, elapsedMs: Date.now() - startTimeRef.current })), 100);
    return () => window.clearInterval(timer);
  }, [streaming]);

  const addMessage = useCallback((message: Omit<FKMessage, 'id' | 'timestamp'>) => {
    setMessages(previous => [...previous, { ...message, id: crypto.randomUUID(), timestamp: Date.now() }]);
  }, []);
  const appendToLast = useCallback((content: string, nextStage: PipelineStage) => {
    setMessages(previous => {
      const last = previous.at(-1);
      if (last?.role === 'assistant' && last.stage === nextStage) return [...previous.slice(0, -1), { ...last, content: last.content + content }];
      return [...previous, { id: crypto.randomUUID(), timestamp: Date.now(), role: 'assistant', stage: nextStage, content }];
    });
  }, []);

  const handleSend = useCallback(async (rawPrompt: string) => {
    const prompt = rawPrompt.trim();
    if (!prompt || streaming) return;
    const controller = new AbortController();
    abortRef.current = controller;
    startTimeRef.current = Date.now();
    latestPromptRef.current = prompt;
    generationTextRef.current = '';
    baseFilesRef.current = activeProject?.files || files;
    setPreviousFiles(baseFilesRef.current);
    setStreaming(true);
    setStage(mode === 'review' ? 'review' : 'architect');
    setStageText('INITIALIZING PIPELINE');
    metricsRef.current = { tokensPerSecond: 0, totalTokens: 0, provider: '', elapsedMs: 0 };
    setMetrics(metricsRef.current);
    setSaveState(activeProject ? 'UPDATE PROJECT' : 'SAVE AS PROJECT');
    addMessage({ role: 'user', content: prompt });

    let sessionId = activeSession;
    if (!sessionId && userId) {
      try {
        sessionId = await createSession({ userId, title: generateSessionTitle(prompt), mode, provider, model });
        setActiveSession(sessionId);
      } catch {
        setStageText('SESSION PERSISTENCE UNAVAILABLE');
      }
    }

    let completed = false;
    let activeStage: PipelineStage = mode === 'review' ? 'review' : 'architect';
    try {
      const headers = await authHeaders();
      const response = await fetch('/api/fullkonk/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ prompt, mode, provider, model, temperature, maxTokens, systemPrompt: systemPrompt || undefined, projectId: activeProject?.id, attachedFiles: attachments }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: 'Generation request failed.' })) as { error?: string };
        throw new Error(payload.error || 'Generation request failed.');
      }
      if (!response.body) throw new Error('Generation stream was empty.');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let pending = '';
      while (true) {
        const result = await reader.read();
        pending += decoder.decode(result.value || new Uint8Array(), { stream: !result.done });
        const events = pending.split('\n\n');
        pending = events.pop() || '';
        for (const event of events) {
          const raw = event.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
          if (!raw) continue;
          let parsed: unknown;
          try { parsed = JSON.parse(raw); } catch { continue; }
          if (!isStreamChunk(parsed)) continue;
          switch (parsed.type) {
            case 'stage': activeStage = parsed.stage; setStage(parsed.stage); setStageText(parsed.content || parsed.stage.toUpperCase()); break;
            case 'provider':
              metricsRef.current = { ...metricsRef.current, provider: parsed.provider };
              setMetrics(value => ({ ...value, provider: parsed.provider }));
              setStageText(`${parsed.provider} / ${parsed.model}`);
              break;
            case 'failover':
              metricsRef.current = { ...metricsRef.current, transition: `${parsed.from} → ${parsed.to || 'NEXT PROVIDER'}` };
              setMetrics(value => ({ ...value, transition: metricsRef.current.transition }));
              break;
            case 'metrics':
              metricsRef.current = { ...metricsRef.current, ...parsed.data };
              setMetrics(value => ({ ...value, ...parsed.data }));
              break;
            case 'reset':
              if (activeStage !== 'architect') {
                generationTextRef.current = generationTextRef.current.slice(0, Math.max(0, generationTextRef.current.length - parsed.characters));
              }
              setMessages(previous => {
                const last = previous.at(-1);
                if (!last || last.role !== 'assistant' || last.stage !== activeStage) return previous;
                const content = last.content.slice(0, Math.max(0, last.content.length - parsed.characters));
                return content ? [...previous.slice(0, -1), { ...last, content }] : previous.slice(0, -1);
              });
              setFiles(mergeFiles(baseFilesRef.current, extractFiles(generationTextRef.current)));
              break;
            case 'delta':
              if (activeStage !== 'architect') generationTextRef.current += parsed.content;
              appendToLast(parsed.content, activeStage);
              if (activeStage !== 'architect') setFiles(mergeFiles(baseFilesRef.current, extractFiles(generationTextRef.current)));
              break;
            case 'file': setFiles(current => mergeFiles(current, [{ ...parsed.file, language: parsed.file.language.toLowerCase() }])); break;
            case 'done': completed = true; setStage('done'); setStageText('BUILD COMPLETE'); break;
            case 'error': throw new Error(parsed.error);
          }
        }
        if (result.done) break;
      }
      if (!completed) throw new Error('Generation stream closed before completion.');
      const finalFiles = mergeFiles(baseFilesRef.current, extractFiles(generationTextRef.current));
      setFiles(finalFiles);
      setActiveFile(current => current && finalFiles.some(file => file.path === current) ? current : finalFiles[0]?.path || null);
      if (userId) void logUsage({ userId, provider: metricsRef.current.provider || provider, model, mode, stage: 'done', tokens: metricsRef.current.totalTokens, durationMs: Date.now() - startTimeRef.current, success: true });
      setAttachments([]);
      setSidebarRefresh(value => value + 1);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStage('idle'); setStageText('');
      } else {
        const message = error instanceof Error ? error.message : 'Unknown pipeline error';
        setStage('error'); setStageText(message); addMessage({ role: 'assistant', stage: 'error', content: `ERROR: ${message}` });
        if (userId) void logUsage({ userId, provider, model, mode, stage: 'error', tokens: metricsRef.current.totalTokens, durationMs: Date.now() - startTimeRef.current, success: false });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [activeProject, activeSession, addMessage, appendToLast, attachments, files, maxTokens, mode, model, provider, streaming, systemPrompt, temperature, userId]);

  useEffect(() => {
    if (stage !== 'done' || !activeSession || !userId) return;
    void updateSession(activeSession, { messages, files, stage: 'done', tokenCount: metrics.totalTokens })
      .catch(() => setStageText('BUILD COMPLETE · SESSION SAVE FAILED'));
  }, [activeSession, files, messages, metrics.totalTokens, stage, userId]);

  const clearWorkspace = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]); setFiles([]); setPreviousFiles([]); setActiveFile(null); setActiveSession(null); setActiveProject(null); setStage('idle'); setStageText(''); setAttachments([]);
  }, []);
  const selectSession = useCallback((session: FKSession) => {
    setActiveSession(session.id); setActiveProject(null); setMessages(session.messages); setFiles(session.files); setPreviousFiles([]); setMode(session.mode); setProvider(session.provider); setModel(session.model); setStage('done'); setActiveFile(session.files[0]?.path || null);
  }, []);
  const selectProject = useCallback((project: FKProject) => {
    setActiveProject(project); setActiveSession(null); setMessages([]); setFiles(project.files); setPreviousFiles(project.files); setStage('done'); setStageText(`PROJECT: ${project.name}`); setActiveFile(project.files[0]?.path || null); setSaveState('UPDATE PROJECT');
  }, []);
  const handleSaveProject = useCallback(async () => {
    if (!userId || files.length === 0) return;
    const estimatedSize = new Blob([JSON.stringify(files)]).size;
    if (estimatedSize > 900_000) { setSaveState('PROJECT EXCEEDS 900KB'); return; }
    setSaveState('SAVING...');
    try {
      const name = activeProject?.name || generateSessionTitle(latestPromptRef.current || 'fullKONK project');
      const projectId = await saveProject({ userId, name, description: latestPromptRef.current, stack: [...new Set(files.map(file => file.language))], files, sessions: [...new Set([...(activeProject?.sessions || []), ...(activeSession ? [activeSession] : [])])] }, activeProject?.id);
      setActiveProject({ id: projectId, userId, name, description: latestPromptRef.current, stack: [...new Set(files.map(file => file.language))], files, sessions: [...new Set([...(activeProject?.sessions || []), ...(activeSession ? [activeSession] : [])])], createdAt: activeProject?.createdAt || Date.now(), updatedAt: Date.now() });
      setSaveState('✓ PROJECT SAVED'); setSidebarRefresh(value => value + 1);
    } catch (error) { setSaveState(error instanceof Error ? error.message.toUpperCase() : 'SAVE FAILED'); }
  }, [activeProject, activeSession, files, userId]);

  return <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#000', color: '#fff', overflow: 'hidden' }}>
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.035) 2px, rgba(0,0,0,.035) 4px)' }} />
    <header style={{ height: 54, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: '3px solid #1a1a1a', overflowX: 'auto' }}>
      <motion.span animate={{ opacity: [1, .35, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ width: 8, height: 8, background: '#FF003C', boxShadow: '0 0 8px #FF003C' }} />
      <strong style={{ fontFamily: 'Orbitron, sans-serif', color: '#FFD700', letterSpacing: 3, whiteSpace: 'nowrap' }}>fullKONK_&gt;</strong>
      <div style={{ flex: 1 }} />
      {userId && <button onClick={() => setShowSidebar(value => !value)} style={topButton}>≡ WORKSPACE</button>}
      {userId && files.length > 0 && <button onClick={() => { void handleSaveProject(); }} style={{ ...topButton, borderColor: '#FFD700', color: '#FFD700' }}>{saveState}</button>}
      {userId && <button onClick={() => setShowAnalytics(true)} style={topButton}>◎ ANALYTICS</button>}
      {files.length > 0 && <button onClick={() => setShowGitHub(true)} style={{ ...topButton, background: '#0055FF', color: '#fff', borderColor: '#0055FF' }}>↑ GITHUB</button>}
      <div style={{ display: 'flex' }}>{MODES.map(item => <button key={item.id} disabled={streaming} onClick={() => setMode(item.id)} style={{ ...topButton, color: mode === item.id ? '#000' : '#555', background: mode === item.id ? '#FFD700' : '#050505', borderColor: mode === item.id ? '#FFD700' : '#222' }}>{item.label}</button>)}</div>
      <button onClick={() => setShowSettings(value => !value)} style={topButton}>⚙ SETTINGS</button>
      <select value={provider} disabled={streaming} onChange={event => { const next = providerOptions.find(option => option.id === event.target.value); setProvider(event.target.value); if (next?.models[0]) setModel(next.models[0].id); }} style={selectStyle}>{providerOptions.length ? providerOptions.map(option => <option key={option.id} value={option.id}>{option.name.toUpperCase()}</option>) : <option value={provider}>NO PROVIDERS</option>}</select>
      <select value={model} disabled={streaming} onChange={event => setModel(event.target.value)} style={selectStyle}>{(providerOptions.find(option => option.id === provider)?.models || [{ id: model, label: model }]).map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select>
    </header>
    {showSettings && <div style={{ display: 'grid', gridTemplateColumns: '120px 160px minmax(240px, 1fr)', gap: 10, alignItems: 'center', padding: '8px 16px', background: '#050505', borderBottom: '1px solid #222', fontFamily: '"JetBrains Mono", monospace', fontSize: 8, color: '#666' }}>
      <label>TEMPERATURE <input type="number" min={0} max={1} step={0.05} value={temperature} onChange={event => setTemperature(Number(event.target.value))} style={{ ...selectStyle, width: 58, marginLeft: 5 }} /></label>
      <label>MAX TOKENS <select value={maxTokens} onChange={event => setMaxTokens(Number(event.target.value))} style={{ ...selectStyle, marginLeft: 5 }}><option value={4096}>4096</option><option value={8192}>8192</option><option value={16384}>16384</option></select></label>
      <input value={systemPrompt} onChange={event => setSystemPrompt(event.target.value)} placeholder="Optional system prompt override" style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }} />
    </div>}
    <PipelineStatus stage={stage} text={stageText} streaming={streaming} metrics={metrics} onStop={() => abortRef.current?.abort()} />
    <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: showSidebar && userId ? '220px minmax(300px, 380px) minmax(0, 1fr)' : 'minmax(300px, 380px) minmax(0, 1fr)' }}>
      {showSidebar && userId && <SessionSidebar userId={userId} activeSessionId={activeSession} activeProjectId={activeProject?.id || null} refreshKey={sidebarRefresh} onSelect={selectSession} onSelectProject={selectProject} onNew={clearWorkspace} />}
      <div style={{ minWidth: 0, borderRight: '3px solid #111' }}><ChatPanel messages={messages} streaming={streaming} attachments={attachments} onAttachmentsChange={setAttachments} onSend={prompt => { void handleSend(prompt); }} onClear={clearWorkspace} /></div>
      <div style={{ minWidth: 0 }}><CodeOutput files={files} previousFiles={previousFiles} activeFile={activeFile} onSelectFile={setActiveFile} streaming={streaming} /></div>
    </main>
    <AnimatePresence>{showAnalytics && userId && <AnalyticsDashboard userId={userId} onClose={() => setShowAnalytics(false)} />}{showGitHub && <GitHubExportModal files={files} onClose={() => setShowGitHub(false)} />}</AnimatePresence>
  </div>;
}

const topButton: React.CSSProperties = { background: '#050505', border: '1px solid #222', color: '#888', padding: '5px 9px', fontFamily: '"JetBrains Mono", monospace', fontSize: 8, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', whiteSpace: 'nowrap' };
const selectStyle: React.CSSProperties = { ...topButton, outline: 'none' };
