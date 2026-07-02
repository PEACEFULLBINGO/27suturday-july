import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/AppStore';
import { useCurDay } from '@/store/DayContext';
import { usePerfectDay } from '@/features/perfect-day/hooks/usePerfectDay';
import { PerfectDayBar } from '@/features/perfect-day/views/PerfectDayBar';
import { TaskItem } from '@/features/timetable/views/TaskItem';
import { useTimetable } from '@/features/timetable/hooks/useTimetable';
import { QuickAiWidget } from '@/features/ai-studio/views/QuickAiWidget';
import { useLineData, useSubjectData } from '@/features/charts/hooks/useChartData';
import { LineChart } from '@/features/charts/views/LineChart';
import { DonutChart } from '@/features/charts/views/DonutChart';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';

const CHIP_CLASS: Record<string, string> = {
  Study: 'chip-study', School: 'chip-school', Fitness: 'chip-fitness', Rest: 'chip-rest', Notes: 'chip-notes',
};

export function DashboardPage() {
  const { state } = useAppStore();
  const { curDay } = useCurDay();
  const { status, count } = usePerfectDay({ curDay });
  const { tasks, toggleTask } = useTimetable(curDay);
  const metrics = useDashboardMetrics(curDay);
  const line = useLineData(state);
  const subjects = useSubjectData(state);

  const heroName = state.profile.name ? `Plan today, ${state.profile.name}.` : 'Plan today.';

  return (
    <section className="page">
      <div className="hero-g">
        <div className="hero-c">
          <div className="eyebrow">✨ Student Cockpit</div>
          <h3>{heroName} Build tomorrow.</h3>
          <p>Timetable, AI coach, focus timer, notes, and exam prep — saved offline, synced online.</p>
          <div className="stat-r">
            <div className="sb"><small>Study streak</small><strong>{metrics.streakDays} {metrics.streakDays === 1 ? 'day' : 'days'}</strong></div>
            <div className="sb"><small>Today's study</small><strong>{metrics.hoursToday.toFixed(1)} hrs</strong></div>
            <div className="sb"><small>Sparks earned</small><strong>⚡ {metrics.sparks}</strong></div>
          </div>
        </div>
        <div className="card cb stack g5x">
          <div style={{ fontSize: 'var(--txs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--txf)' }}>
            Today's Focus Areas
          </div>
          <div className="chips">
            {metrics.chipCategories.length === 0 ? (
              <span style={{ fontSize: 'var(--txs)', color: 'var(--txf)' }}>No blocks yet — go to Timetable →</span>
            ) : (
              metrics.chipCategories.map((c) => <span className={`chip ${CHIP_CLASS[c]}`} key={c}>{c}</span>)
            )}
          </div>
          <div className="stack g3x">
            <div className="fr jb" style={{ fontSize: 'var(--txs)' }}><span style={{ color: 'var(--txm)' }}>Completion rate</span><strong>{metrics.completionRate}%</strong></div>
            <div className="fr jb" style={{ fontSize: 'var(--txs)' }}><span style={{ color: 'var(--txm)' }}>Focus today</span><strong>{metrics.focusTodayMin} min</strong></div>
            <div className="fr jb" style={{ fontSize: 'var(--txs)' }}><span style={{ color: 'var(--txm)' }}>Best zone</span><strong>{metrics.bestZone}</strong></div>
            <div className="fr jb" style={{ fontSize: 'var(--txs)' }}><span style={{ color: 'var(--txm)' }}>Perfect day streak</span><strong>{metrics.pdStreakDays} days</strong></div>
          </div>
        </div>
      </div>

      <PerfectDayBar status={status} count={count} />

      <div className="wstat-g mb5">
        <div className="wsc wv"><div className="ws-ic">📚</div><div className="ws-lb">This week's study</div><div className="ws-vl">{metrics.weekHours.toFixed(1)} hrs</div></div>
        <div className="wsc wc"><div className="ws-ic">⚡</div><div className="ws-lb">Focus sessions</div><div className="ws-vl">{metrics.weekFocusSessions}</div></div>
        <div className="wsc we"><div className="ws-ic">✅</div><div className="ws-lb">Tasks completed</div><div className="ws-vl">{metrics.weekTasksDone}</div></div>
        <div className="wsc wa"><div className="ws-ic">🔥</div><div className="ws-lb">Streak</div><div className="ws-vl">{metrics.weekStreak}</div></div>
      </div>

      <div className="g2 mb5">
        <div className="card">
          <div className="ch">
            <h3>Today's blocks</h3>
            <Link to="/timetable" className="btn btn-g btn-sm">Full timetable →</Link>
          </div>
          <div className="cb">
            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty">
                  <div className="e-ic">🗓️</div>
                  <p>
                    No blocks for {curDay}.<br />
                    <Link to="/timetable" className="btn btn-g btn-sm" style={{ marginTop: '.5rem', display: 'inline-block' }}>Open Timetable →</Link>
                  </p>
                </div>
              ) : (
                tasks.map((t) => <TaskItem key={t.id} task={t} editable={false} onToggle={toggleTask} />)
              )}
            </div>
          </div>
        </div>
        <QuickAiWidget />
      </div>

      <div className="g2">
        <div className="card">
          <div className="ch"><h3>Study hours · 7 days</h3><span className="badge bv">Line</span></div>
          <div className="cb"><div className="cw"><LineChart labels={line.labels} values={line.values} /></div></div>
        </div>
        <div className="card">
          <div className="ch"><h3>Subject balance</h3><span className="badge bc">Doughnut</span></div>
          <div className="cb"><div className="cw"><DonutChart data={subjects} /></div></div>
        </div>
      </div>
    </section>
  );
}
