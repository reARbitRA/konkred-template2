import React from 'react';
import { PageView } from '../types.ts';

interface RedaeyePageProps {
  onNavigate?: (page: PageView) => void;
}

export const RedaeyePage: React.FC<RedaeyePageProps> = () => {
  return (
    <div className="w-full h-screen bg-[#0B0F14] overflow-hidden">
      <iframe 
        src="/redaeye.html" 
        className="w-full h-full border-0" 
        title="REDAEYE ARSENAL — AI Red-Team Catalog"
      />
    </div>
  );
};

export default RedaeyePage;
