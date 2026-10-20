import React from 'react';
import { X, FileCode } from 'lucide-react';
import { EditorTab } from '../types/ide';
import { getFileLanguage, getLanguageColor } from '../services/fileIcons';

interface TabBarProps {
  tabs: EditorTab[];
  activeFileId?: string;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
}

export const EditorTabBar: React.FC<TabBarProps> = ({
  tabs,
  activeFileId,
  onSelectTab,
  onCloseTab,
}) => {
  if (tabs.length === 0) return null;

  return (
    <div className="h-9 bg-slate-950 border-b border-slate-800/80 flex items-center overflow-x-auto select-none">
      {tabs.map((tab) => {
        const isActive = tab.fileId === activeFileId;
        const lang = getFileLanguage(tab.fileName);
        const color = getLanguageColor(lang);

        return (
          <div
            key={tab.fileId}
            onClick={() => onSelectTab(tab.fileId)}
            className={`group h-full flex items-center gap-2 px-3 border-r border-slate-800/60 cursor-pointer text-xs font-mono transition-colors ${
              isActive
                ? 'bg-slate-900 text-white border-t-2 border-t-blue-500 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <FileCode className={`w-3.5 h-3.5 ${color}`} />
            <span>{tab.fileName}</span>

            {tab.isDirty && (
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" title="Unsaved changes" />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.fileId);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-white text-slate-500 p-0.5 rounded transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
