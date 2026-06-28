import type { AppStateShape } from '@/types';

export function exportBackup(state: AppStateShape) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'studyflow-backup.json';
  anchor.click();
  URL.revokeObjectURL(url);
}
