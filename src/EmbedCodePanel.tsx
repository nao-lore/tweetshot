import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useI18n } from './i18n';

interface Props {
  tweetUrl: string;
  imageDataUrl: string | null;
}

export function EmbedCodePanel({ tweetUrl, imageDataUrl }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  if (!imageDataUrl) {
    return (
      <div style={{
        background: '#1e1e1e',
        borderRadius: 12,
        padding: 16,
        color: '#888',
        fontSize: 13,
      }}>
        {t('embed.generateFirst')}
      </div>
    );
  }

  const embedCode = `<figure style="max-width:600px;margin:0 auto">
  <img src="${imageDataUrl}" alt="Tweet by @user" style="width:100%;border-radius:12px" />
  <figcaption><a href="${tweetUrl}">${t('embed.viewOriginal')}</a></figcaption>
</figure>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <div style={{
      background: '#1e1e1e',
      borderRadius: 12,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <textarea
        readOnly
        value={embedCode}
        style={{
          width: '100%',
          minHeight: 120,
          background: '#111',
          color: '#ccc',
          border: '1px solid #333',
          borderRadius: 8,
          padding: 10,
          fontSize: 12,
          fontFamily: 'monospace',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      <button
        onClick={handleCopy}
        style={{
          alignSelf: 'flex-end',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 14px',
          background: '#2a2a2a',
          color: '#ccc',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#333')}
        onMouseLeave={e => (e.currentTarget.style.background = '#2a2a2a')}
      >
        {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
        {copied ? t('embed.copied') : t('embed.copy')}
      </button>
    </div>
  );
}
