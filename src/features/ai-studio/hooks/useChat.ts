import { useCallback, useState } from 'react';
import type { ChatMessage, PdStatus, Weekday } from '@/types';
import { useAppStore } from '@/store/AppStore';
import { sendMessage } from '../api/claudeClient';
import { buildSystemPrompt } from './useSystemPrompt';

export function useChat(curDay: Weekday, status: PdStatus) {
  const { state, dispatch } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>(state.chat);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback((next: ChatMessage[]) => {
    setMessages(next);
    dispatch({ type: 'set_chat', payload: next.slice(-20) });
  }, [dispatch]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const withUser = [...messages, { role: 'user', content: trimmed } as ChatMessage];
    persist(withUser);
    setPending(true);
    setError(null);

    try {
      const system = buildSystemPrompt(state, curDay, status);
      const reply = await sendMessage(withUser.slice(-10), system);
      persist([...withUser, { role: 'assistant', content: reply }]);
    } catch {
      setError('⚠️ Could not reach Claude. Check your connection — or, if you deployed this app yourself, that VITE_AI_PROXY_URL is configured.');
    } finally {
      setPending(false);
    }
  }, [messages, pending, persist, state, curDay, status]);

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  return { messages, pending, error, send, clear };
}
