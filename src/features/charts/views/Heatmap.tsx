import { formatShortDate } from '@/utils/formatters';

export function Heatmap({ cells }: { cells: { date: string; value: number }[] }) {
  return (
    <>
      <div className="hm">
        {cells.map(({ date, value }) => {
          const intensity = Math.min(value / 4, 1);
          const bg = intensity === 0 ? 'var(--sf3)' : `color-mix(in srgb, var(--pr) ${Math.round(intensity * 100)}%, var(--sf3))`;
          return (
            <div
              key={date}
              className="hmc"
              style={{ background: bg }}
              title={`${formatShortDate(date)}: ${value.toFixed(1)} hrs`}
            />
          );
        })}
      </div>
      <div className="fr" style={{ gap: '.4rem', marginTop: '.7rem', fontSize: 'var(--txs)', color: 'var(--txf)' }}>
        <span>Less</span>
        <div style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--sf3)' }} />
        <div style={{ width: 11, height: 11, borderRadius: 3, background: 'color-mix(in srgb, var(--pr) 35%, var(--sf3))' }} />
        <div style={{ width: 11, height: 11, borderRadius: 3, background: 'color-mix(in srgb, var(--pr) 65%, var(--sf3))' }} />
        <div style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--pr)' }} />
        <span>More</span>
      </div>
    </>
  );
}
