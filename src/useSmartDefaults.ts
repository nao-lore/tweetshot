import { useCallback } from 'react';

const STORAGE_KEY = 'tweetshot-preferences';

interface Preferences {
  lastTheme: 'light' | 'dark';
  lastBackground: string;
  lastFormat: string;
  lastPixelRatio: number;
  mostUsedLayout: string;
  exportCount: Record<string, number>;
}

function loadPreferences(): Partial<Preferences> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePreferences(prefs: Partial<Preferences>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

export function useSmartDefaults() {
  const prefs = loadPreferences();

  const trackChoice = useCallback((key: keyof Preferences, value: string | number) => {
    const current = loadPreferences();
    savePreferences({ ...current, [key]: value });
  }, []);

  const getDefault = useCallback(<T>(key: keyof Preferences, fallback: T): T => {
    const val = prefs[key];
    return (val as T) ?? fallback;
  }, [prefs]);

  return { trackChoice, getDefault, prefs };
}
