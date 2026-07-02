import { useState } from 'react';
import { Button } from '@/components/button/Button';
import { FieldLabel, TextInput, TextArea } from '@/components/InputFeild/InputField';
import { validateRequiredTitle } from '@/utils/validators';
import { useToast } from '@/components/layout/Toast/ToastContext';

interface NoteFormProps {
  onSave: (title: string, body: string, tag: string) => void;
  onCancel: () => void;
}

export function NoteForm({ onSave, onCancel }: NoteFormProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [body, setBody] = useState('');

  const submit = () => {
    const check = validateRequiredTitle(title, 'Note title');
    if (!check.valid) { showToast(check.message!); return; }
    onSave(title.trim(), body.trim(), tag.trim());
    setTitle(''); setTag(''); setBody('');
  };

  return (
    <div className="form-card">
      <div className="fg2">
        <div className="full">
          <FieldLabel htmlFor="nTitle">Title *</FieldLabel>
          <TextInput id="nTitle" placeholder="e.g. Newton's laws summary" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="nTag">Tag</FieldLabel>
          <TextInput id="nTag" placeholder="e.g. Physics" value={tag} onChange={(e) => setTag(e.target.value)} />
        </div>
        <div className="full">
          <FieldLabel htmlFor="nBody">Content</FieldLabel>
          <TextArea id="nBody" placeholder="Your note content…" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
      </div>
      <div className="fa">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={submit}>Save note</Button>
      </div>
    </div>
  );
}
