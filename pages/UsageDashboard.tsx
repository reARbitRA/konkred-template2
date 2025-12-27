import React from 'react';
import { Zap, BarChart3, AlertCircle, Clock, ArrowUpRight } from 'lucide-react';

const UsageDashboard: React.FC = () => {
    return (
        <div className="p-8 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Usage & API Metrics</h1>
                    <p className="text-ghost font-mono text-xs uppercase tracking-widest">Real-time telemetry for metered assets</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-void-100 border border-white/10 p-6 rounded-lg">
                        <div className="text-xs text-ghost uppercase font-mono mb-4 flex items-center gap-2">
                            <Zap size={14} className="text-neon-cyan" /> Current Run Rate
                        </div>
                        <div className="text-3xl font-bold text-white">$42.10 <span className="text-sm text-ghost">/ mo</span></div>
                        <div className="mt-4 h-1.5 w-full bg-void-300 rounded-full overflow-hidden">
                            <div className="h-full bg-neon-cyan" style={{ width: '65%' }} />
                        </div>
                        <div className="mt-2 text-[10px] text-ghost flex justify-between uppercase font-mono">
                            <span>Limit: $100</span>
                            <span>65% Consumed</span>
                        </div>
                    </div>

                    <div className="bg-void-100 border border-white/10 p-6 rounded-lg">
                        <div className="text-xs text-ghost uppercase font-mono mb-4 flex items-center gap-2">
                            <BarChart3 size={14} className="text-neon-purple" /> API Requests
                        </div>
                        <div className="text-3xl font-bold text-white">12,482</div>
                        <div className="text-xs text-neon-green mt-2">+12% from last cycle</div>
                    </div>

                    <div className="bg-void-100 border border-white/10 p-6 rounded-lg">
                        <div className="text-xs text-ghost uppercase font-mono mb-4 flex items-center gap-2">
                            <AlertCircle size={14} className="text-neon-gold" /> Active Throttles
                        </div>
                        <div className="text-3xl font-bold text-white">0</div>
                        <div className="text-xs text-ghost mt-2">All endpoints operating at 100% capacity</div>
                    </div>
                </div>

                <div className="bg-void-100 border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">Endpoint Telemetry</span>
                        <button className="text-[10px] text-neon-cyan uppercase font-bold flex items-center gap-1">
                            Export Logs <ArrowUpRight size={12} />
                        </button>
                    </div>
                    <table className="w-full text-left font-mono text-[11px]">
                        <thead className="bg-void-300 text-ghost uppercase">
                            <tr>
                                <th className="px-6 py-4">Resource</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Avg Latency</th>
                                <th className="px-6 py-4 text-right">Cost (24h)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[1, 2, 3].map(i => (
                                <tr key={i} className="hover:bg-white/5">
                                    <td className="px-6 py-4 text-white">HealthAI-Intake-v2.api</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 text-neon-green">
                                            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> ACTIVE
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-ghost">142ms</td>
                                    <td className="px-6 py-4 text-right text-white font-bold">$1.42</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsageDashboard;