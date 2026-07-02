import { useEffect, useState } from 'react';
import { Modal } from '@/components/layout/Modal/Modal';
import { Button } from '@/components/button/Button';
import { FieldLabel, TextInput, Select } from '@/components/InputFeild/InputField';
import type { Subject, Task, TaskTag } from '@/types';
import { validateRequiredTitle, validateTimeRange } from '@/utils/validators';
import { useToast } from '@/components/layout/Toast/ToastContext';

const TAGS: TaskTag[] = ['Study', 'School', 'Fitness', 'Notes', 'Rest'];
const SUBJECTS: Subject[] = ['Math', 'Science', 'English', 'Coding', 'Revision', 'General'];

interface EditTaskModalProps {
  task: Task | null;
  onSave: (id: string, patch: Partial<Task>) => void;
  onClose: () => void;
}

export function EditTaskModal({ task, onSave, onClose }: EditTaskModalProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [tag, setTag] = useState<TaskTag>('Study');
  const [subject, setSubject] = useState<Subject>('Math');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title); setStart(task.start); setEnd(task.end);
      setTag(task.tag); setSubject(task.subject); setNote(task.note);
    }
  }, [task]);

  const submit = () => {
    if (!task) return;
    const titleCheck = validateRequiredTitle(title, 'Title');
    if (!titleCheck.valid) { showToast(titleCheck.message!); return; }
    const timeCheck = validateTimeRange(start, end);
    if (!timeCheck.valid) { showToast(timeCheck.message!); return; }
    onSave(task.id, { title: title.trim(), start, end, tag, subject, note: note.trim() });
  };

  return (
    <Modal open={!!task} onClose={onClose} className="edit-modal" labelledBy="edit-block-title">
      <h3 id="edit-block-title" style={{ marginBottom: 'var(--s5)' }}>Edit Block</h3>
      <div className="fg2">
        <div className="full">
          <FieldLabel htmlFor="etTitle">Title *</FieldLabel>
          <TextInput
            id="etTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          />
        </div>
        <div>
          <FieldLabel htmlFor="etStart">Start</FieldLabel>
          <TextInput id="etStart" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="etEnd">End</FieldLabel>
          <TextInput id="etEnd" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="etTag">Category</FieldLabel>
          <Select id="etTag" value={tag} onChange={(e) => setTag(e.target.value as TaskTag)}>
            {TAGS.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </div>
        <div>
          <FieldLabel htmlFor="etSubj">Subject</FieldLabel>
          <Select id="etSubj" value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </div>
        <div className="full">
          <FieldLabel htmlFor="etNote">Note</FieldLabel>
          <TextInput id="etNote" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <div className="fa">
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={submit}>Save changes</Button>
      </div>
    </Modal>
  );
}
