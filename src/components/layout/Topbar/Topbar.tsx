import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/AppStore';
import { useToast } from '@/components/layout/Toast/ToastContext';
import { exportBackup } from '@/store/persistence';
import { looksLikeBackup } from '@/utils/validators';
import type { Settings } from '@/types';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/timetable': 'Timetable',
  '/charts': 'Growth Charts',
  '/ai-studio': 'AI Studio',
  '/notes': 'Notes Hub',
  '/exam-sprint': 'Exam Sprint',
  '/focus-room': 'Focus Room',
  '/night-review': 'Night Review',
};

const FZ_ORDER: Settings['fz'][] = ['normal', 'lg', 'xl'];
const FZ_LABEL: Record<Settings['fz'], string> = { normal: 'Normal', lg: 'Large', xl: 'X-Large' };

interface TopbarProps {
  onToggleMenu: () => void;
  menuOpen: boolean;
  onOpenProfile: () => void;
}

export function Topbar({ onToggleMenu, menuOpen, onOpenProfile }: TopbarProps) {
  const { pathname } = useLocation();
  const { state, dispatch, syncStatus, isOnline } = useAppStore();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  const toggleTheme = () => {
    dispatch({ type: 'set_settings', payload: { theme: state.settings.theme === 'dark' ? 'light' : 'dark' } });
  };

  const cycleFont = () => {
    const next = FZ_ORDER[(FZ_ORDER.indexOf(state.settings.fz) + 1) % FZ_ORDER.length];
    dispatch({ type: 'set_settings', payload: { fz: next } });
    showToast(`Font: ${FZ_LABEL[next]}`);
  };

  const handleExport = () => {
    exportBackup(state);
    showToast('📤 Backup exported!');
  };

  const handleImport = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result));
        if (!looksLikeBackup(parsed)) throw new Error('not a backup');
        dispatch({ type: 'import_state', payload: parsed });
        showToast('📥 Data imported successfully!');
      } catch {
        showToast('⚠️ Invalid backup file. Please use a StudyFlow export.');
      }
    };
    reader.readAsText(file);
  };

  const syncPillClass = syncStatus === 'offline' ? 'sp-off' : syncStatus === 'syncing' ? 'sp-sync' : 'sp-on';
  const syncLabel = syncStatus === 'offline' ? 'Offline' : syncStatus === 'syncing' ? 'Syncing…' : syncStatus === 'error' ? 'Local only' : 'Synced';

  return (
    <>
      <header className="topbar">
        <div className="tb-l">
          <button className="tbb menu-tog" aria-label="Open menu" aria-expanded={menuOpen} onClick={onToggleMenu}>☰</button>
          <h2>{title}</h2>
        </div>
        <div className="tb-r">
          <button className="tbb" aria-label="Toggle theme" onClick={toggleTheme}>
            {state.settings.theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <div className={`sync-pill ${syncPillClass}`} role="status" aria-live="polite">
            <span className={`sdot${syncStatus !== 'synced' ? ' pulse' : ''}`} />
            <span>{syncLabel}</span>
          </div>
          <button className="tbb" title="Cycle font size" aria-label="Change font size" onClick={cycleFont}>Aa</button>
          <button className="tbb" aria-label="Profile" onClick={onOpenProfile}>
            👤 <span>{state.profile.name || 'Profile'}</span>
          </button>
          <button className="tbb" aria-label="Import data" title="Import backup" onClick={() => fileInputRef.current?.click()}>📥</button>
          <button className="tbb" aria-label="Export data" title="Export backup" onClick={handleExport}>📤</button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            className="sr"
            aria-label="Import file"
            onChange={(e) => { handleImport(e.target.files?.[0]); e.target.value = ''; }}
          />
        </div>
      </header>
      {!isOnline && (
        <div className="off-bar show" role="alert">
          📵 Offline — changes saved locally and will sync when you reconnect.
        </div>
      )}
    </>
  );
}

