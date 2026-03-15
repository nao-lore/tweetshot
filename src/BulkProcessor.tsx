import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { TweetData } from './types';
import { parsePostUrl, fetchPost } from './parseUrl';
import { useI18n } from './i18n';

interface Props {
  onResults: (tweets: TweetData[]) => void;
}

async function fetchWithConcurrency(
  urls: string[],
  concurrency: number,
  onProgress: (done: number, total: number) => void,
): Promise<TweetData[]> {
  const results: (TweetData | undefined)[] = new Array(urls.length);
  let nextIndex = 0;
  let completed = 0;
  let lastUpdate = 0;
  const total = urls.length;

  async function worker() {
    while (nextIndex < urls.length) {
      const idx = nextIndex++;
      try {
        const post = await fetchPost(urls[idx]);
        results[idx] = post;
      } catch {
        // Skip failed posts
      }
      completed++;
      const now = Date.now();
      if (now - lastUpdate > 200 || completed === total) {
        onProgress(completed, total);
        lastUpdate = now;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () => worker());
  await Promise.all(workers);

  return results.filter(Boolean) as TweetData[];
}

export function BulkProcessor({ onResults }: Props) {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBulkFetch() {
    const lines = input
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const validUrls = lines.filter((line) => parsePostUrl(line) !== null);

    if (validUrls.length === 0) {
      setError(t('bulk.noValidUrl'));
      return;
    }

    setLoading(true);
    setError(null);
    setProgress({ done: 0, total: validUrls.length });

    try {
      const tweets = await fetchWithConcurrency(validUrls, 3, (done, total) => {
        setProgress({ done, total });
      });

      if (tweets.length === 0) {
        setError(t('bulk.fetchFailed'));
      } else {
        onResults(tweets);
      }
    } catch {
      setError(t('bulk.error'));
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
        {t('bulk.label')}
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`https://x.com/user/status/123...\nhttps://bsky.app/profile/user/post/abc...\nhttps://tiktok.com/@user/video/456...`}
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
            {progress ? `${progress.done}/${progress.total} ${t('bulk.progress')}` : t('bulk.fetching')}
          </>
        ) : (
          t('bulk.fetchBtn')
        )}
      </button>
    </div>
  );
}
