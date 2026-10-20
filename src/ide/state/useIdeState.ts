import { useState, useCallback, useRef } from 'react';
import { WorkspaceFile, EditorTab, TerminalEntry, EditorSettings } from '../types/ide';
import { INITIAL_WORKSPACE_FILES, DEFAULT_EDITOR_SETTINGS } from './workspaceState';
import { useEditorHistory } from './useEditorHistory';
import { executeTerminalCommand } from '../services/terminalRunner';
import { getInlineSuggestion } from '../services/inlineSuggester';
import { getFileLanguage } from '../services/fileIcons';

export function useIdeState() {
  const [files, setFiles] = useState<WorkspaceFile[]>(INITIAL_WORKSPACE_FILES);
  const [activeFile, setActiveFile] = useState<WorkspaceFile>(() => INITIAL_WORKSPACE_FILES[0].children![0]);
  const [tabs, setTabs] = useState<EditorTab[]>([
    { id: 't0', fileId: INITIAL_WORKSPACE_FILES[0].children![0].id, fileName: 'App.vue', filePath: 'src/App.vue', isDirty: false },
  ]);
  const history = useEditorHistory(activeFile.content || '');
  const [isDirty, setIsDirty] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_EDITOR_SETTINGS);
  const [inlineGhost, setInlineGhost] = useState<string | undefined>();
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([
    { id: 'init', command: 'welcome', output: 'VS Code Web Environment [Integrated PowerShell & Bash]\nType `npm i zod` or `npm audit fix --force` to install packages and audit security.\nDrag the terminal top border up/down to resize.', status: 'success', timestamp: Date.now() },
  ]);
  const autoSaveTimerRef = useRef<any>(null);

  const selectFile = useCallback((file: WorkspaceFile) => {
    if (file.isFolder) return;
    setActiveFile(file);
    history.reset(file.content || '');
    setIsDirty(false);
    setInlineGhost(undefined);
    setTabs((prev) => prev.some((t) => t.fileId === file.id) ? prev : [...prev, { id: `tab_${file.id}`, fileId: file.id, fileName: file.name, filePath: file.path, isDirty: false }]);
  }, [history]);

  const handleSave = useCallback(() => {
    setIsDirty(false);
    setTabs((prev) => prev.map((t) => t.fileId === activeFile.id ? { ...t, isDirty: false } : t));
    const updateTree = (list: WorkspaceFile[]): WorkspaceFile[] =>
      list.map((item) => item.id === activeFile.id ? { ...item, content: history.content } : item.children ? { ...item, children: updateTree(item.children) } : item);
    setFiles((prev) => updateTree(prev));
  }, [activeFile.id, history.content]);

  const onEditorChange = useCallback((val: string) => {
    history.pushState(val);
    setIsDirty(true);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      setIsDirty(false);
      setTabs((prev) => prev.map((t) => t.fileId === activeFile.id ? { ...t, isDirty: false } : t));
      const updateTree = (list: WorkspaceFile[]): WorkspaceFile[] =>
        list.map((item) => item.id === activeFile.id ? { ...item, content: val } : item.children ? { ...item, children: updateTree(item.children) } : item);
      setFiles((prev) => updateTree(prev));
    }, 400);
  }, [activeFile.id, history]);

  return {
    files, setFiles, activeFile, selectFile, tabs, setTabs,
    editorContent: history.content, isDirty, setIsDirty,
    onEditorChange,
    onSave: handleSave, onUndo: history.undo, onRedo: history.redo,
    canUndo: history.canUndo, canRedo: history.canRedo,
    settings, updateSettings: (u: Partial<EditorSettings>) => setSettings((s) => ({ ...s, ...u })),
    inlineGhost,
    triggerInlineAi: () => setInlineGhost(getInlineSuggestion(getFileLanguage(activeFile.name), activeFile.name)),
    acceptGhost: () => {
      if (!inlineGhost) return;
      onEditorChange(history.content + '\n' + inlineGhost);
      setInlineGhost(undefined);
    },
    terminalEntries,
    runTerminalCmd: async (cmd: string, shell: string = 'bash') => {
      const pendingId = `term_${Date.now()}`;
      setTerminalEntries((prev) => [
        ...prev,
        { id: pendingId, command: cmd, output: 'Running...', status: 'running', timestamp: Date.now() },
      ]);
      const res = await executeTerminalCommand(cmd, files, activeFile, shell);
      if (res.output === '__CLEAR__') {
        setTerminalEntries([]);
      } else {
        setTerminalEntries((prev) => prev.map((e) => (e.id === pendingId ? res : e)));
      }
    },
    clearTerminal: () => setTerminalEntries([]),
  };
}
