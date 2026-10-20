import React, { useEffect, useRef } from 'react';
import { Edit2, Trash2, Paperclip, Copy, FilePlus, FolderPlus } from 'lucide-react';
import { WorkspaceFile } from '../types/ide';

interface ContextMenuProps {
  x: number;
  y: number;
  file: WorkspaceFile;
  onRename: () => void;
  onDelete: () => void;
  onAddToContext: () => void;
  onCreateInside?: (isFolder: boolean) => void;
  onClose: () => void;
}

export const FileContextMenu: React.FC<ContextMenuProps> = (p) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) p.onClose();
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') p.onClose(); };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleKey);
    };
  }, [p.onClose]);

  return (
    <div
      ref={menuRef}
      style={{ top: `${p.y}px`, left: `${p.x}px` }}
      className="fixed z-50 w-52 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1 text-slate-200 font-sans text-xs select-none"
    >
      <button onClick={() => { p.onRename(); p.onClose(); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left text-slate-300 hover:text-white">
        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
        <span>Rename</span>
      </button>

      <button onClick={() => { p.onDelete(); p.onClose(); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-950/60 hover:text-rose-300 text-left text-slate-300">
        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
        <span>Delete</span>
      </button>

      <div className="h-px bg-slate-800 my-1" />

      <button onClick={() => { p.onAddToContext(); p.onClose(); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left text-slate-300 hover:text-white">
        <Paperclip className="w-3.5 h-3.5 text-orange-400" />
        <span>Add to AI Chat Context</span>
      </button>

      <button onClick={() => { navigator.clipboard.writeText(p.file.path); p.onClose(); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left text-slate-300 hover:text-white">
        <Copy className="w-3.5 h-3.5 text-slate-400" />
        <span>Copy Relative Path</span>
      </button>

      {p.file.isFolder && p.onCreateInside && (
        <>
          <div className="h-px bg-slate-800 my-1" />
          <button onClick={() => { p.onCreateInside!(false); p.onClose(); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left text-slate-300 hover:text-white">
            <FilePlus className="w-3.5 h-3.5 text-blue-400" />
            <span>New File</span>
          </button>
          <button onClick={() => { p.onCreateInside!(true); p.onClose(); }} className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-800 text-left text-slate-300 hover:text-white">
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>New Folder</span>
          </button>
        </>
      )}
    </div>
  );
};
