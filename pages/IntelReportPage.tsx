import React, { useState, useEffect } from 'react';
import { PageView } from '../types.ts';
import { 
  ArrowLeft, Cpu, Activity, ShieldAlert, Award, FileText, Settings, 
  RefreshCw, BarChart2, Info, Sliders, Play, RotateCcw, AlertTriangle, 
  Layers, Database, ArrowRight, Eye, CheckSquare, Search, Sparkles
} from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

interface MetricItem {
  name: string;
  keyName: string;
  desc: string;
  persianDesc: string;
  weight: number;
}

const IntelReportPage: React.FC<{ onNavigate: (page: PageView) => void }> = ({ onNavigate }) => {
  // Load Persian font dynamically to ensure optimal Vazirmatn rendering
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700;800&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  // Simulator tabs
  const [activeSim, setActiveSim] = useState<'logits' | 'lost_middle' | 'flood' | 'recursive' | 'rag'>('logits');
  const [activeDossierChapter, setActiveDossierChapter] = useState<number>(0);

  // 1. Softmax logit states
  const [logits, setLogits] = useState<Record<string, number>>({
    structural_logic: 8.5,
    hallucinative_drift: 2.1,
    semantic_forgetting: 1.8,
    bystander_noise: 1.4
  });
  const [softmax, setSoftmax] = useState<Record<string, number>>({});
  const [stabilityIndex, setStabilityIndex] = useState<number>(92);
  const [auditGrade, setAuditGrade] = useState<'A+' | 'A' | 'B' | 'C' | 'D' | 'F'>('A+');

  // Compute Softmax normalization (P_i = e^x_i / sum(e^x_j))
  useEffect(() => {
    const exponents = Object.entries(logits).map(([key, val]) => [key, Math.exp(val as number)]);
    const sumExponents = exponents.reduce((acc, [_, val]) => acc + (val as number), 0) || 1;
    
    const normalized: Record<string, number> = {};
    exponents.forEach(([key, val]) => {
      normalized[key] = (val as number) / sumExponents;
    });
    setSoftmax(normalized);

    const logicRatio = normalized['structural_logic'] || 0;
    const driftRatio = normalized['hallucinative_drift'] || 0;
    const forgettingRatio = normalized['semantic_forgetting'] || 0;
    const noiseRatio = normalized['bystander_noise'] || 0;

    const computedStability = Math.round(
      (logicRatio * 100) - (driftRatio * 40) - (forgettingRatio * 25) - (noiseRatio * 20)
    );
    const boundedStability = Math.max(0, Math.min(100, computedStability + 40));
    setStabilityIndex(boundedStability);

    if (boundedStability >= 90) setAuditGrade('A+');
    else if (boundedStability >= 80) setAuditGrade('A');
    else if (boundedStability >= 65) setAuditGrade('B');
    else if (boundedStability >= 50) setAuditGrade('C');
    else if (boundedStability >= 30) setAuditGrade('D');
    else setAuditGrade('F');
  }, [logits]);

  const handleLogitChange = (key: string, val: number) => {
    setLogits(prev => ({ ...prev, [key]: val }));
  };

  const resetLogits = () => {
    setLogits({
      structural_logic: 8.5,
      hallucinative_drift: 2.1,
      semantic_forgetting: 1.8,
      bystander_noise: 1.4
    });
  };

  const metrics: MetricItem[] = [
    {
      name: "Decay Resistance Index",
      keyName: "structural_logic",
      desc: "Network structural resilience tracking long-term memory pattern viability.",
      persianDesc: "شاخص پایداری برای سنجش مقاومت ساختار شبکه در مقابل زوال الگو‌های دوربرد حافظه.",
      weight: logits.structural_logic
    },
    {
      name: "Hallucinatory Vector Drift",
      keyName: "hallucinative_drift",
      desc: "Divergence from anchor documents under active iteration feedback loops.",
      persianDesc: "نرخ واگرایی برداری از مختصات حقیقت‌سنجی پایه در طول تکرار استنتاج.",
      weight: logits.hallucinative_drift
    },
    {
      name: "Semantic Forgetting Sieve",
      keyName: "semantic_forgetting",
      desc: "Information leaking through active buffers when sequence limit is loaded.",
      persianDesc: "نشت تدریجی نشانه‌های معنایی و فراموشی جزئیات در بافرهای کلیدی تحت فشار شناختی.",
      weight: logits.semantic_forgetting
    },
    {
      name: "Bystander Stochastic Noise",
      keyName: "bystander_noise",
      desc: "Entropy increases in adjacent semantic maps due to token path intersections.",
      persianDesc: "تداخل تصادفی نروترنسمیترهای مجازی به خاطر تقاطع مسیر در نگاشت مفاهیم همسایه.",
      weight: logits.bystander_noise
    }
  ];

  // 2. Lost in the Middle states
  const [seqLength, setSeqLength] = useState<number>(8192); // 512 to 32768

  // 3. Context Flooding states
  const [floodLoad, setFloodLoad] = useState<number>(75); // 0% to 150%

  // Array of random state keys for grid
  const [gridCells, setGridCells] = useState<{ active: boolean; rate: number }[]>([]);
  useEffect(() => {
    const list = Array.from({ length: 140 }, () => ({
      active: Math.random() * 100 > 30,
      rate: Math.random() // trigger offset
    }));
    setGridCells(list);
  }, []);

  // 4. Recursive Summarization states
  const [recursiveIteration, setRecursiveIteration] = useState<number>(0);
  const degradationSteps = [
    {
      step: 0,
      bits: "1.2 bits",
      textEn: "The structural agent operates continuously to manage system invariants, validating transaction signatures and caching state boundaries inside redundant memory grids.",
      textFa: "عامل هوشمند ساختاری به صورت مداوم جهت صیانت از مقادیر ثابت سیستم فعالیت می‌کند، امضاهای دیجیتال را صحت‌سنجی نموده و مرزهای وضعیت تراکنش‌ها را در شبکه‌های حافظه چندگانه ثبت می‌نماید."
    },
    {
      step: 1,
      bits: "2.8 bits",
      textEn: "The system agent runs permanently. It secures transaction signatures and caches state metrics inside redundant backup channels.",
      textFa: "عامل دائمی سیستم مشغول اجراست. این سیستم امضا تراکنش‌ها را امن کرده و وضعیت‌های نهایی را در کانال‌های بک‌آپ کپی می‌کند."
    },
    {
      step: 2,
      bits: "4.9 bits",
      textEn: "Agent stays online. It verifies transactions, saving general metrics to active secondary backups.",
      textFa: "ایجنت آنلاین می‌ماند. تراکنش‌ها را چک می‌کند، متریک‌های کلی را در فضای پشتیبان ثانویه می‌بخشاید."
    },
    {
      step: 3,
      bits: "6.7 bits",
      textEn: "Verification agent active. It does checks and writes generic records somewhere into backups.",
      textFa: "ایجنت بررسی‌کننده فعال است. چک‌ها را انجام می‌دهد و رکوردهای عمومی را یک جایی در بک‌آپ می‌نویسد."
    },
    {
      step: 4,
      bits: "8.3 bits",
      textEn: "System checker is running. Runs checks. Backups are recorded.",
      textFa: "سیستم چک‌کننده در حال اجراست. اجرا را چک می‌کند. سیستم در بک‌آپ ذخیره می‌شود."
    },
    {
      step: 5,
      bits: "9.9 bits (COLLAPSED)",
      textEn: "Agent does things. State is good. Run checks. OK.",
      textFa: "عامل کارها را انجام می‌دهد. وضعیت خوب است. چک کن. تأیید شد."
    }
  ];

  // 5. RAG Retrieval states
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.78); // 0.40 to 0.99

  // Deep-dive Dossier chapters content
  const dossierChapters = [
    {
      titleEn: "Memory Architecture & Structural Failure",
      titleFa: "۱. آناتومی لایه‌های حافظه و زوال ساختار پردازش",
      en: "Autonomous multi-agents rely on static system instructions coupled with scrolling dynamic contexts. As execution spans exceed 8,000 tokens, the mathematical resolution of embeddings drops exponentially. This causes critical vector rotations, leading to factual dissolution and severe logic drift.",
      fa: "عامل‌های مستقل مجهز به اصول اولیه به صورت متناوب با حجم انبوهی از متون مواجه می‌شوند. به محض عبور طول توالی از مرز ۸،۰۰۰ توکن، دقت ریاضی امبدینگ‌ها به صورت نمایی افت می‌کند. این امر موجب دوران بردارها و سقوط سطح استنباط مدل بر روی کانتسکت متغیر می‌گردد."
    },
    {
      titleEn: "The 'Lost in the Middle' Attention Trap",
      titleFa: "۲. تله تمرکز توجه و افت شديد در ميانه کانتسکت",
      en: "Decoder-only architectures suffer from high attention convergence at the extreme head and tail of the input prompts. Key entities positioned between indices 30% and 70% receive virtually zero gradient activation. Information is 'forgotten' inside these cognitive blank spaces.",
      fa: "معماری رگرسیو دچار افزایش کاذب غلظت توجه در لبه‌های ابتدایی و انتهایی پرامپت می‌شود. فاکتورهای حیاتی که در فواصل میانگین کانتسکت (بین ۳۰٪ تا ۷۰٪) قرار می‌گیرند، از غلظت لازم گرادیان محروم مانده و به طور کامل از دور استنتاج خارج می‌شوند."
    },
    {
      titleEn: "Stochastic Noise and Multi-Agent Drifts",
      titleFa: "۳. تداخلهای کاتوره‌ای و انحراف برداری در ارکستراسیون",
      en: "Each layer of agent routing introduces cascading uncertainty. When Agent A summarizes and passes outputs to Agent B, the semantic temperature spikes. Noise behaves like background radiation, polluting the logic stream until the baseline factual grounding collapses entirely.",
      fa: "هر یک از مراحل ارجاع داده در زنجیره‌های تصمیم‌گیری، پتانسیل انحراف معنایی دارند. با ارسال خروجی نیمه‌محفوظ ایجنت الف به ایجنت ب، انتروپی تصادفی افزوده شده و مسیر استنتاج را تا سقوط کامل مرجع بر حقیقت، آلوده می‌سازد."
    },
    {
      titleEn: "Mitigation: Dynamic Context Slicing & Filters",
      titleFa: "۴. راهکار تثبیت: مدیریت کوئری‌ها و برش کانتسکت فعال",
      en: "To counteract memory leak loops, we compile custom context-reconstruction matrices. By slicing historical sequences and rewriting them dynamically with Softmax state correction bounds, we contain decay vectors while preserving 95% baseline accuracy.",
      fa: "برای مقابله با چرخه‌های زوال حافظه، نیازمند بازسازی ماتریس فضای متنی هستیم. با توزیع وزن‌های فعال، پیاده‌سازی مکانیزم‌های بازیابی فعال (RAG) و پاکسازی توکن‌های زائد، جلوی گریز معنایی بردارها گرفته شده و پایداری برداری بازیابی می‌شود."
    },
    {
      titleEn: "Deterministic Decision Flow Invariants",
      titleFa: "۵. جریان تصمیم‌گیری مبتنی بر الگوهای حافظه سخت‌افزاری",
      en: "Combining hardware-level neural cache assertions with dual-layer grounding limits. The system strictly filters inputs across a deterministic linear gate to bypass LLM cognitive lapses during high-throughput queries.",
      fa: "ترکیب ادعاهای حافظه کش سطح گره‌ها با مرزهای حقیقت‌سنجی فیزیکی، ایجنت را مجبور به دنبال کردن جریان‌های کاملاً منطقی می‌کند تا در پردازش کوئری با ترافیک بالا دچار گیجی نشود."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-32 px-4 lg:px-8 font-sans text-neutral-300 relative selection:bg-[#ccff00] selection:text-black">
      {/* Visual background noise elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ccff00_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-7xl mx-auto space-y-10 relative z-10 animate-in fade-in duration-700">
        
        {/* Back and Breadcrumb */}
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-mono group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-[#ccff00]" /> 
          RETURN_TO_BASE_HOME // خروج از پنل تحقیقاتی
        </button>

        {/* Global Alert Notification Banner */}
        <div className="border border-[#ff003c]/20 bg-[#ff003c]/5 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs text-[#ff003c] tracking-tight">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#ff003c] animate-pulse" />
            <span><strong>SYSTEM WARNING // تحقیق فعال:</strong> Cumulative cognitive decay rates reached critical index threshold. Safety filters bypassed.</span>
          </div>
          <span className="text-[10px] uppercase bg-[#ff003c]/10 border border-[#ff003c]/20 px-2 py-0.5 rounded text-[#ff7a98] self-start md:self-auto font-bold animate-pulse">
            HIGH_ENTROPY_DRIFT
          </span>
        </div>

        {/* Header Block / Scientific Title */}
        <header className="border-b border-neutral-800 pb-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-5 w-5 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded flex items-center justify-center text-[#ccff00] font-mono text-[9px] font-black shadow-[0_0_8px_rgba(204,255,0,0.15)]">ARI</span>
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#ccff00] font-bold">INTELLIGENCE BRIEFING // MEMORY DRIFT REPORT</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-7xl font-mono font-black text-white leading-none uppercase select-all tracking-tight">
                ARI-ficial <span className="text-[#ccff00] drop-shadow-[0_0_12px_rgba(204,255,0,0.2)]">Idiocy_</span>
              </h1>
              <h2 className="text-sm lg:text-base font-medium text-neutral-400 font-mono tracking-widest mt-2 uppercase">
                Anomalous Vector Coherence Decay in Multi-Agent Pipelines // گزارش جامع زوال توجه
              </h2>
            </div>
            
            {/* Quick Summary Badges */}
            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white">
              <span className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/50 flex items-center gap-1.5">
                <Cpu size={12} className="text-[#ccff00]" /> Llama 3.3 / Gemini 1.5 Sieve
              </span>
              <span className="px-3 py-1.5 rounded-lg border border-[#ff003c]/20 bg-neutral-900/50 flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-[#ff003c]" /> Attention Lost
              </span>
            </div>
          </div>

          <p className="text-neutral-300 text-base md:text-lg font-light max-w-4xl leading-relaxed mt-4">
            Quantitative analysis of cumulative hallucination, contextual decay, and drift coordinates in autonomous agent memory systems. Real-time normalizations computed on live weight sets.
          </p>
        </header>

        {/* WORKBENCH AND SIMULATORS */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h5 className="text-xs uppercase font-mono tracking-[0.3em] text-[#ccff00] font-bold">UPLINK_WORKBENCH</h5>
              <h3 className="text-2xl font-mono font-black text-white uppercase mt-0.5">Neural Simulator Workbench</h3>
            </div>
            
            {/* Interactive Selector Tabs */}
            <div className="flex flex-wrap p-1 bg-neutral-900/80 border border-neutral-800 rounded-xl font-mono text-[9.5px] tracking-wider font-bold text-neutral-400">
              <button
                onClick={() => setActiveSim('logits')}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg transition-all uppercase ${activeSim === 'logits' ? 'bg-[#ccff00] text-black font-black' : 'hover:text-white'}`}
              >
                <Sliders size={12} /> Logits_Softmax
              </button>
              <button
                onClick={() => setActiveSim('lost_middle')}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg transition-all uppercase ${activeSim === 'lost_middle' ? 'bg-[#ccff00] text-black font-black' : 'hover:text-white'}`}
              >
                <Layers size={12} /> Lost_In_Middle
              </button>
              <button
                onClick={() => setActiveSim('flood')}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg transition-all uppercase ${activeSim === 'flood' ? 'bg-[#ccff00] text-black font-black' : 'hover:text-white'}`}
              >
                <Database size={12} /> Context_Flood
              </button>
              <button
                onClick={() => setActiveSim('recursive')}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg transition-all uppercase ${activeSim === 'recursive' ? 'bg-[#ccff00] text-black font-black' : 'hover:text-white'}`}
              >
                <RefreshCw size={12} /> Recursive_Collapse
              </button>
              <button
                onClick={() => setActiveSim('rag')}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg transition-all uppercase ${activeSim === 'rag' ? 'bg-[#ccff00] text-black font-black' : 'hover:text-white'}`}
              >
                <Search size={12} /> RAG_Similarity
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* SIMULATION BOX VIEW */}
            <div className="lg:col-span-8 bg-neutral-950/60 border border-neutral-800 rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
              
              {/* Scanline decoration */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#ccff00]/10 animate-pulse pointer-events-none" />

              {/* SIM 1: LOGITS WORKBENCH */}
              {activeSim === 'logits' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-start justify-between border-b border-neutral-800 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-[9px] font-mono text-[#ccff00] font-bold uppercase tracking-widest block">Normalizer Equation Matrix</span>
                      <h4 className="text-lg font-mono font-bold text-white uppercase tracking-tight">Softmax Distribution Normalizer</h4>
                    </div>
                    <button 
                      onClick={resetLogits} 
                      className="text-[9px] font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 border border-neutral-800 rounded px-2 py-1.5 hover:bg-neutral-900"
                    >
                      <RotateCcw size={10} /> RESET_LOGITS
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    Adjust the raw weights assigned to neural activations. Modifying logits dynamically changes the exponential denominator, shifting probability allocations:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Logit Tuning Sliders */}
                    <div className="space-y-4">
                      {metrics.map((m) => {
                        const prob = softmax[m.keyName] || 0;
                        return (
                          <div key={m.keyName} className="p-3.5 bg-neutral-900/50 rounded-xl border border-neutral-800/60 space-y-2">
                            <div className="flex justify-between items-start font-mono text-[10px]">
                              <div>
                                <span className="text-white font-black uppercase tracking-wider block">{m.name}</span>
                                <span className="text-neutral-500 font-vazir block text-[9.5px] mt-0.5">{m.persianDesc}</span>
                              </div>
                              <span className="text-[#ccff00] font-bold bg-[#ccff00]/10 px-1.5 py-0.5 rounded border border-[#ccff00]/15">
                                [ {logits[m.keyName].toFixed(1)} ]
                              </span>
                            </div>

                            <input
                              type="range"
                              min="0.5"
                              max="12"
                              step="0.1"
                              value={logits[m.keyName]}
                              onChange={(e) => handleLogitChange(m.keyName, parseFloat(e.target.value))}
                              className="w-full accent-[#ccff00] h-1.5 bg-neutral-950 rounded cursor-pointer appearance-none"
                            />

                            <div className="flex justify-between font-mono text-[8px] text-neutral-500">
                              <span>EXP VALUE (e^x): {Math.exp(logits[m.keyName]).toFixed(1)}</span>
                              <span className="text-neutral-400">PROB: {(prob * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Proportional Render Bars */}
                    <div className="bg-neutral-950/80 rounded-2xl border border-neutral-800/80 p-5 flex flex-col justify-between space-y-4 font-mono text-xs text-neutral-400">
                      <div className="space-y-4">
                        <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">Normalised Outputs Probability:</span>
                        
                        {metrics.map((m) => {
                          const prob = softmax[m.keyName] || 0;
                          const percent = (prob * 100).toFixed(1);
                          return (
                            <div key={m.keyName} className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-white truncate font-bold uppercase">{m.name}</span>
                                <span className="text-[#ccff00] font-black">{percent}%</span>
                              </div>
                              <div className="h-6 bg-neutral-900 border border-neutral-800 rounded-md overflow-hidden relative flex items-center px-2">
                                <div 
                                  style={{ width: `${percent}%` }}
                                  className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#ccff00]/80 via-[#ccff00]/50 to-[#ccff00]/10 transition-all duration-300"
                                />
                                <span className="relative z-10 text-[9px] text-[#ccff00] font-black tracking-wide">P = {prob.toFixed(3)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-neutral-900/60 p-3 rounded-lg border border-neutral-800 text-[10px] space-y-1.5 text-neutral-400 font-sans leading-relaxed">
                        <span className="font-mono text-[9px] text-white flex items-center gap-1">
                          <Info size={12} className="text-[#ccff00]" /> Softmax Formula Asserted:
                        </span>
                        <p className="italic font-mono text-neutral-500 font-bold text-center select-all py-1">P(x_i) = e^(x_i) / Σ [e^(x_j)]</p>
                        <p className="font-vazir text-right text-[11px] text-neutral-300/80">
                          نرمال‌سازی سافت‌مکس وزنهای منطقی خام را با متدهای آماری به توزیع احتمال معتبر تبدیل می‌کند تا سهم هر عامل مشخص شود.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIM 2: LOST IN THE MIDDLE */}
              {activeSim === 'lost_middle' && (
                <div className="space-y-6 animate-in fade-in duration-300 font-mono text-xs">
                  <div className="border-b border-neutral-800 pb-3">
                    <span className="text-[9px] text-[#ccff00] font-bold uppercase tracking-widest block">Inference Sequence Degradation</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">Attention Concentration Sink</h4>
                  </div>

                  <p className="text-neutral-400 font-sans leading-relaxed">
                    Long prompts suffer from middle-sequence decay. Transformer nodes focus highly on the beginning (system parameters) and the end (active questions), forgetting details loaded at indices 30% - 70%.
                  </p>

                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-5">
                    {/* Sequence size control */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-neutral-800 pb-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">PROMPT LENGTH INPUT (TOKENS)</label>
                        <span className="text-white text-lg font-black">{seqLength.toLocaleString()} Tokens</span>
                      </div>
                      
                      <div className="flex-1 max-w-md">
                        <input
                          type="range"
                          min="512"
                          max="32768"
                          step="512"
                          value={seqLength}
                          onChange={(e) => setSeqLength(parseInt(e.target.value))}
                          className="w-full accent-[#ccff00] h-1.5 bg-neutral-950 rounded cursor-pointer appearance-none"
                        />
                        <div className="flex justify-between text-[9px] text-neutral-500 mt-1">
                          <span>512 TOKENS</span>
                          <span>16K</span>
                          <span>32K DEV LIMIT</span>
                        </div>
                      </div>
                    </div>

                    {/* Symmetrical U-Shape Visualization */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-neutral-400 px-1">
                        <span>HEAD ATTENTION (98%)</span>
                        <span className="text-center text-neutral-500 font-vazir">خلاء توجه در میانه پرامپت (Lost in the Middle)</span>
                        <span>TAIL ATTENTION (94%)</span>
                      </div>

                      {/* SVG representation */}
                      <div className="relative border border-neutral-800 bg-neutral-950 rounded-xl p-4 flex items-end h-40 overflow-hidden">
                        
                        {/* Dynamic Background Warning Strip if length is long */}
                        {seqLength > 8000 && (
                          <div className="absolute inset-0 bg-[#ff003c]/[0.02] flex items-center justify-center font-bold text-[#ff003c] text-[10px] tracking-widest pointer-events-none animate-pulse">
                            CRITICAL ATTENTION SINKING IN ACTIVE ZONE
                          </div>
                        )}

                        {/* Interactive dynamic U bars */}
                        <div className="w-full flex items-end gap-1.5 h-full pt-4">
                          {Array.from({ length: 24 }).map((_, i) => {
                            const indexRatio = i / 23;
                            // Calculate U curve height dynamically. Higher seqLength = deeper middle plunge
                            const dampening = seqLength / 32768; // 0 to 1
                            const distanceFromCenter = Math.abs(indexRatio - 0.5); // 0 at center, 0.5 at ends
                            
                            // Parabolic function plunging in center
                            const rawHeight = Math.pow(distanceFromCenter * 2, 2.5); // 0 at center, 1 at ends
                            const curveAdjustment = 1 - (dampening * 0.84); // sink deeper 
                            const attentionPercent = Math.max(8, Math.round((rawHeight * 85 + 15) * (1 - (dampening * 0.4 * (1 - rawHeight)))));
                            
                            const isCenter = i >= 8 && i <= 15;
                            const barColor = isCenter && seqLength > 8000 
                              ? 'bg-neutral-800 hover:bg-[#ff003c] border-[#ff003c]/20 hover:shadow-[0_0_10px_rgba(255,0,60,0.4)]'
                              : 'bg-neutral-800 hover:bg-[#ccff00] border-[#ccff00]/20 hover:shadow-[0_0_10px_rgba(204,255,0,0.4)]';

                            return (
                              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                                <span className="absolute -top-6 text-[8px] scale-90 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-neutral-800 px-1 rounded text-white z-10">
                                  {attentionPercent}%
                                </span>
                                <div 
                                  style={{ height: `${attentionPercent}%` }}
                                  className={`w-full rounded-t border transition-all duration-500 cursor-help ${barColor}`}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Diagnostic HUD output */}
                      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 text-[10px]">
                        <div>
                          <span className="text-white font-bold block uppercase">Diagnostic Metrics</span>
                          <span className="text-neutral-500 block">Sequence Limit: {seqLength.toLocaleString()} Tokens</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-neutral-400 block font-vazir text-right md:text-left">
                            {seqLength < 4000 
                              ? 'عالی // تراکم اطلاعات در محدوده مطمئن' 
                              : seqLength < 8000 
                              ? 'متوسط // شروع واگرایی اطلاعات در مرکز پرامپت' 
                              : 'خطرناک // سقوط شدید غلظت توجه بر روی داده‌های میانی'}
                          </span>
                          <span className="block font-black rounded text-[10px] text-[#ccff00]">
                            {seqLength < 4000 
                              ? "STABLE COGNITIVE ZONE // GRADE: A+" 
                              : seqLength < 8000 
                              ? "WARNING: SEMANTIC DRIFT ZONE // GRADE: B-" 
                              : "CRITICAL: ATTENTION VOID DETECTED // GRADE: D"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIM 3: CONTEXT FLOODING */}
              {activeSim === 'flood' && (
                <div className="space-y-6 animate-in fade-in duration-300 font-mono text-xs">
                  <div className="border-b border-neutral-800 pb-3">
                    <span className="text-[9px] text-[#ccff00] font-bold uppercase tracking-widest block">Dynamic Memory Leak & Saturation</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">Context Flooding Reservoir</h4>
                  </div>

                  <p className="text-neutral-400 font-sans leading-relaxed font-light">
                    Increasing load density beyond 100% injects massive stochastic noise. Watch the active memory network elements turn from safe aligned green (signal) to dead grey/corrupt red (information leaks).
                  </p>

                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-6">
                    {/* density flood bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="text-neutral-400 uppercase tracking-widest text-[9px] block">FLOODING DENSITY COEFFICIENT</span>
                        <span className="text-lg font-black text-white">{floodLoad}% MEMORY ROAD</span>
                      </div>

                      <div className="flex-grow max-w-md w-full">
                        <input
                          type="range"
                          min="10"
                          max="150"
                          step="5"
                          value={floodLoad}
                          onChange={(e) => setFloodLoad(parseInt(e.target.value))}
                          className="w-full accent-[#ccff00] h-1.5 bg-neutral-950 rounded cursor-pointer appearance-none"
                        />
                      </div>
                    </div>

                    {/* Cell Grid */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">Active Token Coordinates Map:</span>
                      
                      <div className="grid grid-cols-10 sm:grid-cols-14 md:grid-cols-20 gap-1 bg-neutral-950 p-4 border border-neutral-800 rounded-xl">
                        {gridCells.map((cell, idx) => {
                          // Determine if cell is corrupted based on flood density and its seed rate
                          const isCorrupted = floodLoad / 150 > cell.rate;
                          const cellColor = isCorrupted
                            ? cell.rate > 0.8
                              ? 'bg-[#ff003c] border-[#ff003c]/40 hover:bg-white animate-pulse'
                              : 'bg-neutral-900 border-neutral-850 hover:bg-[#ccff00]/20'
                            : 'bg-[#ccff00] border-[#ccff00]/40 shadow-[0_0_4px_rgba(204,255,0,0.1)] hover:bg-white';

                          return (
                            <div 
                              key={idx} 
                              className={`aspect-square rounded-[3px] border transition-colors duration-300 cursor-crosshair ${cellColor}`}
                              title={`Node ${idx} // State: ${isCorrupted ? 'CORRUPT_LEAK' : 'NOMINAL_STATE'}`}
                            />
                          );
                        })}
                      </div>

                      {/* Metrics comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[10px] text-neutral-400 pt-2">
                        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
                          <span className="text-neutral-500 uppercase block">Active Transmission Signal</span>
                          <span className="text-white font-bold text-sm">
                            {Math.max(10, Math.round(100 - (floodLoad * 0.53)))}% Correct
                          </span>
                        </div>
                        <div className="p-3 bg-neutral-900 border border-[#ff003c]/20 rounded-xl space-y-1">
                          <span className="text-neutral-500 uppercase block">Stochastic Noise Ratio</span>
                          <span className="text-[#ff003c] font-bold text-sm">
                            {Math.round(floodLoad * 0.72)}% Noise
                          </span>
                        </div>
                        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
                          <span className="text-neutral-500 uppercase block">Network Structural Health</span>
                          <span className="text-white font-bold text-sm">
                            {floodLoad > 100 ? 'CRITICAL_LEAKS' : floodLoad > 60 ? 'CONTAINED' : 'EXCELLENT'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIM 4: RECURSIVE DEGRADATION */}
              {activeSim === 'recursive' && (
                <div className="space-y-6 animate-in fade-in duration-300 font-mono text-xs">
                  <div className="border-b border-neutral-800 pb-3">
                    <span className="text-[9px] text-[#ccff00] font-bold uppercase tracking-widest block">Recursive Feedback Convergence</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">Logical Model Collapse Loop</h4>
                  </div>

                  <p className="text-neutral-400 font-sans leading-relaxed">
                    Trigger successive feedback cycles. When models summarize summaries iteratively, original context vanishes and collapses into meaningless repetitive statements.
                  </p>

                  <div className="bg-neutral-950/80 rounded-2xl border border-neutral-800 p-5 space-y-5">
                    {/* Iteration Selector Buttons */}
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                      <div>
                        <span className="text-neutral-500 uppercase tracking-widest text-[9px] block">Iteration Index</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#ccff00] font-black text-xl">STEP 0{recursiveIteration}</span>
                          <span className="text-[10px] text-[#ff003c] font-bold bg-[#ff003c]/10 px-1.5 py-0.5 rounded uppercase font-mono border border-[#ff003c]/15">
                            Entropy: {degradationSteps[recursiveIteration].bits}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setRecursiveIteration(0)}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#ccff00]/40 rounded hover:text-white"
                        >
                          [ RESET_LOOP ]
                        </button>
                        <button 
                          onClick={() => setRecursiveIteration(prev => Math.min(5, prev + 1))}
                          disabled={recursiveIteration === 5}
                          className="px-4 py-2 bg-[#ccff00] text-black font-bold uppercase tracking-widest text-[10px] rounded transition-all hover:scale-105 disabled:opacity-40"
                        >
                          TRIGGER_SUMMARY_LOOP +
                        </button>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-4">
                      {/* English Screen */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[9px] text-neutral-500 uppercase font-mono">
                          <span className="h-1.5 w-1.5 bg-[#ccff00] rounded-full" />
                          <span>Output Packet (English Version)</span>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl text-white font-sans text-sm italic leading-relaxed">
                          "{degradationSteps[recursiveIteration].textEn}"
                        </div>
                      </div>

                      {/* Persian Screen with beautiful typography */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-end gap-2 text-[9px] text-neutral-500 uppercase font-mono">
                          <span>بسته خروجی معنایی (نسخه متغیر فارسی)</span>
                          <span className="h-1.5 w-1.5 bg-[#ccff00] rounded-full" />
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800/80 p-4 rounded-xl text-neutral-200 font-vazir text-right text-base leading-loose">
                          "{degradationSteps[recursiveIteration].textFa}"
                        </div>
                      </div>
                    </div>

                    {/* Collapse progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                        <span>DATA FAITHFULNESS INTENSITY</span>
                        <span>{100 - (recursiveIteration * 18)}% STRUCTURAL TRUTH</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${100 - (recursiveIteration * 18)}%` }}
                          className={`h-full transition-all duration-300 ${recursiveIteration > 3 ? 'bg-[#ff003c]' : 'bg-[#ccff00]'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIM 5: RAG RETRIEVAL SIMULATION */}
              {activeSim === 'rag' && (
                <div className="space-y-6 animate-in fade-in duration-300 font-mono text-xs">
                  <div className="border-b border-neutral-800 pb-3">
                    <span className="text-[9px] text-[#ccff00] font-bold uppercase tracking-widest block">Knowledge Base Distance Vectors</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">RAG Threshold Vector Pivot</h4>
                  </div>

                  <p className="text-neutral-400 font-sans leading-relaxed">
                    Tweak the Cosine Similarity retrieval threshold. Under strict thresholds, zero grounding chunks match, leading to blank refusals or hallucinations. Under loose thresholds, redundant noise floods the context window, causing confusion.
                  </p>

                  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5 space-y-5">
                    {/* slider control */}
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <span className="text-neutral-500 uppercase tracking-widest text-[9.5px] block">COSINE SIMILARITY GAP LIMIT (MIN_MATCH)</span>
                        <span className="text-white text-lg font-black">{similarityThreshold.toFixed(2)} Similarity</span>
                      </div>

                      <div className="flex-grow max-w-sm w-full">
                        <input
                          type="range"
                          min="0.45"
                          max="0.95"
                          step="0.01"
                          value={similarityThreshold}
                          onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                          className="w-full accent-[#ccff00] h-1.5 bg-neutral-950 rounded cursor-pointer appearance-none"
                        />
                      </div>
                    </div>

                    {/* Results of threshold query */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left: Grounding segments found */}
                      <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3">
                        <span className="text-[9px] text-neutral-500 uppercase block">Grounding Vector Segments Retargeted:</span>
                        
                        {similarityThreshold > 0.88 ? (
                          <div className="text-center py-6 text-neutral-500 italic space-y-2 font-sans">
                            <span className="text-[#ff003c] block font-mono font-bold not-italic">0 CHUNKS LOCATED</span>
                            "Search constraints too narrow. Underlying vectors matching {similarityThreshold.toFixed(2)} threshold could not be resolved."
                          </div>
                        ) : similarityThreshold > 0.70 ? (
                          <div className="space-y-2">
                            <div className="p-2 border-l-2 border-[#ccff00] bg-neutral-900 rounded text-[11px] space-y-1">
                              <div className="text-white font-bold uppercase">FACT_CHUNK_A (Match: 0.84)</div>
                              <div className="text-neutral-400">Agent caching memory consists of key invariant buffers.</div>
                            </div>
                            <div className="p-2 border-l-2 border-[#ccff00] bg-neutral-900 rounded text-[11px] space-y-1">
                              <div className="text-white font-bold uppercase">FACT_CHUNK_B (Match: 0.79)</div>
                              <div className="text-neutral-400">Sliders edit exp weights across Softmax distribution paths.</div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 opacity-80 scale-95 transition-all">
                            <div className="p-2 border-l-2 border-yellow-500 bg-neutral-900 rounded text-[11px]">
                              <div className="text-white font-bold uppercase">FACT_CHUNK_A (Match: 0.84)</div>
                              <div className="text-neutral-400 text-[10px]">Invariant cached buffers exist in RAM.</div>
                            </div>
                            <div className="p-2 border-l-2 border-red-500 bg-neutral-900 rounded text-[11px]">
                              <div className="text-white font-bold uppercase font-black uppercase text-[#ff003c]">OUTLIER_NOISE_Z (Match: 0.52)</div>
                              <div className="text-neutral-400 text-[10px]">System runs weather servers in northern Oregon.</div>
                            </div>
                            <div className="p-2 border-l-2 border-red-500 bg-neutral-900 rounded text-[11px]">
                              <div className="text-white font-bold uppercase font-black uppercase text-[#ff003c]">OUTLIER_NOISE_Y (Match: 0.49)</div>
                              <div className="text-neutral-400 text-[10px]">User is typing prompts in Chrome browser tabs.</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: LLM Output preview */}
                      <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2.5">
                        <span className="text-[9px] text-[#ccff00] uppercase font-bold block">Synthesised Response Preview:</span>
                        
                        <div className="min-h-[140px] flex flex-col justify-between">
                          <p className="text-white leading-relaxed font-sans text-sm">
                            {similarityThreshold > 0.88 ? (
                              <span className="text-[#ff003c] font-mono leading-normal block italic font-bold">
                                ❌ [HALLUCINATORY EXTRAPOLATION] "I cannot locate factual data matching your request, so let me hypothesize that your hardware has failed."
                              </span>
                            ) : similarityThreshold > 0.70 ? (
                              <span className="text-neutral-300 font-sans leading-relaxed">
                                "The agent stores transactional invariants inside stable redundant memory buffers. Logit variances determine probabilities on these parameters."
                              </span>
                            ) : (
                              <span className="text-[#ffea00] font-sans leading-relaxed block">
                                ⚠️ [CONTEXT STUFFING CHAOS] "Agent parameters are cached in memory servers in northern Oregon, where users type prompts in Chrome browser while checking rain forecasts."
                              </span>
                            )}
                          </p>

                          <div className="border-t border-neutral-900 pt-2 text-[9.5px] uppercase font-mono flex justify-between items-center text-neutral-500">
                            <span>Status:</span>
                            <span className={`font-bold ${similarityThreshold > 0.88 ? 'text-[#ff003c]' : similarityThreshold > 0.70 ? 'text-[#ccff00]' : 'text-[#ffea00]'}`}>
                              {similarityThreshold > 0.88 ? 'COGNITIVE REFUSAL' : similarityThreshold > 0.70 ? 'OPTIMAL ACCURACY' : 'STOCHASTIC STUFFING'}
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* OUTCOMES SUMMARY PIECE */}
              <div className="mt-8 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                  Live calculation frame // interactive workbench state
                </span>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-neutral-400">CORE GRADE:</span>
                  <span className="font-mono text-xs font-bold text-white bg-[#ccff00]/10 border border-[#ccff00]/25 px-2 py-1 rounded">
                    {auditGrade}
                  </span>
                </div>
              </div>

            </div>

            {/* LOGIT CONTROLLER PANEL & CONTEXT GAUGE */}
            <div className="lg:col-span-4 bg-neutral-950/40 border border-neutral-800 rounded-3xl p-6 lg:p-8 space-y-6 flex flex-col justify-between shadow-2xl">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-1.5 text-[#ccff00]">
                    <Activity size={16} />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider">Metrics Shield Control</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  Real-time cognitive metrics computed based on the state of all simulator sliders. Keep the stability indexes high to protect context boundaries.
                </p>

                {/* Main stability gauge */}
                <div className="p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800/80 space-y-3 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 uppercase tracking-wider">System Stability Index</span>
                    <span className={`text-base font-black ${stabilityIndex > 75 ? 'text-[#ccff00]' : stabilityIndex > 45 ? 'text-yellow-500' : 'text-[#ff003c]'}`}>
                      {stabilityIndex}%
                    </span>
                  </div>

                  <div className="h-2.5 bg-neutral-950 border border-neutral-850 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${stabilityIndex}%` }}
                      className={`h-full transition-all duration-700 ${
                        stabilityIndex > 75 
                          ? 'bg-gradient-to-l from-[#ccff00] to-[#ccff00]/50' 
                          : stabilityIndex > 45 
                            ? 'bg-yellow-500' 
                            : 'bg-[#ff003c] animate-pulse'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-neutral-500">
                    <span>0% FAILURE POINT</span>
                    <span>100% EXCELLENCE</span>
                  </div>
                </div>

                <div className="divide-y divide-neutral-800 text-xs font-mono">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-neutral-500">CONTAINMENT LEVEL:</span>
                    <span className="text-white font-bold uppercase">{stabilityIndex > 75 ? 'NOMINAL SAFE' : stabilityIndex > 45 ? 'SHIMMERING_WARN' : 'CRITICAL_DRIFT'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-neutral-500">COGNITIVE SINK:</span>
                    <span className="text-white font-bold">{seqLength > 8000 ? 'ACTIVE (LOST INDEX)' : 'NOMINAL FILTERS'}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-neutral-500">STOCHASTIC INTERFERENCE:</span>
                    <span className="text-white font-bold">{(floodLoad * 0.4).toFixed(1)}% NOISE</span>
                  </div>
                </div>
              </div>

              {/* Formula and dynamic explanations */}
              <div className="bg-[#ccff00]/5 border border-[#ccff00]/15 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-1.5 text-[#ccff00] font-mono text-[10px] uppercase font-bold">
                  <Award size={14} />
                  <span>Cognitive Safeguard</span>
                </div>
                <p className="font-vazir text-right text-[11px] text-[#eaffd0] leading-loose font-normal">
                  سیستم صیانت بر تراکنش‌ها به صورت مداوم وضعیت حافظه‌ها را نمونه‌برداری کرده و با پایش سافت‌مکس خطای بردارهای استنتاج را کاهش می‌دهد.
                </p>
                <div className="flex items-center justify-between text-[8px] text-neutral-500 font-mono">
                  <span>DISPATCH_CELL: #9042</span>
                  <span>VERSION: v3.0</span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SCIENTIFIC ABSTRACT & DEEP DIVE ARTICLES */}
        <section className="space-y-6">
          <div>
            <h5 className="text-xs uppercase font-mono tracking-[0.3em] text-[#ccff00] font-bold">DOCUMENTATION_DOSSIER</h5>
            <h3 className="text-2xl font-mono font-black text-white uppercase mt-0.5">Bilingual Memory Dossier Chapters</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left sidebar selectors */}
            <div className="lg:col-span-4 space-y-2.5">
              {dossierChapters.map((ch, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDossierChapter(i)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    activeDossierChapter === i
                      ? 'bg-neutral-900/90 border-[#ccff00]/40 shadow-[0_0_15px_rgba(204,255,0,0.05)]'
                      : 'bg-neutral-950/30 border-neutral-850 hover:bg-neutral-900/30'
                  }`}
                >
                  <span className={`font-mono text-xs font-black h-6 w-6 rounded-lg flex items-center justify-center border ${
                    activeDossierChapter === i ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                  }`}>
                    0{i + 1}
                  </span>
                  
                  <div className="space-y-1">
                    <span className="text-xs text-white font-mono font-bold block uppercase tracking-tight">
                      {ch.titleEn}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-vazir block font-light">
                      {ch.titleFa}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Right detailed bilingual viewport */}
            <div className="lg:col-span-8 bg-neutral-950/50 border border-neutral-800 rounded-3xl p-6 lg:p-8 space-y-8 min-h-[340px] relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1.5 bg-[#ccff00] pointer-events-none" />

              <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">
                  Chapter SEC_0{activeDossierChapter + 1} // GROUNDING_BLUEPRINT
                </span>
                <Badge variant="cyan">BILINGUAL RESEARCH</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* English Scientific Thesis */}
                <div className="space-y-3 font-sans text-neutral-200">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                    <FileText size={12} className="text-[#ccff00]" />
                    <span>English Analytical Abstract</span>
                  </div>
                  <h4 className="text-base text-white uppercase font-mono font-black border-b border-neutral-900 pb-2">
                    {dossierChapters[activeDossierChapter].titleEn}
                  </h4>
                  <p className="leading-relaxed font-light text-neutral-400 text-sm text-justify">
                    {dossierChapters[activeDossierChapter].en}
                  </p>
                </div>

                {/* Persian Vazirmatn Thesis */}
                <div className="space-y-3 font-sans text-right border-t md:border-t-0 md:border-r border-neutral-850 pt-6 md:pt-0 md:pr-8 text-neutral-200">
                  <div className="flex items-center justify-end gap-1.5 text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                    <span>تشریح و تحلیل فنی (فارسی)</span>
                    <Cpu size={12} className="text-[#ccff00]" />
                  </div>
                  <h4 className="text-base text-white font-vazir font-extrabold border-b border-neutral-900 pb-2">
                    {dossierChapters[activeDossierChapter].titleFa}
                  </h4>
                  <p className="leading-loose font-vazir font-light text-neutral-300 text-sm text-justify">
                    {dossierChapters[activeDossierChapter].fa}
                  </p>
                </div>

              </div>

              {/* Footer citation */}
              <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 text-[10.5px] font-mono text-neutral-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span>PEER CITED: KONKRED Memory Protection Protocol v3.0</span>
                <span className="text-[#ccff00]">VERIFIED STATUS: GROUNDED INVARIANT</span>
              </div>

            </div>

          </div>
        </section>

        {/* COMPARISON AND SPECTRAL DIAGRAM SHEET */}
        <section className="concrete-card bg-neutral-950 p-6 lg:p-8 rounded-[2rem] border border-neutral-800 space-y-6">
          <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-widest">
            <Award size={15} className="text-[#ccff00]" />
            <span>Quantitative Comparison: Memory Degradation Vectors</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/80 uppercase text-[10px] tracking-wider border-b border-neutral-800 text-[#ccff00]">
                  <th className="p-4 text-left">Phenomenon Model</th>
                  <th className="p-4 text-center">Fidelity Degradation Rates</th>
                  <th className="p-4 text-center">Grounding Resolution Limits</th>
                  <th className="p-4 text-right border-l-0">Counterclaim Remedies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-400">
                <tr className="hover:bg-neutral-900/40 transition-colors">
                  <td className="p-4 text-white font-sans font-bold">
                    Context Window Flooding
                    <span className="block text-[10px] text-neutral-500 font-mono font-normal mt-1">مدل بمباران کانتسکت متنی</span>
                  </td>
                  <td className="p-4 text-center text-red-400 font-semibold">-54% Accuracy Loss</td>
                  <td className="p-4 text-center">3,500 Tokens Bound</td>
                  <td className="p-4 text-right font-sans text-neutral-300">Intelligent Query Partitioning & Sliding Token window</td>
                </tr>
                <tr className="hover:bg-neutral-900/40 transition-colors">
                  <td className="p-4 text-white font-sans font-bold">
                    Lost-In-The-Middle Traps
                    <span className="block text-[10px] text-neutral-500 font-mono font-normal mt-1">تله تمرکز در میانه مستندات</span>
                  </td>
                  <td className="p-4 text-center text-yellow-400 font-semibold">-35% Retrieval Loss</td>
                  <td className="p-4 text-center">Index 40% - 60% Decay</td>
                  <td className="p-4 text-right font-sans text-neutral-300">Rearrange prompt inputs to tail buffers sequentially</td>
                </tr>
                <tr className="hover:bg-neutral-900/40 transition-colors">
                  <td className="p-4 text-white font-sans font-bold">
                    Recursive Loop Sums
                    <span className="block text-[10px] text-neutral-500 font-mono font-normal mt-1">زوال چرخه‌های خلاصه‌سازی</span>
                  </td>
                  <td className="p-4 text-center text-red-500 font-semibold">Total Collapse (&gt;5 Feedback)</td>
                  <td className="p-4 text-center">Entropy &gt; 9.0 bits</td>
                  <td className="p-4 text-right font-sans text-neutral-300">Dynamic Temperature dampening limit logic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default IntelReportPage;
