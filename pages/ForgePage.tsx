import React, { useState, useEffect } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, Hammer, Shield, Lock, Wallet, ChevronRight, CheckCircle2, ShieldCheck, Cpu, RefreshCw, Layers, Coins, Terminal, Zap, Sparkles, Wand2 } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { ForgeTerminal } from '../components/enclave/ForgeTerminal.tsx';
import { EnterpriseArmory } from '../components/forge/EnterpriseArmory.tsx';
import { ENTERPRISE_TOOLS, EnterpriseTool } from '../lib/enterpriseTools.ts';

const ForgePage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [selectedProduct, setSelectedProduct] = useState<EnterpriseTool | null>(null);
  const [isCheckouting, setIsCheckouting] = useState(false);
  const [currency, setCurrency] = useState<'usdt' | 'btc' | 'eth'>('usdt');
  const [paymentStep, setPaymentStep] = useState<'selection' | 'deposit' | 'confirming' | 'success'>('selection');
  const [address, setAddress] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes session
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Featured tools from the real library
  const featuredTools = ENTERPRISE_TOOLS.slice(0, 4);

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

  const handleOpenCheckout = (tool: EnterpriseTool) => {
    setSelectedProduct(tool);
    setIsCheckouting(true);
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

        {/* Store Grid - REAL ENTERPRISE TOOLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredTools.map((p) => {
            const isLocked = false; // Real tools are always available
            return (
              <div 
                key={p.id}
                className="concrete-card p-8 lg:p-10 rounded-[2.5rem] bg-black/40 border border-white/10 hover:border-neon-cyan/30 hover:shadow-[0_0_40px_rgba(204,255,0,0.05)] transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <Badge variant="cyan" className="px-4 py-1.5 font-mono text-[10px] tracking-widest uppercase">
                      ENTERPRISE_GRADE
                    </Badge>
                    <span className="font-mono text-base font-bold text-white tracking-widest opacity-40">
                      $29.00 / MO
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3.5 rounded-2xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 group-hover:scale-110 transition-transform duration-500">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight group-hover:text-neon-cyan transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-[10px] font-mono text-ghost/90 font-bold uppercase tracking-widest mt-1">
                        {p.category} // ARMORY_UNIT
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-ghost-light leading-relaxed font-light mb-8">
                    {p.description} This production-ready logic unit integrates directly into your existing ERP sub-layers for autonomous verification.
                  </p>
                </div>

                {/* Interaction Button */}
                <div className="pt-8 border-t border-white/5 mt-auto">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-mono tracking-widest text-neon-cyan font-bold flex items-center gap-2">
                      <ShieldCheck size={14} className="animate-pulse" /> ACTIVE_DISPATCH_READY
                    </span>
                    <button 
                      onClick={() => handleOpenCheckout(p)}
                      className="bg-neon-cyan text-black px-8 py-4 rounded-2xl font-mono text-[10px] font-black tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                    >
                      ACQUIRE_UNIT <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION DIVIDER & ENTERPRISE FIN-OPS ARMORY WORKSPACE */}
        <div className="pt-20 border-t border-white/5 space-y-12">
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2.5 text-neon-cyan">
              <Terminal size={18} className="animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-black">ACTIVE DEVELOPMENT ENVIRONMENT</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-display font-black text-white uppercase tracking-tight">
              Enterprise <span className="text-neon-cyan font-mono select-all">Fin-Ops Armory_</span>
            </h2>
            
            <p className="text-ghost-light text-sm lg:text-base font-light leading-relaxed">
              Interact directly with the sandbox execution environments of our core accounting automation suite. Select any protocol to review raw compliance schemas, mock test inputs, validation logs, and audit summaries.
            </p>
          </div>

          <div className="bg-void-200 border border-white/5 rounded-[2.5rem] p-6 lg:p-10">
            <EnterpriseArmory />
          </div>
        </div>

        {/* Dynamic Terminal Checkout Overlay */}
        {isCheckouting && selectedProduct && (
          <div className="fixed inset-0 bg-void/90 backdrop-blur-md z-50 flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300">
            <div className="w-full max-w-3xl h-[600px] max-h-[85vh]">
              <ForgeTerminal 
                product={{ title: selectedProduct.title, price: "$29.00 USD" }} 
                onClose={() => setIsCheckouting(false)} 
                onSuccess={() => {
                  setTimeout(() => setIsCheckouting(false), 3000);
                }} 
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgePage;
