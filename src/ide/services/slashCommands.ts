export interface SlashCommandDef {
  command: string;
  description: string;
  usage: string;
}

export const SLASH_COMMANDS: SlashCommandDef[] = [
  { command: '/help', description: 'Show all available Claude Code & Codex slash commands', usage: '/help' },
  { command: '/review', description: 'Run comprehensive security, AST & performance code review on active file', usage: '/review' },
  { command: '/fix', description: 'Inspect compiler diagnostics and auto-heal active errors', usage: '/fix' },
  { command: '/compact', description: 'Compact conversation history into high-density context', usage: '/compact' },
  { command: '/cost', description: 'View detailed token consumption, model rates and budget ledger', usage: '/cost' },
  { command: '/init', description: 'Generate AGENTS.md / CLAUDE.md repository guidelines file', usage: '/init' },
  { command: '/test', description: 'Execute full test suite with self-healing verification', usage: '/test' },
  { command: '/model', description: 'Inspect active model ladder and latency routing tier', usage: '/model' },
];

export function isSlashCommand(input: string): boolean {
  return input.trim().startsWith('/');
}

export function parseSlashCommand(input: string): { cmd: string; args: string } {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');
  return { cmd, args };
}
