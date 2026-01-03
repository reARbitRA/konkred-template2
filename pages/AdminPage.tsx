import React from 'react';
import { Shield, AlertCircle, CheckCircle, Search, Settings, Activity } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

const AdminPage: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-void">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Governance Console</h1>
                    <p className="text-ghost font-mono text-xs uppercase tracking-widest">Platform Moderation & System Health</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="concrete-card p-6 rounded-lg">
                        <div className="text-xs text-ghost uppercase font-mono mb-4">Pending Audits</div>
                        <div className="text-3xl font-bold text-white">14</div>
                    </div>
                    <div className="concrete-card p-6 rounded-lg">
                        <div className="text-xs text-ghost uppercase font-mono mb-4">Flagged Assets</div>
                        <div className="text-3xl font-bold text-neon-red">2</div>
                    </div>
                    <div className="concrete-card p-6 rounded-lg">
                        <div className="text-xs text-ghost uppercase font-mono mb-4">Escrow Volume</div>
                        <div className="text-3xl font-bold text-white">$42.8k</div>
                    </div>
                    <div className="concrete-card p-6 rounded-lg">
                        <div className="text-xs text-ghost uppercase font-mono mb-4">Uptime</div>
                        <div className="text-3xl font-bold text-neon-green">99.9%</div>
                    </div>
                </div>

                <div className="concrete-card rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-white/5 concrete-card flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white">Audit Queue</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" size={14} />
                            <input placeholder="Search assets..." className="bg-void-200 concrete-card rounded px-8 py-1.5 text-xs text-white outline-none" />
                        </div>
                    </div>
                    <div className="p-12 text-center">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-ghost opacity-20" />
                        <p className="text-ghost text-sm">All systematic audits are currently processing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;