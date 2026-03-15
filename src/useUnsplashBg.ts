import { useState, useCallback } from 'react';

interface PicsumPhoto {
  id: string;
  author: string;
  download_url: string;
}

export function useUnsplashBg() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<PicsumPhoto[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const page = Math.floor(Math.random() * 50) + 1;
      const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=12`);
      if (!res.ok) throw new Error('画像の取得に失敗しました');
      const data: PicsumPhoto[] = await res.json();
      setSearchResults(data);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setImageUrl(null);
  }, []);

  const backgroundStyle = imageUrl
    ? `url(${imageUrl}) center/cover`
    : undefined;

  return {
    imageUrl,
    setImageUrl,
    clearImage,
    searchResults,
    search,
    loading,
    backgroundStyle,
  };
}
