
import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Info, Clock } from 'lucide-react';

const Notifications: React.FC = () => {
  const notifications = [
    { id: 1, type: 'success', title: 'Asset Acquisition Confirmed', desc: 'SaaS Valuation Model v4 was successfully added to your enclave.', time: '2 hours ago' },
    { id: 2, type: 'alert', title: 'New Device Detected', desc: 'Login attempt from IP 192.168.1.42 (London, UK).', time: '1 day ago' },
    { id: 3, type: 'info', title: 'System Update v2.5', desc: 'The Forge has been upgraded with new logic audit capabilities.', time: '3 days ago' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle size={18} className="text-neon-green" />;
      case 'alert': return <ShieldAlert size={18} className="text-neon-red" />;
      case 'info': return <Info size={18} className="text-neon-blue" />;
      default: return <Bell size={18} className="text-ghost" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-end pb-6 border-b border-white/5">
          <div>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">System Logs</h2>
             <p className="text-ghost font-mono text-[10px] uppercase tracking-widest mt-1">Alerts & Event Stream</p>
          </div>
          <button className="text-[10px] font-mono text-ghost hover:text-white uppercase tracking-widest">Mark All Read</button>
       </div>

       <div className="space-y-4">
          {notifications.map((notif) => (
             <div key={notif.id} className="concrete-card p-6 rounded-2xl flex gap-6 hover:bg-white/[0.02] transition-colors group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-void-300 border border-white/5 group-hover:border-white/10`}>
                   {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                      <span className="text-[10px] font-mono text-ghost flex items-center gap-1">
                         <Clock size={10} /> {notif.time}
                      </span>
                   </div>
                   <p className="text-xs text-ghost-light leading-relaxed font-light">{notif.desc}</p>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Notifications;
