export function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '16px',
        background: '#667eea',
        color: 'white',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        zIndex: 99999,
        textDecoration: 'none',
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => { e.currentTarget.style.top = '16px'; }}
      onBlur={(e) => { e.currentTarget.style.top = '-100px'; }}
    >
      メインコンテンツへスキップ
    </a>
  );
}
