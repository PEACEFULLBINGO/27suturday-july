import type { Task } from '@/types';
import { formatTime12h } from '@/utils/formatters';

const CAT_TI_CLASS: Record<Task['tag'], string> = {
  Study: 'cat-study', School: 'cat-school', Fitness: 'cat-fitness', Rest: 'cat-rest', Notes: 'cat-notes',
};
const CAT_BADGE: Record<Task['tag'], string> = {
  Study: 'bv', School: 'bc', Fitness: 'be', Rest: 'br', Notes: 'ba',
};

interface TaskItemProps {
  task: Task;
  editable?: boolean;
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskItem({ task, editable = true, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <div className={`ti ${CAT_TI_CLASS[task.tag]}`}>
      <button
        className={`tc${task.done ? ' done' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.done ? '✓' : ''}
      </button>
      <div className="tbdy">
        <div className={`ttl${task.done ? ' done' : ''}`}>{task.title}</div>
        <div className="tmeta">
          {task.start && (
            <span className="ttime">{formatTime12h(task.start)}{task.end ? ` – ${formatTime12h(task.end)}` : ''}</span>
          )}
          <span className={`badge ${CAT_BADGE[task.tag]}`}>{task.tag}</span>
          {task.tag === 'Study' && task.subject && <span className="badge bm">{task.subject}</span>}
        </div>
        {task.note && <div className="tnote">{task.note}</div>}
      </div>
      {editable && (
        <div className="tact">
          <button className="iBtn" onClick={() => onEdit?.(task.id)} aria-label="Edit block" title="Edit">✏️</button>
          <button className="iBtn" onClick={() => onDelete?.(task.id)} aria-label="Delete block" title="Delete">🗑️</button>
        </div>
      )}
    </div>
  );
}
