import type { AppStateShape } from '@/types';

export function looksLikeBackup(value: unknown): value is AppStateShape {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return Boolean(candidate.settings && candidate.profile);
}
