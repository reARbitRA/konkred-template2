import React, { useState, useEffect, useRef } from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, Terminal, Image, Cpu, Send, Sparkles, Sliders, Play, RefreshCw, Layers, ShieldCheck } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  time?: string;
}

const PlaygroundsPage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'inference' | 'image'>('inference');

  // Chat/Inference Console States
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'SYSTEM: Handshake complete. Cerebras/Groq ultra-low-latency node active [Model: Llama-3.3-70B-Speculative].' },
    { role: 'assistant', content: 'Uplink established. Ready to receive high-throughput instructions. How can I assist with your logic architecture today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // Image Forge States
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [imgSeed, setImgSeed] = useState(42);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const userText = userInput.trim();
    setUserInput('');

    const newMsg: Message = { role: 'user', content: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    const startTime = Date.now();

    try {
      // Build the list of text inputs for Gemini 3.5 Flash
      // Note: we can use process.env.API_KEY which aligns to the Gemini API key!
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY || '' });
      
      const systemInstruction = `You are Llama 3.3 70B driving a high-speed Cerebras/Groq inference node. 
You must respond with clinical technical precision, zero marketing fluff, and raw markdown code blocks where applicable. 
Adopt an authoritative, elite software architect developer persona representing the KONKRED platform.`;

      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
      contents.push({ role: 'user', parts: [{ text: userText }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature,
          maxOutputTokens: maxTokens
        }
      });

      const latency = Date.now() - startTime;
      setLatencyMs(latency);

      const replyText = response.text || '';
      const replyMsg: Message = {
        role: 'assistant',
        content: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || " HANDSHAKE_TIMEOUT // Uplink refused. Ensure your GEMINI_API_KEY is configured in the environment.");
    } finally {
      setIsTyping(false);
    }
  };

  const toastError = (errMessage: string) => {
    const errorMsg: Message = {
      role: 'assistant',
      content: `❌ **HANDSHAKE ERROR:** ${errMessage}\n\nPlease check **Settings > Secrets** in your workspace or try again in a moment.`
    };
    setMessages(prev => [...prev, errorMsg]);
  };

  const generateImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    setIsGeneratingImg(true);
    setGeneratedImgUrl(null);

    // Dynamic Seed to ensure fresh retrieval
    const freshSeed = Math.floor(Math.random() * 100000);
    setImgSeed(freshSeed);

    // Format dimension bounds for Pollinations
    let w = 1024, h = 1024;
    if (aspectRatio === '16:9') {
      w = 1280; h = 720;
    } else if (aspectRatio === '9:16') {
      w = 720; h = 1280;
    }

    const encodePrompt = encodeURIComponent(imagePrompt.trim());
    const queryUrl = `https://image.pollinations.ai/p/${encodePrompt}?width=${w}&height=${h}&seed=${freshSeed}&nologo=true&private=true&enhance=false`;

    // Direct Image preload inside the browser for true dynamic UI updates
    const imgLoader = window.Image ? new window.Image() : null;
    if (imgLoader) {
      imgLoader.onload = () => {
        setGeneratedImgUrl(queryUrl);
        setIsGeneratingImg(false);
      };
      imgLoader.onerror = () => {
        setIsGeneratingImg(false);
      };
      imgLoader.src = queryUrl;
    } else {
      setTimeout(() => {
        setGeneratedImgUrl(queryUrl);
        setIsGeneratingImg(false);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-void pt-28 pb-32 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        {/* Breadcrumb back */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-ghost hover:text-white transition-colors text-[10px] uppercase tracking-widest font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          RETURN_TO_BASE
        </button>

        {/* Head */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-neon-cyan mb-3">
              <Cpu size={16} className="animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-black">ACTIVE NODE // DEV WORKBENCH</span>
            </div>
            <h1 className="text-5xl font-display font-black text-white uppercase tracking-tight">
              Developer <span className="text-neon-cyan select-all">Playgrounds</span>
            </h1>
            <p className="text-ghost-light text-base font-light max-w-2xl mt-2">
              Isolated sandboxes for neural validation. Bench-test models using full-throughput Groq logic arrays, or forge high-fidelity visual assets instantaneously.
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-void-200 border border-white/5 rounded-xl font-mono text-[10px] tracking-widest font-bold">
            <button
              onClick={() => setActiveTab('inference')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all ${activeTab === 'inference' ? 'bg-neon-cyan text-black' : 'text-ghost-light hover:text-white'}`}
            >
              <Terminal size={14} /> INFERENCE_CONSOLE
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-all ${activeTab === 'image' ? 'bg-neon-cyan text-black' : 'text-ghost-light hover:text-white'}`}
            >
              <Image size={14} /> IMAGE_FORGE
            </button>
          </div>
        </header>

        {activeTab === 'inference' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Sidebar Controls */}
            <div className="lg:col-span-1 bg-void-100 border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sliders size={14} className="text-neon-cyan" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Parameters</h3>
              </div>
              
              <div className="space-y-4 font-mono text-[10px]">
                {/* Model Info */}
                <div className="space-y-1.5">
                  <label className="text-ghost uppercase">PROVISIONED_MODEL</label>
                  <div className="bg-void border border-white/5 p-3 rounded-lg text-white font-mono text-xs flex items-center justify-between">
                    <span className="text-neon-cyan font-black">Llama 3.3 (70B)</span>
                    <Badge variant="cyan">GROQ</Badge>
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-ghost uppercase">TEMPERATURE</label>
                    <span className="text-neon-cyan font-bold">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-neon-cyan cursor-pointer h-1 bg-void rounded-lg appearance-none"
                  />
                  <p className="text-[9px] text-ghost font-light leading-relaxed">Lower value forces deterministic patterns; higher enables exploration.</p>
                </div>

                {/* Max Tokens */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-ghost uppercase">MAX_OUTPUT_TOKENS</label>
                    <span className="text-neon-cyan font-bold">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="128"
                    max="4096"
                    step="128"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-neon-cyan cursor-pointer h-1 bg-void rounded-lg appearance-none"
                  />
                </div>

                {/* Connection HUD */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[9px] uppercase">
                    <span className="text-ghost">Handshake Latency:</span>
                    <span className="text-white font-mono text-xs">{latencyMs ? `${latencyMs} ms` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] uppercase">
                    <span className="text-ghost">Secure Token Gate:</span>
                    <span className="text-neon-cyan font-mono text-xs">ONLINE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inference Console Messages (Chat Window) */}
            <div className="lg:col-span-3 concrete-card rounded-2xl flex flex-col h-[640px] bg-black/40 border-white/5">
              {/* Box Head */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-void/50">
                <span className="text-[10px] font-mono tracking-widest text-ghost flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
                  L3_70_STREAM_NODE@CEREBRAS:ACTIVE_handshake
                </span>
                <span className="text-[9px] font-mono text-neon-cyan font-bold">[ SPECULATIVE_INFERENCE: ON ]</span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm font-mono leading-relaxed">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col gap-1.5 ${
                      m.role === 'system' 
                        ? 'bg-neon-cyan/5 text-[10px] border border-neon-cyan/20 px-4 py-2 rounded-lg text-neon-cyan max-w-full' 
                        : m.role === 'user'
                          ? 'items-end'
                          : 'items-start'
                    }`}
                  >
                    {m.role !== 'system' && (
                      <div className="flex items-center gap-2 text-[9px] text-ghost uppercase tracking-wider mb-0.5">
                        <span>{m.role === 'user' ? 'USER_UPLINK' : 'Llama_3.3_70B'}</span>
                        {m.time && <span>• {m.time}</span>}
                      </div>
                    )}
                    
                    {m.role !== 'system' && (
                      <div 
                        className={`px-4 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                          m.role === 'user' 
                            ? 'bg-neon-cyan text-black font-sans font-medium' 
                            : 'bg-void-200 border border-white/5 text-[#eceffd] font-light font-mono'
                        }`}
                      >
                        {m.content}
                      </div>
                    )}

                    {m.role === 'system' && <span>{m.content}</span>}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="text-[9px] text-ghost tracking-widest">COMPUTING_RESPONSE...</span>
                    <div className="bg-void-200 border border-white/5 rounded-2xl px-5 py-3 text-neon-cyan flex items-center gap-2 text-xs">
                      <RefreshCw size={12} className="animate-spin" /> Stream processing pipeline active
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Form Input bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-void-200 flex items-center gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Insert prompt here (e.g. Write an optimized ERC-20 staking logic map)..."
                  className="flex-1 bg-void border border-white/10 rounded-xl px-5 py-3.5 text-xs text-white focus:outline-none focus:border-neon-cyan transition-all font-mono"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="bg-neon-cyan text-black p-3.5 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(204,255,0,0.3)] flex items-center justify-center disabled:opacity-50"
                  disabled={isTyping || !userInput.trim()}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* IMAGE FORGE TAB */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Control Column Left */}
            <div className="lg:col-span-4 bg-void-100 border border-white/5 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <Sparkles size={16} className="text-neon-cyan animate-pulse" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Forge Parameters</h3>
              </div>
              
              <form onSubmit={generateImage} className="space-y-6 font-mono text-[10px]">
                {/* Prompt Textarea */}
                <div className="space-y-2">
                  <label className="text-ghost uppercase font-bold tracking-wider">PROMPT_UPLINK</label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the asset to forge (e.g. Cyberpunk server arrays embedded in solid volcanic glass, exact cyberpunk synthwave color grade)..."
                    className="w-full bg-void border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-neon-cyan transition-all font-sans resize-none min-h-[140px]"
                    required
                  />
                  <p className="text-[9px] text-ghost leading-relaxed font-sans">Use extremely clear descriptors for crisp visual representation.</p>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="space-y-3">
                  <label className="text-ghost uppercase font-bold tracking-wider">ASPECT_RATIO</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-3.5 border rounded-lg transition-all text-center flex flex-col items-center justify-center gap-1 font-bold ${
                          aspectRatio === ratio 
                            ? 'border-neon-cyan bg-neon-cyan/5 text-neon-cyan shadow-[0_0_10px_rgba(204,255,0,0.1)]' 
                            : 'border-white/5 hover:border-white/10 text-ghost-light hover:text-white bg-void'
                        }`}
                      >
                        <div className={`border border-current rounded-sm ${ratio === '1:1' ? 'w-4 h-4' : ratio === '16:9' ? 'w-6 h-3.5' : 'w-3.5 h-6'}`}></div>
                        <span>{ratio}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={isGeneratingImg || !imagePrompt.trim()}
                  className="w-full bg-neon-cyan text-black py-4 rounded-xl flex items-center justify-center gap-3 uppercase font-black tracking-widest text-[11px] hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all disabled:opacity-40"
                >
                  {isGeneratingImg ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} />
                      Forging Asset...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      FORGE_VISUAL
                    </>
                  )}
                </button>
              </form>

              {/* Status Section */}
              <div className="pt-6 border-t border-white/5 space-y-3 font-mono text-[9px] uppercase text-ghost">
                <div className="flex justify-between items-center">
                  <span>Engine backend:</span>
                  <span className="text-white">POLLINATIONS_NODE_3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Logic check:</span>
                  <span className="text-neon-cyan">NOMINAL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Selected Seed:</span>
                  <span className="text-white">{imgSeed}</span>
                </div>
              </div>
            </div>

            {/* Render Canvas Column Right */}
            <div className="lg:col-span-8 space-y-6">
              <div className="concrete-card rounded-2xl flex flex-col items-center justify-center border-l-4 border-l-neon-cyan min-h-[580px] p-6 relative overflow-hidden bg-black/30">
                
                {/* Background scanning aesthetics */}
                <div className="scanline"></div>

                {isGeneratingImg ? (
                  <div className="text-center space-y-4 animate-pulse relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-2 text-neon-cyan animate-spin">
                      <RefreshCw size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest font-mono">FORGING INSTANCE_</h3>
                    <p className="text-xs text-ghost-light max-w-xs mx-auto leading-relaxed">Arranging neural matrices inside high-throughput visual pipeline grids...</p>
                  </div>
                ) : generatedImgUrl ? (
                  <div className="space-y-4 relative z-10 w-full animate-in zoom-in-95 duration-500">
                    {/* Image visual wrapper */}
                    <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-void group max-h-[520px] flex items-center justify-center">
                      <img 
                        src={generatedImgUrl} 
                        alt="Forged Asset Output" 
                        className="max-h-[500px] object-contain transition-transform duration-700 ease-out py-2"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive hover indicator */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-neon-cyan tracking-widest uppercase">Verified Output Packet // Ready</span>
                        <a 
                          href={generatedImgUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="bg-white/10 text-white rounded px-3 py-1 font-mono text-[9px] hover:bg-white/20 uppercase transition-all"
                        >
                          Raw Link
                        </a>
                      </div>
                    </div>
                    
                    {/* Prompt documentation caption */}
                    <div className="bg-void border border-white/5 p-4 rounded-xl flex items-start gap-4">
                      <div className="p-2 bg-neon-cyan/10 rounded-lg text-neon-cyan border border-neon-cyan/20">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="font-mono text-[10px] leading-relaxed flex-1">
                        <div className="text-white font-bold uppercase tracking-wider mb-0.5">Asset Metadata Token</div>
                        <div className="text-ghost truncate"><span className="text-ghost-light">Prompt:</span> "{imagePrompt}"</div>
                        <div className="flex gap-4 text-ghost uppercase mt-1">
                          <span>Ratio: {aspectRatio}</span>
                          <span>Seed: {imgSeed}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 relative z-10 p-8 max-w-sm">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2 text-ghost-light">
                      <Image size={28} />
                    </div>
                    <h3 className="text-lg font-display font-medium text-white uppercase tracking-wider">Canvas Idle</h3>
                    <p className="text-xs text-ghost leading-relaxed">Introduce an asset parameter instruction in the controller uplink panel then execute visual synthesis.</p>
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

export default PlaygroundsPage;
