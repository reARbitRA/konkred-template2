import React from 'react';
import { 
  HeroSection, 
  ToolLibrarySection, 
  PremiumServicesSection, 
  DynamicBlogSection, 
  ContactSection 
} from '../components/KonkredSections.tsx';
import { PageView } from '../types.ts';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Structural layout alignment wrapper avoids margin leaks & horizontal overflows */}
      <div className="flex flex-col w-full relative">
        {/* Section 1: Navigation & Hero */}
        <HeroSection onNavigate={onNavigate} />

        {/* Section 2: Bespoke Tool Library (Filterable Grid Layout) */}
        <ToolLibrarySection />

        {/* Section 3: Premium Services Detail */}
        <PremiumServicesSection />

        {/* Section 4: Dynamic Blog System (Raw HTML Ingestion & Sandbox Viewer) */}
        <DynamicBlogSection />

        {/* Section 5: Lead Capture & Contact (USDT/USDC and Crypto-Friendly Settlement) */}
        <ContactSection />
      </div>
    </div>
  );
};

export default LandingPage;
