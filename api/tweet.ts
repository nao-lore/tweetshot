export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id || !/^\d+$/.test(id)) {
    return new Response(JSON.stringify({ error: 'Invalid tweet ID' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Try fxtwitter API first (works for all tweets)
  try {
    const fxRes = await fetch(`https://api.fxtwitter.com/status/${id}`, {
      headers: { 'User-Agent': 'TweetShot/1.0' },
    });

    if (fxRes.ok) {
      const fxData = await fxRes.json();
      const tweet = (fxData as { tweet?: Record<string, unknown> }).tweet;
      if (tweet) {
        const author = tweet.author as Record<string, string> | undefined;
        const media = tweet.media as { all?: Array<{ url?: string; thumbnail_url?: string }> } | undefined;
        const result = {
          id_str: String(tweet.id ?? id),
          text: tweet.text ?? '',
          user: {
            name: author?.name ?? '',
            screen_name: author?.screen_name ?? '',
            profile_image_url_https: author?.avatar_url ?? '',
            verified: false,
            is_blue_verified: false,
          },
          favorite_count: Number(tweet.likes ?? 0),
          conversation_count: Number(tweet.replies ?? 0),
          retweet_count: Number(tweet.retweets ?? 0),
          created_at: tweet.created_at ?? '',
          mediaDetails: media?.all?.[0] ? [{ media_url_https: media.all[0].url ?? media.all[0].thumbnail_url ?? '' }] : undefined,
          in_reply_to_status_id_str: tweet.replying_to_status ?? null,
        };
        return new Response(JSON.stringify(result), {
          headers: {
            'content-type': 'application/json',
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
          },
        });
      }
    }
  } catch {
    // Fall through to syndication API
  }

  // Fallback: syndication API (works for older tweets)
  try {
    const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
    const syndicationUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=ja&token=${token}`;
    const res = await fetch(syndicationUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TweetShot/1.0)' },
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const data = await res.text();
        return new Response(data, {
          headers: {
            'content-type': 'application/json',
            'cache-control': 'public, max-age=300',
            'x-content-type-options': 'nosniff',
          },
        });
      }
    }
  } catch {
    // Fall through
  }

  return new Response(
    JSON.stringify({ error: 'Tweet not found' }),
    { status: 404, headers: { 'content-type': 'application/json' } },
  );
}
