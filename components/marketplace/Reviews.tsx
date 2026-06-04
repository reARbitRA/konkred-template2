
import React from 'react';
import { Star, MessageSquare, User, ShieldCheck, SearchX } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const Reviews: React.FC = () => {
  // Production will fetch from /reviews/{assetId}
  const reviews: any[] = []; 

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Verified Feedback</h3>
          <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">Based on on-chain acquisitions</p>
        </div>
        {reviews.length > 0 && (
            <div className="text-right">
                <div className="text-3xl font-black text-white font-display">0.0</div>
                <div className="flex text-ghost gap-0.5 text-[10px]">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} />)}
                </div>
            </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
            <div className="py-20 text-center concrete-card border-dashed border-white/10 rounded-2xl bg-black/10">
                <SearchX size={32} className="mx-auto text-ghost mb-4 opacity-20" />
                <p className="text-xs text-ghost font-mono uppercase tracking-widest">Awaiting verified user feedback</p>
            </div>
        ) : reviews.map((review) => (
          <div key={review.id} className="concrete-card p-6 rounded-2xl border-white/5 bg-black/20">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-void-300 rounded-full flex items-center justify-center border border-white/5">
                   <User size={14} className="text-ghost" />
                </div>
                <div>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{review.author}</span>
                      {review.verified && <ShieldCheck size={12} className="text-neon-cyan" />}
                   </div>
                   <span className="text-[9px] font-mono text-ghost uppercase">{review.role} License</span>
                </div>
              </div>
              <div className="flex gap-0.5">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? "text-neon-gold fill-neon-gold" : "text-ghost"} />
                 ))}
              </div>
            </div>
            <p className="text-sm text-ghost-light leading-relaxed font-light">"{review.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
