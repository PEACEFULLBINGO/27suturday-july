import { describe, expect, it } from 'vitest';
import { appReducer } from '@/store/reducer';
import { createDefaultState } from '@/store/defaultState';

describe('appReducer', () => {
  it('adds a task to the right day and logs study activity', () => {
    const state = createDefaultState();
    const next = appReducer(state, {
      type: 'add_task',
      payload: { day: 'Monday', title: 'Algebra', start: '09:00', end: '10:00', tag: 'Study', subject: 'Math', note: '' },
    });
    expect(next.tasks.Monday).toHaveLength(1);
    expect(next.tasks.Monday[0].title).toBe('Algebra');
    expect(Object.values(next.activity).some((v: number) => v > 0)).toBe(true);
  });

  it('toggles a task by id regardless of which day it lives on', () => {
    let state = createDefaultState();
    state = appReducer(state, {
      type: 'add_task',
      payload: { day: 'Tuesday', title: 'Reading', start: '', end: '', tag: 'School', subject: 'English', note: '' },
    });
    const id = state.tasks.Tuesday[0].id;
    state = appReducer(state, { type: 'toggle_task', payload: { id } });
    expect(state.tasks.Tuesday[0].done).toBe(true);
  });

  it('claim_spark is idempotent for the same day', () => {
    let state = createDefaultState();
    state = appReducer(state, { type: 'claim_spark' });
    expect(state.sparks).toBe(1);
    state = appReducer(state, { type: 'claim_spark' });
    expect(state.sparks).toBe(1); // second claim same day is a no-op
  });

  it('save_review replaces an existing same-day review instead of duplicating it', () => {
    let state = createDefaultState();
    state = appReducer(state, { type: 'save_review', payload: { mood: 'good', wins: 'a', chal: '', plan: '' } });
    state = appReducer(state, { type: 'save_review', payload: { mood: 'great', wins: 'b', chal: '', plan: '' } });
    expect(state.reviews).toHaveLength(1);
    expect(state.reviews[0].wins).toBe('b');
  });

  it('log_focus_session accumulates minutes within the same day', () => {
    let state = createDefaultState();
    state = appReducer(state, { type: 'log_focus_session', payload: { minutes: 25 } });
    state = appReducer(state, { type: 'log_focus_session', payload: { minutes: 25 } });
    expect(state.focus.today).toBe(50);
    expect(state.focus.sessions).toBe(2);
    expect(state.focus.allTime).toBe(50);
  });
});
