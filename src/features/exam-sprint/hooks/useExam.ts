import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/AppStore';
import { useToast } from '@/components/layout/Toast/ToastContext';

export function useExam() {
  const { state, dispatch } = useAppStore();
  const { showToast } = useToast();
  const [name, setName] = useState(state.exam.name);
  const [date, setDate] = useState(state.exam.date);

  const daysRemaining = useMemo(() => {
    if (!state.exam.date) return null;
    const diff = Math.ceil((new Date(state.exam.date).getTime() - Date.now()) / 86_400_000);
    return diff;
  }, [state.exam.date]);

  const saveExam = () => {
    dispatch({ type: 'set_exam', payload: { name: name.trim(), date } });
    showToast('🎯 Exam saved!');
  };

  const topicsDone = state.topics.filter((t) => t.done).length;
  const topicsTotal = state.topics.length;
  const topicsPct = topicsTotal > 0 ? Math.round((topicsDone / topicsTotal) * 100) : 0;

  const addTopic = (topicName: string) => {
    dispatch({ type: 'add_topic', payload: { name: topicName } });
    showToast('📋 Topic added!');
  };
  const toggleTopic = (id: string) => dispatch({ type: 'toggle_topic', payload: { id } });
  const deleteTopic = (id: string) => {
    dispatch({ type: 'delete_topic', payload: { id } });
    showToast('🗑️ Topic removed.');
  };

  return {
    name, setName, date, setDate, daysRemaining, saveExam,
    topics: state.topics, topicsDone, topicsTotal, topicsPct,
    addTopic, toggleTopic, deleteTopic,
  };
}
