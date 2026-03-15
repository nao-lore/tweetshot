import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { TweetData } from './types';
import { parseTweetId } from './parseTweetUrl';
import { fetchTweet } from './fetchTweet';

interface Props {
  onResults: (tweets: TweetData[]) => void;
}

async function fetchWithConcurrency(
  ids: string[],
  concurrency: number,
  onProgress: (done: number, total: number) => void,
): Promise<TweetData[]> {
  const results: TweetData[] = [];
  let nextIndex = 0;
  let completed = 0;
  const total = ids.length;

  async function worker() {
    while (nextIndex < ids.length) {
      const idx = nextIndex++;
      try {
        const tweet = await fetchTweet(ids[idx]);
        results.push(tweet);
      } catch {
        // Skip failed tweets
      }
      completed++;
      onProgress(completed, total);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, ids.length) }, () => worker());
  await Promise.all(workers);

  return results;
}

export function BulkProcessor({ onResults }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBulkFetch() {
    const lines = input
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const ids = lines
      .map((line) => parseTweetId(line))
      .filter((id): id is string => id !== null);

    if (ids.length === 0) {
      setError('有効なツイートURLが見つかりませんでした');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress({ done: 0, total: ids.length });

    try {
      const tweets = await fetchWithConcurrency(ids, 3, (done, total) => {
        setProgress({ done, total });
      });

      if (tweets.length === 0) {
        setError('ツイートを取得できませんでした');
      } else {
        onResults(tweets);
      }
    } catch {
      setError('一括取得中にエラーが発生しました');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }

  return (
    <div style={{
      background: '#1e1e1e',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <label style={{ color: '#aaa', fontSize: '13px' }}>
        一括取得（1行に1つのURLを入力）
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`https://x.com/user/status/123...\nhttps://x.com/user/status/456...\nhttps://x.com/user/status/789...`}
        rows={6}
        style={{
          background: '#2a2a2a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '12px',
          color: '#e0e0e0',
          fontSize: '14px',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
        disabled={loading}
      />

      {error && (
        <div style={{ color: '#f5576c', fontSize: '13px' }}>{error}</div>
      )}

      <button
        className="btn primary"
        onClick={handleBulkFetch}
        disabled={loading || !input.trim()}
        type="button"
        style={{ alignSelf: 'flex-start' }}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="spin" />
            {progress ? `${progress.done}/${progress.total} 取得中...` : '取得中...'}
          </>
        ) : (
          '一括取得'
        )}
      </button>
    </div>
  );
}
