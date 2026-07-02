import { DAYS, type Weekday } from '@/types';
import { useAppStore } from '@/store/AppStore';

export function DayTabs({ curDay, onSelect }: { curDay: Weekday; onSelect: (d: Weekday) => void }) {
  const { state } = useAppStore();
  return (
    <div className="day-tabs">
      {DAYS.map((d) => {
        const count = state.tasks[d]?.length ?? 0;
        return (
          <button key={d} className={`dt${d === curDay ? ' active' : ''}`} onClick={() => onSelect(d)}>
            {d.slice(0, 3)}
            {count > 0 && <span style={{ fontSize: 9, opacity: 0.65 }}> ({count})</span>}
          </button>
        );
      })}
    </div>
  );
}
