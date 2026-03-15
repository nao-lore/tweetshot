import React from 'react';

/** Checkerboard pattern to show transparency in preview */
export function TransparencyPreview({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundImage:
          'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%)',
        backgroundSize: '16px 16px',
        borderRadius: 12,
      }}
    >
      {children}
    </div>
  );
}

/** Background option for transparent */
export const transparentBackground = {
  id: 'transparent',
  label: '透過',
  style: 'transparent',
} as const;
