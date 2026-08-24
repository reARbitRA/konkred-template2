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
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-24" style={{ background: 'var(--k-bg)', color: 'var(--k-ink)' }}>
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 border-4 mb-6 rotate-[-3deg]" style={{ background: 'var(--k-amber)', borderColor: 'var(--k-edge)', color: 'var(--k-on-acc)' }}>
          <SearchX size={28} />
        </div>
        <p className="k-mono text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: 'var(--k-amber)' }}>
          ERROR_404 // ROUTE_NOT_FOUND
        </p>
        <h1 className="k-title text-4xl sm:text-6xl mb-4">Node Not Found</h1>
        <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto" style={{ color: 'var(--k-mut)' }}>
          This route does not exist on the KONKRED platform. It may have been removed with
          the legacy marketplace and demo modules. Browse the product catalogue instead.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="k-btn k-btn-ghost"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
          <button
            onClick={() => onNavigate('catalogue')}
            className="k-btn k-btn-acc"
          >
            <span>Browse Products</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
