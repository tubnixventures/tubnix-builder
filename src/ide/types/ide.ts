export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'python'
  | 'rust'
  | 'go'
  | 'sql'
  | 'shell'
  | 'plaintext';

export interface WorkspaceFile {
  id: string;
  name: string;
  content?: string;
  isFolder?: boolean;
  isOpen?: boolean;
  children?: WorkspaceFile[];
  path?: string;
}

export interface EditorTab {
  id?: string;
  title?: string;
  fileName?: string;
  filePath?: string;
  fileId: string;
  isDirty?: boolean;
}

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'failed';
  timestamp: number;
  durationMs?: number;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off' | boolean;
  theme: string;
  minimap?: boolean;
  showMinimap?: boolean;
  autoSave?: boolean;
  lineNumbers?: boolean;
  showLineNumbers?: boolean;
  fontFamily?: string;
  inlineAiEnabled?: boolean;
}
