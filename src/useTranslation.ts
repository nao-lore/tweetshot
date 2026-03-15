import { useState, useCallback, useRef } from 'react';

export function useTranslation(originalText: string) {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(new Map<string, string>());

  const isTranslated = translatedText !== null;

  const translate = useCallback(
    async (targetLang: string) => {
      const cacheKey = `${originalText}::${targetLang}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached !== undefined) {
        setTranslatedText(cached);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/translate?text=${encodeURIComponent(originalText)}&to=${targetLang}`,
        );
        if (!res.ok) throw new Error('翻訳に失敗しました');
        const data = await res.json();
        cacheRef.current.set(cacheKey, data.translated);
        setTranslatedText(data.translated);
      } catch {
        throw new Error('翻訳に失敗しました');
      } finally {
        setLoading(false);
      }
    },
    [originalText],
  );

  const reset = useCallback(() => {
    setTranslatedText(null);
  }, []);

  return {
    translatedText: translatedText ?? originalText,
    isTranslated,
    translate,
    reset,
    loading,
  };
}
