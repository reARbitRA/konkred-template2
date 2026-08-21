/**
 * 36-entry catalogue index (/catalogue).
 * 21 canonical ARB suites + 15 validated workflows, parent/child aware,
 * searchable and filterable. Suites and workflows are distinct entries.
 */
import React, { useEffect, useMemo, useState } from 'react';
import type { PageView } from '../types.ts';
import { ENTRIES, SUITES, WORKFLOWS, PORTFOLIO_CATEGORIES, searchEntries } from '../content/catalogue/portfolio.ts';
import type { PortfolioEntry } from '../content/catalogue/types.ts';
import { StatusChip, ValidationBadge } from '../components/portfolio/Evidence.tsx';
import { getChildren } from '../content/catalogue/portfolio.ts';
import { track } from '../utils/analytics.ts';
import { Search, Layers, Wrench, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (page: PageView, slug?: string) => void;
}

const Card: React.FC<{ entry: PortfolioEntry; onNavigate: (page: PageView, slug?: string) => void }> = ({ entry, onNavigate }) => {
  const isSuite = entry.type === 'SUITE';
  const kids = isSuite ? getChildren(entry.id).length : 0;
  return (
    <button
      onClick={() => onNavigate(isSuite ? 'suite_detail' : 'workflow_detail', entry.slug)}
      data-testid={`catalogue-card-${entry.slug}`}
      className="text-left border-2 border-black bg-[#0E1319] rounded-2xl p-5 hover:border-amber-500/60 transition-colors cursor-pointer shadow-[3px_3px_0px_0px_#000000] flex flex-col gap-3"
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-widest font-black border rounded px-1.5 py-0.5 ${isSuite ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'}`}>
          {isSuite ? <Layers size={10} /> : <Wrench size={10} />} {isSuite ? 'Suite' : 'Workflow'}
        </span>
        <StatusChip status={entry.status} size="sm" />
      </div>
      <div>
        <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{entry.category}</p>
        <h3 className="font-mono font-black text-sm text-white leading-snug mt-0.5">{entry.title}</h3>
        <p className="text-[11px] text-zinc-400 leading-snug mt-1.5 line-clamp-2">{entry.jobToBeDone}</p>
      </div>
      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <ValidationBadge status={entry.validationStatus} />
        <span className="text-[9px] font-mono text-zinc-600 shrink-0">
          {isSuite ? `${entry.modules.length} modules${kids ? ` · ${kids} workflows` : ''}` : `from ${entry.parentRoute?.split('/').pop() ?? ''}`}
        </span>
      </div>
      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500">
        {isSuite ? 'View suite' : 'Launch tool'} <ArrowRight size={11} />
      </span>
    </button>
  );
};

const CataloguePage: React.FC<Props> = ({ onNavigate }) => {
  useEffect(() => { track('catalogue_view'); }, []);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'SUITE' | 'WORKFLOW'>('all');
  const [category, setCategory] = useState('all');

  const results = useMemo(() => {
    let list = searchEntries(query, type === 'all' ? undefined : type);
    if (category !== 'all') list = list.filter((e) => e.category === category);
    return list;
  }, [query, type, category]);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="pt-2 pb-8 border-b border-white/10 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Product catalogue</p>
          <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight uppercase">36 controlled workflow products</h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {SUITES.length} canonical ARB suites and {WORKFLOWS.length} validated workflow tools — every entry
            evidence-linked, versioned and human-supervised. Scores are design targets; PASS marks are narrow
            public-data preflights.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 py-6 sticky top-0 bg-[#0B0F14]/95 backdrop-blur z-10 border-b border-white/5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, buyers, modules…"
              aria-label="Search catalogue"
              className="w-full bg-[#0E1319] border-2 border-black rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'SUITE', 'WORKFLOW'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-3 rounded-xl font-mono font-black text-[10px] uppercase tracking-widest border-2 cursor-pointer ${type === t ? 'bg-amber-500 text-black border-black' : 'border-zinc-800 text-zinc-400 hover:border-amber-500/50'}`}
              >
                {t === 'all' ? `All ${ENTRIES.length}` : t === 'SUITE' ? `Suites ${SUITES.length}` : `Workflows ${WORKFLOWS.length}`}
              </button>
            ))}
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className="bg-[#0E1319] border-2 border-black rounded-xl px-3 py-3 text-[10px] font-mono text-zinc-300 cursor-pointer focus:outline-none focus:border-amber-500"
          >
            <option value="all">All categories</option>
            {PORTFOLIO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <p className="font-mono text-[10px] text-zinc-600 py-4" data-testid="catalogue-count">
          {results.length} of {ENTRIES.length} entries
        </p>

        {results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-xs text-zinc-500">No entries match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((e) => <Card key={e.slug} entry={e} onNavigate={onNavigate} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CataloguePage;
