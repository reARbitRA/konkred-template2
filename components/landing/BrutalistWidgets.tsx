import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, SkipForward, Send, Terminal as TermIcon, Shield, Code, Cpu, 
  Sparkles, Flame, Volume2, Database, HelpCircle, Gamepad2, Layers, CheckCircle,
  LogIn, LogOut
} from 'lucide-react';
import { 
  collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User 
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../../services/firebase.ts';
import { useToast } from '../../contexts/ToastContext.tsx';

// ============================================================================
// 1. DYNAMIC TELEMETRY STATS WIDGET
// ============================================================================
export const LiveTelemetryStats: React.FC = () => {
  const [cpuLoad, setCpuLoad] = useState('42.8%');
  const [thermalTemp, setThermalTemp] = useState('38.2°C');
  const [uptime, setUptime] = useState('00000000');
  const [threatLevel, setThreatLevel] = useState('SECURE');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = performance.now();
      const perf = (performance as any).memory;
      const loadVal = perf ? ((perf.usedJSHeapSize / perf.jsHeapSizeLimit) * 100).toFixed(1) : ((now % 2000) / 50 + 35).toFixed(1);
      const tempVal = ((now % 1500) / 200 + 36.5).toFixed(1);
      setCpuLoad(`${loadVal}%`);
      setThermalTemp(`${tempVal}°C`);
      
      const secondsSinceEpoch = Math.floor(Date.now() / 1000);
      setUptime(secondsSinceEpoch.toString().slice(-8));

      if (parseFloat(loadVal) > 65) {
        setThreatLevel('HEAVY_LOAD');
      } else {
        setThreatLevel('SECURE');
      }
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-void border-4 border-black text-black">
      <div className="bg-signal p-4 border-2 border-black flex flex-col justify-between relative shadow-brutalist hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutalist-hover transition-all">
        <div className="text-[10px] font-mono font-black tracking-widest uppercase">UPTIME_CLOCK</div>
        <div className="text-xl font-mono font-black mt-2 tracking-wide font-black">SYS_{uptime}</div>
        <div className="text-[8px] font-mono text-black/60 mt-1">REAL-TIME TELEMETRY</div>
      </div>
      
      <div className="bg-white p-4 border-2 border-black flex flex-col justify-between relative shadow-brutalist hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutalist-hover transition-all">
        <div className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-500">CORE_LOAD</div>
        <div className="text-xl font-mono font-black text-black mt-2 tracking-widest">{cpuLoad}</div>
        <div className="text-[8px] font-mono text-zinc-400 mt-1">OCTA-CORE KERNEL</div>
      </div>

      <div className="bg-white p-4 border-2 border-black flex flex-col justify-between relative shadow-brutalist hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutalist-hover transition-all">
        <div className="text-[10px] font-mono font-black tracking-widest uppercase text-zinc-500">THERMAL_HEAT</div>
        <div className="text-xl font-mono font-black text-red-600 mt-2 tracking-widest">{thermalTemp}</div>
         <div className="text-[8px] font-mono text-zinc-400 mt-1">LIQUID NITROGEN PUMPED</div>
      </div>

      <div className="bg-[#030712] text-white p-4 border-2 border-white flex flex-col justify-between relative shadow-brutalist hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutalist hover:shadow-brutalist-yellow transition-all">
        <div className="text-[10px] font-mono tracking-widest uppercase text-signal">THREAT_LEVEL</div>
        <div className="text-sm font-mono font-black mt-2 tracking-wide truncate border-b border-zinc-800 pb-1">{threatLevel}</div>
        <div className="text-[8px] font-mono text-void-500 mt-1">COGNITIVE INTEGRITY OK</div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. SPOTIFY MUSIC SIMULATOR WIDGET
// ============================================================================
export const SpotifyMusicSimulator: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  const [trackIndex, setTrackIndex] = useState(0);
  
  const tracks = [
    { title: 'DOPAMINE CRITICAL', artist: 'LLAMA-3 MIX', duration: '3:45' },
    { title: 'SYNTHETIC INTUITION', artist: 'DEEPSEEK V3', duration: '2:58' },
    { title: 'NEURAL BRUTALISM', artist: 'GEMINI 3.5 FLASH', duration: '4:12' },
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleNext = () => {
    setTrackIndex(prev => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const playedSeconds = Math.floor((progress / 100) * 225);
  const minutes = Math.floor(playedSeconds / 60);
  const seconds = playedSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="bg-void-100 border-4 border-black p-6 text-white brutalist-border relative overflow-hidden">
      {/* Decorative Warning Stripe Header */}
      <div className="h-4 bg-signal text-black flex items-center justify-between px-2 text-[8px] font-mono font-black uppercase tracking-wider mb-4 border-b-4 border-black">
        <span>AUDIO_STATION_ACTIVE</span>
        <span className="animate-pulse">● PLAYING_SYSTEM_FEED</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Cassette/Vinyl Rotating Visual */}
        <div className="w-24 h-24 bg-black border-4 border-black p-4 flex items-center justify-center relative select-none">
          <motion.div 
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="w-16 h-16 border-4 border-dashed border-signal rounded-full flex items-center justify-center relative"
          >
            <div className="w-6 h-6 bg-signal border-4 border-black rounded-full" />
          </motion.div>
          {/* Brutalist labels inside cover */}
          <div className="absolute bottom-1 right-2 text-[7px] font-mono text-void-600">M4-V2</div>
        </div>

        {/* Track Metadata & Audio Wave Visualizer */}
        <div className="flex-1 w-full space-y-4">
          <div>
            <div className="text-[9px] font-mono text-signal uppercase tracking-widest">NOW BROADCASTING</div>
            <h4 className="text-lg font-black tracking-tight text-white uppercase font-display leading-tight">{tracks[trackIndex].title}</h4>
            <p className="text-xs text-void-500 font-mono font-bold">{tracks[trackIndex].artist}</p>
          </div>

          {/* Simple HTML Canvas Dancing Waveform when playing */}
          <div className="h-8 flex items-end gap-[3px] border-b border-void-300 pb-1">
            {Array.from({ length: 32 }).map((_, idx) => {
              const height = isPlaying 
                ? `${10 + Math.sin(idx * 0.4 + progress * 0.5) * 15 + Math.random() * 8}px`
                : '4px';
              return (
                <div 
                  key={idx} 
                  style={{ height }} 
                  className={`flex-1 ${isPlaying ? 'bg-signal' : 'bg-void-300'} transition-all`} 
                />
              );
            })}
          </div>

          {/* Progress Slider */}
          <div className="space-y-1">
            <div className="relative h-3 bg-black border-2 border-black">
              <div 
                style={{ width: `${progress}%` }} 
                className="absolute top-0 bottom-0 bg-signal"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-void-500">
              <span>{timeFormatted}</span>
              <span>{tracks[trackIndex].duration}</span>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-signal text-black p-3 border-2 border-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutalist transition-all"
            >
              {isPlaying ? <Pause size={14} className="fill-black" /> : <Play size={14} className="fill-black" />}
            </button>
            <button 
              onClick={handleNext}
              className="bg-white text-black p-3 border-2 border-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutalist transition-all flex items-center gap-2 text-[10px] font-mono font-black"
            >
              <SkipForward size={14} /> FORWARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. SECURE GUESTBOOK WIDGET (FIRESTORE SYNC & LOCAL FALLBACK)
// ============================================================================
interface GuestMessage {
  id: string;
  name: string;
  role: string;
  text: string;
  timestamp: string;
}

export const BrutalistGuestbook: React.FC = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('[VISITOR]');
  const [text, setText] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // 1. Sync Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.displayName) {
        setName(user.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Sync
  useEffect(() => {
    const q = query(
      collection(db, 'guestbook'), 
      orderBy('createdAt', 'desc'), 
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestMessage[];
      
      setMessages(liveMessages);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'guestbook');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast('Authenticated for Guest Ledger access.', 'success');
    } catch (error) {
      showToast('Login Failed: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Access Denied: You must be signed in to post.', 'error');
      return;
    }

    if (!name.trim() || !text.trim()) {
      showToast('Validation Error: Form elements cannot be empty.', 'error');
      return;
    }

    const time = new Date().toTimeString().split(' ')[0];
    
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        role,
        text: text.trim(),
        timestamp: time,
        createdAt: serverTimestamp(),
        userId: currentUser.uid
      });

      // Play mechanical click
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch {}

      setText('');
      showToast('Signature added to Global Ledger!', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'guestbook');
    }
  };

  return (
    <div className="bg-void-100 border-4 border-black p-6 text-white brutalist-border relative flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="text-signal" size={18} />
            <h3 className="text-md font-mono font-black uppercase tracking-wider">SECURE_GUEST_LEDGER</h3>
          </div>
          {!currentUser ? (
            <button 
              onClick={handleLogin}
              className="text-[9px] font-mono px-2 py-0.5 bg-signal text-black border border-black hover:bg-white transition-all cursor-pointer flex items-center gap-1 font-black"
            >
              <LogIn size={10} /> AUTH_SYNC
            </button>
          ) : (
            <div className="text-[9px] font-mono px-2 py-0.5 bg-black/60 text-signal border border-signal flex items-center gap-1 uppercase">
              <CheckCircle size={10} /> {currentUser.email?.split('@')[0]}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handlePost} className="space-y-4 mb-6 pt-2 border-t border-void-300">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-mono text-void-500 uppercase block mb-1">OPERATOR_HANDLE</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acid_Burn"
                disabled={!currentUser}
                className={`w-full bg-black border-2 border-void-300 focus:border-signal text-xs px-3 py-2 text-white placeholder-void-600 outline-none ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-void-500 uppercase block mb-1">BADGE_ROLE</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!currentUser}
                className={`w-full bg-black border-2 border-void-300 focus:border-signal text-xs px-2 py-2 text-white outline-none ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="[HACKER]">[HACKER]</option>
                <option value="[CORE_DEV]">[CORE_DEV]</option>
                <option value="[DRUID_NODE]">[DRUID_NODE]</option>
                <option value="[VISITOR]">[VISITOR]</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-mono text-void-500 uppercase block mb-1">MESSAGE_PAYLOAD</label>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={currentUser ? "Leave a message in the system feed..." : "Authentication required to broadcast..."}
              rows={2}
              disabled={!currentUser}
              className={`w-full bg-black border-2 border-void-300 focus:border-signal text-xs px-3 py-2 text-white placeholder-void-600 outline-none resize-none ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>

          <button 
            type="submit" 
            disabled={!currentUser}
            className={`w-full font-black uppercase font-mono py-2.5 text-xs text-center border-2 border-black shadow-brutalist transition-all flex items-center justify-center gap-2 ${
              currentUser 
                ? 'bg-signal text-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutalist-hover cursor-pointer' 
                : 'bg-void-300 text-void-500 cursor-not-allowed shadow-none'
            }`}
          >
            <Send size={12} /> SYNC SIGNATURE
          </button>
        </form>
      </div>

      {/* Messages list */}
      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
        <label className="text-[9px] font-mono text-void-500 uppercase block">ACTIVE MESSAGE CORRIDOR</label>
        {isLoading ? (
          <div className="text-[10px] font-mono text-void-600 italic">Decrypting ledger stream...</div>
        ) : messages.length === 0 ? (
          <div className="text-[10px] font-mono text-void-600">Corridor is silent. Be the first to broadcast.</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="bg-black/50 p-3 border border-void-300 font-mono text-[11px] leading-relaxed relative group">
              <div className="flex md:items-center justify-between gap-2 text-[9px] mb-1">
                <span className="text-signal font-black block sm:inline">{m.role} {m.name}</span>
                <span className="text-void-600 block">{m.timestamp} UTC</span>
              </div>
              <p className="text-zinc-300 font-light">{m.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. SYSTEM STATUS MONITOR & TERMINAL WIDGET
// ============================================================================
export const SystemStatusMonitor: React.FC = () => {
  const [cmdInput, setCmdInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'KERNEL: Initializing virtual container core on port 3000...',
    'NET_LINK: Authentication established with fallback local caches.',
    'SECURITY: Active threat scanners running at 100% capacity.',
    'HINT: Type /help inside the terminal prompt to view controls.'
  ]);
  const [matrixActive, setMatrixActive] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const input = cmdInput.trim().toLowerCase();
    const newLogs = [...terminalLogs, `> ${cmdInput}`];

    if (input === '/help') {
      newLogs.push(
        'AVAILABLE COMMANDS:',
        '  /status   - Fetches active virtual core statistics.',
        '  /hack     - Simulates penetration auditing matrices.',
        '  /reboot   - Soft-resets active console terminal lines.',
        '  /matrix   - Triggers dynamic ASCII terminal visualization.',
        '  /beep     - Triggers structural audio system frequencies.',
        '  /clear    - Clears terminal logs buffer.'
      );
    } else if (input === '/status') {
      newLogs.push(
        '--- CORE DIAGNOSTICS ---',
        'HOST: Cloud_Run_Ingress_Node_3000',
        'UPTIME: ACTIVE_OK_2026',
        'PING: 42ms [Fiber link]',
        'INTEGRITY: 99.4% Sigma verified'
      );
    } else if (input === '/hack') {
      newLogs.push(
        'LOG: INJECTING EXPLOIT CODE VECTORS...',
        'LOG: ATTACK BLOCKED BY PRE-FILTER PROMPT FIREWALL!',
        'LOG: AUDIT COMPLETED. SYSTEM PROTECTED AND ALIGNED.'
      );
    } else if (input === '/reboot') {
      setTerminalLogs(['SYSTEM CONSOLE REBOOTED SUCCESSFULLY.', 'Ready.']);
      setCmdInput('');
      return;
    } else if (input === '/clear') {
      setTerminalLogs([]);
      setCmdInput('');
      return;
    } else if (input === '/matrix') {
      setMatrixActive(true);
      newLogs.push('LOG: INITIALIZING MATRIX CANVAS STREAM OVERLAY...');
      setTimeout(() => setMatrixActive(false), 5000);
    } else if (input === '/beep') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch {}
      newLogs.push('BEEP: AUDIO BEACON SENT.');
    } else {
      newLogs.push(`ERROR: Command "${input}" not matched. Try /help.`);
    }

    setTerminalLogs(newLogs);
    setCmdInput('');
  };

  return (
    <div className="bg-void-100 border-4 border-black p-6 text-white brutalist-border relative h-full flex flex-col justify-between">
      {matrixActive && (
        <div className="absolute inset-0 bg-black opacity-90 z-50 p-4 font-mono text-neon-green text-[10px] overflow-hidden select-none whitespace-pre leading-none animate-pulse">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="tracking-widest">
              {String.fromCharCode(
                ...Array.from({ length: 40 }, () => 33 + Math.floor(Math.random() * 93))
              )}
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-4 text-center text-white border-2 border-neon-green bg-black py-2 uppercase font-black tracking-widest text-xs">
            MATRIX OVERLAY SIMULATING ACTIVE COMPILATION
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <TermIcon className="text-signal" size={18} />
            <span className="text-md font-mono font-black uppercase tracking-wider">DIAGNOSTIC_CONSOLE</span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 bg-black/60 text-signal border border-signal">ONLINE_DEV_NODE</span>
        </div>

        {/* Console Box */}
        <div className="bg-black border-2 border-black p-4 font-mono text-xs h-[230px] overflow-y-auto space-y-2 select-text custom-scrollbar">
          {terminalLogs.map((log, index) => (
            <div key={index} className="text-zinc-300 font-light leading-relaxed">
              {log}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Console input */}
      <form onSubmit={handleCommandSubmit} className="mt-4 flex gap-2">
        <span className="text-signal font-mono text-sm self-center">&gt;</span>
        <input 
          type="text"
          value={cmdInput}
          onChange={(e) => setCmdInput(e.target.value)}
          placeholder="Command prompt (e.g. /help, /status...)"
          className="flex-1 bg-black text-white text-xs font-mono px-3 py-2 outline-none border-2 border-void-300 focus:border-signal placeholder-void-600"
        />
        <button 
          type="submit"
          className="bg-signal text-black font-mono font-black uppercase px-4 text-xs border-2 border-black hover:bg-signal-hover"
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// 5. INTERACTIVE BENTO TECH-STACK GRID
// ============================================================================
export const TechStackGrid: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const { showToast } = useToast();

  const technologies = [
    { id: 'gemini', name: 'Gemini AI SDK', desc: 'Direct orchestration of Google multimodal reasoning frameworks.', detail: 'Utilizes @google/genai module with strict prompt controls and offline validation loops to compress API latency.' },
    { id: 'react', name: 'React 19 & Vite', desc: 'Surgical compilation with blazing fast Hot Module Replacement.', detail: 'Constructed around functional hooks with strict effect stabilization blocks to avoid render drift.' },
    { id: 'firestore', name: 'Firestore API', desc: 'Realtime transactional ledgers tracking user license uplinks.', detail: 'Enforces complete zero-trust Firestore guidelines paired with offline caching to guarantee persistence.' },
    { id: 'tailwind', name: 'Tailwind CSS', desc: 'Raw class coordination of Neo-Brutalist heavy layouts.', detail: 'Thick 4px industrial outlines, pure signal amber #D98A2E surface frames, and complete zero-radius borders.' },
  ];

  const handleGridClick = (id: string, name: string) => {
    setSelectedTech(prev => prev === id ? null : id);
    showToast(`Inspecting tech module schema: ${name}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {technologies.map(tech => (
          <div 
            key={tech.id}
            onClick={() => handleGridClick(tech.id, tech.name)}
            className={`p-6 border-4 border-black brutalist-border cursor-pointer select-none relative group transition-all duration-150 ${
              selectedTech === tech.id 
                ? 'bg-signal text-black' 
                : 'bg-void-100 text-white hover:bg-void-200'
            }`}
            style={{
              boxShadow: selectedTech === tech.id ? '2px 2px 0px #000' : '6px 6px 0px #000',
              transform: selectedTech === tech.id ? 'translate(2px, 2px)' : 'none'
            }}
          >
            <div className="absolute top-2 right-3 text-[8px] font-mono text-void-500 uppercase">SYS_NODE</div>
            <h4 className="text-sm font-mono font-black uppercase tracking-wider mb-2">{tech.name}</h4>
            <p className={`text-xs ${selectedTech === tech.id ? 'text-black/85' : 'text-void-500'} leading-relaxed font-light font-mono`}>
              {tech.desc}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTech && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-black border-4 border-signal text-white font-mono text-xs space-y-2 select-text"
          >
            <div className="text-signal font-black flex items-center gap-2 uppercase">
              <Code size={14} /> Node Schema Details: {technologies.find(t => t.id === selectedTech)?.name}
            </div>
            <p className="text-zinc-300 font-light leading-relaxed">
              {technologies.find(t => t.id === selectedTech)?.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// 6. MULTI-GAME RETRO ARCADE HUB
// ============================================================================
export const ArcadeHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'grid' | 'meltdown' | 'idle'>('idle');
  
  // Game 1: Grid Disruptor States
  const [gridPos, setGridPos] = useState({ x: 2, y: 2 });
  const [targetPos, setTargetPos] = useState({ x: 4, y: 1 });
  const [obstaclePos, setObstaclePos] = useState({ x: 0, y: 3 });
  const [gridScore, setGridScore] = useState(0);

  // Game 2: Meltdown click states
  const [heat, setHeat] = useState(30);
  const [meltdownScore, setMeltdownScore] = useState(0);
  const [coreStatus, setCoreStatus] = useState('NORM');

  // Game 1: move
  const moveCursor = (dir: 'up' | 'down' | 'left' | 'right') => {
    setGridPos(prev => {
      let nx = prev.x;
      let ny = prev.y;
      if (dir === 'up') ny = Math.max(0, prev.y - 1);
      if (dir === 'down') ny = Math.min(4, prev.y + 1);
      if (dir === 'left') nx = Math.max(0, prev.x - 1);
      if (dir === 'right') nx = Math.min(4, prev.x + 1);

      // Check coin
      if (nx === targetPos.x && ny === targetPos.y) {
        setGridScore(s => s + 10);
        // Respawn targets
        setTargetPos({
          x: Math.floor(Math.random() * 5),
          y: Math.floor(Math.random() * 5)
        });
        setObstaclePos({
          x: Math.floor(Math.random() * 5),
          y: Math.floor(Math.random() * 5)
        });
      }

      // Check obstacle
      if (nx === obstaclePos.x && ny === obstaclePos.y) {
        setGridScore(s => Math.max(0, s - 5));
        setObstaclePos({
          x: Math.floor(Math.random() * 5),
          y: Math.floor(Math.random() * 5)
        });
      }

      return { x: nx, y: ny };
    });
  };

  // Game 2: heat control
  useEffect(() => {
    let timer: any;
    if (activeGame === 'meltdown') {
      timer = setInterval(() => {
        setHeat(h => {
          const nextHeat = h + 4;
          if (nextHeat >= 100) {
            setCoreStatus('FAIL_OVER');
            return 100;
          } else if (nextHeat > 70) {
            setCoreStatus('WARNING_OVERHEAT');
          } else {
            setCoreStatus('NORM');
          }
          return nextHeat;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [activeGame]);

  const ventCore = () => {
    if (coreStatus === 'FAIL_OVER') return;
    setHeat(h => Math.max(0, h - 15));
    setMeltdownScore(s => s + 5);
  };

  const restartMeltdown = () => {
    setHeat(30);
    setMeltdownScore(0);
    setCoreStatus('NORM');
  };

  return (
    <div className="bg-void-100 border-4 border-black p-6 text-white brutalist-border relative flex flex-col justify-between min-h-[360px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-signal" size={18} />
            <h3 className="text-md font-mono font-black uppercase tracking-wider">RETRO_ARCADE_CABINET</h3>
          </div>
          {activeGame !== 'idle' && (
            <button 
              onClick={() => setActiveGame('idle')}
              className="text-[9px] font-mono px-2 py-0.5 bg-black/60 text-signal border border-signal hover:bg-signal hover:text-black cursor-pointer uppercase font-bold"
            >
              EXIT GAME
            </button>
          )}
        </div>

        {activeGame === 'idle' && (
          <div className="space-y-6 pt-10 text-center">
            <p className="text-xs text-void-500 font-mono font-light leading-relaxed max-w-sm mx-auto">
              Simulate high-tech game modules styled strictly in retro ASCII typography vectors.
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button 
                onClick={() => { setActiveGame('grid'); setGridScore(0); setGridPos({ x: 2, y: 2 }); }}
                className="w-full bg-void-100 border-2 border-white font-mono font-black py-2 text-xs uppercase hover:bg-signal hover:text-black hover:border-black transition-all"
              >
                1. GRID DISRUPTOR_
              </button>
              <button 
                onClick={() => { setActiveGame('meltdown'); restartMeltdown(); }}
                className="w-full bg-void-100 border-2 border-white font-mono font-black py-2 text-xs uppercase hover:bg-signal hover:text-black hover:border-black transition-all"
              >
                2. CORE OVERLOAD CONTROL_
              </button>
            </div>
          </div>
        )}

        {/* Game 1: Grid disruptor */}
        {activeGame === 'grid' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-void-300 pb-2">
              <span className="text-[10px] text-void-500 uppercase">GRID SCORE: {gridScore} pts</span>
              <span className="text-[10px] text-signal uppercase">GOAL: GO TO ★ | AVOID ✖</span>
            </div>

            {/* Grid renderer */}
            <div className="grid grid-cols-5 gap-1.5 max-w-[200px] mx-auto bg-black p-2 border-2 border-black">
              {Array.from({ length: 5 }).map((_, y) => 
                Array.from({ length: 5 }).map((_, x) => {
                  const isUser = gridPos.x === x && gridPos.y === y;
                  const isCoin = targetPos.x === x && targetPos.y === y;
                  const isObstacle = obstaclePos.x === x && obstaclePos.y === y;
                  return (
                    <div 
                      key={`${x}-${y}`} 
                      className={`h-7 w-7 flex items-center justify-center font-mono text-xs border ${
                        isUser ? 'bg-signal text-black border-black font-black' :
                        isCoin ? 'text-signal animate-pulse border-signal/20' :
                        isObstacle ? 'text-red-500 border-red-500/20' :
                        'border-void-300 text-void-600 font-light'
                      }`}
                    >
                      {isUser ? '▲' : isCoin ? '★' : isObstacle ? '✖' : '·'}
                    </div>
                  );
                })
              )}
            </div>

            {/* D-Pad controls */}
            <div className="flex flex-col items-center gap-1.5">
              <button 
                onClick={() => moveCursor('up')}
                className="px-4 py-1.5 bg-void-200 border border-void-300 text-xs font-mono font-black"
              >
                UP
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => moveCursor('left')}
                  className="px-4 py-1.5 bg-void-200 border border-void-300 text-xs font-mono font-black"
                >
                  LEFT
                </button>
                <button 
                  onClick={() => moveCursor('right')}
                  className="px-4 py-1.5 bg-void-200 border border-void-300 text-xs font-mono font-black"
                >
                  RIGHT
                </button>
              </div>
              <button 
                onClick={() => moveCursor('down')}
                className="px-4 py-1.5 bg-void-200 border border-void-300 text-xs font-mono font-black"
              >
                DOWN
              </button>
            </div>
          </div>
        )}

        {/* Game 2: core overload clicker */}
        {activeGame === 'meltdown' && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-void-300 pb-2">
              <span className="text-[10px] text-void-500 uppercase">SYS STABILITY: {100 - heat}%</span>
              <span className="text-[10px] text-void-500 uppercase">SCORE: {meltdownScore} pts</span>
            </div>

            <div className="space-y-2">
              <div className="text-[9px] font-mono text-void-500 uppercase block">CORE RADIATION DEPLETION WAVE</div>
              {/* Heat bar container */}
              <div className="relative h-6 bg-black border-2 border-black w-full">
                <div 
                  style={{ width: `${heat}%` }} 
                  className={`absolute top-0 bottom-0 transition-all duration-150 ${
                    heat > 75 ? 'bg-red-600' : heat > 50 ? 'bg-orange-500' : 'bg-signal'
                  }`}
                />
              </div>
            </div>

            {coreStatus === 'FAIL_OVER' ? (
              <div className="text-center space-y-3 py-4">
                <div className="text-red-600 font-mono font-black blink text-sm">CRITICAL CORE MELTDOWN FAILURE!</div>
                <button 
                  onClick={restartMeltdown}
                  className="btn-primary py-1.5 px-6 text-[10px]"
                >
                  REBOOT CORE SYSTEMS
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-[10px] font-mono text-void-500">
                  HEAT ACCUMULATOR: {heat}% | CORE STATUS: <span className={coreStatus !== 'NORM' ? 'text-red-500 font-bold' : 'text-neutral'}>{coreStatus}</span>
                </p>
                <button 
                  onClick={ventCore}
                  className="w-full max-w-xs mx-auto py-4 bg-signal text-black font-mono font-black border-4 border-black shadow-brutalist hover:bg-signal-hover text-xs uppercase"
                >
                  PRESS TO VENT CORE STEAM_
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
