import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/AppStore';
import { useToast } from '@/components/layout/Toast/ToastContext';
import { todayIso } from '@/utils/formatters';

const PRESETS = [
  { label: 'Focus 25', minutes: 25 },
  { label: 'Focus 50', minutes: 50 },
  { label: 'Break 5', minutes: 5 },
];

export function useFocusTimer() {
  const { state, dispatch } = useAppStore();
  const { showToast } = useToast();
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const complete = useCallback(() => {
    setRunning(false);
    stopInterval();
    dispatch({ type: 'log_focus_session', payload: { minutes } });
    showToast(`🎉 ${minutes}-min session done! ⚡ +1 spark.`);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('StudyFlow Orbit', { body: `${minutes} min session complete! Keep going.` });
    }
    setSecondsLeft(minutes * 60);
  }, [dispatch, minutes, showToast, stopInterval]);

  useEffect(() => () => stopInterval(), [stopInterval]);

  const start = () => {
    if (running) return;
    setRunning(true);
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Defer to next tick so state updates (running/secondsLeft) settle before the side-effectful complete().
          setTimeout(complete, 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const pause = () => { setRunning(false); stopInterval(); };

  const reset = () => { setRunning(false); stopInterval(); setSecondsLeft(minutes * 60); };

  const selectPreset = (mins: number) => {
    setMinutes(mins);
    setSecondsLeft(mins * 60);
    setRunning(false);
    stopInterval();
  };

  const today = todayIso();
  const todayMinutes = state.focus.lastDate === today ? state.focus.today : 0;
  const todaySessions = state.focus.lastDate === today ? state.focus.sessions : 0;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return {
    presets: PRESETS,
    minutes,
    display: `${mm}:${ss}`,
    running,
    start, pause, reset, selectPreset,
    todayMinutes, todaySessions, allTimeMinutes: state.focus.allTime,
  };
}
