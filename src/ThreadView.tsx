import { forwardRef } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import type { TweetData, Background, SizePreset } from './types';
import { patternBackgroundSizes } from './backgrounds';

interface Props {
  tweets: TweetData[];
  background: Background;
  cardTheme: 'light' | 'dark';
  padding: number;
  shadow: number;
  borderRadius: number;
  showMetrics: boolean;
  showWatermark: boolean;
  border: boolean;
  borderColor: string;
  sizePreset: SizePreset;
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

export const ThreadView = forwardRef<HTMLDivElement, Props>(
  ({ tweets, background, cardTheme, padding, shadow, borderRadius, showMetrics, showWatermark, border, borderColor, sizePreset }, ref) => {
    const isDark = cardTheme === 'dark';
    const bgSize = patternBackgroundSizes[background.id];

    const wrapperStyle: React.CSSProperties = {
      background: background.style,
      padding: `${padding}px`,
      ...(bgSize && {
        backgroundSize: bgSize,
        backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
      }),
      ...(sizePreset.width && {
        width: `${sizePreset.width}px`,
        height: sizePreset.height ? `${sizePreset.height}px` : undefined,
        justifyContent: 'center',
      }),
    };

    const cardStyle: React.CSSProperties = {
      boxShadow: shadow > 0 ? `0 ${shadow * 2}px ${shadow * 4}px rgba(0,0,0,${0.1 + shadow * 0.02})` : 'none',
      borderRadius: `${borderRadius}px`,
      ...(border && { border: `2px solid ${borderColor}` }),
    };

    return (
      <div
        ref={ref}
        className="tweet-shot-wrapper"
        style={wrapperStyle}
      >
        <div className={`tweet-card ${isDark ? 'dark' : ''}`} style={cardStyle}>
          {tweets.map((tweet, index) => {
            const isLast = index === tweets.length - 1;

            return (
              <div key={tweet.id}>
                {index > 0 && (
                  <div style={{
                    height: '1px',
                    background: isDark ? '#333' : '#e0e0e0',
                    margin: '0 16px',
                  }} />
                )}
                <div style={{ padding: '12px 16px', position: 'relative' }}>
                  {/* Thread line */}
                  {!isLast && (
                    <div style={{
                      position: 'absolute',
                      left: '36px',
                      top: '52px',
                      bottom: '0',
                      width: '2px',
                      background: isDark ? '#333' : '#cfd9de',
                    }} />
                  )}

                  <div className="tweet-header" style={{ marginBottom: '4px' }}>
                    <img
                      src={tweet.user.avatarUrl}
                      alt=""
                      className="tweet-avatar"
                      crossOrigin="anonymous"
                    />
                    <div className="tweet-author">
                      <div className="tweet-name">
                        {tweet.user.name}
                        {tweet.user.isVerified && (
                          <svg className="verified-badge" viewBox="0 0 22 22" width="16" height="16">
                            <path
                              fill="#1da1f2"
                              d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.607-.274 1.264-.144 1.897.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="tweet-handle">@{tweet.user.screenName}</div>
                    </div>
                    {index === 0 && (
                      <svg className="x-logo" viewBox="0 0 24 24" width="20" height="20">
                        <path
                          fill={isDark ? '#71767b' : '#536471'}
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="tweet-text" style={{ marginLeft: '52px' }}>{tweet.text}</div>

                  {tweet.mediaUrl && (
                    <img
                      src={tweet.mediaUrl}
                      alt=""
                      className="tweet-media"
                      crossOrigin="anonymous"
                      style={{ marginLeft: '52px', width: 'calc(100% - 52px)' }}
                    />
                  )}

                  <div className="tweet-meta" style={{ marginLeft: '52px' }}>
                    <span className="tweet-date">{formatDate(tweet.createdAt)}</span>
                  </div>

                  {showMetrics && isLast && (
                    <div className="tweet-metrics" style={{ marginLeft: '52px' }}>
                      <span className="metric">
                        <MessageCircle size={16} />
                        {formatCount(tweet.conversationCount)}
                      </span>
                      <span className="metric">
                        <Heart size={16} />
                        {formatCount(tweet.favoriteCount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showWatermark && <div className="watermark">Made with TweetShot</div>}
      </div>
    );
  },
);

ThreadView.displayName = 'ThreadView';
