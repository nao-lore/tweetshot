import { useState } from 'react';
import { Check, Link, Share2 } from 'lucide-react';

interface Props {
  tweetUrl: string;
  imageBlob?: Blob | null;
}

const btnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: 'none',
  background: '#2a2a2a',
  color: '#ccc',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s',
};

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 5.82 2 10.5c0 4.21 3.74 7.74 8.79 8.4.34.07.81.23.93.52.1.27.07.68.03.95l-.15.91c-.05.28-.22 1.1.96.6s6.39-3.76 8.71-6.44C23.07 13.39 22 11.11 22 10.5 22 5.82 17.52 2 12 2zm-3.5 11.5h-2a.75.75 0 01-.75-.75v-4a.75.75 0 011.5 0v3.25H8.5a.75.75 0 010 1.5zm2.5-.75a.75.75 0 01-1.5 0v-4a.75.75 0 011.5 0zm4.5.75h-2a.75.75 0 01-.75-.75v-4a.75.75 0 011.5 0v3.25H15.5a.75.75 0 010 1.5zm3-3.25a.75.75 0 010 1.5H17v.75h1.5a.75.75 0 010 1.5h-2a.75.75 0 01-.75-.75v-4a.75.75 0 01.75-.75h2a.75.75 0 010 1.5H17v.75z" />
    </svg>
  );
}

export function ShareButtons({ tweetUrl, imageBlob }: Props) {
  const [linkCopied, setLinkCopied] = useState(false);
  const canWebShare = typeof navigator !== 'undefined' && !!navigator.share;

  function shareTwitter() {
    const text = encodeURIComponent('TweetShotで作成');
    const url = encodeURIComponent(tweetUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  function shareLine() {
    const url = encodeURIComponent(tweetUrl);
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${url}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  async function webShare() {
    try {
      const shareData: ShareData = { url: tweetUrl };
      if (imageBlob) {
        const file = new File([imageBlob], 'tweetshot.png', { type: imageBlob.type });
        if (navigator.canShare?.({ files: [file] })) {
          shareData.files = [file];
        }
      }
      await navigator.share(shareData);
    } catch {
      // user cancelled or not supported
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(tweetUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button
        onClick={shareTwitter}
        style={btnStyle}
        title="Twitterでシェア"
        onMouseEnter={e => (e.currentTarget.style.background = '#333')}
        onMouseLeave={e => (e.currentTarget.style.background = '#2a2a2a')}
      >
        <TwitterIcon />
      </button>

      <button
        onClick={shareLine}
        style={btnStyle}
        title="LINEでシェア"
        onMouseEnter={e => (e.currentTarget.style.background = '#333')}
        onMouseLeave={e => (e.currentTarget.style.background = '#2a2a2a')}
      >
        <LineIcon />
      </button>

      {canWebShare && (
        <button
          onClick={webShare}
          style={btnStyle}
          title="共有"
          onMouseEnter={e => (e.currentTarget.style.background = '#333')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2a2a2a')}
        >
          <Share2 size={16} />
        </button>
      )}

      <button
        onClick={copyLink}
        style={btnStyle}
        title="リンクをコピー"
        onMouseEnter={e => (e.currentTarget.style.background = '#333')}
        onMouseLeave={e => (e.currentTarget.style.background = '#2a2a2a')}
      >
        {linkCopied ? <Check size={16} color="#4ade80" /> : <Link size={16} />}
      </button>
    </div>
  );
}
