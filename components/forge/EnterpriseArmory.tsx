import React, { useState, useEffect } from 'react';
import { 
  Terminal, RefreshCw, ShieldCheck, Layers, BarChart3, 
  GanttChart, Clock, Cpu, Search, Filter, Play, 
  CheckCircle2, AlertTriangle, Loader2, Sparkles, Wand2,
  ChevronRight, ArrowRight, Brain, Zap, Info, Copy,
  Code2, Palette, Layout, Smartphone
} from 'lucide-react';
import { ENTERPRISE_TOOLS, ENTERPRISE_CATEGORIES, EnterpriseTool } from '../../lib/enterpriseTools';
import { aiService } from '../../services/ai';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Badge from '../common/Badge';
import Button from '../common/Button';

export const EnterpriseArmory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(ENTERPRISE_CATEGORIES[0].id);
  const [selectedTool, setSelectedTool] = useState<EnterpriseTool | null>(null);
  const [inputData, setInputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  const filteredTools = ENTERPRISE_TOOLS.filter(t => t.category === selectedCategory);

  useEffect(() => {
    if (filteredTools.length > 0 && !selectedTool) {
      setSelectedTool(filteredTools[0]);
    }
  }, [selectedCategory]);

  const handleRunTool = async () => {
    if (!user || !selectedTool) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const prompt = `Tool: ${selectedTool.title}\nSystem Prompt: ${selectedTool.systemPrompt}\nInput: ${inputData || JSON.stringify(selectedTool.exampleData)}`;
      const response = await aiService.runGenericAgent(prompt, selectedTool.schema, user.id);
      setResult(response);
      showToast(`${selectedTool.title} execution successful.`, "success");
    } catch (err: any) {
      showToast(err.message || "Execution failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (name: string) => {
    const icons: any = { 
      RefreshCw, ShieldCheck, Layers, BarChart3, GanttChart, 
      Clock, Cpu, Terminal, Sparkles, Wand2, Palette, Code2, 
      Layout, Smartphone, CheckCircle2 
    };
    const Icon = icons[name] || Cpu;
    return <Icon size={18} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[800px]">
      {/* Sidebar: Categories & Tools */}
      <div className="lg:col-span-3 space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] font-mono text-ghost uppercase tracking-widest pl-2">Categories</label>
          <div className="grid grid-cols-1 gap-1">
            {ENTERPRISE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm ${
                  selectedCategory === cat.id 
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' 
                    : 'text-ghost hover:bg-white/5 hover:text-white'
                }`}
              >
                {getIcon(cat.icon)}
                <span className="font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <label className="text-[10px] font-mono text-ghost uppercase tracking-widest pl-2">Available Tools</label>
          <div className="grid grid-cols-1 gap-2">
            {filteredTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool);
                  setResult(null);
                  setInputData('');
                }}
                className={`group flex flex-col items-start gap-1 p-4 rounded-2xl transition-all duration-300 border ${
                  selectedTool?.id === tool.id
                    ? 'bg-white/5 border-white/20'
                    : 'border-transparent hover:border-white/5 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold uppercase tracking-tight ${selectedTool?.id === tool.id ? 'text-white' : 'text-ghost group-hover:text-ghost-light'}`}>
                    {tool.title}
                  </span>
                  {selectedTool?.id === tool.id && <Zap size={12} className="text-neon-cyan animate-pulse" />}
                </div>
                <span className="text-[10px] text-ghost/60 leading-tight line-clamp-2 text-left">
                  {tool.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        {selectedTool && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Input Panel */}
              <div className="flex flex-col gap-4">
                <div className="concrete-card bg-black/40 border-white/5 rounded-3xl p-8 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-ghost">
                        <Terminal size={14} />
                      </div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">Input_Payload</h4>
                    </div>
                    <Badge variant="gray" className="font-mono text-[9px]">JSON / TEXT</Badge>
                  </div>

                  <textarea
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder={JSON.stringify(selectedTool.exampleData, null, 2)}
                    className="flex-1 w-full bg-transparent text-sm font-mono text-ghost-light resize-none focus:outline-none placeholder:text-ghost/20 leading-relaxed"
                  />

                  <div className="pt-6 border-t border-white/5 flex gap-4">
                    <Button 
                      variant="primary" 
                      className="flex-1 py-5"
                      onClick={handleRunTool}
                      isLoading={isLoading}
                      leftIcon={<Play size={16} />}
                    >
                      EXECUTE AGENT
                    </Button>
                    <button 
                      onClick={() => setInputData(JSON.stringify(selectedTool.exampleData, null, 2))}
                      className="px-6 rounded-2xl bg-white/5 border border-white/10 text-ghost hover:text-white text-[10px] font-mono uppercase tracking-widest transition-all"
                    >
                      LOAD_MOCK
                    </button>
                  </div>
                </div>
              </div>

              {/* Output / Visualization Panel */}
              <div className="flex flex-col gap-4">
                <div className="concrete-card bg-black/60 border-white/10 rounded-3xl p-8 flex flex-col h-full relative overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 bg-void/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                      <Loader2 size={40} className="text-neon-cyan animate-spin" />
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-mono text-neon-cyan animate-pulse">NEURAL_UPLINK_ACTIVE</span>
                        <span className="text-[10px] text-ghost italic mt-2">Parsing enterprise logic patterns...</span>
                      </div>
                    </div>
                  )}

                  {!result && !isLoading && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                      <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                        <Brain size={32} className="text-ghost" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-ghost">Waiting for execution</p>
                        <p className="text-xs text-ghost/60 max-w-[200px] mx-auto">Select a tool and provide input data to generate autonomous findings.</p>
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-neon-cyan" />
                          <h4 className="text-xs font-display font-black text-white uppercase tracking-widest">Execution_Result</h4>
                        </div>
                        <button onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                          showToast("Result copied.", "info");
                        }} className="p-2 bg-white/5 rounded-lg text-ghost hover:text-white">
                          <Copy size={14} />
                        </button>
                      </div>

                      {/* Dynamic Visualization Based on Result Structure */}
                      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Block */}
                        {result.summary && (
                          <div className="p-6 bg-neon-cyan/5 border border-neon-cyan/10 rounded-2xl">
                            <p className="text-sm text-ghost-light leading-relaxed italic">"{result.summary}"</p>
                          </div>
                        )}

                        {/* List Rendering (Tasks, Issues, Matches) */}
                        {Object.entries(result).map(([key, value]) => {
                          if (Array.isArray(value)) {
                            return (
                              <div key={key} className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-[10px] font-mono text-neon-cyan font-bold uppercase tracking-widest">{key}</h5>
                                  <Badge variant="gray">{value.length} items</Badge>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                  {value.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                                      {typeof item === 'object' ? (
                                        <div className="space-y-2">
                                          {Object.entries(item).map(([iKey, iVal]) => (
                                            <div key={iKey} className="flex justify-between items-start gap-4">
                                              <span className="text-[9px] font-mono text-ghost/50 uppercase">{iKey}:</span>
                                              <span className="text-[11px] text-white text-right font-medium">{String(iVal)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-xs text-white">{String(item)}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}

                        {/* Analysis Block (for Auto-Fixer) */}
                        {result.analysis && (
                          <div className="grid grid-cols-3 gap-4">
                            {Object.entries(result.analysis).map(([label, val]: any) => (
                              <div key={label} className="p-4 bg-white/5 rounded-2xl text-center border border-white/5">
                                <div className="text-xl font-display font-black text-white">{val}</div>
                                <div className="text-[9px] font-mono text-ghost uppercase tracking-tighter mt-1">{label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
