
import React from 'react';
import { Users, Plus, Loader2, User as UserIcon } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { TeamMember } from '../../types.ts';
import { useModal } from '../../contexts/ModalContext.tsx';

const TeamMembersSection: React.FC = () => {
    const { data: team, loading } = useCollection<TeamMember>('teamMembers');
    const { openModal } = useModal();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Operator Roster ({team.length})</h2>
                <div className="flex gap-4">
                    <button onClick={() => openModal('AddMember')} className="bg-neon-cyan text-black px-4 py-2 text-[10px] font-mono font-black tracking-widest hover:shadow-neon-cyan transition-all flex items-center gap-2 rounded-lg">
                        <Plus size={12} /> Add Member
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-neon-cyan" size={32} /></div>
            ) : team.length === 0 ? (
                <div className="text-center py-20 concrete-card border-dashed border-white/10 rounded-2xl">
                    <Users size={40} className="mx-auto text-ghost mb-4 opacity-20" />
                    <h3 className="text-lg font-bold text-white">No team members yet</h3>
                    <p className="text-sm text-ghost">Add operators to your enclave roster.</p>
                </div>
            ) : (
                <div className="concrete-card rounded-2xl overflow-hidden bg-black/20 border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[11px]">
                            <thead className="bg-void-300 text-ghost uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Designation</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Date Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {team.map(member => (
                                    <tr key={member.id} className="hover:bg-white/[0.02] group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-void-300 flex items-center justify-center border border-white/5 text-ghost group-hover:text-neon-cyan">
                                                    <UserIcon size={14} />
                                                </div>
                                                <span className="font-sans text-sm font-bold text-white">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-ghost uppercase tracking-widest">{member.role}</td>
                                        <td className="px-6 py-4 text-ghost">
                                            {new Date(member.createdAt.seconds * 1000).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMembersSection;
