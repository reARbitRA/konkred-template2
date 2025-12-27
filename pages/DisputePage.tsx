import React from 'react';
import { ShieldAlert, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

const DisputePage: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-void">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header>
                    <h1 className="text-2xl font-display font-bold text-white mb-2">Dispute Center</h1>
                    <p className="text-ghost font-mono text-xs uppercase tracking-widest">Neutral Arbitration & Refund Management</p>
                </header>

                <div className="bg-void-100 border border-white/10 rounded-xl overflow-hidden p-20 text-center">
                    <div className="w-20 h-20 bg-void-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-ghost" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Disputes</h3>
                    <p className="text-ghost text-sm max-w-sm mx-auto">
                        Your transaction history is clean. If you encounter an issue with an asset, you can initiate a dispute from your Wallet or Purchase history.
                    </p>
                    <button className="mt-8 btn-secondary inline-flex items-center gap-2">
                        <Clock size={16} /> View Archived Disputes
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-void-100 border border-white/10 p-6 rounded-lg">
                        <h4 className="font-bold text-white mb-4">Arbitration Policy</h4>
                        <ul className="space-y-4 text-sm text-ghost">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
                                <span>Evidence must be submitted within 7 days of dispute opening.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
                                <span>KONKRED moderators will review technical compliance with AUDIT benchmarks.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-neon-cyan/10 text-neon-cyan rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
                                <span>Decisions are final and funds will be distributed within 48 hours of resolution.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-void-100 border border-white/10 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                        <MessageSquare className="w-10 h-10 text-neon-blue mb-4" />
                        <h4 className="font-bold text-white mb-2">Need Immediate Help?</h4>
                        <p className="text-sm text-ghost mb-6">Contact our 24/7 dedicated enterprise support desk.</p>
                        <button className="btn-primary w-full">Open Support Ticket</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputePage;