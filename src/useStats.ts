import { useState, useCallback, useEffect } from 'react';

interface UserStats {
  totalExports: number;
  totalCopies: number;
  totalTranslations: number;
  totalTweetsProcessed: number;
  firstUseDate: string;
  streak: number; // consecutive days used
  lastUseDate: string;
  unlockedBadges: string[];
}

const STORAGE_KEY = 'tweetshot-stats';

const BADGES = [
  { id: 'first-shot', label: '初ショット', description: '初めての画像生成', condition: (s: UserStats) => s.totalExports >= 1 },
  { id: 'power-user', label: 'パワーユーザー', description: '10回エクスポート', condition: (s: UserStats) => s.totalExports >= 10 },
  { id: 'centurion', label: '百戦錬磨', description: '100回エクスポート', condition: (s: UserStats) => s.totalExports >= 100 },
  { id: 'polyglot', label: 'ポリグロット', description: '翻訳機能を5回使用', condition: (s: UserStats) => s.totalTranslations >= 5 },
  { id: 'bulk-master', label: '一括マスター', description: '50ツイートを処理', condition: (s: UserStats) => s.totalTweetsProcessed >= 50 },
  { id: 'streak-3', label: '3日連続', description: '3日連続で使用', condition: (s: UserStats) => s.streak >= 3 },
  { id: 'streak-7', label: '7日連続', description: '7日間連続で使用', condition: (s: UserStats) => s.streak >= 7 },
] as const;

function loadStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const now = new Date().toISOString().split('T')[0];
  return { totalExports: 0, totalCopies: 0, totalTranslations: 0, totalTweetsProcessed: 0, firstUseDate: now, streak: 1, lastUseDate: now, unlockedBadges: [] };
}

function saveStats(stats: UserStats) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch {}
}

function updateStreak(stats: UserStats): UserStats {
  const today = new Date().toISOString().split('T')[0];
  if (stats.lastUseDate === today) return stats;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const streak = stats.lastUseDate === yesterday ? stats.streak + 1 : 1;
  return { ...stats, streak, lastUseDate: today };
}

function checkBadges(stats: UserStats): { stats: UserStats; newBadge: string | null } {
  let newBadge: string | null = null;
  for (const badge of BADGES) {
    if (!stats.unlockedBadges.includes(badge.id) && badge.condition(stats)) {
      stats = { ...stats, unlockedBadges: [...stats.unlockedBadges, badge.id] };
      newBadge = badge.label;
    }
  }
  return { stats, newBadge };
}

export function useStats() {
  const [stats, setStats] = useState<UserStats>(loadStats);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    const updated = updateStreak(stats);
    if (updated !== stats) {
      setStats(updated);
      saveStats(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackExport = useCallback(() => {
    setStats(prev => {
      const next = { ...prev, totalExports: prev.totalExports + 1 };
      const { stats: checked, newBadge: badge } = checkBadges(next);
      saveStats(checked);
      if (badge) setNewBadge(badge);
      return checked;
    });
  }, []);

  const trackCopy = useCallback(() => {
    setStats(prev => {
      const next = { ...prev, totalCopies: prev.totalCopies + 1 };
      const { stats: checked, newBadge: badge } = checkBadges(next);
      saveStats(checked);
      if (badge) setNewBadge(badge);
      return checked;
    });
  }, []);

  const trackTranslation = useCallback(() => {
    setStats(prev => {
      const next = { ...prev, totalTranslations: prev.totalTranslations + 1 };
      const { stats: checked, newBadge: badge } = checkBadges(next);
      saveStats(checked);
      if (badge) setNewBadge(badge);
      return checked;
    });
  }, []);

  const trackTweets = useCallback((count: number) => {
    setStats(prev => {
      const next = { ...prev, totalTweetsProcessed: prev.totalTweetsProcessed + count };
      const { stats: checked, newBadge: badge } = checkBadges(next);
      saveStats(checked);
      if (badge) setNewBadge(badge);
      return checked;
    });
  }, []);

  const clearNewBadge = useCallback(() => setNewBadge(null), []);

  return { stats, trackExport, trackCopy, trackTranslation, trackTweets, newBadge, clearNewBadge, badges: BADGES };
}
