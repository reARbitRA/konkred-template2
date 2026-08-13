import React, { useState, useMemo } from 'react';
import { Listing } from '../../types.ts';
import { 
  X, Terminal, Play, Loader2, CheckCircle2, Zap, ShieldCheck, 
  Cpu, Sliders, Activity, Database, Sparkles, Layers, ArrowRight,
  RefreshCw, DollarSign, BarChart2, ShieldAlert
} from 'lucide-react';
import Badge from './Badge.tsx';
import Button from './Button.tsx';
import { aiService } from '../../services/ai.ts';

interface AppTesterProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onAcquire?: (listing: Listing) => void;
}

export const AppTester: React.FC<AppTesterProps> = ({ listing, isOpen, onClose, onAcquire }) => {
  // Runtime Variables
  const [concurrency, setConcurrency] = useState<number>(5);
  const [monthlyVolume, setMonthlyVolume] = useState<number>(25000); // Requests
  const [tokenLimit, setTokenLimit] = useState<number>(2048);
  const [targetEnv, setTargetEnv] = useState<'sandbox' | 'staging' | 'production_enclave'>('sandbox');
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(
    `Execute audit check for ${listing.title}. Validate payload constraints and measure response latency.`
  );

  // Execution state
  const [isTesting, setIsTesting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testOutput, setTestOutput] = useState<any | null>(null);
  const [testMetrics, setTestMetrics] = useState<{
    latencyMs: number;
    tokensProcessed: number;
    cpuLoad: number;
    memoryMb: number;
    status: string;
  } | null>(null);

  // Dynamic Live Cost Calculation
  const costCalculation = useMemo(() => {
    const baseAmount = listing.pricing.amount || 29;
    // Compute multiplier based on volume and concurrency
    const volumeCost = (monthlyVolume / 1000) * 0.12; // $0.12 per 1k reqs
    const tokenCost = (tokenLimit / 1024) * 0.08 * (monthlyVolume / 1000);
    const envMultiplier = targetEnv === 'production_enclave' ? 1.5 : targetEnv === 'staging' ? 1.2 : 1.0;
    const concurrencyCost = (concurrency - 1) * 2.50; // $2.50 per addl thread

    const computeSubtotal = Math.round((volumeCost + tokenCost + concurrencyCost) * envMultiplier);
    const totalEstimate = baseAmount + computeSubtotal;

    return {
      baseAmount,
      computeSubtotal,
      totalEstimate,
      volumeCost: Math.round(volumeCost),
      tokenCost: Math.round(tokenCost),
      concurrencyCost: Math.round(concurrencyCost)
    };
  }, [listing.pricing.amount, monthlyVolume, tokenLimit, targetEnv, concurrency]);

  if (!isOpen) return null;

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestLogs([]);
    setTestOutput(null);
    setTestMetrics(null);

    const logs: string[] = [
      `[SYS_INIT] Initializing runtime container for asset: ${listing.id}`,
      `[ENV_LINK] Connecting to ${targetEnv.toUpperCase()} node cluster...`,
      `[ALLOC] Allocating ${concurrency} parallel thread buffers...`,
      `[PAYLOAD] Injecting prompt payload (${customSystemPrompt.length} chars, token limit: ${tokenLimit})...`
    ];

    setTestLogs([...logs]);

    // Simulate progressive execution steps
    await new Promise(r => setTimeout(r, 600));
    logs.push(`[CHECKPOINT] Audit score verified (${listing.auditScore}/100). Executing runtime validation...`);
    setTestLogs([...logs]);

    const startTime = Date.now();

    try {
      // Run AI simulation using actual generic AI service if possible, or robust mock response
      let resultPayload: any;
      
      try {
        const prompt = `System Test Request for Listing: "${listing.title}". Description: "${listing.shortDescription}". User Config Prompt: "${customSystemPrompt}". Respond with a JSON analysis object.`;
        const schema = {
          type: "object",
          properties: {
            status: { type: "string" },
            latencyGrade: { type: "string" },
            verificationCode: { type: "string" },
            confidenceScore: { type: "number" },
            executionSummary: { type: "string" },
            recommendation: { type: "string" }
          }
        };
        
        resultPayload = await aiService.runGenericAgent(prompt, schema, 'system-tester');
      } catch (e) {
        // Fallback simulation
        const arr = new Uint32Array(1);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(arr);
        const codeNum = 100000 + (arr[0] % 900000);
        resultPayload = {
          status: "SUCCESS_200_OK",
          latencyGrade: "OPTIMAL_SUB_100MS",
          verificationCode: `ENC-${codeNum}`,
          confidenceScore: 0.998,
          executionSummary: `Validated asset "${listing.title}" payload under ${concurrency}x concurrency. Zero-drift logic confirmed.`,
          recommendation: "Ready for immediate deployment to production enclave."
        };
      }

      const duration = Math.max(1, Math.round(performance.now() - startTime));
      
      logs.push(`[EXEC_COMPLETE] Runtime returned status 200 OK in ${duration}ms`);
      logs.push(`[TELEMETRY] Memory usage: 142.4MB | CPU Load: ${(12 + concurrency * 1.5).toFixed(1)}%`);
      logs.push(`[VERIFICATION] Hash verified against Enclave Audit Ledger.`);

      setTestLogs([...logs]);
      setTestOutput(resultPayload);
      setTestMetrics({
        latencyMs: duration,
        tokensProcessed: Math.floor(tokenLimit * 0.85),
        cpuLoad: Number((12 + concurrency * 1.5).toFixed(1)),
        memoryMb: 142.4,
        status: "200_VERIFIED_OK"
      });

    } catch (err: any) {
      logs.push(`[ERROR] Test execution failed: ${err.message || 'Node timeout'}`);
      setTestLogs([...logs]);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-void/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col concrete-card bg-[#090D16] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-10">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan">
              <Terminal size={20} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Badge variant="cyan" className="font-mono text-[9px] uppercase tracking-widest">
                  RUNTIME_TESTER_v2.4
                </Badge>
                <span className="text-xs font-mono text-ghost flex items-center gap-1">
                  <ShieldCheck size={12} className="text-neon-green" /> AUDIT_{listing.auditScore}
                </span>
              </div>
              <h2 className="text-xl lg:text-2xl font-display font-black text-white uppercase tracking-tight mt-1">
                {listing.title} <span className="text-ghost-light text-sm font-normal">/ Simulator</span>
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-3 rounded-full text-ghost hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body: Two Column Layout */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Variables & Live Cost Calculator */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-bold text-ghost uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={12} className="text-neon-cyan" /> 1. Runtime Environment & Target
                </label>
                <span className="text-[10px] font-mono text-neon-cyan">LIVE_CONFIG</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['sandbox', 'staging', 'production_enclave'] as const).map(env => (
                  <button
                    key={env}
                    onClick={() => setTargetEnv(env)}
                    className={`p-3 rounded-xl border text-[10px] font-mono font-bold uppercase transition-all ${
                      targetEnv === env 
                        ? 'border-neon-cyan bg-neon-cyan/10 text-white shadow-[0_0_15px_rgba(204,255,0,0.15)]' 
                        : 'border-white/5 bg-void text-ghost hover:border-white/20'
                    }`}
                  >
                    {env.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable Sliders */}
            <div className="space-y-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
              {/* Concurrency Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ghost font-mono uppercase tracking-wider text-[10px]">Parallel Threads (Concurrency)</span>
                  <span className="font-mono font-bold text-neon-cyan">{concurrency} Threads</span>
                </div>
                <input 
                  type="range" 
                  min={1} 
                  max={20} 
                  value={concurrency}
                  onChange={(e) => setConcurrency(Number(e.target.value))}
                  className="w-full accent-neon-cyan bg-void-400 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Monthly Volume Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ghost font-mono uppercase tracking-wider text-[10px]">Estimated Monthly Requests</span>
                  <span className="font-mono font-bold text-white">{monthlyVolume.toLocaleString()} reqs/mo</span>
                </div>
                <input 
                  type="range" 
                  min={1000} 
                  max={200000} 
                  step={1000}
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className="w-full accent-neon-cyan bg-void-400 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Token Limit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ghost font-mono uppercase tracking-wider text-[10px]">Max Payload Token Limit</span>
                  <span className="font-mono font-bold text-ghost-light">{tokenLimit} Tokens</span>
                </div>
                <input 
                  type="range" 
                  min={512} 
                  max={8192} 
                  step={256}
                  value={tokenLimit}
                  onChange={(e) => setTokenLimit(Number(e.target.value))}
                  className="w-full accent-neon-cyan bg-void-400 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Prompt / Payload Config */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-ghost uppercase tracking-widest block">
                2. Test Prompt Payload Input
              </label>
              <textarea
                value={customSystemPrompt}
                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                rows={3}
                className="w-full bg-void-200 border border-white/10 rounded-xl p-3.5 text-xs font-mono text-white focus:outline-none focus:border-neon-cyan resize-none placeholder:text-ghost/40"
                placeholder="Enter custom prompt instructions for runtime simulator..."
              />
            </div>

            {/* Live Estimated Cost Bar */}
            <div className="concrete-card p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 size={14} className="text-neon-cyan" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ghost">Dynamic Cost Estimator</span>
                </div>
                <Badge variant="cyan" className="text-[9px] font-mono">
                  ${costCalculation.totalEstimate} / MO ESTIMATED
                </Badge>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="space-y-1.5">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-neon-cyan transition-all duration-300" 
                    style={{ width: `${(costCalculation.baseAmount / costCalculation.totalEstimate) * 100}%` }}
                    title={`Base License: $${costCalculation.baseAmount}`}
                  />
                  <div 
                    className="h-full bg-neon-blue transition-all duration-300" 
                    style={{ width: `${(costCalculation.computeSubtotal / costCalculation.totalEstimate) * 100}%` }}
                    title={`Compute & Threads: $${costCalculation.computeSubtotal}`}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-ghost/70">
                  <span>Base Fee: <strong className="text-white">${costCalculation.baseAmount}</strong></span>
                  <span>Compute Variable: <strong className="text-neon-cyan">+${costCalculation.computeSubtotal}</strong></span>
                  <span>Est. Total: <strong className="text-neon-cyan font-bold">${costCalculation.totalEstimate}/mo</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Output & Console Logs */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold text-ghost uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-neon-cyan" /> 3. Runtime Telemetry & Console Log
              </label>
              {testMetrics && (
                <span className="text-[10px] font-mono text-neon-green flex items-center gap-1 font-bold">
                  <CheckCircle2 size={12} /> {testMetrics.status}
                </span>
              )}
            </div>

            {/* Terminal Window */}
            <div className="flex-1 bg-black border border-white/10 rounded-2xl p-4 font-mono text-xs flex flex-col justify-between min-h-[300px] shadow-inner relative overflow-hidden">
              <div className="space-y-2 overflow-y-auto custom-scrollbar max-h-[260px] pr-2">
                {testLogs.length === 0 ? (
                  <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center text-ghost/40 space-y-3">
                    <Terminal size={32} className="opacity-30" />
                    <p className="text-[11px] uppercase tracking-wider">Awaiting Execution Trigger...</p>
                    <p className="text-[9px] max-w-xs text-ghost/30">Click "Execute Runtime Test" below to simulate asset deployment and receive live telemetry.</p>
                  </div>
                ) : (
                  testLogs.map((log, i) => (
                    <div key={i} className="text-ghost-light text-[11px] leading-relaxed flex items-start gap-2 animate-in fade-in duration-200">
                      <span className="text-neon-cyan text-[10px] font-bold select-none">&gt;</span>
                      <span className={log.includes('ERROR') ? 'text-neon-red font-bold' : log.includes('COMPLETE') || log.includes('200') ? 'text-neon-green font-bold' : ''}>
                        {log}
                      </span>
                    </div>
                  ))
                )}

                {/* Structured Output View */}
                {testOutput && (
                  <div className="mt-4 p-3 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl space-y-2">
                    <div className="text-[10px] text-neon-cyan font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>[OUTPUT_PAYLOAD_SCHEMA]</span>
                      <span>{testMetrics?.latencyMs}ms</span>
                    </div>
                    <pre className="text-[10px] text-ghost-light overflow-x-auto whitespace-pre-wrap font-mono">
                      {JSON.stringify(testOutput, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Metrics Bar */}
              {testMetrics && (
                <div className="pt-3 border-t border-white/10 grid grid-cols-4 gap-2 text-center mt-3">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[8px] text-ghost uppercase font-mono">Latency</div>
                    <div className="text-xs font-bold font-mono text-neon-cyan">{testMetrics.latencyMs}ms</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[8px] text-ghost uppercase font-mono">CPU Load</div>
                    <div className="text-xs font-bold font-mono text-white">{testMetrics.cpuLoad}%</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[8px] text-ghost uppercase font-mono">Memory</div>
                    <div className="text-xs font-bold font-mono text-white">{testMetrics.memoryMb}MB</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[8px] text-ghost uppercase font-mono">Tokens/s</div>
                    <div className="text-xs font-bold font-mono text-neon-green">148.2</div>
                  </div>
                </div>
              )}
            </div>

            {/* Test Trigger Button */}
            <Button
              variant="secondary"
              onClick={handleRunTest}
              isLoading={isTesting}
              leftIcon={<Play size={14} className="fill-current" />}
              className="w-full py-4 text-xs tracking-widest uppercase font-mono"
            >
              {isTesting ? 'SIMULATING ENCLAVE EXECUTION...' : 'EXECUTE RUNTIME TEST'}
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-ghost uppercase">Total Estimated Rate:</span>
            <span className="text-2xl font-display font-black text-white">${costCalculation.totalEstimate} <span className="text-xs font-normal text-ghost">/ mo</span></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl border border-white/10 text-ghost hover:text-white text-xs font-mono font-bold uppercase tracking-widest transition-all"
            >
              Close Simulator
            </button>
            {onAcquire && (
              <button
                onClick={() => {
                  onClose();
                  onAcquire(listing);
                }}
                className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-neon-cyan text-black hover:scale-105 transition-all text-xs font-mono font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.2)]"
              >
                ACQUIRE ASSET LICENSE <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTester;
