import type { Background } from './types';
import { backgrounds, patternBackgroundSizes } from './backgrounds';

interface Props {
  selected: string;
  onChange: (bg: Background) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
}

export function BackgroundPicker({ selected, onChange, customColor, onCustomColorChange }: Props) {
  const customBg: Background = { id: 'custom', label: 'カスタム', style: customColor };

  return (
    <div className="bg-picker">
      {backgrounds.map((bg) => (
        <button
          key={bg.id}
          className={`bg-swatch ${selected === bg.id ? 'active' : ''}`}
          style={{
            background: bg.style,
            backgroundSize: patternBackgroundSizes[bg.id] ?? undefined,
            backgroundColor: patternBackgroundSizes[bg.id] ? '#f5f5f5' : undefined,
          }}
          onClick={() => onChange(bg)}
          title={bg.label}
          type="button"
        />
      ))}
      <div className="custom-color-wrapper">
        <button
          className={`bg-swatch custom-swatch ${selected === 'custom' ? 'active' : ''}`}
          style={{ background: customColor }}
          onClick={() => onChange(customBg)}
          title="カスタムカラー"
          type="button"
        />
        <input
          type="color"
          value={customColor}
          onChange={(e) => {
            onCustomColorChange(e.target.value);
            onChange({ id: 'custom', label: 'カスタム', style: e.target.value });
          }}
          className="color-input-hidden"
        />
      </div>
    </div>
  );
}
