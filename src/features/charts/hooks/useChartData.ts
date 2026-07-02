import { useMemo } from 'react';
import type { AppState, Weekday } from '@/types';
import { DAYS } from '@/types';
import { weekdayFromDate } from '@/utils/formatters';
import { useAppStore } from '@/store/AppStore';

const PALETTE = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#fb923c'];

export function useThemeColors() {
  const { state } = useAppStore();
  const dark = state.settings.theme === 'dark';
  return {
    text: dark ? '#8892b0' : '#4a527a',
    grid: dark ? 'rgba(148,163,184,.08)' : 'rgba(30,41,90,.07)',
    primary: dark ? '#818cf8' : '#6366f1',
    palette: PALETTE,
  };
}

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const tzOffsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

export function useLineData(state: AppState) {
  return useMemo(() => {
    const labels: string[] = [];
    const values: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
      values.push(Number((state.activity[isoDaysAgo(i)] || 0).toFixed(2)));
    }
    return { labels, values };
  }, [state.activity]);
}

export function useSubjectData(state: AppState) {
  return useMemo(() => {
    const counts: Record<string, number> = {};
    for (const day of DAYS) {
      for (const t of state.tasks[day]) {
        if (t.tag === 'Study') counts[t.subject] = (counts[t.subject] || 0) + 1;
      }
    }
    return Object.keys(counts).length ? counts : { 'No data yet': 1 };
  }, [state.tasks]);
}

export function useCompletionBarData(state: AppState) {
  return useMemo(() => {
    const labels: string[] = [];
    const values: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dayName = DAYS[weekdayFromDate(d)];
      const dayTasks = state.tasks[dayName as Weekday];
      labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }));
      values.push(dayTasks.length ? Math.round((dayTasks.filter((t) => t.done).length / dayTasks.length) * 100) : 0);
    }
    return { labels, values };
  }, [state.tasks]);
}

export function useRadarData(state: AppState, today: string) {
  return useMemo(() => {
    const studyBlocks = DAYS.reduce((acc, d) => acc + state.tasks[d].filter((t) => t.tag === 'Study').length, 0);
    const fitnessBlocks = DAYS.reduce((acc, d) => acc + state.tasks[d].filter((t) => t.tag === 'Fitness').length, 0);
    const focusScore = state.focus.lastDate === today ? Math.min(state.focus.today / 25, 5) : 0;
    return {
      labels: ['Study', 'Focus', 'Fitness', 'Review', 'Notes', 'Exam Prep'],
      values: [
        studyBlocks,
        focusScore,
        fitnessBlocks,
        state.reviews.length,
        state.notes.length,
        state.topics.filter((t) => t.done).length,
      ],
    };
  }, [state, today]);
}

export function useHeatmapData(state: AppState) {
  return useMemo(() => {
    const cells: { date: string; value: number }[] = [];
    for (let i = 27; i >= 0; i--) {
      const date = isoDaysAgo(i);
      cells.push({ date, value: state.activity[date] || 0 });
    }
    return cells;
  }, [state.activity]);
}
