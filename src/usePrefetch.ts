import { useRef, useEffect, useCallback } from 'react';
import { parsePostUrl, fetchPost } from './parseUrl';
import type { TweetData } from './types';

export function usePrefetch(url: string) {
  const cacheRef = useRef<Map<string, TweetData>>(new Map());
  const pendingRef = useRef<string | null>(null);

  useEffect(() => {
    const parsed = parsePostUrl(url.trim());
    if (!parsed) return;

    const cacheKey = `${parsed.platform}:${parsed.id}`;
    if (cacheRef.current.has(cacheKey)) return;
    if (pendingRef.current === cacheKey) return;

    // Debounce: wait 800ms before prefetching
    const timer = setTimeout(async () => {
      pendingRef.current = cacheKey;
      try {
        const data = await fetchPost(url.trim());
        cacheRef.current.set(cacheKey, data);
      } catch {
        // Silently fail - this is just prefetch
      } finally {
        pendingRef.current = null;
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [url]);

  const getCached = useCallback((inputUrl: string): TweetData | null => {
    const parsed = parsePostUrl(inputUrl.trim());
    if (!parsed) return null;
    const cacheKey = `${parsed.platform}:${parsed.id}`;
    return cacheRef.current.get(cacheKey) ?? null;
  }, []);

  return { getCached };
}
