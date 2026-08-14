import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sandpack } from '@codesandbox/sandpack-react';
import DiffMatchPatch from 'diff-match-patch';
import JSZip from 'jszip';
import { GeneratedFile } from '../../types';

interface Props {
  files: GeneratedFile[];
  previousFiles: GeneratedFile[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  streaming: boolean;
}

type OutputTab = 'files' | 'preview';
const REACT_EXTENSIONS = /\.(tsx|ts|jsx|js)$/i;
const TEST_PATH = /(?:^|\/)(?:__tests__\/|.*\.(?:test|spec)\.[jt]sx?$)/i;
const COLORS: Record<string, string> = { ts: '#0055FF', tsx: '#0055FF', typescript: '#0055FF', js: '#FFD700', jsx: '#FFD700', css: '#FF003C', json: '#00FF88', html: '#FF6B00', sql: '#00DDFF' };

async function downloadZip(files: GeneratedFile[]): Promise<void> {
  const zip = new JSZip();
  files.forEach(file => zip.file(file.path, file.content));
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'fullkonk-output.zip';
  anchor.click();
  URL.revokeObjectURL(url);
}

function makeHtml(files: GeneratedFile[]): string | null {
  const htmlFile = files.find(file => /\.html?$/i.test(file.path));
  if (!htmlFile) return null;
  const css = files.filter(file => /\.css$/i.test(file.path)).map(file => `<style>\n${file.content}\n</style>`).join('\n');
  const js = files.filter(file => /\.js$/i.test(file.path) && !TEST_PATH.test(file.path)).map(file => `<script type="module">\n${file.content}\n<\/script>`).join('\n');
  const injected = `${css}\n${js}`;
  return /<\/body>/i.test(htmlFile.content) ? htmlFile.content.replace(/<\/body>/i, `${injected}\n</body>`) : `${htmlFile.content}\n${injected}`;
}

function HtmlPreview({ files }: { files: GeneratedFile[] }) {
  const html = useMemo(() => makeHtml(files), [files]);
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!html) { setUrl(''); return; }
    const nextUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [html]);
  if (!url) return <EmptyPreview text="NO HTML ENTRY FILE FOUND" />;
  return <iframe title="Generated product preview" sandbox="allow-scripts allow-forms allow-modals" src={url} style={{ width: '100%', height: '100%', border: 0, background: '#fff' }} />;
}

function EmptyPreview({ text }: { text: string }) {
  return <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#444', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: 2 }}>{text}</div>;
}

function normalizeSandpackFiles(files: GeneratedFile[]): Record<string, string> {
  const result: Record<string, string> = {};
  files.filter(file => /\.(tsx?|jsx?|css|json)$/i.test(file.path) && !TEST_PATH.test(file.path)).forEach(file => {
    result[`/${file.path.replace(/^\/+/, '')}`] = file.content;
  });
  if (!Object.keys(result).some(path => /\/src\/App\.(tsx|jsx|ts|js)$/i.test(path))) {
    const app = files.find(file => /(?:^|\/)App\.(tsx|jsx|ts|js)$/i.test(file.path));
    if (app) result['/src/App.tsx'] = app.content;
  }
  if (!Object.keys(result).some(path => /\/src\/index\.(tsx|jsx|ts|js)$/i.test(path))) {
    result['/src/index.tsx'] = `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\ncreateRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);`;
  }
  if (!result['/package.json']) {
    result['/package.json'] = JSON.stringify({
      scripts: { start: 'react-scripts start' },
      dependencies: {
        react: '^19.0.0', 'react-dom': '^19.0.0',
        motion: '^12.0.0', 'framer-motion': '^12.0.0',
        'lucide-react': '^0.468.0', recharts: '^2.15.0',
      },
      devDependencies: {},
    }, null, 2);
  }
  return result;
}

export default function CodeOutput({ files, previousFiles, activeFile, onSelectFile, streaming }: Props) {
  const [tab, setTab] = useState<OutputTab>('files');
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const current = files.find(file => file.path === activeFile) || files[0] || null;
  const previous = current ? previousFiles.find(file => file.path === current.path) : undefined;
  const isReact = files.some(file => REACT_EXTENSIONS.test(file.path) && /(?:^|\/)(?:App|index|main)\.[jt]sx?$/i.test(file.path));
  const html = useMemo(() => makeHtml(files), [files]);
  const sandpackFiles = useMemo(() => normalizeSandpackFiles(files), [files]);

  useEffect(() => setShowDiff(false), [current?.path]);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const diffLines = useMemo(() => {
    if (!current || !previous) return [];
    const dmp = new DiffMatchPatch();
    return dmp.diff_main(previous.content, current.content).flatMap(([operation, text], group) => text.split('\n').map((line, index) => ({ key: `${group}-${index}`, operation, line })));
  }, [current, previous]);

  if (files.length === 0) return <EmptyPreview text={streaming ? 'GENERATING PRODUCT...' : 'OUTPUT APPEARS HERE'} />;

  return <section style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#050505', minWidth: 0 }}>
    <div style={{ display: 'flex', background: '#000', borderBottom: '1px solid #222', flexShrink: 0 }}>
      {(['files', 'preview'] as OutputTab[]).map(value => <button key={value} onClick={() => setTab(value)} style={{ padding: '9px 18px', border: 0, borderBottom: tab === value ? '2px solid #FFD700' : '2px solid transparent', background: tab === value ? '#090909' : 'transparent', color: tab === value ? '#FFD700' : '#555', fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700, letterSpacing: 2, cursor: 'pointer' }}>{value.toUpperCase()}</button>)}
      <span style={{ marginLeft: 'auto', alignSelf: 'center', paddingRight: 14, color: '#333', fontFamily: '"JetBrains Mono", monospace', fontSize: 8 }}>{files.length} FILES</span>
    </div>
    {tab === 'preview' ? <div style={{ flex: 1, overflow: 'hidden' }}>
      {isReact ? <Sandpack template="react-ts" files={sandpackFiles} theme={{ colors: { surface1: '#000000', surface2: '#0A0A0A', surface3: '#111111', clickable: '#777777', base: '#cccccc', disabled: '#333333', hover: '#FFD700', accent: '#FFD700', error: '#FF003C', errorSurface: '#190008' }, syntax: { plain: '#cccccc', comment: { color: '#555555', fontStyle: 'italic' }, keyword: '#FF003C', tag: '#FFD700', punctuation: '#777777', definition: '#00FF88', property: '#00DDFF', static: '#9B00FF', string: '#FFD700' }, font: { body: 'JetBrains Mono, monospace', mono: 'JetBrains Mono, monospace', size: '12px', lineHeight: '1.6' } }} options={{ showNavigator: true, showTabs: true, editorHeight: 'calc(100vh - 165px)', classes: { 'sp-wrapper': 'fullkonk-sandpack' } }} /> : html ? <HtmlPreview files={files} /> : <EmptyPreview text="PREVIEW REQUIRES A REACT OR HTML ENTRY FILE" />}
    </div> : <>
      <div style={{ display: 'flex', overflowX: 'auto', background: '#030303', borderBottom: '1px solid #111', flexShrink: 0 }}>
        {files.map(file => {
          const active = file.path === current?.path;
          const color = COLORS[file.language.toLowerCase()] || '#555';
          return <button key={file.path} onClick={() => onSelectFile(file.path)} title={file.path} style={{ flexShrink: 0, padding: '7px 14px', border: 0, borderRight: '1px solid #111', borderBottom: active ? `2px solid ${color}` : '2px solid transparent', background: active ? '#070707' : 'transparent', color: active ? '#fff' : '#555', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}>{(file.isTest || TEST_PATH.test(file.path)) ? '🧪 ' : ''}{file.path.split('/').pop()}</button>;
        })}
      </div>
      {current && <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 12px', borderBottom: '1px solid #111', fontFamily: '"JetBrains Mono", monospace' }}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', color: '#555', fontSize: 9 }}>{current.path}</span>
        {previous && <button onClick={() => setShowDiff(value => !value)} style={actionStyle}>{showDiff ? 'CODE' : 'DIFF'}</button>}
        <button onClick={() => { navigator.clipboard.writeText(current.content).catch(() => undefined); setCopied(true); }} style={actionStyle}>{copied ? '✓ COPIED' : 'COPY'}</button>
        <button onClick={() => { void downloadZip(files); }} style={actionStyle}>ZIP</button>
      </div>}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {current && showDiff && previous ? <pre style={preStyle}>{diffLines.map(item => <div key={item.key} style={{ display: 'block', background: item.operation === 1 ? '#002a13' : item.operation === -1 ? '#30000b' : 'transparent', color: item.operation === 1 ? '#00FF88' : item.operation === -1 ? '#FF466b' : '#777' }}>{item.operation === 1 ? '+ ' : item.operation === -1 ? '- ' : '  '}{item.line || ' '}</div>)}</pre> : current && <div style={{ display: 'flex', minWidth: 'max-content' }}><div style={{ padding: '14px 10px', borderRight: '1px solid #111', color: '#292929', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, lineHeight: 1.7, textAlign: 'right', userSelect: 'none' }}>{current.content.split('\n').map((_, index) => <div key={index}>{index + 1}</div>)}</div><pre style={preStyle}>{current.content}</pre></div>}
      </div>
    </>}
  </section>;
}

const actionStyle: React.CSSProperties = { background: '#050505', border: '1px solid #222', color: '#777', padding: '3px 9px', fontFamily: '"JetBrains Mono", monospace', fontSize: 8, cursor: 'pointer' };
const preStyle: React.CSSProperties = { margin: 0, padding: '14px 18px', color: '#ccc', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, lineHeight: 1.7, whiteSpace: 'pre', minWidth: 'max-content' };
