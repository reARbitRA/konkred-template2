
import React from 'react';
import { File as FileIcon, Folder, Plus, Loader2 } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { FileItem, Folder as FolderType } from '../../types.ts';
import { useModal } from '../../contexts/ModalContext.tsx';

const FilesSection: React.FC = () => {
    const { data: files, loading: filesLoading } = useCollection<FileItem>('files');
    const { data: folders, loading: foldersLoading } = useCollection<FolderType>('folders');
    const { openModal } = useModal();

    const loading = filesLoading || foldersLoading;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">File System ({folders.length + files.length})</h2>
                <div className="flex gap-4">
                    <button onClick={() => openModal('NewFolder')} className="bg-white/5 text-white px-4 py-2 text-[10px] font-mono font-bold tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 rounded-lg">
                        <Folder size={12} /> New Folder
                    </button>
                    <button onClick={() => openModal('AddFile')} className="bg-neon-cyan text-black px-4 py-2 text-[10px] font-mono font-black tracking-widest hover:shadow-neon-cyan transition-all flex items-center gap-2 rounded-lg">
                        <Plus size={12} /> Add File
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-neon-cyan" size={32} /></div>
            ) : files.length === 0 && folders.length === 0 ? (
                <div className="text-center py-20 concrete-card border-dashed border-white/10 rounded-2xl">
                    <Folder size={40} className="mx-auto text-ghost mb-4 opacity-20" />
                    <h3 className="text-lg font-bold text-white">No files yet</h3>
                    <p className="text-sm text-ghost">Add files and folders to your enclave.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {folders.map(folder => (
                        <div key={folder.id} className="concrete-card p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-neon-cyan/50 transition-all">
                            <Folder size={32} className="text-neon-cyan mb-4" />
                            <p className="text-xs font-bold text-white truncate w-full">{folder.name}</p>
                        </div>
                    ))}
                    {files.map(file => (
                        <div key={file.id} className="concrete-card p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-white/20 transition-all">
                            <FileIcon size={32} className="text-ghost mb-4" />
                            <p className="text-xs font-bold text-white truncate w-full">{file.name}</p>
                            <p className="text-[10px] text-ghost font-mono">{file.size} KB</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilesSection;