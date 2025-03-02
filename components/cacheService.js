// services/cacheService.js
// Create a shared cache that can be imported by both API routes

// Using a global variable to ensure the same instance is used across imports
// In Node.js, each module is cached after the first time it's loaded
let globalCache;

class CacheStore {
  constructor() {
    // Only create a new Map if one doesn't already exist
    this.cache = new Map();
  }

  set(key, value) {
    console.log(`Setting cache for key: ${key}`);
    this.cache.set(key, value);
    
    // Debug: log all keys in cache after setting
    console.log(`Cache now contains keys: ${Array.from(this.cache.keys()).join(', ')}`);
  }

  get(key) {
    const result = this.cache.get(key);
    console.log(`Getting cache for key: ${key}, found: ${!!result}`);
    return result;
  }

  delete(key) {
    this.cache.delete(key);
  }

  entries() {
    return this.cache.entries();
  }

  // Clean old entries (utility method)
  cleanOldEntries(maxAgeMs = 3600000) { // Default: 1 hour
    const cutoffTime = Date.now() - maxAgeMs;
    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < cutoffTime) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a singleton instance, or use the existing one
if (!globalCache) {
  globalCache = new CacheStore();
  console.log('Created new CacheStore instance');
} else {
  console.log('Reusing existing CacheStore instance');
}

const searchCache = globalCache;

// Export the singleton instance
export default searchCache;