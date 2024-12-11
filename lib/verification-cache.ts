class VerificationCache {
    private cache: Map<string, { url: string; timestamp: number }>;
    private readonly TTL = 5 * 60 * 1000; // 5 minutes
  
    constructor() {
      this.cache = new Map();
    }
  
    set(email: string, url: string) {
      this.cleanup();
      this.cache.set(email, {
        url,
        timestamp: Date.now(),
      });
    }
  
    get(email: string): string | null {
      this.cleanup();
      const entry = this.cache.get(email);
      if (!entry) return null;
      
      if (Date.now() - entry.timestamp > this.TTL) {
        this.cache.delete(email);
        return null;
      }
      
      return entry.url;
    }
  
    private cleanup() {
      const now = Date.now();
      // Convert to array first
      Array.from(this.cache.keys()).forEach(email => {
        const entry = this.cache.get(email);
        if (entry && now - entry.timestamp > this.TTL) {
          this.cache.delete(email);
        }
      });
    }
  }
  
  export const verificationCache = new VerificationCache(); 