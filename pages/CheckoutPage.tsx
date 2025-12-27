import React, { useState, useEffect } from 'react';
import { Listing, LicenseType, PageView } from '../types.ts';
import { LICENSE_TYPES } from '../constants.ts';
import { Shield, CreditCard, Lock, ChevronRight, Check, Zap, Coins, Copy, Loader2, RefreshCw } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

const CheckoutPage: React.FC<{ listing: Listing; onNavigate: (page: any) => void }> = ({ listing, onNavigate }) => {
    const [license, setLicense] = useState<LicenseType>('personal');
    const [paymentStep, setPaymentStep] = useState<'selection' | 'processing' | 'confirmed'>('selection');
    const [selectedCrypto, setSelectedCrypto] = useState('USDT');
    
    const selectedLicense = LICENSE_TYPES.find(l => l.id === license)!;
    const subtotal = listing.pricing.amount * selectedLicense.multiplier;
    const tax = 0; // Crypto often has zero tax/platform handles it
    const total = subtotal + tax;

    const cryptoAssets = [
        { id: 'USDT', name: 'Tether (ERC20)', address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' },
        { id: 'BTC', name: 'Bitcoin', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
        { id: 'ETH', name: 'Ethereum', address: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac' },
    ];

    const currentCrypto = cryptoAssets.find(c => c.id === selectedCrypto)!;

    const handlePayment = () => {
        setPaymentStep('processing');
        // Simulate block confirmation
        setTimeout(() => {
            setPaymentStep('confirmed');
        }, 5000);
    };

    if (paymentStep === 'confirmed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-void p-6 animate-in fade-in zoom-in-95">
                <div className="max-w-md w-full bg-void-100 border border-neon-green/30 p-12 text-center rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <div className="w-20 h-20 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="text-neon-green" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Acquisition Confirmed</h1>
                    <p className="text-ghost text-sm mb-8">Transaction successfully validated on-chain. Asset has been added to your Library.</p>
                    <button onClick={() => onNavigate('usage')} className="btn-primary w-full py-4 uppercase font-bold tracking-widest">
                        Access Asset
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void pt-28 pb-32">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* Left: NowPayments Integration */}
                <div className="space-y-10">
                    <header>
                        <div className="flex items-center gap-2 text-neon-cyan mb-2">
                            <Coins size={20} />
                            <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">NowPayments Protocol v4.0</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white">Secure Crypto Checkout</h1>
                        <p className="text-ghost text-sm mt-2 font-light">Global decentralized settlement for intellectual capital.</p>
                    </header>

                    {paymentStep === 'selection' ? (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-mono font-bold text-ghost uppercase tracking-widest">License Scope</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {LICENSE_TYPES.map(l => (
                                        <div 
                                            key={l.id} 
                                            onClick={() => setLicense(l.id as LicenseType)}
                                            className={`p-5 border-2 rounded-xl cursor-pointer transition-all flex justify-between items-center ${license === l.id ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/5 bg-void-200 hover:border-white/10'}`}
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-white">{l.name}</p>
                                                <p className="text-[10px] text-ghost font-mono uppercase mt-1">Multiplier: {l.multiplier}x</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">${(listing.pricing.amount * l.multiplier).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-mono font-bold text-ghost uppercase tracking-widest">Select Asset</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {cryptoAssets.map(c => (
                                        <button 
                                            key={c.id} 
                                            onClick={() => setSelectedCrypto(c.id)}
                                            className={`py-4 rounded-xl border-2 font-bold text-xs transition-all ${selectedCrypto === c.id ? 'border-neon-cyan bg-neon-cyan/10 text-white' : 'border-white/5 bg-void-300 text-ghost hover:text-white'}`}
                                        >
                                            {c.id}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handlePayment} className="w-full bg-white text-black py-5 rounded-xl font-black tracking-widest hover:bg-neon-cyan transition-all flex items-center justify-center gap-3">
                                INITIATE CRYPTO SETTLEMENT <ChevronRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="bg-void-100 border border-white/10 rounded-2xl p-10 text-center space-y-6 animate-pulse-slow">
                            <Loader2 size={40} className="text-neon-cyan animate-spin mx-auto" />
                            <h3 className="text-xl font-bold text-white">Awaiting Blockchain Confirmation</h3>
                            <div className="bg-black/40 p-6 rounded-xl border border-white/5 text-left">
                                <p className="text-[10px] text-ghost font-mono uppercase mb-2">Deposit Address ({selectedCrypto})</p>
                                <div className="flex items-center gap-3 bg-void p-3 rounded border border-white/10">
                                    <code className="text-[11px] text-white flex-1 truncate">{currentCrypto.address}</code>
                                    <Copy size={14} className="text-ghost hover:text-neon-cyan cursor-pointer" />
                                </div>
                                <div className="mt-4 p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg flex items-center gap-3">
                                    <RefreshCw size={16} className="text-neon-cyan animate-spin" />
                                    <p className="text-[11px] text-neon-cyan font-mono">Status: Monitoring mempool...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Summary */}
                <div className="lg:sticky lg:top-32 h-fit bg-void-100 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5">
                        <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Acquisition Summary</h3>
                        <div className="flex gap-6">
                            <div className="w-20 h-20 bg-void-300 rounded-2xl border border-white/10 flex items-center justify-center">
                                <Zap size={32} className="text-neon-cyan" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-white mb-1">{listing.title}</h4>
                                <Badge variant="cyan">{listing.type}</Badge>
                                <div className="mt-2 text-xs text-ghost font-mono">FORGE AUDIT SCORE: {listing.auditScore}%</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-ghost">Asset Value</span>
                            <span className="text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-mono text-neon-green">
                            <span>NowPayments Fee</span>
                            <span>$0.00</span>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex justify-between font-bold text-2xl">
                            <span className="text-white">TOTAL</span>
                            <span className="text-neon-cyan">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;