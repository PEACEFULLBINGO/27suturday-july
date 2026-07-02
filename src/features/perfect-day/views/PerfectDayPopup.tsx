import type { PdStatus } from '@/types';
import { PD_CRITERIA, type PdCriterionKey } from '@/types';

interface PerfectDayPopupProps {
  open: boolean;
  status: PdStatus;
  count: number;
  onClose: () => void;
  onAction: (missing: PdCriterionKey) => void;
}

function copyForHour(hour: number, count: number) {
  if (hour >= 6 && hour < 12) return ['🌅 Good morning!', 'Plan your perfect day', "Here's what makes today perfect:"];
  if (hour >= 12 && hour < 17) return ['☀️ Keep going!', `${4 - count} criteria left`, 'You still have time to nail it:'];
  if (hour >= 17 && hour < 21) return ['🌆 Evening check-in', 'Finish strong!', "Don't end the day without these:"];
  return ['🌙 Last chance', `${count}/4 done today`, 'Final push — almost there:'];
}

export function PerfectDayPopup({ open, status, count, onClose, onAction }: PerfectDayPopupProps) {
  const [title, sub, msg] = copyForHour(new Date().getHours(), count);
  const firstMissing = PD_CRITERIA.find((c) => !status[c.key]);

  return (
    <div className={`pd-pop${open ? ' show' : ''}`} role="dialog" aria-modal="true" aria-label="Perfect Day Progress">
      <div className="pd-ph">
        <div>
          <h4>{title}</h4>
          <p>{sub}</p>
        </div>
        <button className="pp-x" aria-label="Close" onClick={onClose}>✕</button>
      </div>
      <div className="pd-pb">
        <p className="msg">{msg}</p>
        <div className="pd-pts">
          {PD_CRITERIA.map((c) => (
            <div className={`pd-pt${status[c.key] ? ' done' : ''}`} key={c.key}>
              <span>{status[c.key] ? '✅' : '⬜'}</span>
              <span>{c.icon} {c.label}</span>
            </div>
          ))}
        </div>
        <button
          className="btn btn-p btn-sm w100"
          onClick={() => onAction(firstMissing?.key ?? 'spark')}
        >
          Take action →
        </button>
      </div>
    </div>
  );
}
