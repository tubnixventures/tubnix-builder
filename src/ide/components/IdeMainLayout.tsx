import React, { useState } from 'react';
import { ActivityBar, ActivityTab } from './ActivityBar';
import { IdeMainLayoutSidebar } from './IdeMainLayoutSidebar';
import { CenterEditorPane } from './CenterEditorPane';
import { IdeResizableChatDrawer } from './IdeResizableChatDrawer';
import { ResizeGutter } from './ResizeGutter';
import { usePaneResize } from '../hooks/usePaneResize';
import { getFileLanguage } from '../services/fileIcons';
import { MainLayoutProps } from '../types/layoutProps';

export const IdeMainLayout: React.FC<MainLayoutProps> = (p) => {
  const [activityTab, setActivityTab] = useState<ActivityTab>('explorer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const resize = usePaneResize(240, 360, 220);
  const lang = p.activeFile ? getFileLanguage(p.activeFile.name) : 'typescript';

  const handleSelectActivity = (tab: ActivityTab) => {
    if (tab === 'chat') { p.onToggleAgent?.(); return; }
    if (activityTab === tab) setIsSidebarOpen(!isSidebarOpen);
    else { setActivityTab(tab); setIsSidebarOpen(true); }
  };

  return (
    <div className="flex flex-1 overflow-hidden select-none">
      <ActivityBar
        activeTab={activityTab}
        onSelectTab={handleSelectActivity}
        isChatOpen={p.showAgent || false}
        onToggleChat={p.onToggleAgent || (() => {})}
        onOpenSettings={p.onOpenSettings || (() => {})}
        onLaunchBrowser={p.onLaunchBrowser || (() => {})}
      />
      {isSidebarOpen && (
        <div style={{ width: `${resize.explorerWidth}px` }} className="shrink-0 flex h-full overflow-hidden">
          <IdeMainLayoutSidebar
            activityTab={activityTab}
            files={p.files}
            activeFileId={p.activeFileId}
            onSelectFile={p.onSelectFile}
            onToggleFolder={p.onToggleFolder}
            onCreateFile={p.onCreateFile}
            onDeleteFile={p.onDeleteFile}
            onRenameFile={p.onRenameFile}
            onImportFile={p.onImportFile}
            onAttachSpecificFile={p.onAttachSpecificFile}
            onOpenNativeFolder={p.onOpenNativeFolder}
          />
        </div>
      )}
      {isSidebarOpen && (
        <ResizeGutter direction="horizontal" onMouseDown={resize.startDragExplorer} onDoubleClick={resize.resetExplorer} title="Resize Explorer (Double-click to reset)" />
      )}
      <CenterEditorPane
        tabs={p.tabs}
        activeFileId={p.activeFileId}
        activeFile={p.activeFile}
        allFiles={p.files}
        canUndo={p.canUndo}
        canRedo={p.canRedo}
        isDirty={p.isDirty}
        language={lang}
        editorContent={p.editorContent}
        settings={p.settings}
        inlineGhostText={p.inlineGhostText}
        terminalEntries={p.terminalEntries}
        terminalHeight={resize.terminalHeight}
        isTerminalMaximized={resize.isTerminalMaximized}
        onToggleMaximizeTerminal={resize.toggleMaximizeTerminal}
        onStartResizeTerminal={resize.startDragTerminal}
        showPanel={p.showPanel}
        onTogglePanel={p.onTogglePanel}
        onSelectTab={p.onSelectTab}
        onCloseTab={p.onCloseTab}
        onUndo={p.onUndo}
        onRedo={p.onRedo}
        onSave={p.onSave}
        onTriggerInlineAi={p.onTriggerInlineAi}
        onEditorChange={p.onEditorChange}
        onAcceptGhostText={p.onAcceptGhostText}
        onRunTerminalCommand={p.onRunTerminalCommand}
        onClearTerminal={p.onClearTerminal}
        onOpenTargetFile={p.onSelectFile}
      />
      {p.showAgent && (
        <IdeResizableChatDrawer props={p} chatWidth={resize.chatWidth} onStartDrag={resize.startDragChat} onReset={resize.resetChat} />
      )}
    </div>
  );
};
