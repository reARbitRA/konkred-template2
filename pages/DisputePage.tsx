import React, { useState } from 'react';
import { 
    ShieldAlert, MessageSquare, Clock, ArrowLeft, Send, 
    FileText, User, Gavel, HelpCircle, ChevronRight, CheckCircle, Upload, ArrowUpRight 
} from 'lucide-react';
import Badge from '../components/common/Badge.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { databaseService } from '../services/database.ts';

interface DisputeToken {
    id: string;
    assetName: string;
    defendant: string;
    amount: number;
    category: string;
    status: 'pending_buyer' | 'pending_seller' | 'under_moderation' | 'resolved';
    dateOpened: string;
    description: string;
    evidenceCount: number;
    chronology: Array<{
        sender: 'buyer' | 'seller' | 'arbiter';
        senderName: string;
        message: string;
        timestamp: string;
    }>;
}

const DisputePage: React.FC = () => {
    const { showToast } = useToast();
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>('DSP-8402');
    const [messageText, setMessageText] = useState('');
    const [isFilingNew, setIsFilingNew] = useState(false);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);

    // Support Form state
    const [ticketSubject, setTicketSubject] = useState('');
    const [ticketCategory, setTicketCategory] = useState('technical');
    const [ticketDescription, setTicketDescription] = useState('');
    const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    // Dispute state representing live cases
    const [disputes, setDisputes] = useState<DisputeToken[]>([
        {
            id: 'DSP-8402',
            assetName: 'Arbitrage Loop v3',
            defendant: 'Alpha Quant',
            amount: 45.00,
            category: 'Performance Non-Compliance',
            status: 'under_moderation',
            dateOpened: 'June 09, 2026',
            description: 'The uploaded protocol gas optimization threshold does not match the 45% efficiency claim. Testing logs show an average of 12% in sandboxed conditions.',
            evidenceCount: 2,
            chronology: [
                { sender: 'buyer', senderName: 'You (Buyer)', message: 'I launched the pipeline on the test net and the yield coefficients are severely throttled compared to your marketing documentation. Requesting immediate refund.', timestamp: 'June 09, 14:24' },
                { sender: 'seller', senderName: 'Alpha Quant', message: 'You need to allocate at least 2 FastGas nodes to hit the optimal parameters. Substandard configuration is a user error.', timestamp: 'June 09, 16:10' },
                { sender: 'arbiter', senderName: 'SYS_ARBITRATION_BOT', message: 'Security Scan indicates consistent gas overhead due to recursive smart contracts call loops at Line 89. Moderator review initiated.', timestamp: 'June 10, 09:30' }
            ]
        },
        {
            id: 'DSP-5019',
            assetName: 'DeepSeek Jailbreak Shield',
            defendant: 'Nexus Cyber',
            amount: 99.00,
            category: 'Technical Flaws / Inoperable',
            status: 'resolved',
            dateOpened: 'June 01, 2026',
            description: 'Prompt system fails to filter base adversarial inputs. Immediate compromise achieved using standard payload rotation.',
            evidenceCount: 1,
            chronology: [
                { sender: 'buyer', senderName: 'You (Buyer)', message: 'The jailbreak defense has zero input checking for prompt rotation. Standard rot13 bypasses the shield.', timestamp: 'June 01, 10:12' },
                { sender: 'arbiter', senderName: 'Platform Moderator', message: 'Nexus Cyber accepted the vulnerability report. Refund of $99 initiated and completed.', timestamp: 'June 02, 11:00' }
            ]
        }
    ]);

    // Dispute Form state
    const [newDisputeAsset, setNewDisputeAsset] = useState('LegalAudit Pro');
    const [newDisputeReason, setNewDisputeReason] = useState('description_mismatch');
    const [newDisputeDesc, setNewDisputeDesc] = useState('');
    const [newDisputeAmount, setNewDisputeAmount] = useState('89.00');

    // Send chat logs
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedDisputeId) return;

        setDisputes(prev => prev.map(disp => {
            if (disp.id === selectedDisputeId) {
                return {
                    ...disp,
                    chronology: [
                        ...disp.chronology,
                        {
                            sender: 'buyer',
                            senderName: 'You (Buyer)',
                            message: messageText,
                            timestamp: 'Just now'
                        }
                    ]
                };
            }
            return disp;
        }));

        setMessageText('');
        showToast('Arbitration response successfully transmitted to ledger.', 'success');
    };

    const { user } = useAuth();
    const [ticketRefId, setTicketRefId] = useState('TKT-10001');

    // Open support ticket handler
    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketSubject.trim() || !ticketDescription.trim()) {
            showToast('Please fill out all support ticket metrics.', 'warning');
            return;
        }

        setTicketStatus('submitting');
        try {
            const refId = await databaseService.fileDispute(user?.id || 'guest', {
                title: ticketSubject.trim(),
                category: 'Support Ticket',
                description: ticketDescription.trim()
            });
            setTicketRefId(refId);
            setTicketStatus('success');
            showToast('Help Desk Ticket open successfully.', 'success');
        } catch (err) {
            console.error('Failed to create ticket:', err);
            setTicketStatus('idle');
        }
    };

    const handleCreateDispute = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDisputeDesc.trim()) {
            showToast('Please provide explicit technical reasons for creating a dispute.', 'warning');
            return;
        }

        const category = newDisputeReason === 'malicious_payload' ? 'Malicious Code Violation' : 'Technical non-compliance';
        const newId = await databaseService.fileDispute(user?.id || 'guest', {
            title: `Dispute for ${newDisputeAsset}`,
            category,
            description: newDisputeDesc.trim()
        });

        const newRecord: DisputeToken = {
            id: newId,
            assetName: newDisputeAsset,
            defendant: 'External Node Developer',
            amount: parseFloat(newDisputeAmount) || 89.00,
            category,
            status: 'under_moderation',
            dateOpened: 'Today',
            description: newDisputeDesc,
            evidenceCount: 1,
            chronology: [
                { sender: 'buyer', senderName: 'You (Buyer)', message: newDisputeDesc, timestamp: 'Today' },
                { sender: 'arbiter', senderName: 'SYS_ARBITRATION_BOT', message: 'Dispute system auto-registered. Awaiting developer response block (48h timeframe limit).', timestamp: 'Today' }
            ]
        };

        setDisputes(prev => [newRecord, ...prev]);
        setSelectedDisputeId(newId);
        setIsFilingNew(false);
        setNewDisputeDesc('');
        showToast(`Dispute initialized under token identifier ${newId}.`, 'success');
    };

    const selectedDispute = disputes.find(d => d.id === selectedDisputeId);

    return (
        <div className="p-8 min-h-screen bg-void pt-28 font-sans">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                            <Gavel className="text-neon-cyan" size={32} />
                            Arbitration Desk
                        </h1>
                        <p className="text-ghost font-mono text-[10px] uppercase tracking-[0.2em] mt-1">Decentralized Refund Resolution & Neutral Arbitration</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                setIsFilingNew(true);
                                setIsCreatingTicket(false);
                            }}
                            className="bg-neon-cyan hover:bg-neon-cyan/95 text-black font-black py-3 px-6 rounded-xl text-xs tracking-widest font-mono flex items-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                        >
                            <ShieldAlert size={14} /> INITIALIZE_NEW_DISPUTE
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Disputes sidebar list */}
                    <div className="space-y-6">
                        <div className="concrete-card rounded-2xl p-6 bg-black/40 border border-white/5 space-y-4">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center justify-between">
                                <span>Active Disputes ({disputes.length})</span>
                                <Clock size={12} className="text-ghost animate-pulse" />
                            </h3>
                            
                            <div className="space-y-3 pt-2">
                                {disputes.map(disp => (
                                    <div 
                                        key={disp.id}
                                        onClick={() => {
                                            setSelectedDisputeId(disp.id);
                                            setIsFilingNew(false);
                                            setIsCreatingTicket(false);
                                        }}
                                        className={`group cursor-pointer p-4 rounded-xl border transition-all text-left ${
                                            selectedDisputeId === disp.id 
                                                ? 'bg-neon-cyan/5 border-neon-cyan/40 shadow-inner' 
                                                : 'bg-void-200 hover:bg-void-300 border-white/5 hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-mono font-bold text-neon-cyan">{disp.id}</span>
                                            <span className="text-[10px] font-mono text-ghost">{disp.dateOpened}</span>
                                        </div>
                                        <div className="text-xs font-bold text-white group-hover:text-neon-cyan transition-colors mb-1 truncate">{disp.assetName}</div>
                                        <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                                            <span className="text-[10px] text-white font-black font-mono">${disp.amount.toFixed(2)}</span>
                                            <Badge variant={
                                                disp.status === 'resolved' ? 'green' : 
                                                disp.status === 'under_moderation' ? 'purple' : 'gray'
                                            }>
                                                {disp.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arbitration Policy Brief */}
                        <div className="concrete-card p-6 rounded-2xl bg-black/30 border border-white/5">
                            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText size={14} className="text-neon-cyan" /> Ground Rules
                            </h4>
                            <ul className="space-y-4 text-xs text-ghost leading-relaxed">
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
                                    <span>Technical evidence validation relies strictly on sandboxed prompt/code execution.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
                                    <span>Developers have exactly 48 hours to reject claims, otherwise arbiter refunds buyer.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-5 h-5 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
                                    <span>Decisions are final. Recovered funds are instantly deposited back into user liquidity Nodes.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Chat Terminal & Workspace Context */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Interactive File New Claim Panel */}
                        {isFilingNew && (
                            <form onSubmit={handleCreateDispute} className="concrete-card p-8 rounded-2xl bg-black/40 border border-neon-cyan/25 space-y-6 animate-in zoom-in-95">
                                <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                    <div>
                                        <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                                            <ShieldAlert size={18} className="text-neon-cyan" /> Create Dispute Briefing
                                        </h3>
                                        <p className="text-xs text-ghost mt-1">Submit technical non-compliance details to start platform arbitration.</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsFilingNew(false)}
                                        className="text-ghost hover:text-white transition-colors"
                                    >
                                        <Clock size={16} className="rotate-45" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Target Acquisition</label>
                                        <select 
                                            value={newDisputeAsset} 
                                            onChange={e => setNewDisputeAsset(e.target.value)}
                                            className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan transition-all"
                                        >
                                            <option value="LegalAudit Pro">LegalAudit Pro</option>
                                            <option value="Arbitrage Loop v3">Arbitrage Loop v3</option>
                                            <option value="FinanceGPT v4">FinanceGPT v4</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Dispute Classification</label>
                                        <select
                                            value={newDisputeReason}
                                            onChange={e => setNewDisputeReason(e.target.value)}
                                            className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan transition-all"
                                        >
                                            <option value="description_mismatch">Technical Mismatch of Capabilities</option>
                                            <option value="broken_code">Critical Code Compile/Execution Error</option>
                                            <option value="missing_delivery">Incomplete Assets Packages</option>
                                            <option value="malicious_payload">Malicious / Unsafe prompt injections</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Claim Price Value (USD)</label>
                                    <input 
                                        type="text" 
                                        value={newDisputeAmount}
                                        onChange={e => setNewDisputeAmount(e.target.value)}
                                        className="w-full md:w-32 bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan transition-all font-mono"
                                        placeholder="89.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Technical Complaint description</label>
                                    <textarea 
                                        required
                                        value={newDisputeDesc}
                                        onChange={e => setNewDisputeDesc(e.target.value)}
                                        rows={4}
                                        placeholder="Please provide step-by-step logs or prompt interactions showing the discrepancy with the seller's audit report..."
                                        className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan transition-all resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsFilingNew(false)}
                                        className="px-5 py-3 border border-white/5 rounded-xl hover:bg-white/5 text-xs text-ghost font-mono uppercase tracking-widest transition-all"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-5 py-3 bg-neon-cyan text-black font-black rounded-xl text-xs font-mono uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                                    >
                                        TRANSMIT_DISPUTE_LEDGER
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Interactive Create Help Desk Ticket Panel */}
                        {isCreatingTicket && (
                            <div className="concrete-card p-8 rounded-2xl bg-black/40 border border-white/10 space-y-6 animate-in zoom-in-95">
                                <div className="flex justify-between items-start pb-4 border-b border-white/5">
                                    <div>
                                        <h3 className="text-lg font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                                            <HelpCircle size={18} className="text-neon-cyan" /> Enterprise Help Ticket
                                        </h3>
                                        <p className="text-xs text-ghost mt-1">Get custom solutions from specialized platform engineers directly.</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCreatingTicket(false)}
                                        className="text-ghost hover:text-white transition-colors"
                                    >
                                        <Clock size={16} className="rotate-45" />
                                    </button>
                                </div>

                                {ticketStatus === 'success' ? (
                                    <div className="p-10 text-center space-y-4 animate-in fade-in">
                                        <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-2 animate-bounce" />
                                        <p className="text-white font-mono uppercase font-bold tracking-wider">Ticket Created successfully</p>
                                        <p className="text-ghost text-xs max-w-sm mx-auto">Ticket reference ID #{ticketRefId} is dispatched. Check your associated enclave logs for status updates within 4 hours.</p>
                                        <button 
                                            onClick={() => {
                                                setTicketStatus('idle');
                                                setTicketSubject('');
                                                setTicketDescription('');
                                                setIsCreatingTicket(false);
                                            }}
                                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-mono text-white uppercase tracking-widest mt-4"
                                        >
                                            Return to desk
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Topic / Category</label>
                                                <select 
                                                    value={ticketCategory}
                                                    onChange={e => setTicketCategory(e.target.value)}
                                                    className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan transition-all"
                                                >
                                                    <option value="technical">Technical Hub Compilation</option>
                                                    <option value="billing">Wallet/Liquidity Synchronization</option>
                                                    <option value="partner">Custom Enterprise Advisory</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Subject Headline</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={ticketSubject}
                                                    onChange={e => setTicketSubject(e.target.value)}
                                                    placeholder="e.g. Wallet balance verification latency"
                                                    className="w-full bg-[#111] border border-white/10 px-4 py-3 rounded-xl text-xs text-white placeholder:text-zinc-700 outline-none focus:border-neon-cyan transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-ghost uppercase tracking-wider block">Detailed description of Incident</label>
                                            <textarea 
                                                required
                                                value={ticketDescription}
                                                onChange={e => setTicketDescription(e.target.value)}
                                                rows={4}
                                                placeholder="Provide detailed environment details, node parameters or wallet address..."
                                                className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-xs text-white focus:outline-none focus:border-neon-cyan transition-all resize-none leading-relaxed"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsCreatingTicket(false)}
                                                className="px-5 py-3 border border-white/5 rounded-xl hover:bg-white/5 text-xs text-ghost font-mono uppercase tracking-widest transition-all"
                                            >
                                                CANCEL
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={ticketStatus === 'submitting'}
                                                className="px-5 py-3 bg-neon-cyan text-black font-black rounded-xl text-xs font-mono uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50"
                                            >
                                                {ticketStatus === 'submitting' ? 'DISPATCHING...' : 'DISPATCH_TICKET'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Dialogue Chat Channel Wrapper */}
                        {!isFilingNew && !isCreatingTicket && selectedDispute && (
                            <div className="concrete-card rounded-2xl overflow-hidden bg-black/40 border border-white/5 h-[580px] flex flex-col">
                                
                                {/* Chat Header */}
                                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/[0.01]">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono font-black text-neon-cyan">{selectedDispute.id}</span>
                                            <span className="text-zinc-600 font-bold">•</span>
                                            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">{selectedDispute.category}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white">Asset: <span className="text-ghost">{selectedDispute.assetName}</span></h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-ghost font-mono">Arbiter Hold: <span className="text-white font-bold">${selectedDispute.amount.toFixed(2)}</span></span>
                                        <Badge variant={selectedDispute.status === 'resolved' ? 'green' : 'purple'}>
                                            {selectedDispute.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Active Case Brief description banner */}
                                <div className="px-6 py-4 bg-void-300 border-b border-white/5 text-ghost text-xs leading-relaxed font-mono">
                                    <span className="text-[9px] text-neon-cyan/80 block uppercase font-black mb-1">CLAIM_COMPLAINT_STATEMENT //</span>
                                    {selectedDispute.description}
                                </div>

                                {/* Messages Timeline lists */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/50 custom-scrollbar">
                                    {selectedDispute.chronology.map((chat, idx) => {
                                        const isYou = chat.sender === 'buyer';
                                        const isSystem = chat.sender === 'arbiter';
                                        
                                        return (
                                            <div 
                                                key={idx} 
                                                className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-md rounded-2xl p-4 space-y-1.5 border transition-all ${
                                                    isYou 
                                                        ? 'bg-neon-cyan/5 border-neon-cyan/30 text-white rounded-br-none' 
                                                        : isSystem 
                                                            ? 'bg-neon-purple/5 border-neon-purple/30 text-neon-purple-light rounded-bl-none'
                                                            : 'bg-void-300 border-white/5 text-white rounded-bl-none'
                                                }`}>
                                                    <div className="flex items-center justify-between gap-4 text-[9px] font-mono text-ghost uppercase tracking-wider">
                                                        <span className="font-bold flex items-center gap-1">
                                                            {isYou ? <User size={10} className="text-neon-cyan" /> : null}
                                                            {chat.senderName}
                                                        </span>
                                                        <span>{chat.timestamp}</span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed font-sans">{chat.message}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Messaging Prompt inputs sender form */}
                                {selectedDispute.status !== 'resolved' ? (
                                    <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0a0c] border-t border-white/5 flex gap-3">
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={e => setMessageText(e.target.value)}
                                            placeholder="Transmit technical response payload or supporting proof link..."
                                            className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-neon-cyan font-mono transition-all"
                                        />
                                        <button
                                            type="submit"
                                            className="px-5 bg-neon-cyan hover:bg-neon-cyan/95 text-black rounded-xl transition-all flex items-center justify-center"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="p-5 text-center bg-[#070709] border-t border-white/5 font-mono text-[10px] text-neon-green uppercase tracking-widest flex items-center justify-center gap-2">
                                        <CheckCircle size={14} /> THIS CASE IS SETTLED AND ARCHIVED ON TRANSMISSION LAYER
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Standard Empty Slate if no active dispute is selected */}
                        {!isFilingNew && !isCreatingTicket && !selectedDispute && (
                            <div className="concrete-card rounded-2xl p-20 text-center border border-white/5">
                                <ShieldAlert className="w-16 h-16 text-ghost/40 mx-auto mb-6" />
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">No Active Case Selected</h3>
                                <p className="text-ghost text-xs max-w-sm mx-auto mb-8">
                                    Your historical verification is fully optimized. Choose an arbitration file from the left sidebar or create a new token.
                                </p>
                            </div>
                        )}

                        {/* Interactive Immediate Support ticket notice */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="concrete-card p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col justify-between">
                                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <HelpCircle size={14} className="text-neon-cyan" /> Need Technical Assistance?
                                </h4>
                                <p className="text-xs text-ghost leading-relaxed mb-6">Contact our 24/7 dedicated enterprise engineers directly.</p>
                                <button 
                                    onClick={() => {
                                        setIsCreatingTicket(true);
                                        setIsFilingNew(false);
                                    }}
                                    className="w-full py-3 bg-[#111] border border-white/5 hover:border-white/15 rounded-xl text-[10px] font-mono text-white hover:text-neon-cyan font-bold uppercase tracking-widest transition-all"
                                >
                                    OPEN_SUPPORT_TICKET
                                </button>
                            </div>

                            <div className="concrete-card p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col justify-between">
                                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Clock size={14} className="text-neon-cyan" /> Support Center SLA
                                </h4>
                                <p className="text-xs text-ghost leading-relaxed">Enterprise tier: Under 15m. Regular core node tier: 4h. Sandbox dispute resolutions generally close within 72 hours of initialization.</p>
                                <div className="text-[10px] text-neon-green font-mono uppercase tracking-widest mt-6 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping"></span> Live response uptime 100% active
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default DisputePage;
