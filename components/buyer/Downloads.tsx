
import React from 'react';
import { FileJson, FileText, Download, Clock, ShieldCheck, Box, ExternalLink, Key } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const Downloads: React.FC = () => {
  const downloads = [
    {
      id: 'DL-842',
      title: 'SaaS Valuation Model v4.2',
      type: 'XLSX Logic Map',
      size: '2.4 MB',
      version: '4.2.0',
      date: 'Oct 24, 2024',
      status: 'Ready',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'DL-845',
      title: 'GDPR Audit Core Protocol',
      type: 'JSON Schema',
      size: '48 KB',
      version: '1.1.2',
      date: 'Oct 28, 2024',
      status: 'Ready',
      icon: FileJson,
      color: 'purple'
    },
    {
      id: 'DL-901',
      title: 'Medical Intent API Key',
      type: 'Access Token',
      size: 'N/A',
      version: 'Live',
      date: 'Nov 02, 2024',
      status: 'Active',
      icon: Key,
      color: 'cyan'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-end pb-6 border-b border-white/5">
          <div>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Digital Vault</h2>
             <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">Secure local storage for acquired assets</p>
          </div>
          <div className="flex gap-2">
             <Badge variant="green">Encryption: AES-256</Badge>
          </div>
       </div>

       <div className="grid grid-cols-1 gap-4">
          {downloads.map((item) => (
             <div key={item.id} className="concrete-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all group bg-black/40">
                <div className="flex items-center gap-6 w-full md:w-auto">
                   <div className={`w-14 h-14 bg-neon-${item.color}/10 rounded-xl flex items-center justify-center text-neon-${item.color} border border-neon-${item.color}/20 group-hover:scale-110 transition-transform`}>
                      <item.icon size={24} />
                   </div>
                   <div>
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors">{item.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-ghost uppercase">
                         <span className="bg-white/5 px-2 py-0.5 rounded">{item.type}</span>
                         <span>v{item.version}</span>
                         <span>{item.size}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                   <div className="text-right hidden md:block">
                      <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-1">Acquired</div>
                      <div className="text-xs text-white font-bold">{item.date}</div>
                   </div>
                   
                   <div className="flex gap-3">
                      {item.icon === Key ? (
                         <button className="flex items-center gap-2 px-5 py-3 bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            <Key size={14} /> Reveal
                         </button>
                      ) : (
                         <button className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-neon-cyan rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-neon-cyan/20">
                            <Download size={14} /> Download
                         </button>
                      )}
                      <button className="p-3 bg-white/5 rounded-xl text-ghost hover:text-white transition-colors border border-white/5 hover:border-white/20">
                         <ExternalLink size={16} />
                      </button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Downloads;
