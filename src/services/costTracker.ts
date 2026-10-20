export class CostTracker {
  private totalCalls = 0;
  private totalCost = 0;
  constructor(private limits: { perTaskCostLimitUsd: number; maxCallsPerTask: number }) {}

  recordUsage(
    _modelId: string,
    _tier: string,
    _inTokens: number,
    _outTokens: number,
    _inCost: number,
    _outCost: number,
    _lat: number
  ) {
    this.totalCalls++;
  }

  getBudgetState(calls: number, cost: number) {
    const isBudgetExceeded =
      calls >= this.limits.maxCallsPerTask || cost >= this.limits.perTaskCostLimitUsd;
    return { isBudgetExceeded, totalCost: this.totalCost };
  }
}
