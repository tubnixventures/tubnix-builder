import { defaultToolRegistry } from '../../src/tools/index';
import { generateUnifiedDiff } from '../../src/utils/diffGenerator';

export async function runToolsTests(): Promise<boolean> {
  let passed = true;

  // Test 1: Tool execution requires approval when permissionLevel = requires_approval
  const unapproved = await defaultToolRegistry.execute(
    'applyApprovedEdit',
    { changeId: 'non_existent_id' },
    { workspaceRoot: '/app/applet', isApprovalGranted: false }
  );

  if (!unapproved.error?.includes('requires user approval')) {
    console.error('FAIL: Expected requires approval error, got:', unapproved.error);
    passed = false;
  }

  // Test 2: Input schema rejection on invalid args
  const invalidArgs = await defaultToolRegistry.execute(
    'readFile',
    { filePath: '' }, // empty string invalid per schema
    { workspaceRoot: '/app/applet' }
  );

  if (!invalidArgs.error?.includes('validation error')) {
    console.error('FAIL: Expected schema validation error, got:', invalidArgs.error);
    passed = false;
  }

  // Test 3: Diff generator test
  const diff = generateUnifiedDiff('test.ts', 'const x = 1;', 'const x = 2;');
  if (!diff.includes('-const x = 1;') || !diff.includes('+const x = 2;')) {
    console.error('FAIL: Diff generation incorrect:', diff);
    passed = false;
  }

  return passed;
}
