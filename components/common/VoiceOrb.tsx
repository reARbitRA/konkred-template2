
import React, { useEffect, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceOrbProps {
  isListening: boolean;
  onToggle: () => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ isListening, onToggle }) => {
  const [levels, setLevels] = useState<number[]>([10, 20, 15]);

  useEffect(() => {
    if (!isListening) return;
    
    // Simulate audio frequency data
    const interval = setInterval(() => {
        setLevels([
            Math.random() * 40 + 10,
            Math.random() * 60 + 20,
            Math.random() * 40 + 10,
            Math.random() * 50 + 15,
        ]);
    }, 100);

    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <button 
        onClick={onToggle}
        className={`relative w-16 h-16 flex items-center justify-center rounded-full transition-all duration-500 group ${isListening ? 'bg-neon-red/10' : 'bg-void-200 hover:bg-white/5 border border-white/5'}`}
    >
        {isListening && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Simulated Waveforms */}
                <div className="absolute w-full h-full border border-neon-red/30 rounded-full animate-ping opacity-20" />
                <div 
                    className="absolute border border-neon-red/50 rounded-full transition-all duration-100 ease-out" 
                    style={{ width: `${64 + levels[0]}px`, height: `${64 + levels[0]}px`, opacity: 0.1 }}
                />
                <div 
                    className="absolute border border-neon-red/40 rounded-full transition-all duration-100 ease-out" 
                    style={{ width: `${64 + levels[1] * 0.5}px`, height: `${64 + levels[1] * 0.5}px`, opacity: 0.2 }} 
                />
            </div>
        )}
        
        <div className={`relative z-10 transition-colors ${isListening ? 'text-neon-red' : 'text-ghost group-hover:text-white'}`}>
            {isListening ? <Mic size={24} className="animate-pulse" /> : <MicOff size={24} />}
        </div>
    </button>
  );
};

export default VoiceOrb;
