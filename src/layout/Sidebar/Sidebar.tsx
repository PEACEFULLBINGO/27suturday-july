import { NavLink } from 'react-router-dom';
import { useAppStore } from '@/store/AppStore';
import { useCurDay } from '@/store/DayContext';
import { usePerfectDay } from '@/features/perfect-day/hooks/usePerfectDay';
import { PerfectDayRing } from '@/features/perfect-day/views/PerfectDayRing';
import { useToast } from '@/components/layout/Toast/ToastContext';
import { todayIso } from '@/utils/formatters';

const NAV_MAIN = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/timetable', icon: '🗓️', label: 'Timetable' },
  { to: '/charts', icon: '📈', label: 'Growth Charts' },
  { to: '/ai-studio', icon: '🤖', label: 'AI Studio' },
  { to: '/notes', icon: '📝', label: 'Notes Hub' },
];

const NAV_TOOLS = [
  { to: '/exam-sprint', icon: '🎯', label: 'Exam Sprint' },
  { to: '/focus-room', icon: '⚡', label: 'Focus Room' },
  { to: '/night-review', icon: '🌙', label: 'Night Review' },
];

interface SidebarProps {
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ mobileOpen, onNavigate }: SidebarProps) {
  const { state, dispatch } = useAppStore();
  const { curDay } = useCurDay();
  const { status, pct } = usePerfectDay({ curDay });
  const { showToast } = useToast();

  const claimSpark = () => {
    if (state.sparkDate === todayIso()) {
      showToast("⚡ Already claimed today's spark!");
      return;
    }
    dispatch({ type: 'claim_spark' });
    showToast('⚡ Spark claimed! Keep the momentum!');
  };

  return (
    <aside className={`sidebar${mobileOpen ? ' open' : ''}`} id="sidebar">
      <div className="brand">
        <div className="logo">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path d="M24 7C16.4 7 10 13.4 10 21c0 4.3 2 8.2 5.2 10.8M24 41c7.7 0 14-6.3 14-14 0-4.3-2-8.2-5.2-10.8" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="24" cy="24" r="5.8" fill="white" />
            <circle cx="35.4" cy="16.4" r="3.2" fill="white" opacity=".7" />
          </svg>
        </div>
        <div className="brand-t">
          <h1>StudyFlow Orbit</h1>
          <p>Plan. Focus. Grow daily.</p>
        </div>
      </div>

      <nav className="ng" aria-label="Main">
        <div className="nl">Main</div>
        {NAV_MAIN.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) => `nb${isActive ? ' active' : ''}`}
          >
            <span className="ni">{item.icon}</span>
            <span className="nt">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <nav className="ng" aria-label="Tools">
        <div className="nl">Tools</div>
        {NAV_TOOLS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => `nb${isActive ? ' active' : ''}`}
          >
            <span className="ni">{item.icon}</span>
            <span className="nt">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <PerfectDayRing status={status} pct={pct} />

      <div style={{ marginTop: 'auto' }}>
        <button className="claim-btn" onClick={claimSpark} aria-label="Claim today's spark">
          <span>⚡ Claim today's spark</span>
        </button>
      </div>
    </aside>
  );
}
