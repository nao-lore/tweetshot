import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { useTemplates } from './useTemplates';
import type { TemplateSettings } from './useTemplates';

interface Props {
  onLoad: (settings: TemplateSettings) => void;
  currentSettings: TemplateSettings;
}

export function TemplatePanel({ onLoad, currentSettings }: Props) {
  const { templates, saveTemplate, deleteTemplate, loadTemplate } = useTemplates();
  const [name, setName] = useState('');
  const [showInput, setShowInput] = useState(false);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveTemplate(trimmed, currentSettings);
    setName('');
    setShowInput(false);
  }

  function handleLoad(id: string) {
    const settings = loadTemplate(id);
    if (settings) onLoad(settings);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setShowInput(false);
  }

  return (
    <div style={{
      background: '#1e1e1e',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ color: '#aaa', fontSize: '13px' }}>テンプレート</label>
        {!showInput && (
          <button
            className="btn secondary"
            onClick={() => setShowInput(true)}
            type="button"
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            <Save size={14} /> テンプレート保存
          </button>
        )}
      </div>

      {showInput && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="テンプレート名..."
            style={{
              flex: 1,
              background: '#2a2a2a',
              border: '1px solid #333',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#e0e0e0',
              fontSize: '13px',
            }}
            autoFocus
          />
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={!name.trim()}
            type="button"
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            保存
          </button>
          <button
            className="btn secondary"
            onClick={() => setShowInput(false)}
            type="button"
            style={{ fontSize: '12px', padding: '4px 10px' }}
          >
            取消
          </button>
        </div>
      )}

      {templates.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '8px',
        }}>
          {templates.map((t) => (
            <div
              key={t.id}
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{
                color: '#e0e0e0',
                fontSize: '13px',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {t.name}
              </div>
              <div style={{
                color: '#666',
                fontSize: '11px',
              }}>
                {t.settings.cardTheme === 'dark' ? 'ダーク' : 'ライト'} / {t.settings.background.label}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  className="btn secondary"
                  onClick={() => handleLoad(t.id)}
                  type="button"
                  style={{ fontSize: '11px', padding: '3px 8px', flex: 1 }}
                >
                  適用
                </button>
                <button
                  className="btn secondary"
                  onClick={() => deleteTemplate(t.id)}
                  type="button"
                  style={{ fontSize: '11px', padding: '3px 6px' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: '#555', fontSize: '13px', textAlign: 'center', padding: '8px' }}>
          保存済みテンプレートはありません
        </div>
      )}
    </div>
  );
}
