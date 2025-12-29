import React from 'react';
import { cn } from '@/lib/utils';

const statusConfig = {
  'Llogat': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  'Buit': { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
  'Manteniment': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  'Actiu': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  'Pagat': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  'Pendent': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  'Endarrerit': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  'Morós': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  'Renovar aviat': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  'Pagament tardà': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  'Finalitzat': { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
      config.bg, config.text
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {status}
    </span>
  );
}