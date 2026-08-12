import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TermIcon, Shield, Code, Cpu, Sparkles, Flame, Send, RefreshCw, CheckCircle2, AlertCircle, Coins, ChevronRight } from 'lucide-react';

interface ForgeTerminalProps {
  product: {
    title: string;
    price: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

type TerminalStep = 'initializing' | 'selection' | 'deposit' | 'confirming' | 'success';

export const ForgeTerminal: React.FC<ForgeTerminalProps> = ({ product, onClose, onSuccess }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [step, setStep] = useState<TerminalStep>('initializing');
  const [input, setInput] = useState('');
  const [currency, setCurrency] = useState<'usdt' | 'btc' | 'eth' | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string, type: 'info' | 'warn' | 'error' | 'success' | 'input' = 'info') => {
    const prefix = type === 'input' ? '> ' : `[${new Date().toLocaleTimeString()}] `;
    setLogs(prev => [...prev, `${prefix}${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Initializing sequence
  useEffect(() => {
    const sequence = async () => {
      addLog('Uplink established. Accessing Enclave Armory...', 'info');
      await sleep(600);
      addLog(`Targeting License: ${product.title.toUpperCase()}`, 'info');
      await sleep(400);
      addLog(`Price: ${product.price} (Equivalent value in crypto)`, 'info');
      await sleep(800);
      addLog('Initializing NOWPayments secure tunnel...', 'info');
      await sleep(1000);
      addLog('SELECT SETTLEMENT CURRENCY:', 'warn');
      addLog('1. USDT (TRC-20)', 'info');
      setStep('selection');
    };
    sequence();
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    addLog(input, 'input');
    setInput('');

    if (step === 'selection') {
      if (cmd === '1' || cmd === 'usdt') {
        setCurrency('usdt');
        await proceedToDeposit('usdt');
      } else {
        addLog('Invalid selection. Choose 1 (USDT).', 'error');
      }
    } else if (step === 'deposit') {
      if (cmd === 'confirm' || cmd === 'pay') {
        handleSimulatePayment();
      } else {
        addLog('Awaiting payment. Type "confirm" if deposit is dispatched.', 'warn');
      }
    }
  };

  const proceedToDeposit = async (coin: 'usdt') => {
    setStep('deposit');
    addLog(`Currency locked: ${coin.toUpperCase()}`, 'success');
    await sleep(500);
    const addrMap = {
      usdt: 'TYK8pYm7cZ5U86oRExZ6vNTnNYmHnnyTYK',
    };
    addLog(`DESTINATION_ADDRESS: ${addrMap[coin]}`, 'warn');
    addLog('GENERATE QR_OVERLAY...', 'info');
    await sleep(800);
    addLog('Awaiting transaction on-chain. Type "confirm" to trigger validation simulation.', 'warn');
  };

  const handleSimulatePayment = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setStep('confirming');
    
    addLog('INCOMING_TRANSACTION_DETECTED: PENDING_MEMPOOL', 'success');
    await sleep(1200);
    
    const stages = [
      'STX_IDENTIFIER_MAPPING',
      'PROTOCOL_QUORUM_APPROVAL',
      'LEDGER_SYNCHRONIZATION',
      'FINAL_PROOF_VERIFICATION'
    ];

    for (const stage of stages) {
      addLog(`STATUS: ${stage}... RUNNING`, 'info');
      await sleep(1000 + Math.random() * 500);
      addLog(`STATUS: ${stage}... OK`, 'success');
    }

    await sleep(800);
    setStep('success');
    addLog('HANDSHAKE COMPLETE. SECURE ASSET PAYLOAD DECRYPTED.', 'success');
    
    // Generate a deterministic but unique-looking Tx hash
    const fakeHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    addLog(`BLOCK_HASH: ${fakeHash}`, 'info');
    addLog('SESSION_TERMINATED: SUCCESS', 'info');
    
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-black border-4 border-black font-mono text-xs overflow-hidden shadow-brutalist relative">
      {/* Header bar */}
      <div className="bg-signal text-black p-2 border-b-4 border-black flex items-center justify-between font-black uppercase tracking-wider text-[10px]">
        <div className="flex items-center gap-2">
          <TermIcon size={12} />
          <span>ENCLAVE_FORGE_TERMINAL // v4.2.0</span>
        </div>
        <button onClick={onClose} className="hover:bg-white px-2">[ CLOSE ]</button>
      </div>

      {/* Logs Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar select-text bg-zinc-950/40">
        {logs.map((log, i) => {
          const isInput = log.startsWith('> ');
          const isSuccess = log.includes('SUCCESS') || log.includes('COMPLETE') || log.includes('LOCKED');
          const isWarn = log.includes('SELECT') || log.includes('AWAITING') || log.includes('DESTINATION_ADDRESS');
          const isError = log.includes('Invalid');

          let textColor = 'text-zinc-300';
          if (isInput) textColor = 'text-signal font-bold';
          if (isSuccess) textColor = 'text-emerald-400';
          if (isWarn) textColor = 'text-signal';
          if (isError) textColor = 'text-red-500 font-bold';

          return (
            <div key={i} className={`${textColor} leading-relaxed break-all`}>
              {log}
            </div>
          );
        })}

        {/* Dynamic UI Elements based on step */}
        {step === 'deposit' && currency && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 border-2 border-signal p-4 bg-black/80 space-y-4"
          >
            <div className="flex justify-center">
              <div className="bg-white p-2">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000&bgcolor=fff&data=${encodeURIComponent(currency === 'usdt' ? 'TYK8pYm7cZ5U86oRExZ6vNTnNYmHnnyTYK' : currency === 'btc' ? 'bc1qdq7fpxrtn78v9m7kyymmsmdluhvsnnt46rre7l' : '0xc94770007dd3a98114002341d4a13b41d2f8bdfc')}`}
                  alt="Payment QR"
                  className="w-32 h-32"
                />
              </div>
            </div>
            <div className="text-center text-[9px] uppercase font-black text-signal">
              SCAN_TO_PAY_{currency.toUpperCase()}
            </div>
          </motion.div>
        )}

        {step === 'confirming' && (
          <div className="flex justify-center py-4">
            <RefreshCw className="text-signal animate-spin" size={24} />
          </div>
        )}

        {step === 'success' && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4 py-6 text-emerald-400 border-2 border-emerald-500/30 bg-emerald-500/5 mt-4"
          >
            <CheckCircle2 size={48} className="animate-pulse" />
            <div className="text-sm font-black uppercase tracking-widest text-center px-4">
              CRITICAL_LICENSE_ACQUIRED_OK
            </div>
          </motion.div>
        )}
        
        <div ref={logEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleCommand} className="p-3 border-t-4 border-black flex gap-3 items-center bg-black">
        <span className="text-signal font-black text-lg">&gt;</span>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={step === 'selection' ? "Enter '1' for USDT..." : step === 'deposit' ? "Type 'confirm' to complete..." : "System processing..."}
          disabled={step === 'initializing' || step === 'confirming' || step === 'success'}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-800 text-sm font-mono"
          autoFocus
        />
        <button 
          type="submit"
          className="bg-signal text-black px-4 py-1.5 font-black uppercase text-[10px] border-2 border-black hover:bg-signal-hover disabled:opacity-50"
          disabled={step === 'initializing' || step === 'confirming' || step === 'success'}
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
};
