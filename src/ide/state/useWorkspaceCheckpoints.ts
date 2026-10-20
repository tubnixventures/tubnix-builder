import { useState, useCallback } from 'react';
import { WorkspaceFile } from '../types/ide';
import { WorkspaceCheckpoint } from '../types/agentTools';
import { flattenFiles } from '../services/importLinkResolver';

export function useWorkspaceCheckpoints(
  files: WorkspaceFile[],
  setFiles: React.Dispatch<React.SetStateAction<WorkspaceFile[]>>
) {
  const [checkpoints, setCheckpoints] = useState<WorkspaceCheckpoint[]>([]);

  const createCheckpoint = useCallback((label: string) => {
    const flat = flattenFiles(files);
    const snapshot: Record<string, string> = {};
    for (const f of flat) {
      const key = f.path || f.name;
      snapshot[key] = f.content || '';
    }
    const cp: WorkspaceCheckpoint = { id: `cp_${Date.now()}`, timestamp: Date.now(), label, snapshot };
    setCheckpoints((prev) => [cp, ...prev].slice(0, 20));
    return cp;
  }, [files]);

  const restoreCheckpoint = useCallback((id: string): boolean => {
    const cp = checkpoints.find((c) => c.id === id);
    if (!cp || !cp.snapshot) return false;
    const restoreTree = (list: WorkspaceFile[]): WorkspaceFile[] =>
      list.map((item) => {
        const key = item.path || item.name;
        if (!item.isFolder && cp.snapshot[key] !== undefined) {
          return { ...item, content: cp.snapshot[key] };
        }
        if (item.children) return { ...item, children: restoreTree(item.children) };
        return item;
      });
    setFiles((prev) => restoreTree(prev));
    return true;
  }, [checkpoints, setFiles]);

  return { checkpoints, createCheckpoint, restoreCheckpoint };
}
