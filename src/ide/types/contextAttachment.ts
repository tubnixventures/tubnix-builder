import { AgentToolCall, CodeDiff } from './agentTools';

export interface AttachedContextItem {
  id: string;
  type: 'file' | 'selection' | 'terminal';
  name: string;
  content: string;
  isFolder?: boolean;
  path?: string;
}

export interface AgentChatMessage {
  id: string;
  role?: 'user' | 'agent' | 'system' | 'assistant';
  sender?: 'user' | 'agent' | 'system';
  text?: string;
  content?: string;
  timestamp: number;
  toolCalls?: AgentToolCall[];
  diff?: CodeDiff;
  diffs?: CodeDiff[];
  appliedDiff?: any;
  isUndone?: boolean;
  selfHealed?: boolean;
  suggestedFollowUps?: string[];
  isError?: boolean;
  modelUsed?: string;
  category?: string;
}
