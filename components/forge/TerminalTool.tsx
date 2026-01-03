
import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Maximize2, Minimize2, Play, Square, Cpu, Wifi } from 'lucide-react';

interface LogLine {
  id: number;
  type: 'info' | 'success' | 'error' | 'warning' | 'system';
  content: string;
  timestamp: string;
}

const TerminalTool: React.FC = () => {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with boot sequence
  useEffect(() => {
    addLog('system', 'KONKRED KERNEL v4.2.0-STABLE initializing...');
    addLog('system', 'Mounting virtual volumes: /mnt/neural_core [OK]');
    addLog('info', 'Secure uplink established. Node ID: US-EAST-1-84X');
    addLog('info', 'Type "help" for available command modules.');
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: LogLine['type'], content: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + Math.floor(Math.random() * 999).toString().padStart(3, '0');
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), type, content, timestamp }]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim();
    addLog('info', `> ${cmd}`);
    setCommand('');

    processCommand(cmd);
  };

  const processCommand = (cmd: string) => {
    const parts = cmd.split(' ');
    const main = parts[0].toLowerCase();

    switch (main) {
        case 'help':
            addLog('system', 'AVAILABLE COMMANDS:');
            addLog('system', '  deploy <agent_id>   - Initialize autonomous agent instance');
            addLog('system', '  status              - Check node health and latency');
            addLog('system', '  clear               - Clear terminal buffer');
            addLog('system', '  scan <target>       - Run deep-logic audit on target ID');
            break;
        case 'clear':
            setLogs([]);
            break;
        case 'status':
            addLog('info', 'Calculating system telemetry...');
            setTimeout(() => {
                addLog('success', 'STATUS: NOMINAL | LOAD: 12% | LATENCY: 14ms');
                addLog('success', 'ENCLAVE SECURITY: LOCKED (AES-256)');
            }, 800);
            break;
        case 'deploy':
            if (parts[1]) {
                runDeploymentSimulation(parts[1]);
            } else {
                addLog('error', 'Error: Missing agent_id. Usage: deploy <agent_id>');
            }
            break;
        default:
            addLog('error', `Unknown command: "${main}". Type "help" for manual.`);
    }
  };

  const runDeploymentSimulation = (agentId: string) => {
      setIsRunning(true);
      addLog('info', `Initializing deployment sequence for Agent [${agentId}]...`);
      
      let step = 0;
      const steps = [
          'Allocating virtual memory container...',
          'Injecting system prompts...',
          'Verifying safety guardrails...',
          'Establishing API bridges...',
          `Agent [${agentId}] is LIVE and listening on port 8080.`
      ];

      const interval = setInterval(() => {
          if (step >= steps.length) {
              clearInterval(interval);
              setIsRunning(false);
              addLog('success', 'Deployment sequence completed successfully.');
          } else {
              addLog('system', steps[step]);
              step++;
          }
      }, 1000);
  };

  return (
    <div className="h-full flex flex-col animate-in zoom-in-95 duration-500">
      {/* Terminal Window */}
      <div className="flex-1 concrete-card bg-black/90 border-white/10 rounded-2xl overflow-hidden flex flex-col font-mono shadow-2xl relative">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
        
        {/* Header */}
        <div className="h-10 bg-void-300 border-b border-white/5 flex justify-between items-center px-4 relative z-30">
            <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-red/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-gold/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-green/50" />
                </div>
                <span className="text-[10px] text-ghost font-bold tracking-widest uppercase ml-2">Konkred_Kernel_Shell</span>
            </div>
            <div className="flex items-center gap-4 text-[9px] text-ghost uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Wifi size={10} className="text-neon-green" /> Online</span>
                <span className="flex items-center gap-1.5"><Cpu size={10} /> 12% Load</span>
            </div>
        </div>

        {/* Log Output */}
        <div className="flex-1 overflow-y-auto p-6 space-y-1 relative z-10" ref={scrollRef}>
            {logs.map((log) => (
                <div key={log.id} className="flex gap-4 text-xs font-mono">
                    <span className="text-ghost opacity-50 shrink-0 select-none">[{log.timestamp}]</span>
                    <span className={`${
                        log.type === 'error' ? 'text-neon-red' : 
                        log.type === 'success' ? 'text-neon-green' : 
                        log.type === 'system' ? 'text-neon-purple' : 
                        'text-ghost-light'
                    }`}>
                        {log.type === 'info' && <span className="text-neon-cyan mr-2">$</span>}
                        {log.content}
                    </span>
                </div>
            ))}
            {isRunning && (
                <div className="flex gap-4 text-xs font-mono animate-pulse text-neon-gold">
                    <span className="text-ghost opacity-50 shrink-0">[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                    <span>Processing...</span>
                </div>
            )}
        </div>

        {/* Input Line */}
        <div className="p-4 bg-void-400/30 border-t border-white/5 relative z-30">
            <form onSubmit={handleCommand} className="flex items-center gap-3">
                <span className="text-neon-green font-bold animate-pulse">{'>'}</span>
                <input 
                    type="text" 
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder:text-ghost/30"
                    placeholder="Enter command..."
                    autoFocus
                    disabled={isRunning}
                />
            </form>
        </div>
      </div>
    </div>
  );
};

export default TerminalTool;
