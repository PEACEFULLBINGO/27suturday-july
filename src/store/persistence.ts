import type { AppState } from '@/types';

const STORAGE_KEY = 'studyflow_orbit_v1';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'offline' | 'error';

/**
 * The original single-file build persisted to `window.storage`, an API that
 * only exists inside the Claude.ai Artifacts sandbox. Outside that sandbox
 * there is no such global, so this app talks to a `CloudSync` interface
 * instead — implement it against Firebase, Supabase, or your own backend
 * when you're ready to add real cross-device sync. Until then, the
 * `localOnlySync` adapter below makes the app fully functional offline.
 */
export interface CloudSync {
  /** Pull remote state, or null if there's nothing saved yet / sync isn't configured. */
  pull(): Promise<AppState | null>;
  /** Push local state to the remote store. */
  push(state: AppState): Promise<void>;
}

/** No-op adapter — the app works great offline-only until a real backend is wired in. */
export const localOnlySync: CloudSync = {
  async pull() {
    return null;
  },
  async push() {
    // intentionally empty
  },
};

/*
Example Firebase-backed adapter, once you've migrated the auth flow:

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export function createFirestoreSync(uid: string): CloudSync {
  const db = getFirestore();
  const ref = doc(db, 'users', uid, 'app', 'state');
  return {
    async pull() {
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as AppState) : null;
    },
    async push(state) {
      await setDoc(ref, state);
    },
  };
}
*/

export function loadLocal(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<AppState>) : null;
  } catch {
    return null;
  }
}

export function saveLocal(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage can throw in private-browsing / quota-exceeded cases — fail silently,
    // the in-memory state is still correct for the rest of this session.
  }
}

export function exportBackup(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `studyflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
