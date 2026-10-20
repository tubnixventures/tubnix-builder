import React from 'react';
import { Files, Search, GitBranch, Sparkles, PlayCircle, ExternalLink, Settings } from 'lucide-react';

export type ActivityTab = 'explorer' | 'search' | 'git' | 'chat';

interface ActivityBarProps {
  activeTab: ActivityTab;
  onSelectTab: (tab: ActivityTab) => void;
  isChatOpen: boolean;
  onToggleChat: () => void;
  onOpenSettings: () => void;
  onLaunchBrowser: () => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeTab,
  onSelectTab,
  isChatOpen,
  onToggleChat,
  onOpenSettings,
  onLaunchBrowser,
}) => {
  return (
    <aside className="w-12 bg-slate-950 border-r border-slate-800 flex flex-col items-center justify-between py-2 select-none shrink-0 z-20">
      <div className="flex flex-col items-center gap-1.5 w-full">
        <button
          onClick={() => onSelectTab('explorer')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === 'explorer' ? 'text-white border-l-2 border-orange-500 bg-slate-900/60' : 'text-slate-400 hover:text-white'
          }`}
          title="Explorer (Ctrl+Shift+E)"
        >
          <Files className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectTab('search')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === 'search' ? 'text-white border-l-2 border-orange-500 bg-slate-900/60' : 'text-slate-400 hover:text-white'
          }`}
          title="Search in Files (Ctrl+Shift+F)"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => onSelectTab('git')}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            activeTab === 'git' ? 'text-white border-l-2 border-orange-500 bg-slate-900/60' : 'text-slate-400 hover:text-white'
          }`}
          title="Source Control (Ctrl+Shift+G)"
        >
          <GitBranch className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleChat}
          className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            isChatOpen ? 'text-orange-400 border-l-2 border-orange-500 bg-orange-500/10' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle AI Chat (Ctrl+Shift+I)"
        >
          <Sparkles className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
        </button>

        <button
          onClick={onLaunchBrowser}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900/60 transition-colors"
          title="Open in External Browser (Chrome / Safari / Edge)"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-1 w-full">
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Manage Account ID, API Token & Settings (Ctrl+,)"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
