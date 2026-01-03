
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ModalType, ModalState } from '../types';

// Components
import ProtocolDetails from '../components/ProtocolDetails.tsx';
import DemoView from '../components/DemoView.tsx';

interface ModalContextValue {
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalState>({ type: null, props: {} });

  const openModal = useCallback((type: ModalType, props: any = {}) => {
    setModal({ type, props });
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, props: {} });
    document.body.style.overflow = 'unset';
  }, []);

  const renderModal = () => {
    if (!modal.type) return null;

    switch (modal.type) {
      case 'ProtocolDetails':
        return <ProtocolDetails {...modal.props} onClose={closeModal} />;
      case 'DemoView':
        return <DemoView onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};
