import React, { useState, useEffect } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, Hammer, Shield, Lock, Wallet, ChevronRight, CheckCircle2, ShieldCheck, Cpu, RefreshCw, Layers, Coins } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

interface Product {
  id: string;
  title: string;
  tagline: string;
  price: string;
  desc: string;
  features: string[];
  status: 'available' | 'locked';
  releaseDate?: string;
  badge: string;
}

const ForgePage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckouting, setIsCheckouting] = useState(false);
  const [currency, setCurrency] = useState<'usdt' | 'btc' | 'eth'>('usdt');
  const [walletConnected, setWalletConnected] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'deposit' | 'confirming' | 'success'>('selection');
  const [address, setAddress] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes session
  const [isSimulating, setIsSimulating] = useState(false);

  // Clean, premium design listings
  const products: Product[] = [
    {
      id: 'agentic_kit',
      title: 'Agentic Loop & Memory Protection Kit',
      tagline: 'Defensive context containment for multi-agent loops',
      price: '$29.00 USD',
      badge: 'Core Guard',
      desc: 'Inject real-time protection shields inside agent context memory. Implements custom sliding-window buffers to prevent logic loops, hallucinations, and critical vector drift during long-horizon iterations.',
      features: [
        'Logic Loop Deterring Interceptors',
        'Real-time Softmax Weights Cohesion Gauge',
        'Stochastic Noise Mitigation Filters',
        'Dual-Layer Context Boundary Checkpoints'
      ],
      status: 'available'
    },
    {
      id: 'vector_shield',
      title: 'Vector DB Redundancy Shield',
      tagline: 'High-availability memory fallbacks',
      price: '$89.00 USD',
      badge: 'Drop #02',
      desc: 'Automatic mirroring and healing of vector db coordinates during runtime memory drift incidents.',
      features: [
        'Dynamic Cosine Similarity Auto-healing',
        'Multi-vector Cluster Redundant Nodes',
        'Instaneous Weight Discrepancy Alerting'
      ],
      status: 'locked',
      releaseDate: 'DROP #02: JULY 2026'
    },
    {
      id: 'anti_collision',
      title: 'Multi-Agent Anti-Collision Core',
      tagline: 'Logic convergence controller',
      price: '$120.00 USD',
      badge: 'Drop #02',
      desc: 'Synthesizes neural tokens from multi-agents into a unified, conflict-free logic timeline tree.',
      features: [
        'Asynchronous Goal Reconciliation Arrays',
        'Deterministic Hierarchy Token Gates',
        'Stochastic Deadlock Breaker Algorithms'
      ],
      status: 'locked',
      releaseDate: 'DROP #02: JULY 2026'
    },
    {
      id: 'noise_filter',
      title: 'Stochastic Noise Filter Core',
      tagline: 'Background noise suppressor',
      price: '$45.00 USD',
      badge: 'Drop #02',
      desc: 'Removes cascading background noise spikes triggered during parallel model queries.',
      features: [
        'High-Pass Logit Amplitude Sieve',
        'Bystander Cross-Talk Suppressors',
        'Dynamic Softmax Temperature Stabilizer'
      ],
      status: 'locked',
      releaseDate: 'DROP #02: JULY 2026'
    }
  ];

  // Address lookup map for simulation
  const addressMap = {
    usdt: 'TYK8pYm7cZ5U86oRExZ6vNTnNYmHnnyTYK',
    btc: 'bc1qdq7fpxrtn78v9m7kyymmsmdluhvsnnt46rre7l',
    eth: '0xc94770007dd3a98114002341d4a13b41d2f8bdfc'
  };

  useEffect(() => {
    let t: any;
    if (isCheckouting && countdown > 0 && paymentStep === 'deposit') {
      t = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(t);
  }, [isCheckouting, countdown, paymentStep]);

  const handleOpenCheckout = (product: Product) => {
    if (product.status === 'locked') return;
    setSelectedProduct(product);
    setIsCheckouting(true);
    setPaymentStep('selection');
    setWalletConnected(false);
    setCountdown(600);
  };

  const handleSelectPaymentDetails = (selectedCurrency: 'usdt' | 'btc' | 'eth') => {
    setCurrency(selectedCurrency);
    const destAddr = addressMap[selectedCurrency];
    setAddress(destAddr);
    // Connect to external dynamic QR Code API
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=ccff00&bgcolor=050505&qzone=2&data=${encodeURIComponent(destAddr)}`);
    setPaymentStep('deposit');
  };

  const handleSimulatePaymentProcess = () => {
    setIsSimulating(true);
    setPaymentStep('confirming');
    
    // Simulate real block-chain confirmation states
    setTimeout(() => {
      setPaymentStep('success');
      setIsSimulating(false);
    }, 4000);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-32 px-6">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Back navigation */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        {/* Head */}
        <header className="border-b border-white/5 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-neon-cyan mb-2">
            <Hammer size={16} className="animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-bold">PRODUCTION GRADE ARMORY</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-black text-white leading-none uppercase">
            The <span className="text-neon-cyan select-all font-mono">Forge_</span>
          </h1>
          <p className="text-ghost-light text-base lg:text-lg font-light max-w-3xl leading-relaxed">
            Acquire production-ready logic kits, redundancy matrices, and adversarial filters designed to lock down agent-loop execution channels.
          </p>
        </header>

        {/* Store Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((p) => {
            const isLocked = p.status === 'locked';
            return (
              <div 
                key={p.id}
                className={`concrete-card p-8 lg:p-10 rounded-[2rem] bg-black/40 border flex flex-col justify-between transition-all group ${
                  isLocked 
                    ? 'border-white/5 opacity-70 hover:opacity-85' 
                    : 'border-white/10 hover:border-neon-cyan/30 hover:shadow-[0_0_20px_rgba(204,255,0,0.05)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant={isLocked ? 'gray' : 'cyan'}>
                      {p.badge}
                    </Badge>
                    <span className="font-mono text-base font-bold text-white tracking-widest">
                      {isLocked ? 'STOCKED_SOON' : p.price}
                    </span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight group-hover:text-neon-cyan transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs font-mono text-ghost/90 font-bold uppercase tracking-wider mt-1.5">
                    {p.tagline}
                  </p>
                  
                  <p className="text-sm text-ghost-light leading-relaxed font-light mt-4 mb-6">
                    {p.desc}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 mb-8 font-mono text-[11px] text-white/80">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${isLocked ? 'bg-ghost' : 'bg-neon-cyan animate-pulse'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interaction Button */}
                <div className="pt-6 border-t border-white/5 mt-auto">
                  {isLocked ? (
                    <div className="flex items-center justify-between w-full font-mono text-[10px] tracking-widest text-[#ff3b3b] font-black uppercase">
                      <span className="flex items-center gap-1.5">
                        <Lock size={12} /> LOCKED // {p.releaseDate}
                      </span>
                      <button disabled className="bg-white/5 border border-white/5 text-ghost cursor-not-allowed px-4 py-2.5 rounded-lg">
                        ACQUIRE_CLOSED
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-mono tracking-widest text-neon-cyan font-bold flex items-center gap-1.5">
                        <ShieldCheck size={14} className="animate-spin" /> ACTIVE_DISPATCH_CELL
                      </span>
                      <button 
                        onClick={() => handleOpenCheckout(p)}
                        className="bg-neon-cyan text-black px-6 py-3.5 rounded-xl font-mono text-[10px] font-black tracking-widest hover:scale-105 transition-all flex items-center gap-1"
                      >
                        UP_LINK_LICENSE <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic NOWPayments Checkout Modal inside Viewport */}
        {isCheckouting && selectedProduct && (
          <div className="fixed inset-0 bg-void/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-void-100 border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative flex flex-col justify-between max-h-[90vh]">
              
              {/* Header */}
              <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-2 text-neon-cyan">
                  <Coins size={18} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">NOWPAYMENTS // CRYPTO PIPELINE</span>
                </div>
                <button 
                  onClick={() => setIsCheckouting(false)}
                  className="font-mono text-ghost hover:text-white text-xs uppercase"
                >
                  [ CANCEL ]
                </button>
              </div>

              {/* Status Display Area */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                
                {/* Product Summary Mini Card */}
                <div className="bg-void p-5 rounded-2xl border border-white/5 flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[8px] text-ghost uppercase block">Acquiring License:</span>
                    <span className="text-white text-xs font-black uppercase tracking-tight">{selectedProduct.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-ghost uppercase block">Net Cost:</span>
                    <span className="text-neon-cyan font-bold">{selectedProduct.price}</span>
                  </div>
                </div>

                {/* Step 1: Selection */}
                {paymentStep === 'selection' && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Configure Settlement Currency</h4>
                      <p className="text-xs text-ghost leading-relaxed">NOWPayments ensures automated zero-commission routing through lightning-validated chains.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {(['usdt', 'btc', 'eth'] as const).map((coin) => (
                        <button
                          key={coin}
                          type="button"
                          onClick={() => handleSelectPaymentDetails(coin)}
                          className="border border-white/5 hover:border-neon-cyan/20 bg-void p-5 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all group"
                        >
                          <div className={`h-11 w-11 rounded-xl bg-neon-cyan/5 flex items-center justify-center text-neon-cyan group-hover:scale-105 transition-all`}>
                            <Coins size={22} />
                          </div>
                          <span className="font-mono font-bold uppercase text-white tracking-widest text-[11px] block mt-1">{coin}</span>
                          <span className="text-[8px] text-ghost font-mono">
                            {coin === 'usdt' ? 'TRC-20' : coin === 'btc' ? 'Native BTC' : 'ERC-20'}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Trust Wallet Option */}
                    <div className="pt-4 border-t border-white/5 space-y-4">
                      <div className="flex items-center gap-2 text-white font-mono text-[10px] uppercase font-bold text-ghost">
                        <Wallet size={12} className="text-neon-cyan" />
                        <span>Direct Secure Handshake</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setWalletConnected(true);
                          // Auto route to usdt settlement if clicked connected
                          setTimeout(() => {
                            handleSelectPaymentDetails('usdt');
                          }, 1500);
                        }}
                        disabled={walletConnected}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-mono text-[10px] tracking-widest uppercase font-black transition-all ${
                          walletConnected 
                            ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
                        }`}
                      >
                        {walletConnected ? (
                          <>
                            <CheckCircle2 size={14} /> Trust Wallet Connected
                          </>
                        ) : (
                          <>
                            <Wallet size={14} /> Connect Trust Wallet
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Deposit Address + QR Code */}
                {paymentStep === 'deposit' && (
                  <div className="space-y-6 text-center animate-in slide-in-from-bottom-2 duration-300 font-mono text-[10px]">
                    <div className="space-y-2">
                      <span className="text-neon-cyan font-bold tracking-widest uppercase text-[10px] border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-1 rounded">
                        AWAITING_TRANSACTION_PAYMENT
                      </span>
                      <p className="text-ghost leading-normal max-w-sm mx-auto font-sans mt-2">
                        Complete your payment by depositing exactly to the address below via your wallet.
                      </p>
                    </div>

                    {/* Scan QR Area */}
                    {qrUrl && (
                      <div className="bg-void p-4 border border-white/10 rounded-2xl max-w-[240px] mx-auto aspect-square flex items-center justify-center overflow-hidden">
                        <img 
                          src={qrUrl} 
                          alt="NOWPayments QR Invoice code" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* Copy Address */}
                    <div className="space-y-1.5 max-w-sm mx-auto text-left bg-void p-3.5 border border-white/5 rounded-xl">
                      <label className="text-ghost text-[8px] uppercase tracking-wider block">Destination Address ({currency.toUpperCase()})</label>
                      <div className="flex items-center justify-between gap-3 text-[11px] text-white">
                        <span className="truncate select-all select-all font-bold">{address}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(address);
                          }}
                          className="text-neon-cyan hover:underline text-[9px] uppercase hover:text-white"
                        >
                          [ COPY ]
                        </button>
                      </div>
                    </div>

                    {/* Simulation Panel explicitly requested by platform protocols */}
                    <div className="bg-neon-cyan/5 border border-neon-cyan/15 rounded-2xl p-5 max-w-md mx-auto space-y-4">
                      <div className="flex items-center justify-between text-[9px] text-ghost">
                        <span className="flex items-center gap-1.5 font-bold">
                          <RefreshCw size={10} className="animate-spin" /> Session Expiry:
                        </span>
                        <span className="text-white font-mono font-bold text-xs">{formatTime(countdown)}</span>
                      </div>
                      
                      <button
                        onClick={handleSimulatePaymentProcess}
                        disabled={isSimulating}
                        className="w-full bg-neon-cyan text-black py-4 uppercase tracking-widest font-black text-[10px] rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        {isSimulating ? 'Validating Deposit...' : 'Simulate Payment Deposit'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Block validation Progress */}
                {paymentStep === 'confirming' && (
                  <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-500 font-mono text-[10px]">
                    <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/25 mx-auto flex items-center justify-center text-neon-cyan animate-spin">
                      <RefreshCw size={26} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Securing Block Confirmations_</h4>
                      <p className="text-ghost max-w-xs mx-auto leading-normal font-sans">
                        Validating deposit signature on the membrane. This usually takes between 1-3 blocks depending on network velocity.
                      </p>
                    </div>

                    <div className="max-w-xs mx-auto space-y-2 text-left uppercase text-[9px] text-ghost pt-4">
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>1. Mempool Uplink handshake:</span>
                        <span>SUCCESS</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>2. Deposit Found signature:</span>
                        <span>VERIFIED</span>
                      </div>
                      <div className="flex justify-between items-center text-neon-cyan animate-pulse">
                        <span>3. Transaction Validation checkpoints:</span>
                        <span>BLOCKS (2/3)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Core Validation success */}
                {paymentStep === 'success' && (
                  <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-500 font-mono text-[10px]">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={32} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base font-bold text-white uppercase tracking-widest">Handshake Complete // License Acquired</h4>
                      <p className="text-ghost max-w-sm mx-auto leading-relaxed font-sans">
                        The cryptographic license for <span className="text-white font-bold">{selectedProduct.title}</span> has been dispatched to your secure local Enclave.
                      </p>
                    </div>

                    <div className="border border-white/5 rounded-xl p-4 bg-void max-w-xs mx-auto text-left font-mono space-y-2">
                      <div className="text-white font-bold tracking-wider uppercase border-b border-white/5 pb-1">UPLINK RECEIPT</div>
                      <div className="flex justify-between text-ghost text-[8px]">
                        <span>TxID Segment:</span>
                        <span className="text-white select-all">tx_98d7f2...a9e</span>
                      </div>
                      <div className="flex justify-between text-ghost text-[8px]">
                        <span>Secure Node:</span>
                        <span className="text-emerald-400">NODE_042</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsCheckouting(false)}
                      className="w-full max-w-xs bg-neon-cyan text-black py-4 rounded-xl uppercase font-black tracking-widest text-[10px] hover:shadow-[0_0_15px_rgba(204,255,0,0.2)] transition-all"
                    >
                      Return to Armory
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgePage;
