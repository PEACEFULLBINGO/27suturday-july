import type { AppState } from '@/types';
import { DAYS } from '@/types';

export function createDefaultState(): AppState {
  return {
    tasks: DAYS.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as AppState['tasks']),
    notes: [],
    exam: { name: '', date: '' },
    topics: [],
    reviews: [],
    focus: { today: 0, sessions: 0, allTime: 0, lastDate: '' },
    sparks: 0,
    sparkDate: '',
    streak: { count: 0, lastDate: '' },
    pdStreak: { count: 0, lastDate: '' },
    pdCompDate: '',
    activity: {},
    chat: [],
    profile: { name: '', grade: '', goal: '2–3 hours/day', setup: false },
    settings: { theme: 'dark', fz: 'normal', hc: false },
  };
}
