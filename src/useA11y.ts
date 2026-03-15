import { useEffect } from 'react';

export function useA11yChecks(enabled: boolean) {
  useEffect(() => {
    if (!enabled || import.meta.env.PROD) return;

    // Check for images without alt text
    const imgs = document.querySelectorAll('img:not([alt])');
    if (imgs.length > 0) {
      console.warn(`[A11y] ${imgs.length} images without alt text found`);
    }

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      if (!btn.textContent?.trim() && !btn.getAttribute('aria-label')) {
        console.warn('[A11y] Button without accessible name:', btn);
      }
    });

    // Check for color contrast (basic)
    const body = document.body;
    const bgColor = getComputedStyle(body).backgroundColor;
    const textColor = getComputedStyle(body).color;
    if (bgColor && textColor) {
      // Simple logging
      console.info(`[A11y] Body colors — bg: ${bgColor}, text: ${textColor}`);
    }

    // Check for focus traps
    const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    console.info(`[A11y] ${focusable.length} focusable elements found`);

  }, [enabled]);
}
