export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/** Most of the app's "add" forms require a non-empty, reasonably short title. */
export function validateRequiredTitle(value: string, label = 'Title'): ValidationResult {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, message: `${label} is required.` };
  if (trimmed.length > 120) return { valid: false, message: `${label} is too long (max 120 characters).` };
  return { valid: true };
}

/** Validates a "HH:MM" start/end pair, when both are provided. */
export function validateTimeRange(start: string, end: string): ValidationResult {
  if (!start || !end) return { valid: true }; // either may be left blank
  if (start >= end) return { valid: false, message: 'End time must be after start time.' };
  return { valid: true };
}

/** Confirms an uploaded backup JSON looks like a StudyFlow Orbit export before merging it in. */
export function looksLikeBackup(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return 'tasks' in d || 'notes' in d;
}
