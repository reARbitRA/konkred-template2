
import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, Sparkles, Cpu, Shield, Database, Terminal, Search, BarChart, Loader2, Globe } from 'lucide-react';
import { runMarketScan } from '../services/gemini.ts';
import Badge from '../components/common/Badge.tsx';
import AuditTool from '../components/forge/AuditTool.tsx';
import OptimizeTool from '../components/forge/OptimizeTool.tsx';
import SystemTerminal from '../components/forge/SystemTerminal.tsx';
import TerminalTool from '../components/forge/TerminalTool.tsx';
import GlobalMap from '../components/forge/GlobalMap.tsx';
import AgentBuilder from '../components/forge/AgentBuilder.tsx'; // New Import
import ToolSelector from '../components/forge/ToolSelector.tsx'; // New Import

const ForgePage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [activeTool, setActiveTool] = useState<'hub' | 'audit' | 'terminal' | 'market' | 'optimize' | 'builder'>('hub');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [marketResult, setMarketResult] = useState<{ text: string; sources: any[] } | null>(null);

  const handleMarketScan = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await runMarketScan(input);
      setMarketResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActiveTool = () => {
    switch (activeTool) {
        case 'audit': return <AuditTool />;
        case 'optimize': return <OptimizeTool />;
        case 'terminal': return <TerminalTool />;
        case 'builder': return <AgentBuilder />;
        case 'market': 
            return (
                <div className="max-w-5xl mx-auto space-y-12 h-full overflow-y-auto">
                    <div className="concrete-card p-12 rounded-[2.5rem] bg-black/40 border-white/10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Search className="text-neon-blue" size={24} />
                        <h2 className="text-3xl font-display font-bold text-white tracking-tight uppercase">Market Deep-Scan</h2>
                    </div>
                    <div className="relative mb-10 group">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Query market demand, pricing trends, or technical sentiment (e.g., 'What is the current demand for B2B legal contract analyzers?')..."
                            className="w-full bg-void-200 border border-white/10 rounded-2xl p-8 text-lg text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/20 outline-none transition-all resize-none min-h-[180px] font-light placeholder:text-ghost/30"
                        />
                    </div>
                    <button 
                        onClick={handleMarketScan} 
                        disabled={isLoading || !input} 
                        className="bg-neon-blue text-black w-full py-6 rounded-2xl flex items-center justify-center gap-4 uppercase font-black tracking-widest hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all disabled:opacity-30"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <BarChart size={20} />}
                        Initialize Market Synthesis
                    </button>
                    </div>

                    {marketResult && (
                    <div className="concrete-card p-12 rounded-[2.5rem] bg-black/60 border-neon-blue/20 animate-in slide-in-from-bottom-8 duration-700 shadow-2xl">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                            <div className="text-[11px] font-mono text-neon-blue font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                <Globe size={18} className="animate-pulse" /> Grounded Intelligence Packet
                            </div>
                            <Badge variant="cyan">Realtime_Source</Badge>
                        </div>
                        <div className="text-ghost-light leading-relaxed whitespace-pre-wrap text-xl font-light">
                            {marketResult.text}
                        </div>
                    </div>
                    )}
                </div>
            );
        default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-32 px-8">
      <div className="max-w-[1600px] mx-auto">
        {activeTool === 'hub' ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-ghost hover:text-white transition-colors mb-8 text-[10px] uppercase tracking-widest font-mono group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              RETURN_TO_BASE
            </button>

            <header className="mb-20 max-w-3xl">
              <div className="flex items-center gap-3 text-neon-purple mb-6">
                <Sparkles size={20} />
                <span className="text-[11px] font-mono font-black tracking-[0.5em] uppercase border-b border-neon-purple/30 pb-1">Executive Forge v3.1</span>
              </div>
              <h1 className="text-7xl font-display font-black text-white mb-8 tracking-tighter leading-none">
                Neural <span className="text-neon-purple">Enclave</span>
              </h1>
              <p className="text-ghost-light text-xl font-light leading-relaxed">
                Quantifiable validation for structural AI capital. Audit logic, simulate economies, and market-test protocols within an isolated, high-security environment.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ToolTile id="audit" title="Neural Audit" icon={Shield} color="cyan" desc="Deep-logic validation, safety verification, and technical grading for prompts." onSelect={(id: any) => setActiveTool(id)} />
              <ToolTile id="builder" title="Agent Architect" icon={Cpu} color="purple" desc="Visual node-based editor for constructing autonomous agent workflows." onSelect={(id: any) => setActiveTool(id)} />
              <ToolTile id="market" title="Market Intel" icon={Database} color="blue" desc="Grounding-enabled sentiment analysis and trend diagnostics for AI assets." onSelect={(id: any) => setActiveTool(id)} />
              <ToolTile id="terminal" title="System Terminal" icon={Terminal} color="green" desc="Direct kernel interaction for protocol simulation and execution testing." onSelect={(id: any) => setActiveTool(id)} />
            </div>
            
            <div className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-8">
                  <div className="concrete-card p-12 rounded-[3rem] bg-neon-cyan/5 border-neon-cyan/10 flex flex-col md:flex-row items-center gap-10">
                     <div className="w-32 h-32 bg-neon-cyan/10 rounded-full flex items-center justify-center border border-neon-cyan/20">
                        <Cpu size={48} className="text-neon-cyan animate-pulse" />
                     </div>
                     <div className="flex-1 space-y-4">
                        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Logic Contribution</h2>
                        <p className="text-ghost text-lg leading-relaxed font-light">Architects are encouraged to submit high-fidelity templates and guides. Verified contributions receive structural capital credits.</p>
                        <button className="text-xs font-mono font-black text-neon-cyan uppercase tracking-widest underline decoration-neon-cyan/30">Initialize Submission Packet -></button>
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-4">
                   <GlobalMap />
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500 h-[calc(100vh-10rem)] flex flex-col">
            <div className="flex justify-between items-center pb-2 flex-shrink-0">
                <button onClick={() => {setActiveTool('hub'); setInput(''); setMarketResult(null);}} className="flex items-center gap-3 text-ghost hover:text-white transition-all font-mono text-[10px] uppercase tracking-[0.4em] group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Exit_Module
                </button>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-ghost uppercase">Status: <span className="text-neon-green">Nominal</span></span>
                    <Badge variant="gray">Node_042</Badge>
                </div>
            </div>

            <div className="flex-shrink-0">
                <ToolSelector activeTool={activeTool} onSelect={(id: any) => setActiveTool(id)} />
            </div>

            <div className="flex-1 overflow-hidden relative">
                {renderActiveTool()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ToolTile = ({ id, title, icon: Icon, color, desc, onSelect }: any) => (
  <button 
    onClick={() => onSelect(id)}
    className="concrete-card p-10 rounded-[2.5rem] text-left hover:border-white/20 hover:bg-white/[0.02] transition-all group relative overflow-hidden flex flex-col h-full"
  >
    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-neon-${color}`}>
        <Icon size={120} />
    </div>
    <div className={`text-neon-${color} mb-8 group-hover:scale-110 transition-transform duration-700 h-14 w-14 bg-neon-${color}/10 rounded-2xl flex items-center justify-center border border-neon-${color}/20 shadow-inner`}>
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-display font-bold text-white mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-sm text-ghost mb-8 font-light leading-relaxed line-clamp-3 flex-grow">{desc}</p>
    <div className="flex items-center gap-3 text-[9px] font-mono text-neon-cyan font-black tracking-[0.3em] uppercase mt-auto">
        <span className="w-6 h-px bg-neon-cyan/30" /> Launch Module
    </div>
  </button>
);

export default ForgePage;
