import React, { useState, useEffect, lazy, Suspense } from 'react';
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
import Loader from './components/common/Loader.tsx';

// Eager Page for instant load
import LandingPage from './pages/LandingPage.tsx';

// Code-split pages for optimized bundle size & TTI
const MarketplacePage = lazy(() => import('./pages/MarketplacePage.tsx'));
const ListingWizard = lazy(() => import('./pages/ListingWizard.tsx'));
const ForgePage = lazy(() => import('./pages/ForgePage.tsx'));
const FullKonkPage = lazy(() => import('./pages/FullKonkPage.tsx'));
const PlaygroundsPage = lazy(() => import('./pages/PlaygroundsPage.tsx'));
const IntelReportPage = lazy(() => import('./pages/IntelReportPage.tsx'));
const WalletPage = lazy(() => import('./pages/WalletPage.tsx'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard.tsx'));
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard.tsx'));
const AccountPage = lazy(() => import('./pages/AccountPage.tsx'));
const AcademyPage = lazy(() => import('./pages/AcademyPage.tsx'));
const BlogHub = lazy(() => import('./pages/BlogHub.tsx'));
const ForumPage = lazy(() => import('./pages/ForumPage.tsx'));
const ConsultingPage = lazy(() => import('./pages/ConsultingPage.tsx'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage.tsx'));
const CareerPage = lazy(() => import('./pages/CareerPage.tsx'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage.tsx'));
const KToolsPage = lazy(() => import('./pages/KToolsPage.tsx'));
const PricingPage = lazy(() => import('./pages/PricingPage.tsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.tsx'));
const ListingPage = lazy(() => import('./pages/ListingPage.tsx'));
const UsageDashboard = lazy(() => import('./pages/UsageDashboard.tsx'));
const AffiliatePage = lazy(() => import('./pages/AffiliatePage.tsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.tsx'));
const DisputePage = lazy(() => import('./pages/DisputePage.tsx'));
const StyleGuide = lazy(() => import('./pages/StyleGuide.tsx'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage.tsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.tsx'));
const RedaeyePage = lazy(() => import('./pages/RedaeyePage.tsx'));
const RedaeyeSandbox = lazy(() => import('./pages/RedaeyeSandbox.tsx'));

import { 
    ShoppingBag, Hammer, Wallet, Database, BookOpen, MessageSquare, ChevronRight, Globe, Home, Terminal, Cpu, ShieldAlert
} from 'lucide-react';

import { getPathForPage, getPageFromPath } from './utils/routes.ts';

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
    const [userLibrary, setUserLibrary] = useState<Listing[]>([]); 
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    const navigate = (page: PageView, targetListing?: Listing | string) => {
        let listingId: string | undefined;
        if (typeof targetListing === 'string') {
            listingId = targetListing;
        } else if (targetListing) {
            setSelectedListing(targetListing);
            listingId = targetListing.id;
        } else if (selectedListing) {
            listingId = selectedListing.id;
        }

        setCurrentPage(page);
        const newPath = getPathForPage(page, listingId);
        if (window.location.pathname !== newPath) {
            window.history.pushState({ page, listingId }, '', newPath);
        }
        window.scrollTo(0, 0);
    };

    // URL Routing Initialization & PopState Listener
    useEffect(() => {
        const syncRouteFromUrl = () => {
            const { page, listingId } = getPageFromPath(window.location.pathname);
            setCurrentPage(page);

            if (listingId) {
                const found = allListings.find(l => l.id === listingId);
                if (found) {
                    setSelectedListing(found);
                } else {
                    databaseService.getListings({ query: listingId }).then(results => {
                        const matched = results.find(l => l.id === listingId) || results[0];
                        if (matched) setSelectedListing(matched);
                    });
                }
            }
        };

        syncRouteFromUrl();

        const handlePopState = () => {
            syncRouteFromUrl();
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [allListings]);

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

    const { user } = auth;

    // Persistence: Sync library from Firestore on auth change
    useEffect(() => {
        async function syncLibrary() {
            if (user) {
                const library = await databaseService.getUserLibrary(user.id);
                setUserLibrary(library);
            } else {
                setUserLibrary([]);
            }
        }
        syncLibrary();
    }, [user]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data === 'back_to_base') {
                navigate('landing');
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

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

        if (userLibrary.some(l => l.id === listingToBuy.id)) {
            toast.showToast("Asset already in Enclave", "info");
            navigate('usage');
            return;
        }
        setSelectedListing(listingToBuy);
        navigate('checkout');
    };

    const handleConfirmedPurchase = async () => {
        if (!selectedListing || !user) return;
        
        try {
            await databaseService.purchaseAsset(user.id, selectedListing);
            setUserLibrary(prev => [selectedListing, ...prev]);
            toast.showToast("License Uplink Successful.", "success");
            navigate('usage');
            setSelectedListing(null);
        } catch (error) {
            console.error("Acquisition terminal failure:", error);
            toast.showToast("Transaction failed. System node timeout.", "error");
        }
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
            <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} onNavigate={navigate} />

            <main className="flex-1 min-h-screen relative w-full overflow-y-auto custom-scrollbar">
                {!['enter', 'join_network', 'verify_email', 'landing', 'redaeye', 'redaeye_sandbox'].includes(currentPage) && (
                    <Navbar 
                        onNavigate={navigate} 
                        currentPage={currentPage}
                        user={auth.user}
                        onLogout={async () => { await auth.logout(); navigate('landing'); }}
                        onOpenCmd={() => setIsCmdOpen(true)}
                    />
                )}

                <div className={`animate-in fade-in duration-500 ${['landing', 'redaeye', 'redaeye_sandbox'].includes(currentPage) ? '' : 'pt-20 md:pt-24 min-h-[calc(100vh-100px)]'}`}>
                    <Suspense fallback={
                        <div className="py-32 flex flex-col items-center justify-center space-y-4">
                            <Loader size={36} label="Initializing Module..." />
                        </div>
                    }>
                        {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
                        {currentPage === 'marketplace' && <MarketplacePage onNavigate={navigate} onOpenListing={(l) => { navigate('listing_detail', l); }} />}
                        {currentPage === 'listing_detail' && (
                            selectedListing ? (
                                <ListingPage listing={selectedListing} onNavigate={navigate} onBuy={handleBuyRequest} />
                            ) : (
                                <div className="py-32 flex flex-col items-center justify-center space-y-4">
                                    <Loader size={36} label="Loading Protocol Specification..." />
                                </div>
                            )
                        )}
                        {currentPage === 'fullkonk' && <FullKonkPage />}
                        {currentPage === 'redaeye' && <RedaeyeSandbox onNavigate={navigate} />}
                        {currentPage === 'redaeye_sandbox' && <RedaeyeSandbox onNavigate={navigate} />}
                        {currentPage === 'forge_audit' && <ForgePage onNavigate={navigate} />}
                        {currentPage === 'forge' && <ForgePage onNavigate={navigate} />}
                        {currentPage === 'playgrounds' && <PlaygroundsPage onNavigate={navigate} />}
                        {currentPage === 'intel_report' && <IntelReportPage onNavigate={navigate} />}
                        {currentPage === 'wallet' && <WalletPage onNavigate={navigate} />}
                        {currentPage === 'usage' && <BuyerDashboard onNavigate={navigate} library={userLibrary} />}
                        {currentPage === 'account' && <AccountPage user={auth.user} onNavigate={navigate} />}
                        {currentPage === 'checkout' && (
                            selectedListing ? (
                                <CheckoutPage listing={selectedListing} onNavigate={navigate} onConfirmed={handleConfirmedPurchase} />
                            ) : (
                                <div className="py-32 flex flex-col items-center justify-center space-y-4">
                                    <Loader size={36} label="Initializing Checkout Session..." />
                                </div>
                            )
                        )}
                        {currentPage === 'enter' && <EnterGate onEnter={() => navigate('marketplace')} onBack={() => navigate('landing')} onVerificationNeeded={(email) => { setEmailForVerification(email); navigate('verify_email'); }} />}
                        {currentPage === 'join_network' && <JoinNetwork onNavigate={navigate} onComplete={(email) => { setEmailForVerification(email); navigate('verify_email'); }} />}
                        {currentPage === 'verify_email' && <VerifyEmailPage email={emailForVerification!} onNavigateLogin={() => navigate('enter')} />}
                        {currentPage === 'contact' && <ContactPage onNavigate={navigate} />}
                        {currentPage === 'academy' && <AcademyPage onNavigate={navigate} />}
                        {currentPage === 'intel' && <BlogHub onNavigate={navigate} />}
                        {currentPage === 'network' && <ForumPage onNavigate={navigate} />}
                        {currentPage === 'advisory' && <ConsultingPage onNavigate={navigate} />}
                        {currentPage === 'documentation' && <DocumentationPage onNavigate={navigate} />}
                        {currentPage === 'resources' && <ResourcesPage onNavigate={navigate} />}
                        {currentPage === 'ktools' && <KToolsPage onNavigate={navigate} />}
                        {currentPage === 'pricing' && <PricingPage onNavigate={navigate} />}
                        {currentPage === 'seller_dashboard' && <SellerDashboard listings={allListings.filter(l => l.sellerId === auth.user?.id || l.sellerId === 'U1')} onNavigate={navigate} onNewListing={() => navigate('wizard')} />}
                        {currentPage === 'wizard' && <ListingWizard onComplete={handleDeployProtocol} onCancel={() => navigate('seller_dashboard')} />}
                        {currentPage === 'usage_metrics' && <UsageDashboard />}
                        {currentPage === 'affiliate' && <AffiliatePage />}
                        {currentPage === 'admin' && <AdminPage />}
                        {currentPage === 'dispute' && <DisputePage />}
                        {currentPage === 'style_guide' && <StyleGuide />}
                    </Suspense>
                </div>

                {!['enter', 'join_network', 'checkout', 'wizard', 'verify_email', 'redaeye', 'redaeye_sandbox'].includes(currentPage) && (
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