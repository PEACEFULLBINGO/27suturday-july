import { createContext, useContext, type ReactNode } from 'react';
import { todayIso } from '@/utils/formatters';

interface DayContextValue {
  curDay: string;
}

const DayContext = createContext<DayContextValue | undefined>(undefined);

export function DayContextProvider({ children, curDay = todayIso() }: { children: ReactNode; curDay?: string }) {
  return <DayContext.Provider value={{ curDay }}>{children}</DayContext.Provider>;
}

export function useCurDay() {
  const context = useContext(DayContext);
  return context ?? { curDay: todayIso() };
}
