
import React, { useState, useRef } from 'react';
import { File as FileIcon, UploadCloud, X, Loader2 } from 'lucide-react';
import { db, storage } from '../../services/firebase.ts';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { FileItem } from '../../types.ts';
import { useToast } from '../../contexts/ToastContext.tsx';
import Modal from '../common/Modal.tsx';
import Button from '../common/Button.tsx';

interface AddFileModalProps {
  onClose: () => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || !user) return;

    setIsLoading(true);
    setProgress(0);
    setError(null);

    const collectionPath = `users/${user.id}/files`;
    const newFileRef = doc(collection(db, collectionPath));
    const storagePath = `user_uploads/${user.id}/${newFileRef.id}-${file.name}`;
    const storageRef = ref(storage, storagePath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentProgress);
        },
        (uploadError) => {
            console.error(uploadError);
            setError('Upload failed. Please check network and permissions.');
            showToast('File upload failed!', 'error');
            setIsLoading(false);
        },
        async () => {
            try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const fileData: Omit<FileItem, 'id' | 'createdAt'> = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    downloadURL,
                    storagePath,
                };
                await setDoc(newFileRef, { ...fileData, createdAt: serverTimestamp() });
                
                showToast('File uploaded successfully!', 'success');
                onClose();
            } catch (firestoreError) {
                console.error(firestoreError);
                setError('Failed to save file metadata.');
                showToast('Error saving file data.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    );
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Upload File">
      <div className="space-y-6">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden"
        />

        {file ? (
          <div className="p-4 bg-void-200 concrete-card rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileIcon size={20} className="text-neon-cyan" />
              <span className="text-sm text-white font-mono">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} disabled={isLoading} className="text-ghost hover:text-white p-1">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="p-12 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center group cursor-pointer hover:border-neon-cyan/50 transition-all"
          >
            <UploadCloud size={32} className="text-ghost mb-4 group-hover:text-neon-cyan transition-colors" />
            <p className="text-sm font-bold text-white">Click to browse or drop file here</p>
            <p className="text-xs text-ghost">Maximum file size: 100MB</p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-mono uppercase text-ghost">
              <span>Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-void-300 rounded-full h-1.5">
              <div className="bg-neon-cyan h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {error && (
            <div className="p-3 bg-neon-red/10 border border-neon-red/20 rounded-xl text-neon-red text-[10px] font-mono uppercase">
                {error}
            </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={isLoading} disabled={!file}>
            Upload File
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddFileModal;
