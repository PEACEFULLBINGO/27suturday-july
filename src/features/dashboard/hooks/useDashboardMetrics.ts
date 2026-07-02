import { useMemo } from 'react';
import type { Weekday } from '@/types';
import { DAYS } from '@/types';
import { useAppStore } from '@/store/AppStore';
import { todayIso } from '@/utils/formatters';

function isoDaysAgo(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n);
  const tzOffsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

export function useDashboardMetrics(curDay: Weekday) {
  const { state } = useAppStore();
  const today = todayIso();

  return useMemo(() => {
    const dayTasks = state.tasks[curDay] ?? [];
    const total = dayTasks.length;
    const done = dayTasks.filter((t) => t.done).length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    const focusTodayMin = state.focus.lastDate === today ? state.focus.today : 0;

    const studySlots = dayTasks.filter((t) => t.tag === 'Study' && t.start);
    let bestZone = '—';
    if (studySlots.length) {
      const avgHour = studySlots.reduce((sum, t) => sum + (parseInt(t.start, 10) || 0), 0) / studySlots.length;
      bestZone = avgHour < 12 ? 'Morning' : avgHour < 17 ? 'Afternoon' : 'Evening';
    }

    let weekHours = 0;
    for (let i = 0; i < 7; i++) weekHours += state.activity[isoDaysAgo(i)] || 0;
    const weekTasksDone = DAYS.reduce((acc, d) => acc + state.tasks[d].filter((t) => t.done).length, 0);

    return {
      completionRate,
      focusTodayMin,
      bestZone,
      streakDays: state.streak.count,
      hoursToday: focusTodayMin / 60,
      sparks: state.sparks,
      pdStreakDays: state.pdStreak.count,
      weekHours,
      weekFocusSessions: state.focus.sessions,
      weekTasksDone,
      weekStreak: state.streak.count,
      chipCategories: [...new Set(dayTasks.map((t) => t.tag))],
    };
  }, [state, curDay, today]);
}
