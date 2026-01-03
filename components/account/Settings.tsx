
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Shield, Bell, Eye, Lock } from 'lucide-react';

const Settings: React.FC = () => {
  const [toggles, setToggles] = useState({
    twoFactor: true,
    emailAlerts: true,
    publicProfile: false,
    marketing: false
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
       <div className="flex justify-between items-end pb-6 border-b border-white/5">
          <div>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">System Config</h2>
             <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">Security & Privacy Protocols</p>
          </div>
       </div>

       <div className="grid grid-cols-1 gap-6">
          <SettingItem 
            title="Two-Factor Authentication" 
            desc="Require biometric or authenticator token for node access."
            icon={Shield}
            active={toggles.twoFactor}
            onToggle={() => toggle('twoFactor')}
          />
          <SettingItem 
            title="Public Node Visibility" 
            desc="Allow your profile and inventory to be indexed by the network."
            icon={Eye}
            active={toggles.publicProfile}
            onToggle={() => toggle('publicProfile')}
          />
          <SettingItem 
            title="Critical Alerts" 
            desc="Receive email notifications for security events and sales."
            icon={Bell}
            active={toggles.emailAlerts}
            onToggle={() => toggle('emailAlerts')}
          />
          <SettingItem 
            title="Intel Dispatch" 
            desc="Subscribe to weekly structural capital briefings."
            icon={Lock}
            active={toggles.marketing}
            onToggle={() => toggle('marketing')}
          />
       </div>
       
       <div className="p-6 bg-neon-red/5 border border-neon-red/20 rounded-2xl flex items-center justify-between">
          <div>
             <h4 className="text-sm font-bold text-neon-red mb-1">Danger Zone</h4>
             <p className="text-xs text-ghost">Irreversible termination of node and assets.</p>
          </div>
          <button className="px-6 py-3 border border-neon-red/30 text-neon-red hover:bg-neon-red hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
             Delete Account
          </button>
       </div>
    </div>
  );
};

const SettingItem = ({ title, desc, icon: Icon, active, onToggle }: any) => (
  <div className="concrete-card p-6 rounded-2xl flex items-center justify-between border-white/5 bg-black/20 hover:border-white/10 transition-all">
     <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${active ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-void-300 text-ghost'}`}>
           <Icon size={20} />
        </div>
        <div>
           <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
           <p className="text-xs text-ghost font-light">{desc}</p>
        </div>
     </div>
     <button onClick={onToggle} className={`transition-colors ${active ? 'text-neon-cyan' : 'text-ghost'}`}>
        {active ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
     </button>
  </div>
);

export default Settings;
