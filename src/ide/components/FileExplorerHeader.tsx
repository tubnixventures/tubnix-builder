import React from 'react';
import { FilePlus, FolderPlus, Upload, FolderOpen } from 'lucide-react';

interface HeaderProps {
  onStartCreateFile: () => void;
  onStartCreateFolder: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenNativeFolder?: () => void;
}

export const FileExplorerHeader: React.FC<HeaderProps> = ({
  onStartCreateFile,
  onStartCreateFolder,
  onImportFile,
  onOpenNativeFolder,
}) => {
  return (
    <div className="p-2 border-b border-slate-800/80 flex items-center justify-between">
      <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Explorer</span>
      <div className="flex items-center gap-0.5 text-slate-400">
        {onOpenNativeFolder && (
          <button
            onClick={onOpenNativeFolder}
            title="Open Local Folder (File System Access API)"
            className="p-1 hover:text-white hover:bg-slate-900 rounded"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
          </button>
        )}
        <button
          onClick={onStartCreateFile}
          title="New File"
          className="p-1 hover:text-slate-200 hover:bg-slate-900 rounded"
        >
          <FilePlus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onStartCreateFolder}
          title="New Folder"
          className="p-1 hover:text-slate-200 hover:bg-slate-900 rounded"
        >
          <FolderPlus className="w-3.5 h-3.5" />
        </button>
        <label className="p-1 hover:text-slate-200 hover:bg-slate-900 rounded cursor-pointer" title="Import File">
          <Upload className="w-3.5 h-3.5" />
          <input type="file" onChange={onImportFile} className="hidden" />
        </label>
      </div>
    </div>
  );
};
