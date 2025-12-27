import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import Logo3D from './Logo3D.tsx';

interface NavbarProps {
  onNavigate: (page: any) => void;
  currentPage: string;
  onOpenEnter: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onOpenEnter }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 lg:h-20 flex items-center justify-between">
        {/* Logo Section - Hover Expand Logic */}
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => handleNav('landing')}
        >
          <div className="flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
            <Logo3D size={44} />
          </div>
          <div className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 flex items-center">
            <span className="font-bold tracking-tight text-xl font-display logo-3d-effect ml-2 whitespace-nowrap">
              <span className="text-metal">KONK</span>
              <span className="text-neon-red">RED</span>
              <span className="text-white">.xyz</span>
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-ghost font-mono">
          <button onClick={() => handleNav('marketplace')} className={`hover:text-white transition-colors ${currentPage === 'marketplace' ? 'text-white' : ''}`}>MARKETPLACE</button>
          <button onClick={() => handleNav('academy')} className={`hover:text-white transition-colors ${currentPage === 'academy' ? 'text-white' : ''}`}>ACADEMY</button>
          <button onClick={() => handleNav('intel')} className={`hover:text-white transition-colors ${currentPage === 'intel' ? 'text-white' : ''}`}>INTEL</button>
          <button onClick={() => handleNav('network')} className={`hover:text-white transition-colors ${currentPage === 'network' ? 'text-white' : ''}`}>NETWORK</button>
          <button onClick={() => handleNav('advisory')} className={`hover:text-white transition-colors ${currentPage === 'advisory' ? 'text-white' : ''}`}>ADVISORY</button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={onOpenEnter}
            className="text-[10px] font-mono text-ghost hover:text-white transition-colors tracking-widest"
          >
            [ ENTER ]
          </button>
          <button 
            onClick={() => handleNav('join')}
            className="bg-neon-cyan text-black px-5 py-2 text-[10px] font-black tracking-widest hover:shadow-neon-cyan transition-all flex items-center gap-2"
          >
            JOIN NETWORK
            <ChevronRight size={10} strokeWidth={3} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-ghost hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-void border-b border-white/5 p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 z-40">
          <button onClick={() => handleNav('marketplace')} className="text-sm font-mono tracking-widest text-ghost-light text-left">MARKETPLACE</button>
          <button onClick={() => handleNav('academy')} className="text-sm font-mono tracking-widest text-ghost-light text-left">ACADEMY</button>
          <button onClick={() => handleNav('intel')} className="text-sm font-mono tracking-widest text-ghost-light text-left">INTEL</button>
          <button onClick={() => handleNav('network')} className="text-sm font-mono tracking-widest text-ghost-light text-left">NETWORK</button>
          <button onClick={() => handleNav('advisory')} className="text-sm font-mono tracking-widest text-ghost-light text-left">ADVISORY</button>
          <div className="h-px bg-white/10 w-full"></div>
          <button onClick={onOpenEnter} className="text-left text-xs font-mono text-ghost">[ ENTER SYSTEM ]</button>
          <button className="bg-neon-cyan text-black py-4 text-xs font-black tracking-widest">JOIN NETWORK</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;