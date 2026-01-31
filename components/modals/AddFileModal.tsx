
import React, { useState } from 'react';
import { File as FileIcon } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { FileItem } from '../../types.ts';
import { useToast } from '../../contexts/ToastContext.tsx';
import Modal from '../common/Modal.tsx';
import Input from '../common/Input.tsx';
import Button from '../common/Button.tsx';

interface AddFileModalProps {
  onClose: () => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ onClose }) => {
  const { add } = useCollection<FileItem>('files');
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !size) return;

    setIsLoading(true);
    try {
      await add({ name: name.trim(), size: parseInt(size, 10) });
      showToast('File added successfully', 'success');
      onClose();
    } catch (error) {
      console.error(error);
      showToast('Failed to add file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New File">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="File Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. logic_map_v2.json"
          autoFocus
        />
        <Input 
          label="File Size (KB)"
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="e.g. 1024"
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} disabled={!name.trim() || !size}>
            Add File
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFileModal;