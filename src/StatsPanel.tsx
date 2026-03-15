import { Trophy } from 'lucide-react';

interface Badge {
  id: string;
  label: string;
  description: string;
}

interface Stats {
  totalExports: number;
  totalCopies: number;
  totalTranslations: number;
  totalTweetsProcessed: number;
  streak: number;
  unlockedBadges: string[];
}

interface Props {
  stats: Stats;
  badges: readonly Badge[];
}

export function StatsPanel({ stats, badges }: Props) {
  return (
    <div style={{ background: '#1a1a1a', borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Trophy size={16} style={{ color: '#f59e0b' }} />
        <span style={{ color: '#e5e5e5', fontSize: 13, fontWeight: 600 }}>あなたの実績</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
        <StatBox label="エクスポート" value={stats.totalExports} />
        <StatBox label="コピー" value={stats.totalCopies} />
        <StatBox label="連続日数" value={stats.streak} suffix="日" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {badges.map(b => {
          const unlocked = stats.unlockedBadges.includes(b.id);
          return (
            <span
              key={b.id}
              title={b.description}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 6,
                fontSize: 11,
                background: unlocked ? 'rgba(245, 158, 11, 0.15)' : '#222',
                color: unlocked ? '#f59e0b' : '#555',
                border: `1px solid ${unlocked ? 'rgba(245, 158, 11, 0.3)' : '#333'}`,
                cursor: 'default',
              }}
            >
              {unlocked ? '🏆' : '🔒'} {b.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({ label, value, suffix = '' }: { label: string; value: number; suffix?: string }) {
  return (
    <div style={{
      background: '#222',
      borderRadius: 8,
      padding: '8px 12px',
      textAlign: 'center',
    }}>
      <div style={{ color: '#667eea', fontSize: 20, fontWeight: 700 }}>
        {value}{suffix}
      </div>
      <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}
