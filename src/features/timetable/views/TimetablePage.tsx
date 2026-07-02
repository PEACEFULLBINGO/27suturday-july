import { useState } from 'react';
import { Button } from '@/components/button/Button';
import { TextInput } from '@/components/InputField/InputField';
import { useCurDay } from '@/store/DayContext';
import { useTimetable } from '../hooks/useTimetable';
import { DayTabs } from './DayTabs';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { EditTaskModal } from './EditTaskModal';
import type { Task } from '@/types';

export function TimetablePage() {
  const { curDay, setCurDay } = useCurDay();
  const { tasks, totalCount, filter, setFilter, addTask, updateTask, toggleTask, deleteTask } = useTimetable(curDay);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  return (
    <section className="page">
      <div className="pg-hd">
        <h2>Timetable Planner</h2>
        <p>Build your weekly schedule. Changes save instantly.</p>
      </div>

      <DayTabs curDay={curDay} onSelect={setCurDay} />

      <div className="card">
        <div className="ch">
          <h3>{curDay}</h3>
          <div className="fr" style={{ gap: '.5rem' }}>
            <span className="badge bm">{totalCount} block{totalCount !== 1 ? 's' : ''}</span>
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>+ Add block</Button>
          </div>
        </div>
        <div className="cb">
          {showForm && (
            <TaskForm
              onSave={(input) => { addTask(input); setShowForm(false); }}
              onCancel={() => setShowForm(false)}
            />
          )}

          <div className="task-search">
            <TextInput
              placeholder="Filter blocks by title or category…"
              aria-label="Filter tasks"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {filter && <span className="ts-count">{tasks.length} match{tasks.length !== 1 ? 'es' : ''}</span>}
          </div>

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty">
                <div className="e-ic">🗓️</div>
                <p>{filter ? 'No blocks match your search.' : `No blocks for ${curDay}. Click "+ Add block" to start.`}</p>
              </div>
            ) : (
              tasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggle={toggleTask}
                  onEdit={() => setEditing(t)}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <EditTaskModal
        task={editing}
        onClose={() => setEditing(null)}
        onSave={(id, patch) => { updateTask(id, patch); setEditing(null); }}
      />
    </section>
  );
}
