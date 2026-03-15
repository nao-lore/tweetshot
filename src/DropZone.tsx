import { useState, useCallback, useEffect, useRef } from 'react';

interface DropZoneProps {
  onDrop: (url: string) => void;
  children: React.ReactNode;
}

const URL_REGEX = /https?:\/\/[^\s<>"']+/;

function extractUrl(text: string): string | null {
  const match = text.match(URL_REGEX);
  return match ? match[0] : null;
}

export function DropZone({ onDrop, children }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);

    const text = e.dataTransfer?.getData('text/plain') || e.dataTransfer?.getData('text/uri-list') || '';
    const url = extractUrl(text);
    if (url) {
      try {
        onDrop(url);
      } catch (err) {
        console.error('Drop handler error:', err);
      }
    }
  }, [onDrop]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    // Don't intercept paste events targeting input/textarea elements
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const text = e.clipboardData?.getData('text/plain') || '';
    const url = extractUrl(text);
    if (url) {
      e.preventDefault();
      try {
        onDrop(url);
      } catch (err) {
        console.error('Paste handler error:', err);
      }
    }
  }, [onDrop]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    el.addEventListener('dragenter', handleDragEnter);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('drop', handleDrop);
    document.addEventListener('paste', handlePaste);

    return () => {
      el.removeEventListener('dragenter', handleDragEnter);
      el.removeEventListener('dragleave', handleDragLeave);
      el.removeEventListener('dragover', handleDragOver);
      el.removeEventListener('drop', handleDrop);
      document.removeEventListener('paste', handlePaste);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handlePaste]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {children}
      {dragging && (
        <div
          role="status"
          aria-live="polite"
          style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(102, 126, 234, 0.15)',
          WebkitBackdropFilter: 'blur(2px)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: 12,
          border: '3px dashed #667eea',
          pointerEvents: 'none',
        }}>
          <div style={{
            color: '#667eea',
            fontSize: 18,
            fontWeight: 700,
            textAlign: 'center',
            padding: 24,
          }}>
            URLをドロップしてツイートを取得
          </div>
        </div>
      )}
    </div>
  );
}
