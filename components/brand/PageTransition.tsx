/**
 * Brutalist route transition: four slabs slam shut and snap open with the K
 * mark stamped dead-center and an amber bar flash. Pure CSS, ~620ms.
 */
import React from 'react';
import KonkredLogo from './KonkredLogo.tsx';

export const PageTransition: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <div className="k-transition-overlay" aria-hidden="true">
      <div className="k-panel" />
      <div className="k-panel" />
      <div className="k-panel" />
      <div className="k-panel" />
      <div className="k-mark">
        <KonkredLogo size={64} showWordmark animate />
      </div>
      <div className="k-bar" style={{ top: '18%' }} />
      <div className="k-bar" style={{ top: '82%', animationDelay: '0.08s' }} />
    </div>
  );
};

export default PageTransition;
