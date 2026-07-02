import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/button/Button';
import { TextArea } from '@/components/InputFeild/InputField';
import { useCurDay } from '@/store/DayContext';
import { useAppStore } from '@/store/AppStore';
import { usePerfectDay } from '@/features/perfect-day/hooks/usePerfectDay';
import { PD_CRITERIA } from '@/types';
import { sendMessage } from '../api/claudeClient';
import { buildSystemPrompt } from '../hooks/useSystemPrompt';

export function QuickAiWidget() {
  const { state } = useAppStore();
  const { curDay } = useCurDay();
  const { status } = usePerfectDay({ curDay });
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('Ask Claude to modify your schedule or get a study tip.');
  const [busy, setBusy] = useState(false);

  const run = async (text: string) => {
    setBusy(true);
    try {
      const system = buildSystemPrompt(state, curDay, status);
      setResponse(await sendMessage([{ role: 'user', content: text }], system));
    } catch {
      setResponse('⚠️ Could not reach Claude. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const apply = () => {
    if (!prompt.trim()) return;
    run(`${prompt.trim()}\n\nGive a specific actionable response in under 120 words.`);
  };

  const quickTip = () => {
    const missing = PD_CRITERIA.filter((c) => !status[c.key]);
    const text = missing.length
      ? `I haven't done: ${missing.map((c) => c.label).join(', ')}. Give me a 2-sentence tip to complete my perfect day right now.`
      : 'Give me a quick motivational tip to keep my study streak. Under 60 words.';
    run(text);
  };

  return (
    <div className="card">
      <div className="ch"><h3>Quick AI</h3><span className="badge bv">Live · Claude</span></div>
      <div className="cb stack g4x">
        <TextArea
          rows={3}
          placeholder='Ask Claude to adjust your schedule, e.g. "Add a 20-min break at 4 PM" — or click Quick tip'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); apply(); } }}
        />
        <div className="fr wrap" style={{ gap: '.5rem' }}>
          <Button variant="primary" size="sm" className="fg" onClick={apply} disabled={busy}>▶ Apply</Button>
          <Button variant="ghost" size="sm" onClick={quickTip} disabled={busy}>💡 Quick tip</Button>
          <Link to="/ai-studio" className="btn btn-g btn-sm">Full chat →</Link>
        </div>
        <div style={{ background: 'var(--sf2)', border: '1px solid var(--bd)', borderRadius: 'var(--rmd)', padding: 'var(--s3)' }}>
          <div style={{ fontSize: 'var(--txs)', color: 'var(--txm)', lineHeight: 1.6, minHeight: 36 }}>
            {busy ? <span className="dots"><span /><span /><span /></span> : response}
          </div>
        </div>
      </div>
    </div>
  );
}
