import { useEffect } from 'react';

export const fontOptions = [
  { id: 'system', label: 'システム', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans JP", sans-serif' },
  { id: 'noto-sans', label: 'Noto Sans JP', family: '"Noto Sans JP", sans-serif' },
  { id: 'inter', label: 'Inter', family: '"Inter", sans-serif' },
  { id: 'poppins', label: 'Poppins', family: '"Poppins", sans-serif' },
  { id: 'playfair', label: 'Playfair Display', family: '"Playfair Display", serif' },
  { id: 'source-code', label: 'Source Code Pro', family: '"Source Code Pro", monospace' },
  { id: 'zen-kaku', label: 'Zen Kaku Gothic', family: '"Zen Kaku Gothic New", sans-serif' },
  { id: 'noto-serif', label: 'Noto Serif JP', family: '"Noto Serif JP", serif' },
];

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@400;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;700&family=Source+Code+Pro:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap';

interface FontPickerProps {
  selected: string;
  onChange: (fontId: string, family: string) => void;
}

export function FontPicker({ selected, onChange }: FontPickerProps) {
  useEffect(() => {
    const id = 'tweetshot-google-fonts';
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fontId = e.target.value;
    const font = fontOptions.find((f) => f.id === fontId);
    if (font) {
      onChange(font.id, font.family);
    }
  };

  return (
    <div>
      <select
        value={selected}
        onChange={handleChange}
        className="select-input"
      >
        {fontOptions.map((font) => (
          <option
            key={font.id}
            value={font.id}
            style={{ fontFamily: font.family }}
          >
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
}
