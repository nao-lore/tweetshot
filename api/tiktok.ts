export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const reqUrl = new URL(req.url);
  const tiktokUrl = reqUrl.searchParams.get('url');

  if (!tiktokUrl) {
    return new Response(
      JSON.stringify({ error: 'urlパラメータは必須です' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  // URLの基本バリデーション（プロトコル付きで厳密チェック）
  if (
    !/^https?:\/\/(www\.)?tiktok\.com\//.test(tiktokUrl) &&
    !/^https?:\/\/vm\.tiktok\.com\//.test(tiktokUrl)
  ) {
    return new Response(
      JSON.stringify({ error: 'Invalid TikTok URL' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  try {
    const oembedRes = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`,
    );

    if (!oembedRes.ok) {
      return new Response(
        JSON.stringify({ error: 'TikTokの投稿を取得できませんでした' }),
        { status: 404, headers: { 'content-type': 'application/json' } },
      );
    }

    const data = await oembedRes.text();
    return new Response(data, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=300',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'TikTok APIへの接続に失敗しました' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
}
