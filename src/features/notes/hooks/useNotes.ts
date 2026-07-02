import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/AppStore';
import { useToast } from '@/components/layout/Toast/ToastContext';

export function useNotes() {
  const { state, dispatch } = useAppStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return state.notes;
    const s = search.toLowerCase();
    return state.notes.filter((n) => n.title.toLowerCase().includes(s) || (n.tag || '').toLowerCase().includes(s));
  }, [state.notes, search]);

  const addNote = (title: string, body: string, tag: string) => {
    dispatch({ type: 'add_note', payload: { title, body, tag } });
    showToast('📝 Note saved!');
  };

  const deleteNote = (id: string) => {
    dispatch({ type: 'delete_note', payload: { id } });
    showToast('🗑️ Note deleted.');
  };

  return { notes: filtered, totalCount: state.notes.length, search, setSearch, addNote, deleteNote };
}
