
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, RefreshCw, Copy, Check, Split, Activity, Gauge } from 'lucide-react';
import { runAudit } from '../../services/gemini.ts'; // Re-using gemini service structure for simplicity
import Button from '../common/Button.tsx';
import Badge from '../common/Badge.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';

const OptimizeTool: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [metrics, setMetrics] = useState<{ clarity: number; tokens: number; efficiency: number } | null>(null);
  const { showToast } = useToast();

  const handleOptimize = () => {
    if (!input.trim()) return;
    setIsOptimizing(true);
    setMetrics(null);
    setOutput('');

    // Simulation of an advanced AI optimization chain
    setTimeout(() => {
      const optimizedText = `[SYSTEM_DIRECTIVE]: Act as an expert domain architect.\n\n[CONTEXT]: ${input}\n\n[CONSTRAINTS]:\n1. Output strictly in JSON format.\n2. Prioritize deterministic logic.\n3. Eliminate ambiguous tokens.\n\n[EXECUTION]: Proceed with high-fidelity generation based on the above parameters.`;
      
      setOutput(optimizedText);
      setMetrics({
        clarity: 98,
        tokens: -12, // Reduction
        efficiency: 94
      });
      setIsOptimizing(false);
      showToast("Neural Optimization Complete.", "success");
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    showToast("Optimized payload copied to clipboard.", "info");
  };

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end pb-6 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight flex items-center gap-3">
            <Sparkles className="text-neon-purple" size={28} /> Prompt Refiner
          </h2>
          <p className="text-ghost text-sm mt-2 font-light">Reduce token usage and increase deterministic output reliability via our fine-tuned LLM layer.</p>
        </div>
        <div className="flex gap-4">
           {metrics && (
             <div className="flex gap-4 animate-in slide-in-from-right-4 fade-in">
                <MetricBadge label="Clarity" value={`${metrics.clarity}%`} icon={Activity} color="green" />
                <MetricBadge label="Token Delta" value={`${metrics.tokens}%`} icon={Split} color="cyan" />
                <MetricBadge label="Efficiency" value={`${metrics.efficiency}/100`} icon={Gauge} color="purple" />
             </div>
           )}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Input Panel */}
        <div className="flex flex-col concrete-card bg-black/40 border-white/5 rounded-3xl overflow-hidden group focus-within:border-white/20 transition-colors">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <span className="text-[10px] font-mono text-ghost uppercase tracking-widest font-bold">Raw_Input_Stream</span>
            <Badge variant="gray">Human_Input</Badge>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="// Paste your raw prompt or agent instructions here..."
            className="flex-1 bg-transparent p-6 text-sm font-mono text-ghost-light focus:text-white outline-none resize-none leading-relaxed placeholder:text-ghost/30 selection:bg-neon-purple/30"
          />
          <div className="p-6 border-t border-white/5 bg-void-300/50">
             <div className="text-[9px] font-mono text-ghost uppercase tracking-widest mb-4">Optimization Vectors</div>
             <div className="flex gap-2">
                <Badge variant="gray" className="opacity-50">Zero-Shot</Badge>
                <Badge variant="gray" className="opacity-50">Chain-of-Thought</Badge>
                <Badge variant="gray" className="opacity-50">JSON_Enforcement</Badge>
             </div>
          </div>
        </div>

        {/* Action Center (Mobile/Desktop split) */}
        <div className="lg:hidden">
            <Button onClick={handleOptimize} isLoading={isOptimizing} className="w-full">Run Optimization</Button>
        </div>

        {/* Output Panel */}
        <div className={`flex flex-col concrete-card rounded-3xl overflow-hidden transition-all duration-500 relative ${output ? 'bg-neon-purple/5 border-neon-purple/20' : 'bg-black/20 border-white/5 border-dashed'}`}>
          
          {/* Central Action Button (Desktop absolute) */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 hidden lg:block">
             <button 
                onClick={handleOptimize}
                disabled={isOptimizing || !input}
                className="w-8 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isOptimizing ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
             </button>
          </div>

          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <span className="text-[10px] font-mono text-neon-purple uppercase tracking-widest font-black">Optimized_Payload</span>
            <div className="flex gap-2">
               {output && (
                 <button onClick={copyToClipboard} className="text-ghost hover:text-white transition-colors">
                    <Copy size={14} />
                 </button>
               )}
               <Badge variant="purple">v4.0_Model</Badge>
            </div>
          </div>

          <div className="flex-1 relative p-6 overflow-y-auto">
             {isOptimizing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                   <div className="w-16 h-16 border-4 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin" />
                   <div className="text-[10px] font-mono text-neon-purple uppercase tracking-widest animate-pulse">Refining Logic Structure...</div>
                </div>
             ) : output ? (
                <div className="font-mono text-sm text-white leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                   {output}
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                   <Zap size={48} className="text-ghost mb-4" />
                   <p className="text-xs font-mono uppercase tracking-widest">Awaiting Input Stream</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBadge = ({ label, value, icon: Icon, color }: any) => (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-neon-${color}/5 border border-neon-${color}/20`}>
        <Icon size={14} className={`text-neon-${color}`} />
        <div className="flex flex-col">
            <span className="text-[8px] font-mono text-ghost uppercase tracking-widest">{label}</span>
            <span className={`text-xs font-black text-neon-${color} font-mono`}>{value}</span>
        </div>
    </div>
);

export default OptimizeTool;
