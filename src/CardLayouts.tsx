import { Heart, MessageCircle } from 'lucide-react';
import type { TweetData } from './types';

export type CardLayout = 'default' | 'minimal' | 'newspaper' | 'magazine' | 'quote';

export const cardLayouts: { id: CardLayout; label: string }[] = [
  { id: 'default', label: 'デフォルト' },
  { id: 'minimal', label: 'ミニマル' },
  { id: 'newspaper', label: '新聞風' },
  { id: 'magazine', label: 'マガジン' },
  { id: 'quote', label: '引用カード' },
];

interface LayoutProps {
  tweet: TweetData;
  isDark: boolean;
  fontFamily: string;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function Metrics({ tweet, isDark }: { tweet: TweetData; isDark: boolean }) {
  const color = isDark ? '#71767b' : '#536471';
  return (
    <div style={{ display: 'flex', gap: '16px', marginTop: '12px', color }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
        <MessageCircle size={16} />
        {formatCount(tweet.conversationCount)}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
        <Heart size={16} />
        {formatCount(tweet.favoriteCount)}
      </span>
    </div>
  );
}

function MinimalLayout({ tweet, isDark, fontFamily }: LayoutProps) {
  const textColor = isDark ? '#e7e9ea' : '#0f1419';
  const subColor = isDark ? '#71767b' : '#536471';

  return (
    <div style={{
      fontFamily,
      textAlign: 'center',
      padding: '32px 24px',
    }}>
      <div style={{
        fontSize: '18px',
        lineHeight: 1.7,
        color: textColor,
        whiteSpace: 'pre-wrap',
      }}>
        {tweet.text}
      </div>
      <div style={{
        marginTop: '20px',
        fontSize: '13px',
        color: subColor,
      }}>
        {tweet.user.name} · @{tweet.user.screenName}
      </div>
    </div>
  );
}

function NewspaperLayout({ tweet, isDark, fontFamily }: LayoutProps) {
  const textColor = isDark ? '#e7e9ea' : '#0f1419';
  const subColor = isDark ? '#71767b' : '#536471';
  const borderColor = isDark ? '#333' : '#ccc';
  // Newspaper uses serif regardless of font selection for the body
  const serifFamily = 'Georgia, "Times New Roman", serif';
  void fontFamily; // acknowledged but newspaper enforces serif

  return (
    <div style={{
      fontFamily: serifFamily,
      padding: '24px',
      borderTop: `2px solid ${borderColor}`,
      borderBottom: `2px solid ${borderColor}`,
    }}>
      <div style={{
        fontSize: '11px',
        fontVariant: 'small-caps',
        letterSpacing: '1.5px',
        color: subColor,
        marginBottom: '12px',
        fontWeight: 600,
      }}>
        {tweet.user.name}
      </div>
      <div style={{
        fontSize: '17px',
        lineHeight: 1.8,
        color: textColor,
        textAlign: 'justify',
        whiteSpace: 'pre-wrap',
      }}>
        {tweet.text}
      </div>
      {tweet.mediaUrl && (
        <img
          src={tweet.mediaUrl}
          alt=""
          crossOrigin="anonymous"
          style={{
            width: '100%',
            marginTop: '16px',
            borderRadius: '2px',
          }}
        />
      )}
      <div style={{
        marginTop: '16px',
        fontSize: '12px',
        color: subColor,
        fontStyle: 'italic',
      }}>
        {formatDate(tweet.createdAt)}
      </div>
    </div>
  );
}

function MagazineLayout({ tweet, isDark, fontFamily }: LayoutProps) {
  const textColor = isDark ? '#e7e9ea' : '#0f1419';
  const accentColor = isDark ? '#1d9bf0' : '#1d9bf0';

  return (
    <div style={{ fontFamily }}>
      {tweet.mediaUrl && (
        <img
          src={tweet.mediaUrl}
          alt=""
          crossOrigin="anonymous"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}
      <div style={{ padding: '24px' }}>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          lineHeight: 1.5,
          color: textColor,
          whiteSpace: 'pre-wrap',
        }}>
          {tweet.text}
        </div>
        <div style={{ marginTop: '20px' }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: textColor,
            paddingBottom: '4px',
            borderBottom: `3px solid ${accentColor}`,
          }}>
            {tweet.user.name}
          </span>
        </div>
      </div>
    </div>
  );
}

function QuoteLayout({ tweet, isDark, fontFamily }: LayoutProps) {
  const textColor = isDark ? '#e7e9ea' : '#0f1419';
  const quoteColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const subColor = isDark ? '#71767b' : '#536471';

  return (
    <div style={{
      fontFamily,
      padding: '32px 28px',
      position: 'relative',
    }}>
      <span style={{
        fontSize: '64px',
        lineHeight: 1,
        color: quoteColor,
        position: 'absolute',
        top: '8px',
        left: '16px',
        userSelect: 'none',
        fontFamily: 'Georgia, serif',
      }}>
        ❝
      </span>
      <div style={{
        fontSize: '19px',
        lineHeight: 1.8,
        color: textColor,
        whiteSpace: 'pre-wrap',
        padding: '24px 12px 0',
        position: 'relative',
        zIndex: 1,
      }}>
        {tweet.text}
      </div>
      <span style={{
        fontSize: '64px',
        lineHeight: 1,
        color: quoteColor,
        display: 'block',
        textAlign: 'right',
        marginTop: '-16px',
        marginRight: '4px',
        userSelect: 'none',
        fontFamily: 'Georgia, serif',
      }}>
        ❞
      </span>
      <div style={{
        fontSize: '14px',
        color: subColor,
        marginTop: '8px',
        paddingLeft: '12px',
      }}>
        — {tweet.user.name} (@{tweet.user.screenName})
      </div>
    </div>
  );
}

interface LayoutCardProps {
  layout: CardLayout;
  tweet: TweetData;
  isDark: boolean;
  fontFamily: string;
  showMetrics: boolean;
}

export function LayoutCard({ layout, tweet, isDark, fontFamily, showMetrics }: LayoutCardProps) {
  if (layout === 'default') return null;

  const layoutProps: LayoutProps = { tweet, isDark, fontFamily };

  let content: React.ReactNode;
  switch (layout) {
    case 'minimal':
      content = <MinimalLayout {...layoutProps} />;
      break;
    case 'newspaper':
      content = <NewspaperLayout {...layoutProps} />;
      break;
    case 'magazine':
      content = <MagazineLayout {...layoutProps} />;
      break;
    case 'quote':
      content = <QuoteLayout {...layoutProps} />;
      break;
  }

  return (
    <div>
      {content}
      {showMetrics && <div style={{ padding: '0 24px 16px' }}><Metrics tweet={tweet} isDark={isDark} /></div>}
    </div>
  );
}
