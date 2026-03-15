export type DeviceType = 'none' | 'iphone' | 'android' | 'macbook' | 'ipad';

export const deviceOptions: { id: DeviceType; label: string }[] = [
  { id: 'none', label: 'なし' },
  { id: 'iphone', label: 'iPhone' },
  { id: 'android', label: 'Android' },
  { id: 'macbook', label: 'MacBook' },
  { id: 'ipad', label: 'iPad' },
];

interface Props {
  device: DeviceType;
  children: React.ReactNode;
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 44,
        padding: '12px 10px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 2px #333',
      }}
    >
      {/* Notch area */}
      <div
        style={{
          width: '100%',
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: 4,
        }}
      >
        {/* Status bar left - time */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          9:41
        </div>
        {/* Notch */}
        <div
          style={{
            width: 120,
            height: 28,
            background: '#1a1a1a',
            borderRadius: '0 0 16px 16px',
            position: 'relative',
            zIndex: 2,
          }}
        />
        {/* Status bar right - signal, wifi, battery */}
        <div
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Signal bars */}
          <svg width="14" height="10" viewBox="0 0 14 10">
            <rect x="0" y="7" width="2" height="3" rx="0.5" fill="#fff" />
            <rect x="3" y="5" width="2" height="5" rx="0.5" fill="#fff" />
            <rect x="6" y="3" width="2" height="7" rx="0.5" fill="#fff" />
            <rect x="9" y="0" width="2" height="10" rx="0.5" fill="#fff" />
          </svg>
          {/* Battery */}
          <svg width="22" height="10" viewBox="0 0 22 10">
            <rect
              x="0"
              y="0"
              width="18"
              height="10"
              rx="2"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
            />
            <rect x="2" y="2" width="14" height="6" rx="1" fill="#34c759" />
            <rect x="19" y="3" width="2" height="4" rx="0.5" fill="#fff" />
          </svg>
        </div>
      </div>

      {/* Screen */}
      <div
        style={{
          borderRadius: 32,
          overflow: 'hidden',
          background: '#000',
          width: '100%',
        }}
      >
        {children}
      </div>

      {/* Home indicator */}
      <div
        style={{
          width: 120,
          height: 4,
          background: '#666',
          borderRadius: 2,
          marginTop: 10,
        }}
      />
    </div>
  );
}

function AndroidFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 28,
        padding: '10px 8px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1.5px #333',
      }}
    >
      {/* Top bezel with punch-hole camera */}
      <div
        style={{
          width: '100%',
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: 2,
        }}
      >
        {/* Punch-hole camera */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#333',
            border: '1.5px solid #444',
          }}
        />
        {/* Status bar right */}
        <div
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg width="14" height="10" viewBox="0 0 14 10">
            <rect x="0" y="7" width="2" height="3" rx="0.5" fill="#aaa" />
            <rect x="3" y="5" width="2" height="5" rx="0.5" fill="#aaa" />
            <rect x="6" y="3" width="2" height="7" rx="0.5" fill="#aaa" />
            <rect x="9" y="0" width="2" height="10" rx="0.5" fill="#aaa" />
          </svg>
          <svg width="18" height="10" viewBox="0 0 18 10">
            <rect x="0" y="0" width="16" height="10" rx="2" fill="none" stroke="#aaa" strokeWidth="1" />
            <rect x="2" y="2" width="12" height="6" rx="1" fill="#aaa" />
            <rect x="16.5" y="3" width="1.5" height="4" rx="0.5" fill="#aaa" />
          </svg>
        </div>
        {/* Time left */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#aaa',
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          12:00
        </div>
      </div>

      {/* Screen */}
      <div
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          background: '#000',
          width: '100%',
        }}
      >
        {children}
      </div>

      {/* Bottom bezel (thin) */}
      <div style={{ height: 6 }} />
    </div>
  );
}

function MacBookFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Screen portion */}
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: '12px 12px 0 0',
          padding: '8px 8px 0 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Camera dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#333',
            border: '1px solid #444',
            marginBottom: 6,
          }}
        />
        {/* Screen */}
        <div
          style={{
            borderRadius: '4px 4px 0 0',
            overflow: 'hidden',
            background: '#000',
            width: '100%',
          }}
        >
          {children}
        </div>
      </div>
      {/* Hinge / base */}
      <div
        style={{
          width: '105%',
          height: 12,
          background: 'linear-gradient(to bottom, #2a2a2a, #1a1a1a)',
          borderRadius: '0 0 2px 2px',
          position: 'relative',
        }}
      >
        {/* Center notch on hinge */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 4,
            background: '#333',
            borderRadius: '0 0 4px 4px',
          }}
        />
      </div>
      {/* Keyboard body (simplified) */}
      <div
        style={{
          width: '115%',
          height: 8,
          background: 'linear-gradient(to bottom, #1a1a1a, #111)',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );
}

function IPadFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        borderRadius: 20,
        padding: '14px 14px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1.5px #333',
      }}
    >
      {/* Top bezel with camera */}
      <div
        style={{
          width: '100%',
          height: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#333',
            border: '1px solid #444',
          }}
        />
      </div>

      {/* Screen */}
      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          background: '#000',
          width: '100%',
        }}
      >
        {children}
      </div>

      {/* Bottom bezel */}
      <div style={{ height: 10 }} />
    </div>
  );
}

export function DeviceMockup({ device, children }: Props) {
  switch (device) {
    case 'iphone':
      return <IPhoneFrame>{children}</IPhoneFrame>;
    case 'android':
      return <AndroidFrame>{children}</AndroidFrame>;
    case 'macbook':
      return <MacBookFrame>{children}</MacBookFrame>;
    case 'ipad':
      return <IPadFrame>{children}</IPadFrame>;
    case 'none':
    default:
      return <>{children}</>;
  }
}
