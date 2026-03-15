import { Languages, RotateCcw, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  originalText: string;
  onTranslate: (translated: string) => void;
  onReset: () => void;
  isTranslated: boolean;
}

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'zh-CN', label: '中文（簡体）' },
  { code: 'zh-TW', label: '中文（繁體）' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
] as const;

export function TranslationPanel({ originalText, onTranslate, onReset, isTranslated }: Props) {
  const [targetLang, setTargetLang] = useState('ja');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!originalText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/translate?text=${encodeURIComponent(originalText)}&to=${targetLang}`,
      );
      if (!res.ok) throw new Error('翻訳に失敗しました');
      const data = await res.json();
      onTranslate(data.translated);
    } catch {
      setError('翻訳に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
      }}
    >
      <Languages size={16} style={{ color: '#aaa', flexShrink: 0 }} />
      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
        style={{
          background: '#2a2a2a',
          color: '#ddd',
          border: '1px solid #444',
          borderRadius: 4,
          padding: '3px 6px',
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>

      <button
        onClick={handleTranslate}
        disabled={loading}
        style={{
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '3px 10px',
          fontSize: 13,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : null}
        翻訳
      </button>

      {isTranslated && (
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            color: '#aaa',
            border: '1px solid #555',
            borderRadius: 4,
            padding: '3px 8px',
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <RotateCcw size={12} />
          元に戻す
        </button>
      )}

      {error && (
        <span style={{ color: '#f87171', fontSize: 12 }}>{error}</span>
      )}
    </div>
  );
}
