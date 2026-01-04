
import React, { useState, useEffect } from 'react';
import { PageView, Protocol, Listing } from './types.ts';
import { FEATURED_LISTINGS_DEMO } from './constants.ts';
import { APP_DATA } from './data.ts';

// Contexts & Hooks
import { useAuth } from './contexts/AuthContext.tsx';
import { useToast } from './contexts/ToastContext.tsx';
import { useModal } from './contexts/ModalContext.tsx';

// Layout & Navigation
import Navbar from './components/Navbar.tsx';
import SystemFooter from './components/SystemFooter.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import Logo3D from './components/Logo3D.tsx';
import EnterGate from './components/EnterGate.tsx';
import JoinNetwork from './components/JoinNetwork.tsx';
import UserMenu from './components/auth/UserMenu.tsx';
import CommandPalette from './components/common/CommandPalette.tsx'; 
import SystemHUD from './components/layout/SystemHUD.tsx'; 

// Pages
import LandingPage from './pages/LandingPage.tsx';
import MarketplacePage from './pages/MarketplacePage.tsx';
import ListingWizard from './pages/ListingWizard.tsx';
import ForgePage from './pages/ForgePage.tsx';
import WalletPage from './pages/WalletPage.tsx';
import SellerDashboard from './pages/SellerDashboard.tsx';
import BuyerDashboard from './pages/BuyerDashboard.tsx';
import AccountPage from './pages/AccountPage.tsx';
import AcademyPage from './pages/AcademyPage.tsx';
import BlogHub from './pages/BlogHub.tsx';
import ForumPage from './pages/ForumPage.tsx';
import ConsultingPage from './pages/ConsultingPage.tsx';
import DocumentationPage from './pages/DocumentationPage.tsx';
import CareerPage from './pages/CareerPage.tsx';
import ResourcesPage from './pages/ResourcesPage.tsx';
import PricingPage from './pages/PricingPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import ListingPage from './pages/ListingPage.tsx';
import UsageDashboard from './pages/UsageDashboard.tsx';
import AffiliatePage from './pages/AffiliatePage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import DisputePage from './pages/DisputePage.tsx';
import StyleGuide from './pages/StyleGuide.tsx';

import { 
    ShoppingBag, Hammer, Wallet, Database, BookOpen, MessageSquare, ChevronRight 
} from 'lucide-react';

const App: React.FC = () => {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const { openModal } = useModal();

    const [isBooting, setIsBooting] = useState(true);
    const [currentPage, setCurrentPage] = useState<PageView>('landing');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCmdOpen, setIsCmdOpen] = useState(false); 
    
    // Core Platform State
    const [allListings, setAllListings] = useState<Listing[]>(FEATURED_LISTINGS_DEMO);
    const [userLibrary, setUserLibrary] = useState<string[]>(['L1']); 
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    const navigate = (page: PageView) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    // Keyboard shortcut for Command Palette
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCmdOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Marketplace Actions
    const handleOpenListing = (listing: Listing) => {
        setSelectedListing(listing);
        navigate('listing_detail');
    };

    const handleBuyRequest = (item: Listing | Protocol) => {
        if (!user) {
            navigate('enter');
            return;
        }
        
        let listingToBuy: Listing;

        // Check if it's a Protocol (has 'level' or price as string) by duck typing or explicit check
        // Listing has 'pricing' object, Protocol has 'price' string
        if ('price' in item && typeof (item as Protocol).price === 'string') {
             const p = item as Protocol;
             listingToBuy = {
                id: p.id,
                sellerId: 'system',
                seller: { name: 'KONKRED Archive', verified: true, totalSales: p.acquisitionCount },
                title: p.title,
                shortDescription: p.description,
                description: p.description,
                type: 'protocol',
                category: p.category.toLowerCase(),
                pricing: { 
                    mode: 'one_time', 
                    amount: parseInt(p.price.replace(/[^0-9]/g, '')) || 99, 
                    currency: 'USD' 
                },
                delivery: 'download',
                auditScore: 98,
                rating: 5.0,
                reviewCount: 42,
                featured: false,
                tags: p.tags,
                createdAt: new Date()
             };
        } else {
            listingToBuy = item as Listing;
        }

        if (userLibrary.includes(listingToBuy.id)) {
            showToast("Asset already in Library", "info");
            navigate('usage');
            return;
        }
        setSelectedListing(listingToBuy);
        navigate('checkout');
    };

    // Acquisition Finalization (Triggered by Checkout Success)
    const handleAcquisitionSuccess = (listingId: string) => {
        setUserLibrary(prev => [...new Set([...prev, listingId])]);
        showToast("License Uplink Successful.", "success");
        navigate('usage');
    };

    // Listing Wizard Completion
    const handleCreateListing = (newListing: Listing) => {
        setAllListings(prev => [newListing, ...prev]);
        showToast("Protocol Deployed to Marketplace.", "success");
        navigate('seller_dashboard');
    };

    if (isBooting) return <LoadingScreen onComplete={() => setIsBooting(false)} />;

    return (
        <div className="min-h-screen bg-void text-metal-light selection:bg-neon-cyan selection:text-black font-sans flex overflow-hidden">
            
            {/* Global Cinematic Overlay */}
            <SystemHUD />

            {/* Global Command Palette */}
            <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} onNavigate={navigate} />

            {user && (
                <aside className="w-64 border-r border-white/5 h-screen sticky top-0 bg-void-100 flex flex-col hidden lg:flex z-50">
                    <div className="p-8 border-b border-white/5 cursor-pointer" onClick={() => navigate('landing')}>
                        <Logo3D size={40} />
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                        <SideLink id="marketplace" label="Browse Market" icon={ShoppingBag} current={currentPage} onNav={navigate} />
                        <SideLink id="usage" label="My Library" icon={Database} current={currentPage} onNav={navigate} />
                        <SideLink id="forge_audit" label="The Forge" icon={Hammer} current={currentPage} onNav={navigate} />
                        <SideLink id="wallet" label="Wallet Hub" icon={Wallet} current={currentPage} onNav={navigate} />
                        <div className="pt-8 pb-4 px-4 text-[9px] font-mono text-ghost uppercase tracking-[0.3em]">Network</div>
                        <SideLink id="academy" label="Academy" icon={BookOpen} current={currentPage} onNav={navigate} />
                        <SideLink id="network" label="Discussions" icon={MessageSquare} current={currentPage} onNav={navigate} />
                    </nav>
                    
                    <div className="p-6 border-t border-white/5 bg-black/20 relative">
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all group" 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-cyan to-neon-purple p-[1px]">
                                <div className="w-full h-full bg-black rounded-[3px] flex items-center justify-center font-bold text-white text-xs uppercase">
                                    {user.name.substring(0,2)}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                <p className="text-[9px] text-neon-cyan font-mono truncate">${user.balance.fiat.toLocaleString()}</p>
                            </div>
                            <ChevronRight size={14} className={`text-ghost transition-transform duration-300 ${isUserMenuOpen ? 'rotate-90' : ''}`} />
                        </div>

                        <UserMenu 
                            user={user} 
                            isOpen={isUserMenuOpen} 
                            onClose={() => setIsUserMenuOpen(false)} 
                            onNavigate={navigate}
                            onLogout={() => { logout(); navigate('landing'); }}
                        />
                    </div>
                </aside>
            )}

            <main className="flex-1 min-h-screen relative w-full overflow-y-auto">
                {!user && !['enter', 'join_network'].includes(currentPage) && (
                    <Navbar onNavigate={navigate} currentPage={currentPage} onOpenEnter={() => navigate('enter')} onJoinNetwork={() => navigate('join_network')} />
                )}

                <div className="animate-in fade-in duration-500">
                    {currentPage === 'landing' && <LandingPage onNavigate={navigate} user={user} isAuthenticated={!!user} onLogin={() => navigate('enter')} onAcquireRequest={(p) => handleBuyRequest(p)} />}
                    {currentPage === 'marketplace' && <MarketplacePage onNavigate={navigate} onOpenListing={handleOpenListing} />}
                    {currentPage === 'listing_detail' && selectedListing && <ListingPage listing={selectedListing} onNavigate={navigate} onBuy={handleBuyRequest} />}
                    {currentPage === 'forge_audit' && <ForgePage onNavigate={navigate} />}
                    {currentPage === 'wallet' && <WalletPage onNavigate={navigate} />}
                    {currentPage === 'usage' && <BuyerDashboard library={allListings.filter(l => userLibrary.includes(l.id))} onNavigate={navigate} />}
                    {currentPage === 'seller_dashboard' && <SellerDashboard listings={allListings.filter(l => l.sellerId === user?.id)} onNavigate={navigate} onNewListing={() => navigate('wizard')} />}
                    {currentPage === 'academy' && <AcademyPage onNavigate={navigate} />}
                    {currentPage === 'intel' && <BlogHub onNavigate={navigate} />}
                    {currentPage === 'network' && <ForumPage onNavigate={navigate} />}
                    {currentPage === 'advisory' && <ConsultingPage onNavigate={navigate} />}
                    {currentPage === 'documentation' && <DocumentationPage onNavigate={navigate} />}
                    {currentPage === 'resources' && <ResourcesPage onNavigate={navigate} />}
                    {currentPage === 'career' && <CareerPage onNavigate={navigate} />}
                    {currentPage === 'pricing' && <PricingPage onNavigate={navigate} />}
                    {currentPage === 'wizard' && <ListingWizard onComplete={handleCreateListing} onCancel={() => navigate('seller_dashboard')} />}
                    {currentPage === 'checkout' && selectedListing && <CheckoutPage listing={selectedListing} onNavigate={navigate} onConfirmed={() => handleAcquisitionSuccess(selectedListing.id)} />}
                    {currentPage === 'enter' && <EnterGate onEnter={() => navigate('marketplace')} onBack={() => navigate('landing')} />}
                    {currentPage === 'join_network' && <JoinNetwork onNavigate={navigate} onComplete={() => navigate('marketplace')} />}
                    {currentPage === 'account' && <AccountPage user={user} onNavigate={navigate} />}
                    {currentPage === 'usage_metrics' && <UsageDashboard />}
                    {currentPage === 'affiliate' && <AffiliatePage />}
                    {currentPage === 'admin' && <AdminPage />}
                    {currentPage === 'dispute' && <DisputePage />}
                    {currentPage === 'style_guide' && <StyleGuide />}
                </div>

                {!user && !['enter', 'join_network', 'checkout'].includes(currentPage) && (
                    <SystemFooter data={APP_DATA.footer} counts={{ protocols: allListings.length, tools: 48 }} />
                )}
            </main>
        </div>
    );
};

interface SideLinkProps {
    id: PageView;
    label: string;
    icon: React.ElementType;
    current: PageView;
    onNav: (page: PageView) => void;
}

const SideLink: React.FC<SideLinkProps> = ({ id, label, icon: Icon, current, onNav }) => (
    <button 
        onClick={() => onNav(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all ${current === id ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'text-ghost hover:text-white hover:bg-white/5'}`}
    >
        <Icon size={16} className={current === id ? 'animate-pulse' : ''} />
        <span>{label}</span>
    </button>
);

export default App;
