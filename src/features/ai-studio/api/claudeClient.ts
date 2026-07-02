import type { ChatMessage } from '@/types';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 300;

/**
 * IMPORTANT — read before wiring this up to a real deployment:
 *
 * The original single-file build called `api.anthropic.com` directly from
 * the browser with no API key, because Claude.ai's Artifacts sandbox
 * injects auth for you. Outside that sandbox there is no key to inject —
 * and an API key can never be safely shipped to client-side JS regardless
 * (anyone can read it out of the network tab). So this client expects a
 * `VITE_AI_PROXY_URL` env var pointing at *your own* backend endpoint,
 * which holds the real Anthropic API key server-side and forwards the
 * request. A minimal proxy is just:
 *
 *   POST /api/chat  ->  forwards { system, messages } to
 *   https://api.anthropic.com/v1/messages with your server-side key,
 *   returns the JSON response untouched.
 *
 * If `VITE_AI_PROXY_URL` isn't set, this falls back to calling Anthropic
 * directly — which will fail outside the sandbox — purely so the app still
 * runs end-to-end in local dev without extra setup.
 */
const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || 'https://api.anthropic.com/v1/messages';

export async function sendMessage(messages: ChatMessage[], system: string): Promise<string> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system, messages }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed (${response.status})`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== 'string') throw new Error('Unexpected AI response shape');
  return text;
}
