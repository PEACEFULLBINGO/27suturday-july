/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { AppState } from '@/types';
import { createDefaultState } from './defaultState';
import { appReducer, type Action } from './reducer';
import { loadLocal, saveLocal, localOnlySync, type CloudSync, type SyncStatus } from './persistence';

interface AppStoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  syncStatus: SyncStatus;
  isOnline: boolean;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

/**
 * Swap this for a real adapter (Firebase, your own API, etc.) once a backend
 * exists — see store/persistence.ts for the interface and an example.
 */
const cloudSync: CloudSync = localOnlySync;

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => ({
    ...createDefaultState(),
    ...(loadLocal() ?? {}),
  }));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(navigator.onLine ? 'local' : 'offline');
  const hasHydratedFromCloud = useRef(false);

  // One-time pull from the cloud adapter on mount (no-op with the local-only adapter).
  useEffect(() => {
    if (hasHydratedFromCloud.current) return;
    hasHydratedFromCloud.current = true;
    (async () => {
      if (!navigator.onLine) return;
      const remote = await cloudSync.pull();
      if (remote) dispatch({ type: 'hydrate', payload: remote });
    })();
  }, []);

  // Persist on every state change: localStorage always, cloud adapter when online.
  useEffect(() => {
    saveLocal(state);
    if (!isOnline) {
      setSyncStatus('offline');
      return;
    }
    setSyncStatus('syncing');
    let cancelled = false;
    cloudSync.push(state).then(
      () => { if (!cancelled) setSyncStatus('synced'); },
      () => { if (!cancelled) setSyncStatus('error'); },
    );
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isOnline]);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => { setIsOnline(false); setSyncStatus('offline'); };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const value = useMemo(() => ({ state, dispatch, syncStatus, isOnline }), [state, syncStatus, isOnline]);
  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within an AppStoreProvider');
  return ctx;
}
