import React, { useState } from 'react';
import { Users, Link, BarChart3, DollarSign, ArrowUpRight, Copy, Check } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

const AffiliatePage: React.FC = () => {
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
        const code = `KND-${Math.floor(100 + Math.random() * 900)}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        setGeneratedCode(code);
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(`https://konkred.xyz?ref=${generatedCode}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-void">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Affiliate Network</h1>
                        <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.2em]">Scale revenue through decentralized distribution</p>
                    </div>
                    <button onClick={generateLink} className="btn-primary flex items-center gap-2 text-xs py-3">
                        <Link size={14} /> GENERATE TRACKING CODE
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Referrals', value: '42', icon: Users, color: 'cyan' },
                        { label: 'Conversion Rate', value: '8.4%', icon: BarChart3, color: 'purple' },
                        { label: 'Earnings (Pending)', value: '$1,240.00', icon: DollarSign, color: 'gold' },
                        { label: 'Total Payouts', value: '$8,420.50', icon: DollarSign, color: 'green' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-void-100 border border-white/10 p-6 rounded-2xl group hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <stat.icon size={20} className={`text-neon-${stat.color} group-hover:scale-110 transition-transform`} />
                            </div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-[10px] text-ghost font-mono uppercase mt-1 tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {generatedCode && (
                  <div className="bg-neon-cyan/5 border border-neon-cyan/20 p-8 rounded-2xl animate-in zoom-in-95">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Link size={18} className="text-neon-cyan" />
                        Active Referral Link
                    </h3>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-void p-4 rounded-xl border border-white/10 font-mono text-sm text-neon-cyan truncate">
                            https://konkred.xyz?ref={generatedCode}
                        </div>
                        <button 
                            onClick={copyToClipboard}
                            className="bg-neon-cyan text-black px-6 rounded-xl font-bold flex items-center gap-2 hover:shadow-neon-cyan transition-all"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'COPIED' : 'COPY'}
                        </button>
                    </div>
                  </div>
                )}

                <div className="bg-void-100 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">Conversion Ledger</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[11px]">
                            <thead className="bg-void-300 text-ghost uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Resource</th>
                                    <th className="px-6 py-4">Link Code</th>
                                    <th className="px-6 py-4">Clicks</th>
                                    <th className="px-6 py-4">Conversions</th>
                                    <th className="px-6 py-4 text-right">Commission</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[1, 2, 3].map(i => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-white">SaaS-Valuation-v4.xlsx</td>
                                        <td className="px-6 py-4 text-neon-cyan">KND-842-X</td>
                                        <td className="px-6 py-4">1,242</td>
                                        <td className="px-6 py-4 text-ghost-light">12</td>
                                        <td className="px-6 py-4 text-right text-neon-green font-bold">+$142.10</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliatePage;