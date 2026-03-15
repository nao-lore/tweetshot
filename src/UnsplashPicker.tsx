import { useState } from 'react';
import { ImageIcon, Search, X, Loader2 } from 'lucide-react';

interface PicsumPhoto {
  id: string;
  author: string;
  download_url: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClear: () => void;
  currentUrl: string | null;
}

export function UnsplashPicker({ onSelect, onClear, currentUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<PicsumPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = Math.floor(Math.random() * 50) + 1;
      const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=12`);
      if (!res.ok) throw new Error();
      const data: PicsumPhoto[] = await res.json();
      setPhotos(data);
    } catch {
      setError('画像の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (photos.length === 0) fetchPhotos();
  };

  const handleSelectUrl = () => {
    if (!customUrl.trim()) return;
    onSelect(customUrl.trim());
    setCustomUrl('');
  };

  const getThumbnailUrl = (photo: PicsumPhoto) =>
    `https://picsum.photos/id/${photo.id}/300/200`;

  const getFullUrl = (photo: PicsumPhoto) =>
    `https://picsum.photos/id/${photo.id}/1920/1080`;

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        style={{
          background: 'transparent',
          color: '#aaa',
          border: '1px solid #555',
          borderRadius: 4,
          padding: '4px 10px',
          fontSize: 13,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <ImageIcon size={14} />
        画像背景
      </button>
    );
  }

  return (
    <div
      style={{
        background: '#1e1e1e',
        border: '1px solid #444',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        maxWidth: 480,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ color: '#ddd', fontSize: 14, fontWeight: 600 }}>画像背景を選択</span>
        <button
          onClick={() => setOpen(false)}
          style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Custom URL input */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="画像URLを貼り付け..."
          onKeyDown={(e) => e.key === 'Enter' && handleSelectUrl()}
          style={{
            flex: 1,
            background: '#2a2a2a',
            color: '#ddd',
            border: '1px solid #444',
            borderRadius: 4,
            padding: '4px 8px',
            fontSize: 13,
          }}
        />
        <button
          onClick={handleSelectUrl}
          style={{
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '4px 10px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          適用
        </button>
      </div>

      {/* Current background indicator */}
      {currentUrl && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ color: '#888', fontSize: 12 }}>背景設定済み</span>
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: '1px solid #555',
              color: '#f87171',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            解除
          </button>
        </div>
      )}

      {/* Shuffle button */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <button
          onClick={fetchPhotos}
          disabled={loading}
          style={{
            background: '#333',
            color: '#ddd',
            border: '1px solid #555',
            borderRadius: 4,
            padding: '4px 10px',
            fontSize: 13,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} />}
          他の画像を表示
        </button>
      </div>

      {error && <p style={{ color: '#f87171', fontSize: 12, margin: '4px 0' }}>{error}</p>}

      {/* Photo grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 6,
        }}
      >
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => onSelect(getFullUrl(photo))}
            style={{
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              borderRadius: 4,
              overflow: 'hidden',
              background: '#333',
              aspectRatio: '3/2',
            }}
          >
            <img
              src={getThumbnailUrl(photo)}
              alt={photo.author}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
