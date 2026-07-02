import { useState } from 'react';
import type { Mood } from '@/types';
import { useAppStore } from '@/store/AppStore';
import { useToast } from '@/components/layout/Toast/ToastContext';
import { todayIso } from '@/utils/formatters';

export function useNightReview() {
  const { state, dispatch } = useAppStore();
  const { showToast } = useToast();
  const [mood, setMood] = useState<Mood>('');
  const [wins, setWins] = useState('');
  const [chal, setChal] = useState('');
  const [plan, setPlan] = useState('');

  const today = todayIso();
  const hasReviewedToday = state.reviews.some((r) => r.date === today);

  const save = () => {
    if (!wins && !chal && !plan) { showToast('Add at least one field before saving.'); return; }
    dispatch({ type: 'save_review', payload: { mood, wins, chal, plan } });
    showToast('🌙 Review saved! Great job reflecting tonight.');
    setMood(''); setWins(''); setChal(''); setPlan('');
  };

  return {
    mood, setMood, wins, setWins, chal, setChal, plan, setPlan,
    save, hasReviewedToday, reviews: state.reviews,
  };
}
