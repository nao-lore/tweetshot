export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const text = url.searchParams.get('text');
  const to = url.searchParams.get('to');

  if (!text || !to) {
    return new Response(
      JSON.stringify({ error: 'パラメータが不足しています（text, to）' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  const validLangs = ['ja', 'en', 'ko', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'pt'];
  if (!validLangs.includes(to)) {
    return new Response(
      JSON.stringify({ error: 'サポートされていない言語コードです' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  const apiUrl =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TweetShot/1.0)',
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: '翻訳APIへのリクエストに失敗しました' }),
        { status: 502, headers: { 'content-type': 'application/json' } },
      );
    }

    const data = await res.json();

    // Google Translate returns nested arrays: [[["translated","original",...],...],...]
    const translated = (data[0] as Array<[string, ...unknown[]]>)
      .map((segment: [string, ...unknown[]]) => segment[0])
      .join('');

    return new Response(
      JSON.stringify({ translated }),
      {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'public, max-age=3600',
        },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: '翻訳処理中にエラーが発生しました' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
}
