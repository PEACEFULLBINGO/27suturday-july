export type Weekday =
  | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'
  | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: Weekday[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

export type TaskTag = 'Study' | 'School' | 'Fitness' | 'Notes' | 'Rest';
export type Subject = 'Math' | 'Science' | 'English' | 'Coding' | 'Revision' | 'General';

export interface Task {
  id: string;
  title: string;
  start: string;   // "HH:MM" or ''
  end: string;     // "HH:MM" or ''
  tag: TaskTag;
  subject: Subject;
  note: string;
  done: boolean;
  date: string;     // ISO date the block was created
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tag: string;
  date: string; // ISO date
}

export interface Topic {
  id: string;
  name: string;
  done: boolean;
}

export type Mood = 'rough' | 'okay' | 'good' | 'great' | '';

export interface Review {
  id: string;
  date: string; // ISO date, one per day
  mood: Mood;
  wins: string;
  chal: string;
  plan: string;
}

export interface FocusState {
  today: number;      // minutes studied today
  sessions: number;   // sessions completed today
  allTime: number;    // total minutes, all time
  lastDate: string;   // ISO date the counters above apply to
}

export interface StreakState {
  count: number;
  lastDate: string;
}

export interface ExamState {
  name: string;
  date: string; // ISO date
}

export interface Profile {
  name: string;
  grade: string;
  goal: string;
  setup: boolean;
}

export type ThemeName = 'dark' | 'light';
export type FontScale = 'normal' | 'lg' | 'xl';

export interface Settings {
  theme: ThemeName;
  fz: FontScale;
  hc: boolean; // high contrast
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Daily study-minutes log, keyed by ISO date (yyyy-mm-dd). */
export type ActivityLog = Record<string, number>;

/** The full persisted application state — mirrors the original single-file build's `S` object. */
export interface AppState {
  tasks: Record<Weekday, Task[]>;
  notes: Note[];
  exam: ExamState;
  topics: Topic[];
  reviews: Review[];
  focus: FocusState;
  sparks: number;
  sparkDate: string;
  streak: StreakState;
  pdStreak: StreakState;
  pdCompDate: string;
  activity: ActivityLog;
  chat: ChatMessage[];
  profile: Profile;
  settings: Settings;
}

export const PD_CRITERIA = [
  { key: 'blocks', icon: '📚', label: 'Complete 80%+ blocks' },
  { key: 'focus', icon: '⚡', label: '25-min focus session' },
  { key: 'review', icon: '🌙', label: 'Write night review' },
  { key: 'spark', icon: '✨', label: 'Claim daily spark' },
] as const;

export type PdCriterionKey = typeof PD_CRITERIA[number]['key'];
export type PdStatus = Record<PdCriterionKey, boolean>;
