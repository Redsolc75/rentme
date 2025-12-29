import React from 'react';
import { cn } from '@/lib/utils';

export default function ActionButton({ 
  label, 
  sublabel,
  icon: Icon, 
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-500',
  onClick 
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 text-left w-full group"
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105", iconBgColor)}>
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <div>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{sublabel}</p>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
      </div>
    </button>
  );
}