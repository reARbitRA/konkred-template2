import React from 'react';
import type { ProductStatus } from '../../catalog/types.ts';

const STATUS_STYLES: Record<ProductStatus, string> = {
  PUBLIC_DEMO: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  STANDARD_KIT: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  SUPERVISED_PILOT: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
  ENTERPRISE_INTEGRATION: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

const STATUS_LABEL: Record<ProductStatus, string> = {
  PUBLIC_DEMO: 'Public Demo',
  STANDARD_KIT: 'Standard Kit',
  SUPERVISED_PILOT: 'Supervised Pilot',
  ENTERPRISE_INTEGRATION: 'Enterprise Integration',
};

interface StatusBadgeProps {
  status: ProductStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-black uppercase tracking-wider border rounded px-2 py-1 ${
        size === 'sm' ? 'text-[9px]' : 'text-[10px]'
      } ${STATUS_STYLES[status] || ''}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {STATUS_LABEL[status]}
    </span>
  );
};
