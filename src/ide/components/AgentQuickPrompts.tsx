import React from 'react';

const QUICK_PROMPTS = [
  'Refactor active file for maximum performance',
  'Write unit tests for all edge cases',
  'Create a FastAPI backend endpoint with Pydantic',
  'Audit authentication & tokens for security risks',
];

interface QuickProps {
  onSelect: (prompt: string) => void;
}

export const AgentQuickPrompts: React.FC<QuickProps> = ({ onSelect }) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {QUICK_PROMPTS.map((qp, i) => (
        <button
          key={i}
          onClick={() => onSelect(qp)}
          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] whitespace-nowrap"
        >
          {qp}
        </button>
      ))}
    </div>
  );
};
