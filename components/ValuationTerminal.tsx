
import React, { useState, useMemo, useEffect } from 'react';
import { X, LayoutDashboard, Database, Settings, Search, ArrowLeft, Loader2, Link as LinkIcon, Zap, TrendingUp, Percent, DollarSign, Activity, Cpu, Lock, RefreshCw, BarChart2 } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import Badge from './common/Badge.tsx';
import VoiceOrb from './common/VoiceOrb.tsx';

interface ValuationTerminalProps {
  onExit: () => void;
}

const ValuationTerminal: React.FC<ValuationTerminalProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [groundingUrls, setGroundingUrls] = useState<{ uri: string, title?: string }[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- DCF State ---
  const [dcfParams, setDcfParams] = useState({
    revenue: 5000000,
    growthRate: 15,
    margin: 25,
    wacc: 10,
    terminalGrowth: 3
  });

  // --- Config State ---
  const [config, setConfig] = useState({
    neuralEngine: true,
    autoHedge: false,
    latencyOptim: true,
    dataStream: 'Encrypted',
    riskTolerance: 'Moderate'
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingAI(true);
    setError(null);
    setAiResponse(null);
    setGroundingUrls([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ parts: [{ text: searchQuery }] }],
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

      setAiResponse(text || 'System failed to synthesize a response. Connection verified but telemetry data empty.');

      if (groundingChunks && Array.isArray(groundingChunks)) {
        const urls = groundingChunks
          .filter(chunk => chunk.web?.uri)
          .map(chunk => ({
            uri: chunk.web!.uri!,
            title: chunk.web!.title,
          }));
        setGroundingUrls(urls);
      }

    } catch (err: any) {
      console.error("Gemini API error:", err);
      if (err.message?.includes("Rpc failed") || err.message?.includes("xhr error")) {
        setError("Network latency or API gateway error detected. Please retry the uplink.");
      } else {
        setError(err.message || "An unexpected neural disruption occurred.");
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const toggleVoice = () => {
      setIsListening(!isListening);
      if (!isListening) {
          setTimeout(() => {
              setSearchQuery("Analyze the trend of autonomous agent valuations in Q4...");
              setIsListening(false);
              setTimeout(() => handleSearch(), 500);
          }, 3000);
      }
  };

  // --- DCF Logic ---
  const dcfProjections = useMemo(() => {
    const years = 5;
    let currentRev = dcfParams.revenue;
    const projections = [];
    let cumulativeDCF = 0;

    for (let i = 1; i <= years; i++) {
        currentRev = currentRev * (1 + dcfParams.growthRate / 100);
        const ebit = currentRev * (dcfParams.margin / 100);
        const taxRate = 0.21;
        const fcf = ebit * (1 - taxRate); // Simplified FCF
        const discountFactor = 1 / Math.pow((1 + dcfParams.wacc / 100), i);
        const pv = fcf * discountFactor;
        
        cumulativeDCF += pv;
        projections.push({ year: i, revenue: currentRev, fcf, pv });
    }

    // Terminal Value
    const lastFCF = projections[years - 1].fcf;
    const terminalValue = (lastFCF * (1 + dcfParams.terminalGrowth / 100)) / ((dcfParams.wacc - dcfParams.terminalGrowth) / 100);
    const pvTerminal = terminalValue / Math.pow((1 + dcfParams.wacc / 100), years);
    
    const enterpriseValue = cumulativeDCF + pvTerminal;

    return { projections, enterpriseValue, terminalValue: pvTerminal };
  }, [dcfParams]);

  const renderDashboardContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-6 text-white font-display">Market Intel Terminal</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="concrete-card p-6 border border-white/5 hover:border-neon-cyan/30 transition-all duration-300">
            <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-2">
              {i === 1 ? 'Structural Index' : i === 2 ? 'Liquidity Velocity' : 'Neural Demand'}
            </div>
            <div className="text-3xl font-black text-white font-display mb-2">
              {i === 1 ? '1,240.50' : i === 2 ? '84.2%' : 'High'}
            </div>
            <div className={`text-xs flex items-center gap-1 font-mono ${i === 3 ? 'text-neon-cyan' : 'text-neon-green'}`}>
              {i === 3 ? 'CRITICAL' : '+2.4%'} <span className="text-ghost">24h</span>
            </div>
          </div>
        ))}
      </div>

      <div className="concrete-card p-8 border border-white/5 bg-void-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Zap size={120} />
        </div>

        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} className="text-neon-cyan" /> Autonomous Market Analysis
        </h3>
        
        <div className="flex gap-4 items-center mb-6">
            <div className="flex-1">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Query market indices or ask for specific valuation multiples..."
                    className="flex-grow bg-void border border-white/10 focus:border-neon-cyan px-6 py-4 text-sm text-white placeholder-ghost outline-none font-light transition-all rounded-xl"
                    disabled={isLoadingAI || isListening}
                />
                <button
                    type="submit"
                    className="btn-primary py-4 px-8 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
                    disabled={isLoadingAI || !searchQuery}
                >
                    {isLoadingAI ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    {isLoadingAI ? 'Scanning...' : 'Scan'}
                </button>
                </form>
            </div>
            
            <VoiceOrb isListening={isListening} onToggle={toggleVoice} />
        </div>

        {isListening && (
            <div className="mb-6 p-4 bg-neon-red/5 border border-neon-red/10 rounded-xl text-center animate-in fade-in">
                <p className="text-neon-red font-mono text-xs uppercase tracking-widest animate-pulse">Listening on secure channel...</p>
            </div>
        )}

        {error && (
          <div className="bg-neon-red/10 border border-neon-red/30 text-neon-red p-4 rounded-xl text-[10px] font-mono mb-6 animate-in fade-in">
            [ SYSTEM_ERROR ]: {error}
          </div>
        )}

        {aiResponse && (
          <div className="mt-4 p-8 concrete-card bg-void/40 border border-white/5 rounded-xl max-h-[500px] overflow-y-auto text-sm text-ghost-light animate-in fade-in leading-relaxed font-light custom-scrollbar">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">Synthesis Report</span>
                <span className="text-[10px] font-mono text-ghost uppercase">Source: Deep_Graph_v4</span>
            </div>
            <p className="whitespace-pre-wrap">{aiResponse}</p>

            {groundingUrls.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <h5 className="text-[10px] font-mono font-bold text-ghost uppercase tracking-widest mb-4">Verification Sources</h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groundingUrls.map((url, index) => (
                    <li key={index} className="flex items-center gap-2 truncate">
                      <LinkIcon size={12} className="text-neon-cyan flex-shrink-0" />
                      <a
                        href={url.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ghost-light hover:text-white transition-colors text-xs truncate underline decoration-white/10"
                        title={url.title || url.uri}
                      >
                        {url.title || url.uri}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  const renderModelsContent = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <header className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">DCF Modeling Engine</h2>
            <p className="text-ghost font-mono text-xs uppercase tracking-[0.2em] mt-2">Discounted Cash Flow Valuation</p>
        </div>
        <Badge variant="purple">Kernel_v2.4</Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="concrete-card p-8 bg-black/40 border-white/5 rounded-3xl space-y-8">
            <div className="space-y-6">
                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ghost">
                        <span>Projected Revenue</span>
                        <span className="text-white">${dcfParams.revenue.toLocaleString()}</span>
                    </div>
                    <input 
                        type="range" min="100000" max="50000000" step="100000"
                        value={dcfParams.revenue}
                        onChange={(e) => setDcfParams({...dcfParams, revenue: parseInt(e.target.value)})}
                        className="w-full h-1 bg-void-300 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ghost">
                        <span>Growth Rate (YoY)</span>
                        <span className="text-white">{dcfParams.growthRate}%</span>
                    </div>
                    <input 
                        type="range" min="1" max="100" 
                        value={dcfParams.growthRate}
                        onChange={(e) => setDcfParams({...dcfParams, growthRate: parseInt(e.target.value)})}
                        className="w-full h-1 bg-void-300 rounded-lg appearance-none cursor-pointer accent-neon-green"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ghost">
                        <span>EBIT Margin</span>
                        <span className="text-white">{dcfParams.margin}%</span>
                    </div>
                    <input 
                        type="range" min="1" max="80" 
                        value={dcfParams.margin}
                        onChange={(e) => setDcfParams({...dcfParams, margin: parseInt(e.target.value)})}
                        className="w-full h-1 bg-void-300 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ghost">
                        <span>WACC (Discount)</span>
                        <span className="text-white">{dcfParams.wacc}%</span>
                    </div>
                    <input 
                        type="range" min="5" max="25" step="0.5"
                        value={dcfParams.wacc}
                        onChange={(e) => setDcfParams({...dcfParams, wacc: parseFloat(e.target.value)})}
                        className="w-full h-1 bg-void-300 rounded-lg appearance-none cursor-pointer accent-neon-gold"
                    />
                </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-8">
                <div className="text-[9px] font-mono text-ghost uppercase tracking-widest mb-1">Implied Enterprise Value</div>
                <div className="text-3xl font-black text-white font-display">${Math.round(dcfProjections.enterpriseValue).toLocaleString()}</div>
            </div>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2 concrete-card p-8 bg-black/40 border-white/5 rounded-3xl flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-10">
                {[1,2,3,4,5,6].map(i => <div key={i} className="border-r border-white/20 h-full" />)}
            </div>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">FCF Projection (5Y)</h3>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-ghost uppercase">
                        <div className="w-2 h-2 bg-neon-cyan rounded-sm" /> PV Cash Flow
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-ghost uppercase">
                        <div className="w-2 h-2 bg-neon-purple rounded-sm" /> Terminal Value
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-end justify-between gap-4 relative z-10 pl-4 border-l border-white/10 pb-4 border-b">
                {dcfProjections.projections.map((p, i) => {
                    const heightPercent = (p.pv / (dcfProjections.projections[dcfProjections.projections.length - 1].pv * 1.5)) * 100;
                    return (
                        <div key={i} className="flex-1 flex flex-col justify-end group relative">
                            <div className="text-[10px] text-white font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                ${Math.round(p.pv/1000)}k
                            </div>
                            <div 
                                className="w-full bg-neon-cyan/20 border-t-2 border-neon-cyan rounded-t-sm transition-all duration-500 hover:bg-neon-cyan/40"
                                style={{ height: `${heightPercent}%` }}
                            />
                            <div className="mt-2 text-center text-[9px] font-mono text-ghost">Y{p.year}</div>
                        </div>
                    );
                })}
                {/* Terminal Bar */}
                <div className="flex-1 flex flex-col justify-end group relative">
                     <div className="text-[10px] text-white font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        ${Math.round(dcfProjections.terminalValue/1000)}k
                    </div>
                    <div 
                        className="w-full bg-neon-purple/20 border-t-2 border-neon-purple rounded-t-sm transition-all duration-500 hover:bg-neon-purple/40"
                        style={{ height: '80%' }}
                    />
                    <div className="mt-2 text-center text-[9px] font-mono text-neon-purple font-bold">TERM</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const renderConfigContent = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <Cpu size={48} className="text-white mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold text-white">System Configuration</h2>
            <p className="text-ghost text-sm mt-2">Manage local node parameters and cryptographic keys.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="concrete-card p-8 bg-black/40 border-white/5 rounded-3xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Core Protocols</h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-white">Neural Engine</div>
                            <div className="text-[10px] text-ghost">Hardware acceleration for inference</div>
                        </div>
                        <button 
                            onClick={() => setConfig({...config, neuralEngine: !config.neuralEngine})}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${config.neuralEngine ? 'bg-neon-green' : 'bg-void-400'}`}
                        >
                            <div className={`w-4 h-4 bg-black rounded-full transition-transform ${config.neuralEngine ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-bold text-white">Latency Optimization</div>
                            <div className="text-[10px] text-ghost">Pre-fetch grounding sources</div>
                        </div>
                        <button 
                            onClick={() => setConfig({...config, latencyOptim: !config.latencyOptim})}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${config.latencyOptim ? 'bg-neon-cyan' : 'bg-void-400'}`}
                        >
                            <div className={`w-4 h-4 bg-black rounded-full transition-transform ${config.latencyOptim ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="concrete-card p-8 bg-black/40 border-white/5 rounded-3xl">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Security Enclave</h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock size={16} className="text-neon-gold" />
                            <span className="text-sm font-bold text-white">Encryption Level</span>
                        </div>
                        <Badge variant="gold">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity size={16} className="text-neon-purple" />
                            <span className="text-sm font-bold text-white">Risk Tolerance</span>
                        </div>
                        <select className="bg-void-400 border border-white/10 text-[10px] text-white rounded-lg px-2 py-1 outline-none">
                            <option>Conservative</option>
                            <option>Moderate</option>
                            <option>Aggressive</option>
                        </select>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                            <RefreshCw size={14} /> ROTATE API KEYS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-void text-zinc-100 flex flex-col font-sans animate-in fade-in duration-500">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button
            onClick={onExit}
            className="text-ghost hover:text-white transition-all flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={14} />
            [ EXIT TERMINAL ]
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="font-display font-bold text-white tracking-tight">EXECUTIVE VALUATION TERMINAL</span>
          <Badge variant="cyan" className="ml-2">v4.2.0-STABLE</Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[9px] font-mono text-ghost uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></span>
            Telemetry Online
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <aside className="w-64 border-r border-white/5 bg-void-50 flex flex-col py-8">
          <div className="space-y-2 px-4">
             {[
               { id: 'dashboard', label: 'MARKET_OVERVIEW', icon: LayoutDashboard },
               { id: 'models', label: 'DCF_KERNELS', icon: Database },
               { id: 'config', label: 'SYSTEM_CONFIG', icon: Settings },
             ].map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-4 px-5 py-4 text-[10px] font-mono font-bold tracking-widest rounded-xl transition-all ${activeTab === item.id ? 'bg-neon-cyan text-black' : 'text-ghost hover:text-white hover:bg-white/5'}`}
               >
                 <item.icon size={16} />
                 {item.label}
               </button>
             ))}
          </div>

          <div className="mt-auto px-8 py-6 border-t border-white/5 text-[9px] font-mono text-ghost leading-relaxed opacity-40 uppercase tracking-widest">
            UPLINK: ACTIVE<br/>
            PROTOCOL: KONKRED_AES256<br/>
            DIVERSITY: OPTIMIZED
          </div>
        </aside>

        <main className="flex-grow relative overflow-auto p-12 brutalist-bg">
           <div className="absolute inset-0 z-0 opacity-[0.05] grid-bg pointer-events-none" />

           <div className="relative z-10 max-w-6xl mx-auto space-y-12">
             {activeTab === 'dashboard' && renderDashboardContent()}
             {activeTab === 'models' && renderModelsContent()}
             {activeTab === 'config' && renderConfigContent()}
           </div>
        </main>
      </div>
    </div>
  );
};

export default ValuationTerminal;
