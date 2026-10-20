import { runAuthTests } from './auth/auth.test';
import { runRoutingTests } from './routing/routing.test';
import { runSecurityTests } from './security/security.test';
import { runToolsTests } from './tools/tools.test';
import { runPipelineTests } from './integration/pipeline.test';

export async function executeAllSuites(): Promise<{ passed: boolean; count: number }> {
  console.log('--- Starting VS Code AI Agent Test Suite ---');
  let allPassed = true;

  const authOk = await runAuthTests();
  console.log(`[Suite: Auth] ${authOk ? 'PASS' : 'FAIL'}`);
  allPassed = allPassed && authOk;

  const routingOk = runRoutingTests();
  console.log(`[Suite: Routing & Escalation] ${routingOk ? 'PASS' : 'FAIL'}`);
  allPassed = allPassed && routingOk;

  const secOk = runSecurityTests();
  console.log(`[Suite: Security & Redaction] ${secOk ? 'PASS' : 'FAIL'}`);
  allPassed = allPassed && secOk;

  const toolsOk = await runToolsTests();
  console.log(`[Suite: Tools & Permissions] ${toolsOk ? 'PASS' : 'FAIL'}`);
  allPassed = allPassed && toolsOk;

  const pipeOk = runPipelineTests();
  console.log(`[Suite: Pipeline & Budget] ${pipeOk ? 'PASS' : 'FAIL'}`);
  allPassed = allPassed && pipeOk;

  return { passed: allPassed, count: 5 };
}

if (process.argv[1] && process.argv[1].includes('runAllTests')) {
  executeAllSuites().then(({ passed }) => {
    if (!passed) {
      console.error('FAILED: One or more test suites failed.');
      process.exit(1);
    } else {
      console.log('SUCCESS: All test suites executed and passed!');
      process.exit(0);
    }
  });
}
