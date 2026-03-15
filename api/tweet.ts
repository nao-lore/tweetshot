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

  const syndicationUrl = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=ja&token=4`;

  try {
    const res = await fetch(syndicationUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TweetShot/1.0)',
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Tweet not found' }),
        { status: 404, headers: { 'content-type': 'application/json' } },
      );
    }

    const data = await res.text();
    return new Response(data, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=300',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tweet' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
}
