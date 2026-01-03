
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight, Zap, Shield, Cpu, Globe } from 'lucide-react';

const SystemTerminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'KONKRED KERNEL v4.2.0-STABLE',
    'ESTABLISHING ENCRYPTED UPLINK...',
    'NODE_READY: US-EAST-1 [VALIDATOR]',
    'Type "help" to view available modules.'
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const c = cmd.toLowerCase().trim();
    let response = [`> ${cmd}`];

    switch (c) {
      case 'help':
        response.push('AVAILABLE_MODULES:', ' - status: Check node health', ' - audit [id]: Run quick-scan on protocol', ' - map: View global node density', ' - clear: Wipe terminal buffer');
        break;
      case 'status':
        response.push('SYSTEM_STATUS: NOMINAL', 'CPU_LOAD: 12.4%', 'MEM_ENCLAVE: 8.2GB/16GB', 'LATENCY: 14ms');
        break;
      case 'map':
        response.push('SYNCHRONIZING GLOBAL NODES...', ' [█] NORTH_AMERICA: 482 NODES', ' [█] EUROPE: 312 NODES', ' [░] ASIA: 240 NODES (OPTIMIZING)');
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
        if (c.startsWith('audit')) {
          response.push('INITIALIZING QUICK-SCAN...', 'RESULT: [PASS] Logic Integrity verified at 94%.');
        } else {
          response.push(`COMMAND_NOT_FOUND: ${cmd}. Type "help" for manual.`);
        }
    }
    setHistory(prev => [...prev, ...response]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
  };

  return (
    <div className="concrete-card bg-black/80 rounded-3xl border-white/5 overflow-hidden flex flex-col h-[600px] shadow-2xl animate-in zoom-in-95 duration-500">
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
          <span className="text-[10px] font-mono text-ghost uppercase tracking-widest font-black">Kernel_Session // Node_042</span>
        </div>
        <div className="flex gap-2">
           <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
           <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
      </div>
      
      <div className="flex-1 p-8 font-mono text-xs overflow-y-auto space-y-2 selection:bg-neon-purple selection:text-white" ref={scrollRef}>
        {history.map((line, i) => (
          <div key={i} className={`${line.startsWith('>') ? 'text-neon-purple font-bold' : line.includes('RESULT') ? 'text-neon-green' : 'text-ghost-light'}`}>
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-void-400/20">
        <div className="flex items-center gap-3">
          <ChevronRight size={14} className="text-neon-purple" />
          <input 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono placeholder:text-ghost/30"
            placeholder="Awaiting command..."
          />
        </div>
      </form>
    </div>
  );
};

export default SystemTerminal;
