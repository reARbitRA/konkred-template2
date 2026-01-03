
import React from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const Purchases: React.FC = () => {
  const purchases = [
    { id: 'PUR-9921', asset: 'Legal Contract Analyzer', price: '$149.00', date: 'Oct 24, 2024', license: 'Enterprise', status: 'Active' },
    { id: 'PUR-9922', asset: 'SaaS Valuation Model', price: '$249.00', date: 'Oct 28, 2024', license: 'Personal', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
       <div className="concrete-card rounded-2xl overflow-hidden bg-black/20 border-white/5">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
             <h3 className="text-sm font-bold text-white uppercase tracking-widest">Transaction History</h3>
             <Badge variant="gray">Lifetime Spend: $398.00</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-void-300 text-ghost uppercase tracking-widest">
                    <tr>
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">License</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {purchases.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4">
                            <div className="font-bold text-white">{p.asset}</div>
                            <div className="text-[9px] text-ghost">{p.id}</div>
                        </td>
                        <td className="px-6 py-4"><Badge variant="cyan" size="sm">{p.license}</Badge></td>
                        <td className="px-6 py-4 text-ghost flex items-center gap-2">
                            <Calendar size={12} /> {p.date}
                        </td>
                        <td className="px-6 py-4 font-bold text-white">{p.price}</td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-ghost hover:text-white transition-colors" title="Download Invoice">
                                <FileText size={14} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-ghost hover:text-white transition-colors" title="Re-Download Asset">
                                <Download size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
          </div>
       </div>
    </div>
  );
};

export default Purchases;
