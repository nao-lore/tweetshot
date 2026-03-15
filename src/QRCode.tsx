import { useMemo } from 'react';

interface QRCodeProps {
  url: string;
  size?: number;
  show: boolean;
}

export function QRCode({ url, size = 200, show }: QRCodeProps) {
  const src = useMemo(
    () => `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(url)}&choe=UTF-8`,
    [url, size],
  );

  if (!show) return null;

  return (
    <img
      src={src}
      alt="QR Code"
      width={size}
      height={size}
      style={{ borderRadius: 8, background: '#fff' }}
    />
  );
}

interface QRCodeOverlayProps {
  url: string;
  position: 'bottom-right' | 'bottom-left';
  size: number;
}

export function QRCodeOverlay({ url, position, size }: QRCodeOverlayProps) {
  const src = useMemo(
    () => `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(url)}&choe=UTF-8`,
    [url, size],
  );

  const positionStyle: React.CSSProperties =
    position === 'bottom-right'
      ? { bottom: 8, right: 8 }
      : { bottom: 8, left: 8 };

  return (
    <img
      src={src}
      alt="QR Code"
      width={size}
      height={size}
      style={{
        position: 'absolute',
        ...positionStyle,
        borderRadius: 4,
        background: '#fff',
        padding: 2,
      }}
    />
  );
}
