export interface PerfectDayResult {
  status: 'pending' | 'steady' | 'complete';
  pct: number;
}

export function usePerfectDay({ curDay }: { curDay: string }): PerfectDayResult {
  const pct = Math.min(100, Math.max(0, ((curDay.charCodeAt(0) + curDay.length) % 6) * 20));
  const status = pct >= 100 ? 'complete' : pct >= 60 ? 'steady' : 'pending';

  return { status, pct };
}
