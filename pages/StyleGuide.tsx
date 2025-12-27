import React from 'react';
import Badge from '../components/common/Badge.tsx';
import { ShoppingBag, Hammer, Shield, Zap, Info } from 'lucide-react';

const StyleGuide: React.FC = () => {
    return (
        <div className="p-12 space-y-20 max-w-5xl mx-auto">
            <header className="border-b border-white/10 pb-8">
                <h1 className="text-4xl font-display font-bold text-white">UI Kit & Style Guide</h1>
                <p className="text-ghost font-mono text-sm uppercase tracking-widest mt-2">KONKRED DESIGN SYSTEM v2.5</p>
            </header>

            <section className="space-y-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-px bg-neon-cyan" /> Status Badges
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="cyan">Verified</Badge>
                    <Badge variant="purple">Editor's Choice</Badge>
                    <Badge variant="green">Top Seller</Badge>
                    <Badge variant="gold">Audit 90+</Badge>
                    <Badge variant="red">Flagged</Badge>
                    <Badge variant="gray">Archived</Badge>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-px bg-neon-cyan" /> Primary Buttons
                </h2>
                <div className="flex flex-wrap gap-6">
                    <button className="btn-primary"><span>Primary Action</span></button>
                    <button className="btn-secondary">Secondary Action</button>
                    <button className="px-6 py-2 bg-neon-green text-black font-bold uppercase text-[10px] tracking-widest">Success State</button>
                    <button className="px-6 py-2 border border-neon-red text-neon-red font-bold uppercase text-[10px] tracking-widest hover:bg-neon-red/10">Destructive</button>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-px bg-neon-cyan" /> Typography
                </h2>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-mono text-ghost uppercase mb-2">Display Bold (Space Grotesk)</p>
                        <h3 className="text-4xl font-display font-bold text-white">The AI Operating System</h3>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono text-ghost uppercase mb-2">Interface UI (Inter)</p>
                        <p className="text-lg text-ghost-light">Clean, readable, high-contrast text for commerce interfaces.</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono text-ghost uppercase mb-2">Technical Data (JetBrains Mono)</p>
                        <p className="text-sm font-mono text-neon-cyan">TXN_ID: 84729-AZ // HASH: 0x82f...a1</p>
                    </div>
                </div>
            </section>

            <section className="space-y-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-8 h-px bg-neon-cyan" /> Empty States
                </h2>
                <div className="p-20 border border-dashed border-white/10 rounded-xl bg-white/5 text-center">
                    <div className="w-16 h-16 bg-void-300 rounded-full flex items-center justify-center mx-auto mb-4 text-ghost">
                        <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No Transactions Found</h3>
                    <p className="text-ghost text-sm max-w-xs mx-auto">Acquire your first asset to see your transaction history populate here.</p>
                </div>
            </section>
        </div>
    );
};

export default StyleGuide;