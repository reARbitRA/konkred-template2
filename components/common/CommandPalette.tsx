
import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, LayoutDashboard, ShoppingBag, Shield, LogOut, Settings, CreditCard, Home, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useNavigate } from '../../hooks/useNavigate'; // Assuming this hook exists or we use prop drilling. Let's assume prop drilling via App context/props isn't easy here, so I'll pass a navigator prop if possible, or dispatch custom events. 
// Actually, standard pattern in this codebase seems to be `onNavigate` props. But CommandPalette is global. 
// I will dispatch a custom event that App.tsx can listen to, or assume it's rendered inside App and receives the prop.

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: any) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { logout } = useAuth();

  const commands = [
    { id: 'marketplace', label: 'Go to Marketplace', icon: ShoppingBag, group: 'Navigation', action: () => onNavigate('marketplace') },
    { id: 'forge', label: 'Open The Forge', icon: Shield, group: 'Navigation', action: () => onNavigate('forge_audit') },
    { id: 'dashboard', label: 'Seller Dashboard', icon: LayoutDashboard, group: 'Navigation', action: () => onNavigate('seller_dashboard') },
    { id: 'wallet', label: 'Wallet & Liquidity', icon: CreditCard, group: 'Navigation', action: () => onNavigate('wallet') },
    { id: 'settings', label: 'System Settings', icon: Settings, group: 'General', action: () => onNavigate('account') },
    { id: 'docs', label: 'Documentation', icon: FileText, group: 'Resources', action: () => onNavigate('documentation') },
    { id: 'home', label: 'Return to Base', icon: Home, group: 'Navigation', action: () => onNavigate('landing') },
    { id: 'logout', label: 'Terminate Session', icon: LogOut, group: 'System', action: () => { logout(); onNavigate('landing'); } },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) || 
    cmd.group.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filteredCommands[selectedIndex];
        if (cmd) {
          cmd.action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 concrete-card">
        <div className="p-4 border-b border-white/10 flex items-center gap-4">
          <Search className="text-ghost" size={20} />
          <input 
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a command or search..." 
            className="flex-1 bg-transparent text-lg text-white placeholder-ghost/50 outline-none font-sans"
          />
          <div className="px-2 py-1 rounded bg-white/10 text-[10px] font-mono text-ghost font-bold border border-white/5">ESC</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-ghost text-sm font-mono">No matching protocols found.</div>
          ) : (
            filteredCommands.map((cmd, i) => (
              <div 
                key={cmd.id}
                onClick={() => { cmd.action(); onClose(); }}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`px-4 py-3 mx-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                  i === selectedIndex ? 'bg-neon-cyan/10 text-white' : 'text-ghost-light hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${i === selectedIndex ? 'text-neon-cyan' : 'text-ghost'}`}>
                    <cmd.icon size={18} />
                  </div>
                  <span className="text-sm font-medium">{cmd.label}</span>
                </div>
                {i === selectedIndex && <ArrowRight size={14} className="text-neon-cyan animate-in slide-in-from-left-2" />}
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[10px] text-ghost font-mono uppercase tracking-widest">
           <span>Konkred OS v4.2</span>
           <div className="flex gap-4">
              <span>Navigate <b className="text-white">↑↓</b></span>
              <span>Select <b className="text-white">↵</b></span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
