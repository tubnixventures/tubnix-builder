import { AgentChatMessage } from '../types/contextAttachment';
import { WorkspaceFile } from '../types/ide';
import { isSlashCommand, parseSlashCommand } from '../services/slashCommands';
import { executeSlashCommand } from '../services/slashCommandExecutor';

export function handleSlashCommandOrNull(
  text: string,
  activeFile: WorkspaceFile,
  tokensUsed: number,
  spentUsd: number,
  onCreateFile: (p: string, isF: boolean, c?: string) => void,
  onCompact: () => void
): AgentChatMessage | null {
  if (!isSlashCommand(text)) return null;

  const { cmd, args } = parseSlashCommand(text);
  const result = executeSlashCommand(cmd, args, activeFile, tokensUsed, spentUsd);

  if (result.createFile) {
    onCreateFile(result.createFile.path, false, result.createFile.content);
  }
  if (result.isCompactAction) {
    onCompact();
  }

  return {
    id: `bot_cmd_${Date.now()}`,
    role: 'assistant',
    content: result.output,
    timestamp: Date.now(),
    modelUsed: 'Command CLI',
    category: 'Efficiency',
    suggestedFollowUps: ['/help', '/review', '/cost', '/test'],
  };
}
