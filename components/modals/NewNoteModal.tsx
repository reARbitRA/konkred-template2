
import React, { useState } from 'react';
import { StickyNote } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { Note } from '../../types.ts';
import { useToast } from '../../contexts/ToastContext.tsx';
import Modal from '../common/Modal.tsx';
import Input from '../common/Input.tsx';
import Button from '../common/Button.tsx';

interface NewNoteModalProps {
  onClose: () => void;
}

const NewNoteModal: React.FC<NewNoteModalProps> = ({ onClose }) => {
  const { add } = useCollection<Note>('notes');
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsLoading(true);
    try {
      await add({ title: title.trim(), content: content.trim() });
      showToast('Note created successfully', 'success');
      onClose();
    } catch (error) {
      console.error(error);
      showToast('Failed to create note', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Create New Note">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Q4 Strategy Insights"
          autoFocus
        />
        <Input 
          label="Content"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Capture your thoughts..."
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} disabled={!title.trim() || !content.trim()}>
            Create Note
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewNoteModal;