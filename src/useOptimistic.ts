import { useState, useEffect } from 'react';
import { parsePostUrl } from './parseUrl';
import type { Platform } from './parseUrl';

interface UrlStatus {
  valid: boolean;
  platform: Platform | null;
  hint: string;
}

export function useUrlStatus(url: string): UrlStatus {
  const [status, setStatus] = useState<UrlStatus>({ valid: false, platform: null, hint: '' });

  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setStatus({ valid: false, platform: null, hint: '' });
      return;
    }

    const parsed = parsePostUrl(trimmed);
    if (parsed) {
      const platformNames: Record<Platform, string> = {
        twitter: 'Twitter/X',
        bluesky: 'Bluesky',
        tiktok: 'TikTok',
      };
      setStatus({ valid: true, platform: parsed.platform, hint: `${platformNames[parsed.platform]}の投稿を検出` });
    } else {
      // Check if partially valid
      if (trimmed.includes('twitter.com') || trimmed.includes('x.com')) {
        setStatus({ valid: false, platform: null, hint: 'ツイートURLの形式を確認してください' });
      } else if (trimmed.includes('bsky.app')) {
        setStatus({ valid: false, platform: null, hint: 'Bluesky URLの形式を確認してください' });
      } else if (trimmed.includes('tiktok.com')) {
        setStatus({ valid: false, platform: null, hint: 'TikTok URLの形式を確認してください' });
      } else {
        setStatus({ valid: false, platform: null, hint: '' });
      }
    }
  }, [url]);

  return status;
}
