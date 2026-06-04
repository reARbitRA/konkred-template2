
import React from 'react';
import Modal from '../common/Modal.tsx';
import Button from '../common/Button.tsx';
import { Zap } from 'lucide-react';

interface UpgradePromptModalProps {
  onClose: () => void;
}

const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({ onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Upgrade your plan">
      <div className="text-center space-y-6 py-4">
        <div className="w-16 h-16 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full flex items-center justify-center mx-auto">
            <Zap size={32} className="text-neon-cyan" />
        </div>
        <div>
            <h3 className="text-xl font-bold text-white mb-2">Unlock Unlimited Potential</h3>
            <p className="text-ghost-light text-sm leading-relaxed">
                You've reached the 5 file limit for the free plan. To continue adding files, please upgrade to a Pro account for unlimited storage and advanced features.
            </p>
        </div>
        <div className="flex justify-center pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradePromptModal;
