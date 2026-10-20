import React from 'react';
import { History, RotateCcw, X, ShieldCheck } from 'lucide-react';
import { WorkspaceCheckpoint } from '../types/agentTools';

interface CheckpointModalProps {
  checkpoints: WorkspaceCheckpoint[];
  onRestore: (id: string) => void;
  onClose: () => void;
}

export const CheckpointHistoryModal: React.FC<CheckpointModalProps> = ({
  checkpoints,
  onRestore,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[75vh] font-sans text-xs text-slate-200">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-white">
            <History className="w-4 h-4 text-orange-400" />
            <span>Workspace Checkpoints &amp; Rollback History</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {checkpoints.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <span>No checkpoints yet. Checkpoints are automatically generated before agent tasks.</span>
            </div>
          ) : (
            checkpoints.map((cp) => (
              <div
                key={cp.id}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700"
              >
                <div>
                  <div className="font-semibold text-white">{cp.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {new Date(cp.timestamp).toLocaleTimeString()} · {Object.keys(cp.snapshot).length} files protected
                  </div>
                </div>

                <button
                  onClick={() => { onRestore(cp.id); onClose(); }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-300 rounded font-mono text-[11px] flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Revert
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
