import { useMemo, useState } from 'react';
import type { Subject, Task, TaskTag, Weekday } from '@/types';
import { useAppStore } from '@/store/AppStore';
import { useToast } from '@/components/layout/Toast/ToastContext';

function sortByStart(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.start && !b.start) return 0;
    if (!a.start) return 1;
    if (!b.start) return -1;
    return a.start.localeCompare(b.start);
  });
}

export interface NewTaskInput {
  title: string;
  start: string;
  end: string;
  tag: TaskTag;
  subject: Subject;
  note: string;
}

export function useTimetable(curDay: Weekday) {
  const { state, dispatch } = useAppStore();
  const { showToast } = useToast();
  const [filter, setFilter] = useState('');

  const sorted = useMemo(() => sortByStart(state.tasks[curDay] ?? []), [state.tasks, curDay]);
  const filtered = useMemo(() => {
    if (!filter) return sorted;
    const f = filter.toLowerCase();
    return sorted.filter((t) => t.title.toLowerCase().includes(f) || t.tag.toLowerCase().includes(f));
  }, [sorted, filter]);

  const addTask = (input: NewTaskInput) => {
    dispatch({ type: 'add_task', payload: { day: curDay, ...input } });
    showToast(`✅ Block added to ${curDay}!`);
  };

  const updateTask = (id: string, patch: Partial<Task>) => {
    dispatch({ type: 'update_task', payload: { id, patch } });
    showToast('✏️ Block updated!');
  };

  const toggleTask = (id: string) => dispatch({ type: 'toggle_task', payload: { id } });

  const deleteTask = (id: string) => {
    dispatch({ type: 'delete_task', payload: { id } });
    showToast('🗑️ Block deleted.');
  };

  return { tasks: filtered, totalCount: sorted.length, filter, setFilter, addTask, updateTask, toggleTask, deleteTask };
}
