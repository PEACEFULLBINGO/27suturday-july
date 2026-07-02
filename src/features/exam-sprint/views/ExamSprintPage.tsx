import { useState } from 'react';
import { Button } from '@/components/button/Button';
import { FieldLabel, TextInput } from '@/components/InputFeild/InputField';
import { useExam } from '../hooks/useExam';

export function ExamSprintPage() {
  const {
    name, setName, date, setDate, daysRemaining, saveExam,
    topics, topicsDone, topicsTotal, topicsPct,
    addTopic, toggleTopic, deleteTopic,
  } = useExam();
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const submitTopic = () => {
    if (!topicInput.trim()) return;
    addTopic(topicInput.trim());
    setTopicInput('');
    setShowTopicForm(false);
  };

  const cdownDisplay = daysRemaining === null ? '—' : daysRemaining > 0 ? String(daysRemaining) : daysRemaining === 0 ? 'Today!' : 'Past';

  return (
    <section className="page">
      <div className="pg-hd">
        <h2>Exam Sprint</h2>
        <p>Set your exam date, track countdown, check off your syllabus.</p>
      </div>

      <div className="card mb5">
        <div className="ch"><h3>Exam details</h3></div>
        <div className="cb">
          <div className="fg2 mb4">
            <div>
              <FieldLabel htmlFor="examName">Exam name</FieldLabel>
              <TextInput id="examName" placeholder="e.g. Physics Final" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="examDate">Date</FieldLabel>
              <TextInput id="examDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={saveExam}>Save exam</Button>

          <div className="fr" style={{ gap: 'var(--s6)', flexWrap: 'wrap', marginTop: 'var(--s5)' }}>
            <div>
              <div className="cdown">{cdownDisplay}</div>
              <small style={{ color: 'var(--txm)' }}>days remaining</small>
            </div>
            <div className="fg" style={{ minWidth: 200 }}>
              <div className="fr jb" style={{ fontSize: 'var(--txs)', color: 'var(--txm)', marginBottom: '.4rem' }}>
                <span>Syllabus progress</span><span>{topicsPct}%</span>
              </div>
              <div className="pbar"><div className="pfill" style={{ width: `${topicsPct}%` }} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="ch">
          <h3>Syllabus checklist</h3>
          <div className="fr" style={{ gap: '.5rem' }}>
            <span className="badge bm">{topicsTotal} topic{topicsTotal !== 1 ? 's' : ''} · {topicsDone} done</span>
            <Button variant="ghost" size="sm" onClick={() => setShowTopicForm(true)}>+ Topic</Button>
          </div>
        </div>
        <div className="cb">
          {showTopicForm && (
            <div className="form-card">
              <TextInput
                placeholder="e.g. Thermodynamics ch. 4"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitTopic(); }}
              />
              <div className="fa">
                <Button variant="ghost" size="sm" onClick={() => setShowTopicForm(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={submitTopic}>Add</Button>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
            {topics.length === 0 ? (
              <div className="empty">
                <div className="e-ic">📋</div>
                <p>No topics yet. Add syllabus items to track.</p>
              </div>
            ) : (
              topics.map((t) => (
                <div className={`trow${t.done ? ' done' : ''}`} key={t.id}>
                  <div className="fr" style={{ gap: '.7rem', minWidth: 0 }}>
                    <button
                      className={`tc${t.done ? ' done' : ''}`}
                      onClick={() => toggleTopic(t.id)}
                      aria-label={t.done ? 'Mark incomplete' : 'Mark done'}
                    >
                      {t.done ? '✓' : ''}
                    </button>
                    <span className="tname">{t.name}</span>
                  </div>
                  <button className="iBtn" onClick={() => deleteTopic(t.id)} aria-label="Delete">🗑️</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
