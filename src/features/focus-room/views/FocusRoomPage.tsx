import { Button } from '@/components/Button/Button';
import { useFocusTimer } from '../hooks/useFocusTimer';

export function FocusRoomPage() {
  const { presets, minutes, display, running, start, pause, reset, selectPreset, todayMinutes, todaySessions, allTimeMinutes } = useFocusTimer();

  return (
    <section className="page">
      <div className="pg-hd">
        <h2>Focus Room</h2>
        <p>Pomodoro-style timer. Completed sessions earn sparks and log to your activity.</p>
      </div>
      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <div className="cb">
          <div className="timer-wrap">
            <div className="tmodes" role="group" aria-label="Timer presets">
              {presets.map((p) => (
                <button
                  key={p.label}
                  className={`tmode${p.minutes === minutes ? ' active' : ''}`}
                  aria-pressed={p.minutes === minutes}
                  onClick={() => selectPreset(p.minutes)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="tdisplay" aria-live="polite" aria-label="Timer">{display}</div>
            <div className="tctrl">
              <Button variant="primary" onClick={start} disabled={running}>▶ Start</Button>
              <Button variant="ghost" onClick={pause} disabled={!running}>⏸ Pause</Button>
              <Button variant="ghost" onClick={reset}>↺ Reset</Button>
            </div>
            <div className="g3">
              <div className="wsc wv"><div className="ws-ic">⏱️</div><div className="ws-lb">Today's focus</div><div className="ws-vl">{todayMinutes} min</div></div>
              <div className="wsc wc"><div className="ws-ic">🔥</div><div className="ws-lb">Sessions today</div><div className="ws-vl">{todaySessions}</div></div>
              <div className="wsc we"><div className="ws-ic">📊</div><div className="ws-lb">All-time min</div><div className="ws-vl">{allTimeMinutes}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
