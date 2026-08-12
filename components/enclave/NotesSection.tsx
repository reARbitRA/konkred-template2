
import React from 'react';
import { StickyNote, Plus, Loader2 } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { Note } from '../../types.ts';
import { useModal } from '../../contexts/ModalContext.tsx';

const NotesSection: React.FC = () => {
    const { data: notes, loading } = useCollection<Note>('notes');
    const { openModal } = useModal();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Note Stream ({notes.length})</h2>
                <div className="flex gap-4">
                    <button onClick={() => openModal('NewNote')} className="bg-neon-cyan text-black px-4 py-2 text-[10px] font-mono font-black tracking-widest hover:shadow-neon-cyan transition-all flex items-center gap-2 rounded-lg">
                        <Plus size={12} /> New Note
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-neon-cyan" size={32} /></div>
            ) : notes.length === 0 ? (
                <div className="text-center py-20 concrete-card border-dashed border-white/10 rounded-2xl">
                    <StickyNote size={40} className="mx-auto text-ghost mb-4 opacity-20" />
                    <h3 className="text-lg font-bold text-white">No notes yet</h3>
                    <p className="text-sm text-ghost">Create your first note to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map(note => (
                        <div key={note.id} className="concrete-card p-6 rounded-2xl flex flex-col group cursor-pointer hover:border-neon-cyan/50 transition-all">
                            <h3 className="text-base font-bold text-white mb-2">{note.title}</h3>
                            <p className="text-sm text-ghost-light font-light flex-1 line-clamp-3">{note.content}</p>
                            <p className="text-[10px] text-ghost font-mono mt-4 pt-4 border-t border-white/5">
                                Created: {note.createdAt?.seconds ? new Date(note.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotesSection;