
import React from 'react';

const About: React.FC = () => {
  return (
    <section className="py-24 border-t border-zinc-900 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-900/20 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            DESIGNED FOR <br/>
            <span className="text-zinc-500">THE ARCHITECTS.</span>
          </h2>
          <div className="h-px w-24 bg-white/20"></div>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            KONKRED is an exclusive repository of executive frameworks. We deconstruct the operating systems of high-growth enterprises and distill them into deployable assets.
          </p>
          <p className="text-zinc-500 font-mono text-sm leading-relaxed">
            // OUR MISSION: <br/>
            To reduce the latency between strategy and execution. Eliminate the blank canvas. Provide the structural capital required to build empires.
          </p>
        </div>

        <div className="relative concrete-card p-12 aspect-square flex flex-col justify-between rounded-[3rem]">
          <div className="absolute top-8 right-8 text-zinc-700 font-mono text-xs uppercase tracking-widest">Est. MMXXIV</div>
          <div className="text-8xl font-black text-zinc-800 select-none leading-none">KON<br/>KRED</div>
          <div className="border-t border-zinc-800 pt-8">
            <p className="text-ghost text-xs font-mono uppercase tracking-widest leading-relaxed">
                Platform governance maintained by verified architectural nodes. Verified structural capital distributed globally via secure enclaves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
