import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Wrench, ChevronRight, AlertCircle } from 'lucide-react';

const taskTypeConfig = {
  payment: { icon: AlertTriangle, color: 'bg-red-100 text-red-500', label: 'Lloguer Vençut' },
  renewal: { icon: Clock, color: 'bg-amber-100 text-amber-500', label: 'Renovació C...' },
  maintenance: { icon: Wrench, color: 'bg-blue-100 text-blue-500', label: 'Reparació Ai...' },
};

export default function TasksPanel({ tasks = [] }) {
  const urgentCount = tasks.filter(t => t.urgent).length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Tasques Pendents</h3>
        {urgentCount > 0 && (
          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
            {urgentCount} urgent
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Cap tasca pendent</p>
        ) : (
          tasks.slice(0, 4).map((task, index) => {
            const config = taskTypeConfig[task.type] || taskTypeConfig.maintenance;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.color.split(' ')[0])}>
                  <config.icon className={cn("w-5 h-5", config.color.split(' ')[1])} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                  <p className="text-xs text-slate-400 truncate">{task.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-xs font-medium",
                    task.urgent ? "text-red-500" : "text-slate-400"
                  )}>
                    {task.badge}
                  </span>
                  <p className="text-[10px] text-slate-400">{task.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <button className="w-full mt-4 text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center gap-1 group">
        Veure totes les tasques
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}