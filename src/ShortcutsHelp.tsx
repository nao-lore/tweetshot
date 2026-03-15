import { useEffect, useCallback, useRef } from 'react';

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: '\u2318S', description: '\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9' },
  { keys: '\u2318C', description: '\u30b3\u30d4\u30fc' },
  { keys: '\u2318D', description: '\u30c6\u30fc\u30de\u5207\u66ff' },
  { keys: '\u2318Enter', description: '\u751f\u6210' },
  { keys: '\u2318\u21e7S', description: '\u30b7\u30e7\u30fc\u30c8\u30ab\u30c3\u30c8\u8868\u793a' },
];

export function ShortcutsHelp({ open, onClose }: ShortcutsHelpProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    window.addEventListener('keydown', handleKeyDown);
    // Focus close button when modal opens
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Return focus when modal closes
      previousFocusRef.current?.focus();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        aria-label="キーボードショートカット"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1a2e',
          color: '#e0e0e0',
          borderRadius: 12,
          padding: '24px 32px',
          minWidth: 300,
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 16px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
            }}
          >
            Keyboard Shortcuts
          </h3>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="閉じる"
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              padding: '2px 6px',
            }}
          >
            &times;
          </button>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {shortcuts.map(({ keys, description }) => (
            <li
              key={keys}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ color: '#aaa', fontSize: 14 }}>{description}</span>
              <kbd
                style={{
                  background: '#2a2a40',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {keys}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
