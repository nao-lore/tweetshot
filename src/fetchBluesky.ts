import type { TweetData } from './types';

const BLUESKY_URL_RE =
  /bsky\.app\/profile\/([^/]+)\/post\/([a-zA-Z0-9]+)/;

export function isBlueskyUrl(input: string): boolean {
  return BLUESKY_URL_RE.test(input.trim());
}

interface BlueskyProfile {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
}

interface BlueskyPostView {
  uri: string;
  cid: string;
  author: BlueskyProfile;
  record: { text: string; createdAt: string };
  likeCount?: number;
  replyCount?: number;
  embed?: {
    images?: Array<{ fullsize: string }>;
    $type?: string;
  };
}

export async function fetchBlueskyPost(url: string): Promise<TweetData> {
  const match = url.trim().match(BLUESKY_URL_RE);
  if (!match) {
    throw new Error('無効なBluesky URLです');
  }

  const [, handle, rkey] = match;

  // Step 1: Resolve handle to DID via Bluesky public API (CORS enabled)
  const resolveRes = await fetch(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
  );
  if (!resolveRes.ok) {
    throw new Error('Blueskyハンドルを解決できませんでした');
  }
  const { did } = (await resolveRes.json()) as { did: string };

  // Step 2: Fetch post thread using the resolved DID
  const threadUri = `at://${did}/app.bsky.feed.post/${rkey}`;
  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(threadUri)}&depth=0`,
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? 'Blueskyの投稿を取得できませんでした',
    );
  }

  const data = await res.json();
  const post = (data as { thread?: { post?: BlueskyPostView } }).thread
    ?.post as BlueskyPostView | undefined;

  if (!post) {
    throw new Error('Blueskyの投稿データが見つかりません');
  }

  const mediaUrl = post.embed?.images?.[0]?.fullsize;

  return {
    id: rkey,
    text: post.record.text,
    user: {
      name: post.author.displayName ?? post.author.handle,
      screenName: post.author.handle,
      avatarUrl: post.author.avatar ?? '',
      isVerified: false,
    },
    favoriteCount: post.likeCount ?? 0,
    conversationCount: post.replyCount ?? 0,
    createdAt: post.record.createdAt,
    ...(mediaUrl ? { mediaUrl } : {}),
  };
}
