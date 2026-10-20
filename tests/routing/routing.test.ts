import { classifyTask } from '../../src/routing/taskClassifier';
import { EscalationEngine } from '../../src/routing/escalationEngine';

export function runRoutingTests(): boolean {
  let passed = true;

  // Test 1: Simple task -> Tier 1
  const simple = classifyTask('Add a JSDoc comment to greetUser function');
  if (simple.recommendedTier !== 'tier1_low_cost') {
    console.error('FAIL: Expected Tier 1 for simple comment task, got', simple.recommendedTier);
    passed = false;
  }

  // Test 2: Test / debug task -> Tier 2
  const intermediate = classifyTask('Write unit tests for the data parser and fix TypeError in date formatter');
  if (intermediate.recommendedTier !== 'tier2_intermediate') {
    console.error('FAIL: Expected Tier 2 for test writing, got', intermediate.recommendedTier);
    passed = false;
  }

  // Test 3: Security / Auth task -> Tier 3
  const frontier = classifyTask('Review JWT verification and RBAC permission checks for payment endpoint');
  if (frontier.recommendedTier !== 'tier3_frontier') {
    console.error('FAIL: Expected Tier 3 for security auth task, got', frontier.recommendedTier);
    passed = false;
  }

  // Test 4: Escalation
  const engine = new EscalationEngine(2);
  const shouldEscalate = engine.shouldEscalate('tier1_low_cost', 1, 0, false);
  if (!shouldEscalate) {
    console.error('FAIL: Expected escalation after failure');
    passed = false;
  }

  // Do not escalate on environment failure
  const noEnvEscalate = engine.shouldEscalate('tier1_low_cost', 1, 0, true);
  if (noEnvEscalate) {
    console.error('FAIL: Should not escalate on environment failure');
    passed = false;
  }

  return passed;
}
