import React from 'react';
import { PageView } from '../types.ts';
import { ShoppingBag, Download, Key, ExternalLink, Search } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

interface BuyerDashboardProps {
  onNavigate: (page: PageView) => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate }) => {
  const purchases = [
    { id: '1', title: 'Enterprise Legal Bot', type: 'Agent', date: '2024-11-20', status: 'Active', delivery: 'API Key' },
    { id: '2', title: 'Financial Sentiment Dataset', type: 'Dataset', date: '2024-11-18', status: 'Downloaded', delivery: 'Download' },
    { id: '3', title: 'SEO Strategy Workflow', type: 'Workflow', date: '2024-11-15', status: 'Active', delivery: 'API Key' },
  ];

  return (
    <div className="p-8 min-h-screen bg-void animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">My Library</h1>
            <p className="text-ghost font-mono text-xs uppercase tracking-widest">Active assets and structural capital</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost" size={16} />
            <input placeholder="Search library..." className="bg-void-200 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan" />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {purchases.map((item) => (
            <div key={item.id} className="bg-void-100 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-void-300 rounded-lg flex items-center justify-center text-neon-cyan border border-white/5">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="gray">{item.type}</Badge>
                    <span className="text-[10px] text-ghost font-mono uppercase mt-1">Acquired: {item.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {item.delivery === 'API Key' ? (
                  <button className="flex-1 md:flex-none btn-secondary flex items-center justify-center gap-2 text-xs py-2">
                    <Key size={14} /> Reveal Key
                  </button>
                ) : (
                  <button className="flex-1 md:flex-none btn-secondary flex items-center justify-center gap-2 text-xs py-2">
                    <Download size={14} /> Download Files
                  </button>
                )}
                <button className="p-2 text-ghost hover:text-white transition-colors">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;