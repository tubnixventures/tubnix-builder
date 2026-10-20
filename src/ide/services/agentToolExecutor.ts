import { WorkspaceFile } from '../types/ide';
import { AgentToolCall } from '../types/agentTools';
import { executeTerminalCommand } from './terminalRunner';
import { flattenFiles } from './importLinkResolver';
import { searchWorkspace } from './workspaceSearch';

export interface ToolContext {
  files: WorkspaceFile[];
  activeFile: WorkspaceFile;
  onUpdateFileContent: (path: string, content: string) => void;
  onCreateFile: (path: string, isFolder: boolean, content?: string) => void;
  onAppendTerminal: (cmd: string, out: string) => void;
}

export async function executeAgentTool(tool: AgentToolCall, ctx: ToolContext): Promise<AgentToolCall> {
  const start = Date.now();
  try {
    if (tool.tool === 'run_command') {
      const cmd = tool.params.command || '';
      const res = await executeTerminalCommand(cmd, ctx.files, ctx.activeFile);
      ctx.onAppendTerminal(cmd, res.output);
      return { ...tool, status: res.status === 'error' ? 'failed' : 'success', output: res.output, durationMs: Date.now() - start };
    }
    if (tool.tool === 'read_file') {
      const p = tool.params.path || '';
      const flat = flattenFiles(ctx.files);
      const file = flat.find((f) => f.path === p || f.name === p || (f.path && f.path.endsWith(p)));
      if (!file) throw new Error(`File not found: ${p}`);
      return { ...tool, status: 'success', output: file.content || '', durationMs: Date.now() - start };
    }
    if (tool.tool === 'write_file') {
      const p = tool.params.path || '';
      const content = tool.params.content || '';
      ctx.onCreateFile(p, false, content);
      return { ...tool, status: 'success', output: `Wrote ${content.length} bytes to ${p}`, durationMs: Date.now() - start };
    }
    if (tool.tool === 'edit_file') {
      const p = tool.params.path || '';
      const flat = flattenFiles(ctx.files);
      const file = flat.find((f) => f.path === p || f.name === p);
      if (!file) throw new Error(`File not found to edit: ${p}`);
      const oldStr = tool.params.oldString || '';
      const newStr = tool.params.newString || '';
      const content = file.content || '';
      if (!content.includes(oldStr)) throw new Error(`Target text to replace not found in ${p}`);
      const updated = content.replace(oldStr, newStr);
      ctx.onUpdateFileContent(file.path || p, updated);
      return { ...tool, status: 'success', output: `Successfully edited ${p}`, durationMs: Date.now() - start };
    }
    if (tool.tool === 'search_codebase') {
      const q = tool.params.query || '';
      const matches = searchWorkspace(q, ctx.files);
      const formatted = matches.map((m) => `${m.filePath}:${m.line} -> ${m.lineContent}`).join('\n');
      return { ...tool, status: 'success', output: formatted || 'No matches found', durationMs: Date.now() - start };
    }
    if (tool.tool === 'list_dir') {
      const flat = flattenFiles(ctx.files);
      const list = flat.map((f) => `${f.path || f.name} (${(f.content || '').length} bytes)`).join('\n');
      return { ...tool, status: 'success', output: list, durationMs: Date.now() - start };
    }
    throw new Error(`Unknown tool: ${tool.tool}`);
  } catch (err: any) {
    return { ...tool, status: 'failed', error: err.message, durationMs: Date.now() - start };
  }
}
