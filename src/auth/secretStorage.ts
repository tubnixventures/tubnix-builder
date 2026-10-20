export class InMemorySecretStorage {
  private store = new Map<string, string>();
  async get(key: string): Promise<string | undefined> {
    return this.store.get(key);
  }
  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export class ExtensionSecretStorage {
  constructor(private storage: InMemorySecretStorage) {}
  async getApiToken(): Promise<string | undefined> {
    return this.storage.get('cf_api_token');
  }
  async setApiToken(token: string): Promise<void> {
    await this.storage.set('cf_api_token', token);
  }
  async deleteApiToken(): Promise<void> {
    await this.storage.delete('cf_api_token');
  }
}
