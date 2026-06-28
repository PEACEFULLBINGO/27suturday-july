interface PerfectDayRingProps {
  status: 'pending' | 'steady' | 'complete';
  pct: number;
}

export function PerfectDayRing({ status, pct }: PerfectDayRingProps) {
  return (
    <div className="perfect-day-ring" role="status" aria-label={`Perfect day progress ${pct}%`}>
      <span>{status}</span>
      <strong>{pct}%</strong>
    </div>
  );
}
