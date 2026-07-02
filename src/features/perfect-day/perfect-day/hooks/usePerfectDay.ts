import { useEffect, useMemo, useRef } from 'react';
import { PD_CRITERIA, type PdStatus, type Weekday } from '@/types';
import { todayIso } from '@/utils/formatters';
import { useAppStore } from '@/store/AppStore';

export function computePdStatus(state: ReturnType<typeof useAppStore>['state'], curDay: Weekday): PdStatus {
  const today = todayIso();
  const dayTasks = state.tasks[curDay] ?? [];
  const done = dayTasks.filter((t) => t.done).length;
  const total = dayTasks.length;
  return {
    blocks: total > 0 && done >= Math.ceil(total * 0.8),
    focus: state.focus.lastDate === today && state.focus.today >= 25,
    review: state.reviews.some((r) => r.date === today),
    spark: state.sparkDate === today,
  };
}

export function pdCount(status: PdStatus): number {
  return Object.values(status).filter(Boolean).length;
}

export function pdPercent(status: PdStatus): number {
  return Math.round((pdCount(status) / PD_CRITERIA.length) * 100);
}

interface UsePerfectDayOptions {
  curDay: Weekday;
  /** Called once, the moment the player crosses 100% for the day (drives confetti + achievement modal). */
  onAchieved?: () => void;
}

export function usePerfectDay({ curDay, onAchieved }: UsePerfectDayOptions) {
  const { state, dispatch } = useAppStore();
  const status = useMemo(() => computePdStatus(state, curDay), [state, curDay]);
  const count = pdCount(status);
  const pct = pdPercent(status);
  const today = todayIso();
  const firedRef = useRef(false);

  useEffect(() => {
    if (pct === 100 && state.pdCompDate !== today && !firedRef.current) {
      firedRef.current = true;
      dispatch({ type: 'mark_perfect_day' });
      onAchieved?.();
    }
    if (pct < 100) firedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct, state.pdCompDate, today]);

  return { status, count, pct, criteria: PD_CRITERIA };
}
