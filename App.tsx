import React, { useState, useEffect } from 'react';
import { PageView, User, Listing, AssetType } from './types.ts';
import { MOCK_USER, FEATURED_LISTINGS_DEMO } from './constants.ts';

// Pages
import LandingPage from './pages/LandingPage.tsx';
import MarketplacePage from './pages/MarketplacePage.tsx';
import ListingPage from './pages/ListingPage.tsx';
import ListingWizard from './pages/ListingWizard.tsx';
import WalletPage from './pages/WalletPage.tsx';
import SellerDashboard from './pages/SellerDashboard.tsx';
import ForgePage from './pages/ForgePage.tsx';
import BuyerDashboard from './pages/BuyerDashboard.tsx';
import AccountPage from './pages/AccountPage.tsx';
import CheckoutPage from './pages/CheckoutPage.tsx';
import PricingPage from './pages/PricingPage.tsx';
import AffiliatePage from './pages/AffiliatePage.tsx';
import AcademyPage from './pages/AcademyPage.tsx';
import BlogHub from './pages/BlogHub.tsx';
import ForumPage from './pages/ForumPage.tsx';
import ConsultingPage from './pages/ConsultingPage.tsx';

// Components
import Navbar from './components/Navbar.tsx';
import SystemFooter from './components/SystemFooter.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import Logo3D from './components/Logo3D.tsx';
import EnterGate from './components/EnterGate.tsx';

import { 
    ShoppingBag, Hammer, Wallet, Zap, Users, ShieldAlert, 
    Settings, LayoutDashboard, Database, BookOpen, Cpu, Globe, Target,
    Newspaper, MessageSquare, Headphones
} from 'lucide-react';

const App: React.FC = () => {
    const [isBooting, setIsBooting] = useState(true);
    const [currentPage, setCurrentPage] = useState<PageView>('landing');
    const [user, setUser] = useState<User | null>(null);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [myListings, setMyListings] = useState<Listing[]>(FEATURED_LISTINGS_DEMO);
    const [showEnterGate, setShowEnterGate] = useState(false);

    const navigate = (page: PageView) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleLoginTrigger = () => {
        setShowEnterGate(true);
    };

    const handleGateComplete = () => {
        setUser(MOCK_USER);
        setShowEnterGate(false);
        navigate('marketplace');
    };

    const handleNewListing = (newListing: Listing) => {
        setMyListings(prev => [newListing, ...prev]);
        navigate('seller_dashboard');
    };

    const renderContent = () => {
        switch (currentPage) {
            case 'landing': 
                return <LandingPage onNavigate={navigate} user={user} isAuthenticated={!!user} onLogin={handleLoginTrigger} />;
            case 'marketplace': 
                return < MarketplacePage listings={myListings} onNavigate={navigate} onOpenListing={(l) => { setSelectedListing(l); navigate('listing_detail'); }} />;
            case 'listing_detail': 
                return selectedListing ? <ListingPage listing={selectedListing} onNavigate={navigate} onBuy={() => navigate('checkout')} /> : null;
            case 'checkout': 
                return selectedListing ? <CheckoutPage listing={selectedListing || FEATURED_LISTINGS_DEMO[0]} onNavigate={navigate} /> : null;
            case 'wizard': 
                return <ListingWizard onComplete={handleNewListing} onCancel={() => navigate('seller_dashboard')} />;
            case 'forge_audit': 
                return <ForgePage onNavigate={navigate} />;
            case 'seller_dashboard': 
                return <SellerDashboard listings={myListings} onNavigate={navigate} />;
            case 'usage': 
                return <BuyerDashboard onNavigate={navigate} />;
            case 'vertical_landing': 
                return <AccountPage user={user} onNavigate={navigate} />;
            case 'wallet': 
                return <WalletPage />;
            case 'pricing':
                return <PricingPage onNavigate={navigate} />;
            case 'affiliate_center':
                return <AffiliatePage />;
            case 'academy':
                return <AcademyPage />;
            case 'intel':
                return <BlogHub />;
            case 'network':
                return <ForumPage />;
            case 'advisory':
                return <ConsultingPage />;
            default: 
                return <div className="min-h-screen flex items-center justify-center text-ghost">404: MODULE_NOT_FOUND</div>;
        }
    };

    if (isBooting) return <LoadingScreen onComplete={() => setIsBooting(false)} />;

    return (
        <div className="min-h-screen bg-void text-metal-light flex">
            {showEnterGate && <EnterGate onEnter={handleGateComplete} />}
            
            {user && (
                <aside className="w-72 border-r border-white/5 bg-void-50 flex flex-col fixed inset-y-0 z-40 hidden lg:flex">
                    <div className="p-8 border-b border-white/5 flex items-center group cursor-pointer" onClick={() => navigate('landing')}>
                        <div className="flex items-center justify-center">
                            <Logo3D size={36} />
                        </div>
                        <div className="overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 flex items-center">
                          <span className="font-bold tracking-tighter text-2xl italic logo-3d-effect ml-2 whitespace-nowrap">
                              <span className="text-metal">KONK</span>
                              <span className="text-neon-red">RED</span>
                          </span>
                        </div>
                    </div>

                    <nav className="flex-1 p-6 space-y-2 overflow-y-auto scrollbar-hide">
                        <Section label="Marketplace" items={[
                            { id: 'marketplace', label: 'Browse Assets', icon: ShoppingBag },
                            { id: 'usage', label: 'My Library', icon: Database },
                        ]} current={currentPage} onNav={navigate} />

                        <Section label="Forge (AI Tools)" items={[
                            { id: 'forge_audit', label: 'Valuation & Audit', icon: Hammer },
                            { id: 'wizard', label: 'New Protocol', icon: Zap },
                        ]} current={currentPage} onNav={navigate} />

                        <Section label="Network" items={[
                            { id: 'academy', label: 'Academy', icon: BookOpen },
                            { id: 'intel', label: 'Intel (Blog)', icon: Newspaper },
                            { id: 'network', label: 'Forum', icon: MessageSquare },
                            { id: 'advisory', label: 'Advisory', icon: Headphones },
                        ]} current={currentPage} onNav={navigate} />

                        <Section label="Executive" items={[
                            { id: 'seller_dashboard', label: 'Sell / Dashboard', icon: LayoutDashboard },
                            { id: 'wallet', label: 'Financials', icon: Wallet },
                            { id: 'affiliate_center', label: 'Affiliate Network', icon: Target },
                        ]} current={currentPage} onNav={navigate} />

                        <Section label="System" items={[
                            { id: 'pricing', label: 'Pricing Plans', icon: Globe },
                            { id: 'vertical_landing', label: 'Account Settings', icon: Settings },
                        ]} current={currentPage} onNav={navigate} />
                    </nav>

                    <div className="p-6 border-t border-white/5 bg-black/20">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink p-0.5">
                                <div className="w-full h-full rounded-full bg-void flex items-center justify-center font-bold text-white text-xs">AM</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                <p className="text-[9px] text-neon-cyan font-mono uppercase">Pro Tier</p>
                            </div>
                            <button onClick={() => setUser(null)} className="text-ghost hover:text-white transition-colors"><Settings size={14}/></button>
                        </div>
                    </div>
                </aside>
            )}

            <main className={`flex-1 flex flex-col ${user ? 'lg:pl-72' : ''}`}>
                {!user && <Navbar onNavigate={navigate} currentPage={currentPage} onOpenEnter={handleLoginTrigger} />}
                <div className="flex-1 min-h-screen">{renderContent()}</div>
                <SystemFooter data={{ systemStatus: 'NODE OPERATIONAL', version: 'v2.8.4' }} counts={{ protocols: 1420, tools: 48 }} />
            </main>
        </div>
    );
};

const Section = ({ label, items, current, onNav }: any) => (
    <div className="mb-6">
        <div className="px-4 py-2 text-[9px] text-ghost font-mono uppercase tracking-[0.3em] opacity-50">{label}</div>
        {items.map((item: any) => (
            <button key={item.id} onClick={() => onNav(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-mono uppercase tracking-widest transition-all duration-300 ${current === item.id ? 'bg-neon-cyan/10 text-neon-cyan shadow-[inset_0_0_10px_rgba(255,149,0,0.1)]' : 'text-ghost hover:text-white hover:bg-white/5'}`}>
                <item.icon size={16} className={current === item.id ? 'animate-pulse' : ''} /> {item.label}
            </button>
        ))}
    </div>
);

export default App;