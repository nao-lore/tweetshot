import { describe, it, expect } from 'vitest';
import { parsePostUrl } from '../parseUrl';

describe('parsePostUrl', () => {
  it('parses Twitter URL', () => {
    const result = parsePostUrl('https://x.com/user/status/123456');
    expect(result).toEqual({ platform: 'twitter', id: '123456', url: 'https://x.com/user/status/123456' });
  });

  it('parses plain tweet ID', () => {
    const result = parsePostUrl('123456');
    expect(result).toEqual({ platform: 'twitter', id: '123456', url: '123456' });
  });

  it('parses Bluesky URL', () => {
    const result = parsePostUrl('https://bsky.app/profile/user.bsky.social/post/abc123');
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('bluesky');
  });

  it('parses TikTok URL', () => {
    const result = parsePostUrl('https://www.tiktok.com/@user/video/7123456789');
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('tiktok');
  });

  it('returns null for invalid input', () => {
    expect(parsePostUrl('')).toBeNull();
    expect(parsePostUrl('https://google.com')).toBeNull();
    expect(parsePostUrl('random text')).toBeNull();
  });
});
