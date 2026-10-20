import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenLadder: () => void;
  onClose: () => void;
}

export const AgentDrawerHeader: React.FC<HeaderProps> = ({ onOpenLadder, onClose }) => {
  return (
    <div className="h-9 bg-slate-900 border-b border-slate-800 px-3 flex items-center justify-between text-slate-300">
      <div className="flex items-center gap-1.5 font-semibold">
        <Sparkles className="w-4 h-4 text-orange-400" />
        <span>Autonomous AI Agent</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenLadder}
          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1 hover:text-white"
        >
          <Layers className="w-3 h-3 text-orange-400" /> Ladder
        </button>
        <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
      </div>
    </div>
  );
};
