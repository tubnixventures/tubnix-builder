import React from 'react';
import { Search } from 'lucide-react';
import { TitlebarLeft } from './TitlebarLeft';
import { TitlebarActions } from './TitlebarActions';

interface TitlebarProps {
  activeFileName?: string;
  isRunning: boolean;
  showSidebar?: boolean;
  showPanel?: boolean;
  onToggleRun: () => void;
  onLaunchExternalBrowser: () => void;
  showAgent: boolean;
  onToggleAgent: () => void;
  onToggleSidebar?: () => void;
  onTogglePanel?: () => void;
  onOpenSettings: () => void;
  onOpenTemplates: () => void;
  onOpenModels: () => void;
  onOpenQuickOpen: () => void;
  onOpenCheckpoints: () => void;
  onOpenLocalFolder?: () => void;
  onRunCommand?: (cmd: string) => void;
  onClearTerminal?: () => void;
}

export const DesktopTitlebar: React.FC<TitlebarProps> = (p) => {
  return (
    <div className="h-9 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between px-3 select-none text-xs">
      <TitlebarLeft
        activeFileName={p.activeFileName}
        onOpenQuickOpen={p.onOpenQuickOpen}
        onOpenLocalFolder={p.onOpenLocalFolder}
        onTogglePanel={p.onTogglePanel}
        onToggleSidebar={p.onToggleSidebar}
        onToggleAgent={p.onToggleAgent}
        onToggleRun={p.onToggleRun}
        onRunCommand={p.onRunCommand}
        onClearTerminal={p.onClearTerminal}
      />

      <button
        onClick={p.onOpenQuickOpen}
        className="hidden md:flex items-center justify-center gap-2 px-8 py-1 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 rounded-md text-slate-400 font-sans text-[11px] transition-colors w-72"
        title="Quick Open File (Ctrl+P)"
      >
        <Search className="w-3 h-3 text-slate-400" />
        <span>Search files (Ctrl+P)</span>
      </button>

      <TitlebarActions
        isRunning={p.isRunning}
        showAgent={p.showAgent}
        showSidebar={p.showSidebar}
        showPanel={p.showPanel}
        onToggleRun={p.onToggleRun}
        onLaunchExternalBrowser={p.onLaunchExternalBrowser}
        onToggleAgent={p.onToggleAgent}
        onToggleSidebar={p.onToggleSidebar}
        onTogglePanel={p.onTogglePanel}
        onOpenSettings={p.onOpenSettings}
        onOpenTemplates={p.onOpenTemplates}
        onOpenModels={p.onOpenModels}
        onOpenCheckpoints={p.onOpenCheckpoints}
      />
    </div>
  );
};
