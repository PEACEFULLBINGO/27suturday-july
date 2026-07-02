import { useState } from 'react';
import { Modal } from '@/components/layout/Modal/Modal';
import { Button } from '@/components/button/Button';
import { FieldLabel, TextInput, Select } from '@/components/InputField/InputField';
import { useAppStore } from '@/store/AppStore';
import { useToast } from '@/components/layout/Toast/ToastContext';

const GRADES = [
  'Grade 8–9', 'Grade 10–11', 'Grade 12 / A-Levels',
  'University Year 1', 'University Year 2', 'University Year 3+',
  'Postgraduate', 'Self-study / Other',
];
const GOALS = ['1–2 hours/day', '2–3 hours/day', '3–4 hours/day', '4–5 hours/day', '5+ hours/day'];

export function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useAppStore();
  const { showToast } = useToast();
  const [name, setName] = useState(state.profile.name);
  const [grade, setGrade] = useState(state.profile.grade);
  const [goal, setGoal] = useState(state.profile.goal || GOALS[1]);

  const save = () => {
    dispatch({ type: 'set_profile', payload: { name: name.trim(), grade, goal, setup: true } });
    showToast(`✅ Profile saved! Hi, ${name.trim() || 'student'} 👋`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} className="prof-modal" labelledBy="profile-title">
      <h3 id="profile-title">👋 Welcome to StudyFlow Orbit!</h3>
      <p>Set up your profile to personalise the experience.</p>

      <FieldLabel htmlFor="pfName">Your name</FieldLabel>
      <TextInput id="pfName" className="mb4" placeholder="e.g. Alex" value={name} onChange={(e) => setName(e.target.value)} />

      <FieldLabel htmlFor="pfGrade">Grade / Year</FieldLabel>
      <Select id="pfGrade" className="mb4" value={grade} onChange={(e) => setGrade(e.target.value)}>
        <option value="">Select your grade…</option>
        {GRADES.map((g) => <option key={g}>{g}</option>)}
      </Select>

      <FieldLabel htmlFor="pfGoal">Daily study goal</FieldLabel>
      <Select id="pfGoal" className="mb5" value={goal} onChange={(e) => setGoal(e.target.value)}>
        {GOALS.map((g) => <option key={g}>{g}</option>)}
      </Select>

      <Button variant="primary" fullWidth onClick={save}>Let's go! 🚀</Button>
    </Modal>
  );
}
