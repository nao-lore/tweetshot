import type { TweetData } from './types';

export async function fetchTweet(id: string): Promise<TweetData> {
  const res = await fetch(`/api/tweet?id=${id}`);

  if (!res.ok) {
    throw new Error('ツイートの取得に失敗しました');
  }

  const data = await res.json();

  if (!data.text) {
    throw new Error('ツイートが見つかりませんでした');
  }

  return {
    id: data.id_str ?? id,
    text: data.text,
    user: {
      name: data.user?.name ?? '',
      screenName: data.user?.screen_name ?? '',
      avatarUrl: data.user?.profile_image_url_https?.replace('_normal', '_200x200') ?? '',
      isVerified: data.user?.verified ?? data.user?.is_blue_verified ?? false,
    },
    favoriteCount: data.favorite_count ?? 0,
    conversationCount: data.conversation_count ?? 0,
    createdAt: data.created_at ?? '',
    mediaUrl: data.mediaDetails?.[0]?.media_url_https,
  };
}
