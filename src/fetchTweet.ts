import type { TweetData } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTweetData(data: any, id: string): TweetData {
  // fxtwitter direct format (dev proxy)
  if (data.tweet) {
    const t = data.tweet;
    return {
      id: String(t.id ?? id),
      text: t.text ?? '',
      user: {
        name: t.author?.name ?? '',
        screenName: t.author?.screen_name ?? '',
        avatarUrl: t.author?.avatar_url ?? '',
        isVerified: false,
      },
      favoriteCount: t.likes ?? 0,
      conversationCount: t.replies ?? 0,
      createdAt: t.created_at ?? '',
      mediaUrl: t.media?.all?.[0]?.url ?? t.media?.all?.[0]?.thumbnail_url,
    };
  }

  // Edge function normalized format (production) / syndication format
  return {
    id: data.id_str ?? id,
    text: data.text ?? '',
    user: {
      name: data.user?.name ?? '',
      screenName: data.user?.screen_name ?? '',
      avatarUrl: (data.user?.profile_image_url_https ?? '').replace('_normal', '_200x200'),
      isVerified: data.user?.verified ?? data.user?.is_blue_verified ?? false,
    },
    favoriteCount: data.favorite_count ?? 0,
    conversationCount: data.conversation_count ?? 0,
    createdAt: data.created_at ?? '',
    mediaUrl: data.mediaDetails?.[0]?.media_url_https,
  };
}

export async function fetchTweet(id: string): Promise<TweetData> {
  const res = await fetch(`/api/tweet?id=${id}`);

  if (!res.ok) {
    throw new Error('ツイートの取得に失敗しました');
  }

  const data = await res.json();

  // Check if we got valid data
  const text = data.text ?? data.tweet?.text;
  if (!text) {
    throw new Error('ツイートが見つかりませんでした');
  }

  return parseTweetData(data, id);
}

// Export raw fetch for thread support
export async function fetchTweetRaw(id: string): Promise<{ in_reply_to_status_id_str?: string | null }> {
  const res = await fetch(`/api/tweet?id=${id}`);
  if (!res.ok) throw new Error('ツイートの取得に失敗しました');
  const data = await res.json();
  // Handle both formats
  return {
    in_reply_to_status_id_str: data.in_reply_to_status_id_str ?? data.tweet?.replying_to_status ?? null,
  };
}
