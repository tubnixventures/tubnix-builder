import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { WorkspaceFile } from '../types/ide';
import { FileTreeItem } from './FileTreeItem';
import { FileExplorerHeader } from './FileExplorerHeader';
import { FileContextMenu } from './FileContextMenu';

interface ExplorerProps {
  files: WorkspaceFile[];
  activeFileId?: string;
  onSelectFile: (file: WorkspaceFile) => void;
  onToggleFolder: (id: string) => void;
  onCreateFile: (name: string, isFolder: boolean) => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (id: string, name: string) => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddToChatContext?: (file: WorkspaceFile) => void;
  onOpenNativeFolder?: () => void;
}

export const FileExplorer: React.FC<ExplorerProps> = (p) => {
  const [filter, setFilter] = useState('');
  const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [menuPos, setMenuPos] = useState<{ x: number; y: number; file: WorkspaceFile } | null>(null);

  const handleFinishCreate = () => {
    if (newItemName.trim() && isCreating) p.onCreateFile(newItemName.trim(), isCreating === 'folder');
    setIsCreating(null);
    setNewItemName('');
  };

  return (
    <div className="w-56 bg-slate-950/80 border-r border-slate-800/80 flex flex-col h-full select-none">
      <FileExplorerHeader
        onStartCreateFile={() => setIsCreating('file')}
        onStartCreateFolder={() => setIsCreating('folder')}
        onImportFile={p.onImportFile}
        onOpenNativeFolder={p.onOpenNativeFolder}
      />
      <div className="p-2 border-b border-slate-800/60">
        <div className="relative">
          <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-slate-900 border border-slate-800 rounded pl-7 pr-2 py-1 text-[11px] font-mono text-slate-200 outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {isCreating && (
          <div className="px-2 py-1">
            <input
              type="text"
              autoFocus
              placeholder={isCreating === 'file' ? 'filename.ts' : 'folder-name'}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleFinishCreate}
              onKeyDown={(e) => e.key === 'Enter' && handleFinishCreate()}
              className="w-full bg-slate-900 border border-blue-500 rounded px-2 py-1 text-xs text-white font-mono outline-none"
            />
          </div>
        )}
        {p.files.map((file) => (
          <FileTreeItem
            key={file.id}
            file={file}
            level={0}
            activeFileId={p.activeFileId}
            onSelect={p.onSelectFile}
            onToggleFolder={p.onToggleFolder}
            onDelete={p.onDeleteFile}
            onRename={p.onRenameFile}
            onContextMenu={(e, f) => setMenuPos({ x: e.clientX, y: e.clientY, file: f })}
          />
        ))}
      </div>

      {menuPos && (
        <FileContextMenu
          x={menuPos.x}
          y={menuPos.y}
          file={menuPos.file}
          onRename={() => { const n = window.prompt('Rename:', menuPos.file.name); if (n?.trim()) p.onRenameFile(menuPos.file.id, n.trim()); }}
          onDelete={() => p.onDeleteFile(menuPos.file.id)}
          onAddToContext={() => p.onAddToChatContext?.(menuPos.file)}
          onCreateInside={(isF) => setIsCreating(isF ? 'folder' : 'file')}
          onClose={() => setMenuPos(null)}
        />
      )}
    </div>
  );
};
