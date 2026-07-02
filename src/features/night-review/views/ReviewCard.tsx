import type { Review } from '@/types';
import { formatShortDate } from '@/utils/formatters';

const MOOD_EMOJI: Record<string, string> = { rough: '😞', okay: '😐', good: '🙂', great: '😄' };

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rcard">
      <div className="rhead">
        <div className="fr" style={{ gap: '.5rem' }}>
          <span>{MOOD_EMOJI[review.mood] || '😐'}</span>
          <span style={{ fontWeight: 600, fontSize: 'var(--tsm)' }}>
            {review.mood ? `${review.mood[0].toUpperCase()}${review.mood.slice(1)} day` : ''}
          </span>
        </div>
        <time style={{ fontSize: 'var(--txs)', color: 'var(--txf)' }}>{formatShortDate(review.date)}</time>
      </div>
      <div className="rbody">
        {review.wins && <><strong>Wins:</strong> {review.wins}<br /></>}
        {review.chal && <><strong>Challenges:</strong> {review.chal}<br /></>}
        {review.plan && <><strong>Tomorrow:</strong> {review.plan}</>}
      </div>
    </div>
  );
}
