/** Generates a short, collision-resistant id for client-created records. */
export function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/** Today's date as an ISO yyyy-mm-dd string, in the user's local timezone. */
export function todayIso(): string {
  const d = new Date();
  const tzOffsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

/** ISO date string for N days before/after today (negative = past). */
export function isoDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const tzOffsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

/** Short display date, e.g. "Jun 27". Falls back to the raw string for unparseable input. */
export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Converts a 24h "HH:MM" string to a 12h display string, e.g. "2:30PM". */
export function formatTime12h(time: string): string {
  if (!time) return '';
  try {
    const [h, m] = time.split(':');
    const hr = parseInt(h, 10);
    const display = hr % 12 || 12;
    return `${display}:${m}${hr < 12 ? 'AM' : 'PM'}`;
  } catch {
    return time;
  }
}

/** Maps a weekday name to its Mon-first index (0-6), independent of locale. */
export function weekdayFromDate(date: Date): number {
  const jsDay = date.getDay(); // 0 = Sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}
