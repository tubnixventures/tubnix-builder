export type ModelTier = 'tier1_low_cost' | 'tier2_intermediate' | 'tier3_frontier' | string;

export interface ModelMetadata {
  id: string;
  displayName: string;
  vendor: string;
  tier: string;
  contextWindow: number;
  maxOutputTokens: number;
  supportsStreaming: boolean;
  supportsTools: boolean;
  inputCostPer1M: number;
  outputCostPer1M: number;
  isAvailable: boolean;
  reasoningStrength?: number;
  recommendedUse?: string;
}

export interface AiModel {
  id: string;
  name: string;
  tier: ModelTier;
  description?: string;
  inputCostPer1M?: number;
  outputCostPer1M?: number;
  speedScore?: number;
  contextWindow?: number;
}
