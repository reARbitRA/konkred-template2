import React from 'react';
import { useGlobalStats } from '../../hooks/useGlobalStats.ts';
import { Shield, Users, BarChart3, Zap, AlertTriangle } from 'lucide-react';

const formatCompactNumber = (number: number) => {
  if (number < 1000) return number.toString();
  if (number >= 1000 && number < 1000000) return (number / 1000).toFixed(1) + 'k';
  if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
  return number.toString();
};

const Stats: React.FC = () => {
  const { stats, loading, error } = useGlobalStats();

  const statConfig = [
    { key: 'totalProtocols', label: 'Assets Verified', icon: Shield },
    { key: 'totalUsers', label: 'Active Architects', icon: Users },
    { key: 'totalAudits', label: 'Completed Audits', icon: BarChart3 },
    { key: 'totalVolume', label: 'Node Volume', icon: Zap, prefix: '$' },
  ];

  if (error) {
    return (
      <section className="py-12 border-y border-white/5 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-3 text-neon-red/50 font-mono text-[10px] uppercase tracking-widest">
           <AlertTriangle size={14} /> Telemetry Link Compromised
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 border-y border-white/5 bg-black/60 relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {statConfig.map((item, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-black text-white font-display mb-2 group-hover:text-neon-cyan transition-colors duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {loading ? (
                  <span className="inline-block w-24 h-12 bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  <>
                    {item.prefix}
                    {formatCompactNumber((stats as any)?.[item.key] || 0)}
                    {!(item.prefix) && '+'}
                  </>
                )}
              </div>
              <div className="text-[9px] font-mono text-ghost uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                <item.icon size={10} className="opacity-30" />
                {item.label}
              </div>
              <div className="mt-4 h-0.5 w-6 bg-neon-cyan/20 mx-auto group-hover:w-12 transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;