import { describe, expect, it } from 'vitest';
import { formatTime12h, formatShortDate, makeId, todayIso, weekdayFromDate } from '@/utils/formatters';

describe('formatTime12h', () => {
  it('formats morning times', () => {
    expect(formatTime12h('09:30')).toBe('9:30AM');
  });
  it('formats afternoon times', () => {
    expect(formatTime12h('14:05')).toBe('2:05PM');
  });
  it('formats midnight and noon edge cases', () => {
    expect(formatTime12h('00:00')).toBe('12:00AM');
    expect(formatTime12h('12:00')).toBe('12:00PM');
  });
  it('returns an empty string for empty input', () => {
    expect(formatTime12h('')).toBe('');
  });
});

describe('formatShortDate', () => {
  it('formats a valid ISO date without throwing', () => {
    expect(formatShortDate('2026-06-28')).toMatch(/Jun/);
  });
  it('falls back to the raw string for invalid input', () => {
    expect(formatShortDate('not-a-date')).toBe('not-a-date');
  });
});

describe('makeId', () => {
  it('generates unique, non-empty ids', () => {
    const a = makeId();
    const b = makeId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });
});

describe('todayIso', () => {
  it('returns a yyyy-mm-dd formatted string', () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('weekdayFromDate', () => {
  it('maps Sunday to index 6 (Mon-first week)', () => {
    // 2026-06-28 is a Sunday.
    expect(weekdayFromDate(new Date('2026-06-28T12:00:00'))).toBe(6);
  });
  it('maps Monday to index 0', () => {
    expect(weekdayFromDate(new Date('2026-06-29T12:00:00'))).toBe(0);
  });
});
