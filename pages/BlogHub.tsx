
import React from 'react';
import { Newspaper, ArrowUpRight, Search, Hash, Clock, Eye, MessageSquare, Bookmark, ArrowLeft } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { PageView } from '../types.ts';

const posts = [
  { id: 1, title: 'The Rise of Structural AI Capital', category: 'Strategy', date: 'NOV 22, 2024', readTime: '8 min', desc: 'Why enterprise value is shifting from raw compute power to verified logic maps and deterministic operating procedures.', views: '2.4k', comments: 12 },
  { id: 2, title: 'Auditing LLM Efficacy: A Quantitative Framework', category: 'Engineering', date: 'NOV 20, 2024', readTime: '12 min', desc: 'A deep dive into the KONKRED AUDIT v4.0 scoring system. How we measure logic, safety, and operational efficiency.', views: '1.8k', comments: 24 },
  { id: 3, title: 'Market Analysis: SaaS Multiples in the Age of Agents', category: 'Finance', date: 'NOV 18, 2024', readTime: '15 min', desc: 'Predicting acquisition trends for agentic architectures in 2025. Why buyers are paying a premium for verified logic.', views: '3.1k', comments: 48 },
];

const BlogHub: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  return (
    <div className="p-8 min-h-screen bg-void pt-28 font-sans">
      <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b border-white/5">
          <div>
            <h1 className="text-6xl font-display font-bold text-white mb-6">KONKRED <span className="text-neon-blue">Intel</span></h1>
            <p className="text-ghost-light text-xl font-light leading-relaxed max-w-2xl">High-fidelity briefings on the evolution of AI commerce, structural capital, and decentralised execution protocols.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost" size={18} />
            <input 
              placeholder="Search intelligence archives..." 
              className="w-full bg-void-200 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-neon-blue transition-all" 
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-10">
            {posts.map((post) => (
              <article key={post.id} className="concrete-card rounded-3xl p-10 hover:border-white/20 transition-all group cursor-pointer bg-black/20">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-6 items-center">
                    <Badge variant="cyan">{post.category}</Badge>
                    <div className="flex items-center gap-4 text-[10px] text-ghost font-mono uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                        <span className="flex items-center gap-1.5"><Eye size={12} /> {post.views}</span>
                        <span className="flex items-center gap-1.5"><MessageSquare size={12} /> {post.comments}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-ghost font-mono tracking-widest">{post.date}</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-neon-blue transition-colors duration-300 leading-tight">{post.title}</h2>
                <p className="text-ghost-light leading-relaxed mb-8 font-light text-lg">{post.desc}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-mono text-neon-blue font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                      ACCESS BRIEFING <ArrowUpRight size={16} />
                    </div>
                    <button className="text-ghost hover:text-white transition-colors">
                        <Bookmark size={20} />
                    </button>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-10">
            <div className="bg-void-100 border border-white/10 rounded-3xl p-8 bg-black/40">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                <Newspaper size={16} className="text-neon-blue" /> Taxonomy
              </h3>
              <div className="space-y-4">
                {['Strategic Capital', 'Neural Engineering', 'Financial Modeling', 'Governance Protocols', 'Security Enclaves'].map(cat => (
                  <button key={cat} className="w-full text-left text-sm text-ghost-light hover:text-neon-blue transition-all flex items-center gap-3 group">
                    <Hash size={14} className="text-ghost group-hover:text-neon-blue transition-colors" />
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-neon-gold/5 border border-neon-gold/20 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bookmark size={60} className="text-neon-gold" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 relative z-10">Intel Dispatch</h3>
              <p className="text-xs text-ghost-light leading-relaxed mb-8 relative z-10 font-light">Join 4,000+ executives receiving weekly briefings on structural capital direct to their uplink. Zero noise.</p>
              <form className="space-y-3 relative z-10">
                  <input type="email" placeholder="executive@uplink.io" className="w-full bg-void-200 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-gold transition-all" />
                  <button className="w-full bg-neon-gold text-black font-black py-4 rounded-xl text-[10px] tracking-widest uppercase hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all">ESTABLISH UPLINK</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogHub;
