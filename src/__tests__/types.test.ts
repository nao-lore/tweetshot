import { describe, it, expect } from 'vitest';
import { sizePresets } from '../types';

describe('sizePresets', () => {
  it('has a free size option', () => {
    const free = sizePresets.find(p => p.id === 'free');
    expect(free).toBeDefined();
    expect(free!.width).toBeNull();
    expect(free!.height).toBeNull();
  });

  it('has unique IDs', () => {
    const ids = sizePresets.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
