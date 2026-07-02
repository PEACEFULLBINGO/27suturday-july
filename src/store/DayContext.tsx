/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { Weekday } from '@/types';
import { DAYS } from '@/types';
import { weekdayFromDate } from '@/utils/formatters';

interface DayContextValue {
  curDay: Weekday;
  setCurDay: (day: Weekday) => void;
}

const DayContext = createContext<DayContextValue | null>(null);

export function DayProvider({ children }: { children: React.ReactNode }) {
  const [curDay, setCurDay] = useState<Weekday>(DAYS[weekdayFromDate(new Date())]);
  return <DayContext.Provider value={{ curDay, setCurDay }}>{children}</DayContext.Provider>;
}

// eslint-disable-next-line react/only-export-components
export function useCurDay(): DayContextValue {
  const ctx = useContext(DayContext);
  if (!ctx) throw new Error('useCurDay must be used within a DayProvider');
  return ctx;
}
