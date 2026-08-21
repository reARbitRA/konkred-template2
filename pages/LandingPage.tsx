import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../types.ts';
import { getPathForPage } from '../utils/routes.ts';
import { 
  ArrowRight, ChevronUp, Shield, Scale, Zap, ExternalLink, Check, Activity 
} from 'lucide-react';
import { 
  PremiumServicesSection, 
  DynamicBlogSection, 
  ContactSection 
} from '../components/KonkredSections.tsx';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
}

// Custom Cursor Hook & Component
const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [laggedPosition, setLaggedPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  useEffect(() => {
    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animateLag = () => {
      setLaggedPosition(prev => ({
        x: lerp(prev.x, position.x, 0.2),
        y: lerp(prev.y, position.y, 0.2),
      }));
      animationFrameId = requestAnimationFrame(animateLag);
    };

    animationFrameId = requestAnimationFrame(animateLag);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <div 
        className="fixed w-2 h-2 bg-amber-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div 
        className="fixed w-8 h-8 border-2 border-amber-500/60 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75 ease-out"
        style={{ left: `${laggedPosition.x}px`, top: `${laggedPosition.y}px` }}
      />
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) setScrollProgress((window.scrollY / totalScroll) * 100);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isLoading]);

  // Terminal typewriter (honest copy)
  useEffect(() => {
    const command = "$ konkred products";
    let charIdx = 0;

    const typeInterval = setInterval(() => {
      if (charIdx < command.length) {
        setTerminalText(command.substring(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        const outputLines = [
          "[OK] 15 workflow products loaded from catalogue",
          "[OK] Server-side AI provider interface ready",
          "[OK] Audit engine: AUDITOR active",
          "[OK] Adversarial suite: REDAEYE active",
          "[OK] Product builder: fullKONK_> active"
        ];
        outputLines.forEach((line, index) => {
          setTimeout(() => {
            setTerminalLogs(prev => [...prev, line]);
            if (index === outputLines.length - 1) setTypingComplete(true);
          }, (index + 1) * 320);
        });
      }
    }, 60);

    return () => clearInterval(typeInterval);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white selection:bg-amber-500 selection:text-black relative font-sans overflow-x-hidden">
      <CustomCursor />

      {/* Initial Loader Overlay */}
      <div 
        className={`fixed inset-0 z-[10000] bg-[#0B0F14] flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none ${
          isLoading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono font-black text-white tracking-[0.3em] uppercase">KONKRED</span>
            <span className="w-3 h-3 bg-amber-500 rounded-full animate-ping" />
          </div>
          <div className="w-48 h-1 bg-zinc-800 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-amber-500 animate-shimmer w-full" />
          </div>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">INITIALIZING PRODUCT CATALOGUE...</p>
        </div>
      </div>

      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-amber-500 z-[60] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* SECTION 1: FIXED NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-[#0B0F14]/90 backdrop-blur-md border-b-2 border-black flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToTop()}>
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-mono font-black tracking-[0.25em] text-white uppercase group-hover:text-amber-500 transition-colors">
              KONKRED
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-500 uppercase tracking-wider pl-2 border-l border-zinc-800">
            konkred.xyz
          </span>
        </div>

        <nav className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-mono uppercase font-bold">
          <button onClick={() => scrollToSection('products')} className="text-zinc-400 hover:text-amber-500 transition-colors hidden sm:inline-block cursor-pointer">
            Products
          </button>
          <button onClick={() => scrollToSection('services')} className="text-zinc-400 hover:text-amber-500 transition-colors hidden md:inline-block cursor-pointer">
            Advisory
          </button>
          <button onClick={() => scrollToSection('blog')} className="text-zinc-400 hover:text-amber-500 transition-colors hidden md:inline-block cursor-pointer">
            Intel
          </button>
          <button onClick={() => scrollToSection('contact')} className="text-zinc-400 hover:text-amber-500 transition-colors hidden lg:inline-block cursor-pointer">
            Contact
          </button>
          <a
            href={getPathForPage('documentation')}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                onNavigate('documentation');
              }
            }}
            className="text-zinc-400 hover:text-amber-500 transition-colors hidden sm:inline-block"
          >
            Docs
          </a>
          <a
            href={getPathForPage('products')}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                onNavigate('products');
              }
            }}
            className="bg-amber-500 text-black font-black px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5"
          >
            <span>Browse Products</span>
            <ArrowRight size={14} />
          </a>
        </nav>
      </header>

      {/* SECTION 2: HERO */}
      <section id="hero" className="min-h-screen pt-[60px] flex flex-col justify-between relative bg-[#0B0F14] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29371a_1px,transparent_1px),linear-gradient(to_bottom,#1f29371a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          <div className="lg:col-span-7 flex flex-col items-start scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>AI Workflow Platform · konkred.xyz</span>
            </div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tighter text-white uppercase leading-none mb-4">
              KONKRED
            </h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-amber-500 tracking-tight mb-6">
              Data-driven AI workflows. Built to work.
            </h2>

            <div className="text-base sm:text-lg text-zinc-300 font-sans space-y-1 max-w-2xl mb-10 leading-relaxed">
              <p>Fifteen workflow products across legal, security, finance, sales, product and marketing.</p>
              <p>Plus the AUDITOR neural audit engine, REDAEYE adversarial diagnostics, and the fullKONK_&gt; product builder.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('products')}
                className="bg-amber-500 text-black font-mono font-black px-8 py-4 uppercase tracking-wider text-sm border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000000] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => scrollToSection('products')}
                className="bg-transparent text-white font-mono font-bold px-8 py-4 uppercase tracking-wider text-sm border-2 border-white/20 hover:border-amber-500 hover:text-amber-500 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Workflows</span>
              </button>
            </div>
          </div>

          {/* Terminal Mockup */}
          <div className="lg:col-span-5 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out">
            <div className="w-full bg-[#0E1319] border-2 border-black shadow-[8px_8px_0px_0px_#000000] rounded-none overflow-hidden font-mono text-xs md:text-sm">
              <div className="bg-[#181F2A] px-4 py-3 border-b-2 border-black flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                  konkred-cli v2.6.0
                </div>
                <div className="w-12" />
              </div>

              <div className="p-6 space-y-3 min-h-[260px] bg-[#070A0E] text-zinc-300">
                <div className="flex items-center gap-2 text-amber-500 font-bold">
                  <span>{terminalText}</span>
                  {!typingComplete && <span className="animate-cursor-blink text-amber-500">_</span>}
                </div>

                <div className="space-y-2 pt-2">
                  {terminalLogs.map((log, idx) => {
                    const isSuccess = log.includes('OK');
                    return (
                      <div key={idx} className={`transition-opacity duration-300 ${isSuccess ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                        {log}
                      </div>
                    );
                  })}
                </div>

                {typingComplete && (
                  <div className="pt-4 flex items-center gap-2 text-zinc-500">
                    <span>$</span>
                    <span className="animate-cursor-blink text-amber-500 font-bold">_</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Honest platform facts bar */}
        <div className="w-full bg-[#070A0E] border-t-2 border-b-2 border-black py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">15</div>
              <div className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold mt-1">Workflow Products</div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
              <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">4</div>
              <div className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold mt-1">Status Levels</div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
              <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">3</div>
              <div className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold mt-1">Flagship Tools</div>
            </div>
            <div className="flex flex-col items-center justify-center p-2 pt-6 md:pt-2">
              <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight">100%</div>
              <div className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold mt-1">Server-Side AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MARQUEE STRIP */}
      <section className="w-full bg-amber-500 text-black py-4 border-b-4 border-black select-none overflow-hidden whitespace-nowrap">
        <div className="animate-marquee font-mono font-black text-xl uppercase tracking-widest flex items-center gap-8">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span>fullKONK_&gt;</span>
              <span className="text-black/40">·</span>
              <span>REDAEYE</span>
              <span className="text-black/40">·</span>
              <span>AUDITOR</span>
              <span className="text-black/40">·</span>
              <span>15 Products</span>
              <span className="text-black/40">·</span>
              <span>konkred.xyz</span>
              <span className="text-black/40">·</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* SECTION 4: PRODUCTS */}
      <section id="products" className="py-20 md:py-32 bg-[#0B0F14] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
            <div className="font-mono text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">
              // PRODUCTS
            </div>
            <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white mb-3">
              Fifteen Workflows. One Platform.
            </h2>
            <p className="text-base md:text-lg text-zinc-400 font-mono">
              Data-driven product catalogue with honest maturity status. Built for engineers who ship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

            {/* CARD 1 — Product Catalogue */}
            <div className="min-h-[480px] p-8 md:p-[44px] border-[3px] border-black bg-white text-black relative overflow-hidden group transition-all duration-300 ease-out hover:bg-[#fafafa] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0px_0px_#D98A2E] flex flex-col justify-between scroll-reveal opacity-0 translate-y-8">
              <div className="absolute top-6 right-6 md:top-[44px] md:right-[44px]">
                <span className="px-3 py-1 text-[11px] font-mono font-black uppercase tracking-wider border border-black bg-amber-100 text-amber-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  CATALOGUE
                </span>
              </div>

              <div>
                <div className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-500 mb-3">
                  15 DATA-DRIVEN WORKFLOW PRODUCTS
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📦</span>
                  <h3 className="text-3xl md:text-4xl font-black font-mono tracking-tight text-black">
                    Products
                  </h3>
                </div>

                <p className="text-sm md:text-base font-sans text-zinc-800 leading-relaxed mb-8">
                  Contract review, IaC security, reconciliation, RFP response, PRD generation
                  and more — each with its own prompt, input/output schemas, status label and
                  limitation statement.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    '→ Searchable catalogue with category and status filters',
                    '→ One-click micro-tools with sample data',
                    '→ Workflow Kit / Validation Sprint / Enterprise Pilot CTAs',
                    '→ Status labels on every product'
                  ].map((line, i) => (
                    <div key={i} className="font-mono text-xs md:text-sm bg-[#f5f5f5] text-black px-4 py-3 flex items-center justify-between border-r-4 border-[#D98A2E] hover:bg-black hover:text-white transition-colors duration-200 cursor-default">
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('products')}
                className="w-full bg-amber-500 text-black font-mono font-black py-4 px-6 border-2 border-black uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all flex items-center justify-between group-hover:shadow-[2px_2px_0px_0px_#000000]"
              >
                <span>Open Catalogue</span>
                <ArrowRight size={18} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#D98A2E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </div>

            {/* CARD 2 — fullKONK_> */}
            <div className="min-h-[480px] p-8 md:p-[44px] border-[3px] border-black bg-white text-black relative overflow-hidden group transition-all duration-300 ease-out hover:bg-[#fafafa] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0px_0px_#D98A2E] flex flex-col justify-between scroll-reveal opacity-0 translate-y-8 delay-100">
              <div className="absolute top-6 right-6 md:top-[44px] md:right-[44px]">
                <span className="px-3 py-1 text-[11px] font-mono font-black uppercase tracking-wider border border-black bg-amber-100 text-amber-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  FLAGSHIP
                </span>
              </div>

              <div>
                <div className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-500 mb-3">
                  FULL-STACK AI PRODUCT BUILDER
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚡</span>
                  <h3 className="text-3xl md:text-4xl font-black font-mono tracking-tight text-black">
                    fullKONK_&gt;
                  </h3>
                </div>

                <p className="text-sm md:text-base font-sans text-zinc-800 leading-relaxed mb-8">
                  Describe an idea. Receive a complete product: architecture, frontend, backend,
                  verification and tests — streamed through a multi-provider server-side pipeline.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    '→ 3-stage pipeline: Architect → Build → Verify',
                    '→ Multi-provider failover, server-side keys only',
                    '→ Download ZIP or push direct to GitHub',
                    '→ Sessions, usage analytics and project history'
                  ].map((line, i) => (
                    <div key={i} className="font-mono text-xs md:text-sm bg-[#f5f5f5] text-black px-4 py-3 flex items-center justify-between border-r-4 border-[#D98A2E] hover:bg-black hover:text-white transition-colors duration-200 cursor-default">
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('fullkonk')}
                className="w-full bg-amber-500 text-black font-mono font-black py-4 px-6 border-2 border-black uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all flex items-center justify-between group-hover:shadow-[2px_2px_0px_0px_#000000]"
              >
                <span>Open fullKONK_&gt;</span>
                <ArrowRight size={18} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#D98A2E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </div>

            {/* CARD 3 — REDAEYE */}
            <div className="min-h-[480px] p-8 md:p-[44px] border-[3px] border-[#FF003C] bg-[#0A0A0A]/90 text-white relative overflow-hidden group transition-all duration-300 ease-out hover:border-[#f5279c] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[0_0_30px_rgba(255,0,60,0.4)] flex flex-col justify-between scroll-reveal opacity-0 translate-y-8 delay-200">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40 z-10" />

              <div className="absolute top-6 right-6 md:top-[44px] md:right-[44px] z-20">
                <span className="px-3 py-1 text-[11px] font-mono font-black uppercase tracking-wider border border-[#FF003C] bg-[#FF003C]/20 text-[#FF003C] flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,0,60,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-[#FF003C] animate-ping" />
                  ADVERSARIAL
                </span>
              </div>

              <div className="relative z-20">
                <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF003C] mb-3 flex items-center gap-2">
                  <Shield size={14} className="animate-pulse" />
                  <span>AI SAFETY ALIGNMENT &amp; ADVERSARIAL DIAGNOSTICS</span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]">👁</span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight text-white uppercase group-hover:text-[#FF003C] transition-colors">
                    KONKRED REDAEYE
                  </h3>
                </div>

                <p className="text-xs font-mono font-bold text-[#f5279c] uppercase tracking-wider mb-4">
                  Adversarial red-teaming suite for LLM architecture evaluation and diagnostics
                </p>

                <p className="text-sm font-sans text-zinc-300 leading-relaxed mb-8">
                  Threat-vector synthesis, guardrail subversion diagnostics and forensic
                  reporting for LLM systems. Results are diagnostics for your review.
                </p>

                <div className="grid grid-cols-2 gap-2 mb-8">
                  <div className="font-mono text-[11px] bg-[#141414] text-zinc-200 border border-[#333333] px-3 py-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF003C] rounded-full" />
                    <span>Vector Synthesis</span>
                  </div>
                  <div className="font-mono text-[11px] bg-[#141414] text-zinc-200 border border-[#333333] px-3 py-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF8C00] rounded-full" />
                    <span>Multi-Provider</span>
                  </div>
                  <div className="font-mono text-[11px] bg-[#141414] text-zinc-200 border border-[#333333] px-3 py-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" />
                    <span>Forensic Reporting</span>
                  </div>
                  <div className="font-mono text-[11px] bg-[#141414] text-zinc-200 border border-[#333333] px-3 py-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#f5279c] rounded-full" />
                    <span>Guardrail Checks</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('redaeye')}
                className="relative z-20 w-full bg-[#FF003C] text-white font-mono font-black py-4 px-6 border-2 border-white uppercase tracking-widest text-xs hover:bg-black hover:text-[#FF003C] hover:border-[#FF003C] transition-all flex items-center justify-between shadow-[0_0_20px_rgba(255,0,60,0.5)] cursor-pointer"
              >
                <span>INITIALIZE_DIAGNOSTICS -&gt;</span>
                <ArrowRight size={18} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#FF003C] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </div>

            {/* CARD 4 — AUDITOR */}
            <div className="min-h-[480px] p-8 md:p-[44px] border-[3px] border-black bg-white text-black relative overflow-hidden group transition-all duration-300 ease-out hover:bg-[#fafafa] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0px_0px_#3B82F6] flex flex-col justify-between scroll-reveal opacity-0 translate-y-8 delay-300">
              <div className="absolute top-6 right-6 md:top-[44px] md:right-[44px]">
                <span className="px-3 py-1 text-[11px] font-mono font-black uppercase tracking-wider border border-black bg-blue-100 text-blue-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  NEURAL AUDIT
                </span>
              </div>

              <div>
                <div className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-500 mb-3">
                  PROMPT &amp; LOGIC VALUATION ENGINE
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">⚖</span>
                  <h3 className="text-3xl md:text-4xl font-black font-mono tracking-tight text-black">
                    AUDITOR
                  </h3>
                </div>

                <p className="text-sm md:text-base font-sans text-zinc-800 leading-relaxed mb-8">
                  Neural audit engine for prompts, protocols and system instructions: logical
                  integrity, safety/compliance and execution-efficiency scoring.
                </p>

                <div className="space-y-2.5 mb-8">
                  {[
                    '→ Structured scoring: logic, safety, efficiency',
                    '→ JSON-schema-validated findings',
                    '→ Server-side Gemini execution',
                    '→ Decision-support output — human review expected'
                  ].map((line, i) => (
                    <div key={i} className="font-mono text-xs md:text-sm bg-[#f5f5f5] text-black px-4 py-3 flex items-center justify-between border-r-4 border-[#3B82F6] hover:bg-black hover:text-white transition-colors duration-200 cursor-default">
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('forge_audit')}
                className="w-full bg-blue-600 text-white font-mono font-black py-4 px-6 border-2 border-black uppercase tracking-wider text-sm hover:bg-black transition-all flex items-center justify-between group-hover:shadow-[2px_2px_0px_0px_#000000]"
              >
                <span>Open AUDITOR</span>
                <ArrowRight size={18} />
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#3B82F6] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: STRUCTURED AI ADVISORY & SERVICES */}
      <PremiumServicesSection />

      {/* SECTION 7: DYNAMIC TECHNICAL BLOG & INTEL */}
      <DynamicBlogSection />

      {/* SECTION 8: LEAD CAPTURE & CONTACT */}
      <ContactSection />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 p-4 bg-amber-500 text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000000] transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronUp size={20} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
