import { useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import type { HighlightRule } from './TextHighlight';
import { useI18n } from './i18n';

interface HighlightPanelProps {
  rules: HighlightRule[];
  onChange: (rules: HighlightRule[]) => void;
}

const PRESET_COLORS = [
  { label: 'Yellow', value: '#fde68a' },
  { label: 'Cyan', value: '#a5f3fc' },
  { label: 'Pink', value: '#fbb6ce' },
  { label: 'Lime', value: '#bef264' },
  { label: 'Orange', value: '#fdba74' },
];

export function HighlightPanel({ rules, onChange }: HighlightPanelProps) {
  const { t } = useI18n();

  const addRule = useCallback(() => {
    onChange([...rules, { pattern: '', color: PRESET_COLORS[rules.length % PRESET_COLORS.length].value }]);
  }, [rules, onChange]);

  const updateRule = useCallback((index: number, patch: Partial<HighlightRule>) => {
    const next = rules.map((r, i) => (i === index ? { ...r, ...patch } : r));
    onChange(next);
  }, [rules, onChange]);

  const removeRule = useCallback((index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  }, [rules, onChange]);

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: 10,
      border: '1px solid #2a2a4a',
      padding: 12,
    }}>
      <label style={{ color: '#aaa', fontSize: 12, fontWeight: 600, marginBottom: 8, display: 'block' }}>
        {t('label.highlight')}
      </label>

      {rules.map((rule, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 6,
          }}
        >
          <input
            type="text"
            value={rule.pattern}
            onChange={(e) => updateRule(i, { pattern: e.target.value })}
            placeholder="キーワード..."
            style={{
              flex: 1,
              background: '#16162a',
              border: '1px solid #2a2a4a',
              borderRadius: 6,
              color: '#ddd',
              padding: '5px 8px',
              fontSize: 12,
              outline: 'none',
            }}
          />

          {/* Preset color swatches */}
          <div style={{ display: 'flex', gap: 2 }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => updateRule(i, { color: c.value })}
                aria-label={c.label}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: c.value,
                  border: rule.color === c.value ? '2px solid #fff' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  lineHeight: 1,
                  color: '#000',
                }}
                title={c.label}
              >{rule.color === c.value ? '✓' : ''}</button>
            ))}
          </div>

          {/* Custom color picker */}
          <input
            type="color"
            value={rule.color}
            onChange={(e) => updateRule(i, { color: e.target.value })}
            style={{
              width: 24,
              height: 24,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: 'none',
            }}
          />

          <button
            type="button"
            onClick={() => removeRule(i)}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: 2,
              lineHeight: 1,
            }}
            title={t('history.delete')}
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRule}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '5px 10px',
          background: 'none',
          border: '1px dashed #2a2a4a',
          borderRadius: 6,
          color: '#888',
          fontSize: 12,
          cursor: 'pointer',
          width: '100%',
          justifyContent: 'center',
          marginTop: 4,
        }}
      >
        <Plus size={12} />
        {t('highlight.add')}
      </button>
    </div>
  );
}
