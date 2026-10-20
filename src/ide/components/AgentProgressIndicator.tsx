import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressProps {
  step?: string;
  percent?: number;
}

export const AgentProgressIndicator: React.FC<ProgressProps> = ({ step, percent }) => {
  return (
    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-xs">
      <div className="flex items-center gap-2 text-orange-400 font-medium text-[11px]">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>{step || 'Reasoning with model...'}</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
        <div className="bg-orange-500 h-1.5 transition-all duration-300" style={{ width: `${percent || 40}%` }} />
      </div>
    </div>
  );
};
