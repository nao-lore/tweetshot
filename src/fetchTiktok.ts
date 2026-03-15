import type { TweetData } from './types';

const TIKTOK_URL_RE =
  /tiktok\.com\/@([^/]+)\/video\/(\d+)/;
const TIKTOK_SHORT_RE = /vm\.tiktok\.com\/([a-zA-Z0-9]+)/;

export function isTiktokUrl(input: string): boolean {
  const trimmed = input.trim();
  return TIKTOK_URL_RE.test(trimmed) || TIKTOK_SHORT_RE.test(trimmed);
}

interface OEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url?: string;
}

export async function fetchTiktokPost(url: string): Promise<TweetData> {
  const trimmed = url.trim();

  if (!isTiktokUrl(trimmed)) {
    throw new Error('無効なTikTok URLです');
  }

  // Extract video ID if possible, otherwise use the URL as-is
  const longMatch = trimmed.match(TIKTOK_URL_RE);
  const videoId = longMatch?.[2] ?? trimmed;

  // Use the proxy endpoint
  const proxyUrl = `/api/tiktok?url=${encodeURIComponent(trimmed)}`;
  const res = await fetch(proxyUrl);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? 'TikTokの投稿を取得できませんでした',
    );
  }

  const data = (await res.json()) as OEmbedResponse;

  // Extract screen name from author_url (https://www.tiktok.com/@username)
  const screenNameMatch = data.author_url?.match(/@([^/?]+)/);
  const screenName = screenNameMatch?.[1] ?? data.author_name;

  return {
    id: videoId,
    text: data.title ?? '',
    user: {
      name: data.author_name ?? '',
      screenName,
      avatarUrl: data.thumbnail_url ?? '',
      isVerified: false,
    },
    favoriteCount: 0,
    conversationCount: 0,
    createdAt: '',
    ...(data.thumbnail_url ? { mediaUrl: data.thumbnail_url } : {}),
  };
}
