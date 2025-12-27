import React, { useState } from 'react';

// Types
import { User, PageView, ModalType, Toast, Protocol } from '../types.ts';
import { APP_DATA } from '../data.ts';

// Components
import Protocols from '../components/Protocols.tsx';
import ProtocolDetails from '../components/ProtocolDetails.tsx';
import Logo3D from '../components/Logo3D.tsx';
import Footer from '../components/Footer.tsx';

// Constants
import { 
    BRAND,
    ASSET_TYPES,
    PLATFORM_STATS,
    NAV_LINKS,
    TRUST_POINTS,
    HOW_IT_WORKS_BUYER,
    HOW_IT_WORKS_SELLER,
} from '../constants.ts';

// Icons
import {
    Menu,
    X,
    ArrowRight,
    Play,
    Sparkles,
    FileText,
    Bot,
    Database,
    Code,
    Layers,
    Layout,
    GitBranch,
    Package,
    DollarSign,
    Zap,
    Shield,
    BarChart3,
    Terminal,
    Award,
    Clock,
    Search,
    CreditCard,
    Rocket,
    PenTool,
    Upload,
    CheckCircle,
} from 'lucide-react';

// =============================================================
// TYPES
// =============================================================

interface LandingPageProps {
    user: User | null;
    isAuthenticated: boolean;
    onNavigate: (page: PageView) => void;
    onOpenModal?: (modal: ModalType) => void;
    onShowToast?: (type: Toast['type'], message: string) => void;
    onLogin?: () => void;
}

// =============================================================
// ICON MAP
// =============================================================

const IconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
    FileText,
    Layers,
    Bot,
    GitBranch,
    Database,
    Code,
    Layout,
    Package,
    DollarSign,
    BarChart3,
    Sparkles,
    Terminal,
    Shield,
    Award,
    Clock,
    Search,
    CreditCard,
    Rocket,
    PenTool,
    Upload,
    CheckCircle,
    Zap,
};

// =============================================================
// NAVBAR
// =============================================================

const Navbar: React.FC<{
    isAuthenticated: boolean;
    onOpenModal: (modal: ModalType) => void;
}> = ({ isAuthenticated, onOpenModal }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            {/* Backdrop */}
            <div className="absolute inset-0 glass-strong border-b border-white/5" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo Section - Collapsed/Expanded */}
                    <div className="flex items-center cursor-pointer group">
                        <div className="transition-transform group-hover:scale-110 duration-300">
                            <Logo3D size={40} />
                        </div>
                        <div className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 flex items-center">
                            <span className="font-display font-bold text-xl tracking-tight logo-3d-effect ml-2 whitespace-nowrap">
                                <span className="text-metal">KONK</span>
                                <span className="text-neon-red">RED</span>
                                <span className="text-white">.xyz</span>
                            </span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm text-ghost-light hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <button className="btn-primary">
                                <span>Dashboard</span>
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={() => onOpenModal('login')}
                                    className="hidden sm:block text-sm text-ghost-light hover:text-white transition-colors"
                                >
                                    Sign In
                                </button>
                                <button 
                                    onClick={() => onOpenModal('waitlist')}
                                    className="btn-primary text-sm"
                                >
                                    <span>Get Early Access</span>
                                </button>
                            </>
                        )}
                        
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-ghost hover:text-white"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 glass-strong border-b border-white/5 animate-slide-down">
                        <div className="px-4 py-6 space-y-4">
                            {NAV_LINKS.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="block text-ghost-light hover:text-white transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// =============================================================
// HERO SECTION
// =============================================================

const HeroSection: React.FC<{
    onOpenModal: (modal: ModalType) => void;
}> = ({ onOpenModal }) => {
    return (
        <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/5 border border-neon-cyan/20 mb-8 animate-fade-in">
                        <Sparkles size={14} className="text-neon-cyan" />
                        <span className="text-sm text-neon-cyan font-medium">
                            {BRAND.tagline}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight mb-6 animate-fade-in-up">
                        <span className="text-white">Buy, Sell & Scale</span>
                        <br />
                        <span className="gradient-text">AI Ecosystems</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-ghost-light max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-100">
                        The trusted hub for prompts, agents, and complex workflows. 
                        Revenue-ready. Audit verified. Enterprise clear.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animate-delay-200">
                        <button 
                            onClick={() => onOpenModal('waitlist')}
                            className="btn-primary text-base px-8 py-4 flex items-center gap-2 group"
                        >
                            <span>Launch System</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
                            <Play size={18} />
                            <span>Watch Demo</span>
                        </button>
                    </div>

                    {/* Asset Types */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 animate-fade-in-up animate-delay-300">
                        {ASSET_TYPES.slice(0, 6).map((asset, index) => {
                            const Icon = IconMap[asset.icon] || FileText;
                            return (
                                <div
                                    key={asset.id}
                                    className="glass-card rounded-xl p-4 cursor-pointer group"
                                    style={{ animationDelay: `${300 + index * 50}ms` }}
                                >
                                    <div className={`text-neon-${asset.color} mb-2 group-hover:scale-110 transition-transform`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="text-sm font-medium text-white">{asset.name}</div>
                                    <div className="text-xs text-ghost">Verified</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

// =============================================================
// STATS SECTION
// =============================================================

const StatsSection: React.FC = () => {
    return (
        <section className="py-12 border-y border-white/5 bg-void-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {PLATFORM_STATS.map((stat, index) => {
                        const Icon = IconMap[stat.icon] || Package;
                        return (
                            <div 
                                key={stat.label} 
                                className="text-center animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Icon size={20} className="text-neon-cyan" />
                                    <span className="text-3xl sm:text-4xl font-bold text-white">
                                        {stat.value}
                                    </span>
                                </div>
                                <div className="text-sm text-ghost uppercase tracking-widest font-mono text-[10px]">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// =============================================================
// HOW IT WORKS
// =============================================================

const HowItWorksSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
    
    const steps = activeTab === 'buyer' ? HOW_IT_WORKS_BUYER : HOW_IT_WORKS_SELLER;

    return (
        <section className="py-20 lg:py-32 bg-void-100/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
                        System <span className="text-neon-cyan">Architecture</span>
                    </h2>
                    
                    {/* Tab Switcher */}
                    <div className="inline-flex items-center p-1 bg-void-300 rounded-lg mt-6">
                        <button
                            onClick={() => setActiveTab('buyer')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'buyer'
                                    ? 'bg-neon-cyan text-void'
                                    : 'text-ghost hover:text-white'
                            }`}
                        >
                            Acquisition
                        </button>
                        <button
                            onClick={() => setActiveTab('seller')}
                            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'seller'
                                    ? 'bg-neon-cyan text-void'
                                    : 'text-ghost hover:text-white'
                            }`}
                        >
                            Distribution
                        </button>
                    </div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => {
                        const Icon = IconMap[step.icon] || Zap;
                        return (
                            <div
                                key={step.step}
                                className="relative p-6 text-center animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Step Number */}
                                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-void-300 border border-white/5 flex items-center justify-center relative">
                                    <Icon size={24} className="text-neon-cyan" />
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-neon-cyan text-void text-xs font-bold rounded-full flex items-center justify-center font-mono">
                                        {step.step}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-ghost">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// =============================================================
// MAIN LANDING PAGE
// =============================================================

const LandingPage: React.FC<LandingPageProps> = ({
    user,
    isAuthenticated,
    onNavigate,
    onOpenModal,
    onShowToast,
    onLogin,
}) => {
    const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);

    // Handle modal triggers with fallback to onLogin
    const handleModalTrigger = (modal: ModalType) => {
        if (onOpenModal) {
            onOpenModal(modal);
        } else if (onLogin) {
            onLogin();
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar 
                isAuthenticated={isAuthenticated} 
                onOpenModal={handleModalTrigger} 
            />
            
            <main>
                <HeroSection onOpenModal={handleModalTrigger} />
                <StatsSection />
                
                {/* Featured Protocols Section */}
                <Protocols 
                    protocols={APP_DATA.protocols} 
                    onViewDetails={setSelectedProtocol}
                    onAcquire={(p) => {
                        console.log('Acquire protocol', p.id);
                        if (isAuthenticated) {
                            onNavigate('checkout'); 
                        } else {
                            handleModalTrigger('login');
                        }
                    }} 
                />

                <HowItWorksSection />
                
                {/* Secondary Sections */}
                <section className="py-20 lg:py-32 bg-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="badge badge-purple mb-6">Trust Engine</div>
                        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-6">The AUDIT Standard</h2>
                        <p className="text-ghost-light text-lg max-w-2xl mx-auto mb-12">
                            Every asset on KONKRED is autonomously audited for safety, performance, and logic consistency. No more black-box AI.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             {TRUST_POINTS.slice(0, 3).map(point => (
                                 <div key={point.title} className="p-8 border border-white/5 bg-void-100 rounded-xl text-left">
                                     <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center text-neon-green mb-6">
                                         <IconMap.Shield size={20} />
                                     </div>
                                     <h3 className="text-white font-bold mb-2">{point.title}</h3>
                                     <p className="text-ghost text-sm">{point.description}</p>
                                 </div>
                             ))}
                        </div>
                    </div>
                </section>
            </main>
            
            {/* Primary Footer - Branding */}
            <footer className="py-20 border-t border-white/5 bg-void">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
                    <div className="flex items-center group cursor-pointer" onClick={() => onNavigate('landing')}>
                        <Logo3D size={48} />
                        <div className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 flex items-center">
                          <span className="font-display font-bold text-2xl text-white logo-3d-effect ml-3 whitespace-nowrap">
                              <span className="text-metal">KONK</span>
                              <span className="text-neon-red">RED</span>
                              <span className="text-white">.xyz</span>
                          </span>
                        </div>
                    </div>
                    <div className="flex gap-12 text-sm text-ghost font-mono tracking-widest">
                        <button className="hover:text-white transition-colors" onClick={() => onNavigate('marketplace')}>MARKETPLACE</button>
                        <button className="hover:text-white transition-colors" onClick={() => onNavigate('forge_audit')}>FORGE</button>
                        <button className="hover:text-white transition-colors" onClick={() => onNavigate('wallet')}>WALLET</button>
                    </div>
                    <div className="text-xs text-ghost-light font-mono">© 2025 KONKRED SYSTEMS</div>
                  </div>
                </div>
            </footer>

            {/* Signature Footer - Studio Credits */}
            <Footer />

            {/* Global Modals */}
            <ProtocolDetails 
                protocol={selectedProtocol}
                onClose={() => setSelectedProtocol(null)}
                onAcquire={() => {
                    setSelectedProtocol(null);
                    if (isAuthenticated) {
                        onNavigate('checkout');
                    } else {
                        handleModalTrigger('login');
                    }
                }}
            />
        </div>
    );
};

export default LandingPage;