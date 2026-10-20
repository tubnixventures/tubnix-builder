import { CostTracker } from '../../src/services/costTracker';
import { ModelRegistry } from '../../src/models/modelRegistry';

export function runPipelineTests(): boolean {
  let passed = true;

  // Test 1: Model registry covers all 3 tiers
  const registry = new ModelRegistry();
  const tier1 = registry.getModelForTier('tier1_low_cost');
  const tier2 = registry.getModelForTier('tier2_intermediate');
  const tier3 = registry.getModelForTier('tier3_frontier');

  if (!tier1 || !tier2 || !tier3) {
    console.error('FAIL: Registry missing models for one or more tiers.');
    passed = false;
  }

  // Test 2: Cost tracking & Budget enforcement
  const tracker = new CostTracker({ perTaskCostLimitUsd: 0.05, maxCallsPerTask: 2 });
  tracker.recordUsage(tier1.id, 'tier1', 1000, 500, tier1.inputCostPer1M, tier1.outputCostPer1M, 120);

  let state = tracker.getBudgetState(1, 0.01);
  if (state.isBudgetExceeded) {
    console.error('FAIL: Expected budget within limits');
    passed = false;
  }

  // Exceed max calls
  state = tracker.getBudgetState(3, 0.01);
  if (!state.isBudgetExceeded) {
    console.error('FAIL: Expected budget exceeded after call limit reached.');
    passed = false;
  }

  return passed;
}
