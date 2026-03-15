import { useState } from 'react';
import { History, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useHistory } from './useHistory';
import { useI18n } from './i18n';

interface HistoryPanelProps {
  onSelect: (tweetUrl: string) => void;
}

export function HistoryPanel({ onSelect }: HistoryPanelProps) {
  const { t } = useI18n();
  const { entries, removeEntry, clearHistory } = useHistory();
  const [open, setOpen] = useState(false);

  if (entries.length === 0 && !open) return null;

  return (
    <div style={{
      marginTop: 12,
      background: '#1a1a2e',
      borderRadius: 10,
      border: '1px solid #2a2a4a',
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: 'none',
          border: 'none',
          color: '#ccc',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <History size={14} />
          {t('history.title')} ({entries.length})
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div style={{ padding: '0 10px 10px' }}>
          {entries.length === 0 ? (
            <p style={{ color: '#666', fontSize: 12, textAlign: 'center', padding: 16 }}>
              {t('history.empty')}
            </p>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 8,
                maxHeight: 320,
                overflowY: 'auto',
              }}>
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      background: '#16162a',
                      borderRadius: 8,
                      border: '1px solid #2a2a4a',
                      padding: 8,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'border-color 0.15s',
                    }}
                    onClick={() => onSelect(entry.tweetUrl)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#667eea';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a4a';
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntry(entry.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        padding: 2,
                        lineHeight: 1,
                      }}
                      title={t('history.delete')}
                    >
                      <X size={12} />
                    </button>

                    {entry.thumbnailDataUrl && (
                      <img
                        src={entry.thumbnailDataUrl}
                        alt=""
                        style={{
                          width: '100%',
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 4,
                          marginBottom: 6,
                        }}
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.onerror = null;
                          el.style.display = 'none';
                        }}
                      />
                    )}

                    <div style={{ color: '#999', fontSize: 11, marginBottom: 2 }}>
                      @{entry.screenName}
                    </div>
                    <div style={{
                      color: '#ccc',
                      fontSize: 11,
                      lineHeight: 1.3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {entry.tweetText.slice(0, 30)}
                    </div>
                    <div style={{ color: '#555', fontSize: 10, marginTop: 4 }}>
                      {new Date(entry.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={clearHistory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  margin: '10px auto 0',
                  padding: '6px 14px',
                  background: 'none',
                  border: '1px solid #3a2020',
                  borderRadius: 6,
                  color: '#c44',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={12} />
                {t('history.clearAll')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
