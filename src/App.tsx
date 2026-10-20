import React, { useState } from 'react';
import { DesktopTitlebar } from './ide/components/DesktopTitlebar';
import { IdeContainer } from './ide/components/IdeContainer';
import { StatusBar } from './ide/components/StatusBar';
import { AppModalsOverlay } from './ide/components/AppModalsOverlay';
import { useIdeState } from './ide/state/useIdeState';
import { useAppModals } from './ide/state/useAppModals';
import { useAgentState } from './ide/state/useAgentState';
import { getFileLanguage } from './ide/services/fileIcons';
import { makeAgentCallbacks } from './ide/state/useAppAgentBridge';
import { openInExternalBrowser } from './ide/services/externalBrowserLauncher';
import { openLocalFolderPicker } from './ide/services/nativeFileSystem';
import { makeContainerEventProps } from './ide/state/useAppContainerProps';
import { useGlobalIdeShortcuts } from './ide/state/useQuickOpenShortcuts';
import { useAppDiffAndCheckpoints } from './ide/state/useAppDiffAndCheckpoints';
import { makeOverlayProps } from './ide/state/useAppOverlayProps';
import { makeTitlebarProps } from './ide/state/useAppTitlebarProps';

export default function App() {
  const ide = useIdeState();
  const modals = useAppModals();
  const diffCp = useAppDiffAndCheckpoints(ide.files, ide.setFiles);
  const [accountId, setAccountId] = useState('0123456789abcdef0123456789abcdef');
  const [apiToken, setApiToken] = useState('');

  const agent = useAgentState(
    makeAgentCallbacks(ide.activeFile, ide.files, ide.setFiles, ide.selectFile, ide.onEditorChange, (cmd) => ide.runTerminalCmd(cmd), diffCp.createCheckpoint)
  );

  const handleLaunchBrowser = () => {
    const res = openInExternalBrowser('http://localhost:5173');
    ide.runTerminalCmd(`[External Browser] ${res.message}`);
  };

  const handleOpenFolder = async () => {
    const res = await openLocalFolderPicker();
    if (res?.files.length) {
      ide.setFiles(res.files);
      ide.selectFile(res.files[0].isFolder ? res.files[0].children![0] : res.files[0]);
      ide.runTerminalCmd(`[File System Access] Loaded "${res.folderName}" (${res.files.length} items).`);
    }
  };

  useGlobalIdeShortcuts(() => modals.setShowQuickOpen((q) => !q), () => modals.setShowAgent((a) => !a));
  const titlebarProps = makeTitlebarProps(ide, modals, diffCp, handleLaunchBrowser, handleOpenFolder);
  const containerEvents = makeContainerEventProps(agent, ide, modals, handleLaunchBrowser);
  const overlayProps = makeOverlayProps(modals, diffCp, ide, accountId, apiToken, setAccountId, setApiToken);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 font-sans text-slate-100 overflow-hidden select-none">
      <DesktopTitlebar {...titlebarProps} />

      <IdeContainer
        files={ide.files}
        setFiles={ide.setFiles}
        activeFile={ide.activeFile}
        selectFile={ide.selectFile}
        tabs={ide.tabs}
        setTabs={ide.setTabs}
        editorContent={ide.editorContent}
        isDirty={ide.isDirty}
        canUndo={ide.canUndo}
        canRedo={ide.canRedo}
        settings={ide.settings}
        inlineGhostText={ide.inlineGhost}
        showAgent={modals.showAgent}
        showPanel={modals.showPanel}
        onTogglePanel={() => modals.setShowPanel((p) => !p)}
        onOpenNativeFolder={handleOpenFolder}
        terminalEntries={ide.terminalEntries}
        agentMessages={agent.messages}
        isAgentLoading={agent.isLoading}
        onOpenDiff={(diff) => diffCp.setActiveDiff(diff)}
        {...containerEvents}
      />

      <StatusBar
        language={ide.activeFile ? getFileLanguage(ide.activeFile.name) : 'typescript'}
        lineCount={ide.editorContent.split('\n').length}
        tokensUsed={agent.tokensUsed}
        spentUsd={agent.spentUsd}
        isConnected={Boolean(apiToken)}
      />

      <AppModalsOverlay {...overlayProps} />
    </div>
  );
}
