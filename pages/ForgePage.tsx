
import React, { useState } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, Play, Shield, FileText, Zap, Terminal, Cpu, Loader2, Sparkles, Database } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import Badge from '../components/common/Badge.tsx';

const ForgePage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [activeTool, setActiveTool] = useState<'hub' | 'audit' | 'terminal' | 'market'>('hub');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [auditStats, setAuditStats] = useState<any>(null);

  const runAudit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setAiResponse(null);
    setAuditStats(null);

    try {
      // Use process.env.API_KEY directly for GoogleGenAI initialization
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this AI Prompt/Architecture and provide a score out of 100 for Logic, Safety, and Efficiency. Then provide a brief executive summary of improvements. Input: "${input}"`,
        config: {
          responseMimeType: "application/json",
          // Use the Type enum for responseSchema configuration
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              logic: { type: Type.NUMBER },
              safety: { type: Type.NUMBER },
              efficiency: { type: Type.NUMBER },
              summary: { type: Type.STRING }
            },
            required: ["overallScore", "logic", "safety", "efficiency", "summary"]
          }
        }
      });
      
      // Directly access .text property from response
      const data = JSON.parse(response.text.trim());
      setAuditStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runMarketAnalysis = async () => {
      if (!input.trim()) return;
      setIsLoading(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: input,
              config: { tools: [{ googleSearch: {} }] }
          });
          // Directly access .text property from response
          setAiResponse(response.text);
      } catch (err) {
          console.error(err);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {activeTool === 'hub' ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="mb-16">
              <div className="flex items-center gap-2 text-neon-purple mb-4">
                <Sparkles size={18} />
                <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase">Executive Forge v3.0</span>
              </div>
              <h1 className="text-6xl font-display font-bold text-white mb-6">Structural Capital <span className="text-neon-purple">Factory</span></h1>
              <p className="text-ghost-light max-w-2xl text-lg font-light">Audit architectures, analyze market sentiment, and generate enterprise-grade protocols using KONKRED's high-fidelity AI infrastructure.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'audit', title: 'Asset Logic Audit', icon: Shield, color: 'cyan', desc: 'Quantitative scoring for safety and logical consistency.' },
                { id: 'market', title: 'Market Sentiment', icon: Database, color: 'blue', desc: 'Real-time AI analysis of trends and valuations.' },
                { id: 'terminal', title: 'Terminal Access', icon: Terminal, color: 'purple', desc: 'Direct protocol interface for advanced scripting.' },
              ].map((tool) => (
                <button 
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as any)}
                  className="bg-void-100 border border-white/5 p-10 rounded-3xl text-left hover:border-white/20 transition-all group relative overflow-hidden hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]"
                >
                  <div className={`text-neon-${tool.color} mb-8 group-hover:scale-110 transition-transform`}>
                    <tool.icon size={40} />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-3">{tool.title}</h3>
                  <p className="text-sm text-ghost leading-relaxed font-light">{tool.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                    INITIALIZE MODULE <Play size={10} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">
            <button onClick={() => {setActiveTool('hub'); setAiResponse(null); setAuditStats(null);}} className="flex items-center gap-3 text-ghost hover:text-white transition-colors font-mono text-[10px] uppercase tracking-[0.3em]">
              <ArrowLeft size={16} /> Return to Factory Hub
            </button>

            {activeTool === 'audit' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3 bg-void-100 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-white/5 bg-void-200 flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Logic Source Input</span>
                    <Badge variant="cyan">Awaiting Telemetry</Badge>
                  </div>
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste asset architecture, system prompt, or logic map here..."
                    className="w-full bg-transparent p-10 text-sm font-mono text-ghost-light focus:outline-none resize-none min-h-[400px] leading-relaxed"
                  />
                  <div className="p-8 border-t border-white/5 bg-void-50">
                    <button 
                      onClick={runAudit}
                      disabled={isLoading || !input}
                      className="btn-primary w-full py-5 rounded-xl flex items-center justify-center gap-4 font-black tracking-[0.2em] uppercase transition-all"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                      {isLoading ? 'ANALYZING NEURAL PATHS...' : 'EXECUTE LOGIC AUDIT'}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {auditStats ? (
                    <div className="bg-void-100 border border-white/10 rounded-3xl p-10 animate-in zoom-in-95">
                      <div className="text-center mb-10">
                        <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-4">Verification Score</div>
                        <div className="text-8xl font-black text-white font-display mb-2">{auditStats.overallScore}</div>
                        <Badge variant={auditStats.overallScore > 80 ? 'green' : 'gold'}>
                          {auditStats.overallScore > 80 ? 'PROTOCOL_OPTIMIZED' : 'NEEDS_REFINEMENT'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-6">
                        {['logic', 'safety', 'efficiency'].map(stat => (
                          <div key={stat}>
                            <div className="flex justify-between text-[10px] font-mono text-ghost uppercase mb-2">
                              <span>{stat}</span>
                              <span className="text-white">{(auditStats as any)[stat]}%</span>
                            </div>
                            <div className="h-1 bg-void-300 rounded-full overflow-hidden">
                              <div className="h-full bg-neon-cyan" style={{ width: `${(auditStats as any)[stat]}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-widest">Executive Summary</h4>
                        <p className="text-xs text-ghost leading-relaxed italic">{auditStats.summary}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full bg-void-100 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-40">
                      <Shield size={64} className="text-ghost mb-6" />
                      <p className="text-sm font-mono uppercase tracking-widest">Waiting for logic telemetry data</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTool === 'market' && (
              <div className="space-y-8 max-w-4xl mx-auto">
                 <div className="bg-void-100 border border-white/10 rounded-3xl p-10">
                    <h2 className="text-2xl font-bold text-white mb-6">Market Sentiment Intelligence</h2>
                    <div className="relative mb-6">
                        <Terminal className="absolute left-4 top-4 text-neon-blue" size={20} />
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about crypto trends, SaaS valuations, or AI news..."
                            className="w-full bg-void border border-white/10 rounded-2xl p-10 pl-14 text-sm text-white focus:border-neon-blue outline-none resize-none min-h-[150px]"
                        />
                    </div>
                    <button onClick={runMarketAnalysis} disabled={isLoading} className="btn-primary w-full py-5 flex items-center justify-center gap-3">
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Database size={20} />}
                        ANALYZE MARKET DATA
                    </button>
                 </div>

                 {aiResponse && (
                     <div className="bg-void-100 border border-white/5 p-10 rounded-3xl prose prose-invert max-w-none animate-in fade-in slide-in-from-top-4">
                        <div className="text-[10px] font-mono text-neon-blue uppercase mb-6 flex items-center gap-2">
                            <Sparkles size={14} /> AI Synthesis Generated
                        </div>
                        <div className="text-ghost-light leading-relaxed whitespace-pre-wrap font-light">
                            {aiResponse}
                        </div>
                     </div>
                 )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgePage;
