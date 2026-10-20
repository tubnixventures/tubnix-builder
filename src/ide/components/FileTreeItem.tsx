import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { WorkspaceFile } from '../types/ide';
import { getFileLanguage, getLanguageColor } from '../services/fileIcons';

interface ItemProps {
  file: WorkspaceFile;
  level: number;
  activeFileId?: string;
  onSelect: (file: WorkspaceFile) => void;
  onToggleFolder: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onContextMenu?: (e: React.MouseEvent, file: WorkspaceFile) => void;
}

export const FileTreeItem: React.FC<ItemProps> = (p) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(p.file.name);
  const lang = getFileLanguage(p.file.name);
  const color = getLanguageColor(lang);
  const isSelected = p.activeFileId === p.file.id;

  const handleFinishRename = () => {
    setIsEditing(false);
    if (editName.trim() && editName !== p.file.name) {
      p.onRename(p.file.id, editName.trim());
    }
  };

  return (
    <div>
      <div
        className={`group flex items-center justify-between py-1 px-2 text-xs rounded-sm cursor-pointer select-none transition-colors ${
          isSelected
            ? 'bg-blue-600/25 text-white font-medium border-l-2 border-blue-500'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-l-2 border-transparent'
        }`}
        style={{ paddingLeft: `${Math.max(8, p.level * 14)}px` }}
        onClick={() => (p.file.isFolder ? p.onToggleFolder(p.file.id) : p.onSelect(p.file))}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          p.onContextMenu?.(e, p.file);
        }}
      >
        <div className="flex items-center gap-1.5 truncate flex-1">
          {p.file.isFolder ? (
            <>
              {p.file.isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
              <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </>
          ) : (
            <File className={`w-3.5 h-3.5 shrink-0 ${color}`} />
          )}

          {isEditing ? (
            <input
              type="text"
              value={editName}
              autoFocus
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleFinishRename}
              onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 border border-slate-700 px-1 py-0.5 text-xs text-white rounded outline-none w-32 font-mono"
            />
          ) : (
            <span className="truncate font-mono text-[11px]">{p.file.name}</span>
          )}
        </div>
      </div>

      {p.file.isFolder && p.file.isOpen && p.file.children && (
        <div>
          {p.file.children.map((child) => (
            <FileTreeItem
              key={child.id}
              file={child}
              level={p.level + 1}
              activeFileId={p.activeFileId}
              onSelect={p.onSelect}
              onToggleFolder={p.onToggleFolder}
              onDelete={p.onDelete}
              onRename={p.onRename}
              onContextMenu={p.onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};
