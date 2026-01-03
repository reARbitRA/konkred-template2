
import React, { useState } from 'react';
import { Protocol } from '../types';
import ProtocolCard from './ProtocolCard';
import ProtocolDetails from './ProtocolDetails';
import AcquirersList from './AcquirersList';
import { Layers } from 'lucide-react';

interface ProtocolsProps {
  protocols: Protocol[];
  onAcquire: (protocol: Protocol) => void;
}

const Protocols: React.FC<ProtocolsProps> = ({ protocols, onAcquire }) => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [showingAcquirersFor, setShowingAcquirersFor] = useState<Protocol | null>(null);

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
            <ProtocolCard 
              key={protocol.id}
              protocol={protocol} 
              onAcquire={() => onAcquire(protocol)}
              onViewDetails={setSelectedProtocol}
              onShowAcquirers={setShowingAcquirersFor}
            />
          ))}
        </div>
      </div>

      <ProtocolDetails 
        protocol={selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
        onAcquire={() => {
            if (selectedProtocol) onAcquire(selectedProtocol);
        }}
      />

      {showingAcquirersFor && (
        <AcquirersList 
          protocol={showingAcquirersFor}
          onClose={() => setShowingAcquirersFor(null)}
        />
      )}
    </section>
  );
};

export default Protocols;
