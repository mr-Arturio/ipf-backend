export class TTLCache<T> {
  private cache: Map<string, { value: T; expiry: number }>;
  private ttl: number;

  constructor(ttl: number = 1000 * 60 * 15) {
    this.ttl = ttl;
    this.cache = new Map();
  }

  set(key: string, value: T): void {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (item && Date.now() < item.expiry) {
      return item.value;
    }
    this.cache.delete(key); // clean expired entry
    return null;
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, { expiry }] of this.cache.entries()) {
      if (now >= expiry) {
        this.cache.delete(key);
      }
    }
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
