import React from 'react';
import { RotateCcw, Undo2, Redo2, Copy, GitCompare } from 'lucide-react';
import { AgentChatMessage } from '../types/contextAttachment';

interface ActionsProps {
  message: AgentChatMessage;
  onRetry?: (prompt: string) => void;
  onUndoEdit?: (msgId: string) => void;
  onRedoEdit?: (msgId: string) => void;
  onOpenDiff?: () => void;
}

export const AgentMessageActions: React.FC<ActionsProps> = ({
  message,
  onRetry,
  onUndoEdit,
  onRedoEdit,
  onOpenDiff,
}) => {
  const hasDiff = !!message.appliedDiff || (message.diffs && message.diffs.length > 0);

  return (
    <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-1 select-none">
      <div className="flex items-center gap-1.5">
        {onRetry && (
          <button
            onClick={() => onRetry(message.content)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Retry
          </button>
        )}
        {hasDiff && (
          message.isUndone ? (
            <button onClick={() => onRedoEdit?.(message.id)} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] flex items-center gap-1">
              <Redo2 className="w-2.5 h-2.5" /> Redo
            </button>
          ) : (
            <button onClick={() => onUndoEdit?.(message.id)} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1">
              <Undo2 className="w-2.5 h-2.5" /> Undo
            </button>
          )
        )}
        {message.diffs && message.diffs.length > 0 && onOpenDiff && (
          <button onClick={onOpenDiff} className="px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 border border-orange-500/40 text-[10px] flex items-center gap-1 font-mono">
            <GitCompare className="w-2.5 h-2.5" /> View Diff
          </button>
        )}
      </div>

      <button onClick={() => navigator.clipboard.writeText(message.content)} className="p-1 text-slate-500 hover:text-slate-300" title="Copy">
        <Copy className="w-3 h-3" />
      </button>
    </div>
  );
};
