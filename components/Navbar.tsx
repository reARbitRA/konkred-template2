

import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import Logo3D from './Logo3D.tsx';

interface NavbarProps {
  onNavigate: (page: any) => void;
  currentPage: string;
  onOpenEnter: () => void;
  onJoinNetwork: () => void; // New prop for triggering the Join Network flow
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onOpenEnter, onJoinNetwork }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'marketplace', label: 'MARKETPLACE' },
    { id: 'academy', label: 'ACADEMY' },
    { id: 'intel', label: 'INTEL' },
    { id: 'network', label: 'NETWORK' },
    { id: 'documentation', label: 'DOCS' },
    { id: 'resources', label: 'RESOURCES' },
    { id: 'career', label: 'CAREERS' },
    { id: 'advisory', label: 'ADVISORY' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 concrete-card border-b border-white/5 bg-black/60 backdrop-blur-xl">
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
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => handleNav(link.id)} 
              className={`hover:text-white transition-colors relative group py-1 ${currentPage === link.id ? 'text-white' : ''}`}
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 w-full h-px bg-neon-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${currentPage === link.id ? 'scale-x-100' : ''}`} />
            </button>
          ))}
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
            onClick={onJoinNetwork}
            className="bg-neon-cyan text-black px-5 py-2 text-[10px] font-black tracking-widest hover:shadow-neon-cyan transition-all flex items-center gap-2"
          >
            JOIN NETWORK
            <ChevronRight size={10} strokeWidth={3} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-ghost hover:text-white p-2 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} className="animate-in spin-in-90 duration-300" /> : <Menu size={24} className="animate-in fade-in duration-300" />}
        </button>
      </div>

      {/* Mobile Menu - Enhanced with fade and slide transition */}
      <div 
        className={`lg:hidden absolute top-16 left-0 w-full bg-void/95 backdrop-blur-2xl border-b border-white/10 p-8 flex flex-col gap-4 z-40 transition-all duration-300 ease-out transform origin-top ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => handleNav(link.id)} 
              className={`text-sm font-mono tracking-[0.2em] py-3 px-4 rounded-lg text-left transition-all ${
                currentPage === link.id 
                  ? 'bg-white/10 text-white border-l-2 border-neon-cyan' 
                  : 'text-ghost-light hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="h-px bg-white/10 w-full my-4"></div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => {
              onOpenEnter();
              setIsMobileMenuOpen(false);
            }} 
            className="w-full justify-center py-3 px-4 text-xs font-mono text-ghost-light hover:text-white flex items-center gap-2 concrete-card hover:border-white/20 transition-all rounded-xl border border-white/10"
          >
            [ ENTER SYSTEM ]
          </button>
          <button 
            onClick={() => {
              onJoinNetwork();
              setIsMobileMenuOpen(false);
            }} 
            className="bg-neon-cyan text-black py-4 px-6 rounded-xl text-xs font-black tracking-widest uppercase shadow-lg shadow-neon-cyan/10 hover:shadow-neon-cyan/30 transition-all flex items-center justify-center gap-2"
          >
            JOIN NETWORK
            <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;