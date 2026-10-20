import { validateCredentials } from '../../src/auth/credentialValidator';
import { InMemorySecretStorage, ExtensionSecretStorage } from '../../src/auth/secretStorage';

export async function runAuthTests(): Promise<boolean> {
  let passed = true;

  // Test 1: Credential validation
  const invalidResult = validateCredentials({ accountId: 'short', apiToken: 'short' });
  if (invalidResult.valid) {
    console.error('FAIL: Expected invalid credentials to fail validation.');
    passed = false;
  }

  const validResult = validateCredentials({
    accountId: 'a1b2c3d4e5f6a1b2c3d4e5f6',
    apiToken: 'cf_tok_abcdef1234567890abcdef123456789012345678',
  });
  if (!validResult.valid) {
    console.error('FAIL: Expected valid hex accountId & token to pass:', validResult.errors);
    passed = false;
  }

  // Test 2: SecretStorage isolation
  const mem = new InMemorySecretStorage();
  const extSecrets = new ExtensionSecretStorage(mem);
  await extSecrets.setApiToken('my-secret-token-12345678901234567890');
  const retrieved = await extSecrets.getApiToken();
  if (retrieved !== 'my-secret-token-12345678901234567890') {
    console.error('FAIL: Secret storage did not retrieve stored token.');
    passed = false;
  }

  await extSecrets.deleteApiToken();
  const deleted = await extSecrets.getApiToken();
  if (deleted !== undefined) {
    console.error('FAIL: Secret was not deleted.');
    passed = false;
  }

  return passed;
}
