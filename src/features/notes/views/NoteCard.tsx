import type { Note } from '@/types';
import { formatShortDate } from '@/utils/formatters';

export function NoteCard({ note, onDelete }: { note: Note; onDelete: (id: string) => void }) {
  return (
    <div className="nc">
      <h4>{note.title}</h4>
      <p className="np">{note.body}</p>
      <div className="nft">
        {note.tag ? <span className="ntag">{note.tag}</span> : <span />}
        <div className="fr" style={{ gap: '.4rem' }}>
          <span className="ndate">{formatShortDate(note.date)}</span>
          <button className="iBtn" onClick={() => onDelete(note.id)} aria-label="Delete note">🗑️</button>
        </div>
      </div>
    </div>
  );
}
