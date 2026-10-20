export class EscalationEngine {
  constructor(public maxRetries: number = 2) {}

  shouldEscalate(
    currentTier: string,
    failureCount: number,
    retryCount: number,
    isEnvFailure: boolean
  ): boolean {
    if (isEnvFailure) return false;
    if (failureCount > 0) return true;
    return retryCount >= this.maxRetries;
  }
}
