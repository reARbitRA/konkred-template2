
import React, { useRef, useEffect } from 'react';
import { User } from '../../types.ts';
import { LogOut, User as UserIcon, Settings, CreditCard, Shield, LayoutDashboard, Database } from 'lucide-react';
import Badge from '../common/Badge.tsx';

interface UserMenuProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: any) => void;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, isOpen, onClose, onNavigate, onLogout }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
        ref={menuRef}
        className="absolute bottom-20 left-0 w-72 concrete-card bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200"
    >
        {/* User Header */}
        <div className="p-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple p-[1px]">
                    <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center text-white font-bold uppercase text-sm">
                        {user.name.substring(0, 2)}
                    </div>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm truncate w-32">{user.name}</h4>
                    <span className="text-[9px] text-ghost font-mono uppercase tracking-widest">ID: {user.id}</span>
                </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono bg-black/40 rounded-lg p-2 border border-white/5">
                <span className="text-ghost uppercase">Balance</span>
                <span className="text-neon-green font-bold">${user.balance.fiat.toLocaleString()}</span>
            </div>
        </div>

        {/* Navigation Grid */}
        <div className="p-2 space-y-1">
            <MenuButton icon={LayoutDashboard} label="Dashboard" onClick={() => { onNavigate('seller_dashboard'); onClose(); }} />
            <MenuButton icon={Database} label="My Library" onClick={() => { onNavigate('usage'); onClose(); }} />
            <MenuButton icon={CreditCard} label="Wallet & Payouts" onClick={() => { onNavigate('wallet'); onClose(); }} />
            <MenuButton icon={UserIcon} label="Identity Profile" onClick={() => { onNavigate('account'); onClose(); }} />
            <MenuButton icon={Settings} label="System Config" onClick={() => { onNavigate('account'); onClose(); }} />
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-white/5 mt-1">
            <button 
                onClick={() => { onLogout(); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono text-neon-red hover:bg-neon-red/10 transition-all uppercase tracking-widest group"
            >
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                Terminate Session
            </button>
        </div>
    </div>
  );
};

const MenuButton = ({ icon: Icon, label, onClick }: any) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-ghost-light hover:text-white hover:bg-white/5 transition-all group"
    >
        <Icon size={14} className="text-ghost group-hover:text-neon-cyan transition-colors" />
        <span className="font-medium tracking-wide">{label}</span>
    </button>
);

export default UserMenu;
