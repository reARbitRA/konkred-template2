import { useEffect } from 'react';

const ForgePage = ({ onNavigate }: { onNavigate: (page: any) => void }) => {
  useEffect(() => {
    // Replace with fullKONK_>
    onNavigate('fullkonk');
  }, [onNavigate]);

  return null;
};

export default ForgePage;
