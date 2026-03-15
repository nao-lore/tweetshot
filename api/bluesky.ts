export const config = { runtime: 'edge' };

const BSKY_API = 'https://public.api.bsky.app/xrpc';

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const handle = url.searchParams.get('handle');
  const rkey = url.searchParams.get('rkey');

  if (!handle || !rkey) {
    return new Response(
      JSON.stringify({ error: 'handleとrkeyは必須パラメータです' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  try {
    // 1. ハンドルからDIDを解決
    const resolveRes = await fetch(
      `${BSKY_API}/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
    );

    if (!resolveRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Blueskyのハンドルを解決できませんでした' }),
        { status: 404, headers: { 'content-type': 'application/json' } },
      );
    }

    const { did } = (await resolveRes.json()) as { did: string };

    // 2. 投稿スレッドを取得
    const uri = `at://${did}/app.bsky.feed.post/${rkey}`;
    const threadRes = await fetch(
      `${BSKY_API}/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}&depth=0`,
    );

    if (!threadRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Blueskyの投稿を取得できませんでした' }),
        { status: 404, headers: { 'content-type': 'application/json' } },
      );
    }

    const data = await threadRes.text();
    return new Response(data, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=300',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Bluesky APIへの接続に失敗しました' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
}
