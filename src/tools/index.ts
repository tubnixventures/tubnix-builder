export const defaultToolRegistry = {
  async execute(
    toolName: string,
    args: Record<string, any>,
    context: { workspaceRoot: string; isApprovalGranted?: boolean }
  ): Promise<{ result?: any; error?: string }> {
    if (toolName === 'applyApprovedEdit' && !context.isApprovalGranted) {
      return { error: 'Execution requires user approval for safety.' };
    }
    if (toolName === 'readFile' && (!args.filePath || typeof args.filePath !== 'string')) {
      return { error: 'Input validation error: filePath required.' };
    }
    return { result: `Executed ${toolName} successfully.` };
  },
};
