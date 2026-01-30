
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useCollection } from '../../hooks/useCollection.ts';
import { TeamMember } from '../../types.ts';
import { useToast } from '../../contexts/ToastContext.tsx';
import Modal from '../common/Modal.tsx';
import Input from '../common/Input.tsx';
import Button from '../common/Button.tsx';

interface AddMemberModalProps {
  onClose: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose }) => {
  const { add } = useCollection<TeamMember>('teamMembers');
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    setIsLoading(true);
    try {
      await add({ name: name.trim(), role: role.trim() });
      showToast('Team member added', 'success');
      onClose();
    } catch (error) {
      console.error(error);
      showToast('Failed to add member', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Team Member">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Member Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jane Doe"
          autoFocus
        />
        <Input 
          label="Role / Designation"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Lead Analyst"
        />
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} disabled={!name.trim() || !role.trim()}>
            Add Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
