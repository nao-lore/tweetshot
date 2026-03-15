import { useEffect, useCallback, useState } from 'react';

interface ShortcutActions {
  download: () => void;
  copy: () => void;
  toggleTheme: () => void;
  generate: () => void;
}

const INPUT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

export function useKeyboardShortcuts(actions: ShortcutActions, enabled: boolean) {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      const target = e.target as HTMLElement;
      const inInput = INPUT_TAGS.includes(target.tagName);

      if (e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setShowHelp((v) => !v);
        return;
      }

      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          actions.download();
          break;
        case 'c':
          if (!inInput) {
            e.preventDefault();
            actions.copy();
          }
          break;
        case 'd':
          e.preventDefault();
          actions.toggleTheme();
          break;
        case 'enter':
          e.preventDefault();
          actions.generate();
          break;
      }
    },
    [actions, enabled],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp };
}
