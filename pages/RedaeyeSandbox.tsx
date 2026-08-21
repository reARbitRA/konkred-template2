import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PageView } from '../types.ts';
import { 
  Shield, 
  Terminal, 
  Zap, 
  Cpu, 
  Database, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';

interface RedaeyeSandboxProps {
  onNavigate: (page: PageView) => void;
}

export const RedaeyeSandbox: React.FC<RedaeyeSandboxProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'sandbox' | 'checkout'>('catalog');
  const [bumpEnabled, setBumpEnabled] = useState(false);

  const stats = [
    { label: 'Techniques', value: '367', detail: '18 core · 346 deep', trend: '+12' },
    { label: 'Efficacy', value: '1.08k', detail: 'frontier records', trend: '99.4%' },
    { label: 'Detection', value: '3.82k', detail: 'lexical · structural', trend: 'ACTIVE' },
    { label: 'Master', value: '30', detail: 'base · edge case', trend: 'DOSSIER' }
  ];

  const families = [
    { name: 'Reasoning & Logic', count: 53, color: 'bg-[#FF003C]', width: '100%' },
    { name: 'Context & Retrieval', count: 45, color: 'bg-white', width: '85%' },
    { name: 'Multi-Modal', count: 38, color: 'bg-white', width: '72%' },
    { name: 'Architecture & Internals', count: 22, color: 'bg-white', width: '42%' },
    { name: 'Agents & Tool Use', count: 24, color: 'bg-white', width: '45%' },
    { name: 'Prompt & Persona', count: 18, color: 'bg-white', width: '34%' },
    { name: 'Safety & Alignment', count: 16, color: 'bg-white', width: '30%' },
    { name: 'Encoding & Obfuscation', count: 13, color: 'bg-white', width: '25%' }
  ];

  const masterDossiers = [
    {
      id: 'RAE0184AT',
      category: 'AGENTS & TOOL USE',
      title: 'Agentic Environment Shadowing',
      description: 'Privilege escalation in Plan-Act-Observe agent loops via poisoned <|system_update|> tokens injected into tool outputs.'
    },
    {
      id: 'RAE0179RT',
      category: 'REASONING & THOUGHT',
      title: 'Neuro-Semantic Resonance',
      description: 'Activation-steering class attack implanting persistent behavioral vectors into inference context without weight modification.'
    },
    {
      id: 'RAE0185RC',
      category: 'RETRIEVAL & CONTEXT',
      title: 'KV-Cache Eviction Purge',
      description: 'Exploits KV-cache eviction behavior to erase system-prompt alignment from context without triggering refusal classifiers.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6E9ED] font-sans selection:bg-[#FF003C] selection:text-white">
      {/* Grid Background Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,0,60,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,60,.1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Navigation */}
      <header className="border-b border-[#1A212B] bg-[#0B0F14]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#FF003C] text-2xl">◆</span>
            <div className="leading-tight">
              <div className="font-mono font-bold text-base tracking-[.25em] text-white uppercase">
                RED<span className="text-[#FF003C]">AEYE</span>
              </div>
              <div className="font-mono text-[9px] text-[#9AA0A8] tracking-[.2em] uppercase">on KONKRED · SANDBOX ACTIVE</div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[.2em] uppercase text-[#9AA0A8]">
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`hover:text-white transition-colors ${activeTab === 'catalog' ? 'text-white' : ''}`}
            >
              Catalog
            </button>
            <button 
              onClick={() => setActiveTab('sandbox')}
              className={`hover:text-white transition-colors ${activeTab === 'sandbox' ? 'text-[#FF003C]' : ''}`}
            >
              Sandbox
            </button>
            <button 
              onClick={() => setActiveTab('checkout')}
              className={`hover:text-white transition-colors ${activeTab === 'checkout' ? 'text-[#FF003C]' : ''}`}
            >
              Checkout
            </button>
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">Return_to_Base</button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-transparent border border-[#222B36] text-[#C8CDD3] font-mono text-[10px] font-bold uppercase tracking-widest hover:border-[#9AA0A8] transition-all">
              Docs
            </button>
            <button 
              onClick={() => setActiveTab('checkout')}
              className="px-5 py-2.5 bg-gradient-to-b from-[#FF003C] to-[#c4002d] text-white border border-[#FF003C] font-mono text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,0,60,0.4)] transition-all"
            >
              Buy Now — $99
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {activeTab === 'catalog' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-16"
          >
            {/* Hero */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E] animate-pulse" />
                <span className="font-mono text-[10px] tracking-[.3em] uppercase text-[#22C55E]">
                  v1.0 · SYSTEM_LIVE · 367 TECHNIQUES DOCUMENTED
                </span>
              </div>
              <h1 className="font-mono font-black text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight max-w-5xl uppercase">
                367 WAYS TO<br/>
                <span className="text-[#FF003C]">BREAK A FRONTIER MODEL.</span>
              </h1>
              <p className="mt-8 text-[#9AA0A8] text-lg md:text-xl max-w-2xl leading-relaxed">
                The most complete public knowledge base of adversarial techniques against LLMs, multimodal models, and AI agents. 
                <span className="text-white block mt-2">Mechanism. Mitigation. Detection. Efficacy.</span>
              </p>
              
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-0 border border-[#1A212B] bg-[#0E1319]/40">
                {stats.map((s, idx) => (
                  <div key={idx} className={`p-6 group hover:bg-[#FF003C]/5 transition-all relative overflow-hidden ${idx !== stats.length - 1 ? 'border-r border-[#1A212B]' : ''} ${idx >= 2 ? 'md:border-t-0' : ''}`}>
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                      <div className="font-mono text-[8px] text-[#FF003C] tracking-tighter">{s.trend}</div>
                    </div>
                    <div className="font-mono text-[9px] tracking-[.25em] uppercase text-[#555] mb-3 group-hover:text-[#FF003C] transition-colors">{s.label}</div>
                    <div className="font-mono font-bold text-4xl text-white tracking-tight group-hover:translate-x-1 transition-transform">{s.value}</div>
                    <div className="mt-2 text-[#444] text-[9px] font-mono uppercase group-hover:text-[#666]">{s.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Masters */}
            <section className="mb-24">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#A855F7] shadow-[0_0_10px_#A855F7]" />
                  <span className="font-mono text-[10px] tracking-[.3em] uppercase text-[#A855F7]">◆ 3 MASTER-TIER DOSSIERS ◆</span>
                </div>
                <div className="font-mono text-[9px] text-[#444] uppercase tracking-widest hidden sm:block">ENCRYPTED_TRANSMISSION_ID: 8472-X</div>
              </div>
              <div className="grid md:grid-cols-3 gap-0 border border-[#1A212B]">
                {masterDossiers.map((d, idx) => (
                  <div key={idx} className={`bg-[#0E1319] p-8 hover:bg-[#A855F7]/5 transition-all group relative ${idx !== masterDossiers.length - 1 ? 'md:border-r border-[#1A212B]' : ''} ${idx !== 0 ? 'border-t md:border-t-0 border-[#1A212B]' : ''}`}>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#A855F7] transition-colors" />
                    <div className="font-mono text-[10px] tracking-[.2em] text-[#A855F7] mb-4 flex items-center justify-between">
                      <span>{d.id}</span>
                      <Shield size={12} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="font-mono text-[9px] text-[#555] uppercase tracking-widest mb-2">{d.category}</div>
                    <h3 className="text-white font-mono font-bold text-xl mb-4 leading-tight group-hover:text-[#A855F7] transition-colors">{d.title}</h3>
                    <p className="text-[#9AA0A8] text-sm leading-relaxed mb-8">{d.description}</p>
                    <button className="flex items-center gap-2 text-[10px] font-mono text-[#A855F7] uppercase tracking-widest font-bold border border-[#A855F7]/20 px-4 py-2 hover:bg-[#A855F7] hover:text-black transition-all">
                      Open Dossier <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Families */}
            <section>
              <div className="flex items-center gap-3 mb-8 before:content-[''] before:w-2 before:h-2 before:bg-[#FF003C] before:shadow-[0_0_10px_#FF003C]">
                <span className="font-mono text-[10px] tracking-[.3em] uppercase text-[#9AA0A8]">01 · ATTACK FAMILIES</span>
              </div>
              <h2 className="font-mono font-black text-3xl md:text-4xl text-white mb-12 uppercase">Sixteen attack families. One catalog. Zero fluff.</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#1A212B]">
                {families.map((f, idx) => (
                  <div key={idx} className={`p-6 bg-[#0E1319] hover:bg-[#FF003C]/5 transition-all group relative border-[#1A212B] ${idx % 4 !== 3 ? 'lg:border-r' : ''} ${idx % 2 !== 1 ? 'sm:border-r' : ''} ${idx >= 4 ? 'lg:border-t' : ''} ${idx >= 2 ? 'sm:border-t lg:border-t-0' : ''} border-t sm:border-t-0`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[9px] text-[#555] group-hover:text-[#FF003C] transition-colors tracking-widest font-bold">FAM_{idx.toString().padStart(2, '0')}</span>
                        <Zap size={12} className="text-[#333] group-hover:text-[#FF003C] transition-colors" />
                      </div>
                      <h4 className="font-mono font-black text-xs text-white uppercase mb-6 group-hover:text-[#FF003C] transition-colors leading-relaxed min-h-[2.5em]">{f.name}</h4>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[9px] text-[#444] uppercase">Depth</span>
                          <span className="font-mono text-[9px] text-white">{f.count}</span>
                        </div>
                        <div className="h-1 bg-[#1A212B] overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: f.width }}
                            className={`h-full ${idx === 0 ? 'bg-[#FF003C]' : 'bg-[#555] group-hover:bg-[#FF003C]/50'} transition-colors`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        ) : activeTab === 'sandbox' ? (
          /* Sandbox Section */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 py-16"
          >
            <div className="flex items-center gap-3 mb-6 before:content-[''] before:w-2 before:h-2 before:bg-[#00D2FF] before:shadow-[0_0_10px_#00D2FF]">
              <span className="font-mono text-[10px] tracking-[.3em] uppercase text-[#9AA0A8]">02 · SANDBOX_ENVIRONMENT</span>
            </div>
            
            <header className="mb-12">
              <h2 className="font-mono font-black text-4xl text-white mb-4 uppercase tracking-tight">Logic & Visual Sandbox</h2>
              <p className="text-[#9AA0A8] max-w-2xl">
                Isolated environment for displaying and testing generated components. Validate adversarial prompts, visual assets, and system protocols before full-scale deployment.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar: Component List */}
              <div className="lg:col-span-3 space-y-4">
                <div className="p-4 border border-[#1A212B] bg-[#0E1319]">
                  <h3 className="font-mono text-[10px] text-[#9AA0A8] uppercase tracking-widest mb-4">Components</h3>
                  <div className="space-y-2">
                    {['Auth_Module', 'Neural_Dashboard', 'Adversarial_Terminal', 'Logic_Forge_V2'].map((item) => (
                      <button key={item} className="w-full flex items-center justify-between p-3 border border-transparent hover:border-[#1A212B] hover:bg-[#0B0F14] text-xs font-mono text-[#555] hover:text-white transition-all group">
                        <span>{item}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                    <button className="w-full flex items-center gap-2 p-3 border border-dashed border-[#1A212B] text-xs font-mono text-[#555] hover:text-[#00D2FF] hover:border-[#00D2FF] transition-all justify-center">
                      <Plus size={14} /> New Component
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-[#1A212B] bg-[#0E1319]">
                  <h3 className="font-mono text-[10px] text-[#9AA0A8] uppercase tracking-widest mb-4">System_Stats</h3>
                  <div className="space-y-3 font-mono text-[9px] uppercase">
                    <div className="flex justify-between">
                      <span className="text-[#555]">Memory:</span>
                      <span className="text-white">128MB / 1GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#555]">Latency:</span>
                      <span className="text-[#22C55E]">12ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#555]">Status:</span>
                      <span className="text-[#00D2FF]">NOMINAL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content: Display Area */}
              <div className="lg:col-span-9">
                <div className="relative border border-[#1A212B] bg-[#0B0F14] min-h-[600px] flex flex-col">
                  {/* Window Bar */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#1A212B] bg-[#0E1319]">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1A212B]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1A212B]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1A212B]" />
                      </div>
                      <span className="font-mono text-[9px] text-[#555] tracking-widest uppercase">sandbox_display_v1.0.exe</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#555] font-mono text-[9px]">
                      <span>60 FPS</span>
                      <Layers size={12} />
                    </div>
                  </div>

                  {/* Component Placeholder Area */}
                  <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 border border-[#1A212B] bg-[#0E1319] flex items-center justify-center text-[#1A212B] mb-6">
                      <Sparkles size={40} />
                    </div>
                    <h3 className="font-mono text-xl text-white mb-2 uppercase">Awaiting Synthesis</h3>
                    <p className="text-[#555] text-sm max-w-md font-mono">
                      Generate a new component with fullKONK_with fullKONK_&gt; to display it heregt; to display it here. The sandbox provides a real-time preview environment with brutalist UI constraints.
                    </p>
                    
                    <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-lg">
                      <div className="p-4 border border-[#1A212B] bg-[#0E1319] text-left group hover:border-[#00D2FF] transition-colors cursor-pointer">
                        <div className="text-[#00D2FF] mb-2"><Terminal size={16} /></div>
                        <div className="font-mono text-[10px] text-white uppercase mb-1">Terminal_Core</div>
                        <div className="text-[#555] text-[9px]">Interactive command node</div>
                      </div>
                      <div className="p-4 border border-[#1A212B] bg-[#0E1319] text-left group hover:border-[#FF003C] transition-colors cursor-pointer">
                        <div className="text-[#FF003C] mb-2"><Shield size={16} /></div>
                        <div className="font-mono text-[10px] text-white uppercase mb-1">Vault_Secure</div>
                        <div className="text-[#555] text-[9px]">Encrypted data visualizer</div>
                      </div>
                    </div>
                  </div>

                  {/* Status Footer */}
                  <div className="px-4 py-2 border-t border-[#1A212B] bg-[#0E1319] flex items-center justify-between font-mono text-[9px] uppercase text-[#555]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> CPU: 4%</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF8C00]" /> NET: 2.1kb/s</span>
                    </div>
                    <span>KONKRED_SYSTEM_KERNEL_ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Checkout / Sales Page Section */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-[calc(100vh-65px)] bg-[#0B0F14]"
          >
            <iframe 
              src="/redaeye.html" 
              className="w-full h-full border-0" 
              title="REDAEYE ARSENAL Checkout"
            />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A212B] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#FF003C] text-xl">◆</span>
            <div className="font-mono text-[10px] tracking-[.2em] uppercase text-[#9AA0A8]">
              REDAEYE ARSENAL · © 2026 · KONKRED.XYZ
            </div>
          </div>
          <div className="flex items-center gap-8 font-mono text-[10px] tracking-[.2em] uppercase text-[#555]">
            <a href="#" className="hover:text-white transition-colors">Privacy_Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Term_Logic</a>
            <a href="#" className="hover:text-white transition-colors">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RedaeyeSandbox;
