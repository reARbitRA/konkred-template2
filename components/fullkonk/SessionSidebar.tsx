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
  }, [userId, activeSessionId]);

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
                  textAlign:       'left',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start' }}>
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
