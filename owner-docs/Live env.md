درست می‌گی. این مهم‌ترین چیزیه که نبود. بذار برای هر دو طراحی کنم.

---

## مشکل دقیق چیه

```
الان:
  کد تولید می‌شه → در پنل نمایش داده می‌شه → کاربر دانلود می‌کنه
  
چیزی که باید باشه:
  کد تولید می‌شه → همزمان render می‌شه → کاربر داخل همان محیط 
  باهاش کار می‌کنه → تغییر می‌دهد → نتیجه فوری می‌بیند
```

---

## نسخه konkred.xyz

### `components/fullkonk/LiveEnvironment.tsx`

```tsx
// components/fullkonk/LiveEnvironment.tsx
// Real-time interactive environment — updates as code streams in

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { GeneratedFile } from '../../types';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type EnvTab = 'preview' | 'editor' | 'console' | 'files';

interface LiveMetrics {
  renderTime:   number;
  fileCount:    number;
  linesOfCode:  number;
  hasErrors:    boolean;
}

// ─── SANDPACK FILES BUILDER ───────────────────────────────────────────────────

function buildSandpackFiles(
  files: GeneratedFile[]
): Record<string, { code: string; active?: boolean }> {
  const out: Record<string, { code: string; active?: boolean }> = {};

  // Default package.json
  out['/package.json'] = {
    code: JSON.stringify({
      name:         'fullkonk-preview',
      version:      '1.0.0',
      dependencies: {
        react:              'latest',
        'react-dom':        'latest',
        'framer-motion':    'latest',
        'lucide-react':     'latest',
        'clsx':             'latest',
        'tailwind-merge':   'latest',
      },
      devDependencies: {
        '@types/react':     'latest',
        '@types/react-dom': 'latest',
        typescript:         'latest',
      },
    }, null, 2),
  };

  // Default index.html
  if (!files.some(f => f.path.includes('index.html'))) {
    out['/public/index.html'] = {
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fullKONK_> Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Space Grotesk', sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
    };
  }

  // Map generated files
  let hasApp = false;
  for (const f of files) {
    if (!f.content.trim() || f.content.length < 20) continue;
    const path = f.path.startsWith('/') ? f.path : `/${f.path}`;
    if (path.includes('App.tsx') || path.includes('App.jsx')) hasApp = true;
    out[path] = { code: f.content };
  }

  // Default App entry if missing
  if (!hasApp && files.length > 0) {
    const firstReact = files.find(f =>
      f.language === 'tsx' || f.language === 'jsx'
    );
    if (firstReact) {
      out['/App.tsx'] = {
        code: `// Auto-generated entry point
import Component from './${firstReact.path.replace(/^\//, '')}';
export default function App() {
  return <Component />;
}`,
        active: true,
      };
    }
  }

  // Default index entry
  if (!out['/index.tsx'] && !out['/src/index.tsx']) {
    out['/index.tsx'] = {
      code: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>
);`,
    };
  }

  return out;
}

// ─── STREAMING INDICATOR ─────────────────────────────────────────────────────

function StreamingOverlay({ streaming }: { streaming: boolean }) {
  if (!streaming) return null;
  return (
    <div style={{
      position:       'absolute',
      top:             8,
      right:           8,
      zIndex:          100,
      display:        'flex',
      alignItems:     'center',
      gap:             6,
      background:     'rgba(0,0,0,.8)',
      border:         '1px solid #1a1a1a',
      padding:        '4px 10px',
      fontFamily:     '"JetBrains Mono", monospace',
      fontSize:        9,
      color:          '#FFD700',
      letterSpacing:   2,
      backdropFilter: 'blur(4px)',
    }}>
      <motion.div
        animate={{ opacity: [1, .2, 1] }}
        transition={{ duration: .8, repeat: Infinity }}
        style={{ width: 5, height: 5, background: '#FFD700', borderRadius: '50%' }}
      />
      LIVE BUILD
    </div>
  );
}

// ─── METRICS BAR ─────────────────────────────────────────────────────────────

function MetricsBar({ metrics, streaming }: { metrics: LiveMetrics; streaming: boolean }) {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:           16,
      padding:      '5px 14px',
      background:   '#030303',
      borderTop:    '1px solid #0d0d0d',
      flexShrink:    0,
      fontFamily:   '"JetBrains Mono", monospace',
      fontSize:      9,
    }}>
      <span style={{ color: '#333' }}>
        {metrics.fileCount} files
      </span>
      <span style={{ color: '#333' }}>
        {metrics.linesOfCode.toLocaleString()} lines
      </span>
      {metrics.renderTime > 0 && (
        <span style={{ color: '#333' }}>
          render: {metrics.renderTime}ms
        </span>
      )}
      {metrics.hasErrors && (
        <span style={{ color: '#FF003C' }}>⚠ errors</span>
      )}
      <span style={{ marginLeft: 'auto', color: streaming ? '#FFD700' : '#00FF88' }}>
        {streaming ? '● BUILDING' : '● READY'}
      </span>
    </div>
  );
}

// ─── HTML PREVIEW (non-React outputs) ────────────────────────────────────────

function HtmlPreview({ files }: { files: GeneratedFile[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const htmlFile = files.find(f => f.language === 'html');
    const cssFile  = files.find(f => f.language === 'css'  || f.language === 'scss');
    const jsFile   = files.find(f => f.language === 'javascript' || f.language === 'js');

    if (!htmlFile) return;

    let html = htmlFile.content;
    if (cssFile)  html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    if (jsFile)   html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);

    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [files]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin allow-forms"
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="HTML Preview"
    />
  );
}

// ─── SANDPACK WRAPPER (reads errors via hook) ─────────────────────────────────

function SandpackStatus({ onError }: { onError: (has: boolean) => void }) {
  const { sandpack } = useSandpack();
  useEffect(() => {
    onError(Object.keys(sandpack.bundlerState?.errors ?? {}).length > 0);
  }, [sandpack.bundlerState, onError]);
  return null;
}

// ─── DEVICE FRAME ────────────────────────────────────────────────────────────

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '375px',
};

function DeviceFrame({
  mode,
  children,
}: {
  mode:     DeviceMode;
  children: React.ReactNode;
}) {
  if (mode === 'desktop') {
    return <div style={{ width: '100%', height: '100%' }}>{children}</div>;
  }
  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      height:          '100%',
      background:      '#050505',
      padding:          16,
    }}>
      <div style={{
        width:       DEVICE_WIDTHS[mode],
        height:      mode === 'mobile' ? '720px' : '560px',
        maxHeight:   '100%',
        border:      '2px solid #333',
        overflow:    'hidden',
        flexShrink:   0,
        boxShadow:   '0 0 40px rgba(0,0,0,.8)',
        position:    'relative',
      }}>
        {/* Device chrome */}
        <div style={{
          position:   'absolute',
          top:         0, left: 0, right: 0,
          height:      28,
          background: '#111',
          borderBottom:'1px solid #222',
          display:    'flex',
          alignItems: 'center',
          padding:    '0 10px',
          gap:         6,
          zIndex:      10,
        }}>
          {['#FF003C', '#FFD700', '#00FF88'].map(c => (
            <div key={c} style={{ width: 8, height: 8, background: c, borderRadius: '50%' }} />
          ))}
          <div style={{
            flex:       1,
            background: '#0a0a0a',
            height:      16,
            margin:     '0 8px',
            border:     '1px solid #1a1a1a',
          }} />
        </div>
        <div style={{ paddingTop: 28, height: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface Props {
  files:     GeneratedFile[];
  streaming: boolean;
  onClose:   () => void;
}

export default function LiveEnvironment({ files, streaming, onClose }: Props) {
  const [tab,        setTab]        = useState<EnvTab>('preview');
  const [device,     setDevice]     = useState<DeviceMode>('desktop');
  const [hasErrors,  setHasErrors]  = useState(false);
  const [renderTime, setRenderTime] = useState(0);

  // Determine output type
  const hasReact = files.some(f => f.language === 'tsx' || f.language === 'jsx');
  const hasHtml  = files.some(f => f.language === 'html');
  const canPreview = hasReact || hasHtml;

  const metrics: LiveMetrics = useMemo(() => ({
    renderTime,
    fileCount:   files.length,
    linesOfCode: files.reduce((acc, f) => acc + f.content.split('\n').length, 0),
    hasErrors,
  }), [files, hasErrors, renderTime]);

  // Track render time
  const renderStartRef = useRef(Date.now());
  useEffect(() => {
    renderStartRef.current = Date.now();
  }, [files]);
  const handlePreviewLoad = useCallback(() => {
    setRenderTime(Date.now() - renderStartRef.current);
  }, []);

  const sandpackFiles = useMemo(() => buildSandpackFiles(files), [files]);

  // Empty state
  if (files.length === 0) {
    return (
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        height:         '100%',
        background:     '#000',
        gap:             16,
      }}>
        {streaming ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: 36, color: '#FFD700' }}
            >
              ◎
            </motion.div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize:    11,
              color:      '#444',
              letterSpacing: 3,
            }}>
              BUILDING ENVIRONMENT...
            </div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize:    9,
              color:      '#222',
            }}>
              Preview appears as code is generated
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 36, color: '#222' }}>◈</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize:    11,
              color:      '#333',
              letterSpacing: 3,
            }}>
              NO OUTPUT YET
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100%',
      background:    '#000',
      overflow:      'hidden',
    }}>

      {/* ── ENV TOP BAR ── */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        gap:           8,
        padding:      '0 12px',
        height:        40,
        background:   '#000',
        borderBottom: '1px solid #111',
        flexShrink:    0,
      }}>

        {/* Tabs */}
        {(['preview', 'editor', 'console'] as EnvTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding:      '4px 12px',
              background:   tab === t ? '#111' : 'transparent',
              border:       'none',
              borderBottom: tab === t ? '2px solid #FFD700' : '2px solid transparent',
              color:        tab === t ? '#FFD700' : '#444',
              fontFamily:  '"JetBrains Mono", monospace',
              fontSize:     9,
              fontWeight:   700,
              letterSpacing: 2,
              cursor:       'pointer',
              textTransform:'uppercase',
              transition:   'all .15s',
            }}
          >
            {t === 'preview' ? '▶ PREVIEW'
              : t === 'editor' ? '◈ EDITOR'
              : '■ CONSOLE'}
          </button>
        ))}

        {/* Device selector — only for preview */}
        {tab === 'preview' && (
          <div style={{ display: 'flex', gap: 0, marginLeft: 8 }}>
            {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map(d => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                title={d}
                style={{
                  padding:    '3px 9px',
                  background: device === d ? '#1a1a1a' : 'transparent',
                  border:     '1px solid #1a1a1a',
                  borderRight: 'none',
                  color:      device === d ? '#fff' : '#333',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize:    9,
                  cursor:     'pointer',
                  transition: 'all .15s',
                }}
              >
                {d === 'desktop' ? '⬜' : d === 'tablet' ? '▭' : '▯'}
              </button>
            ))}
            <div style={{ width: 1, background: '#1a1a1a' }} />
          </div>
        )}

        {/* Error badge */}
        {hasErrors && (
          <div style={{
            fontFamily:  '"JetBrains Mono", monospace',
            fontSize:     8,
            color:       '#FF003C',
            padding:     '2px 8px',
            border:      '1px solid #FF003C',
            letterSpacing: 1,
          }}>
            ⚠ ERRORS
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 0 }}>
          {/* Open in new tab */}
          {hasHtml && !hasReact && (
            <button
              onClick={() => {
                const html = files.find(f => f.language === 'html');
                if (!html) return;
                const blob = new Blob([html.content], { type: 'text/html' });
                const url  = URL.createObjectURL(blob);
                window.open(url, '_blank');
              }}
              style={envBtnStyle}
            >
              ↗ OPEN
            </button>
          )}
          {/* Close */}
          <button onClick={onClose} style={envBtnStyle}>✕</button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <StreamingOverlay streaming={streaming} />

        {/* React output → Sandpack */}
        {hasReact && (
          <SandpackProvider
            key={Object.keys(sandpackFiles).join(',')} // re-mount when files change
            template="react-ts"
            files={sandpackFiles}
            theme={{
              colors: {
                surface1:     '#000',
                surface2:     '#080808',
                surface3:     '#111',
                clickable:    '#555',
                base:         '#ccc',
                disabled:     '#333',
                hover:        '#FFD700',
                accent:       '#FFD700',
                error:        '#FF003C',
                errorSurface: '#1a0000',
              },
              font: {
                body:       '"Space Grotesk", sans-serif',
                mono:       '"JetBrains Mono", monospace',
                size:       '12px',
                lineHeight: '1.6',
              },
            }}
            options={{
              externalResources: [
                'https://cdn.tailwindcss.com',
                'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
              ],
              recompileMode:  'delayed',
              recompileDelay: 800,
            }}
          >
            <SandpackStatus onError={setHasErrors} />

            <AnimatePresence mode="wait">
              {tab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ height: '100%' }}
                >
                  <DeviceFrame mode={device}>
                    <SandpackPreview
                      showNavigator={false}
                      showRefreshButton
                      onLoad={handlePreviewLoad}
                      style={{ height: '100%', border: 'none' }}
                    />
                  </DeviceFrame>
                </motion.div>
              )}

              {tab === 'editor' && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ height: '100%' }}
                >
                  <SandpackCodeEditor
                    showLineNumbers
                    showInlineErrors
                    wrapContent
                    style={{ height: '100%', fontSize: '11px' }}
                  />
                </motion.div>
              )}

              {tab === 'console' && (
                <motion.div
                  key="console"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ height: '100%', overflow: 'auto' }}
                >
                  <SandpackConsole style={{ height: '100%' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </SandpackProvider>
        )}

        {/* HTML output → iframe */}
        {!hasReact && hasHtml && (
          <DeviceFrame mode={device}>
            <HtmlPreview files={files} />
          </DeviceFrame>
        )}

        {/* No previewable output */}
        {!hasReact && !hasHtml && (
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            height:         '100%',
            flexDirection:  'column',
            gap:             12,
          }}>
            <div style={{ fontSize: 28, color: '#222' }}>⬢</div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize:    10,
              color:      '#333',
              letterSpacing: 2,
              textAlign:  'center',
              maxWidth:    240,
              lineHeight: '1.8',
            }}>
              BACKEND OUTPUT<br />
              <span style={{ color: '#1a1a1a' }}>
                No visual preview for server-side code.
                Check the FILES tab.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── METRICS ── */}
      <MetricsBar metrics={metrics} streaming={streaming} />
    </div>
  );
}

const envBtnStyle: React.CSSProperties = {
  background:    'none',
  border:        'none',
  borderRight:   '1px solid #111',
  color:         '#444',
  padding:       '0 12px',
  height:         40,
  fontFamily:    '"JetBrains Mono", monospace',
  fontSize:       9,
  fontWeight:     700,
  letterSpacing:  2,
  cursor:         'pointer',
  transition:    'all .15s',
  textTransform: 'uppercase',
};
```

---

### تغییر در `pages/FullKonkPage.tsx` — اضافه کردن layout سه‌ستونه

```tsx
// فقط بخش layout را عوض کن — بقیه همانند قبل

// اضافه به state ها:
const [showEnv, setShowEnv] = useState(true);

// تغییر grid:
const gridCols = useMemo(() => {
  if (showSidebar && showEnv) return '200px 320px 1fr 1fr';
  if (showSidebar && !showEnv) return '200px 320px 1fr';
  if (!showSidebar && showEnv) return '320px 1fr 1fr';
  return '320px 1fr';
}, [showSidebar, showEnv]);

// در top bar اضافه:
<button
  onClick={() => setShowEnv(e => !e)}
  style={{
    ...topBtnStyle,
    color:       showEnv ? '#00FF88' : '#444',
    borderColor: showEnv ? '#00FF88' : '#222',
  }}
>
  {showEnv ? '▶ ENV ON' : '▶ ENV OFF'}
</button>

// در main grid:
{showEnv && (
  <div style={{ overflow: 'hidden', borderRight: '1px solid #111' }}>
    <LiveEnvironment
      files={files}
      streaming={streaming}
      onClose={() => setShowEnv(false)}
    />
  </div>
)}

// نتیجه layout:
// [SIDEBAR] [CHAT] [CODE] [LIVE ENV]
//   200px    320px   1fr     1fr
```

---

## نسخه Obsidian Plugin

### `src/preview.ts`

```typescript
// src/preview.ts
// In-plugin live preview for Obsidian
// Uses an iframe with Blob URLs — no external dependencies needed

import { Notice } from 'obsidian';
import { GeneratedFile } from './types';

// ─── BUILD PREVIEW HTML ───────────────────────────────────────────────────────
// Bundles all generated files into a single self-contained HTML document
// that runs inside an Obsidian iframe

function buildPreviewDocument(files: GeneratedFile[]): string {
  const htmlFile = files.find(f => f.language === 'html');
  const cssFiles = files.filter(f => f.language === 'css' || f.language === 'scss');
  const jsFiles  = files.filter(f =>
    f.language === 'javascript' || f.language === 'js'
  );

  // For React/TypeScript output — we can't run TSX in a raw iframe
  // So we generate a placeholder that explains what was built
  const tsxFiles = files.filter(f =>
    f.language === 'tsx' || f.language === 'typescript' || f.language === 'ts'
  );

  if (tsxFiles.length > 0 && !htmlFile) {
    return buildReactSummaryDoc(files, tsxFiles);
  }

  // Pure HTML/CSS/JS — run it directly
  let html = htmlFile?.content ?? `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fullKONK_> Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Space Grotesk', sans-serif; background: #fff; }
  </style>
</head>
<body>
  <div id="root" style="padding:20px;font-family:sans-serif;color:#333;">
    <p>Preview loading...</p>
  </div>
</body>
</html>`;

  // Inject CSS
  for (const css of cssFiles) {
    html = html.replace('</head>', `<style>\n${css.content}\n</style>\n</head>`);
  }

  // Inject JS
  for (const js of jsFiles) {
    html = html.replace('</body>', `<script>\n${js.content}\n</script>\n</body>`);
  }

  return html;
}

// ─── REACT SUMMARY DOC ────────────────────────────────────────────────────────
// When output is React/TS, show an interactive summary of what was built

function buildReactSummaryDoc(
  files:    GeneratedFile[],
  tsxFiles: GeneratedFile[],
): string {
  const fileTree = files.map(f => ({
    path:     f.path,
    lang:     f.language,
    lines:    f.content.split('\n').length,
    size:     Math.round(f.content.length / 1024 * 10) / 10,
  }));

  const langColors: Record<string, string> = {
    tsx: '#0055FF', ts: '#0055FF', typescript: '#0055FF',
    js:  '#FFD700', jsx: '#FFD700', javascript: '#FFD700',
    css: '#FF003C', json: '#00FF88', prisma: '#9B00FF',
    sql: '#00DDFF', bash: '#FF6B00', yaml: '#FF6B00',
  };

  // Extract component names from TSX
  const components = tsxFiles.map(f => {
    const match = f.content.match(/export\s+(?:default\s+)?function\s+(\w+)/);
    return match ? match[1] : f.path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'Component';
  });

  // Extract API endpoints
  const apiRoutes: string[] = [];
  files.forEach(f => {
    if (f.language === 'typescript' || f.language === 'javascript') {
      const matches = f.content.match(/(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)/gi) ?? [];
      matches.forEach(m => {
        const parts = m.match(/\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)/i);
        if (parts) apiRoutes.push(`${parts[1].toUpperCase()} ${parts[2]}`);
      });
    }
  });

  const totalLines = files.reduce((a, f) => a + f.content.split('\n').length, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>fullKONK_> — Build Summary</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #000;
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 13px;
      line-height: 1.6;
      min-height: 100vh;
    }
    
    .header {
      background: #000;
      border-bottom: 2px solid #111;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: #FFD700;
      letter-spacing: 3px;
    }
    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      letter-spacing: 2px;
      padding: 2px 8px;
      background: #00FF88;
      color: #000;
      font-weight: 700;
    }
    
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: #111;
      padding: 1px;
      margin: 1px;
    }
    
    .card {
      background: #080808;
      padding: 20px;
    }
    .card-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      letter-spacing: 3px;
      color: #444;
      text-transform: uppercase;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card-label::before {
      content: '//';
      color: #222;
    }
    
    /* Stats */
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: #111;
    }
    .stat {
      background: #060606;
      padding: 16px;
      text-align: center;
    }
    .stat-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 700;
      color: #FFD700;
      display: block;
    }
    .stat-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      color: #333;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    /* File tree */
    .file-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid #0d0d0d;
      cursor: pointer;
      transition: background .15s;
    }
    .file-item:hover { background: #0d0d0d; margin: 0 -10px; padding: 6px 10px; }
    .file-dot { width: 5px; height: 5px; flex-shrink: 0; }
    .file-path { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #888; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .file-meta { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #333; }
    
    /* Components */
    .comp-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid #0d0d0d;
    }
    .comp-icon { width: 28px; height: 28px; background: #0055FF; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
    .comp-name { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #ccc; }
    .comp-type { font-size: 10px; color: #444; }
    
    /* API */
    .route-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: #050505;
      border: 1px solid #0d0d0d;
      margin-bottom: 4px;
    }
    .route-method {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      min-width: 48px;
      text-align: center;
    }
    .route-path { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #888; }
    
    /* Deploy instructions */
    .step {
      display: flex;
      gap: 14px;
      padding: 12px 0;
      border-bottom: 1px solid #0d0d0d;
    }
    .step-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 700;
      color: #222;
      width: 24px;
      flex-shrink: 0;
    }
    .step-body {}
    .step-title { font-weight: 600; color: #ccc; margin-bottom: 4px; }
    .step-cmd { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #00FF88; background: #030303; padding: 4px 8px; margin-top: 4px; display: inline-block; }

    .animate-pulse {
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: .3; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="logo">fullKONK_&gt;</div>
    <div class="badge">BUILD COMPLETE</div>
    <div style="margin-left:auto;font-family:'JetBrains Mono',monospace;font-size:9px;color:#333;letter-spacing:2px;">
      ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
    </div>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat">
      <span class="stat-num">${files.length}</span>
      <span class="stat-label">Files Generated</span>
    </div>
    <div class="stat">
      <span class="stat-num">${totalLines.toLocaleString()}</span>
      <span class="stat-label">Lines of Code</span>
    </div>
    <div class="stat">
      <span class="stat-num">${components.length}</span>
      <span class="stat-label">Components</span>
    </div>
    <div class="stat">
      <span class="stat-num">${apiRoutes.length}</span>
      <span class="stat-label">API Routes</span>
    </div>
  </div>

  <!-- Main grid -->
  <div class="grid">

    <!-- File tree -->
    <div class="card">
      <div class="card-label">Generated Files</div>
      ${fileTree.map(f => `
        <div class="file-item" onclick="copyPath('${f.path}')">
          <div class="file-dot" style="background:${langColors[f.lang] ?? '#555'}"></div>
          <span class="file-path" title="${f.path}">${f.path}</span>
          <span class="file-meta">${f.lines}L · ${f.size}kb</span>
        </div>
      `).join('')}
    </div>

    <!-- Components -->
    <div class="card">
      <div class="card-label">React Components</div>
      ${components.length > 0
        ? components.map((c, i) => `
          <div class="comp-item">
            <div class="comp-icon">${c.slice(0, 2).toUpperCase()}</div>
            <div>
              <div class="comp-name">${c}</div>
              <div class="comp-type">${tsxFiles[i]?.path ?? ''}</div>
            </div>
          </div>
        `).join('')
        : '<div style="color:#333;font-size:11px;font-family:\'JetBrains Mono\',monospace">No React components found</div>'
      }
    </div>

    <!-- API Routes -->
    <div class="card">
      <div class="card-label">API Endpoints</div>
      ${apiRoutes.length > 0
        ? apiRoutes.map(r => {
            const [method, ...pathParts] = r.split(' ');
            const colors: Record<string, string> = {
              GET: '#00FF88', POST: '#FFD700',
              PUT: '#0055FF', DELETE: '#FF003C', PATCH: '#FF6B00',
            };
            return `
              <div class="route-item">
                <span class="route-method" style="background:${colors[method] ?? '#333'};color:${method === 'GET' ? '#000' : method === 'POST' ? '#000' : '#fff'}">${method}</span>
                <span class="route-path">${pathParts.join(' ')}</span>
              </div>
            `;
          }).join('')
        : '<div style="color:#333;font-size:11px;font-family:\'JetBrains Mono\',monospace">No API routes found</div>'
      }
    </div>

    <!-- How to run -->
    <div class="card">
      <div class="card-label">How to Run</div>
      <div class="step">
        <div class="step-num">01</div>
        <div class="step-body">
          <div class="step-title">Save files from Obsidian</div>
          <div style="font-size:11px;color:#555;">Click ↓ SAVE ALL in the fullKONK_> panel</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">02</div>
        <div class="step-body">
          <div class="step-title">Install dependencies</div>
          <div class="step-cmd">npm install</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">03</div>
        <div class="step-body">
          <div class="step-title">Start development server</div>
          <div class="step-cmd">npm run dev</div>
        </div>
      </div>
      <div class="step">
        <div class="step-num">04</div>
        <div class="step-body">
          <div class="step-title">Open in browser</div>
          <div class="step-cmd">http://localhost:3000</div>
        </div>
      </div>
    </div>

  </div>

  <script>
    function copyPath(path) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(path).then(() => {
          console.log('Copied:', path);
        });
      }
    }
  </script>

</body>
</html>`;
}

// ─── PREVIEW MANAGER ──────────────────────────────────────────────────────────

export class PreviewManager {
  private container:  HTMLElement | null = null;
  private iframe:     HTMLIFrameElement | null = null;
  private currentUrl: string | null = null;

  // Build or update the preview pane inside a container element
  mount(container: HTMLElement) {
    this.container = container;
    container.style.cssText = 'position:relative;height:100%;background:#000;display:flex;flex-direction:column;overflow:hidden;';

    // Top bar
    const bar = container.createDiv();
    bar.style.cssText = 'display:flex;align-items:center;gap:8px;padding:0 10px;height:36px;background:#000;border-bottom:1px solid #111;flex-shrink:0;';

    const label = bar.createDiv();
    label.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:8px;letter-spacing:3px;color:#333;margin-right:auto;';
    label.setText('// LIVE ENVIRONMENT');

    const refreshBtn = bar.createEl('button');
    refreshBtn.setText('↺ REFRESH');
    refreshBtn.style.cssText = 'background:none;border:1px solid #1a1a1a;color:#444;padding:2px 8px;font-family:"JetBrains Mono",monospace;font-size:7px;cursor:pointer;letter-spacing:1px;';
    refreshBtn.onclick = () => this.refresh();

    const openBtn = bar.createEl('button');
    openBtn.setText('↗ BROWSER');
    openBtn.style.cssText = 'background:none;border:1px solid #1a1a1a;color:#444;padding:2px 8px;font-family:"JetBrains Mono",monospace;font-size:7px;cursor:pointer;letter-spacing:1px;';
    openBtn.onclick = () => {
      if (this.currentUrl) window.open(this.currentUrl, '_blank');
    };

    // Status
    const status = bar.createDiv();
    status.id = 'fk-preview-status';
    status.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:7px;color:#FFD700;letter-spacing:1px;animation:pulse 2s infinite;';
    status.setText('● READY');

    // Iframe
    this.iframe = container.createEl('iframe');
    this.iframe.style.cssText = 'flex:1;border:none;background:#fff;';
    this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
    this.iframe.title = 'fullKONK_> Live Preview';

    // CSS for pulse animation
    const style = container.createEl('style');
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.3} }
    `;
  }

  // Update preview with new files
  update(files: GeneratedFile[], streaming: boolean) {
    if (!this.iframe) return;

    const status = document.getElementById('fk-preview-status');
    if (status) {
      status.setText(streaming ? '● BUILDING...' : '● READY');
      status.style.color = streaming ? '#FFD700' : '#00FF88';
    }

    // Don't update every chunk — debounce to avoid constant re-renders
    if (streaming && files.length === 0) return;

    const html = buildPreviewDocument(files);

    // Revoke previous blob URL
    if (this.currentUrl) {
      URL.revokeObjectURL(this.currentUrl);
    }

    const blob         = new Blob([html], { type: 'text/html' });
    this.currentUrl    = URL.createObjectURL(blob);
    this.iframe.src    = this.currentUrl;
  }

  refresh() {
    if (this.iframe && this.currentUrl) {
      this.iframe.src = this.currentUrl;
    }
  }

  destroy() {
    if (this.currentUrl) URL.revokeObjectURL(this.currentUrl);
    this.iframe      = null;
    this.container   = null;
    this.currentUrl  = null;
  }
}
```

---

### تغییرات در `src/view.ts` — اضافه کردن preview pane

```typescript
// src/view.ts — بخش‌هایی که باید تغییر کنند

import { PreviewManager } from './preview';

// ─── داخل class FullKonkView ──────────────────────────────────────────────────

private previewManager: PreviewManager | null = null;
private showPreview = true;
private previewUpdateTimer: number | null = null;

// ─── در buildMainArea تغییر کن: ──────────────────────────────────────────────

private buildMainArea(root: HTMLElement) {
  const main = root.createDiv();
  main.style.cssText = this.showPreview
    ? 'display:grid;grid-template-columns:1fr 1fr 1fr;flex:1;overflow:hidden;'
    : 'display:grid;grid-template-columns:1fr 1fr;flex:1;overflow:hidden;';

  this.buildChatPanel(main);
  this.buildCodePanel(main);

  if (this.showPreview) {
    const previewPane = main.createDiv();
    previewPane.style.cssText = 'overflow:hidden;border-right:1px solid #111;';
    this.previewManager = new PreviewManager();
    this.previewManager.mount(previewPane);
  }
}

// ─── toggle preview از top bar: ──────────────────────────────────────────────

// در buildTopBar اضافه کن:
const envBtn = bar.createEl('button');
envBtn.setText('▶ ENV');
envBtn.style.cssText = `background:none;border:1px solid ${this.showPreview ? '#00FF88' : '#222'};color:${this.showPreview ? '#00FF88' : '#444'};padding:3px 10px;font-family:"JetBrains Mono",monospace;font-size:8px;font-weight:700;letter-spacing:2px;cursor:pointer;`;
envBtn.onclick = () => {
  this.showPreview = !this.showPreview;
  // Re-render the whole view
  const root = this.containerEl.children[1] as HTMLElement;
  root.empty();
  this.buildTopBar(root);
  this.buildStageBar(root);
  this.buildMainArea(root);
  this.injectStyles();
};

// ─── در callbacks.onChunk، preview رو debounce کن: ───────────────────────────

// بعد از به‌روز کردن files:
if (this.previewManager) {
  // Debounce: هر 1.5 ثانیه یک بار update کن
  if (this.previewUpdateTimer !== null) {
    window.clearTimeout(this.previewUpdateTimer);
  }
  this.previewUpdateTimer = window.setTimeout(() => {
    this.previewManager?.update(this.files, this.streaming);
    this.previewUpdateTimer = null;
  }, 1500);
}

// ─── بعد از پایان pipeline: ──────────────────────────────────────────────────

// در بخش finally یا بعد از setStage('done'):
if (this.previewManager) {
  window.clearTimeout(this.previewUpdateTimer ?? undefined);
  this.previewManager.update(this.files, false);
}

// ─── در onClose: ─────────────────────────────────────────────────────────────

async onClose() {
  this.abortCtrl?.abort();
  if (this.previewUpdateTimer !== null) {
    window.clearTimeout(this.previewUpdateTimer);
  }
  this.previewManager?.destroy();
}
```

---

## نتیجه نهایی — layout هر دو نسخه

```
konkred.xyz:
┌──────────┬──────────────┬──────────────┬──────────────────────┐
│ SIDEBAR  │    CHAT      │     CODE     │   LIVE ENVIRONMENT   │
│          │              │              │                      │
│ History  │ Messages     │ File tabs    │ [▶ PREVIEW] [◈ EDIT] │
│ Projects │ Streaming    │ Line nums    │ Device: □ ▭ ▯        │
│ Templates│ Suggestions  │ Syntax high  │                      │
│          │              │              │ [Sandpack / iframe]  │
│          │ [input]      │ [copy][zip]  │ Running product      │
│          │ [BUILD →]    │ [→ github]   │ Interactive, live    │
└──────────┴──────────────┴──────────────┴──────────────────────┘

Obsidian:
┌──────────────────┬──────────────────┬──────────────────────────┐
│      CHAT        │      CODE        │    LIVE ENVIRONMENT      │
│                  │                  │                          │
│ [Templates row]  │ File tabs        │ // LIVE ENVIRONMENT  ↺ ↗ │
│                  │ Line numbers     │                          │
│ Messages         │ Code content     │ React: build summary     │
│ Streaming        │                  │  • 8 files generated     │
│                  │                  │  • 4 components          │
│ [textarea]       │ [COPY][SAVE ALL] │  • 6 API routes          │
│ [BUILD →]        │                  │  • How to run            │
└──────────────────┴──────────────────┴──────────────────────────┘
```

---

## تفاوت رویکرد دو نسخه

```
konkred.xyz:
  Sandpack → React code را compile و run می‌کند در مرورگر
  iframe   → HTML/CSS/JS را مستقیم اجرا می‌کند
  Result   → محصول واقعی قابل استفاده، داخل صفحه

Obsidian:
  iframe + blob URL → HTML output مستقیم اجرا می‌شود
  Build summary doc → برای React/TS خروجی که نمی‌توان
                      در iframe compile کرد، یک dashboard
                      تعاملی نشان می‌دهد با:
                      • آمار فایل‌ها
                      • لیست components
                      • API routes
                      • دستورالعمل اجرا
  
  چرا این تفاوت؟
  Obsidian محیط Node.js ندارد — نمی‌توان TSX را
  compile کرد. Sandpack نیاز به npm package دارد
  که در plugin bundle نمی‌شود. راه‌حل واقع‌بینانه:
  HTML را live اجرا کن، TypeScript را summarize کن.
```