import React, { useState, useEffect } from 'react';
import Logo3D from './Logo3D.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Search, User as UserIcon, 
  LogOut, Terminal, Cpu, Hammer, Home, ChevronRight, Shield, ShieldCheck, Package 
} from 'lucide-react';
import { PageView, User } from '../types.ts';
import { getPathForPage } from '../utils/routes.ts';

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
    { label: 'Catalogue', page: 'catalogue' as PageView },
    { label: 'Pricing', page: 'pricing' as PageView },
    { label: 'Audit', page: 'forge_audit' as PageView },
    { label: 'fullKONK_>', page: 'fullkonk' as PageView },
    { label: 'Advisory', page: 'advisory' as PageView },
    { label: 'Intel', page: 'intel' as PageView },
    { label: 'Academy', page: 'academy' as PageView },
  ];

  const getPageTitle = (page: PageView) => {
    switch (page) {
      case 'landing': return 'BASE SYSTEM';
      case 'catalogue': return 'PRODUCT CATALOGUE';
      case 'suite_detail': return 'SUITE';
      case 'workflow_detail': return 'WORKFLOW TOOL';
      case 'kit_detail': return 'WORKFLOW KIT';
      case 'pricing': return 'PRICING';
      case 'validation': return 'VALIDATION';
      case 'sprint': return 'VALIDATION SPRINT';
      case 'enterprise': return 'ENTERPRISE';
      case 'partners': return 'PARTNERS';
      case 'forge_audit': return 'AUDITOR';
      case 'fullkonk': return 'fullKONK_>';
      case 'redaeye': return 'REDAEYE';
      case 'account': return 'ACCOUNT';
      case 'not_found': return '404';
      default: return 'CONSOLE';
    }
  };

  const handleNav = (page: PageView) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Solid Caution Accent Top Line */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-signal z-50 pointer-events-none" />

      {/* Primary Sticky Header */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-150 w-full select-none ${
          isScrolled 
            ? 'py-3 bg-void-100 border-b-4 border-black shadow-brutalist' 
            : 'py-4 bg-void-100 border-b-4 border-black'
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo & Platform ID */}
          <a 
            href={getPathForPage('landing')}
            className="flex items-center gap-3 cursor-pointer group pr-4 shrink-0" 
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                handleNav('landing');
              }
            }}
          >
            <div className="transition-all duration-150 group-hover:scale-105">
              <Logo3D size={28} />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-black tracking-[0.25em] text-white uppercase sm:text-sm">KONKRED</span>
                <span className="h-1.5 w-1.5 rounded-none bg-signal animate-pulse hidden sm:inline-block" />
              </div>
              <p className="text-[8px] text-void-600 font-mono tracking-wider -mt-0.5 uppercase">AI WORKFLOW PLATFORM</p>
            </div>
          </a>

          {/* Active Module Indicator (Only shown on mobile/tablet) */}
          {user && (
            <div className="lg:hidden flex items-center gap-1.5 bg-black border-2 border-black py-0.5 px-2.5 rounded-none">
              <span className="w-1.5 h-1.5 bg-signal rounded-none animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white">
                {getPageTitle(currentPage)}
              </span>
            </div>
          )}

          {/* Search Trigger Input (Desktop) */}
          {!user && onOpenCmd && (
            <div 
              onClick={onOpenCmd}
              className="hidden lg:flex items-center gap-2.5 bg-black hover:bg-void-200 border-2 border-black rounded-none px-3 py-1.5 select-none cursor-pointer transition-all duration-150 w-44 xl:w-52 text-left ml-4"
            >
              <Search size={11} className="text-void-550 shrink-0" />
              <span className="text-[9px] font-mono text-void-500 tracking-wider truncate">SEARCH CORE_</span>
              <span className="text-[8px] px-1 bg-void-100 border border-void-300 rounded-none font-mono text-void-600 ml-auto select-none shrink-0 font-bold">⌘K</span>
            </div>
          )}

          {/* Public Menu Links (Desktop) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto px-4">
            {/* REDAEYE Direct Nav Entry */}
            <a
              href={getPathForPage('redaeye')}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  handleNav('redaeye');
                }
              }}
              className={`relative flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest font-black border-2 transition-all duration-200 group/redaeye ${
                currentPage === 'redaeye'
                  ? 'bg-[#FF003C] text-white border-[#FF003C] shadow-[0_0_15px_rgba(255,0,60,0.6)]'
                  : 'bg-black text-[#FF003C] border-[#FF003C]/80 hover:bg-[#FF003C] hover:text-white hover:shadow-[0_0_12px_rgba(255,0,60,0.5)]'
              }`}
            >
              <Shield size={12} className="shrink-0 animate-pulse text-[#FF003C] group-hover/redaeye:text-white" />
              <span>REDAEYE</span>
            </a>

            {publicNavItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <a
                  key={item.label}
                  href={getPathForPage(item.page)}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleNav(item.page);
                    }
                  }}
                  className="relative text-[10px] font-mono uppercase tracking-widest py-1.5 hover:text-signal font-black transition-all duration-150 group/link"
                >
                  <span className={isActive ? 'text-signal font-black underline underline-offset-4 decoration-2' : 'text-void-500 group-hover/link:text-white'}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Action CTAs (Desktop / Tablet) */}
          <div className="hidden md:flex items-center gap-4 ml-4 shrink-0">
            {!user ? (
              <>
                <a
                  href={getPathForPage('enter')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleNav('enter');
                    }
                  }}
                  className="text-[10px] font-mono uppercase tracking-widest font-black text-void-500 hover:text-white py-2 px-3 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href={getPathForPage('join_network')}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                      e.preventDefault();
                      handleNav('join_network');
                    }
                  }}
                  className="relative overflow-hidden px-4 py-2.5 bg-signal text-black text-[10px] font-mono tracking-widest font-black rounded-none border-2 border-black shadow-brutalist hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutalist-hover transition-all"
                >
                  JOIN_WAITLIST_
                </a>
              </>
            ) : (
              /* Compact account badge */
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-black border-2 border-black py-1 px-3 rounded-none">
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">{user.name}</span>
                    <span className="text-[9px] font-mono text-signal font-bold uppercase">{user.tier} TIER</span>
                  </div>
                  <div 
                    className="w-7 h-7 rounded-none bg-signal p-[1px] cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => handleNav('account')}
                  >
                    <div className="w-full h-full bg-void-100 rounded-none flex items-center justify-center font-bold text-white text-[9px] border border-black">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-void-600 hover:text-red-500 hover:bg-black border border-transparent hover:border-black rounded-none transition-all"
                  title="Sign out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Responsive Hamburger Toggle */}
          <button 
            className="md:hidden p-2 border-2 border-black bg-black text-zinc-400 hover:text-white rounded-none transition-all focus:outline-none" 
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
                  aria-label="Close Menu"
                >
                  <X size={14} />
                </button>
              </div>

              {/* User Info inside Mobile Drawer */}
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
                      <p className="text-[8px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">{user.tier.toUpperCase()} ACCOUNT</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Mobile Menu items */}
              <div className="flex-1 py-4 space-y-1">
                <div className="space-y-1.5 label text-left">
                  <span className="text-[8px] font-mono uppercase text-zinc-550 tracking-[0.25em] block pl-3 mb-2 font-bold">PLATFORM</span>
                  <DrawerLink icon={Home} label="Home" onClick={() => handleNav('landing')} active={currentPage === 'landing'} />
                  <DrawerLink icon={Package} label="Product Catalogue" onClick={() => handleNav('catalogue')} active={currentPage === 'catalogue' || currentPage === 'suite_detail' || currentPage === 'workflow_detail' || currentPage === 'kit_detail'} />
                  <DrawerLink icon={ShieldCheck} label="AUDITOR (Neural Audit)" onClick={() => handleNav('forge_audit')} active={currentPage === 'forge_audit'} />
                  <DrawerLink icon={Hammer} label="fullKONK_> Compiler" onClick={() => handleNav('fullkonk')} active={currentPage === 'fullkonk'} />
                  <DrawerLink icon={Shield} label="REDAEYE" onClick={() => handleNav('redaeye')} active={currentPage === 'redaeye'} />
                  <DrawerLink icon={Cpu} label="Advisory" onClick={() => handleNav('advisory')} active={currentPage === 'advisory'} />
                  <DrawerLink icon={Terminal} label="Intel & Academy" onClick={() => handleNav('intel')} active={currentPage === 'intel' || currentPage === 'academy'} />
                  <DrawerLink icon={UserIcon} label="Account" onClick={() => handleNav(user ? 'account' : 'enter')} active={currentPage === 'account'} />
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-6 border-t border-zinc-900 space-y-3">
                {!user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { handleNav('enter'); }}
                      className="py-2.5 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-850 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest text-[#fafafa] transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { handleNav('join_network'); }}
                      className="py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-black rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all"
                    >
                      Join Waitlist
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={async () => { await onLogout(); setIsOpen(false); }}
                    className="w-full py-2.5 bg-red-950/20 hover:bg-red-900 border border-red-900/30 hover:border-red-600 text-red-400 hover:text-black font-bold text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <LogOut size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                    SIGN OUT
                  </button>
                )}
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
