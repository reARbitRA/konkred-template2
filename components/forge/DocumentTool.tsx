
import React, { useState } from 'react';
import { FileText, Sparkles, Download, ArrowRight, Loader2, Cpu, Database } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Badge from '../common/Badge.tsx';

const DocumentTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const synthesizeDocs = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [{ parts: [{ text: `Act as a Technical Documentation Architect. Synthesize a professional technical whitepaper, including deployment guides and structural logic maps, for the following AI protocol architecture: "${input}". Format with clear headings and markdown.` }] }]
      });
      setResult(response.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <header>
              <div className="flex items-center gap-3 text-neon-cyan mb-3">
                 <FileText size={20} />
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em]">Synthesis_Engine_v1.0</span>
              </div>
              <h2 className="text-5xl font-display font-bold text-white uppercase tracking-tighter">Doc Generator</h2>
              <p className="text-ghost text-lg mt-4 font-light">Transform raw logic maps and system prompts into enterprise-ready technical whitepapers.</p>
           </header>

           <div className="concrete-card bg-black/40 border-white/10 rounded-3xl p-8 overflow-hidden">
              <div className="mb-6 flex justify-between items-center text-[10px] font-mono text-ghost uppercase tracking-widest border-b border-white/5 pb-4">
                 <span>Logic_Packet_Input</span>
                 <span>Buffer: {input.length}/5k</span>
              </div>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste protocol architecture or system instructions..."
                className="w-full h-64 bg-transparent outline-none text-white font-mono text-sm leading-relaxed resize-none placeholder:text-ghost/30"
              />
              <button 
                onClick={synthesizeDocs}
                disabled={isLoading || !input}
                className="w-full bg-neon-cyan text-black py-5 mt-8 rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(255,149,0,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-30"
              >
                 {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                 SYNTHESIZE TECHNICAL PACKET
              </button>
           </div>
        </div>

        <div className="relative">
           {result ? (
             <div className="concrete-card p-12 rounded-[2.5rem] bg-black/60 border-neon-cyan/20 animate-in zoom-in-95 h-full max-h-[700px] overflow-y-auto">
                <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                   <Badge variant="cyan">Generated_Spec_v1</Badge>
                   <button className="text-ghost hover:text-white flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
                      <Download size={14} /> Save_PDF
                   </button>
                </header>
                <div className="prose prose-invert max-w-none text-ghost-light font-light leading-relaxed whitespace-pre-wrap">
                   {result}
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[500px] concrete-card border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center p-16 text-center group bg-black/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 group-hover:border-neon-cyan/30 transition-all duration-700">
                    <Database size={40} className="text-ghost opacity-20 group-hover:opacity-40 transition-opacity" />
                </div>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-ghost">Awaiting_Source_Uplink</p>
                <p className="text-xs text-ghost/40 mt-4 max-w-[180px] leading-relaxed">System ready for documentation synthesis. Populate logic entry node.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DocumentTool;
