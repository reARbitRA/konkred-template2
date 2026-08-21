import React, { useState } from 'react';
import type { ProductRecord } from '../../catalog/types.ts';
import { FIXTURES } from '../../catalog/fixtures.ts';
import { runProductDemo, type DemoRunResult } from '../../services/demoService.ts';
import { Play, Loader2, AlertTriangle, CheckCircle2, TerminalSquare, TriangleAlert } from 'lucide-react';

interface ProductDemoProps {
  product: ProductRecord;
}

/**
 * Fixture-backed public demo runner.
 * - Uses ONLY public synthetic fixtures.
 * - Always displays DEMO + NOT_FOR_PRODUCTION_DECISION notices.
 * - Output is only rendered after server-side schema validation (reported in run result).
 */
export const ProductDemo: React.FC<ProductDemoProps> = ({ product }) => {
  const [result, setResult] = useState<DemoRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fixture = product.demoStatus.available ? FIXTURES[product.slug] : null;

  const handleRun = async () => {
    if (!fixture) return;
    setIsRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await runProductDemo(product.slug, fixture);
      setResult(res);
      if (res.status === 'error' && res.message) setError(res.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Demo failed unexpectedly.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section
      aria-label={`Public demo for ${product.name}`}
      className="border-2 border-emerald-500/40 bg-[#07120C] rounded-2xl overflow-hidden"
    >
      {/* DEMO banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/30 bg-emerald-500/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <TriangleAlert size={14} className="text-emerald-400" />
          <span className="font-mono font-black uppercase tracking-widest text-[11px] text-emerald-400">
            DEMO // FIXTURE-BACKED
          </span>
        </div>
        <span className="font-mono font-black uppercase tracking-widest text-[10px] text-emerald-500/80">
          NOT_FOR_PRODUCTION_DECISION
        </span>
      </div>

      <div className="p-5 space-y-4">
        {product.demoStatus.available ? (
          <>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                  Runs the canonical <span className="font-mono text-emerald-400">{product.name}</span> prompt
                  against a public synthetic sample. Model calls execute server-side; the output is
                  schema-validated before display.
                </p>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">
                  Fixture: {product.demoStatus.fixturePath} ({product.fixture?.label || 'synthetic-public'})
                </p>
              </div>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="inline-flex items-center gap-2 bg-emerald-500 text-black font-mono font-black text-xs uppercase tracking-widest px-5 py-3 border-2 border-black hover:bg-black hover:text-emerald-400 hover:border-emerald-500 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                {isRunning ? 'Running Demo…' : 'Run Public Demo'}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3" role="alert">
                <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300 font-mono">{error}</p>
              </div>
            )}

            {result && result.status === 'ok' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-500">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>RUN_ID: {result.runId}</span>
                  <span>· MODEL: {result.model}</span>
                  <span>· PROMPT: {result.promptVersion}</span>
                </div>
                <pre className="bg-black/60 border border-emerald-500/20 rounded-xl p-4 text-xs text-zinc-200 font-mono leading-relaxed overflow-x-auto max-h-[480px] overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(result.output, null, 2)}
                </pre>
              </div>
            )}

            {result && result.status !== 'ok' && (
              <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/40 rounded-xl px-4 py-3" role="status">
                <TerminalSquare size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-black uppercase tracking-widest text-amber-400">
                    {result.status.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{result.message}</p>
                  {result.validationErrors && result.validationErrors.length > 0 && (
                    <ul className="list-disc pl-4 text-[11px] font-mono text-red-300 space-y-0.5">
                      {result.validationErrors.map((v, i) => <li key={i}>{v}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-start gap-3 bg-zinc-500/10 border border-zinc-500/40 rounded-xl px-4 py-3">
            <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              No public fixture is bundled for this product. <span className="font-mono text-amber-400">REQUEST_PILOT</span> —
              a supervised pilot with a sanitized customer-provided dataset is the entry path.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
