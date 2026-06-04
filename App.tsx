import React, { useState, useEffect } from 'react';
import { PageView, Protocol, Listing, LicenseType } from './types.ts';
import { APP_DATA } from './data.ts';

// Contexts & Hooks
import { useAuth } from './contexts/AuthContext.tsx';
import { useToast } from './contexts/ToastContext.tsx';
import { useModal } from './contexts/ModalContext.tsx';
import { useGlobalStats } from './hooks/useGlobalStats.ts';
import { databaseService } from './services/database.ts';

// Layout & Navigation
import Navbar from './components/Navbar.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import AuthLoadingScreen from './components/AuthLoadingScreen.tsx';
import Logo3D from './components/Logo3D.tsx';
import EnterGate from './components/EnterGate.tsx';
import JoinNetwork from './components/JoinNetwork.tsx';
import UserMenu from './components/auth/UserMenu.tsx';
import CommandPalette from './components/common/CommandPalette.tsx'; 
import SystemHUD from './components/layout/SystemHUD.tsx'; 
import SystemFooter from './components/SystemFooter.tsx';

// Pages
import LandingPage from './pages/LandingPage.tsx';
import MarketplacePage from './pages/MarketplacePage.tsx';
import ListingWizard from './pages/ListingWizard.tsx';
import ForgePage from './pages/ForgePage.tsx';
import PlaygroundsPage from './pages/PlaygroundsPage.tsx';
import IntelReportPage from './pages/IntelReportPage.tsx';
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
import VerifyEmailPage from './pages/VerifyEmailPage.tsx';

import { 
    ShoppingBag, Hammer, Wallet, Database, BookOpen, MessageSquare, ChevronRight, Globe, Home, Terminal, Cpu, ShieldAlert
} from 'lucide-react';

const App: React.FC = () => {
    const auth = useAuth();
    const toast = useToast();
    const { stats } = useGlobalStats();

    const [isBooting, setIsBooting] = useState(true);
    const [currentPage, setCurrentPage] = useState<PageView>('landing');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCmdOpen, setIsCmdOpen] = useState(false); 
    const [emailForVerification, setEmailForVerification] = useState<string | null>(null);
    
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [userLibrary, setUserLibrary] = useState<string[]>([]); 
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    const navigate = (page: PageView) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

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

    useEffect(() => {
        const loadInitialListings = async () => {
            try {
                const data = await databaseService.getListings({});
                setAllListings(data);
            } catch (err) {
                console.warn("Failed to load initial active listings:", err);
            }
        };
        loadInitialListings();
    }, []);

    const handleBuyRequest = (item: Listing | Protocol) => {
        if (!auth.user) {
            navigate('enter');
            return;
        }
        
        let listingToBuy: Listing;
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
                salesCount: p.acquisitionCount,
                viewCount: p.acquisitionCount * 5,
                createdAt: new Date(),
                updatedAt: new Date()
             };
        } else {
            listingToBuy = item as Listing;
        }

        if (userLibrary.includes(listingToBuy.id)) {
            toast.showToast("Asset already in Enclave", "info");
            navigate('usage');
            return;
        }
        setSelectedListing(listingToBuy);
        navigate('checkout');
    };

    const handleDeployProtocol = (newListing: Listing) => {
        setAllListings(prev => [newListing, ...prev]);
        toast.showToast("Protocol Deployed to Global Node", "success");
        navigate('seller_dashboard');
    };

    if (isBooting) return <LoadingScreen onComplete={() => setIsBooting(false)} />;
    if (auth.isLoading) return <AuthLoadingScreen />;

    return (
        <div className="min-h-screen bg-void text-metal-light selection:bg-neon-cyan selection:text-black font-sans flex overflow-hidden">
            <SystemHUD />
            <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} onNavigate={navigate} />

            {auth.user && !['enter', 'join_network', 'verify_email'].includes(currentPage) && (
                <aside className="w-64 border-r border-white/5 h-screen sticky top-0 bg-void-100 flex flex-col hidden lg:flex z-50">
                    <div className="p-8 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => navigate('landing')}>
                        <Logo3D size={40} />
                    </div>
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                        <SideLink id="landing" label="Base Home" icon={Home} current={currentPage} onNav={navigate} />
                        <SideLink id="playgrounds" label="Playgrounds" icon={Terminal} current={currentPage} onNav={navigate} />
                        <SideLink id="intel_report" label="Intel Report" icon={Cpu} current={currentPage} onNav={navigate} />
                        <SideLink id="forge" label="The Forge" icon={Hammer} current={currentPage} onNav={navigate} />
                    </nav>
                    
                    <div className="p-6 border-t border-white/5 bg-black/20 relative">
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-cyan to-neon-purple p-[1px]">
                                <div className="w-full h-full bg-black rounded-[3px] flex items-center justify-center font-bold text-white text-xs uppercase">
                                    {auth.user.name.substring(0,2)}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{auth.user.name}</p>
                                <p className="text-[9px] text-neon-cyan font-mono truncate">${auth.user.balance.fiat.toLocaleString()}</p>
                            </div>
                            <ChevronRight size={14} className={`text-ghost transition-transform ${isUserMenuOpen ? 'rotate-90' : ''}`} />
                        </div>
                        <UserMenu 
                            user={auth.user} 
                            isOpen={isUserMenuOpen} 
                            onClose={() => setIsUserMenuOpen(false)} 
                            onNavigate={navigate} 
                            onLogout={async () => { await auth.logout(); navigate('landing'); }} 
                        />
                    </div>
                </aside>
            )}

            <main className="flex-1 min-h-screen relative w-full overflow-y-auto custom-scrollbar">
                {!auth.user && !['enter', 'join_network', 'verify_email'].includes(currentPage) && (
                    <Navbar onNavigate={navigate} currentPage={currentPage} onOpenEnter={() => navigate('enter')} onJoinNetwork={() => navigate('join_network')} />
                )}

                <div className="animate-in fade-in duration-500">
                    {currentPage === 'landing' && <LandingPage onNavigate={navigate} user={auth.user} isAuthenticated={!!auth.user} onLogin={() => navigate('enter')} onAcquireRequest={(p) => handleBuyRequest(p)} />}
                    {currentPage === 'marketplace' && <MarketplacePage onNavigate={navigate} onOpenListing={(l) => { setSelectedListing(l); navigate('listing_detail'); }} />}
                    {currentPage === 'listing_detail' && selectedListing && <ListingPage listing={selectedListing} onNavigate={navigate} onBuy={handleBuyRequest} />}
                    {currentPage === 'forge_audit' && <ForgePage onNavigate={navigate} />}
                    {currentPage === 'forge' && <ForgePage onNavigate={navigate} />}
                    {currentPage === 'playgrounds' && <PlaygroundsPage onNavigate={navigate} />}
                    {currentPage === 'intel_report' && <IntelReportPage onNavigate={navigate} />}
                    {currentPage === 'wallet' && <WalletPage onNavigate={navigate} />}
                    {currentPage === 'usage' && <BuyerDashboard onNavigate={navigate} />}
                    {currentPage === 'account' && <AccountPage user={auth.user} onNavigate={navigate} />}
                    {currentPage === 'checkout' && selectedListing && <CheckoutPage listing={selectedListing} onNavigate={navigate} onConfirmed={() => { if(selectedListing) setUserLibrary(prev => [...prev, selectedListing.id]); toast.showToast("License Uplink Successful.", "success"); navigate('usage'); }} />}
                    {currentPage === 'enter' && <EnterGate onEnter={() => navigate('marketplace')} onBack={() => navigate('landing')} onVerificationNeeded={(email) => { setEmailForVerification(email); navigate('verify_email'); }} />}
                    {currentPage === 'join_network' && <JoinNetwork onNavigate={navigate} onComplete={(email) => { setEmailForVerification(email); navigate('verify_email'); }} />}
                    {currentPage === 'verify_email' && <VerifyEmailPage email={emailForVerification!} onNavigateLogin={() => navigate('enter')} />}
                    {currentPage === 'academy' && <AcademyPage onNavigate={navigate} />}
                    {currentPage === 'intel' && <BlogHub onNavigate={navigate} />}
                    {currentPage === 'network' && <ForumPage onNavigate={navigate} />}
                    {currentPage === 'advisory' && <ConsultingPage onNavigate={navigate} />}
                    {currentPage === 'documentation' && <DocumentationPage onNavigate={navigate} />}
                    {currentPage === 'resources' && <ResourcesPage onNavigate={navigate} />}
                    {currentPage === 'pricing' && <PricingPage onNavigate={navigate} />}
                    {currentPage === 'seller_dashboard' && <SellerDashboard listings={allListings.filter(l => l.sellerId === auth.user?.id || l.sellerId === 'U1')} onNavigate={navigate} onNewListing={() => navigate('wizard')} />}
                    {currentPage === 'wizard' && <ListingWizard onComplete={handleDeployProtocol} onCancel={() => navigate('seller_dashboard')} />}
                    {currentPage === 'usage_metrics' && <UsageDashboard />}
                    {currentPage === 'affiliate' && <AffiliatePage />}
                    {currentPage === 'admin' && <AdminPage />}
                    {currentPage === 'dispute' && <DisputePage />}
                    {currentPage === 'style_guide' && <StyleGuide />}
                </div>

                {!['enter', 'join_network', 'checkout', 'wizard', 'verify_email'].includes(currentPage) && (
                    <SystemFooter 
                        data={APP_DATA.footer} 
                        counts={{ 
                            protocols: stats?.totalProtocols || 0, 
                            tools: stats?.totalAgents || 0 
                        }} 
                    />
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
    <button onClick={() => onNav(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest transition-all ${current === id ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 shadow-inner' : 'text-ghost hover:text-white hover:bg-white/5'}`}>
        <Icon size={14} className={current === id ? 'animate-pulse' : ''} />
        <span>{label}</span>
    </button>
);

export default App;