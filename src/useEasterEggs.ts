import { useEffect, useRef } from 'react';

interface EasterEggActions {
  onKonami: () => void;
  onSecretWord: (word: string) => void;
}

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function useEasterEggs(actions: EasterEggActions) {
  const konamiIndex = useRef(0);
  const wordBuffer = useRef('');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Konami code
      if (e.key === KONAMI_CODE[konamiIndex.current]) {
        konamiIndex.current++;
        if (konamiIndex.current === KONAMI_CODE.length) {
          actions.onKonami();
          konamiIndex.current = 0;
        }
      } else {
        konamiIndex.current = 0;
      }

      // Secret word detection (typed anywhere)
      if (e.key.length === 1) {
        wordBuffer.current += e.key.toLowerCase();
        if (wordBuffer.current.length > 20) {
          wordBuffer.current = wordBuffer.current.slice(-20);
        }

        // Check for secret words
        if (wordBuffer.current.endsWith('party')) {
          actions.onSecretWord('party');
          wordBuffer.current = '';
        } else if (wordBuffer.current.endsWith('rainbow')) {
          actions.onSecretWord('rainbow');
          wordBuffer.current = '';
        } else if (wordBuffer.current.endsWith('matrix')) {
          actions.onSecretWord('matrix');
          wordBuffer.current = '';
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
}
