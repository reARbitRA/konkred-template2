import React from 'react';
import { Listing } from '../../types.ts';
import { Star, Shield, Download, Zap, Clock, Award } from 'lucide-react';
import Badge from '../common/Badge.tsx';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
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

  const DeliveryIcon = {
    download: <Download size={12} />,
    api_key: <Zap size={12} />,
    hosted_demo: <Play size={12} />,
    repo_access: <Code size={12} />,
    booking: <Clock size={12} />,
  }[listing.delivery];

  return (
    <div 
      onClick={onClick}
      className="group bg-void-50 border border-white/5 rounded-lg overflow-hidden hover:border-neon-cyan/50 hover:shadow-elevation-2 transition-all cursor-pointer flex flex-col"
    >
      <div className="p-4 flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-mono text-ghost uppercase tracking-widest">{listing.type}</span>
          <div className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold font-mono flex items-center gap-1 ${getAuditColor(listing.auditScore)}`}>
            <Shield size={10} />
            AUDIT {listing.auditScore}
          </div>
        </div>

        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-neon-cyan transition-colors">
          {listing.title}
        </h3>
        <p className="text-ghost-light text-xs leading-relaxed mb-4 line-clamp-2">
          {listing.shortDescription}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-ghost">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-neon-gold fill-neon-gold" />
            <span className="text-white">{listing.rating}</span>
            <span>({listing.reviewCount})</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-1">
            <Award size={12} className="text-neon-blue" />
            <span>{listing.seller.name}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-white/5 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-white font-mono font-bold text-lg">{getPricingDisplay()}</span>
          <span className="text-[9px] text-ghost uppercase tracking-tighter">
            {listing.pricing.mode.replace('_', ' ')}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-ghost-light text-xs font-mono uppercase">
          {DeliveryIcon}
          {listing.delivery.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
};

const Play = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const Code = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;

export default ListingCard;