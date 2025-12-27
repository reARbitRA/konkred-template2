import React from 'react';
import { User, PageView } from '../types.ts';
import { User as UserIcon, Shield, Bell, CreditCard, Lock } from 'lucide-react';

interface AccountPageProps {
  user: User | null;
  onNavigate: (page: PageView) => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, onNavigate }) => {
  if (!user) return null;

  return (
    <div className="p-8 min-h-screen bg-void animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-2xl font-display font-bold text-white mb-2">Account Settings</h1>
          <p className="text-ghost font-mono text-xs uppercase tracking-widest">Global preferences and authentication</p>
        </header>

        {/* Profile Section */}
        <section className="bg-void-100 border border-white/10 rounded-xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white text-3xl font-bold">
              {user.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-ghost text-sm">{user.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-neon-cyan font-mono border border-neon-cyan/20">ROLE: {user.role.toUpperCase()}</span>
                {user.verified && <span className="px-2 py-0.5 rounded bg-neon-green/10 text-[10px] text-neon-green font-mono border border-neon-green/20">VERIFIED</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-ghost uppercase tracking-widest">Display Name</label>
              <input value={user.name} className="w-full bg-void-200 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-neon-cyan outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-ghost uppercase tracking-widest">Email Address</label>
              <input value={user.email} disabled className="w-full bg-void-200 border border-white/5 rounded-lg p-3 text-sm text-ghost-light cursor-not-allowed" />
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-void-100 border border-white/10 p-6 rounded-xl text-left hover:border-neon-cyan/50 transition-all group">
            <Shield size={24} className="text-ghost group-hover:text-neon-cyan mb-4" />
            <h3 className="text-white font-bold mb-1">Security</h3>
            <p className="text-xs text-ghost">2FA, Keys, and Auth sessions</p>
          </button>
          <button className="bg-void-100 border border-white/10 p-6 rounded-xl text-left hover:border-neon-cyan/50 transition-all group">
            <CreditCard size={24} className="text-ghost group-hover:text-neon-cyan mb-4" />
            <h3 className="text-white font-bold mb-1">Billing</h3>
            <p className="text-xs text-ghost">Invoices and payment methods</p>
          </button>
          <button className="bg-void-100 border border-white/10 p-6 rounded-xl text-left hover:border-neon-cyan/50 transition-all group">
            <Bell size={24} className="text-ghost group-hover:text-neon-cyan mb-4" />
            <h3 className="text-white font-bold mb-1">Notifications</h3>
            <p className="text-xs text-ghost">System alerts and alerts</p>
          </button>
        </div>

        <button className="btn-primary px-8">Save Global Changes</button>
      </div>
    </div>
  );
};

export default AccountPage;