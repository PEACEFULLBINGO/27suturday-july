import { Button } from '@/components/button/Button';
import { FieldLabel, TextArea } from '@/components/InputFeild/InputField';
import type { Mood } from '@/types';
import { useNightReview } from '../hooks/useNightReview';
import { ReviewCard } from './ReviewCard';

const MOODS: { key: Mood; emoji: string; label: string }[] = [
  { key: 'rough', emoji: '😞', label: 'Rough day' },
  { key: 'okay', emoji: '😐', label: 'Okay day' },
  { key: 'good', emoji: '🙂', label: 'Good day' },
  { key: 'great', emoji: '😄', label: 'Great day' },
];

export function NightReviewPage() {
  const { mood, setMood, wins, setWins, chal, setChal, plan, setPlan, save, hasReviewedToday, reviews } = useNightReview();

  return (
    <section className="page">
      <div className="pg-hd">
        <h2>Night Review</h2>
        <p>Two-minute end-of-day reflection. Saved to your history.</p>
      </div>

      <div className="card mb5">
        <div className="ch">
          <h3>Tonight's reflection</h3>
          {hasReviewedToday && <span className="badge be">✓ Done today</span>}
        </div>
        <div className="cb">
          <FieldLabel style={{ marginBottom: 'var(--s3)' }}>How did today feel?</FieldLabel>
          <div className="mood-r" role="group" aria-label="Mood">
            {MOODS.map((m) => (
              <button
                key={m.key}
                className={`mbtn${mood === m.key ? ' active' : ''}`}
                aria-pressed={mood === m.key}
                aria-label={m.label}
                onClick={() => setMood(m.key)}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          <div className="fg2 mb4">
            <div className="full">
              <FieldLabel htmlFor="revWins">Wins today</FieldLabel>
              <TextArea id="revWins" placeholder="What went well?" value={wins} onChange={(e) => setWins(e.target.value)} />
            </div>
            <div className="full">
              <FieldLabel htmlFor="revChal">Challenges</FieldLabel>
              <TextArea id="revChal" placeholder="What was hard?" value={chal} onChange={(e) => setChal(e.target.value)} />
            </div>
            <div className="full">
              <FieldLabel htmlFor="revPlan">Tomorrow's priority</FieldLabel>
              <TextArea id="revPlan" placeholder="One focus for tomorrow" value={plan} onChange={(e) => setPlan(e.target.value)} />
            </div>
          </div>
          <div className="fa"><Button variant="primary" onClick={save}>Save review ✓</Button></div>
        </div>
      </div>

      <div className="card">
        <div className="ch"><h3>Review history</h3><span className="badge bm">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span></div>
        <div className="cb">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {reviews.length === 0 ? (
              <div className="empty">
                <div className="e-ic">🌙</div>
                <p>No reviews yet. Write your first one tonight!</p>
              </div>
            ) : (
              [...reviews].reverse().map((r) => <ReviewCard key={r.id} review={r} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
