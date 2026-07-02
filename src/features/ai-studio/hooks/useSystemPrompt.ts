import type { AppState, PdStatus, Weekday } from '@/types';
import { PD_CRITERIA } from '@/types';
import { formatTime12h } from '@/utils/formatters';

export function buildSystemPrompt(state: AppState, curDay: Weekday, status: PdStatus): string {
  const count = Object.values(status).filter(Boolean).length;
  const profile = state.profile;
  const dayTasks = state.tasks[curDay] ?? [];
  const scheduleStr = dayTasks.length
    ? dayTasks.map((t) => `• ${t.start ? formatTime12h(t.start) : '?'} ${t.title} [${t.tag}]${t.done ? ' ✓' : ''}`).join('\n')
    : 'None added';

  const missing = PD_CRITERIA.filter((c) => !status[c.key]).map((c) => c.label);

  return `You are StudyBot, a concise AI coach in StudyFlow Orbit.
CRITICAL: Keep ALL responses under 130 words. Be direct, warm, specific. No bullet overload.
${profile.name ? `Student: ${profile.name} (${profile.grade || 'student'}). Goal: ${profile.goal || 'study daily'}.` : ''}
TODAY (${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}):
Perfect Day: ${count}/4 — ${missing.length ? missing.join(', ') : 'All done! 🎉'}
${curDay} schedule:
${scheduleStr}
PERFECT DAY = 80%+ study blocks + 25-min focus session + night review + claim spark.
When asked about perfect day: state exactly what's missing and fastest way to do it.
For schedule changes: give specific, actionable advice.`;
}
