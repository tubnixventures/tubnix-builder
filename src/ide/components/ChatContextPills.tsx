import React from 'react';
import { Paperclip, FileCode, Folder, X, Plus } from 'lucide-react';
import { AttachedContextItem } from '../types/contextAttachment';

interface ContextPillsProps {
  attachedItems: AttachedContextItem[];
  onRemoveItem: (id: string) => void;
  onAttachActiveFile: () => void;
  activeFileName?: string;
  hasActiveFileAttached: boolean;
}

export const ChatContextPills: React.FC<ContextPillsProps> = ({
  attachedItems,
  onRemoveItem,
  onAttachActiveFile,
  activeFileName,
  hasActiveFileAttached,
}) => {
  return (
    <div className="px-3 py-1.5 border-b border-slate-800/80 bg-slate-950/80 flex flex-wrap items-center gap-1.5 text-[11px] select-none">
      <div className="flex items-center gap-1 text-slate-500 font-mono">
        <Paperclip className="w-3 h-3 text-orange-400" />
        <span>Context ({attachedItems.length}):</span>
      </div>

      {attachedItems.map((item) => (
        <span
          key={item.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]"
        >
          {item.isFolder ? <Folder className="w-2.5 h-2.5 text-amber-400" /> : <FileCode className="w-2.5 h-2.5 text-blue-400" />}
          <span className="truncate max-w-[120px]">{item.name}</span>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="hover:text-rose-400 text-slate-500 p-0.5"
            title="Remove from chat context"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}

      {activeFileName && !hasActiveFileAttached && (
        <button
          onClick={onAttachActiveFile}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-600/10 hover:bg-orange-600/20 border border-orange-500/30 text-orange-400 font-mono text-[10px] transition-colors"
          title={`Attach '${activeFileName}' to agent prompt`}
        >
          <Plus className="w-2.5 h-2.5" />
          <span>+ Attach active ({activeFileName})</span>
        </button>
      )}
    </div>
  );
};
