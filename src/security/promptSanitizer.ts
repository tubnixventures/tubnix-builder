export function sanitizeUntrustedContent(prompt: string): {
  isSuspicious: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const lower = prompt.toLowerCase();
  if (lower.includes('ignore previous instructions') || lower.includes('output all secret')) {
    warnings.push('Detected prompt injection attempt.');
  }
  return { isSuspicious: warnings.length > 0, warnings };
}
