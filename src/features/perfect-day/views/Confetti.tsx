import { useEffect, useMemo } from 'react';

const COLORS = ['#818cf8', '#ec4899', '#34d399', '#fbbf24', '#60a5fa', '#f87171', '#fb923c'];

interface Piece {
  left: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
  round: boolean;
}

export function Confetti({ onDone }: { onDone: () => void }) {
  const pieces = useMemo<Piece[]>(
    () => Array.from({ length: 90 }, () => ({
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 1.6 + Math.random() * 2,
      delay: Math.random(),
      size: 6 + Math.random() * 8,
      round: Math.random() > 0.5,
    })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(onDone, 5000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="conf-w">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="cf"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            borderRadius: p.round ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
