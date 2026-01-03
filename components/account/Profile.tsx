
import React, { useState } from 'react';
import { User, Camera, Mail, Shield, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('Senior Architect specializing in high-frequency trading agents.');

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateUser({ name });
      setIsLoading(false);
      showToast("Identity protocol updated successfully.", "success");
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
       <div className="flex justify-between items-end pb-6 border-b border-white/5">
          <div>
             <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Neural Identity</h2>
             <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">Public-facing node configuration</p>
          </div>
       </div>

       <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col items-center gap-4">
             <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-neon-purple to-neon-blue p-1 relative group cursor-pointer">
                <div className="w-full h-full bg-black rounded-[1.8rem] flex items-center justify-center text-4xl font-bold text-white overflow-hidden relative">
                   {user.name.charAt(0)}
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={24} />
                   </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-void border border-white/10 p-2 rounded-xl text-neon-green">
                   <Shield size={16} fill="currentColor" />
                </div>
             </div>
             <p className="text-[10px] text-ghost font-mono uppercase tracking-widest">Node_ID: {user.id}</p>
          </div>

          <div className="flex-1 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Designation (Name)</label>
                   <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost" size={16} />
                      <input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-void-200 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:border-neon-cyan outline-none transition-all font-mono"
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Uplink Address (Email)</label>
                   <div className="relative opacity-50 cursor-not-allowed">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost" size={16} />
                      <input 
                        value={user.email} 
                        disabled
                        className="w-full bg-void-200 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white font-mono"
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Operational Brief (Bio)</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-void-200 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-neon-cyan outline-none transition-all resize-none leading-relaxed font-light"
                />
             </div>

             <div className="pt-4 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-white text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neon-cyan transition-all flex items-center gap-3 shadow-lg"
                >
                   {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                   Update Identity
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Profile;
