
import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext.tsx';

interface VoiceOrbProps {
  onVoiceResult: (query: string) => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ onVoiceResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [levels, setLevels] = useState<number[]>([10, 20, 15, 25]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const { showToast } = useToast();

  const cleanup = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    setLevels([10, 20, 15, 25]);
  };

  const handleToggle = () => {
    setIsListening(prev => !prev);
  }

  useEffect(() => {
    if (isListening) {
      // Simulation mode
      onVoiceResult("Analyze the trend of autonomous agent valuations in Q4...");
      setTimeout(() => setIsListening(false), 3000);

      // // Real microphone logic (commented out for simplicity in this build)
      // const initAudio = async () => {
      //   try {
      //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      //     streamRef.current = stream;
      //     // ... rest of the audio processing logic
      //   } catch (err) {
      //     showToast("Microphone access required for voice protocols.", "error");
      //     setIsListening(false);
      //   }
      // };
      // initAudio();

    } else {
      cleanup();
    }
    return cleanup;
  }, [isListening]);


  return (
    <div className="flex flex-col items-center gap-3">
        <button 
            onClick={handleToggle}
            className={`relative w-16 h-16 flex items-center justify-center rounded-full transition-all duration-500 group ${isListening ? 'bg-neon-red/10' : 'bg-void-200 hover:bg-white/5 border border-white/5'}`}
            title={isListening ? "Terminate Uplink" : "Initialize Voice Advisory"}
        >
            {isListening && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute w-full h-full border border-neon-red/30 rounded-full animate-ping opacity-20" />
                    <div className="absolute w-24 h-24 border border-neon-red/40 rounded-full transition-all duration-75 ease-out opacity-20" />
                </div>
            )}
            
            <div className={`relative z-10 transition-colors ${isListening ? 'text-neon-red' : 'text-ghost group-hover:text-white'}`}>
                {isListening ? <Mic size={24} className="animate-pulse" /> : <MicOff size={24} />}
            </div>
        </button>
        {isListening && (
            <span className="text-[8px] font-mono text-neon-red uppercase tracking-[0.3em] animate-pulse">Live_Channel_Active</span>
        )}
    </div>
  );
};

export default VoiceOrb;
