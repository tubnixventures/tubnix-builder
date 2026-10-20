import React, { useState } from 'react';
import { ModelTier } from '../../types/models';
import { AutoRouteBadge } from './AutoRouteBadge';
import { ModelLadderModal } from './ModelLadderModal';
import { AgentDrawerHeader } from './AgentDrawerHeader';
import { ChatContextPills } from './ChatContextPills';
import { AgentMessageCard } from './AgentMessageCard';
import { AgentChatInput } from './AgentChatInput';
import { AgentProgressIndicator } from './AgentProgressIndicator';
import { AttachedContextItem, AgentChatMessage } from '../types/contextAttachment';
import { CodeDiff } from '../types/agentTools';
import { classifyTask } from '../../routing/taskClassifier';

interface AgentDrawerProps {
  messages: AgentChatMessage[];
  onSendMessage: (text: string, tier?: ModelTier) => void;
  isLoading: boolean;
  progressStep?: string;
  progressPercent?: number;
  onClose: () => void;
  attachedContext: AttachedContextItem[];
  onRemoveContextItem: (id: string) => void;
  onAttachActiveFile: () => void;
  onUploadContextFile?: (item: AttachedContextItem) => void;
  activeFileName?: string;
  onUndoEdit?: (id: string) => void;
  onRedoEdit?: (id: string) => void;
  onOpenDiff?: (diff: CodeDiff) => void;
}

export const AgentChatDrawer: React.FC<AgentDrawerProps> = (p) => {
  const [input, setInput] = useState('');
  const [isAuto, setIsAuto] = useState(true);
  const [overrideTier, setOverrideTier] = useState<ModelTier>('mid_tier');
  const [showLadder, setShowLadder] = useState(false);

  const activeClassification = classifyTask(input || 'General full-stack coding');
  const activeTier = isAuto ? activeClassification.recommendedTier : overrideTier;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || p.isLoading) return;
    p.onSendMessage(text.trim(), activeTier);
    if (!textToSend) setInput('');
  };

  const hasActiveFileAttached = p.attachedContext.some((c) => c.name === p.activeFileName);

  return (
    <div className="w-88 bg-slate-950 border-l border-slate-800 flex flex-col h-full select-none text-xs">
      <AgentDrawerHeader onOpenLadder={() => setShowLadder(true)} onClose={p.onClose} />
      <ChatContextPills
        attachedItems={p.attachedContext}
        onRemoveItem={p.onRemoveContextItem}
        onAttachActiveFile={p.onAttachActiveFile}
        activeFileName={p.activeFileName}
        hasActiveFileAttached={hasActiveFileAttached}
      />
      <AutoRouteBadge classification={activeClassification} isAuto={isAuto} onOpenLadder={() => setShowLadder(true)} />

      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono">
        {p.messages.map((m) => (
          <AgentMessageCard
            key={m.id}
            message={m}
            onRetry={(text) => handleSend(text)}
            onUndoEdit={p.onUndoEdit}
            onRedoEdit={p.onRedoEdit}
            onSelectSuggestion={(s) => handleSend(s)}
            onOpenDiff={p.onOpenDiff}
          />
        ))}
        {p.isLoading && <AgentProgressIndicator step={p.progressStep} percent={p.progressPercent} />}
      </div>

      <AgentChatInput
        input={input}
        setInput={setInput}
        isLoading={p.isLoading}
        onSend={handleSend}
        onUploadFile={(f) => p.onUploadContextFile?.({
          id: `up_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: f.name,
          path: `uploads/${f.name}`,
          isFolder: false,
          contentPreview: f.content.slice(0, 300),
        })}
      />

      {showLadder && (
        <ModelLadderModal currentTier={activeTier} onSelectTier={(t) => { setOverrideTier(t); setIsAuto(false); }} onClose={() => setShowLadder(false)} />
      )}
    </div>
  );
};
