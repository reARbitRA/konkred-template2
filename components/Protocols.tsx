import React from 'react';
import { Protocol } from '../types';
import ProtocolCard from './ProtocolCard';
import { Layers, Info } from 'lucide-react';

interface ProtocolsProps {
  protocols: Protocol[];
  onViewDetails: (protocol: Protocol) => void;
  onAcquire: (protocol: Protocol) => void;
}

const Protocols: React.FC<ProtocolsProps> = ({ protocols, onViewDetails, onAcquire }) => {
  return (
    <section id="protocols" className="py-24 border-t border-zinc-900 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900/50 rounded-sm border border-zinc-800">
              <Layers size={20} className="text-zinc-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Featured Protocols</h2>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">Verified Architectures</p>
            </div>
          </div>
          <button className="hidden md:block text-xs font-mono text-zinc-500 hover:text-white transition-colors">
            [ VIEW ALL ARCHIVES ]
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {protocols.map(protocol => (
            <div key={protocol.id} className="relative group h-full">
              <ProtocolCard 
                protocol={protocol} 
                onAcquire={() => onAcquire(protocol)}
              />
              {/* Overlay Trigger for Details - positioned to not block acquire button completely or added as a secondary action */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onViewDetails(protocol)}
                  className="bg-black/80 backdrop-blur border border-zinc-700 p-2 rounded-full hover:bg-zinc-800 hover:text-white text-zinc-400 transition-all"
                  title="View Details"
                >
                  <Info size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Protocols;