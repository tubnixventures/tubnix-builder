export interface CredentialValidationResult {
  valid: boolean;
  errors?: string[];
}

export function validateCredentials(creds: {
  accountId?: string;
  apiToken?: string;
}): CredentialValidationResult {
  const errors: string[] = [];
  if (!creds.accountId || creds.accountId.length < 12) {
    errors.push('Account ID must be at least 12 characters.');
  }
  if (!creds.apiToken || creds.apiToken.length < 20) {
    errors.push('API Token must be at least 20 characters.');
  }
  return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
}
