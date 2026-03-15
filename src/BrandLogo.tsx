interface Props {
  logoUrl: string | null;
  logoText: string;
  position: 'bottom-center' | 'bottom-right' | 'top-right';
}

export function BrandLogo({ logoUrl, logoText, position }: Props) {
  const positionStyles: React.CSSProperties = (() => {
    switch (position) {
      case 'bottom-center':
        return {
          justifyContent: 'center',
          marginTop: 8,
        };
      case 'bottom-right':
        return {
          justifyContent: 'flex-end',
          marginTop: 8,
        };
      case 'top-right':
        return {
          justifyContent: 'flex-end',
          marginBottom: 8,
        };
    }
  })();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        ...positionStyles,
      }}
    >
      {logoUrl && (
        <img
          src={logoUrl}
          alt=""
          style={{
            maxHeight: 24,
            objectFit: 'contain',
          }}
          crossOrigin="anonymous"
        />
      )}
      {logoText && <span>{logoText}</span>}
    </div>
  );
}
