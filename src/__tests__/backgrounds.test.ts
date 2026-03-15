import { describe, it, expect } from 'vitest';
import { backgrounds, patternBackgroundSizes } from '../backgrounds';

describe('backgrounds', () => {
  it('has unique IDs', () => {
    const ids = backgrounds.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has non-empty styles', () => {
    for (const bg of backgrounds) {
      expect(bg.style).toBeTruthy();
      expect(bg.label).toBeTruthy();
    }
  });

  it('pattern backgrounds have sizes', () => {
    expect(patternBackgroundSizes['dots']).toBeDefined();
    expect(patternBackgroundSizes['grid']).toBeDefined();
  });
});
