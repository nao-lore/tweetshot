import { describe, it, expect } from 'vitest';
import { translations } from '../i18n';

describe('i18n', () => {
  it('has same keys in ja and en', () => {
    const jaKeys = Object.keys(translations.ja).sort();
    const enKeys = Object.keys(translations.en).sort();
    expect(jaKeys).toEqual(enKeys);
  });

  it('has no empty translations', () => {
    for (const [key, value] of Object.entries(translations.ja)) {
      expect(value, `ja.${key} is empty`).toBeTruthy();
    }
    for (const [key, value] of Object.entries(translations.en)) {
      expect(value, `en.${key} is empty`).toBeTruthy();
    }
  });
});
