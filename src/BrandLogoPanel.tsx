import { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';

type Position = 'bottom-center' | 'bottom-right' | 'top-right';

interface Props {
  logoUrl: string | null;
  logoText: string;
  position: Position;
  onLogoFile: (file: File) => void;
  onLogoText: (text: string) => void;
  onPosition: (position: Position) => void;
  onClear: () => void;
}

const positionOptions: { id: Position; label: string }[] = [
  { id: 'bottom-center', label: '下中央' },
  { id: 'bottom-right', label: '下右' },
  { id: 'top-right', label: '上右' },
];

export function BrandLogoPanel({
  logoUrl,
  logoText,
  position,
  onLogoFile,
  onLogoText,
  onPosition,
  onClear,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onLogoFile(file);
    }
  }

  return (
    <div className="control-section">
      <label>ブランドロゴ</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Logo upload */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn icon-toggle"
            onClick={() => fileRef.current?.click()}
            type="button"
            style={{ fontSize: 12 }}
          >
            <Upload size={14} />
            ロゴ画像
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {logoUrl && (
            <img
              src={logoUrl}
              alt="ロゴプレビュー"
              style={{
                maxHeight: 24,
                objectFit: 'contain',
                borderRadius: 4,
                background: '#2a2a2a',
                padding: 2,
              }}
            />
          )}
        </div>

        {/* Logo text */}
        <input
          type="text"
          value={logoText}
          onChange={(e) => onLogoText(e.target.value)}
          placeholder="ウォーターマークテキスト"
          style={{
            padding: '8px 12px',
            border: '1px solid #333',
            borderRadius: 8,
            background: '#1a1a1a',
            color: '#e5e5e5',
            fontSize: 13,
            outline: 'none',
            width: '100%',
          }}
        />

        {/* Position selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {positionOptions.map((opt) => (
            <button
              key={opt.id}
              className={`btn icon-toggle ${position === opt.id ? 'active-toggle' : ''}`}
              onClick={() => onPosition(opt.id)}
              type="button"
              style={{ fontSize: 11, padding: '6px 10px', flex: 1 }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Reset button */}
        <button
          className="btn icon-toggle"
          onClick={onClear}
          type="button"
          style={{ fontSize: 12 }}
        >
          <Trash2 size={14} />
          リセット
        </button>
      </div>
    </div>
  );
}
