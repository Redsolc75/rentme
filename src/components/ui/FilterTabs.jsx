import React from 'react';
import { cn } from '@/lib/utils';

export default function FilterTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            activeTab === tab.value
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}