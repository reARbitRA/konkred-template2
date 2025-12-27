import React from 'react';
import { Newspaper, ArrowUpRight, Search, Hash, Clock } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

const posts = [
  { id: 1, title: 'The Rise of Structural AI Capital', category: 'Strategy', date: 'NOV 22, 2024', readTime: '8 min', desc: 'Why enterprise value is shifting from raw compute to verified logic maps.' },
  { id: 2, title: 'Auditing LLM Efficacy: A Quantitative Framework', category: 'Engineering', date: 'NOV 20, 2024', readTime: '12 min', desc: 'Deconstructing the KONKRED AUDIT v4.0 scoring system for technical sellers.' },
  { id: 3, title: 'Market Analysis: SaaS Multiples in the Age of Agents', category: 'Finance', date: 'NOV 18, 2024', readTime: '15 min', desc: 'Predicting acquisition trends for agentic operating procedures in 2025.' },
];

const BlogHub: React.FC = () => {
  return (
    <div className="p-8 min-h-screen bg-void animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">KONKRED Intel</h1>
            <p className="text-ghost font-mono text-xs uppercase tracking-[0.3em]">Deep dives into AI strategy & engineering</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" size={16} />
            <input placeholder="Search archives..." className="w-full bg-void-200 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-void-100 border border-white/5 rounded-2xl p-8 hover:border-white/20 transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    <Badge variant="cyan">{post.category}</Badge>
                    <span className="text-[10px] text-ghost font-mono flex items-center gap-1 uppercase tracking-widest"><Clock size={10} /> {post.readTime}</span>
                  </div>
                  <span className="text-[10px] text-ghost font-mono">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">{post.title}</h2>
                <p className="text-ghost-light leading-relaxed mb-6 font-light">{post.desc}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-neon-blue font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  READ BRIEFING <ArrowUpRight size={14} />
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-void-100 border border-white/5 rounded-2xl p-6">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Hash size={14} className="text-neon-blue" /> Categories
              </h3>
              <div className="space-y-3">
                {['Strategy', 'Engineering', 'Financials', 'Governance', 'Case Studies'].map(cat => (
                  <button key={cat} className="w-full flex justify-between text-sm text-ghost hover:text-white transition-colors">
                    <span>{cat}</span>
                    <span className="text-xs font-mono opacity-40">12</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-2">Intel Dispatch</h3>
              <p className="text-xs text-ghost leading-relaxed mb-6">Receive weekly high-stakes reports directly to your node.</p>
              <input placeholder="executive@email" className="w-full bg-void border border-white/10 rounded-lg p-3 text-xs text-white mb-3" />
              <button className="w-full bg-neon-blue text-black font-black py-3 rounded-lg text-[10px] tracking-widest uppercase">SUBSCRIBE</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogHub;