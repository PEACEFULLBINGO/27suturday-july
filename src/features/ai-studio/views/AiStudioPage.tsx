import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Button } from '@/components/button/Button';
import { TextArea } from '@/components/InputField/InputField';
import { useCurDay } from '@/store/DayContext';
import { usePerfectDay } from '@/features/perfect-day/hooks/usePerfectDay';
import { useChat } from '../hooks/useChat';

const TIPS = [
  { label: 'Perfect day tips', tip: 'What do I need to do for a perfect day today?' },
  { label: 'Study techniques', tip: 'Give me the best study techniques for memory retention' },
  { label: 'Exam stress', tip: 'How do I manage exam stress effectively?' },
  { label: 'Morning routine', tip: 'Build me a morning routine as a student' },
  { label: 'Beat procrastination', tip: 'How do I beat procrastination and improve focus?' },
  { label: 'Pomodoro plan', tip: 'Give me a Pomodoro study plan for today' },
];

export function AiStudioPage() {
  const { curDay } = useCurDay();
  const { status } = usePerfectDay({ curDay });
  const { messages, pending, error, send, clear } = useChat(curDay, status);
  const [draft, setDraft] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages, pending]);

  const submit = () => {
    if (!draft.trim()) return;
    send(draft);
    setDraft('');
  };

  return (
    <section className="page">
      <div className="pg-hd">
        <h2>AI Studio</h2>
        <p>Chat with Claude. Responses are kept short to conserve your API tokens.</p>
      </div>
      <div className="card">
        <div className="ch">
          <h3>Claude Study Coach</h3>
          <div className="fr" style={{ gap: '.5rem' }}>
            <span className="badge bv">Live</span>
            <Button variant="ghost" size="sm" title="Clear chat history" onClick={clear}>🗑️ Clear</Button>
          </div>
        </div>
        <div className="cb">
          <div className="tip-chips">
            {TIPS.map((t) => (
              <button key={t.label} className="tc2" onClick={() => setDraft(t.tip)}>{t.label}</button>
            ))}
          </div>
          <div className="chat-shell">
            <div className="chat-thread" ref={threadRef} role="log" aria-live="polite">
              {messages.length === 0 && (
                <div className="cm assistant">
                  👋 Hey! I'm your StudyFlow AI coach. I keep answers short to save API tokens.
                  <br /><br />
                  Try asking: <em>"What do I need for a perfect day?"</em> or tap a quick tip above.
                  <br /><br />
                  <kbd className="kbd">/</kbd> anytime to open this chat.
                </div>
              )}
              {messages.map((m, i) => (
                <div className={`cm ${m.role}`} key={i}>{m.content}</div>
              ))}
              {pending && (
                <div className="cm assistant"><span className="dots"><span /><span /><span /></span></div>
              )}
              {error && <div className="cm err">{error}</div>}
            </div>
            <div className="ci-r">
              <TextArea
                className="fg"
                rows={2}
                placeholder="Ask about study strategy, schedule, or perfect day tips… (Enter to send)"
                aria-label="Chat input"
                value={draft}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDraft(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
                disabled={pending}
              />
              <Button variant="primary" aria-label="Send message" onClick={submit} disabled={pending}>Send</Button>
            </div>
          </div>
          <div style={{ marginTop: 'var(--s3)', fontSize: 'var(--txs)', color: 'var(--txf)' }}>
            💡 Tip: Responses are capped at ~300 tokens to save API usage. Ask one clear question at a time.
          </div>
        </div>
      </div>
    </section>
  );
}
