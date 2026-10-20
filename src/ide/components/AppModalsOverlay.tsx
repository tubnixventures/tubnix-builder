import React from 'react';
import { EditorSettingsModal } from './EditorSettingsModal';
import { TemplateSelectorModal } from './TemplateSelectorModal';
import { ModelLadderModal } from './ModelLadderModal';
import { QuickOpenModal } from './QuickOpenModal';
import { DiffPreviewModal } from './DiffPreviewModal';
import { CheckpointHistoryModal } from './CheckpointHistoryModal';
import { EditorSettings, WorkspaceFile } from '../types/ide';
import { CodeDiff, WorkspaceCheckpoint } from '../types/agentTools';

interface OverlayProps {
  showSettings: boolean;
  showTemplates: boolean;
  showModels: boolean;
  showQuickOpen?: boolean;
  showCheckpoints?: boolean;
  activeDiff?: CodeDiff;
  checkpoints?: WorkspaceCheckpoint[];
  files: WorkspaceFile[];
  settings: EditorSettings;
  accountId: string;
  apiToken: string;
  onSaveCredentials: (acc: string, tok: string) => void;
  onUpdateSettings: (u: Partial<EditorSettings>) => void;
  onCloseSettings: () => void;
  onSelectTemplate: (files: WorkspaceFile[]) => void;
  onCloseTemplates: () => void;
  onCloseModels: () => void;
  onCloseQuickOpen?: () => void;
  onCloseCheckpoints?: () => void;
  onCloseDiff?: () => void;
  onAcceptDiff?: () => void;
  onRestoreCheckpoint?: (id: string) => void;
  onSelectFile?: (file: WorkspaceFile) => void;
}

export const AppModalsOverlay: React.FC<OverlayProps> = (p) => {
  return (
    <>
      {p.showSettings && (
        <EditorSettingsModal settings={p.settings} accountId={p.accountId} apiToken={p.apiToken} onSaveCredentials={p.onSaveCredentials} onUpdate={p.onUpdateSettings} onClose={p.onCloseSettings} />
      )}
      {p.showTemplates && <TemplateSelectorModal onSelectTemplate={p.onSelectTemplate} onClose={p.onCloseTemplates} />}
      {p.showModels && <ModelLadderModal currentTier="mid_tier" onSelectTier={() => {}} onClose={p.onCloseModels} />}
      {p.showQuickOpen && p.onSelectFile && p.onCloseQuickOpen && (
        <QuickOpenModal files={p.files} onSelectFile={p.onSelectFile} onClose={p.onCloseQuickOpen} />
      )}
      {p.activeDiff && p.onCloseDiff && p.onAcceptDiff && (
        <DiffPreviewModal diff={p.activeDiff} onAccept={p.onAcceptDiff} onReject={p.onCloseDiff} onClose={p.onCloseDiff} />
      )}
      {p.showCheckpoints && p.checkpoints && p.onCloseCheckpoints && p.onRestoreCheckpoint && (
        <CheckpointHistoryModal checkpoints={p.checkpoints} onRestore={p.onRestoreCheckpoint} onClose={p.onCloseCheckpoints} />
      )}
    </>
  );
};
