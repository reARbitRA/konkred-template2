
import React from 'react';
import { Shield, Hammer, Globe } from 'lucide-react';

const Pillars: React.FC = () => {
  const pillars = [
    {
      icon: Hammer,
      title: "The Forge",
      desc: "Creation suite for high-fidelity probabilistic assets. Native IDE for prompt engineering and agentic workflows.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "The Audit",
      desc: "Deterministic verification layer. Every asset is scored for logic integrity, safety, and hallucination risk.",
      color: "cyan"
    },
    {
      icon: Globe,
      title: "The Network",
      desc: "Decentralized distribution nodes. Instant global settlement via crypto-rails for intellectual capital.",
      color: "green"
    }
  ];

  return (
    <section className="py-32 bg-black relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <div key={i} className="concrete-card p-10 rounded-[2rem] border-white/5 bg-void-200/50 hover:border-white/10 transition-all group">
              <div className={`w-14 h-14 rounded-xl bg-neon-${pillar.color}/10 flex items-center justify-center text-neon-${pillar.color} mb-8 group-hover:scale-110 transition-transform`}>
                <pillar.icon size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-tight">{pillar.title}</h3>
              <p className="text-ghost leading-relaxed text-sm font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
