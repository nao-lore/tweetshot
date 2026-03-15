import { useState, useCallback, useEffect } from 'react';
import type { TweetData } from './types';

export interface HistoryEntry {
  id: string;
  tweetId: string;
  tweetText: string;
  userName: string;
  screenName: string;
  thumbnailDataUrl: string;
  createdAt: string;
  tweetUrl: string;
}

const STORAGE_KEY = 'tweetshot-history';
const MAX_ENTRIES = 50;

function loadEntries(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveEntries(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadEntries());

  // Sync state to localStorage whenever entries change
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const addEntry = useCallback((tweet: TweetData, thumbnailDataUrl: string, tweetUrl: string) => {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tweetId: tweet.id,
      tweetText: tweet.text,
      userName: tweet.user.name,
      screenName: tweet.user.screenName,
      thumbnailDataUrl,
      createdAt: new Date().toISOString(),
      tweetUrl,
    };

    setEntries((prev) => {
      const next = [entry, ...prev];
      if (next.length > MAX_ENTRIES) {
        return next.slice(0, MAX_ENTRIES);
      }
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, []);

  // Already sorted desc by createdAt since we prepend
  const sorted = entries;

  return { entries: sorted, addEntry, removeEntry, clearHistory };
}
