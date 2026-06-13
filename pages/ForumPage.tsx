
import React from 'react';
import { MessageSquare, Users, TrendingUp, Search, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { PageView } from '../types.ts';

const threads = [
  { id: 1, title: 'Optimizing Token Efficiency for Finance Agents', author: 'LogicMaster', replies: 42, views: '1.2k', lastActive: '2m ago', tags: ['Engineering'] },
  { id: 2, title: 'SaaS Valuation Multiples for Q4 2024', author: 'MarketAnalyst', replies: 128, views: '5.4k', lastActive: '15m ago', tags: ['Finance'] },
  { id: 3, title: 'Discussion: Standardizing Logic Map Schemas', author: 'AriMiyanji', replies: 89, views: '3.1k', lastActive: '1h ago', tags: ['Governance'] },
];

const ForumPage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredThreads = threads.filter(thread => 
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  return (
    <div className="p-8 min-h-screen bg-void animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Architect Network</h1>
            <p className="text-ghost font-mono text-xs uppercase tracking-[0.3em]">Collaborative Engineering & Strategy</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-xs py-3">
             <MessageCircle size={14} /> NEW TRANSMISSION
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar */}
           <div className="space-y-6">
             <div className="bg-void-100 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-6">
                  <TrendingUp size={14} className="text-neon-cyan" /> Trending
                </div>
                <div className="space-y-4">
                  {['#ValuationModels', '#AuditProcedures', '#LegalAI', '#NowPayments'].map(tag => (
                    <a key={tag} href="#" className="block text-sm text-ghost hover:text-neon-cyan transition-colors">{tag}</a>
                  ))}
                </div>
             </div>
             
             <div className="bg-void-100 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mb-6">
                  <Users size={14} className="text-neon-cyan" /> Active Nodes
                </div>
                <div className="flex -space-x-2">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-void bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">M{i}</div>
                   ))}
                   <div className="w-8 h-8 rounded-full border-2 border-void bg-void-300 flex items-center justify-center text-[8px] font-mono text-ghost">+142</div>
                </div>
             </div>
           </div>

           {/* Thread List */}
           <div className="lg:col-span-3 space-y-4">
             <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" size={16} />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..." 
                  className="w-full bg-void-200 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-sm text-white focus:outline-none focus:border-neon-cyan" />
             </div>

             <div className="bg-void-100 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left font-mono text-[11px]">
                      <thead className="bg-void-300 text-ghost uppercase tracking-widest border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4">Discussion Thread</th>
                          <th className="px-6 py-4 text-center">Replies</th>
                          <th className="px-6 py-4 text-center">Engagement</th>
                          <th className="px-6 py-4 text-right">Last Signal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredThreads.map(thread => (
                          <tr key={thread.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                            <td className="px-6 py-6">
                               <div className="flex flex-col gap-2">
                                 <span className="text-sm font-sans font-bold text-white group-hover:text-neon-cyan transition-colors">{thread.title}</span>
                                 <div className="flex gap-3 items-center">
                                    <Badge variant="gray">{thread.tags[0]}</Badge>
                                    <span className="text-[9px] text-ghost uppercase">By {thread.author}</span>
                                 </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center text-ghost-light font-bold">{thread.replies}</td>
                            <td className="px-6 py-4 text-center text-ghost-light">{thread.views}</td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex flex-col">
                                 <span className="text-white">{thread.lastActive}</span>
                                 <span className="text-[8px] text-ghost opacity-40">AUTO_CLEANUP_90D</span>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
             
             <div className="flex justify-center py-6">
                <button className="text-[10px] font-mono text-ghost hover:text-white uppercase tracking-widest flex items-center gap-2">
                  [ LOAD_MORE_THREADS ] <ArrowRight size={10} />
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
