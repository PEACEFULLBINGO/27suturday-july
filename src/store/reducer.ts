import type {
  AppState, ChatMessage, ExamState, Note, Profile, Review, Settings, Task, TaskTag, Subject, Weekday,
} from '@/types';
import { makeId, todayIso, isoDateOffset } from '@/utils/formatters';

export type Action =
  | { type: 'hydrate'; payload: Partial<AppState> }
  | { type: 'import_state'; payload: Partial<AppState> }
  | { type: 'add_task'; payload: { day: Weekday; title: string; start: string; end: string; tag: TaskTag; subject: Subject; note: string } }
  | { type: 'update_task'; payload: { id: string; patch: Partial<Task> } }
  | { type: 'toggle_task'; payload: { id: string } }
  | { type: 'delete_task'; payload: { id: string } }
  | { type: 'add_note'; payload: { title: string; body: string; tag: string } }
  | { type: 'delete_note'; payload: { id: string } }
  | { type: 'set_exam'; payload: ExamState }
  | { type: 'add_topic'; payload: { name: string } }
  | { type: 'toggle_topic'; payload: { id: string } }
  | { type: 'delete_topic'; payload: { id: string } }
  | { type: 'save_review'; payload: Omit<Review, 'id' | 'date'> }
  | { type: 'log_focus_session'; payload: { minutes: number } }
  | { type: 'claim_spark' }
  | { type: 'set_profile'; payload: Profile }
  | { type: 'set_settings'; payload: Partial<Settings> }
  | { type: 'set_chat'; payload: ChatMessage[] }
  | { type: 'mark_perfect_day' };

/** Bumps a day-streak counter: +1 if it ran yesterday, reset to 1 otherwise. Idempotent for the same day. */
function bumpStreak(streak: { count: number; lastDate: string }, today: string): { count: number; lastDate: string } {
  if (streak.lastDate === today) return streak;
  const yesterday = isoDateOffset(-1);
  return { count: streak.lastDate === yesterday ? streak.count + 1 : 1, lastDate: today };
}

function findTaskDay(tasks: AppState['tasks'], id: string): Weekday | null {
  for (const day of Object.keys(tasks) as Weekday[]) {
    if (tasks[day].some((t) => t.id === id)) return day;
  }
  return null;
}

export function appReducer(state: AppState, action: Action): AppState {
  const today = todayIso();

  switch (action.type) {
    case 'hydrate':
    case 'import_state':
      return { ...state, ...action.payload };

    case 'add_task': {
      const { day, title, start, end, tag, subject, note } = action.payload;
      const task: Task = { id: makeId(), title, start, end, tag, subject, note, done: false, date: today };
      const activity = tag === 'Study' ? { ...state.activity, [today]: (state.activity[today] || 0) + 1 } : state.activity;
      return { ...state, activity, tasks: { ...state.tasks, [day]: [...state.tasks[day], task] } };
    }

    case 'update_task': {
      const day = findTaskDay(state.tasks, action.payload.id);
      if (!day) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [day]: state.tasks[day].map((t) => (t.id === action.payload.id ? { ...t, ...action.payload.patch } : t)),
        },
      };
    }

    case 'toggle_task': {
      const day = findTaskDay(state.tasks, action.payload.id);
      if (!day) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [day]: state.tasks[day].map((t) => (t.id === action.payload.id ? { ...t, done: !t.done } : t)),
        },
      };
    }

    case 'delete_task': {
      const day = findTaskDay(state.tasks, action.payload.id);
      if (!day) return state;
      return { ...state, tasks: { ...state.tasks, [day]: state.tasks[day].filter((t) => t.id !== action.payload.id) } };
    }

    case 'add_note': {
      const note: Note = { id: makeId(), date: today, ...action.payload };
      return { ...state, notes: [...state.notes, note] };
    }

    case 'delete_note':
      return { ...state, notes: state.notes.filter((n) => n.id !== action.payload.id) };

    case 'set_exam':
      return { ...state, exam: action.payload };

    case 'add_topic':
      return { ...state, topics: [...state.topics, { id: makeId(), name: action.payload.name, done: false }] };

    case 'toggle_topic':
      return { ...state, topics: state.topics.map((t) => (t.id === action.payload.id ? { ...t, done: !t.done } : t)) };

    case 'delete_topic':
      return { ...state, topics: state.topics.filter((t) => t.id !== action.payload.id) };

    case 'save_review': {
      const review: Review = { id: makeId(), date: today, ...action.payload };
      const reviews = [...state.reviews.filter((r) => r.date !== today), review];
      return { ...state, reviews, streak: bumpStreak(state.streak, today) };
    }

    case 'log_focus_session': {
      const { minutes } = action.payload;
      const carriedOver = state.focus.lastDate === today;
      const focus = {
        today: (carriedOver ? state.focus.today : 0) + minutes,
        sessions: (carriedOver ? state.focus.sessions : 0) + 1,
        allTime: state.focus.allTime + minutes,
        lastDate: today,
      };
      return {
        ...state,
        focus,
        sparks: state.sparks + 1,
        activity: { ...state.activity, [today]: (state.activity[today] || 0) + minutes / 60 },
        streak: bumpStreak(state.streak, today),
      };
    }

    case 'claim_spark': {
      if (state.sparkDate === today) return state;
      return { ...state, sparkDate: today, sparks: state.sparks + 1, streak: bumpStreak(state.streak, today) };
    }

    case 'set_profile':
      return { ...state, profile: action.payload };

    case 'set_settings':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'set_chat':
      return { ...state, chat: action.payload };

    case 'mark_perfect_day': {
      if (state.pdCompDate === today) return state;
      return { ...state, pdCompDate: today, pdStreak: bumpStreak(state.pdStreak, today) };
    }

    default:
      return state;
  }
}
