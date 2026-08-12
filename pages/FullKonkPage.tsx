import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth } from 'firebase/auth';
import {
  BuildMode,
  FKMessage,
  GeneratedFile,
  StreamChunk,
  PipelineStage,
} from '../types';
import SessionSidebar from '../components/fullkonk/SessionSidebar';
import AnalyticsDashboard from '../components/fullkonk/AnalyticsDashboard';
import GitHubExportModal from '../components/fullkonk/GitHubExportModal';
import { FKSession, createSession, updateSession, generateSessionTitle } from '../services/fullkonk.sessions';
import { logUsage } from '../services/fullkonk.analytics';

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
  const pathCounts: Record<string, number> = {};
  const re = /```(\w+)?\s*(?:\/\/\s*([\w/.\-]+))?\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const lang = m[1] || 'text';
    let path   = m[2] || `output.${lang}`;
    const code = m[3].trim();
    if (code.length > 30) {
      if (pathCounts[path]) {
        pathCounts[path]++;
        const extIndex = path.lastIndexOf('.');
        if (extIndex > 0) {
          path = `${path.substring(0, extIndex)}_${pathCounts[path]}${path.substring(extIndex)}`;
        } else {
          path = `${path}_${pathCounts[path]}`;
        }
      } else {
        pathCounts[path] = 1;
      }
      files.push({ path, content: code, language: lang });
    }
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
        {files.map((f, idx) => {
          const lang  = f.language.toLowerCase();
          const color = LANG_COLORS[lang] || '#555';
          const isActive = f.path === activeFile;
          return (
            <button
              key={`${f.path}-${idx}`}
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
  const [provider,      setProvider]      = useState('google');
  const [model,         setModel]         = useState('gemini-2.5-flash');
  const [temperature,   setTemperature]   = useState(0.4);
  const [maxTokens,     setMaxTokens]     = useState(8192);
  const [systemPrompt,  setSystemPrompt]  = useState('');

  const [userId,         setUserId]        = useState<string | null>(null);
  const [activeSession,  setActiveSession] = useState<string | null>(null);
  const [showSidebar,    setShowSidebar]   = useState(false);
  const [showAnalytics,  setShowAnalytics] = useState(false);
  const [showGitHub,     setShowGitHub]    = useState(false);
  const startTimeRef                       = useRef<number>(0);

  useEffect(() => {
    try {
      const auth = getAuth();
      const unsub = auth.onAuthStateChanged(u => {
        setUserId(u?.uid ?? null);
        if (u?.uid) setShowSidebar(true);
      });
      return unsub;
    } catch {
      // Auth fallback if firebase auth isn't active
    }
  }, []);

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
    startTimeRef.current = Date.now();

    let currentSessionId = activeSession;
    if (!currentSessionId && userId) {
      try {
        currentSessionId = await createSession({
          userId,
          title: generateSessionTitle(prompt),
          mode,
          provider,
          model,
        });
        setActiveSession(currentSessionId);
      } catch (err) {
        console.error('Failed to create session:', err);
      }
    }

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

      // Log usage and update session on completion
      const durationMs = Date.now() - startTimeRef.current;
      if (userId) {
        logUsage({
          userId,
          provider,
          model,
          mode,
          stage: 'done',
          tokens: 0,
          durationMs,
          success: true,
        }).catch(() => {});
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setStage('error');
        setStageText(err.message || 'Unknown error');
        addMessage({ role: 'assistant', content: `ERROR: ${err.message}`, stage: 'error' });

        if (userId) {
          logUsage({
            userId,
            provider,
            model,
            mode,
            stage: 'error',
            tokens: 0,
            durationMs: Date.now() - startTimeRef.current,
            success: false,
          }).catch(() => {});
        }
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [streaming, mode, provider, model, temperature, maxTokens, systemPrompt, activeSession, userId, addMessage, appendToLast]);

  // Update session with latest messages and files when generation completes
  useEffect(() => {
    if (stage === 'done' && activeSession && userId && messages.length > 0) {
      updateSession(activeSession, {
        messages,
        files,
        stage: 'done',
      }).catch(() => {});
    }
  }, [stage, activeSession, userId, messages, files]);

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
    setActiveSession(null);
  }, []);

  const handleSelectSession = useCallback((session: FKSession) => {
    setActiveSession(session.id);
    setMessages(session.messages);
    setFiles(session.files);
    setMode(session.mode);
    setProvider(session.provider);
    setModel(session.model);
    setStage('done');
    if (session.files.length > 0) {
      setActiveFile(session.files[0].path);
    }
  }, []);

  // Extract files from full assistant output whenever messages change
  useEffect(() => {
    const allText = messages.filter(m => m.role === 'assistant').map(m => m.content).join('\n');
    const extracted = extractFiles(allText);
    if (extracted.length > 0) {
      setFiles(extracted);
      if (!activeFile && extracted[0]) setActiveFile(extracted[0].path);
    }
  }, [messages, activeFile]);

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
        gap:            12,
        padding:        '0 18px',
        height:         54,
        background:    '#000',
        borderBottom:  '3px solid #1a1a1a',
        flexShrink:     0,
        flexWrap:      'nowrap',
        position:      'relative',
        zIndex:         10,
        overflowX:     'auto',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto', flexShrink: 0 }}>
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

        {/* Feature Actions */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {userId && (
            <button
              onClick={() => setShowSidebar(s => !s)}
              style={{
                padding:       '5px 10px',
                background:    showSidebar ? '#1a1a1a' : 'transparent',
                border:        '1px solid #222',
                color:         showSidebar ? '#FFD700' : '#888',
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:       9,
                fontWeight:     700,
                letterSpacing:  1,
                cursor:         'pointer',
                whiteSpace:     'nowrap',
              }}
            >
              ≡ HISTORY
            </button>
          )}

          {userId && (
            <button
              onClick={() => setShowAnalytics(true)}
              style={{
                padding:       '5px 10px',
                background:    'transparent',
                border:        '1px solid #222',
                color:         '#888',
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:       9,
                fontWeight:     700,
                letterSpacing:  1,
                cursor:         'pointer',
                whiteSpace:     'nowrap',
              }}
            >
              ◎ ANALYTICS
            </button>
          )}

          {files.length > 0 && (
            <button
              onClick={() => setShowGitHub(true)}
              style={{
                padding:       '5px 10px',
                background:    '#0055FF',
                border:        'none',
                color:         '#fff',
                fontFamily:    '"JetBrains Mono", monospace',
                fontSize:       9,
                fontWeight:     700,
                letterSpacing:  1,
                cursor:         'pointer',
                whiteSpace:     'nowrap',
              }}
            >
              ↑ GITHUB
            </button>
          )}
        </div>

        {/* Mode selector */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => !streaming && setMode(m.id)}
              title={m.label}
              style={{
                padding:       '5px 12px',
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
        gridTemplateColumns: showSidebar && userId ? '220px 380px 1fr' : '380px 1fr',
        flex:                 1,
        overflow:            'hidden',
        transition:          'grid-template-columns .2s ease-in-out',
      }}>
        {/* LEFT 0 — History Sidebar */}
        {showSidebar && userId && (
          <SessionSidebar
            userId={userId}
            activeSessionId={activeSession}
            onSelect={handleSelectSession}
            onNew={() => { handleClear(); }}
          />
        )}

        {/* LEFT 1 — Chat */}
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

        {/* RIGHT — Code Output */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <CodeOutput
            files={files}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            streaming={streaming}
          />
        </div>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {showAnalytics && userId && (
          <AnalyticsDashboard userId={userId} onClose={() => setShowAnalytics(false)} />
        )}
        {showGitHub && (
          <GitHubExportModal files={files} onClose={() => setShowGitHub(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
