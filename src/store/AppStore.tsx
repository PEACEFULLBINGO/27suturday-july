import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { todayIso } from '@/utils/formatters';
import type { AppStateShape, Settings } from '@/types';

export type FontSize = 'normal' | 'lg' | 'xl';

export interface AppSettings extends Settings {}

export interface AppState extends AppStateShape {}

export type AppAction =
  | { type: 'set_settings'; payload: Partial<AppSettings> }
  | { type: 'claim_spark' }
  | { type: 'import_state'; payload: AppStateShape };

const initialState: AppState = {
  settings: {
    hc: false,
    fz: 'normal',
    theme: 'light',
  },
  profile: {
    name: '',
  },
  sparkDate: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'set_settings':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case 'claim_spark':
      return {
        ...state,
        sparkDate: todayIso(),
      };
    case 'import_state':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

interface AppStoreContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  isOnline: boolean;
}

const AppStoreContext = createContext<AppStoreContextValue | undefined>(undefined);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const syncStatus: AppStoreContextValue['syncStatus'] = 'synced';
  const isOnline = true;

  useEffect(() => {
    document.body.dataset.hc = String(state.settings.hc);
    document.body.dataset.fz = state.settings.fz;
    document.body.dataset.theme = state.settings.theme;
  }, [state.settings.hc, state.settings.fz, state.settings.theme]);

  const value = useMemo(() => ({ state, dispatch, syncStatus, isOnline }), [state, syncStatus, isOnline]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }

  return context;
}
