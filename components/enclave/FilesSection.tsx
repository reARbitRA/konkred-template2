
import React from 'react';
import { File as FileIcon, Folder, Plus, Loader2, Download, Trash2, Zap } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { FileItem, Folder as FolderType } from '../../types.ts';
import { useModal } from '../../contexts/ModalContext.tsx';
import { useToast } from '../../contexts/ToastContext.tsx';
import { storage } from '../../services/firebase.ts';
import { ref, deleteObject } from 'firebase/storage';

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const FILE_LIMIT = 5;

const FilesSection: React.FC = () => {
    const { data: files, loading: filesLoading, remove: removeFileMeta } = useCollection<FileItem>('files');
    const { data: folders, loading: foldersLoading } = useCollection<FolderType>('folders');
    const { openModal } = useModal();
    const { showToast } = useToast();

    const loading = filesLoading || foldersLoading;
    const hasReachedLimit = files.length >= FILE_LIMIT;

    const handleDelete = async (file: FileItem) => {
        try {
            const fileRef = ref(storage, file.storagePath);
            await deleteObject(fileRef);
            await removeFileMeta(file.id);
            showToast('File deleted successfully', 'success');
        } catch (error) {
            console.error('Deletion failed:', error);
            showToast('Failed to delete file.', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">File System ({files.length}/{FILE_LIMIT})</h2>
                <div className="flex gap-4">
                    <button onClick={() => openModal('NewFolder')} className="bg-white/5 text-white px-4 py-2 text-[10px] font-mono font-bold tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 rounded-lg">
                        <Folder size={12} /> New Folder
                    </button>
                    <button 
                        onClick={() => openModal('AddFile')}
                        disabled={hasReachedLimit} 
                        className="bg-neon-cyan text-black px-4 py-2 text-[10px] font-mono font-black tracking-widest hover:shadow-neon-cyan transition-all flex items-center gap-2 rounded-lg disabled:bg-ghost disabled:text-metal-darker disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <Plus size={12} /> Upload File
                    </button>
                </div>
            </div>

            {hasReachedLimit && (
                <div className="concrete-card bg-neon-gold/5 border border-neon-gold/20 p-4 rounded-xl flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-3">
                        <Zap className="text-neon-gold" size={16} />
                        <p className="text-sm text-neon-gold/90 font-bold">You’ve reached the free plan limit.</p>
                    </div>
                    <button 
                        onClick={() => openModal('UpgradePrompt')}
                        className="bg-neon-gold text-black px-4 py-2 text-[10px] font-mono font-black tracking-widest hover:shadow-lg transition-all flex items-center gap-2 rounded-lg"
                    >
                        Upgrade Plan
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-neon-cyan" size={32} /></div>
            ) : (
                <div className="space-y-12">
                    {folders.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono font-bold text-ghost uppercase tracking-widest">Folders</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {folders.map(folder => (
                                    <div key={folder.id} className="concrete-card p-6 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-neon-cyan/50 transition-all">
                                        <Folder size={32} className="text-neon-cyan mb-4" />
                                        <p className="text-xs font-bold text-white truncate w-full">{folder.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {files.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono font-bold text-ghost uppercase tracking-widest">Files</h3>
                            <div className="concrete-card rounded-2xl overflow-hidden bg-black/20 border-white/5">
                                <table className="w-full text-left font-mono text-[11px]">
                                    <thead className="bg-void-300 text-ghost uppercase tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Size</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Date Added</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {files.map(file => (
                                            <tr key={file.id} className="hover:bg-white/[0.02] group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <FileIcon size={16} className="text-ghost group-hover:text-neon-cyan" />
                                                        <span className="font-sans text-sm font-bold text-white">{file.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-ghost">{formatBytes(file.size)}</td>
                                                <td className="px-6 py-4 text-ghost truncate max-w-[150px]">{file.type}</td>
                                                <td className="px-6 py-4 text-ghost">{new Date(file.createdAt.seconds * 1000).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => window.open(file.downloadURL, '_blank')} className="p-2 text-ghost hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Download">
                                                            <Download size={14} />
                                                        </button>
                                                        <button onClick={() => handleDelete(file)} className="p-2 text-ghost hover:text-neon-red hover:bg-neon-red/10 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {files.length === 0 && folders.length === 0 && (
                        <div className="text-center py-20 concrete-card border-dashed border-white/10 rounded-2xl">
                            <Folder size={40} className="mx-auto text-ghost mb-4 opacity-20" />
                            <h3 className="text-lg font-bold text-white">No files yet</h3>
                            <p className="text-sm text-ghost">Upload your first file to your secure enclave.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilesSection;
