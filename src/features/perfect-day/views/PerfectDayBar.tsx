import type { PdStatus } from '@/types';
import { PD_CRITERIA } from '@/types';

export function PerfectDayBar({ status, count }: { status: PdStatus; count: number }) {
  return (
    <div className="pd-bar mb5">
      <div className="pd-bar-hd">
        <h4>🌟 Perfect Day Progress</h4>
        <span className="badge bv">{count} / {PD_CRITERIA.length}</span>
      </div>
      <div className="pd-crit">
        {PD_CRITERIA.map((c) => (
          <div className={`pd-c${status[c.key] ? ' met' : ''}`} key={c.key}>
            <div className="pd-ci">{c.icon}</div>
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
