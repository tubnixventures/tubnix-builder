import { ModelTier } from './models';

export type TaskComplexity = 'trivial' | 'simple' | 'moderate' | 'complex' | 'expert' | string;
export type SecurityRiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export interface TaskClassification {
  complexity?: TaskComplexity;
  complexityScore?: number;
  securityRisk?: SecurityRiskLevel;
  reasoningDepth?: string;
  requiresMultiFile?: boolean;
  isAuthOrPaymentRelated?: boolean;
  recommendedTier: ModelTier;
  selectedModelName?: string;
  costPer1MInput?: number;
  estimatedSavingsPercent?: number;
  confidence?: number;
  reasoning?: string;
}
