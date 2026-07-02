import type { PdStatus } from '@/types';
import { PD_CRITERIA } from '@/types';

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface PerfectDayRingProps {
  status: PdStatus;
  pct: number;
}

export function PerfectDayRing({ status, pct }: PerfectDayRingProps) {
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
  const message = pct === 100 ? 'Perfect day! 🎉' : pct >= 75 ? 'Almost there!' : pct >= 50 ? 'Halfway there!' : 'Start your day!';

  return (
    <div className="pd-w">
      <div className="pd-rr">
        <div className="pd-ring" aria-hidden="true">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle className="pdr-bg" cx="26" cy="26" r={RADIUS} />
            <circle
              className="pdr-fill"
              cx="26" cy="26" r={RADIUS}
              style={{
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: offset,
                stroke: pct === 100 ? 'var(--sc)' : 'var(--pr)',
              }}
            />
          </svg>
          <div className="pdr-lbl">{pct}%</div>
        </div>
        <div className="pd-i">
          <h4>Perfect Day</h4>
          <p>{message}</p>
        </div>
      </div>
      <div className="pd-list">
        {PD_CRITERIA.map((c) => (
          <div className={`pdi${status[c.key] ? ' met' : ''}`} key={c.key}>
            <div className="pdi-d">{status[c.key] ? '✓' : ''}</div>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
