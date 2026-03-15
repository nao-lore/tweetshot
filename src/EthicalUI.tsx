/**
 * Ethical UI components for TweetShot
 * - No manipulative patterns
 * - Clear affordances
 * - Respectful of user attention
 */

// Privacy-first analytics consent banner
interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  show: boolean;
}

export function ConsentBanner({ onAccept, onDecline, show }: ConsentBannerProps) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px',
      background: '#1a1a2e', borderTop: '1px solid #333', zIndex: 9998,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      flexWrap: 'wrap',
    }}>
      <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>
        TweetShotは使用統計をローカルストレージに保存します。外部には送信しません。
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onAccept} style={{
          padding: '6px 16px', background: '#667eea', color: 'white',
          border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer',
        }}>
          了承
        </button>
        <button onClick={onDecline} style={{
          padding: '6px 16px', background: 'transparent', color: '#888',
          border: '1px solid #555', borderRadius: 6, fontSize: 12, cursor: 'pointer',
        }}>
          統計を無効化
        </button>
      </div>
    </div>
  );
}

// Clear action labels (no ambiguous "OK" / "Cancel")
export function ClearActionButton({ action, label, onClick, variant = 'primary' }: {
  action: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'destructive' | 'secondary';
}) {
  const colors = {
    primary: { bg: '#667eea', text: 'white' },
    destructive: { bg: '#ef4444', text: 'white' },
    secondary: { bg: '#2a2a2a', text: '#e5e5e5' },
  };
  const c = colors[variant];
  return (
    <button
      onClick={onClick}
      aria-label={`${action}: ${label}`}
      style={{
        padding: '8px 16px', background: c.bg, color: c.text,
        border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer',
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}
