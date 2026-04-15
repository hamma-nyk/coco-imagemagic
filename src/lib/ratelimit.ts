// lib/ratelimit.ts
import { LRUCache } from 'lru-cache';

const tokenCache = new LRUCache<string, number>({
  max: 500, // Maksimal 500 IP unik yang dilacak
  ttl: 60 * 1000, // Reset data setiap 1 menit
});

export function rateLimit(ip: string, limit: number = 5) {
  const currentUsage = tokenCache.get(ip) || 0;

  if (currentUsage >= limit) {
    return { isLimited: true, remaining: 0 };
  }

  tokenCache.set(ip, currentUsage + 1);
  return { isLimited: false, remaining: limit - (currentUsage + 1) };
}