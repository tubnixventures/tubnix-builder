import React from 'react';
import { GitCompare, X, Check, Undo2 } from 'lucide-react';
import { CodeDiff } from '../types/agentTools';

interface DiffModalProps {
  diff: CodeDiff;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}

export const DiffPreviewModal: React.FC<DiffModalProps> = ({ diff, onAccept, onReject, onClose }) => {
  const origLines = diff.original.split('\n');
  const modLines = diff.modified.split('\n');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh] font-mono text-xs text-slate-200">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-orange-400" />
            <span className="font-semibold text-white">{diff.filePath}</span>
            <span className="text-[10px] text-emerald-400">+{diff.addedLines}</span>
            <span className="text-[10px] text-rose-400">-{diff.removedLines}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-[11px] bg-slate-950">
          {origLines.length > 0 && origLines[0] && (
            <div className="space-y-0.5 opacity-60">
              <div className="text-[10px] text-slate-500 uppercase pb-1">Original Content:</div>
              {origLines.slice(0, 15).map((l, idx) => (
                <div key={idx} className="bg-rose-950/30 text-rose-300 px-2 py-0.5 rounded truncate">
                  - {l}
                </div>
              ))}
            </div>
          )}
          <div className="space-y-0.5 pt-2">
            <div className="text-[10px] text-emerald-400 uppercase pb-1">Agent Proposed Modifications:</div>
            {modLines.slice(0, 25).map((l, idx) => (
              <div key={idx} className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded truncate">
                + {l}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => { onReject(); onClose(); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded flex items-center gap-1.5"
          >
            <Undo2 className="w-3.5 h-3.5" /> Reject Changes
          </button>
          <button
            onClick={() => { onAccept(); onClose(); }}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Accept All Changes
          </button>
        </div>
      </div>
    </div>
  );
};
