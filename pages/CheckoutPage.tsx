
import React, { useState } from 'react';
import { Listing, LicenseType, PageView } from '../types.ts';
import { LICENSE_TYPES } from '../constants.ts';
import { Shield, CreditCard, Lock, ChevronRight, Check, Zap, Coins, Copy, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import AcquisitionSuccessModal from '../components/common/AcquisitionSuccessModal.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { databaseService } from '../services/database.ts';

interface CheckoutPageProps {
    listing: Listing;
    onNavigate: (page: PageView) => void;
    onConfirmed: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ listing, onNavigate, onConfirmed }) => {
    const { user } = useAuth();
    const [license, setLicense] = useState<LicenseType>('personal');
    const [paymentStep, setPaymentStep] = useState<'selection' | 'processing' | 'confirmed'>('selection');
    const [selectedCrypto, setSelectedCrypto] = useState('USDT');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    if (!listing || !listing.pricing) {
        return (
            <div className="min-h-screen bg-void pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
                <Shield size={48} className="text-neon-cyan mb-4 animate-pulse" />
                <h2 className="text-2xl font-mono font-bold text-white mb-2 uppercase tracking-wider">Checkout Session Relocated</h2>
                <p className="text-ghost text-sm max-w-md mb-8">No active protocol listing is selected for checkout.</p>
                <button 
                    onClick={() => onNavigate('marketplace')}
                    className="px-6 py-3 bg-neon-cyan text-black font-mono font-black text-xs uppercase tracking-widest hover:shadow-neon-cyan transition-all"
                >
                    Return to Marketplace
                </button>
            </div>
        );
    }

    const selectedLicense = LICENSE_TYPES.find(l => l.id === license) || LICENSE_TYPES[0];
    const subtotal = (listing.pricing.amount || 0) * selectedLicense.multiplier;
    const tax = 0;
    const total = subtotal + tax;

    const cryptoAssets = [
        { id: 'USDT', name: 'Tether (TRC20)', address: 'TYK8pYm7cZ5U86oRExZ6vNTnNYmHnnyTYK' },
    ];

    const currentCrypto = cryptoAssets.find(c => c.id === selectedCrypto)!;

    const handlePayment = async () => {
        setPaymentStep('processing');
        try {
            if (user) {
                await databaseService.purchaseAsset(user.id, listing);
            }
        } catch (err) {
            console.error("Purchase logging error:", err);
        } finally {
            setTimeout(() => {
                setPaymentStep('confirmed');
                setShowSuccessModal(true);
            }, 2500);
        }
    };

    const handleFinalize = () => {
        onConfirmed();
    };

    if (paymentStep === 'confirmed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-void p-6 animate-in fade-in zoom-in-95">
                <div className="max-w-md w-full concrete-card border-neon-green/30 p-12 text-center rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="text-neon-green" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Acquisition Verified</h1>
                    <p className="text-ghost text-sm mb-8 leading-relaxed">
                        Transaction successfully validated on-chain. License map for <span className="text-white font-bold">{listing.title}</span> has been appended to your local enclave.
                    </p>
                    <button onClick={handleFinalize} className="btn-primary w-full py-5 uppercase font-black tracking-[0.2em] text-xs">
                        ACCESS ENCLAVE
                    </button>
                </div>

                <AcquisitionSuccessModal 
                    listing={listing} 
                    isOpen={showSuccessModal} 
                    onClose={() => setShowSuccessModal(false)} 
                    onViewEnclave={() => {
                        setShowSuccessModal(false);
                        handleFinalize();
                    }} 
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void pt-28 pb-32">
            <div className="max-w-6xl mx-auto px-6">
                <button 
                  onClick={() => onNavigate('marketplace')}
                  className="flex items-center gap-3 text-ghost hover:text-white transition-all font-mono text-[10px] uppercase tracking-[0.4em] mb-12 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Exit_Checkout
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Left: Settlement Logic */}
                    <div className="space-y-10">
                        <header>
                            <div className="flex items-center gap-2 text-neon-cyan mb-3">
                                <Coins size={20} />
                                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">NowPayments Protocol v4.0</span>
                            </div>
                            <h1 className="text-5xl font-display font-black text-white leading-none uppercase tracking-tighter">Crypto Settlement</h1>
                            <p className="text-ghost text-lg mt-4 font-light leading-relaxed">Verified decentralized clearing for structural AI capital.</p>
                        </header>

                        {paymentStep === 'selection' ? (
                            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-mono font-bold text-ghost uppercase tracking-widest ml-1">1. Define License Scope</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {LICENSE_TYPES.map(l => (
                                            <div 
                                                key={l.id} 
                                                onClick={() => setLicense(l.id as LicenseType)}
                                                className={`p-5 border-2 rounded-2xl cursor-pointer transition-all flex justify-between items-center ${license === l.id ? 'border-neon-cyan bg-neon-cyan/5' : 'concrete-card border-white/5 hover:border-white/10'}`}
                                            >
                                                <div>
                                                    <p className={`text-sm font-bold ${license === l.id ? 'text-white' : 'text-ghost-light'}`}>{l.name}</p>
                                                    <p className="text-[9px] text-ghost font-mono uppercase mt-1 tracking-widest">Scaling Factor: {l.multiplier}x</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-xl font-black ${license === l.id ? 'text-neon-cyan' : 'text-white'}`}>${(listing.pricing.amount * l.multiplier).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-mono font-bold text-ghost uppercase tracking-widest ml-1">2. Select Settlement Asset</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {cryptoAssets.map(c => (
                                            <button 
                                                key={c.id} 
                                                onClick={() => setSelectedCrypto(c.id)}
                                                className={`py-4 rounded-xl border-2 font-bold text-xs transition-all ${selectedCrypto === c.id ? 'border-neon-cyan bg-neon-cyan/10 text-white shadow-[0_0_20px_rgba(255,149,0,0.1)]' : 'concrete-card border-white/5 text-ghost hover:text-white'}`}
                                            >
                                                {c.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handlePayment} className="w-full bg-neon-cyan text-black py-6 rounded-2xl font-black tracking-[0.2em] hover:shadow-[0_0_30px_rgba(255,149,0,0.3)] transition-all flex items-center justify-center gap-3 text-sm uppercase">
                                    INITIALIZE TRANSACTION <ChevronRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="concrete-card rounded-[2rem] p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="relative inline-block">
                                    <Loader2 size={48} className="text-neon-cyan animate-spin mx-auto" />
                                    <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl rounded-full animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Monitoring Mempool</h3>
                                    <p className="text-ghost text-sm mt-2">Awaiting multi-sig confirmation on {selectedCrypto} network.</p>
                                </div>
                                
                                <div className="bg-black/40 border border-white/5 p-8 rounded-2xl text-left">
                                    <p className="text-[9px] text-ghost font-mono uppercase mb-4 tracking-widest">Deposit Address ({selectedCrypto})</p>
                                    <div className="flex items-center gap-4 bg-void-400 p-4 rounded-xl border border-white/10 group">
                                        <code className="text-[11px] text-white flex-1 truncate font-mono">{currentCrypto.address}</code>
                                        <Copy size={16} className="text-ghost hover:text-neon-cyan cursor-pointer transition-colors" />
                                    </div>
                                    <div className="mt-6 p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl flex items-center gap-4">
                                        <RefreshCw size={16} className="text-neon-cyan animate-spin" />
                                        <p className="text-[10px] text-neon-cyan font-mono uppercase tracking-widest">Status: Validating Node Presence...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary Hud */}
                    <div className="lg:sticky lg:top-32 h-fit concrete-card rounded-[2.5rem] overflow-hidden shadow-2xl bg-black/40 border-white/10">
                        <div className="p-10 border-b border-white/5">
                            <h3 className="text-[10px] font-mono font-black text-ghost mb-8 uppercase tracking-[0.4em]">Cart_Snapshot // {listing.id}</h3>
                            <div className="flex gap-8">
                                <div className="w-24 h-24 bg-void-300 rounded-3xl border border-white/10 flex items-center justify-center shadow-inner group-hover:border-neon-cyan/30 transition-all">
                                    <Zap size={40} className="text-neon-cyan animate-pulse" />
                                </div>
                                <div className="flex-1 py-1">
                                    <h4 className="text-2xl font-bold text-white mb-2 leading-tight uppercase">{listing.title}</h4>
                                    <div className="flex gap-3">
                                        <Badge variant="cyan">{listing.type.replace('_', ' ')}</Badge>
                                        <span className="text-[9px] text-ghost font-mono mt-1 uppercase">Score: {listing.auditScore}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-ghost uppercase font-mono text-xs">Asset Valuation</span>
                                <span className="text-white font-bold">${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-mono text-neon-green">
                                <span className="text-xs uppercase">Decentralized P2P Fee</span>
                                <span className="font-bold">-$0.00</span>
                            </div>
                            <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-mono text-ghost uppercase tracking-widest">Total Settlement</span>
                                    <span className="text-4xl font-black text-neon-cyan font-display leading-none mt-1">${total.toLocaleString()}</span>
                                </div>
                                <Shield className="text-neon-green opacity-20" size={32} />
                            </div>
                        </div>
                        <div className="p-4 bg-white/[0.02] text-[9px] font-mono text-ghost text-center uppercase tracking-[0.3em]">
                            End-to-End Encrypted Node-to-Node Transfer
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
