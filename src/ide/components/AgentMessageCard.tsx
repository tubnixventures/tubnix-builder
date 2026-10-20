import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { AgentChatMessage } from '../types/contextAttachment';
import { AgentToolCallCard } from './AgentToolCallCard';
import { AgentMessageActions } from './AgentMessageActions';
import { CodeDiff } from '../types/agentTools';

interface MessageCardProps {
  message: AgentChatMessage;
  onRetry?: (prompt: string) => void;
  onUndoEdit?: (msgId: string) => void;
  onRedoEdit?: (msgId: string) => void;
  onSelectSuggestion?: (text: string) => void;
  onOpenDiff?: (diff: CodeDiff) => void;
}

export const AgentMessageCard: React.FC<MessageCardProps> = ({
  message,
  onRetry,
  onUndoEdit,
  onRedoEdit,
  onSelectSuggestion,
  onOpenDiff,
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={`p-2.5 rounded-lg border font-mono text-xs ${
      isUser ? 'bg-orange-600/15 border-orange-500/30 text-orange-200' : 'bg-slate-900 border-slate-800 text-slate-200'
    }`}>
      <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase mb-1">
        <span>{message.role}</span>
        {message.modelUsed && <span className="text-orange-400 font-bold">{message.modelUsed}</span>}
      </div>

      <div className="whitespace-pre-wrap leading-relaxed text-[11px] select-text">{message.content}</div>

      {message.selfHealed && (
        <div className="mt-1.5 p-1.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] flex items-center gap-1.5 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Self-healing loop: Automatically analyzed failure traceback and applied repair.</span>
        </div>
      )}

      {message.toolCalls && message.toolCalls.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Tool Executions ({message.toolCalls.length}):</div>
          {message.toolCalls.map((tc) => (
            <AgentToolCallCard key={tc.id} tool={tc} />
          ))}
        </div>
      )}

      {!isUser && (
        <AgentMessageActions
          message={message}
          onRetry={onRetry}
          onUndoEdit={onUndoEdit}
          onRedoEdit={onRedoEdit}
          onOpenDiff={() => message.diffs?.[0] && onOpenDiff?.(message.diffs[0])}
        />
      )}

      {!isUser && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
        <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex flex-wrap gap-1">
          {message.suggestedFollowUps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion?.(s)}
              className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[10px] flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-orange-400" />
              <span>{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
