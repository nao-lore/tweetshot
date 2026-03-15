import { useEffect, useState } from 'react';

interface Props {
  active: boolean;
  onDone: () => void;
}

const COLORS = ['#667eea', '#f5576c', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];

export function Confetti({ active, onDone }: Props) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number; rotation: number }>>([]);

  useEffect(() => {
    if (!active) return;
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      size: 4 + Math.random() * 6,
      rotation: 360 + Math.random() * 720,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => {
      setParticles([]);
      onDone();
    }, 2500);
    return () => clearTimeout(timer);
  }, [active, onDone]);

  if (particles.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 99999,
      overflow: 'hidden',
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            ['--confetti-rotation' as string]: `${p.rotation}deg`,
            animation: `confettiFall ${1.5 + Math.random()}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(var(--confetti-rotation)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
