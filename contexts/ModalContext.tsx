
import React, { createContext, useContext } from 'react';

/**
 * Modal context retained as a minimal, honest provider.
 * The marketplace/enclave modal catalogue (ProtocolDetails, DemoView,
 * UpgradePrompt, NewFolder/AddFile/NewNote/AddMember) was purged with the
 * mock marketplace. The provider is kept so existing consumers keep a stable
 * API; it currently renders no modals.
 */

interface ModalContextValue {
  openModal: (type: string, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const openModal = () => {
    console.warn('openModal called but no modal catalogue is configured.');
  };
  const closeModal = () => undefined;

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');
  return context;
};
