
import React, { useState } from 'react';
import { Folder, Loader2 } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { Folder as FolderType } from '../../types.ts';
import { useToast } from '../../contexts/ToastContext.tsx';
import Modal from '../common/Modal.tsx';
import Input from '../common/Input.tsx';
import Button from '../common/Button.tsx';

interface NewFolderModalProps {
  onClose: () => void;
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({ onClose }) => {
  const { add } = useCollection<FolderType>('folders');
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await add({ name: name.trim() });
      showToast('Folder created successfully', 'success');
      onClose();
    } catch (error) {
      console.error(error);
      showToast('Failed to create folder', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Folder">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Folder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Project Alpha"
          autoFocus
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} disabled={!name.trim()}>
            Create Folder
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewFolderModal;
