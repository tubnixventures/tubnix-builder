import { useState } from 'react';
import { ModelTier } from '../../types/models';
import { WorkspaceFile } from '../types/ide';
import { categorizeAndSelectModel } from '../services/modelRouter';
import { AttachedContextItem, AgentChatMessage } from '../types/contextAttachment';
import { runAgenticLoop } from '../services/agentLoopEngine';
import { ToolContext } from '../services/agentToolExecutor';

interface AgentStateCallbacks {
  activeFile: WorkspaceFile;
  files: WorkspaceFile[];
  onCreateStandaloneFile: (name: string, isFolder: boolean, content?: string) => void;
  onApplyEditorCode: (newCode: string) => void;
  onAppendTerminal: (cmd: string, out: string) => void;
  onCreateCheckpoint?: (label: string) => void;
}

export function useAgentState(cb: AgentStateCallbacks) {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: 'VS Code AI Agent initialized. Full terminal command execution, real npm package installer, powershell integration, and codebase tools active.',
      timestamp: Date.now(),
      category: 'Frontier',
      modelUsed: 'Claude 3.7 Opus',
      suggestedFollowUps: ['Run tests ($ npm test)', 'Install package ($ npm i zod)', 'Audit dependencies ($ npm audit fix --force)', 'List files ($ Get-ChildItem)'],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [tokensUsed, setTokensUsed] = useState(4120);
  const [spentUsd, setSpentUsd] = useState(0.0038);
  const [attachedContext, setAttachedContext] = useState<AttachedContextItem[]>([]);

  const sendMessage = async (text: string, manualTier?: ModelTier) => {
    if (!text.trim() || isLoading) return;
    const userMsg: AgentChatMessage = { id: `u_${Date.now()}`, role: 'user', content: text, text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setProgressStep('Analyzing workspace context & selecting model tier...');
    setProgressPercent(25);

    cb.onCreateCheckpoint?.(`Auto-checkpoint before: "${text.slice(0, 30)}..."`);
    const route = categorizeAndSelectModel(text, manualTier);

    setTimeout(async () => {
      setProgressStep(`Executing agentic loop on ${route.model.name}...`);
      setProgressPercent(65);
      const toolCtx: ToolContext = {
        files: cb.files,
        activeFile: cb.activeFile,
        onUpdateFileContent: (_p, code) => cb.onApplyEditorCode(code),
        onCreateFile: (p, isF, c) => cb.onCreateStandaloneFile(p, isF, c),
        onAppendTerminal: (cmd, out) => cb.onAppendTerminal(cmd, out),
      };
      const loopResult = await runAgenticLoop(text, toolCtx);
      const replyContent = `[${route.category.toUpperCase()} AGENT: ${route.model.name.toUpperCase()}]\nAutonomous workflow completed for "${cb.activeFile.name}":\n✔ ${route.reasoning}\n✔ ${loopResult.summary}\nRate: $${route.model.inputCostPer1M}/1M tokens (${route.estimatedSavings}).`;
      const botMsg: AgentChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        text: replyContent,
        timestamp: Date.now(),
        category: route.category,
        modelUsed: route.model.name,
        suggestedFollowUps: route.suggestedFollowUps,
        toolCalls: loopResult.toolCalls,
        diffs: loopResult.diffs,
        selfHealed: loopResult.selfHealed,
      };
      setMessages((prev) => [...prev, botMsg]);
      setTokensUsed((t) => t + 950);
      setSpentUsd((s) => s + (route.model.inputCostPer1M * 950) / 1_000_000);
      setIsLoading(false);
      setProgressStep('');
      setProgressPercent(0);
    }, 300);
  };

  return {
    messages, isLoading, progressStep, progressPercent, tokensUsed, spentUsd,
    attachedContext,
    attachItem: (item: AttachedContextItem) => setAttachedContext((prev) => prev.some((i) => i.id === item.id) ? prev : [...prev, item]),
    removeItem: (id: string) => setAttachedContext((prev) => prev.filter((i) => i.id !== id)),
    sendMessage,
    undoEdit: (msgId: string) => setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, isUndone: true } : m)),
    redoEdit: (msgId: string) => setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, isUndone: false } : m)),
  };
}
