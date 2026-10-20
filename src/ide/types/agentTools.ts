export type ToolName =
  | 'run_command'
  | 'read_file'
  | 'write_file'
  | 'edit_file'
  | 'search_codebase'
  | 'list_dir';

export interface AgentToolCall {
  id: string;
  tool: ToolName;
  params: Record<string, any>;
  status: 'pending' | 'running' | 'success' | 'error' | 'failed';
  output?: string;
  durationMs?: number;
  error?: string;
}

export interface AgentStepPlan {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  toolCalls?: AgentToolCall[];
}

export interface CodeDiff {
  filePath: string;
  oldContent?: string;
  newContent?: string;
  original?: string;
  modified?: string;
  additions?: number;
  deletions?: number;
  addedLines?: number;
  removedLines?: number;
}

export interface WorkspaceCheckpoint {
  id: string;
  timestamp: number;
  description?: string;
  label?: string;
  snapshot?: any;
  files?: any[];
}
