import type { TweetData } from './types';
import { fetchTweet } from './fetchTweet';
import { isBlueskyUrl, fetchBlueskyPost } from './fetchBluesky';
import { isTiktokUrl, fetchTiktokPost } from './fetchTiktok';

export type Platform = 'twitter' | 'bluesky' | 'tiktok';

export interface ParsedPost {
  platform: Platform;
  id: string;
  url: string;
}

/**
 * URLまたはIDから投稿プラットフォームを判定してパースする
 */
export function parsePostUrl(input: string): ParsedPost | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Twitter: plain ID
  if (/^\d+$/.test(trimmed)) {
    return { platform: 'twitter', id: trimmed, url: trimmed };
  }

  // Twitter: URL
  const twitterMatch = trimmed.match(
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
  );
  if (twitterMatch) {
    return { platform: 'twitter', id: twitterMatch[1], url: trimmed };
  }

  // Bluesky
  if (isBlueskyUrl(trimmed)) {
    const bskyMatch = trimmed.match(
      /bsky\.app\/profile\/([^/]+)\/post\/([a-zA-Z0-9]+)/,
    );
    const rkey = bskyMatch?.[2] ?? '';
    return { platform: 'bluesky', id: rkey, url: trimmed };
  }

  // TikTok
  if (isTiktokUrl(trimmed)) {
    const longMatch = trimmed.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    const shortMatch = trimmed.match(/vm\.tiktok\.com\/([a-zA-Z0-9]+)/);
    const id = longMatch?.[1] ?? shortMatch?.[1] ?? '';
    return { platform: 'tiktok', id, url: trimmed };
  }

  return null;
}

/**
 * URLを自動判定して適切なフェッチャーで投稿データを取得する
 */
export async function fetchPost(input: string): Promise<TweetData> {
  const parsed = parsePostUrl(input);

  if (!parsed) {
    throw new Error('サポートされていないURLまたはIDです');
  }

  switch (parsed.platform) {
    case 'twitter':
      return fetchTweet(parsed.id);
    case 'bluesky':
      return fetchBlueskyPost(parsed.url);
    case 'tiktok':
      return fetchTiktokPost(parsed.url);
  }
}
