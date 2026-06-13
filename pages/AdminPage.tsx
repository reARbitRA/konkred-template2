import React, { useState, useEffect } from 'react';
import { 
    Shield, AlertCircle, CheckCircle, Search, Settings, Activity, 
    Cpu, RefreshCw, FileCheck, Ban, ShieldAlert, Terminal, Play, Check 
} from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { useToast } from '../contexts/ToastContext.tsx';

interface AuditItem {
    id: string;
    title: string;
    developer: string;
    type: 'protocol' | 'agent' | 'prompt_system' | 'workflow';
    pricing: string;
    submittedAt: string;
    sourceCodeLength: string;
    riskScore: number;
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
}

const AdminPage: React.FC = () => {
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'flagged' | 'approved'>('all');
    
    // System performance state
    const [cpuLoad, setCpuLoad] = useState(24);
    const [memoryUsage, setMemoryUsage] = useState(48);
    const [bandwidth, setBandwidth] = useState(1.2);
    
    // Interactive queue items
    const [queue, setQueue] = useState<AuditItem[]>([
        { id: 'AUD-9021', title: 'Solidity Guard Agent', developer: 'Enigma Labs', type: 'agent', pricing: '$189 one-time', submittedAt: '10m ago', sourceCodeLength: '12,450 lines', riskScore: 12, status: 'pending' },
        { id: 'AUD-4412', title: 'Arbitrage Loop v3', developer: 'Alpha Quant', type: 'protocol', pricing: '$45/mo usage', submittedAt: '36m ago', sourceCodeLength: '45,120 lines', riskScore: 45, status: 'pending' },
        { id: 'AUD-1085', title: 'DeepSeek Jailbreak Shield', developer: 'Nexus Cyber', type: 'prompt_system', pricing: '$99 one-time', submittedAt: '2h ago', sourceCodeLength: '1,200 lines', riskScore: 8, status: 'pending' },
        { id: 'AUD-5621', title: 'HFT Pipeline Trigger', developer: 'FlashBots', type: 'workflow', pricing: '$500 one-time', submittedAt: '4h ago', sourceCodeLength: '89,400 lines', riskScore: 87, status: 'flagged' },
        { id: 'AUD-3011', title: 'IPFS Vector DB Sync', developer: 'BlockData LLC', type: 'workflow', pricing: 'Free option', submittedAt: '1d ago', sourceCodeLength: '6,700 lines', riskScore: 15, status: 'approved' },
        { id: 'AUD-7391', title: 'Multisig Autonomous Agent', developer: 'Gnosis Guild', type: 'agent', pricing: '$250/mo sub', submittedAt: '1d ago', sourceCodeLength: '34,900 lines', riskScore: 4, status: 'approved' }
    ]);

    // Active operations logs
    const [consoleLogs, setConsoleLogs] = useState<string[]>([
        '[SYS] Governance Enclave Init [SUCCESS]',
        '[NET] Port 3000 mapped to container ingress proxy router',
        '[SEC] Heartbeat running on 4 distributed validator nodes',
        '[AUD] Static analyzer engine online: v2.4.9 prod-ready'
    ]);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    // Randomize system telemetry slowly
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuLoad(prev => Math.max(12, Math.min(85, prev + Math.floor(Math.random() * 9) - 4)));
            setMemoryUsage(prev => Math.max(40, Math.min(65, prev + Math.floor(Math.random() * 3) - 1)));
            setBandwidth(prev => Math.max(0.8, Math.min(4.2, parseFloat((prev + Math.random() * 0.4 - 0.2).toFixed(2)))));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const addLog = (msg: string) => {
        const time = new Date().toLocaleTimeString();
        setConsoleLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 19)]);
    };

    const handleApprove = (id: string, name: string) => {
        setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
        showToast(`Asset "${name}" successfully verified and approved.`, 'success');
        addLog(`[AUDIT_PASS] Approved ${id} (${name}) after automated bypass review.`);
    };

    const handleReject = (id: string, name: string) => {
        setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
        showToast(`Asset "${name}" was rejected.`, 'error');
        addLog(`[AUDIT_REJECT] Rejected ${id} (${name}) due to technical guidelines non-compliance.`);
    };

    const handleFlag = (id: string, name: string) => {
        setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'flagged', riskScore: Math.min(100, item.riskScore + 30) } : item));
        showToast(`Asset "${name}" flagged for priority security analysis.`, 'warning');
        addLog(`[SECURITY_WARN] Escalated audit level for ${id} (${name}). Potential injection vectors found.`);
    };

    const runFullAuditScan = () => {
        if (isScanning) return;
        setIsScanning(true);
        setScanProgress(0);
        showToast('Initiating standard environment vulnerability assessment...', 'info');
        addLog('[AUDIT_START] Triggering whole-platform dependency sanitization check...');

        const interval = setInterval(() => {
            setScanProgress(prev => {
                const next = prev + Math.floor(Math.random() * 15) + 5;
                if (next >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    showToast('Vulnerability check successfully completed. No immediate threats detected.', 'success');
                    addLog('[AUDIT_COMPLETE] 0 critical flaws, 3 minor updates pending matching. Sandbox stabilized.');
                    return 100;
                }
                const randomLogs = [
                    'Scanning crypto verification dependencies...',
                    'Checking transaction signature nonces...',
                    'Analyzing prompt payload vectors for zero-day injections...',
                    'Evaluating gas estimation benchmarks...',
                    'Mapping API endpoints to telemetry modules...'
                ];
                if (Math.random() > 0.4) {
                    addLog(`[SEC_SCAN] ${randomLogs[Math.floor(Math.random() * randomLogs.length)]}`);
                }
                return next;
            });
        }, 300);
    };

    // Filter queue items
    const filteredQueue = queue.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.id.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (activeFilter === 'all') return matchesSearch;
        return item.status === activeFilter && matchesSearch;
    });

    return (
        <div className="p-8 min-h-screen bg-void pt-28 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-3">
                            <Shield className="text-neon-cyan animate-pulse" size={32} />
                            Governance Console
                        </h1>
                        <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.2em] mt-1">Platform Moderation & System Security Enclave</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={runFullAuditScan}
                            disabled={isScanning}
                            className="bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-xl px-5 py-3 text-[10px] uppercase tracking-widest font-mono font-bold transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
                            {isScanning ? `SCANNING_${scanProgress}%` : 'RUN_SECURITY_SCAN'}
                        </button>
                    </div>
                </header>

                {/* Environment Health Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="concrete-card p-6 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-ghost uppercase font-mono tracking-wider mb-2 flex items-center gap-2">
                                <Cpu size={12} className="text-neon-cyan animate-pulse" /> CPU Load
                            </div>
                            <div className="text-3xl font-bold text-white font-mono">{cpuLoad}%</div>
                        </div>
                        <div className="h-1.5 w-full bg-void-400 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-neon-cyan transition-all duration-300" style={{ width: `${cpuLoad}%` }}></div>
                        </div>
                    </div>

                    <div className="concrete-card p-6 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-ghost uppercase font-mono tracking-wider mb-2 flex items-center gap-2">
                                <Activity size={12} className="text-neon-green" /> Memory Allocation
                            </div>
                            <div className="text-3xl font-bold text-white font-mono">{memoryUsage}%</div>
                        </div>
                        <div className="h-1.5 w-full bg-void-400 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-neon-green transition-all duration-300" style={{ width: `${memoryUsage}%` }}></div>
                        </div>
                    </div>

                    <div className="concrete-card p-6 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-ghost uppercase font-mono tracking-wider mb-2 flex items-center gap-2">
                                <ShieldAlert size={12} className="text-neon-purple" /> Node Traffic
                            </div>
                            <div className="text-3xl font-bold text-white font-mono">{bandwidth} GB/s</div>
                        </div>
                        <div className="h-1.5 w-full bg-void-400 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-neon-purple transition-all duration-300" style={{ width: `${Math.min(100, (bandwidth/5)*100)}%` }}></div>
                        </div>
                    </div>

                    <div className="concrete-card p-6 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-ghost uppercase font-mono tracking-wider mb-2 flex items-center gap-2">
                                <CheckCircle size={12} className="text-neon-green" /> Sandbox Verification
                            </div>
                            <div className="text-3xl font-bold text-neon-green font-display">100% ONLINE</div>
                        </div>
                        <p className="text-[9px] text-ghost font-mono mt-4">All secure cryptographic keys active</p>
                    </div>
                </div>

                {/* Audit Scan Progress Bar */}
                {isScanning && (
                    <div className="bg-neon-cyan/5 border border-neon-cyan/25 rounded-2xl p-5 space-y-2 animate-in zoom-in-95">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                            <span className="text-neon-cyan flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping"></span>
                                Running Live Enclave Integrity Verification...
                            </span>
                            <span className="text-white font-bold">{scanProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-void-400 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Main Workspace split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Filterable Audit Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="concrete-card rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                            
                            {/* Table Header Controls */}
                            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01]">
                                <div className="flex gap-2">
                                    {(['all', 'pending', 'flagged', 'approved'] as const).map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest font-bold transition-all ${
                                                activeFilter === filter 
                                                    ? 'bg-neon-cyan text-black' 
                                                    : 'text-ghost hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" size={14} />
                                    <input 
                                        placeholder="Filter audit queue..." 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full bg-void-200 border border-white/5 hover:border-white/15 focus:border-neon-cyan/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none font-mono transition-all" 
                                    />
                                </div>
                            </div>

                            {/* Table List */}
                            <div className="overflow-x-auto">
                                {filteredQueue.length > 0 ? (
                                    <table className="w-full text-left font-mono text-xs">
                                        <thead className="bg-[#0c0c0e] text-ghost uppercase tracking-wider border-b border-white/5">
                                            <tr>
                                                <th className="px-6 py-4">Asset Details</th>
                                                <th className="px-6 py-4">Security Metrics</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Decisions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredQueue.map(item => (
                                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-white mb-0.5">{item.title}</div>
                                                        <div className="text-[10px] text-ghost flex items-center gap-2">
                                                            <span className="text-neon-cyan">{item.id}</span>
                                                            <span>•</span>
                                                            <span>by {item.developer}</span>
                                                            <span>•</span>
                                                            <span className="uppercase text-[9px] font-bold text-[#fafafa]/50 tracking-wider bg-void-300 px-1 py-0.5 border border-white/5">{item.type.replace('_', ' ')}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="text-ghost mb-1">Codebase size: <span className="text-white font-bold">{item.sourceCodeLength}</span></div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px]">AI Risk Score:</span>
                                                            <span className={`font-bold font-mono text-[10px] px-1.5 py-0.5 rounded ${
                                                                item.riskScore > 50 
                                                                    ? 'text-neon-red bg-neon-red/10 border border-neon-red/20' 
                                                                    : item.riskScore > 15 
                                                                        ? 'text-neon-purple bg-neon-purple/10 border border-neon-purple/20'
                                                                        : 'text-neon-green bg-neon-green/10 border border-neon-green/20'
                                                            }`}>
                                                                {item.riskScore}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge variant={
                                                            item.status === 'approved' 
                                                                ? 'green' 
                                                                : item.status === 'rejected' 
                                                                    ? 'gray' 
                                                                    : item.status === 'flagged' 
                                                                        ? 'red' 
                                                                        : 'cyan'
                                                        }>
                                                            {item.status.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        {item.status === 'pending' || item.status === 'flagged' ? (
                                                            <div className="flex justify-end gap-2">
                                                                <button 
                                                                    onClick={() => handleReject(item.id, item.title)}
                                                                    title="Reject and De-list"
                                                                    className="p-2 border border-white/5 hover:border-neon-red/30 hover:bg-neon-red/5 rounded-xl text-ghost hover:text-neon-red transition-all"
                                                                >
                                                                    <Ban size={14} />
                                                                </button>
                                                                {item.status === 'pending' && (
                                                                    <button 
                                                                        onClick={() => handleFlag(item.id, item.title)}
                                                                        title="Escalate & Flag Security Vectors"
                                                                        className="p-2 border border-white/5 hover:border-neon-purple/30 hover:bg-neon-purple/5 rounded-xl text-ghost hover:text-neon-purple transition-all"
                                                                    >
                                                                        <ShieldAlert size={14} />
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    onClick={() => handleApprove(item.id, item.title)}
                                                                    title="Approve Asset Dev"
                                                                    className="p-2 bg-neon-green/10 hover:bg-neon-green text-neon-green hover:text-black border border-neon-green/20 hover:border-transparent rounded-xl transition-all"
                                                                >
                                                                    <Check size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-ghost/40 italic uppercase tracking-widest">
                                                                Immutable Resolved
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-16 text-center">
                                        <FileCheck className="w-12 h-12 mx-auto mb-4 text-ghost opacity-20 animate-bounce" />
                                        <p className="text-white font-mono text-sm uppercase tracking-wider mb-1">Queue Empty</p>
                                        <p className="text-ghost text-xs max-w-sm mx-auto">No pending assets discovered matching your active filters. System is optimized.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Operational Console & Health Alerts */}
                    <div className="space-y-6">
                        
                        {/* Interactive Console Terminal */}
                        <div className="concrete-card rounded-2xl overflow-hidden bg-black/60 border border-white/5 flex flex-col h-[400px]">
                            <div className="px-5 py-4 border-b border-white/5 bg-[#111114] flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Terminal size={14} className="text-neon-cyan animate-pulse" />
                                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">SEC_ENV_DAEMON_TERM</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-neon-red opacity-60"></span>
                                    <span className="w-2 h-2 rounded-full bg-neon-gold opacity-60"></span>
                                    <span className="w-2 h-2 rounded-full bg-neon-green opacity-60"></span>
                                </div>
                            </div>
                            
                            <div className="p-5 flex-1 overflow-y-auto font-mono text-[10px] text-zinc-400 bg-black/90 space-y-2.5 custom-scrollbar select-none">
                                {consoleLogs.map((log, index) => (
                                    <div key={index} className={`leading-relaxed break-all ${
                                        log.includes('[SYS]') ? 'text-zinc-500' :
                                        log.includes('[AUDIT_PASS]') ? 'text-neon-green font-bold' :
                                        log.includes('[AUDIT_REJECT]') ? 'text-neon-red' :
                                        log.includes('[SECURITY_WARN]') ? 'text-neon-purple font-bold' :
                                        'text-neon-cyan/80'
                                    }`}>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Node Controls Actions Card */}
                        <div className="concrete-card rounded-2xl p-6 bg-black/40 border border-white/5 space-y-4">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
                                <Settings size={14} className="text-ghost" /> Operational Commands
                            </h3>
                            <p className="text-[11px] text-ghost leading-relaxed">Cryptographic manual action scripts available for instant container environment orchestration.</p>
                            
                            <div className="space-y-2.5 pt-2">
                                <button 
                                    onClick={() => {
                                        showToast('Node Enclave Ledger Snapshot synchronized with distributed database.', 'info');
                                        addLog('[LEDGER_SYNC] Automated audit snapshot synced across 4 node replicas.');
                                    }}
                                    className="w-full bg-[#111] hover:bg-white/5 border border-white/5 hover:border-white/10 active:scale-[0.98] py-2.5 px-4 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider text-white transition-all text-left flex justify-between items-center"
                                >
                                    <span>Export Audit Database Ledger</span>
                                    <FileCheck size={12} className="text-neon-cyan" />
                                </button>

                                <button 
                                    onClick={() => {
                                        showToast('Platform Global Fee adjusted to default network baseline 1.5%.', 'success');
                                        addLog('[GAS_ADJUST] Operator override changed base commission fee multiplier to 0.015.');
                                    }}
                                    className="w-full bg-[#111] hover:bg-white/5 border border-white/5 hover:border-white/10 active:scale-[0.98] py-2.5 px-4 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider text-white transition-all text-left flex justify-between items-center"
                                >
                                    <span>Sync Base gas fee coefficients</span>
                                    <Activity size={12} className="text-neon-green" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminPage;
