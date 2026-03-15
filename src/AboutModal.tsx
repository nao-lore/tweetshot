import { useEffect, useCallback } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: Props) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: '#1a1a2e', color: '#e0e0e0', borderRadius: 16, padding: '32px',
        maxWidth: 480, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <h2 style={{
          fontSize: 24, fontWeight: 800, marginBottom: 16,
          background: 'linear-gradient(135deg, #667eea, #f5576c)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          TweetShot
        </h2>

        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#aaa', marginBottom: 16 }}>
          TweetShotは、SNSの投稿を美しい画像に変換するツールです。
          ブロガー、マーケター、クリエイターのために作られました。
        </p>

        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#aaa', marginBottom: 16 }}>
          「シェアしたい言葉を、もっと美しく。」
        </p>

        <div style={{ fontSize: 12, color: '#666', borderTop: '1px solid #333', paddingTop: 12, marginTop: 16 }}>
          <p>Made with love in Japan</p>
          <p style={{ marginTop: 4 }}>v1.0.0 — Open Source (MIT)</p>
        </div>

        <button onClick={onClose} style={{
          marginTop: 16, padding: '8px 20px', background: '#667eea',
          color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer',
          fontSize: 13, fontWeight: 600,
        }}>
          閉じる
        </button>
      </div>
    </div>
  );
}
