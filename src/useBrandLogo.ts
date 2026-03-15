import { useState, useCallback, useEffect } from 'react';

type Position = 'bottom-center' | 'bottom-right' | 'top-right';

interface BrandLogoState {
  logoUrl: string | null;
  logoText: string;
  position: Position;
}

const STORAGE_KEY = 'tweetshot-brand-logo';

function loadFromStorage(): BrandLogoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BrandLogoState;
      return {
        logoUrl: parsed.logoUrl ?? null,
        logoText: parsed.logoText ?? 'Made with TweetShot',
        position: parsed.position ?? 'bottom-center',
      };
    }
  } catch {
    // ignore
  }
  return {
    logoUrl: null,
    logoText: 'Made with TweetShot',
    position: 'bottom-center',
  };
}

function saveToStorage(state: BrandLogoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useBrandLogo() {
  const [state, setState] = useState<BrandLogoState>(loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setLogoFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setState((prev) => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  const setLogoText = useCallback((logoText: string) => {
    setState((prev) => ({ ...prev, logoText }));
  }, []);

  const setPosition = useCallback((position: Position) => {
    setState((prev) => ({ ...prev, position }));
  }, []);

  const clearLogo = useCallback(() => {
    setState({
      logoUrl: null,
      logoText: 'Made with TweetShot',
      position: 'bottom-center',
    });
  }, []);

  return {
    logoUrl: state.logoUrl,
    logoText: state.logoText,
    position: state.position,
    setLogoFile,
    setLogoText,
    setPosition,
    clearLogo,
  };
}
