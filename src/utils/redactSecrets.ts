export function redactSecrets(text: string): { sanitizedText: string; redactedCount: number } {
  const tokenRegex = /(cf_tok_[a-zA-Z0-9_-]+)/g;
  let count = 0;
  const sanitized = text.replace(tokenRegex, (match) => {
    count++;
    return `[REDACTED_SECRET_${match.slice(0, 7)}***]`;
  });
  return { sanitizedText: sanitized, redactedCount: count };
}
