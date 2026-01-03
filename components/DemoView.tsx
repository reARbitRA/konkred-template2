import React from 'react';
import { X, Play } from 'lucide-react';

interface DemoViewProps {
  onClose: () => void;
}

const DemoView: React.FC<DemoViewProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
       
       <div className="relative w-full max-w-4xl concrete-card border border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-300">
         <div className="flex justify-between items-center p-4 border-b border-zinc-800">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">System Demo // v2.04</span>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
         </div>
         
         <div className="aspect-video bg-zinc-900 flex items-center justify-center relative group cursor-pointer overflow-hidden">
            {/* Fake UI background */}
            <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 opacity-20 scale-105 group-hover:scale-100 transition-transform duration-700">
               <div className="col-span-1 bg-zinc-700 h-full rounded"></div>
               <div className="col-span-3 space-y-4">
                  <div className="h-32 bg-zinc-700 rounded"></div>
                  <div className="h-32 bg-zinc-700 rounded"></div>
                  <div className="h-32 bg-zinc-700 rounded"></div>
               </div>
            </div>

            <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all group-hover:scale-110 z-10">
               <Play fill="white" className="ml-1 text-white" size={32} />
            </div>
         </div>
         
         <div className="p-6 bg-zinc-950">
            <h3 className="text-lg font-bold text-white mb-2">Platform Walkthrough</h3>
            <p className="text-sm text-zinc-500">
              A 2-minute overview of the KONKRED protocol library, valuation terminal, and document synthesis engine.
            </p>
         </div>
       </div>
    </div>
  );
};

export default DemoView;