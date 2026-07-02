import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppStoreProvider, useAppStore } from '@/store/AppStore';
import { DayProvider, useCurDay } from '@/store/DayContext';
import { ToastProvider } from '@/components/layout/Toast/ToastContext';
import { Toast } from '@/components/layout/Toast/Toast';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Topbar } from '@/components/layout/Topbar/Topbar';
import { A11yPanel } from '@/components/layout/A11yPanel/A11yPanel';
import { ProfileModal } from '@/features/profile/views/ProfileModal';
import { usePerfectDay } from '@/features/perfect-day/hooks/usePerfectDay';
import { useScheduledPopup } from '@/features/perfect-day/hooks/useScheduledPopup';
import { PerfectDayPopup } from '@/features/perfect-day/views/PerfectDayPopup';
import { AchievementModal } from '@/features/perfect-day/views/AchievementModal';
import type { PdCriterionKey } from '@/types';

import { DashboardPage } from '@/features/dashboard/views/DashboardPage';
import { TimetablePage } from '@/features/timetable/views/TimetablePage';
import { GrowthChartsPage } from '@/features/charts/views/GrowthChartsPage';
import { AiStudioPage } from '@/features/ai-studio/views/AiStudioPage';
import { NotesPage } from '@/features/notes/views/NotesPage';
import { ExamSprintPage } from '@/features/exam-sprint/views/ExamSprintPage';
import { FocusRoomPage } from '@/features/focus-room/views/FocusRoomPage';
import { NightReviewPage } from '@/features/night-review/views/NightReviewPage';

/** Applies theme / font-scale / high-contrast settings to the document root. */
function ThemeEffects() {
  const { state } = useAppStore();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.settings.theme);
    document.documentElement.setAttribute('data-fz', state.settings.fz);
    document.documentElement.setAttribute('data-hc', String(state.settings.hc));
  }, [state.settings]);
  return null;
}

function GlobalShortcuts() {
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('input,textarea,select')) return;
      if (e.key === '/' || e.key === '?') { e.preventDefault(); navigate('/ai-studio'); }
      if (e.ctrlKey || e.metaKey) return;
      if (e.key === 'd') navigate('/');
      if (e.key === 't') navigate('/timetable');
      if (e.key === 'f') navigate('/focus-room');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);
  return null;
}

function Shell() {
  const { state } = useAppStore();
  const { curDay } = useCurDay();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [achievementOpen, setAchievementOpen] = useState(false);
  const navigate = useNavigate();

  const { status, count, pct } = usePerfectDay({ curDay, onAchieved: () => setAchievementOpen(true) });
  const { open: popupOpen, setOpen: setPopupOpen } = useScheduledPopup(pct === 100);

  // First-run profile prompt.
  useEffect(() => {
    if (!state.profile.setup) {
      const t = setTimeout(() => setProfileOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [state.profile.setup]);

  const handlePopupAction = (missing: PdCriterionKey) => {
    setPopupOpen(false);
    if (missing === 'blocks') navigate('/timetable');
    else if (missing === 'focus') navigate('/focus-room');
    else if (missing === 'review') navigate('/night-review');
    else navigate('/'); // spark is claimed from the sidebar
  };

  return (
    <div className="shell">
      <div className={`overlay${mobileOpen ? ' show' : ''}`} onClick={() => setMobileOpen(false)} />
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="main">
        <Topbar
          menuOpen={mobileOpen}
          onToggleMenu={() => setMobileOpen((o) => !o)}
          onOpenProfile={() => setProfileOpen(true)}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/charts" element={<GrowthChartsPage />} />
            <Route path="/ai-studio" element={<AiStudioPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/exam-sprint" element={<ExamSprintPage />} />
            <Route path="/focus-room" element={<FocusRoomPage />} />
            <Route path="/night-review" element={<NightReviewPage />} />
          </Routes>
        </div>
      </div>

      <PerfectDayPopup
        open={popupOpen && pct < 100}
        status={status}
        count={count}
        onClose={() => setPopupOpen(false)}
        onAction={handlePopupAction}
      />
      <AchievementModal open={achievementOpen} onClose={() => setAchievementOpen(false)} />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <Toast />
      <A11yPanel />
    </div>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <DayProvider>
          <HashRouter>
            <ThemeEffects />
            <GlobalShortcuts />
            <Shell />
          </HashRouter>
        </DayProvider>
      </ToastProvider>
    </AppStoreProvider>
  );
}
