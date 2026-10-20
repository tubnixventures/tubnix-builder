export class ModelRegistry {
  getModelForTier(tier: string) {
    return {
      id: `${tier}-default`,
      inputCostPer1M: 0.1,
      outputCostPer1M: 0.2,
    };
  }
}
