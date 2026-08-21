import React from 'react';
import { PageView } from '../types.ts';
import { ArrowLeft, SearchX } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (page: PageView, slug?: string) => void;
}

/**
 * Proper 404 page. Purged (removed) routes render this page instead of a
 * fake marketplace/demo page.
 */
const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[60vh] bg-[#0B0F14] text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <SearchX size={28} className="text-amber-500" />
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
          ERROR_404 // ROUTE_NOT_FOUND
        </p>
        <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight uppercase mb-4">
          Node Not Found
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-8">
          This route does not exist on the KONKRED platform. It may have been removed with
          the legacy marketplace and demo modules. Browse the product catalogue instead.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2 bg-transparent text-white font-mono font-bold px-6 py-3 uppercase tracking-wider text-sm border-2 border-white/20 hover:border-amber-500 hover:text-amber-500 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
          <button
            onClick={() => onNavigate('catalogue')}
            className="inline-flex items-center gap-2 bg-amber-500 text-black font-mono font-black px-6 py-3 uppercase tracking-wider text-sm border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
          >
            <span>Browse Products</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
