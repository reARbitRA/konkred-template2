import React, { useState, useEffect } from 'react';
import Logo3D from './Logo3D.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Search, LogIn, User as UserIcon, LayoutDashboard, 
  Database, Wallet, LogOut, Terminal, Cpu, Hammer, Home, ChevronRight, Activity, Shield 
} from 'lucide-react';
import { PageView, User } from '../types.ts';

interface NavbarProps {
  onNavigate: (page: PageView) => void;
  currentPage: PageView;
  user: User | null;
  onLogout: () => Promise<void>;
  onOpenCmd?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  currentPage, 
  user, 
  onLogout,
  onOpenCmd 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicNavItems = [
    { label: 'Browse Tools', page: 'marketplace' as PageView },
    { label: 'Services', page: 'advisory' as PageView },
    { label: 'Intel Blog', page: 'intel' as PageView },
    { label: 'Knowledge Hub', page: 'academy' as PageView },
  ];

  const dashboardNavItems = [
    { label: 'Playgrounds', page: 'playgrounds' as PageView },
    { label: 'Intel Report', page: 'intel_report' as PageView },
    { label: 'The Forge', page: 'forge' as PageView },
    { label: 'Network', page: 'network' as PageView },
  ];

  const getPageTitle = (page: PageView) => {
    switch (page) {
      case 'landing': return 'BASE SYSTEM';
      case 'marketplace': return 'PROTOCOLS';
      case 'playgrounds': return 'PLAYGROUNDS';
      case 'intel_report': return 'INTEL REPORT';
      case 'forge_audit':
      case 'forge': return 'THE FORGE';
      case 'wallet': return 'NODE LEDGER';
      case 'usage': return 'ENCLAVE LIBRARY';
      case 'seller_dashboard': return 'CONTROLLER';
      case 'account': return 'SECURITY PROFILE';
      case 'dispute': return 'ARBITRATION';
      case 'admin': return 'SYSTEM ADMIN';
      default: return 'CONSOLE';
    }
  };

  return (
    <>
      {/* Sleek Accent Indicator Top Line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-emerald-400 to-purple-500 z-50 pointer-events-none" />

      {/* Primary Sticky Header */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full select-none ${
          isScrolled 
            ? 'py-3 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 shadow-[0_8px_32px_rgba(0,0,0,0.6)]' 
            : 'py-5 bg-zinc-950/40 backdrop-blur-sm border-b border-zinc-900/40'
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo & Platform ID */}
          <div 
            className="flex items-center gap-3 cursor-pointer group pr-4 shrink-0" 
            onClick={() => onNavigate('landing')}
          >
            <div className="transition-all duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Logo3D size={28} />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-black tracking-[0.25em] text-white uppercase sm:text-sm">KONKRED</span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block" />
              </div>
              <p className="text-[8px] text-zinc-500 font-mono tracking-wider -mt-0.5 uppercase">SYSTEM_NODE://PRE_ALPHA</p>
            </div>
          </div>

          {/* Active Module Indicator (Only shown on mobile/tablet when Logged In) */}
          {user && (
            <div className="lg:hidden flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-805 py-0.5 px-2.5 rounded-md">
              <span className="w-1.5 h-1.5 bg-emerald-450 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                {getPageTitle(currentPage)}
              </span>
            </div>
          )}

          {/* Search Trigger Input (Desktop) - Responsive space-saving bar */}
          {!user && onOpenCmd && (
            <div 
              onClick={onOpenCmd}
              className="hidden lg:flex items-center gap-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-750 rounded-lg px-3 py-1.5 select-none cursor-pointer transition-all duration-200 w-44 xl:w-52 text-left ml-4"
            >
              <Search size={11} className="text-zinc-500 shrink-0" />
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider truncate">SEARCH CORE...</span>
              <span className="text-[8px] px-1 bg-zinc-900 border border-zinc-800 rounded font-mono text-zinc-650 ml-auto select-none shrink-0">⌘K</span>
            </div>
          )}

          {/* Private Public Menu Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 ml-auto px-6">
            {(user ? dashboardNavItems : publicNavItems).map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.page)}
                  className="relative text-[10px] font-mono uppercase tracking-widest py-1.5 text-zinc-450 hover:text-white font-bold transition-all duration-200 group/link"
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover/link:text-white transition-colors'}>
                    {item.label}
                  </span>
                  {isActive ? (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-cyan-400" 
                      layoutId="activeNavIndicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-zinc-500 transition-all duration-300 group-hover/link:w-full group-hover/link:left-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action CTAs (Desktop / Tablet) */}
          <div className="hidden md:flex items-center gap-4 ml-4 shrink-0">
            {!user ? (
              <>
                <button
                  onClick={() => onNavigate('enter')}
                  className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 hover:text-white py-2 px-3 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('join_network')}
                  className="relative overflow-hidden px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black text-[10px] font-mono tracking-widest font-black rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                  JOIN_NETWORK
                </button>
              </>
            ) : (
              /* Compact dashboard user badge */
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 py-1 px-3 rounded-lg">
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">{user.name}</span>
                    <span className="text-[9px] font-mono text-emerald-400 font-semibold">${user.balance.fiat.toLocaleString()}</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 p-[1px] cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => onNavigate('account')}
                  >
                    <div className="w-full h-full bg-zinc-950 rounded-[5px] flex items-center justify-center font-bold text-white text-[9px]">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Terminate Session"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Responsive Hamburger Toggle - ONLY show below md/lg viewports */}
          <button 
            className="md:hidden p-2 border border-zinc-850 hover:border-zinc-750 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-all focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={15} /> : <Menu size={15} />}
          </button>

        </div>
      </motion.nav>

      {/* Slide Navigation Drawer Menu (Mobile/Tablet viewports) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Layer */}
            <motion.div 
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sliding Drawer Body Container */}
            <motion.div 
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-zinc-950 border-l border-zinc-900 z-50 flex flex-col shadow-2xl p-6 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              {/* Drawer Content */}
              <div className="flex items-center justify-between pb-6 border-b border-zinc-900 mt-2">
                <div className="flex items-center gap-3">
                  <Logo3D size={26} />
                  <span className="text-sm font-mono font-black tracking-widest text-white">KONKRED</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 border border-zinc-855 rounded-lg bg-zinc-900 hover:bg-zinc-850 transition-all text-zinc-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* User Node Info inside Mobile Drawer */}
              {user && (
                <div className="p-4 bg-zinc-900/40 border border-zinc-905 rounded-xl my-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 p-[1px]">
                      <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center font-bold text-white text-[10px]">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xs truncate w-40">{user.name}</h4>
                      <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">{user.tier.toUpperCase()} NODE_OPERATOR</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900 text-[10px] font-mono">
                    <div className="bg-black/60 p-2 rounded-lg border border-zinc-900">
                      <span className="text-zinc-500 block text-[7px] uppercase tracking-wider mb-0.5">LIQUID</span>
                      <span className="text-emerald-400 font-bold">${user.balance.fiat.toLocaleString()}</span>
                    </div>
                    <div className="bg-black/60 p-2 rounded-lg border border-zinc-900">
                      <span className="text-zinc-500 block text-[7px] uppercase tracking-wider mb-0.5">LEDGER</span>
                      <span className="text-white font-bold">{user.balance.crypto.toFixed(3)} ETH</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Mobile Menu items */}
              <div className="flex-1 py-4 space-y-1">
                {!user ? (
                  <div className="space-y-1.5 label text-left">
                    <span className="text-[8px] font-mono uppercase text-zinc-550 tracking-[0.25em] block pl-3 mb-2 font-bold">DIRECTORY NODE</span>
                    {publicNavItems.map((item) => (
                      <DrawerLink 
                        key={item.page}
                        icon={Terminal}
                        label={item.label} 
                        onClick={() => { onNavigate(item.page); setIsOpen(false); }}
                        active={currentPage === item.page} 
                      />
                    ))}
                    <DrawerLink 
                      icon={Cpu}
                      label="Custom Consulting" 
                      onClick={() => { onNavigate('advisory'); setIsOpen(false); }}
                      active={currentPage === 'advisory'} 
                    />
                  </div>
                ) : (
                  <div className="space-y-5 text-left">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono uppercase text-zinc-550 tracking-[0.25em] block pl-3 mb-1 font-bold">OPERATIONAL DIRECTORY</span>
                      <DrawerLink icon={Home} label="Base System Home" onClick={() => { onNavigate('landing'); setIsOpen(false); }} active={currentPage === 'landing'} />
                      <DrawerLink icon={Terminal} label="Playgrounds Shell" onClick={() => { onNavigate('playgrounds'); setIsOpen(false); }} active={currentPage === 'playgrounds'} />
                      <DrawerLink icon={Cpu} label="System Intel Analytics" onClick={() => { onNavigate('intel_report'); setIsOpen(false); }} active={currentPage === 'intel_report'} />
                      <DrawerLink icon={Hammer} label="The Forge Compiler" onClick={() => { onNavigate('forge'); setIsOpen(false); }} active={currentPage === 'forge'} />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-mono uppercase text-zinc-550 tracking-[0.25em] block pl-3 mb-1 font-bold">LEDGER DIRECTORY</span>
                      <DrawerLink icon={LayoutDashboard} label="Network Controller" onClick={() => { onNavigate('seller_dashboard'); setIsOpen(false); }} active={currentPage === 'seller_dashboard'} />
                      <DrawerLink icon={Database} label="Purchased Enclave Modules" onClick={() => { onNavigate('usage'); setIsOpen(false); }} active={currentPage === 'usage'} />
                      <DrawerLink icon={Wallet} label="Node Wallet Liquidity" onClick={() => { onNavigate('wallet'); setIsOpen(false); }} active={currentPage === 'wallet'} />
                      <DrawerLink icon={UserIcon} label="Identity Profile Keys" onClick={() => { onNavigate('account'); setIsOpen(false); }} active={currentPage === 'account'} />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-6 border-t border-zinc-900 space-y-3">
                {!user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { onNavigate('enter'); setIsOpen(false); }}
                      className="py-2.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-850 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest text-[#fafafa] transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { onNavigate('join_network'); setIsOpen(false); }}
                      className="py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-black rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all"
                    >
                      Join Up
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={async () => { await onLogout(); setIsOpen(false); }}
                    className="w-full py-2.5 bg-red-950/20 hover:bg-red-900 border border-red-900/30 hover:border-red-600 text-red-400 hover:text-black font-bold text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                    TERMINATE_SESSION
                  </button>
                )}
                <div className="text-[8px] font-mono text-zinc-600 text-center uppercase tracking-widest pt-1">
                  NODE NETWORK STATUS // ACTIVE v4.9.4
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

interface DrawerLinkProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active: boolean;
}

const DrawerLink: React.FC<DrawerLinkProps> = ({ icon: Icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all font-mono group text-left ${
      active 
        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <Icon size={12} className={active ? 'text-cyan-455 animate-pulse' : 'text-zinc-550 group-hover:text-zinc-350 transition-colors'} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <ChevronRight size={10} className={`text-zinc-650 transition-transform ${active ? 'translate-x-0.5 text-cyan-400' : 'group-hover:translate-x-1 text-zinc-500'}`} />
  </button>
);

export default Navbar;
