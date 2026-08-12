import React from 'react';
import { Listing } from '../../types.ts';
import { Star, Shield, Download, Zap, Clock, Award, Terminal, Play, Code, Activity } from 'lucide-react';
import Badge from '../common/Badge.tsx';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
  onQuickTest?: (e: React.MouseEvent) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick, onQuickTest }) => {
  const getPricingDisplay = () => {
    const { pricing } = listing;
    if (pricing.mode === 'one_time') return `$${pricing.amount}`;
    if (pricing.mode === 'subscription') return `$${pricing.amount}/${pricing.interval === 'month' ? 'mo' : 'yr'}`;
    return `$${pricing.amount}/${pricing.unit}`;
  };

  const getAuditColor = (score: number) => {
    if (score >= 90) return 'text-neon-green border-neon-green/30 bg-neon-green/5';
    if (score >= 80) return 'text-neon-gold border-neon-gold/30 bg-neon-gold/5';
    return 'text-neon-orange border-neon-orange/30 bg-neon-orange/5';
  };

  // Get access tag based on amount
  const getAccessTag = () => {
    const amount = listing.pricing.amount;
    if (amount === 0) return { label: 'Free', color: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20' };
    if (amount > 0 && amount < 150) return { label: 'Pro', color: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20' };
    return { label: 'Custom', color: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' };
  };

  const accessTag = getAccessTag();
  const estimatedCost = Math.round((listing.pricing.amount || 29) + 12);

  return (
    <div 
      onClick={onClick}
      className="group bg-surface-1 border border-white/5 rounded-2xl overflow-hidden hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/5 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full justify-between"
    >
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className={`px-2.5 py-1 text-[9px] font-mono rounded-full border ${accessTag.color}`}>
              {accessTag.label}
            </span>
            <div className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold font-mono flex items-center gap-1 ${getAuditColor(listing.auditScore)}`}>
              <Shield size={10} />
              AUDIT {listing.auditScore}
            </div>
          </div>

          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 group-hover:text-accent-cyan transition-colors font-display">
            {listing.title}
          </h3>
          
          <p className="text-text-secondary text-xs leading-relaxed mb-4 line-clamp-2 font-light">
            {listing.shortDescription}
          </p>

          {/* Estimated Cost Bar Indicator */}
          <div className="mb-4 p-2.5 bg-black/40 border border-white/5 rounded-xl space-y-1">
            <div className="flex justify-between items-center text-[9px] font-mono">
              <span className="text-ghost uppercase flex items-center gap-1">
                <Activity size={10} className="text-neon-cyan" /> Est. Compute Cost
              </span>
              <span className="text-neon-cyan font-bold">~${estimatedCost}/mo</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neon-cyan/70 group-hover:bg-neon-cyan transition-all duration-300" 
                style={{ width: `${Math.min(100, Math.max(20, (estimatedCost / 300) * 100))}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-2">
          <div className="flex flex-col">
            <span className="text-white font-mono font-bold text-lg">{getPricingDisplay()}</span>
            <span className="text-[9px] text-text-secondary uppercase tracking-wider font-mono">
              {listing.pricing.mode.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onQuickTest && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickTest(e);
                }}
                className="px-3 py-2 bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 text-neon-cyan text-xs font-mono font-bold uppercase rounded-lg transition-all flex items-center gap-1.5"
                title="Quick Test Asset Runtime"
              >
                <Terminal size={12} />
                <span>Quick Test</span>
              </button>
            )}

            <button 
              className="px-3.5 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold uppercase rounded-lg transition-all flex items-center gap-1"
            >
              {listing.pricing.amount === 0 ? 'Run App' : 'Get Access'} 
              <Zap size={10} className="fill-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ListingCard);