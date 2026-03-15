import type { Background } from './types';

export const backgrounds: Background[] = [
  { id: 'sunset', label: 'Sunset', style: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'ocean', label: 'Ocean', style: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'mint', label: 'Mint', style: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 'sky', label: 'Sky', style: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
  { id: 'peach', label: 'Peach', style: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 'night', label: 'Night', style: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)' },
  { id: 'forest', label: 'Forest', style: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'white', label: 'White', style: '#f5f5f5' },
  { id: 'black', label: 'Black', style: '#000000' },
  { id: 'blue', label: 'Blue', style: '#1da1f2' },
  { id: 'dots', label: 'ドット', style: 'radial-gradient(circle, #ccc 1px, transparent 1px)' },
  { id: 'grid', label: 'グリッド', style: 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)' },
  { id: 'diagonal', label: '斜線', style: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e0e0e0 10px, #e0e0e0 11px)' },
];

export const patternBackgroundSizes: Record<string, string> = {
  dots: '20px 20px',
  grid: '20px 20px',
};
