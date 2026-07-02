import { useState } from 'react';
import { Button } from '@/components/button/Button';
import { TextInput } from '@/components/InputFeild/InputField';
import { useNotes } from '../hooks/useNotes';
import { NoteForm } from './NoteForm';
import { NoteCard } from './NoteCard';

export function NotesPage() {
  const { notes, totalCount, search, setSearch, addNote, deleteNote } = useNotes();
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="page">
      <div className="pg-hd">
        <h2>Notes Hub</h2>
        <p>Quick revision notes, searchable and tagged.</p>
      </div>
      <div className="card">
        <div className="ch">
          <h3>Your notes</h3>
          <div className="fr" style={{ gap: '.5rem' }}>
            <span className="badge bm">{totalCount} note{totalCount !== 1 ? 's' : ''}</span>
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>+ New note</Button>
          </div>
        </div>
        <div className="cb">
          <TextInput
            className="mb4"
            placeholder="Search by title or tag…"
            aria-label="Search notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {showForm && (
            <NoteForm
              onSave={(title, body, tag) => { addNote(title, body, tag); setShowForm(false); }}
              onCancel={() => setShowForm(false)}
            />
          )}
          <div className="note-g">
            {notes.length === 0 ? (
              <div className="empty" style={{ gridColumn: '1/-1' }}>
                <div className="e-ic">📝</div>
                <p>{search ? 'No notes match.' : 'No notes yet. Add your first one!'}</p>
              </div>
            ) : (
              notes.map((n) => <NoteCard key={n.id} note={n} onDelete={deleteNote} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
