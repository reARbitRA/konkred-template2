/**
 * KONKRED home — B (Kinetic Slabs) × A (typewriter).
 * Dark by default, paper-light toggle. Tilted slabs, marquee, magnetic feel.
 */
import React, { useEffect, useState } from 'react';
import type { PageView } from '../types.ts';
import { ENTRIES } from '../content/catalogue/portfolio.ts';
import { Typewriter } from '../components/brand/Typewriter.tsx';
import { track } from '../utils/analytics.ts';
import { ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (page: PageView, slug?: string) => void;
}

const useTheme = () => {
  const [light, setLight] = useState(() => {
    try { return localStorage.getItem('konkred-theme') === 'light'; } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', light);
    try { localStorage.setItem('konkred-theme', light ? 'light' : 'dark'); } catch { /* ignore */ }
  }, [light]);
  return { light, toggle: () => setLight((v) => !v) };
};

const Slab: React.FC<{
  onClick: () => void; n: string; title: string; desc: string; cta: string;
  color: string; tilt: number; wide?: boolean; delay: number; testId?: string; btnText?: string;
}> = ({ onClick, n, title, desc, cta, color, tilt, wide, delay, testId, btnText }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    className={`k-slab brutal-rise text-left p-6 flex flex-col gap-3 cursor-pointer ${wide ? 'sm:col-span-2' : ''}`}
    style={{ ['--slab-c' as string]: color, transform: `rotate(${tilt}deg)`, animationDelay: `${delay}s` }}
  >
    <span className="font-black text-4xl sm:text-5xl leading-none" style={{ WebkitTextStroke: `2.5px ${color}`, color: 'transparent' }}>{n}</span>
    <span className="text-[9px] font-bold tracking-[0.28em] border-2 inline-block self-start px-2.5 py-1 border-[var(--k-ink)]">{cta}</span>
    <h3 className="font-black uppercase leading-[1.02] text-xl sm:text-2xl tracking-tight" style={{ fontFamily: "'Archivo Black',ui-monospace,monospace" }}>{title}</h3>
    <p className="text-[13px] leading-relaxed opacity-75">{desc}</p>
    <span className="mt-auto pt-3 font-bold text-xs tracking-[0.2em] flex items-center gap-2">
      {btnText ?? 'ENTER'} <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
    </span>
  </button>
);

const LandingPage: React.FC<Props> = ({ onNavigate }) => {
  const { light, toggle } = useTheme();
  useEffect(() => { track('catalogue_view', 'landing'); }, []);

  const marquee = ['36 CONTROLLED WORKFLOWS', '///', '21 SUITES', '///', '15 READY-TO-RUN TOOLS', '///', 'EVIDENCE-LINKED', '///', 'ZERO FAKE CLAIMS', '///', 'HUMAN-SUPERVISED', '///'];

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: 'var(--k-bg)', color: 'var(--k-ink)' }} data-testid="landing-b">
      {/* top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-10 py-3" style={{ background: 'var(--k-panel)', borderBottom: '4px solid var(--k-edge)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 grid place-items-center font-black text-lg rotate-[-4deg] transition-transform duration-300 hover:rotate-[6deg] hover:scale-110" style={{ background: 'var(--k-amber)', color: 'var(--k-on-acc)' }}>K</div>
          <b className="tracking-[0.25em] text-sm" style={{ fontFamily: "'Archivo Black',ui-monospace,monospace" }}>KONKRED</b>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3 text-[10px] font-bold tracking-[0.2em]">
          <button onClick={() => onNavigate('catalogue')} className="hidden sm:inline-block px-3 py-2 cursor-pointer hover:underline">CATALOGUE</button>
          <button onClick={() => onNavigate('validation')} className="hidden sm:inline-block px-3 py-2 cursor-pointer hover:underline">VALIDATION</button>
          <button onClick={() => onNavigate('pricing')} className="hidden sm:inline-block px-3 py-2 cursor-pointer hover:underline">PRICING</button>
          <button onClick={toggle} className="px-3 py-2 border-2 cursor-pointer border-[var(--k-ink)]" aria-label="Toggle light or dark theme">{light ? '☀ LIGHT' : '◐ DARK'}</button>
        </nav>
      </header>

      {/* marquee */}
      <div className="overflow-hidden whitespace-nowrap" style={{ background: 'var(--k-amber)', borderBottom: '4px solid var(--k-edge)' }} aria-hidden="true">
        <div className="brutal-marquee py-1.5">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 font-black uppercase tracking-[0.25em] text-[11px] py-1" style={{ color: 'var(--k-on-acc)', fontFamily: "'Archivo Black',ui-monospace,monospace" }}>
              {marquee.map((w, i) => <span key={i} className="mx-4">{w}</span>)}
            </span>
          ))}
        </div>
      </div>

      {/* hero + typewriter */}
      <section className="px-5 sm:px-10 pt-12 sm:pt-20 pb-8 max-w-6xl mx-auto">
        <span className="k-badge inline-block rotate-[-1.5deg] mb-8">
          EVIDENCE-LINKED WORKFLOW PRODUCTS
        </span>
        <Typewriter
          as="h1"
          text="WORK THAT PROVES ITSELF."
          speed={38}
          className="font-black uppercase leading-[0.92] tracking-[-0.02em] text-[13vw] sm:text-7xl lg:text-8xl min-h-[2.2em]"
        />
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed" style={{ color: 'var(--k-mut)' }}>
          36 enterprise workflow products — 21 suites, 15 ready-to-run tools. Every claim sourced,
          every output human-reviewed. No fake numbers, no autonomous employees.
        </p>
        <div className="flex flex-wrap gap-8 sm:gap-12 mt-10">
          {[['36', 'PRODUCTS', 'var(--k-amber)'], ['21', 'SUITES', 'var(--k-violet)'], ['15', 'TOOLS', 'var(--k-cyan)']].map(([n, l, c]) => (
            <div key={l}>
              <b className="font-black text-4xl sm:text-5xl block" style={{ color: c, fontFamily: "'Archivo Black',ui-monospace,monospace" }}>{n}</b>
              <span className="text-[10px] font-bold tracking-[0.3em]">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* the four doors — tilted slabs */}
      <section className="px-5 sm:px-10 pb-24 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
        <Slab
          testId="landing-slab-catalogue"
          onClick={() => onNavigate('catalogue')}
          n="01" tilt={-1.2} delay={0.05} wide
          color="var(--k-amber)"
          cta="36 WORKFLOWS · ZOOMABLE FLOOR"
          title="The Workflow Floor"
          desc="Every suite and tool as a station on an infinite floor — wires pulse suite → tool. Pan, zoom, open a station, run the tool."
          btnText="WALK THE FLOOR"
        />
        <Slab
          testId="landing-slab-auditor"
          onClick={() => onNavigate('forge_audit')}
          n="02" tilt={1.1} delay={0.12}
          color="var(--k-violet)"
          cta="AUDITOR"
          title="Neural Audit"
          desc="Read any file like a machine: vulnerabilities, exposed keys, deceptive patterns — with evidence."
          btnText="Open AUDITOR"
        />
        <Slab
          testId="landing-slab-fullkonk"
          onClick={() => onNavigate('fullkonk')}
          n="03" tilt={-0.9} delay={0.19}
          color="var(--k-cyan)"
          cta="fullKONK_&gt;"
          title="Autonomous Build Pipeline"
          desc="Describe the system. Watch it get architected, built, verified and reviewed — end to end."
          btnText="Open fullKONK_&gt;"
        />
        <Slab
          testId="landing-slab-redaeye"
          onClick={() => onNavigate('redaeye')}
          n="04" tilt={1.3} delay={0.26} wide
          color="var(--k-lime)"
          cta="REDAEYE · ON AIR"
          title="REDAEYE Television"
          desc="367 techniques, 18 core detection families — broadcast on the KONKRED channel, old-TV style."
          btnText="TUNE IN"
        />
      </section>

      {/* footer strip */}
      <footer className="px-5 sm:px-10 py-8 flex flex-wrap items-center justify-between gap-4 text-[10px] font-bold tracking-[0.25em]" style={{ borderTop: '4px solid var(--k-edge)', color: 'var(--k-mut)' }}>
        <span>KONKRED.XYZ — {ENTRIES.length} CONTROLLED WORKFLOW PRODUCTS</span>
        <div className="flex gap-5">
          <button onClick={() => onNavigate('validation')} className="cursor-pointer hover:underline">VALIDATION RECORD</button>
          <button onClick={() => onNavigate('partners')} className="cursor-pointer hover:underline">PARTNERS</button>
          <button onClick={() => onNavigate('enterprise')} className="cursor-pointer hover:underline">ENTERPRISE</button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
