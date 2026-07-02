import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Button } from '@/components/Button/Button';
import { FieldLabel, TextInput, Select } from '@/components/InputField/InputField';
import type { Subject, TaskTag } from '@/types';
import { validateRequiredTitle, validateTimeRange } from '@/utils/validators';
import { useToast } from '@/components/layout/Toast/ToastContext';
import type { NewTaskInput } from '../hooks/useTimetable';

const TAGS: TaskTag[] = ['Study', 'School', 'Fitness', 'Notes', 'Rest'];
const SUBJECTS: Subject[] = ['Math', 'Science', 'English', 'Coding', 'Revision', 'General'];

interface TaskFormProps {
  onSave: (input: NewTaskInput) => void;
  onCancel: () => void;
}

export function TaskForm({ onSave, onCancel }: TaskFormProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [tag, setTag] = useState<TaskTag>('Study');
  const [subject, setSubject] = useState<Subject>('Math');
  const [note, setNote] = useState('');

  const submit = () => {
    const titleCheck = validateRequiredTitle(title, 'Block title');
    if (!titleCheck.valid) { showToast(titleCheck.message!); return; }
    const timeCheck = validateTimeRange(start, end);
    if (!timeCheck.valid) { showToast(timeCheck.message!); return; }

    onSave({ title: title.trim(), start, end, tag, subject, note: note.trim() });
    setTitle(''); setStart(''); setEnd(''); setTag('Study'); setSubject('Math'); setNote('');
  };

  return (
    <div className="form-card">
      <div style={{ fontSize: 'var(--tsm)', fontWeight: 600, marginBottom: 'var(--s3)' }}>New block</div>
      <div className="fg2">
        <div className="full">
          <FieldLabel htmlFor="tTitle">Title *</FieldLabel>
          <TextInput
            id="tTitle"
            placeholder="e.g. Science revision"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') submit(); }}
          />
        </div>
        <div>
          <FieldLabel htmlFor="tStart">Start time</FieldLabel>
          <TextInput id="tStart" type="time" value={start} onChange={(e: ChangeEvent<HTMLInputElement>) => setStart(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="tEnd">End time</FieldLabel>
          <TextInput id="tEnd" type="time" value={end} onChange={(e: ChangeEvent<HTMLInputElement>) => setEnd(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="tTag">Category</FieldLabel>
          <Select id="tTag" value={tag} onChange={(e: ChangeEvent<HTMLSelectElement>) => setTag(e.target.value as TaskTag)}>
            {TAGS.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="tSubj">Subject</FieldLabel>
          <Select id="tSubj" value={subject} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSubject(e.target.value as Subject)}>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </div>
        <div className="full">
          <FieldLabel htmlFor="tNote">Note (optional)</FieldLabel>
          <TextInput id="tNote" placeholder="Any extra detail" value={note} onChange={(e: ChangeEvent<HTMLInputElement>) => setNote(e.target.value)} />
        </div>
      </div>
      <div className="fa">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={submit}>Save block</Button>
      </div>
    </div>
  );
}
