import React from 'react';
import { EditorTabBar } from './EditorTabBar';
import { EditorToolbar } from './EditorToolbar';
import { EditorBreadcrumbs } from './EditorBreadcrumbs';
import { CodeEditor } from './CodeEditor';
import { BottomPanel } from './BottomPanel';
import { EditorTab, TerminalEntry, EditorSettings, SupportedLanguage, WorkspaceFile } from '../types/ide';
import { validateCodeSyntax } from '../services/syntaxValidator';

interface CenterPaneProps {
  tabs: EditorTab[];
  activeFileId?: string;
  activeFile?: WorkspaceFile;
  allFiles?: WorkspaceFile[];
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  language: SupportedLanguage;
  editorContent: string;
  settings: EditorSettings;
  inlineGhostText?: string;
  terminalEntries: TerminalEntry[];
  terminalHeight: number;
  isTerminalMaximized?: boolean;
  onToggleMaximizeTerminal?: () => void;
  onStartResizeTerminal?: (e: React.MouseEvent) => void;
  showPanel?: boolean;
  onTogglePanel?: () => void;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onTriggerInlineAi: () => void;
  onEditorChange: (val: string) => void;
  onAcceptGhostText: () => void;
  onRunTerminalCommand: (cmd: string, shell?: string) => void;
  onClearTerminal: () => void;
  onOpenTargetFile?: (file: WorkspaceFile) => void;
}

export const CenterEditorPane: React.FC<CenterPaneProps> = (p) => {
  const diagnostics = validateCodeSyntax(p.editorContent, p.language);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      <EditorTabBar tabs={p.tabs} activeFileId={p.activeFileId} onSelectTab={p.onSelectTab} onCloseTab={p.onCloseTab} />
      <EditorBreadcrumbs activeFile={p.activeFile} content={p.editorContent} allFiles={p.allFiles || []} onOpenTargetFile={p.onOpenTargetFile || (() => {})} />
      <EditorToolbar canUndo={p.canUndo} canRedo={p.canRedo} isDirty={p.isDirty} language={p.language} onUndo={p.onUndo} onRedo={p.onRedo} onSave={p.onSave} onTriggerInlineAi={p.onTriggerInlineAi} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CodeEditor content={p.editorContent} language={p.language} onChange={p.onEditorChange} onSave={p.onSave} onUndo={p.onUndo} onRedo={p.onRedo} settings={p.settings} inlineGhostText={p.inlineGhostText} onAcceptGhostText={p.onAcceptGhostText} />
        {(p.showPanel ?? true) && (
          <BottomPanel
            terminalEntries={p.terminalEntries}
            diagnostics={diagnostics}
            activeFileName={p.activeFile?.name}
            onRunTerminalCommand={p.onRunTerminalCommand}
            onClearTerminal={p.onClearTerminal}
            onClose={p.onTogglePanel || (() => {})}
            height={p.terminalHeight}
            isMaximized={p.isTerminalMaximized}
            onToggleMaximize={p.onToggleMaximizeTerminal}
            onStartResize={p.onStartResizeTerminal}
          />
        )}
      </div>
    </div>
  );
};
