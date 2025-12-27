
import React, { useState } from 'react';
import { X, LayoutDashboard, Database, Settings, Search, ArrowLeft, Loader2, Link as LinkIcon } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface ValuationTerminalProps {
  onExit: () => void;
}

const ValuationTerminal: React.FC<ValuationTerminalProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [groundingUrls, setGroundingUrls] = useState<{ uri: string, title?: string }[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingAI(true);
    setError(null);
    setAiResponse(null);
    setGroundingUrls([]);

    try {
      // Use process.env.API_KEY directly to initialize GoogleGenAI client
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Use gemini-3-flash-preview for general text and search grounding tasks
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: searchQuery,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      // Directly access .text property from response
      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

      setAiResponse(text || 'No significant response generated.');

      if (groundingChunks && Array.isArray(groundingChunks)) {
        const urls = groundingChunks
          .filter(chunk => chunk.web?.uri)
          .map(chunk => ({
            uri: chunk.web!.uri!,
            title: chunk.web!.title,
          }));
        setGroundingUrls(urls);
      }

    } catch (err) {
      console.error("Gemini API error:", err);
      setError("Failed to fetch data from AI. Please try again.");
      if (err instanceof Error) {
        if (err.message.includes("API key not valid") || err.message.includes("api_key")) {
          setError("API Key is invalid or not configured. Please ensure your API key is correctly set up for billing.");
        } else {
          setError(`An error occurred: ${err.message}`);
        }
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  const renderDashboardContent = () => (
    <>
      <h2 className="text-2xl font-bold mb-6">Market Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 transition-colors">
            <div className="text-[10px] text-zinc-500 mb-2">SAAS INDEX {i}</div>
            <div className="text-3xl font-mono mb-2">1,240.50</div>
            <div className="text-xs text-emerald-500 flex items-center gap-1">+2.4% <span className="text-zinc-600">24h</span></div>
          </div>
        ))}
      </div>

      <div className="border border-zinc-800 bg-zinc-900/20 p-6">
        <h3 className="text-lg font-bold mb-4">AI-Powered Market Analysis</h3>
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for market trends, company valuations, or financial news..."
            className="flex-grow bg-zinc-950 border border-zinc-700 focus:border-white px-4 py-2 text-sm text-white placeholder-zinc-600 outline-none font-mono"
            disabled={isLoadingAI}
          />
          <button
            type="submit"
            className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center gap-2"
            disabled={isLoadingAI}
          >
            {isLoadingAI ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {isLoadingAI ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 text-sm mb-4 animate-in fade-in">
            Error: {error}
          </div>
        )}

        {aiResponse && (
          <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 max-h-80 overflow-y-auto text-sm text-zinc-300 animate-in fade-in">
            <h4 className="font-bold text-white mb-2">Analysis Results:</h4>
            {/* Render AI response, assuming it can contain markdown for better readability */}
            <p className="whitespace-pre-wrap">{aiResponse}</p>

            {groundingUrls.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <h5 className="text-xs font-bold text-zinc-400 mb-2">Sources:</h5>
                <ul className="space-y-1">
                  {groundingUrls.map((url, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <LinkIcon size={12} className="text-zinc-600" />
                      <a
                        href={url.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-xs"
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

        {!aiResponse && !isLoadingAI && !error && (
            <div className="py-12 text-center text-zinc-500">
                <p>Enter a query above to get AI-powered market analysis.</p>
            </div>
        )}
      </div>
    </>
  );

  const renderModelsContent = () => (
    <div className="relative z-10 max-w-5xl mx-auto py-12 text-center">
      <div className="w-16 h-16 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Database className="text-zinc-700" />
      </div>
      <p className="text-zinc-500 font-mono text-sm">DCF Models under development. Check back later.</p>
    </div>
  );

  const renderConfigContent = () => (
    <div className="relative z-10 max-w-5xl mx-auto py-12 text-center">
      <div className="w-16 h-16 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Settings className="text-zinc-700" />
      </div>
      <p className="text-zinc-500 font-mono text-sm">Terminal configuration options coming soon.</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] text-zinc-100 flex flex-col font-mono animate-in fade-in duration-500">

      {/* Terminal Header */}
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Exit Terminal
          </button>
          <div className="h-4 w-px bg-zinc-800"></div>
          <span className="font-bold tracking-tight text-white">VALUATION TERMINAL</span>
          <span className="px-2 py-0.5 rounded-sm bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">v4.2.0</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Removed the search input from header as it's now integrated into the main content for AI analysis */}
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-16 md:w-64 border-r border-zinc-800 bg-black/50 flex flex-col justify-between py-6">
          <div className="space-y-1 px-3">
             <button
               onClick={() => setActiveTab('dashboard')}
               className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-wide rounded-sm transition-all ${activeTab === 'dashboard' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
             >
               <LayoutDashboard size={16} />
               <span className="hidden md:inline">MARKET OVERVIEW</span>
             </button>
             <button
               onClick={() => setActiveTab('models')}
               className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-wide rounded-sm transition-all ${activeTab === 'models' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
             >
               <Database size={16} />
               <span className="hidden md:inline">DCF MODELS</span>
             </button>
             <button
               onClick={() => setActiveTab('config')}
               className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-wide rounded-sm transition-all ${activeTab === 'config' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
             >
               <Settings size={16} />
               <span className="hidden md:inline">CONFIG</span>
             </button>
          </div>

          <div className="px-6 text-[10px] text-zinc-700 hidden md:block">
            DATA: REAL-TIME<br/>
            SOURCE: KONKRED API
          </div>
        </aside>

        {/* Main Application Area */}
        <main className="flex-grow bg-[#0A0A0A] relative overflow-auto p-8">
           <div className="absolute inset-0 z-0 opacity-[0.05] grid-bg pointer-events-none" />

           <div className="relative z-10 max-w-5xl mx-auto">
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
