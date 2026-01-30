
import React, { useState } from 'react';
import { User, PageView, Protocol } from '../types.ts';
import { APP_DATA } from '../data.ts';
import Protocols from '../components/Protocols.tsx';
import Logo3D from '../components/Logo3D.tsx';
import Footer from '../components/Footer.tsx';
import About from '../components/About.tsx';
import Tools from '../components/landing/Tools.tsx'; // Updated to use the correct Tools component for landing
import GetAccess from '../components/GetAccess.tsx';
import Badge from '../components/common/Badge.tsx';
import Pillars from '../components/landing/Pillars.tsx';
import Trust from '../components/landing/Trust.tsx';
import Pricing from '../components/landing/Pricing.tsx';
import FeaturedListings from '../components/landing/FeaturedListings.tsx'; // New
import CTA from '../components/landing/CTA.tsx'; // New
import ValuationTerminal from '../components/ValuationTerminal.tsx'; // New Import
import { BRAND, PLATFORM_STATS, TRUST_POINTS } from '../constants.ts';
import { ArrowRight, Play, Sparkles, Shield, ChevronDown } from 'lucide-react';

interface LandingPageProps {
    user: User | null;
    isAuthenticated: boolean;
    onNavigate: (page: PageView) => void;
    onLogin?: () => void;
    onAcquireRequest: (protocol: Protocol) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ user, isAuthenticated, onNavigate, onLogin, onAcquireRequest }) => {
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);

    const handleLaunchTool = (id: string) => {
        if (id === 't1') { // Valuation Terminal
            setIsTerminalOpen(true);
        } else {
            onNavigate('forge_audit');
        }
    };

    return (
        <div className="min-h-screen brutalist-bg">
            {isTerminalOpen && <ValuationTerminal onExit={() => setIsTerminalOpen(false)} />}
            {/* High-Fidelity Hero Section */}
            <section className="relative pt-32 lg:pt-56 pb-32 overflow-hidden flex flex-col items-center">
                <div className="absolute inset-0 z-0 opacity-[0.08] grid-bg pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[150px] -z-10 rounded-full animate-pulse" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    
                    {/* The 3D Masterpiece focal point */}
                    <div className="mb-16 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full animate-spin-slow"></div>
                         <Logo3D size={180} className="relative z-10" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-cyan/5 border border-neon-cyan/20 mb-10 animate-fade-in shadow-[0_0_30px_rgba(255,149,0,0.1)]">
                        <Sparkles size={14} className="text-neon-cyan" />
                        <span className="text-[10px] text-neon-cyan font-black tracking-[0.4em] uppercase font-mono">{BRAND.tagline}</span>
                    </div>

                    <h1 className="text-6xl sm:text-8xl font-black font-display tracking-tight mb-8 animate-slide-up leading-[0.9]">
                        <span className="text-white drop-shadow-2xl">UNIVERSAL</span>
                        <br />
                        <span className="gradient-text drop-shadow-[0_10px_30px_rgba(255,149,0,0.3)]">AI ASSETS</span>
                    </h1>

                    <p className="text-xl text-ghost-light max-w-2xl mx-auto mb-14 animate-slide-up delay-100 font-light leading-relaxed">
                        Deploy the premiere ecosystem for <span className="text-white font-medium">Structural AI Capital</span>. Verified methodologies for researchers, engineers, and enterprise teams.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up delay-200">
                        <button onClick={onLogin} className="btn-primary min-w-[260px] py-6 flex items-center justify-center gap-4 group uppercase tracking-[0.2em] text-xs font-black shadow-xl shadow-neon-cyan/20">
                            [ INITIATE UPLINK ]
                            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                        <button className="min-w-[260px] py-6 flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs font-bold concrete-card rounded-xl hover:bg-white/5 transition-all">
                            <Play size={18} />
                            Walkthrough
                        </button>
                    </div>
                </div>

                <div className="mt-24 animate-bounce opacity-20">
                    <ChevronDown size={32} />
                </div>
            </section>
            
            <section className="py-16 border-y border-white/5 bg-black/60 relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                    {PLATFORM_STATS.map((stat, i) => (
                        <div key={i} className="text-center group cursor-default">
                            <div className="text-4xl font-black text-white font-display mb-1 group-hover:text-neon-cyan transition-colors">{stat.value}</div>
                            <div className="text-[10px] font-mono text-ghost uppercase tracking-[0.4em]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <FeaturedListings onNavigate={onNavigate} onOpenListing={() => onNavigate('marketplace')} />

            <Pillars />

            {/* <Protocols 
                protocols={APP_DATA.protocols} 
                onAcquire={onAcquireRequest} 
            /> */}

            <About />
            
            <Tools tools={APP_DATA.tools} onLaunchTool={handleLaunchTool} />
            
            <Pricing />

            <section className="py-40 bg-void relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,149,0,0.05)_0%,transparent_70%)]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <header className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                        <Badge variant="cyan">Governance</Badge>
                        <h2 className="text-5xl font-display font-bold text-white">The <span className="text-neon-cyan">AUDIT</span> Protocol</h2>
                        <p className="text-ghost text-lg font-light">Unrivalled verification benchmarks for autonomous intellectual property.</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {TRUST_POINTS.map((point, i) => (
                            <div key={i} className="concrete-card p-12 rounded-[2rem] hover:border-white/20 transition-all group bg-black/40">
                                <div className="w-16 h-16 bg-neon-cyan/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                                    <Shield className="text-neon-cyan" size={32} />
                                </div>
                                <h3 className="text-white font-bold text-2xl mb-5">{point.title}</h3>
                                <p className="text-ghost text-sm leading-relaxed font-light">{point.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Trust />

            <CTA onJoin={() => onNavigate('join_network')} />
            
            <Footer />
        </div>
    );
};

export default LandingPage;
