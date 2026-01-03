
import React from 'react';
import { Star, ThumbsUp, MessageSquare, User, ShieldCheck } from 'lucide-react';
import Badge from '../common/Badge.tsx';

const Reviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      author: 'Sarah_Logic_Architect',
      rating: 5,
      date: '2 days ago',
      content: 'The decision tree logic in this protocol is flawless. Integrated it into our legal triage bot in less than 2 hours. Zero hallucinations detected during stress testing.',
      helpful: 24,
      verified: true,
      role: 'Enterprise'
    },
    {
      id: 2,
      author: 'DevOps_Lead_01',
      rating: 4,
      date: '1 week ago',
      content: 'Solid architecture. Documentation could be a bit more explicit on the API rate limits, but the core functionality is robust.',
      helpful: 8,
      verified: true,
      role: 'Pro'
    },
    {
      id: 3,
      author: 'Finance_Node_X',
      rating: 5,
      date: '2 weeks ago',
      content: 'Game changer for our valuation workflows. The DCF logic matches our internal Excel models perfectly but runs autonomously.',
      helpful: 42,
      verified: true,
      role: 'Enterprise'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <div>
          <h3 className="text-lg font-bold text-white uppercase tracking-tight">Verified Feedback</h3>
          <p className="text-[10px] text-ghost font-mono uppercase tracking-widest mt-1">Based on on-chain acquisitions</p>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
              <div className="text-3xl font-black text-white font-display">4.9</div>
              <div className="flex text-neon-gold gap-0.5 text-[10px]">
                 {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="concrete-card p-6 rounded-2xl border-white/5 hover:border-white/10 transition-all">
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
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-ghost uppercase">{review.role} License</span>
                      <span className="text-[9px] text-ghost">•</span>
                      <span className="text-[9px] text-ghost">{review.date}</span>
                   </div>
                </div>
              </div>
              <div className="flex gap-0.5">
                 {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={12} className="text-neon-gold fill-neon-gold" />
                 ))}
              </div>
            </div>
            
            <p className="text-sm text-ghost-light leading-relaxed mb-6 font-light">"{review.content}"</p>
            
            <div className="flex items-center gap-6">
               <button className="flex items-center gap-2 text-[10px] font-mono text-ghost hover:text-white transition-colors group">
                  <ThumbsUp size={12} className="group-hover:text-neon-green" /> 
                  <span>Helpful ({review.helpful})</span>
               </button>
               <button className="flex items-center gap-2 text-[10px] font-mono text-ghost hover:text-white transition-colors">
                  <MessageSquare size={12} /> 
                  <span>Reply</span>
               </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full py-4 border border-white/10 rounded-xl text-[10px] font-mono text-ghost hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
         Load All Reviews
      </button>
    </div>
  );
};

export default Reviews;
